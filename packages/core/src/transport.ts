import type {
  Breadcrumb,
  BreadcrumbOptions,
  BreadcrumbType,
  TransportData,
  TransportReturn,
} from '@bottle-monitor/types'
import { onNetworkChange, runHook, sendData } from '@bottle-monitor/utils'

/**
 * 智能数据传输层
 *
 * 特性:
 * - 多队列管理：不同类型数据使用独立队列
 * - 智能上报策略：容量满/定时/页面卸载时上报
 * - 网络策略：sendBeacon -> fetch -> XHR 降级
 * - 离线支持：离线时本地缓存，上线后重传
 * - 错误重试：指数退避重试机制
 * - Hook系统：支持数据预处理
 */
function Transport(dsnURL: string, beforeTransport?: (data: any) => any, beforePushBreadcrumb?: (data: any) => any): TransportReturn {
  // 队列存储
  let breadcrumbs: Breadcrumb[] = []
  // 离线数据缓存
  const offlineCache: TransportData[] = []
  // 网络状态
  let isOnline = navigator.onLine
  // 重试计数器
  const retryCounters: Map<string, number> = new Map()

  /**
   * 发送数据的核心逻辑
   */
  const sendWithRetry = async (url: string, data: any, retryKey: string): Promise<boolean> => {
    // 检查网络状态
    if (!isOnline) {
      console.warn('Network is offline, caching data')
      offlineCache.push(...(Array.isArray(data) ? data : [data]))
      return false
    }

    const retryCount = retryCounters.get(retryKey) || 0
    const maxRetries = 3

    try {
      const success = await sendData(url, data, {
        timeout: 5000,
        retry: 1, // sendData内部重试1次
        useBeacon: true,
      })

      if (success) {
        // 重置重试计数器
        retryCounters.delete(retryKey)
        return true
      }
      else {
        throw new Error('Send failed')
      }
    }
    catch (error) {
      console.error(`Send data failed (attempt ${retryCount + 1}):`, error)

      if (retryCount < maxRetries) {
        // 指数退避重试
        const delay = 2 ** retryCount * 1000
        retryCounters.set(retryKey, retryCount + 1)

        setTimeout(() => {
          sendWithRetry(url, data, retryKey)
        }, delay)
      }
      else {
        // 重试失败，缓存数据
        console.error('Max retries reached, caching data')
        offlineCache.push(...(Array.isArray(data) ? data : [data]))
        retryCounters.delete(retryKey)
      }

      return false
    }
  }

  /**
   * 处理离线缓存数据
   */
  const flushOfflineCache = async () => {
    if (offlineCache.length === 0 || !isOnline) {
      return
    }

    console.log(`Flushing ${offlineCache.length} cached items`)
    const dataToSend = offlineCache.splice(0) // 清空缓存

    // 按类型分组发送
    const groupedData: Record<string, TransportData[]> = {}
    dataToSend.forEach((item) => {
      const key = item.breadcrumbType
      if (!groupedData[key]) {
        groupedData[key] = []
      }
      groupedData[key].push(item)
    })

    for (const [type, items] of Object.entries(groupedData)) {
      await sendWithRetry(dsnURL, items, `offline-${type}`)
    }
  }

  /**
   * 监听网络状态变化
   */
  onNetworkChange((online) => {
    isOnline = online
    if (online) {
      // 网络恢复，发送缓存数据
      setTimeout(flushOfflineCache, 1000)
    }
  })

  /**
   * 页面卸载时发送剩余数据
   */
  const handlePageUnload = () => {
    // 发送所有队列中的剩余数据
    breadcrumbs.forEach((breadcrumb) => {
      if (breadcrumb.queue.length > 0) {
        const queueDataToSend = breadcrumb.queue.splice(0)
        const processedData = runHook(beforeTransport, queueDataToSend) || queueDataToSend
        const finalProcessedData = runHook(breadcrumb.perBeforeTransport, processedData) || processedData

        // 页面卸载时优先使用 sendBeacon
        if (navigator.sendBeacon) {
          navigator.sendBeacon(dsnURL, JSON.stringify(finalProcessedData))
        }
      }
    })

    // 发送离线缓存（如果有的话）
    if (offlineCache.length > 0) {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(dsnURL, JSON.stringify(offlineCache))
      }
    }
  }

  // 注册页面卸载事件
  window.addEventListener('beforeunload', handlePageUnload)
  window.addEventListener('pagehide', handlePageUnload)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      handlePageUnload()
    }
  })

  /**
   * 初始化面包屑队列
   */
  const initBreadcrumb = (breadcrumbOptions: BreadcrumbOptions) => {
    breadcrumbs = breadcrumbOptions.map((option) => {
      const {
        breadcrumbId = 'unknown',
        capacity = 10,
        uploadInterval = 30000, // 默认30秒
        perBeforePushBreadcrumb,
        perBeforeTransport,
      } = option

      const breadcrumb: Breadcrumb = {
        breadcrumbId,
        capacity,
        uploadInterval,
        lastUpload: Date.now(),
        queue: [],
        perBeforePushBreadcrumb,
        perBeforeTransport,
      }

      // 设置定时上报
      if (uploadInterval > 0) {
        setInterval(() => {
          if (breadcrumb.queue.length > 0) {
            const queueDataToSend = breadcrumb.queue.splice(0)
            const processedData = runHook(beforeTransport, queueDataToSend) || queueDataToSend
            const finalProcessedData = runHook(breadcrumb.perBeforeTransport, processedData) || processedData

            sendWithRetry(dsnURL, finalProcessedData, `interval-${breadcrumbId}`)
            breadcrumb.lastUpload = Date.now()
          }
        }, uploadInterval)
      }

      return breadcrumb
    })
  }

  /**
   * 发送数据到指定队列
   */
  const send = (breadcrumbType: BreadcrumbType, data: TransportData) => {
    const breadcrumb = breadcrumbs.find(
      item => item.breadcrumbId === breadcrumbType,
    )

    if (!breadcrumb) {
      console.warn(`Breadcrumb not found for type: ${breadcrumbType}`)
      return
    }

    console.log('Listened: ', breadcrumbType, data)

    // 应用全局和队列级别的hook
    let processedData = runHook(beforePushBreadcrumb, data) || data
    processedData = runHook(breadcrumb.perBeforePushBreadcrumb, processedData) || processedData

    // 添加到队列
    breadcrumb.queue.push(processedData)

    // 容量满了立即上报
    if (breadcrumb.queue.length >= breadcrumb.capacity) {
      const queueDataToSend = breadcrumb.queue.splice(0)
      const finalData = runHook(beforeTransport, queueDataToSend) || queueDataToSend
      const finalProcessedData = runHook(breadcrumb.perBeforeTransport, finalData) || finalData

      sendWithRetry(dsnURL, finalProcessedData, `capacity-${breadcrumbType}`)
      breadcrumb.lastUpload = Date.now()
    }
  }

  return {
    send,
    initBreadcrumb,
  }
}

export default Transport
