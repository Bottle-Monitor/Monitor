import { isFunction } from './type'

export function runHook<T extends (...args: any[]) => any>(
  hook: T | undefined,
  ...args: Parameters<T>
): ReturnType<T> | void {
  if (isFunction(hook)) {
    return hook(...args)
  }
}
