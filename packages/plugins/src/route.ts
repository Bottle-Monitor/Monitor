import {
    CATEGORY,
    EventBusReturn,
    InitOptions,
    USER
} from '@bottle-monitor/types'

export const RoutePlugin = ({
    eventBus,
    initOptions
}: {
    eventBus: EventBusReturn
    initOptions: InitOptions
}) => {
    const captureHistoryRoute = () => {
        // 重写 pushState
        const rowPush = history.pushState
        history.pushState = (...args) => {
            rowPush.apply(history, args)
            eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {
                type: USER.HISTORY_ROUTE,
                method: 'pushState',
                url: location.href
            })
        }
        // 重写 replaceState
        const rowReplace = history.replaceState
        history.replaceState = (...args) => {
            rowReplace.apply(history, args)
            eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {
                type: USER.HASH_ROUTE,
                method: 'replaceState',
                url: location.href
            })
        }

        window.addEventListener('popstate', (e: PopStateEvent) => {
            eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {
                type: USER.HISTORY_ROUTE,
                method: 'popstate',
                state: e.state
            })
        })
    }

    /**
     * ISSUE:
     * 1. hash 改变了 history 也会监听到
     * 2. 跳转到别的页面，整个界面刷新后不知道收到消息没
     * 3. 不知道从哪里跳到哪里去了
     *
     * 1. 对于 errorPlugin, 有些静默选项未生效
     */
    const captureHashRoute = () => {
        window.addEventListener('hashchange', (e: HashChangeEvent) => {
            eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {
                type: USER.HASH_ROUTE,
                from: e.oldURL,
                to: e.newURL
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
