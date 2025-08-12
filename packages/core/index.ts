import { TrackerPlugin } from "@bottle-monitor/types/tracker"
import Tracker from "./tracker"
import { InitOptions } from "@bottle-monitor/types"

// 导出初始化函数, 把实例塞到 window 里
let globalInstance: TrackerPlugin | null = null

export const bottleMonitorInit = (options: InitOptions) => {
    if (!globalInstance) {
        globalInstance = Tracker()
        globalInstance.init(options)
    }else {
        console.warn('bottle-monitor 已初始化');
    }
    return globalInstance
}