import { CATEGORY, EventBusReturn, USER } from '@bottle-monitor/types'
import { InitOptions } from '@bottle-monitor/types'
import { getDate } from '@bottle-monitor/utils'
import { UAParser } from 'ua-parser-js'

export const UserPlugin = ({
    eventBus,
    initOptions
}: {
    eventBus: EventBusReturn
    initOptions: InitOptions
}) => {
    let currentURL = location.href

    const emitDeviceInfo = () => {
        const uaMessage = UAParser()
        const deviceInfo = {
            browser: uaMessage.browser.name,
            browserVersion: uaMessage.browser.version,
            os: uaMessage.os.name,
            osVersion: uaMessage.os.version,
            ua: uaMessage.ua,
            device: uaMessage.device
        }

        eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {
            category: CATEGORY.USER,
            type: USER.DEVICE,
            emitTime: getDate(new Date()),
            deviceInfo
        })
    }

    const captureHistoryRoute = () => {
        // 重写 pushState
        const rowPush = history.pushState
        history.pushState = (...args) => {
            const newURL = location.href
            rowPush.apply(history, args)
            eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {
                category: CATEGORY.USER,
                type: USER.HISTORY_ROUTE,
                emitTime: getDate(new Date()),
                method: 'pushState',
                from: currentURL,
                to: newURL
            })
            currentURL = newURL
        }
        // 重写 replaceState
        const rowReplace = history.replaceState
        history.replaceState = (...args) => {
            const newURL = location.href
            rowReplace.apply(history, args)
            eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {
                category: CATEGORY.USER,
                type: USER.HASH_ROUTE,
                emitTime: getDate(new Date()),
                method: 'replaceState',
                from: currentURL,
                to: newURL
            })
            currentURL = newURL
        }

        window.addEventListener('popstate', (e: PopStateEvent) => {
            eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {
                category: CATEGORY.USER,
                type: USER.HISTORY_ROUTE,
                emitTime: getDate(new Date()),
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
                category: CATEGORY.USER,
                type: USER.HASH_ROUTE,
                emitTime: getDate(new Date()),
                from: e.oldURL,
                to: e.newURL
            })
        })
    }

    const initPlugin = () => {
        const { hash, history } = initOptions.silent || {}

        !hash && captureHashRoute()
        !history && captureHistoryRoute()
        emitDeviceInfo()
    }

    initPlugin()
}
