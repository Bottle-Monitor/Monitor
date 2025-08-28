import type {
  EventBusReturn,
  InitOptions,
} from '@bottle-monitor/types'
import {
  ABNORMAL,
  CATEGORY,
} from '@bottle-monitor/types'
import { getDate } from '@bottle-monitor/utils'
import ErrorStackParser from 'error-stack-parser'

// TODO: 后续可以细化为只传递所需插件的选项，将 initOptions 拆解为按插件区分的部分
export function ErrorPlugin({
  eventBus,
  initOptions,
}: {
  eventBus: EventBusReturn
  initOptions: InitOptions
}) {
  const capturePromise = () => {
    window.addEventListener('unhandledrejection', (ev): void => {
      eventBus.emit('bottle-monitor:transport', CATEGORY.ABNORMAL, {
        category: CATEGORY.ABNORMAL,
        type: ABNORMAL.UNHANDLEDREJECTION,
        emitTime: getDate(new Date()),
        message: ev.reason,
        stack: ErrorStackParser.parse(ev.reason.stack),
      })
    })
  }

  /**
   * try-catch 只能捕获同步代码的异常，于是采用 error 事件监听全局
   * 资源错误不冒泡，必须在捕获阶段获取
   */
  const handleCodeError = (e: ErrorEvent) => {
    console.log('cpatured code error!')
    eventBus.emit('bottle-monitor:transport', CATEGORY.ABNORMAL, {
      category: CATEGORY.ABNORMAL,
      type: ABNORMAL.CODE,
      emitTime: getDate(new Date()),
      message: e.error.message,
      stack: ErrorStackParser.parse(e.error.stack),
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
    })
  }

  const handleResourceError = (e: ErrorEvent) => {
    console.log('cpatured resource error!')
    const target = e.target as
      | HTMLScriptElement
      | HTMLLinkElement
      | HTMLImageElement

    eventBus.emit('bottle-monitor:transport', CATEGORY.ABNORMAL, {
      category: CATEGORY.ABNORMAL,
      type: ABNORMAL.RESOURCE,
      emitTime: getDate(new Date()),
      message: JSON.stringify({
        resourceType: target.tagName,
        resourceURL:
                    (target as HTMLImageElement).src
                    || (target as HTMLLinkElement).href,
      }),
    })
  }

  const captureError = () => {
    window.addEventListener(
      'error',
      (e) => {
        if (e.error) {
          handleCodeError(e)
        }
        else {
          handleResourceError(e)
        }
      },
      true,
    )
  }

  const captureWhiteScreen = () => {
    // 采用 canvas 判断白屏
  }

  const initPlugin = () => {
    const { resource, codeError, unhandledrejection, whitescreen }
            = initOptions.silent || {}

    if (!resource || !codeError)
      captureError()
    !unhandledrejection && capturePromise()
    !whitescreen && captureWhiteScreen()
  }

  initPlugin()
}
