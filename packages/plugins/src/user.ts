import type { EventBusReturn, UserOptions } from '@bottle-monitor/types'
import { CATEGORY, USER } from '@bottle-monitor/types'

import { getDate } from '@bottle-monitor/utils'
import { nanoid } from 'nanoid'
import { UAParser } from 'ua-parser-js'

export function UserPlugin({
  eventBus,
  userOptions,
}: {
  eventBus: EventBusReturn
  userOptions: UserOptions
}) {
  let currentURL = location.href
  const visitorId = nanoid()

  /**
   * DEVICE_INFO
   */
  const emitDeviceInfo = () => {
    const uaMessage = UAParser()
    const deviceInfo = {
      browser: uaMessage.browser.name,
      browserVersion: uaMessage.browser.version,
      os: uaMessage.os.name,
      osVersion: uaMessage.os.version,
      ua: uaMessage.ua,
      device: uaMessage.device,
    }

    eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {
      type: USER.DEVICE,
      emitTime: getDate(new Date()),
      deviceInfo,
    })
  }

  /**
   * PAGEVIEW、ROUTEVIEW
   */
  const emitFirstPageView = () => {
    eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {
      type: USER.HISTORY_ROUTE,
      emitTime: getDate(new Date()),
      method: 'pushState',
      from: currentURL,
      to: currentURL,
    })
  }

  const emitUniqueVisitor = () => {
    eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {

      type: USER.UNIQUEVIEW,
      url: location.href,
      visitorId,
      emitTime: getDate(new Date()),
    })
  }

  /**
   * ROUTE
   */
  const captureHistoryRoute = () => {
    // 重写 pushState
    const rowPush = history.pushState
    history.pushState = (...args) => {
      const newURL = location.href
      rowPush.apply(history, args)
      eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {

        type: USER.HISTORY_ROUTE,
        emitTime: getDate(new Date()),
        method: 'pushState',
        from: currentURL,
        to: newURL,
      })
      currentURL = newURL
    }
    // 重写 replaceState
    const rowReplace = history.replaceState
    history.replaceState = (...args) => {
      const newURL = location.href
      rowReplace.apply(history, args)
      eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {

        type: USER.HASH_ROUTE,
        emitTime: getDate(new Date()),
        method: 'replaceState',
        from: currentURL,
        to: newURL,
      })
      currentURL = newURL
    }

    window.addEventListener('popstate', (e: PopStateEvent) => {
      eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {

        type: USER.HISTORY_ROUTE,
        emitTime: getDate(new Date()),
        method: 'popstate',
        state: e.state,
      })
    })
  }

  /**
   * ISSUE:
   * 1. hash 改变了 history 也会监听到
   * 2. 跳转到别的页面，整个界面刷新后不知道收到消息没
   * 3. 不知道从哪里跳到哪里去了
   *
   * 1. 对于 errorPlugin, 有些静默选项未生效
   */
  const captureHashRoute = () => {
    window.addEventListener('hashchange', (e: HashChangeEvent) => {
      eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {

        type: USER.HASH_ROUTE,
        emitTime: getDate(new Date()),
        from: e.oldURL,
        to: e.newURL,
      })
    })
  }

  /**
   * REQUEST
   */
  const captureXHRRequest = () => {
    const originalOpen = XMLHttpRequest.prototype.open

    XMLHttpRequest.prototype.open = function (
      this: XMLHttpRequest,
      method: string,
      url: string | URL,
      async?: boolean,
      username?: string | null,
      password?: string | null,
    ): void {
      const start = performance.now()
      this.addEventListener('loadend', () => {
        eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {

          type: USER.XHR,
          emitTime: getDate(new Date()),
          method,
          url,
          status: this.status,
          duration: this.responseURL ? performance.now() - start : 0,
        })
      })
      return originalOpen.apply(this, [
        method,
        url,
        async ?? true,
        username,
        password,
      ])
    }
  }

  const captureFetchRequest = () => {
    const originalFetch = window.fetch

    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const start = performance.now()

      try {
        const res = await originalFetch(...args)

        eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {

          type: USER.FETCH,
          emitTime: getDate(new Date()),
          url: args[0],
          method: args[1]?.method || 'GET',
          status: res.status,
          duration: performance.now() - start,
        })

        return res
      }
      catch (err) {
        eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {

          type: USER.FETCH,
          emitTime: getDate(new Date()),
          url: args[0],
          method: args[1]?.method || 'GET',
          error: err,
          duration: performance.now() - start,
        })
        throw err
      }
    }
  }

  /**
   * CLICK
   */
  const captureUserClick = (clickContainers: any) => {
    const { ids, classes, datasets } = clickContainers
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const id = target.id
      const dataset = target.dataset?.role

      const classTokens = Array.from(target.classList)
      const hitClass = classes?.some((cls: string) => classTokens.includes(cls)) ?? false

      if (!ids.includes(id) && hitClass && !datasets.includes(dataset)) {
        return
      }

      eventBus.emit('bottle-monitor:transport', CATEGORY.USER, {
        type: USER.CLICK,
        emitTime: getDate(new Date()),
        clickTarget: {
          tag: target.tagName,
          id: target.id,
          class: target.className,
          url: location.href,
        },
        clickPosition: {
          x: e.clientX,
          y: e.clientY,
          pageX: e.pageX,
          pageY: e.pageY,
        },
      })
    })
  }

  const initPlugin = () => {
    const { hash, history, click, pageView, uniqueVisitor, network, clickContainers = [] } = userOptions
    // deviceInfo && emitDeviceInfo()
    if (pageView) {
      emitFirstPageView()
      hash && captureHashRoute()
      history && captureHistoryRoute()
    }
    uniqueVisitor && emitUniqueVisitor()
    click && captureUserClick(clickContainers) // 类型到时候再细化吧
    if (network) {
      captureFetchRequest()
      captureXHRRequest()
    }
  }

  initPlugin()
}
