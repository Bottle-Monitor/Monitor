import { EventBusReturn } from './eventBus'
import { InitOptions } from './options'

export interface ErrorPluginReturn {
    capturePromise: (eventBus: EventBusReturn, options: InitOptions) => void
    captureCodeError: (eventBus: EventBusReturn, options: InitOptions) => void
}
