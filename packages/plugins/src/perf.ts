import type {
  EventBusReturn,
  InitOptions,
  LayoutShift,
} from '@bottle-monitor/types'
import {
  CATEGORY,
  VITALS,
} from '@bottle-monitor/types'
import { getDate } from '@bottle-monitor/utils'

export function WebVitalsPlugin({
  eventBus,
  initOptions,
}: {
  eventBus: EventBusReturn
  initOptions: InitOptions
}) {
  let lastLCP: PerformanceEntry | null = null
  const DEFAULT_STATIC_TYPES = ['script', 'link', 'img', 'css']
  const DEFAULT_DYNAMIC_TYPES = ['beacon', 'fetch', 'xmlhttprequest']

  /**
   * CORE WEB_VITALS
   */
  const emitFCP = (entry: PerformanceEntry) => {
    if (entry.name === 'first-paint')
      return
    eventBus.emit('bottle-monitor:transport', CATEGORY.VITALS, {
      category: CATEGORY.VITALS,
      type: VITALS.FCP,
      emitTime: getDate(new Date()),
      entryName: 'first-contentful-paint',
      entry,
    })
  }

  const emitLCP = (entry: PerformanceEntry) => {
    eventBus.emit('bottle-monitor:transport', CATEGORY.VITALS, {
      category: CATEGORY.VITALS,
      type: VITALS.LCP,
      emitTime: getDate(new Date()),
      entryName: 'largest-contentful-paint',
      entry,
    })
  }

  const emitFID = (entry: PerformanceEntry) => {
    eventBus.emit('bottle-monitor:transport', CATEGORY.VITALS, {
      category: CATEGORY.VITALS,
      type: VITALS.FID,
      emitTime: getDate(new Date()),
      entryName: 'first-input',
      entry,
    })
  }

  const emitCLS = (entry: PerformanceEntry) => {
    eventBus.emit('bottle-monitor:transport', CATEGORY.VITALS, {
      category: CATEGORY.VITALS,
      type: VITALS.CLS,
      emitTime: getDate(new Date()),
      entryName: 'layout-shift',
      entry,
    })
  }

  const emitCoreVitals = (entry: PerformanceEntry) => {
    switch (entry.entryType) {
      case 'paint':
        if (entry.name === 'first-contentful-paint')
          emitFCP(entry)
        break
      case 'largest-contentful-paint':
        lastLCP = entry
        break
      case 'layout-shift':
        if (!(entry as LayoutShift).hadRecentInput)
          emitCLS(entry)
        break
      case 'first-input':
        emitFID(entry)
        break
    }
  }

  // 核心指标包含 FCP、LCP、CLS 和 FID
  const getCoreWebVitals = (entryTypes: string[]) => {
    const observer = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry: PerformanceEntry) => {
        emitCoreVitals(entry)
      })
    })

    observer.observe({
      entryTypes,
      buffered: true,
    })
  }

  /**
   * TTFB
   */
  // 用户发起请求 (requestStart) 到 收到第一个字节响应 (responseStart) 之间的时间
  // 兼容 SPA
  const getTTFB = () => {
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as PerformanceNavigationTiming[]) {
        const {
          requestStart,
          responseStart,
          domInteractive,
          loadEventEnd,
        } = entry
        const value = responseStart - requestStart
        eventBus.emit('bottle-monitor:transport', CATEGORY.VITALS, {
          category: CATEGORY.VITALS,
          type: VITALS.TTFB,
          emitTime: getDate(new Date()),
          entryName: 'navigation', // entryType
          value,
          extra: {
            requestStart,
            responseStart,
            domInteractive,
            loadEventEnd,
          },
        })
      }
    })

    observer.observe({ type: 'navigation', buffered: true })
  }

  /**
   * RESOURCE
   */
  const isCached = (r: PerformanceResourceTiming) => {
    // from disk/memory cache
    if (r.transferSize === 0 && r.encodedBodySize > 0)
      return true

    // 跨域且未设置 Timing-Allow-Origin 的, transferSize = 0, encodedBodySize = 0

    // 304 Not Modified
    if (r.transferSize > 0 && r.encodedBodySize > 0) {
      return r.transferSize < r.encodedBodySize
    }

    return false
  }

  const getResourceCacheHitRate = (
    dynamic: boolean = false,
    customResourceTypes: string[] = [],
  ) => {
    const resources = performance.getEntriesByType(
      'resource',
    ) as PerformanceResourceTiming[]

    const resourceTypes = [
      ...DEFAULT_STATIC_TYPES,
      ...(dynamic ? DEFAULT_DYNAMIC_TYPES : []),
      ...customResourceTypes,
    ]
    const cached = resources.filter(
      r => resourceTypes.includes(r.initiatorType) && isCached(r),
    )

    eventBus.emit('bottle-monitor:transport', CATEGORY.VITALS, {
      category: CATEGORY.VITALS,
      type: VITALS.Resource,
      emitTime: getDate(new Date()),
      entryName: 'resource',
      value: resources.length ? cached.length / resources.length : 0,
    })
  }

  /**
   * INP
   */
  function getINP() {
    const interactions: number[] = []
    let INP = 0

    const observer = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry) => {
        if (
          [
            'click',
            'dblclick',
            'keydown',
            'keyup',
            'mousedown',
            'mouseup',
            'pointerdown',
            'pointerup',
            'pointercancel',
            'input',
            'change',
            'beforeinput',
          ].includes(entry.name)
        ) {
          interactions.push(entry.duration)
        }
      })
    })

    observer.observe({
      type: 'event',
      // @ts-ignore
      durationThreshold: 16,
      buffered: true,
    })

    const analyse = () => {
      if (interactions.length === 0)
        return

      if (interactions.length < 50) {
        INP = Math.max(...interactions)
      }
      else {
        const filtered: number[] = []
        for (let i = 0; i < interactions.length; i += 50) {
          const group = interactions.slice(i, i + 50)
          if (group.length === 0)
            continue
          const worst = Math.max(...group)
          group.splice(group.indexOf(worst), 1)
          filtered.push(...group)
        }
        const sorted = [...filtered].sort((a, b) => a - b)
        INP = sorted[Math.floor(sorted.length * 0.98)]
      }

      console.log('INP value:', INP)

      eventBus.emit('bottle-monitor:transport', CATEGORY.VITALS, {
        category: CATEGORY.VITALS,
        type: VITALS.INP,
        emitTime: getDate(new Date()),
        entryName: 'INP',
        value: INP,
      })
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden')
        analyse()
    })
    window.addEventListener('beforeunload', analyse)
    window.addEventListener('pagehide', analyse)
  }

  /**
   * 获取关键元素绘制时间
   * PerformanceObserver + entryType = 'element' + elementtiming. 局限于 img、p
   */
  const isInScreen = (dom: HTMLElement) => {
    const { top, left, bottom, right } = dom.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    return (
      top < viewportHeight
      && bottom > 0
      && left < viewportWidth
      && right > 0
    )
  }

  const getPaintTime = (targets: string[]) => {
    let FSP = performance.now()
    targets.forEach((selector) => {
      const observer = new MutationObserver((mutationList) => {
        mutationList.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement))
              return
            if (
              (node.matches(selector)
                || node.querySelector(selector))
              && isInScreen(node)
            ) {
              console.log('元素更新: ', selector, node)
              FSP = performance.now()
              // observer.disconnect()
            }
          })
        })
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      })
    })
  }

  /**
   * FSP
   */
  function getFSP(selectors: string[]) {
    const results: Record<string, number> = {}
    let remain = selectors.length

    selectors.forEach((selector) => {
      const el = document.querySelector(selector)
      if (!el) {
        remain--
        return
      }

      const io = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              const time = performance.now()
              results[selector] = time
              remain--
              observer.disconnect()

              if (remain === 0) {
                eventBus.emit(
                  'bottle-monitor:transport',
                  CATEGORY.VITALS,
                  {
                    category: CATEGORY.VITALS,
                    type: VITALS.FSP,
                    emitTime: getDate(new Date()),
                    value: Math.max(
                      ...Object.values(results),
                    ),
                    extra: {
                      LCP: '',
                    },
                  },
                )
              }
            })
          }
        })
      })

      io.observe(el)
    })
  }

  /**
   * LONGTASK
   */
  const getLongTask = () => {
    const observer = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry) => {
        eventBus.emit('bottle-monitor:transport', CATEGORY.VITALS, {
          category: CATEGORY.VITALS,
          type: VITALS.LONGTASK,
          emitTime: getDate(new Date()),
          entryName: 'longtask',
          entry,
        })
      })
    })

    observer.observe({
      type: 'longtask',
      buffered: true,
    })
  }

  window.addEventListener('load', () => {
    lastLCP && emitLCP(lastLCP)
    getResourceCacheHitRate()
  })

  const getWebVitals = (collectTarget: string[]) => {
    getTTFB()
    getCoreWebVitals([
      'paint',
      'largest-contentful-paint',
      'first-input',
      'layout-shift',
    ])
  }

  const initPlugin = () => {
    const collectTarget: string[] = []
    // getWebVitals(collectTarget)
    // getLongTask()
    // getFPS()
    // getINP()
    // getPaintTime(['.data-block'])
    setTimeout(() => getFSP(['.data-block']))
  }

  initPlugin()
}
