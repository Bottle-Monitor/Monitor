import type { AbnormalPlugin, InitOptions, TrackerPlugin, UserPlugin, VitalsPlugin } from '@bottle-monitor/types'
import { CATEGORY } from '@bottle-monitor/types'
import { formatAbnormalOptions, formatUserOptions, formatVitalsOptions } from './src/optionsFormat'
import Tracker from './src/tracker'

// 导出初始化函数, 把实例塞到 window 里
let globalInstance: TrackerPlugin | null = null
const pluginMap = new Map()

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

export function userPlugin(options: UserPlugin) {
  if (pluginMap.get(CATEGORY.USER)) {
    console.warn('UserPlugin 已经初始化')
  }
  else {
    pluginMap.set(CATEGORY.USER, true)
  }
  return formatUserOptions(options)
}

export function vitalsPlugin(options: VitalsPlugin) {
  if (pluginMap.get(CATEGORY.VITALS)) {
    console.warn('VitalsPlugin 已经初始化')
  }
  else {
    pluginMap.set(CATEGORY.VITALS, true)
  }
  return formatVitalsOptions(options)
}

export function abnormalPlugin(options: AbnormalPlugin) {
  if (pluginMap.get(CATEGORY.ABNORMAL)) {
    console.warn('AbnormalPlugin 已经初始化')
  }
  else {
    pluginMap.set(CATEGORY.ABNORMAL, true)
  }
  return formatAbnormalOptions(options)
}
