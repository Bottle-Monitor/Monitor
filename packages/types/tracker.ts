import { InitOptions } from './options'

/**
 * 事件总线 事件类型
 */
export interface Events {
    track: (...args: any[]) => void
}

/**
 * 插件格式
 */
export interface TrackerPlugin {
    init: (initOptions: InitOptions) => void
    transform?: (data: any) => void // 自定义数据处理
    destroy?: () => void // 卸载
}
