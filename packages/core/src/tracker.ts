import {
    BreadcrumbType,
    EventBusReturn,
    InitOptions,
    TransportData,
    TransportReturn
} from '@bottle-monitor/types'
import EventBus from './eventBus'
import Transport from './transport'
import {
    ErrorPlugin,
    WebVitalsPlugin,
    UserPlugin
} from '@bottle-monitor/plugins'

/**
 * 插件注册
 */
const Tracker = () => {
    // 初始化事件总线
    let eventBus: EventBusReturn | null = null
    // 初始化发送器
    let transport: TransportReturn | null = null

    const handleTransport = (
        breadcrumbType: BreadcrumbType,
        data: TransportData
    ) => {
        console.log('transport recived!')
        transport?.send(breadcrumbType, data)
    }

    const init = (initOptions: InitOptions) => {
        eventBus = EventBus()
        const { dsnURL, beforeTransport, beforePushBreadcrumb, breadcrumbs } =
            initOptions
        transport = Transport(
            dsnURL,
            beforeTransport,
            beforePushBreadcrumb
        ) as TransportReturn
        transport.initBreadcrumb(breadcrumbs || [])
        eventBus.on('bottle-monitor:transport', handleTransport)

        // TODO: 设置采集率，只上报部分用户的数据

        // 初始化插件
        ErrorPlugin({
            eventBus,
            initOptions
        })

        WebVitalsPlugin({
            eventBus,
            initOptions
        })

        UserPlugin({
            eventBus,
            initOptions
        })

        const silent = initOptions.silent
    }

    return {
        init,
        get transport() {
            return transport
        },
        get eventBus() {
            return eventBus
        }
    }
}

export default Tracker
