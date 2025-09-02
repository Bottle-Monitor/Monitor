import type { EventBusEvents, EventBusReturn } from '@bottle-monitor/types'

/**
 * 支持自动事件名 + 回调参数提示的类型安全事件总线
 *
 * 关键特性:
 * 1. 泛型约束确保事件类型安全
 * 2. Parameters<T[K]> 推导参数类型
 * 3. 异步事件处理支持
 * 4. 完整的订阅/取消订阅机制
 */
function EventBus<T extends Record<string, (...args: any[]) => void> = EventBusEvents>(): EventBusReturn<T> {
  // 事件监听器存储
  const events: {
    [K in keyof T]?: T[K][]
  } = {}

  // 发布事件 - 异步执行所有监听器
  const emit = async <K extends keyof T>(
    event: K,
    ...args: Parameters<T[K]>
  ): Promise<void> => {
    const listeners = events[event]
    if (!listeners || listeners.length === 0) {
      return
    }

    // 并行执行所有监听器，提高性能
    const promises = listeners.map(async (callback) => {
      try {
        await callback(...args)
      }
      catch (error) {
        console.error(`Error in event listener for "${String(event)}":`, error)
      }
    })

    await Promise.all(promises)
  }

  // 订阅事件
  const on = <K extends keyof T>(event: K, callback: T[K]): void => {
    if (!events[event]) {
      events[event] = []
    }
    events[event]!.push(callback)
  }

  // 取消订阅
  const off = <K extends keyof T>(event: K, callback?: T[K]): void => {
    if (!events[event]) {
      return
    }

    if (!callback) {
      // 如果没有指定回调，清除该事件的所有监听器
      delete events[event]
    }
    else {
      // 移除指定的回调
      events[event] = events[event]!.filter(cb => cb !== callback)

      // 如果没有监听器了，删除该事件
      if (events[event]!.length === 0) {
        delete events[event]
      }
    }
  }

  // 单次订阅
  const once = <K extends keyof T>(event: K, callback: T[K]): void => {
    const wrapper: T[K] = ((...args: Parameters<T[K]>) => {
      off(event, wrapper)
      return callback(...args)
    }) as T[K]

    on(event, wrapper)
  }

  return {
    emit,
    on,
    once,
    off,
  }
}

export default EventBus
