import {
    CATEGORY,
    EventBusReturn,
    InitOptions,
    VITALS
} from '@bottle-monitor/types'

const WebVitalsPlugin = ({
    eventBus,
    initOptions
}: {
    eventBus: EventBusReturn
    initOptions: InitOptions
}) => {
    const getFSP = () => {
        let lastRenderTime = 0
        const visibilityCache = new WeakMap<Node, boolean>()

        const isVisible = (node: Node) => {
            if (node.nodeType !== Node.ELEMENT_NODE) return false

            if (visibilityCache.has(node)) {
                return visibilityCache.get(node)!
            }

            const el = node as Element

            const style = getComputedStyle(el)
            if (style.display === 'none' || style.visibility === 'hidden') {
                visibilityCache.set(node, false)
                return false
            }

            const rect = el.getBoundingClientRect()
            const viewport = {
                width: window.innerWidth,
                height: window.innerHeight
            }
            const isInViewport =
                rect.top < viewport.height && rect.left < viewport.width
            visibilityCache.set(node, isInViewport)
            return isInViewport
        }

        const observer = new MutationObserver((entries) => {
            entries.forEach((entry) => {
                if (isVisible(entry.target)) {
                    lastRenderTime = performance.now()
                }
            })
        })

        const onComplete = () => {
            observer.disconnect()
            const FSP = performance.timeOrigin - lastRenderTime
            // TODO: 数据格式统一为  category 大类 + 具体条目
            eventBus.emit('bottle-monitor:transport', CATEGORY.VITALS, {
                type: VITALS.WEBVITALS,
                value: FSP
            })
        }

        if (document.readyState === 'complete') {
            onComplete()
        } else {
            window.addEventListener('load', onComplete, { once: true })
        }

        observer.observe(document, {
            childList: true, // 监听子节点增减
            subtree: true, // 监听所有后代节点
            attributes: true, // 监听元素属性值变换，如骨架屏
            characterData: true // 监听文本节点内容变化，如加载中变为文本
        })
    }

    const getCLS = () => {}

    const getFID = () => {}

    const getLongTask = () => {}

    const initPlugin = () => {
        const { webVitals } = initOptions.silent || {}

        if (webVitals) return

        getFSP()
    }

    // TODO: 更细粒度的指标监听
    const METRIC_FN_MAP = {
        CLS: getCLS,
        FID: getFID,
        // FCP: getFCP,
        // LCP: getLCP,
        FSP: getFSP
        // TTFB: getTTFB,
        // FPS: getFPS
    }

    type MetricName = keyof typeof METRIC_FN_MAP

    const collectMetrics = (
        onReport: (metric: Record<string, any>) => void,
        options: Partial<Record<MetricName, boolean>>
    ) => {
        for (const key in options) {
            const isEnabled = options[key as MetricName]
            const fn = METRIC_FN_MAP[key as MetricName]

            if (isEnabled && typeof fn === 'function') {
                // fn(onReport)
            }
        }
    }

    initPlugin()
}

export default WebVitalsPlugin
