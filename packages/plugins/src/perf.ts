import {
    CATEGORY,
    EventBusReturn,
    InitOptions,
    LayoutShift,
    VITALS
} from '@bottle-monitor/types'

export const WebVitalsPlugin = ({
    eventBus,
    initOptions
}: {
    eventBus: EventBusReturn
    initOptions: InitOptions
}) => {
    let lastLCP: PerformanceEntry | null = null
    const DEFAULT_STATIC_TYPES = ['script', 'link', 'img', 'css']
    const DEFAULT_DYNAMIC_TYPES = ['beacon', 'fetch', 'xmlhttprequest']

    /**
     * CORE WEB_VITALS
     */
    const emitFCP = (entry: PerformanceEntry) => {
        if (entry.name === 'first-paint') return
        eventBus.emit('bottle-monitor:transport', CATEGORY.VITALS, {
            category: CATEGORY.VITALS,
            type: VITALS.FCP,
            entryName: 'first-contentful-paint',
            entry
        })
    }

    const emitLCP = (entry: PerformanceEntry) => {
        eventBus.emit('bottle-monitor:transport', CATEGORY.VITALS, {
            category: CATEGORY.VITALS,
            type: VITALS.LCP,
            entryName: 'largest-contentful-paint',
            entry
        })
    }

    const emitFID = (entry: PerformanceEntry) => {
        eventBus.emit('bottle-monitor:transport', CATEGORY.VITALS, {
            category: CATEGORY.VITALS,
            type: VITALS.FID,
            entryName: 'first-input',
            entry
        })
    }

    const emitCLS = (entry: PerformanceEntry) => {
        eventBus.emit('bottle-monitor:transport', CATEGORY.VITALS, {
            category: CATEGORY.VITALS,
            type: VITALS.CLS,
            entryName: 'layout-shift',
            entry
        })
    }

    const emitCoreVitals = (entry: PerformanceEntry) => {
        switch (entry.entryType) {
            case 'paint':
                if (entry.name === 'first-contentful-paint') emitFCP(entry)
                break
            case 'largest-contentful-paint':
                lastLCP = entry
                break
            case 'layout-shift':
                if (!(entry as LayoutShift).hadRecentInput) emitCLS(entry)
                break
            case 'first-input':
                emitFID(entry)
                break
        }
    }

    // 核心指标包含 FCP、LCP、CLS 和 FID
    const getCoreWebVitals = (entryTypes: string[]) => {
        const observer = new PerformanceObserver((entryList) => {
            entryList.getEntries().forEach((entry: PerformanceEntry) => {
                emitCoreVitals(entry)
            })
        })

        observer.observe({
            entryTypes,
            buffered: true
        })
    }

    /**
     * TTFB
     */
    // 用户发起请求 (requestStart) 到 收到第一个字节响应 (responseStart) 之间的时间
    // 兼容 SPA
    const getTTFB = () => {
        const observer = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries() as PerformanceNavigationTiming[]) {
                const {
                    requestStart,
                    responseStart,
                    domInteractive,
                    loadEventEnd
                } = entry
                const value = responseStart - requestStart
                eventBus.emit('bottle-monitor:transport', CATEGORY.VITALS, {
                    category: CATEGORY.VITALS,
                    type: VITALS.TTFB,
                    entryName: 'navigation', // entryType
                    value,
                    extra: {
                        requestStart,
                        responseStart,
                        domInteractive,
                        loadEventEnd
                    }
                })
            }
        })

        observer.observe({ type: 'navigation', buffered: true })
    }

    /**
     * RESOURCE
     */
    const isCached = (r: PerformanceResourceTiming) => {
        // from disk/memory cache
        if (r.transferSize === 0 && r.encodedBodySize > 0) return true

        // 跨域且未设置 Timing-Allow-Origin 的, transferSize = 0, encodedBodySize = 0

        // 304 Not Modified
        if (r.transferSize > 0 && r.encodedBodySize > 0) {
            return r.transferSize < r.encodedBodySize
        }

        return false
    }

    const getResourceCacheHitRate = (
        dynamic: boolean = false,
        customResourceTypes: string[] = []
    ) => {
        const resources = performance.getEntriesByType(
            'resource'
        ) as PerformanceResourceTiming[]

        const resourceTypes = [
            ...DEFAULT_STATIC_TYPES,
            ...(dynamic ? DEFAULT_DYNAMIC_TYPES : []),
            ...customResourceTypes
        ]
        const cached = resources.filter(
            (r) => resourceTypes.includes(r.initiatorType) && isCached(r)
        )

        eventBus.emit('bottle-monitor:transport', CATEGORY.VITALS, {
            category: CATEGORY.VITALS,
            type: VITALS.Resource,
            entryName: 'resource',
            value: resources.length ? cached.length / resources.length : 0
        })
    }

    /**
     * INP
     */
    const getINP = () => {}

    /**
     * FPS
     */
    const getFPS = () => {
        let lastTime = performance.now()
        let frameCount = 0
        console.log('lastTime: ', lastTime)

        const loop = (now: number) => {
            frameCount++

            if (now - lastTime >= 1000) {
                const FPS = Math.round((frameCount * 1000) / (now - lastTime))

                eventBus.emit('bottle-monitor:transport', CATEGORY.VITALS, {
                    category: CATEGORY.VITALS,
                    type: VITALS.FPS,
                    entryName: 'FPS',
                    value: FPS,
                    timestamp: performance.now()
                })

                console.log('FPS: ', FPS)

                frameCount = 0
                lastTime = now
            }

            requestAnimationFrame(loop)
        }

        requestAnimationFrame(loop)
    }

    /**
     * FSP
     */
    const getFSP = () => {}

    /**
     * LONGTASK
     */
    const getLongTask = () => {
        const observer = new PerformanceObserver((entryList) => {
            entryList.getEntries().forEach((entry) => {
                eventBus.emit('bottle-monitor:transport', CATEGORY.VITALS, {
                    category: CATEGORY.VITALS,
                    type: VITALS.LONGTASK,
                    entryName: 'longtask',
                    entry
                })
            })
        })

        observer.observe({
            type: 'longtask',
            buffered: true
        })
    }

    window.addEventListener('load', () => {
        lastLCP && emitLCP(lastLCP)
        getResourceCacheHitRate()
    })

    const getWebVitals = (collectTarget: string[]) => {
        getTTFB()
        getCoreWebVitals([
            'paint',
            'largest-contentful-paint',
            'first-input',
            'layout-shift'
        ])
    }

    const initPlugin = () => {
        const collectTarget: string[] = []
        // getWebVitals(collectTarget)
        // getLongTask()
        // getFPS()
    }

    initPlugin()
}
