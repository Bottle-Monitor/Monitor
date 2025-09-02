// 配置和工具导出
// 插件创建函数
import type { AbnormalPlugin, UserPlugin, VitalsPlugin } from '@bottle-monitor/types'
import { CATEGORY } from '@bottle-monitor/types'
import { formatAbnormalOptions, formatUserOptions, formatVitalsOptions } from './src/optionsFormat'

export * from './src/config'
// 核心功能导出
export { default as EventBus } from './src/eventBus'
export * from './src/global'

export { BottleMonitor, bottleMonitorInit, getBottleMonitor } from './src/init'
export * from './src/optionsFormat'
// 兼容性导出 - 保持向后兼容
export { default as Tracker } from './src/tracker'

export { default as Transport } from './src/transport'

// 插件注册状态
const pluginMap = new Map()

/**
 * 创建用户行为监控插件配置
 */
export function userPlugin(options: UserPlugin) {
  if (pluginMap.get(CATEGORY.USER)) {
    console.warn('UserPlugin 已经初始化')
  }
  else {
    pluginMap.set(CATEGORY.USER, true)
  }
  return formatUserOptions(options)
}

/**
 * 创建性能监控插件配置
 */
export function vitalsPlugin(options: VitalsPlugin) {
  if (pluginMap.get(CATEGORY.VITALS)) {
    console.warn('VitalsPlugin 已经初始化')
  }
  else {
    pluginMap.set(CATEGORY.VITALS, true)
  }
  return formatVitalsOptions(options)
}

/**
 * 创建异常监控插件配置
 */
export function abnormalPlugin(options: AbnormalPlugin) {
  if (pluginMap.get(CATEGORY.ABNORMAL)) {
    console.warn('AbnormalPlugin 已经初始化')
  }
  else {
    pluginMap.set(CATEGORY.ABNORMAL, true)
  }
  return formatAbnormalOptions(options)
}

// 类型导出
export type {
  AbnormalOptions,
  BreadcrumbOption,
  BreadcrumbOptions,
  BreadcrumbType,
  EventBusReturn,
  Hook,
  InitOptions,
  Plugin,
  PluginFormatted,
  Plugins,
  PluginsFormatted,
  TransportReturn,
  UserOptions,
  VitalsOptions,
} from '@bottle-monitor/types'
