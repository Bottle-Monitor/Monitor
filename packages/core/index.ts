import type { InitOptions, TrackerPlugin } from '@bottle-monitor/types'
import Tracker from './src/tracker'

// 导出初始化函数, 把实例塞到 window 里
let globalInstance: TrackerPlugin | null = null

export function bottleMonitorInit(options: InitOptions) {
  if (!globalInstance) {
    globalInstance = Tracker()
    globalInstance.init(options)
  }
  else {
    console.warn('bottle-monitor 已初始化')
  }
  return globalInstance
}
