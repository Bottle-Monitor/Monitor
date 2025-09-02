/**
 * 网络请求相关工具函数
 */

import type { RequestData, RequestMethod, RequestStatus } from '@bottle-monitor/types'

/**
 * 发送数据的策略函数
 */
export async function sendData(url: string, data: any, options: {
  timeout?: number
  retry?: number
  useBeacon?: boolean
} = {}): Promise<boolean> {
  const { timeout = 5000, retry = 3, useBeacon = true } = options

  // 首先尝试使用 sendBeacon
  if (useBeacon && navigator.sendBeacon) {
    try {
      const success = navigator.sendBeacon(url, JSON.stringify(data))
      if (success)
        return true
    }
    catch (e) {
      console.warn('sendBeacon failed:', e)
    }
  }

  // 降级到 fetch
  for (let i = 0; i < retry; i++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
        keepalive: true,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        return true
      }
    }
    catch (e) {
      if (i === retry - 1) {
        console.error('Send data failed after retries:', e)
      }
      else {
        // 指数退避
        await new Promise(resolve => setTimeout(resolve, 2 ** i * 1000))
      }
    }
  }

  return false
}

/**
 * 拦截 XMLHttpRequest
 */
export function interceptXHR(callback: (data: RequestData) => void) {
  const originalOpen = XMLHttpRequest.prototype.open
  const originalSend = XMLHttpRequest.prototype.send

  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string | URL,
    async: boolean = true,
    user?: string | null,
    password?: string | null,
  ) {
    ;(this as any)._method = method
    ;(this as any)._url = url
    ;(this as any)._startTime = performance.now()

    return originalOpen.call(this, method, url, async, user, password)
  }

  XMLHttpRequest.prototype.send = function (body?: any) {
    const startTime = (this as any)._startTime || performance.now()

    const handleResponse = () => {
      const endTime = performance.now()
      const responseTime = endTime - startTime

      const data: RequestData = {
        url: (this as any)._url,
        method: (this as any)._method as RequestMethod,
        status: getRequestStatus(this.status, this.readyState),
        statusCode: this.status,
        responseTime,
        startTime,
        endTime,
        requestSize: getRequestSize(body),
        responseSize: getResponseSize(this.responseText),
      }

      if (this.status >= 400) {
        data.errorMessage = `HTTP Error ${this.status}: ${this.statusText}`
      }

      callback(data)
    }

    this.addEventListener('loadend', handleResponse)
    this.addEventListener('error', () => {
      const endTime = performance.now()
      callback({
        url: (this as any)._url,
        method: (this as any)._method as RequestMethod,
        status: 'error',
        responseTime: endTime - startTime,
        startTime,
        endTime,
        errorMessage: 'Network error',
      })
    })

    this.addEventListener('timeout', () => {
      const endTime = performance.now()
      callback({
        url: (this as any)._url,
        method: (this as any)._method as RequestMethod,
        status: 'timeout',
        responseTime: endTime - startTime,
        startTime,
        endTime,
        errorMessage: 'Request timeout',
      })
    })

    return originalSend.call(this, body)
  }

  // 返回恢复函数
  return () => {
    XMLHttpRequest.prototype.open = originalOpen
    XMLHttpRequest.prototype.send = originalSend
  }
}

/**
 * 拦截 Fetch API
 */
export function interceptFetch(callback: (data: RequestData) => void) {
  const originalFetch = window.fetch

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    const startTime = performance.now()
    const url = typeof input === 'string' ? input : input.toString()
    const method = (init?.method || 'GET') as RequestMethod

    try {
      const response = await originalFetch(input, init)
      const endTime = performance.now()
      const responseTime = endTime - startTime

      // 克隆响应以读取内容
      const clonedResponse = response.clone()
      let responseSize = 0

      try {
        const text = await clonedResponse.text()
        responseSize = getResponseSize(text)
      }
      catch (_e) {
        // 无法读取响应内容
      }

      const data: RequestData = {
        url,
        method,
        status: response.ok ? 'success' : 'error',
        statusCode: response.status,
        responseTime,
        startTime,
        endTime,
        requestSize: getRequestSize(init?.body),
        responseSize,
      }

      if (!response.ok) {
        data.errorMessage = `HTTP Error ${response.status}: ${response.statusText}`
      }

      callback(data)
      return response
    }
    catch (error) {
      const endTime = performance.now()
      const responseTime = endTime - startTime

      let status: RequestStatus = 'error'
      let errorMessage = 'Network error'

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          status = 'abort'
          errorMessage = 'Request aborted'
        }
        else if (error.name === 'TimeoutError') {
          status = 'timeout'
          errorMessage = 'Request timeout'
        }
        else {
          errorMessage = error.message
        }
      }

      callback({
        url,
        method,
        status,
        responseTime,
        startTime,
        endTime,
        errorMessage,
      })

      throw error
    }
  }

  // 返回恢复函数
  return () => {
    window.fetch = originalFetch
  }
}

/**
 * 获取请求状态
 */
function getRequestStatus(status: number, readyState: number): RequestStatus {
  if (readyState === XMLHttpRequest.DONE) {
    if (status >= 200 && status < 300) {
      return 'success'
    }
    else if (status >= 400) {
      return 'error'
    }
  }
  return 'error'
}

/**
 * 获取请求大小
 */
function getRequestSize(body: any): number {
  if (!body)
    return 0

  if (typeof body === 'string') {
    return new Blob([body]).size
  }

  if (body instanceof FormData) {
    // FormData 大小难以准确计算，返回估算值
    return 1024 // 1KB 估算
  }

  if (body instanceof ArrayBuffer) {
    return body.byteLength
  }

  return 0
}

/**
 * 获取响应大小
 */
function getResponseSize(responseText: string): number {
  return new Blob([responseText]).size
}

/**
 * 检测网络状态
 */
export function getNetworkStatus(): {
  online: boolean
  type?: string
  downlink?: number
  rtt?: number
} {
  const connection = (navigator as any).connection
    || (navigator as any).mozConnection
    || (navigator as any).webkitConnection

  return {
    online: navigator.onLine,
    type: connection?.type,
    downlink: connection?.downlink,
    rtt: connection?.rtt,
  }
}

/**
 * 监听网络状态变化
 */
export function onNetworkChange(callback: (online: boolean) => void): () => void {
  const handleOnline = () => callback(true)
  const handleOffline = () => callback(false)

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}
