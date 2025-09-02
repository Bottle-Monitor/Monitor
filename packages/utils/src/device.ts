import type { DeviceData, DeviceType, NetworkType } from '@bottle-monitor/types'
import { UAParser } from 'ua-parser-js'

/**
 * 获取设备信息
 */
export function getDeviceInfo(): DeviceData {
  const parser = new UAParser()
  const result = parser.getResult()

  // 获取网络信息
  const connection = (navigator as any).connection
    || (navigator as any).mozConnection
    || (navigator as any).webkitConnection

  // 获取内存信息
  const memory = (performance as any).memory

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,

    os: {
      name: result.os.name || 'unknown',
      version: result.os.version || 'unknown',
    },

    browser: {
      name: result.browser.name || 'unknown',
      version: result.browser.version || 'unknown',
      engine: result.engine.name || 'unknown',
    },

    device: {
      type: getDeviceType(result.device.type),
      vendor: result.device.vendor,
      model: result.device.model,
    },

    screen: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      orientation: getScreenOrientation(),
    },

    network: connection
      ? {
          type: getNetworkType(connection.effectiveType),
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        }
      : undefined,

    memory: memory
      ? {
          deviceMemory: (navigator as any).deviceMemory,
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        }
      : undefined,
  }
}

/**
 * 获取设备类型
 */
function getDeviceType(type?: string): DeviceType {
  if (!type) {
    // 通过屏幕尺寸推断
    const width = screen.width
    if (width <= 768)
      return 'mobile'
    if (width <= 1024)
      return 'tablet'
    return 'desktop'
  }

  switch (type.toLowerCase()) {
    case 'mobile':
      return 'mobile'
    case 'tablet':
      return 'tablet'
    case 'desktop':
    case 'smarttv':
      return 'desktop'
    default:
      return 'unknown'
  }
}

/**
 * 获取网络类型
 */
function getNetworkType(effectiveType?: string): NetworkType {
  if (!effectiveType)
    return 'unknown'

  switch (effectiveType.toLowerCase()) {
    case 'slow-2g':
      return 'slow-2g'
    case '2g':
      return '2g'
    case '3g':
      return '3g'
    case '4g':
      return '4g'
    default:
      return 'wifi'
  }
}

/**
 * 获取屏幕方向
 */
function getScreenOrientation(): string {
  if (screen.orientation) {
    return screen.orientation.type
  }

  // 兼容性处理
  const orientation = screen.width > screen.height ? 'landscape' : 'portrait'
  return orientation
}

/**
 * 检测是否为移动设备
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * 检测是否为Safari浏览器
 */
export function isSafari(): boolean {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

/**
 * 检测是否支持某个API
 */
export function isSupported(api: string): boolean {
  const supportMap: Record<string, () => boolean> = {
    serviceWorker: () => 'serviceWorker' in navigator,
    sendBeacon: () => 'sendBeacon' in navigator,
    performanceObserver: () => 'PerformanceObserver' in window,
    intersectionObserver: () => 'IntersectionObserver' in window,
    mutationObserver: () => 'MutationObserver' in window,
    fetch: () => 'fetch' in window,
    localStorage: () => {
      try {
        const test = '__test__'
        localStorage.setItem(test, test)
        localStorage.removeItem(test)
        return true
      }
      catch {
        return false
      }
    },
    sessionStorage: () => {
      try {
        const test = '__test__'
        sessionStorage.setItem(test, test)
        sessionStorage.removeItem(test)
        return true
      }
      catch {
        return false
      }
    },
  }

  return supportMap[api]?.() ?? false
}
