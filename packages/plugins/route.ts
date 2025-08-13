import {
    CATEGORY,
    EventBusReturn,
    InitOptions,
    USER
} from '@bottle-monitor/types'

const RoutePlugin = ({
    eventBus,
    initOptions
}: {
    eventBus: EventBusReturn
    initOptions: InitOptions
}) => {
    const handleNormalHistory = () => {
        // 重写 pushState
        const rowPush = history.pushState
        history.pushState = (...args) => {
            rowPush.apply(this, args)
            eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {
                type: USER.HISTORY_ROUTE,
                url: location.href
            })
        }
        // 重写 replaceState
        const rowReplace = history.replaceState
        history.replaceState = (...args) => {
            rowReplace.apply(this, args)
            eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {
                type: USER.HASH_ROUTE,
                url: location.href
            })
        }
    }

    const handleSPAHistory = () => {
        window.addEventListener('popstate', () => {
            eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {
                type: USER.HISTORY_ROUTE,
                url: location.href
            })
        })
    }

    const captureHistoryRoute = () => {
        handleNormalHistory()
        handleSPAHistory()
    }

    const captureHashRoute = () => {
        window.addEventListener('hashchange', () => {
            eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {
                type: USER.HASH_ROUTE,
                url: location.href
            })
        })
    }

    const initPlugin = () => {
        const { hash, history } = initOptions.silent || {}

        !hash && captureHashRoute()
        !history && captureHistoryRoute()
    }

    initPlugin()
}

export default RoutePlugin
