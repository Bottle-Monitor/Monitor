export interface EventBusReturn {
  emit: (event: string, ...args: any[]) => void
  on: (event: string, callback: (...args: any[]) => void) => void
  off: (event: string, callback?: (...args: any[]) => void) => void
  once: (event: string, callback: (...args: any[]) => void) => void
}
