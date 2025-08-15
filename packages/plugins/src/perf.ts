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
            entryList.getEntries().forEach((entry: any) => {
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
    })

    const getWebVitals = (collectTarget: string[]) => {
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
