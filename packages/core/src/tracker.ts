import type {
  AbnormalOptions,
  BreadcrumbOptions,
  BreadcrumbType,
  EventBusReturn,
  InitOptions,
  Plugins,
  TransportData,
  TransportReturn,
  UserOptions,
  VitalsOptions,
} from '@bottle-monitor/types'
import {
  ErrorPlugin,
  UserPlugin,
  WebVitalsPlugin,
} from '@bottle-monitor/plugins'
import EventBus from './eventBus'
import Transport from './transport'

/**
 * @description 插件注册
 */
function Tracker() {
  // 初始化事件总线
  let eventBus: EventBusReturn | null = null
  // 初始化发送器
  let transport: TransportReturn | null = null

  const handleTransport = (
    breadcrumbType: BreadcrumbType,
    data: TransportData,
  ) => {
    console.log('transport recived!')
    transport?.send(breadcrumbType, data)
    navigator.serviceWorker.controller?.postMessage('hello')
  }

  const registerServiceWorker = async () => {
    if ('ServiceWorker' in window) {
      // 方案弃置
      // const swURL = new URL('./sw.js', import.meta.url).href
      const swURL = './sw.js'
      try {
        const registration = await navigator.serviceWorker.register(
          swURL,
        )
        if (registration.installing) {
          console.log('installed!')
        }
        else if (registration.waiting) {
          console.log('wating!')
        }
        else if (registration.active) {
          console.log('active')
        }

        navigator.serviceWorker.addEventListener('message', (event) => {
          console.log('e: ', event.data)
        })
      }
      catch (error) {
        console.error(`Registration failed with ${error}`)
      }
    }
  }

  const collectBreadcrumbs = (plugins: Plugins | undefined) => {
    if (!plugins)
      return []
    const breadcrumbs: BreadcrumbOptions = []
    plugins?.forEach((plugin) => {
      breadcrumbs.push(plugin.breadcrumbs)
    })

    return breadcrumbs
  }

  const init = (initOptions: InitOptions) => {
    eventBus = EventBus()
    const { dsnURL, plugins, hooks } = initOptions
    const { beforeTransport, beforePushBreadcrumb } = hooks || {}
    transport = Transport(
      dsnURL,
      beforeTransport,
      beforePushBreadcrumb,
    ) as TransportReturn

    transport?.initBreadcrumb(collectBreadcrumbs(plugins))
    eventBus.on('bottle-monitor:transport', handleTransport)

    // TODO: 设置采集率，只上报部分用户的数据

    // 注册 service worker
    registerServiceWorker()

    // 初始化插件
    plugins?.forEach((plugin) => {
      if (!eventBus)
        return
      const { pluginName, ...options } = plugin
      if (plugin.pluginName === 'user') {
        UserPlugin({
          eventBus,
          userOptions: options as UserOptions,
        })
      }
      else if (plugin.pluginName === 'abnormal') {
        ErrorPlugin({
          eventBus,
          abnormalOptions: options as AbnormalOptions,
        })
      }
      else if (plugin.pluginName === 'vitals') {
        WebVitalsPlugin({
          eventBus,
          vitalsOptions: options as VitalsOptions,
        })
      }
      else {
        // TODO: CUSTOM PLUGIN
      }
    })
  }

  return {
    init,
    get transport() {
      return transport
    },
    get eventBus() {
      return eventBus
    },
  }
}

export default Tracker
