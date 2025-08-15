import {
    CATEGORY,
    EventBusReturn,
    InitOptions,
    VITALS
} from '@bottle-monitor/types'

export const WebVitalsPlugin = ({
    eventBus,
    initOptions
}: {
    eventBus: EventBusReturn
    initOptions: InitOptions
}) => {

    const getWebVitals = () => {
        const observer = new PerformanceObserver((entryList) => {
            entryList.getEntries().forEach(entry => {
                console.log(`type: ${entry.entryType}`, entry);
            })
        })

        observer.observe({
            entryTypes: ['elemnt', 'event', 'first-input', 'largest-contentful-paint', 'layout-shift', 'long-animation-frame', 'longtask', 'mark', 'resource', 'paint']
        })
    }

    const initPlugin = () => {
        const { webVitals } = initOptions.silent || {}

        if (webVitals) return
        // getWebVitals()
    }

    initPlugin()
}
