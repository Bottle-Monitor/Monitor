import {
    BreadcrumbType,
    InitOptions,
    TransportData
} from '@bottle-monitor/types'
import EventBus, { EventBusReturn } from './eventBus'
import Transport, { TransportReturn } from './transport'

/**
 * 插件注册
 */
const Tracker = () => {
    // 初始化事件总线
    let eventBus: EventBusReturn | null = null
    let transport: TransportReturn | null = null

    const handleTransport = (
        breadcrumbType: BreadcrumbType,
        data: TransportData
    ) => {
        transport?.send(breadcrumbType, data)
    }

    const init = (initOptions: InitOptions) => {
        eventBus = EventBus()
        transport = Transport(initOptions.dsnURL) as TransportReturn
        transport.initBreadcrumb(initOptions.breadcrumb || [])
        eventBus.on('bottle-monitor:transport', handleTransport)
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