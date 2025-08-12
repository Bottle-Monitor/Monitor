/**
 * 支持自动事件名 + 回调参数提示, 关键在于:
 *  1. <T extends Record<string, (...args: any[]) => void>> 将对象的键值映射
 *  2. Parameters<T[K]> 推导参数回调
 */
export interface EventBusReturn {
    emit: (event: string, ...args: any[]) => void
    on: (event: string, callback: (...args: any[]) => void) => void
    off: (event: string, callback?: (...args: any[]) => void) => void
    once: (event: string, callback: (...args: any[]) => void) => void
}

const EventBus = <T extends Record<string, (...args: any[]) => void>>() => {
    // 事件列表
    const events: {
        [k in keyof T]?: T[k][]
    } = {}

    // 发布事件
    const emit = async <K extends keyof T>(
        event: K,
        ...args: Parameters<T[K]>
    ) => {
        if (!events[event]) return
        for (const cb of events[event]!) {
            await cb(...args)
        }
    }

    // 订阅事件
    const on = <K extends keyof T>(event: K, callback: T[K]) => {
        ;(events[event] ||= []).push(callback)
    }

    // 取消订阅
    const off = <K extends keyof T>(event: K, callback?: T[K]) => {
        if (!events[event]) return
        if (!callback) {
            delete events[event]
        } else {
            events[event] = events[event]!.filter((cb) => cb !== callback)
        }
    }

    // 单次订阅
    const once = <K extends keyof T>(event: K, callback: T[K]) => {
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
        off
    }
}

export default EventBus
