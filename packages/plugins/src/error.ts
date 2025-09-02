import type {
  AbnormalOptions,
  BreadcrumbData,
  EventBusReturn,
  JavaScriptErrorInfo,
  PromiseErrorInfo,
  ResourceErrorInfo,
  WhiteScreenErrorInfo,
} from '@bottle-monitor/types'
import {
  ABNORMAL,
  CATEGORY,
} from '@bottle-monitor/types'
import {
  debounce,
  detectWhiteScreen,
  interceptFetch,
  interceptXHR,
} from '@bottle-monitor/utils'

/**
 * 错误监控插件
 *
 * 功能：
 * - JavaScript 运行时错误捕获
 * - Promise 未捕获拒绝错误
 * - 资源加载错误
 * - 网络请求错误
 * - 白屏检测
 * - 自定义错误上报
 */
export function ErrorPlugin({
  eventBus,
  abnormalOptions,
}: {
  eventBus: EventBusReturn
  abnormalOptions: AbnormalOptions
}) {
  // 错误去重缓存
  const errorCache = new Set<string>()

  /**
   * 解析错误堆栈
   */
  const parseErrorStack = (stack: string): any[] => {
    // 简单的堆栈解析实现
    const lines = stack.split('\n')
    return lines.slice(1).map((line) => {
      const match = line.match(/\s*at\s+([^@\s]+)\s*\(([^:]+):(\d+):(\d+)\)/)
        || line.match(/\s*at\s+([^@\s]+):(\d+):(\d+)/)
        || line.match(/([^@]+)@([^:]+):(\d+):(\d+)/)

      if (match) {
        return {
          functionName: match[1] || 'anonymous',
          filename: match[2] || '',
          lineNumber: Number.parseInt(match[3] || '0'),
          columnNumber: Number.parseInt(match[4] || '0'),
          source: line.trim(),
        }
      }

      return {
        functionName: 'unknown',
        filename: '',
        lineNumber: 0,
        columnNumber: 0,
        source: line.trim(),
      }
    })
  }

  /**
   * 获取错误源码
   */
  const getErrorSource = (_filename?: string, _lineno?: number): string => {
    // 这里可以实现获取错误源码的逻辑
    // 由于安全限制，通常无法获取到具体源码
    return ''
  }

  /**
   * 生成错误唯一标识
   */
  const generateErrorKey = (message: string, filename?: string, lineno?: number): string => {
    return `${message}_${filename || ''}_${lineno || 0}`
  }

  /**
   * 检查是否需要过滤重复错误
   */
  const shouldIgnoreError = (errorKey: string): boolean => {
    if (!abnormalOptions.repeatError && errorCache.has(errorKey)) {
      return true
    }
    errorCache.add(errorKey)
    return false
  }

  /**
   * 发送错误数据
   */
  const sendErrorData = (type: string, data: any) => {
    const breadcrumbData: BreadcrumbData = {
      type,
      category: CATEGORY.ABNORMAL,
      timestamp: Date.now(),
      level: 'error',
      message: data.message || 'Unknown error',
      data,
    }

    eventBus.emit('bottle-monitor:transport', CATEGORY.ABNORMAL, breadcrumbData)
  }

  /**
   * 捕获 Promise 未处理的拒绝
   */
  const capturePromiseRejection = () => {
    window.addEventListener('unhandledrejection', (event): void => {
      const reason = event.reason
      const message = reason?.message || String(reason)

      const errorKey = generateErrorKey(message, 'promise')
      if (shouldIgnoreError(errorKey))
        return

      let stack: any[] = []
      if (reason?.stack) {
        try {
          // 解析错误堆栈
          stack = parseErrorStack(reason.stack)
        }
        catch (e) {
          console.warn('Failed to parse promise error stack:', e)
        }
      }

      const errorInfo: PromiseErrorInfo = {
        type: 'promise',
        level: 'error',
        message,
        timestamp: Date.now(),
        url: window.location.href,
        reason,
        stack,
      }

      sendErrorData(ABNORMAL.UNHANDLEDREJECTION, errorInfo)
    })
  }

  /**
   * 处理 JavaScript 代码错误
   */
  const handleJavaScriptError = (event: ErrorEvent) => {
    const { message, filename, lineno, colno, error } = event

    const errorKey = generateErrorKey(message, filename, lineno)
    if (shouldIgnoreError(errorKey))
      return

    let stack: any[] = []
    if (error?.stack) {
      try {
        stack = parseErrorStack(error.stack)
      }
      catch (e) {
        console.warn('Failed to parse JS error stack:', e)
      }
    }

    const errorInfo: JavaScriptErrorInfo = {
      type: 'javascript',
      level: 'error',
      message,
      timestamp: Date.now(),
      url: window.location.href,
      filename: filename || '',
      lineNumber: lineno || 0,
      columnNumber: colno || 0,
      stack,
      errorName: error?.name || 'Error',
      source: getErrorSource(filename, lineno),
    }

    sendErrorData(ABNORMAL.CODE, errorInfo)
  }

  /**
   * 处理资源加载错误
   */
  const handleResourceError = (event: Event) => {
    const target = event.target as HTMLElement
    if (!target)
      return

    let resourceUrl = ''
    let resourceType = 'other'

    if (target instanceof HTMLScriptElement) {
      resourceUrl = target.src
      resourceType = 'script'
    }
    else if (target instanceof HTMLLinkElement) {
      resourceUrl = target.href
      resourceType = 'stylesheet'
    }
    else if (target instanceof HTMLImageElement) {
      resourceUrl = target.src
      resourceType = 'image'
    }
    else if (target instanceof HTMLVideoElement || target instanceof HTMLAudioElement) {
      resourceUrl = target.src
      resourceType = 'media'
    }

    const errorKey = generateErrorKey(`Resource load error: ${resourceUrl}`)
    if (shouldIgnoreError(errorKey))
      return

    const errorInfo: ResourceErrorInfo = {
      type: 'resource',
      level: 'error',
      message: `Failed to load resource: ${resourceUrl}`,
      timestamp: Date.now(),
      url: window.location.href,
      resourceType: resourceType as any,
      resourceUrl,
      crossOrigin: target.hasAttribute('crossorigin'),
    }

    sendErrorData(ABNORMAL.RESOURCE, errorInfo)
  }

  /**
   * 捕获全局错误
   */
  const captureGlobalErrors = () => {
    window.addEventListener('error', (event) => {
      if (event.error) {
        // JavaScript 错误
        handleJavaScriptError(event)
      }
      else {
        // 资源加载错误
        handleResourceError(event)
      }
    }, true) // 使用捕获阶段处理资源错误
  }

  /**
   * 网络请求错误监控
   */
  const captureNetworkErrors = () => {
    if (!abnormalOptions.network)
      return

    const filterRegExp = abnormalOptions.filterXhrUrlRegExp

    // 拦截 XMLHttpRequest
    interceptXHR((data) => {
      if (filterRegExp && filterRegExp.test(data.url))
        return

      if (data.status === 'error' || data.status === 'timeout' || (data.statusCode && data.statusCode >= 400)) {
        const errorKey = generateErrorKey(`Network error: ${data.url}`)
        if (shouldIgnoreError(errorKey))
          return

        const errorInfo = {
          type: 'network',
          level: data.statusCode && data.statusCode >= 500 ? 'error' : 'warning',
          message: data.errorMessage || `HTTP ${data.statusCode || 'Error'}`,
          timestamp: Date.now(),
          url: window.location.href,
          requestUrl: data.url,
          requestMethod: data.method,
          statusCode: data.statusCode,
          responseTime: data.responseTime,
          errorType: data.status,
        }

        sendErrorData(ABNORMAL.NETWORK || 'network', errorInfo)
      }
    })

    // 拦截 Fetch API
    interceptFetch((data) => {
      if (filterRegExp && filterRegExp.test(data.url))
        return

      if (data.status === 'error' || data.status === 'timeout' || (data.statusCode && data.statusCode >= 400)) {
        const errorKey = generateErrorKey(`Fetch error: ${data.url}`)
        if (shouldIgnoreError(errorKey))
          return

        const errorInfo = {
          type: 'network',
          level: data.statusCode && data.statusCode >= 500 ? 'error' : 'warning',
          message: data.errorMessage || `HTTP ${data.statusCode || 'Error'}`,
          timestamp: Date.now(),
          url: window.location.href,
          requestUrl: data.url,
          requestMethod: data.method,
          statusCode: data.statusCode,
          responseTime: data.responseTime,
          errorType: data.status,
        }

        sendErrorData(ABNORMAL.NETWORK || 'network', errorInfo)
      }
    })
  }

  /**
   * 白屏检测
   */
  const captureWhiteScreen = debounce(async () => {
    if (!abnormalOptions.whitescreen)
      return

    try {
      const result = await detectWhiteScreen({
        threshold: 0.8,
        samplingDelay: 1000,
      })

      if (result.isWhiteScreen) {
        const errorInfo: WhiteScreenErrorInfo = {
          type: 'white-screen',
          level: 'fatal',
          message: 'White screen detected',
          timestamp: Date.now(),
          url: window.location.href,
          score: result.score,
          threshold: 0.8,
          samplingMethod: 'canvas',
          details: {
            samplingPoints: result.samplingPoints,
          },
        }

        sendErrorData(ABNORMAL.WHITESCREEN, errorInfo)
      }
    }
    catch (error) {
      console.warn('White screen detection failed:', error)
    }
  }, 1000)

  /**
   * 初始化插件
   */
  const initPlugin = () => {
    const {
      codeError = true,
      unhandledrejection = true,
      resource = true,
      whitescreen = false,
      network = false,
    } = abnormalOptions || {}

    // 捕获 JavaScript 错误和资源错误
    if (codeError || resource) {
      captureGlobalErrors()
    }

    // 捕获 Promise 错误
    if (unhandledrejection) {
      capturePromiseRejection()
    }

    // 网络错误监控
    if (network) {
      captureNetworkErrors()
    }

    // 白屏检测
    if (whitescreen) {
      // 页面加载完成后进行白屏检测
      if (document.readyState === 'complete') {
        setTimeout(captureWhiteScreen, 1000)
      }
      else {
        window.addEventListener('load', () => {
          setTimeout(captureWhiteScreen, 1000)
        })
      }
    }
  }

  // 初始化插件
  initPlugin()

  // 返回插件控制接口
  return {
    reportCustomError: (error: Error | string, extra?: Record<string, any>) => {
      const message = typeof error === 'string' ? error : error.message
      const errorInfo = {
        type: 'custom',
        level: 'error',
        message,
        timestamp: Date.now(),
        url: window.location.href,
        category: extra?.category,
        extra,
      }

      sendErrorData(ABNORMAL.CUSTOM, errorInfo)
    },
  }
}
