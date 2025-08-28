import type { EventBusReturn } from './eventBus'
import type { InitOptions } from './options'

export interface ErrorPluginReturn {
  capturePromise: (eventBus: EventBusReturn, options: InitOptions) => void
  captureCodeError: (eventBus: EventBusReturn, options: InitOptions) => void
}
