import type { AbnormalOptions, BreadcrumbOptions, EventBusReturn, InitOptions, PluginsFormatted, TransportReturn, UserOptions, VitalsOptions } from '@bottle-monitor/types'
import { ErrorPlugin, UserPlugin, WebVitalsPlugin } from '@bottle-monitor/plugins'
import {

  CATEGORY,

} from '@bottle-monitor/types'
import { generateUUID, getDeviceInfo } from '@bottle-monitor/utils'
import EventBus from './eventBus'
import Transport from './transport'

/**
 * 插件注册器接口
 */
interface PluginRegistrar {
  name: string
  init: (options: {
    eventBus: EventBusReturn
    config: any
    deviceInfo: any
    sessionId: string
    userId: string
  }) => void | Promise<void>
}

/**
 * SDK 核心类
 */
class BottleMonitor {
  private eventBus: EventBusReturn | null = null
  private transport: TransportReturn | null = null
  private plugins: Map<string, PluginRegistrar> = new Map()
  private config: InitOptions | null = null
  private sessionId: string
  private deviceInfo: any
  private isInitialized: boolean = false
  private reported: boolean = false

  constructor() {
    this.sessionId = generateUUID()
    this.deviceInfo = getDeviceInfo()
    this.reported = this.isSampled()

    // 注册内置插件
    if (this.reported) {
      this.registerPlugin({
        name: CATEGORY.VITALS,
        init: async ({ eventBus, config }) => {
          WebVitalsPlugin({
            eventBus,
            vitalsOptions: config as VitalsOptions,
          })
        },
      })
      this.registerPlugin({
        name: CATEGORY.USER,
        init: async ({ eventBus, config }) => {
          UserPlugin({
            eventBus,
            userOptions: config as UserOptions,
          })
        },
      })
    }

    this.registerPlugin({
      name: CATEGORY.ABNORMAL,
      init: async ({ eventBus, config }) => {
        ErrorPlugin({
          eventBus,
          abnormalOptions: config as AbnormalOptions,
        })
      },
    })
  }

  /**
   * 计算是否被采样
   * 错误全部上报，其他数据采样
   */
  isSampled(): boolean {
    if (this.config?.customSample) {
      return this.config.customSample(this.deviceInfo)
    }
    if (this.config?.sampleRate) {
      return Math.random() < this.config.sampleRate
    }
    return true
  }

  /**
   * 注册插件
   */
  registerPlugin(plugin: PluginRegistrar): void {
    this.plugins.set(plugin.name, plugin)
  }

  /**
   * 初始化SDK
   */
  async init(options: InitOptions): Promise<void> {
    if (this.isInitialized) {
      console.warn('BottleMonitor has already been initialized')
      return
    }

    try {
      this.config = this.validateAndNormalizeOptions(options)

      // 初始化事件总线
      this.eventBus = EventBus()

      // 初始化传输层
      this.transport = Transport(
        this.config.dsnURL,
        this.config.hooks?.beforeTransport,
        this.config.hooks?.beforePushBreadcrumb,
      )

      // 初始化队列配置
      const breadcrumbOptions = this.collectBreadcrumbOptions(this.config.plugins)
      this.transport.initBreadcrumb(breadcrumbOptions)

      // 监听传输事件
      this.eventBus.on('bottle-monitor:transport', (category, data) => {
        this.transport?.send(category, this.enrichTransportData(data))
      })

      // 注册Service Worker（如果支持）
      await this.registerServiceWorker()

      // 初始化插件
      await this.initializePlugins()

      // 发送初始化事件
      this.eventBus.emit('bottle-monitor:user', 'init', {
        timestamp: Date.now(),
        sdkVersion: this.getSDKVersion(),
        sessionId: this.sessionId,
        deviceInfo: this.deviceInfo,
      })

      this.isInitialized = true
      console.log('BottleMonitor initialized successfully')
    }
    catch (error) {
      console.error('Failed to initialize BottleMonitor:', error)
      throw error
    }
  }

  /**
   * 手动发送自定义事件
   */
  track(eventName: string, data: any): void {
    if (!this.isInitialized || !this.eventBus) {
      console.warn('BottleMonitor not initialized')
      return
    }

    this.eventBus.emit('bottle-monitor:custom', eventName, {
      eventName,
      data,
      timestamp: Date.now(),
    })
  }

