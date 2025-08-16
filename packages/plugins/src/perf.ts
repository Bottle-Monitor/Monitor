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

    // 首次内容绘制
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

    window.addEventListener('load', () => {
        lastLCP && emitLCP(lastLCP)
        getResourceCacheHitRate()
    })

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

    // 默认只计算静态数据，可选默认动态，支持自定义导入 initiatorType
    const getResourceCacheHitRate = (
        dynamic: boolean = false,
        customResourceTypes: string[] = []
    ) => {
        // Use the buffered option to access entries from before the observer creation.
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
            entryName: 'resource', // entryType
            value: resources.length ? cached.length / resources.length : 0
        })
    }

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
        getWebVitals(collectTarget)
    }

    initPlugin()
}
