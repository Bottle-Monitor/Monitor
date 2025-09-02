import type { BreadcrumbType } from './index'

/**
 * 事件总线类型约束 - 确保类型安全的事件系统
 */
export interface EventBusEvents extends Record<string, (...args: any[]) => void> {
  'bottle-monitor:transport': (category: BreadcrumbType, data: any) => void
  'bottle-monitor:error': (error: Error) => void
  'bottle-monitor:vitals': (metric: string, value: number) => void
  'bottle-monitor:user': (action: string, data: any) => void
  'bottle-monitor:custom': (event: string, data: any) => void
}

/**
 * 泛型事件总线接口 - 支持类型安全的事件系统
 */
export interface EventBusReturn<T extends Record<string, (...args: any[]) => void> = EventBusEvents> {
  emit: <K extends keyof T>(event: K, ...args: Parameters<T[K]>) => Promise<void>
  on: <K extends keyof T>(event: K, callback: T[K]) => void
  off: <K extends keyof T>(event: K, callback?: T[K]) => void
  once: <K extends keyof T>(event: K, callback: T[K]) => void
}