  /**
   * 获取当前配置
   */
  getConfig(): InitOptions | null {
    return this.config
  }

  /**
   * 获取事件总线实例
   */
  getEventBus(): EventBusReturn | null {
    return this.eventBus
  }

  /**
   * 验证和标准化配置选项
   */
  private validateAndNormalizeOptions(options: InitOptions): InitOptions {
    if (!options.dsnURL) {
      throw new Error('dsnURL is required')
    }

    if (!options.userId) {
      throw new Error('userId is required')
    }

    // 设置默认值
    const normalizedOptions: InitOptions = {
      framework: 'normal',
      plugins: [],
      hooks: {},
      sampleRate: 1,
      ...options,
      projectId: options.projectId || 'default-project',
    }

    return normalizedOptions
  }

  /**
   * 收集面包屑配置
   */
  private collectBreadcrumbOptions(plugins: PluginsFormatted = []): BreadcrumbOptions {
    return plugins.map(plugin => ({
      breadcrumbType: plugin.pluginName,
      breadcrumbId: plugin.pluginName,
      capacity: plugin.breadcrumbs.capacity || 10,
      uploadInterval: plugin.breadcrumbs.uploadInterval || 30000,
      perBeforePushBreadcrumb: plugin.breadcrumbs.perBeforePushBreadcrumb,
      perBeforeTransport: plugin.breadcrumbs.perBeforeTransport,
    }))
  }

  /**
   * 丰富传输数据
   */
  private enrichTransportData(data: any): any {
    if (!this.config)
      return data

    return {
      ...data,
      projectId: this.config.projectId,
      userId: this.config.userId,
      sessionId: this.sessionId,
      pageUrl: window.location.href,
      timestamp: Date.now(),
      sdkVersion: this.getSDKVersion(),
      device: this.deviceInfo,
      pageInfo: {
        title: document.title,
        referrer: document.referrer,
        visibility: document.visibilityState,
      },
    }
  }

  /**
   * 初始化插件
   */
  private async initializePlugins(): Promise<void> {
    console.log('SAMPLERATING:', this.reported)
    if (!this.config?.plugins || !this.eventBus)
      return

    const initPromises = this.config.plugins.map(async (pluginConfig) => {
      const plugin = this.plugins.get(pluginConfig.pluginName)
      console.log('PLUGIN:', plugin)
      if (!plugin) {
        console.warn(`Plugin "${pluginConfig.pluginName}" not found`)
        return
      }

      try {
        // 错误全量上报，其余部分上报
        if (pluginConfig.pluginName !== CATEGORY.ABNORMAL) {
          if (!this.reported) {
            return
          }
        }

        await plugin.init({
          eventBus: this.eventBus!,
          config: pluginConfig,
          deviceInfo: this.deviceInfo,
          sessionId: this.sessionId,
          userId: this.config!.userId,
        })

        console.log(`Plugin "${pluginConfig.pluginName}" initialized`)
      }
      catch (error) {
        console.error(`Failed to initialize plugin "${pluginConfig.pluginName}":`, error)
      }
    })

    await Promise.all(initPromises)
  }

  /**
   * 注册Service Worker
   */
  private async registerServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      return
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js')

      if (registration.installing) {
        console.log('Service Worker installing')
      }
      else if (registration.waiting) {
        console.log('Service Worker waiting')
      }
      else if (registration.active) {
        console.log('Service Worker active')
      }

      // 监听Service Worker消息
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Received message from SW:', event.data)
      })
    }
    catch (error) {
      console.warn('Service Worker registration failed:', error)
    }
  }

  /**
   * 获取SDK版本
   */
  private getSDKVersion(): string {
    return '1.0.0'
  }
}

// 全局单例实例
let globalInstance: BottleMonitor | null = null

/**
 * 初始化监控SDK
 */
export function bottleMonitorInit(options: InitOptions): BottleMonitor {
  if (!globalInstance) {
    globalInstance = new BottleMonitor()
  }

  globalInstance.init(options)
  return globalInstance
}

/**
 * 获取全局实例
 */
export function getBottleMonitor(): BottleMonitor | null {
  return globalInstance
}

export { BottleMonitor }
export default BottleMonitor
