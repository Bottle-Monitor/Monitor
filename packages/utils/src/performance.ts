/**
 * 性能监控相关工具函数
 */

/**
 * 获取 FCP (First Contentful Paint)
 */
export function getFCP(): Promise<number> {
  return new Promise((resolve) => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          observer.disconnect()
          resolve(entry.startTime)
          return
        }
      }
    })

    observer.observe({ entryTypes: ['paint'] })

    // 超时处理
    setTimeout(() => {
      observer.disconnect()
      resolve(0)
    }, 10000)
  })
}

/**
 * 获取 LCP (Largest Contentful Paint)
 */
export function getLCP(): Promise<number> {
  return new Promise((resolve) => {
    let lcpValue = 0

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        lcpValue = entry.startTime
      }
    })

    observer.observe({ entryTypes: ['largest-contentful-paint'] })

    // 页面隐藏或卸载时返回最终值
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        observer.disconnect()
        resolve(lcpValue)
        removeEventListeners()
      }
    }

    const handlePageHide = () => {
      observer.disconnect()
      resolve(lcpValue)
      removeEventListeners()
    }

    function removeEventListeners() {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pagehide', handlePageHide)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pagehide', handlePageHide)

    // 超时处理
    setTimeout(() => {
      observer.disconnect()
      resolve(lcpValue)
      removeEventListeners()
    }, 10000)
  })
}

/**
 * 获取 CLS (Cumulative Layout Shift)
 */
export function getCLS(): Promise<number> {
  return new Promise((resolve) => {
    let clsValue = 0
    let sessionValue = 0
    let sessionEntries: PerformanceEntry[] = []

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShift = entry as any

        // 只统计非用户交互引起的偏移
        if (!layoutShift.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0]
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1]

          // 如果当前条目与会话中最后一个条目的时间间隔小于1秒，
          // 并且与会话中第一个条目的时间间隔小于5秒，那么条目包含在当前会话中
          if (
            sessionValue
            && entry.startTime - lastSessionEntry.startTime < 1000
            && entry.startTime - firstSessionEntry.startTime < 5000
          ) {
            sessionValue += layoutShift.value
            sessionEntries.push(layoutShift)
          }
          else {
            sessionValue = layoutShift.value
            sessionEntries = [layoutShift]
          }

          // 更新CLS为最大的会话值
          if (sessionValue > clsValue) {
            clsValue = sessionValue
          }
        }
      }
    })

    observer.observe({ entryTypes: ['layout-shift'] })

    // 页面隐藏时返回值
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        observer.disconnect()
        resolve(clsValue)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 超时处理
    setTimeout(() => {
      observer.disconnect()
      resolve(clsValue)
    }, 10000)
  })
}

/**
 * 获取 FID (First Input Delay)
 */
export function getFID(): Promise<number> {
  return new Promise((resolve) => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      if (entries.length > 0) {
        const firstInput = entries[0] as PerformanceEventTiming
        observer.disconnect()
        resolve(firstInput.processingStart - firstInput.startTime)
      }
    })

    observer.observe({ entryTypes: ['first-input'] })

    // 超时处理
    setTimeout(() => {
      observer.disconnect()
      resolve(0)
    }, 10000)
  })
}

/**
 * 获取 TTFB (Time to First Byte)
 */
export function getTTFB(): number {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  return navigation ? navigation.responseStart - navigation.fetchStart : 0
}

/**
 * 监控 FPS (Frames Per Second)
 */
export function monitorFPS(callback: (fps: number) => void, duration = 1000): () => void {
  let frames = 0
  let lastTime = performance.now()
  let animationId: number

  function countFrame() {
    frames++
    const currentTime = performance.now()

    if (currentTime >= lastTime + duration) {
      const fps = Math.round((frames * 1000) / (currentTime - lastTime))
      callback(fps)

      frames = 0
      lastTime = currentTime
    }

    animationId = requestAnimationFrame(countFrame)
  }

  animationId = requestAnimationFrame(countFrame)

  // 返回停止监控的函数
  return () => {
    cancelAnimationFrame(animationId)
  }
}

/**
 * 监控长任务
 */
export function monitorLongTasks(callback: (task: any) => void): () => void {
  if (!('PerformanceObserver' in window)) {
    return () => {}
  }

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      callback({
        duration: entry.duration,
        startTime: entry.startTime,
        name: entry.name,
        attribution: (entry as any).attribution,
      })
    }
  })

  try {
    observer.observe({ entryTypes: ['longtask'] })
  }
  catch (_e) {
    // 某些浏览器可能不支持 longtask
    console.warn('LongTask monitoring not supported')
  }

  return () => {
    observer.disconnect()
  }
}

/**
 * 获取资源性能信息
 */
export function getResourcePerformance(): any[] {
  const resources = performance.getEntriesByType('resource')

  return resources.map((resource) => {
    const timing = resource as PerformanceResourceTiming
    return {
      name: timing.name,
      type: getResourceType(timing.name),
      duration: timing.duration,
      size: timing.transferSize || 0,
      startTime: timing.startTime,
      responseEnd: timing.responseEnd,
      cacheHit: timing.transferSize === 0 && timing.decodedBodySize > 0,
    }
  })
}

/**
 * 根据URL获取资源类型
 */
function getResourceType(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase()

  const typeMap: Record<string, string> = {
    js: 'script',
    css: 'stylesheet',
    png: 'image',
    jpg: 'image',
    jpeg: 'image',
    gif: 'image',
    svg: 'image',
    webp: 'image',
    woff: 'font',
    woff2: 'font',
    ttf: 'font',
    eot: 'font',
  }

  return typeMap[extension || ''] || 'other'
}

/**
 * 使用 requestIdleCallback 执行非紧急任务
 */
export function runInIdleTime(callback: () => void, timeout = 5000): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout })
  }
  else {
    // 降级方案
    setTimeout(callback, 1)
  }
}

/**
 * 获取首屏时间 (FSP)
 */
export function getFSP(): Promise<number> {
  return new Promise((resolve) => {
    const keyElements = document.querySelectorAll('img, [data-fsp]')

    if (keyElements.length === 0) {
      resolve(performance.now())
      return
    }

    let loadedCount = 0
    const totalCount = keyElements.length

    const checkComplete = () => {
      loadedCount++
      if (loadedCount >= totalCount) {
        resolve(performance.now())
      }
    }

    keyElements.forEach((element) => {
      if (element.tagName === 'IMG') {
        const img = element as HTMLImageElement
        if (img.complete) {
          checkComplete()
        }
        else {
          img.addEventListener('load', checkComplete, { once: true })
          img.addEventListener('error', checkComplete, { once: true })
        }
      }
      else {
        // 对于其他元素，使用 IntersectionObserver 检测是否可见
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              observer.unobserve(entry.target)
              checkComplete()
            }
          })
        })
        observer.observe(element)
      }
    })

    // 超时处理
    setTimeout(() => {
      resolve(performance.now())
    }, 10000)
  })
}
