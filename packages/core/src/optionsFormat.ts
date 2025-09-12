import type { AbnormalPlugin, BreadcrumbType, Plugin, PluginFormatted, UserPlugin, VitalsPlugin } from '@bottle-monitor/types'

function formatPluginOptions(
  pluginOptions: Plugin,
  defaultOptions: Record<string, any>,
  breadcrumbType: BreadcrumbType,
): PluginFormatted {
  const defaultBreadcrumbs = { breadcrumbType, capacity: 20 }
  const { options = {}, breadcrumbs = {} } = pluginOptions
  return {
    pluginName: breadcrumbType,
    options: { ...defaultOptions, ...options },
    breadcrumbs: { ...defaultBreadcrumbs, ...breadcrumbs },
  }
}

// 导出具体插件的包装函数
export function formatUserOptions(userOptions: UserPlugin) {
  let clickContainers = userOptions.options.clickContainers
  // 把容器标识符格式化
  const ids: string[] = []
  const classes: string[] = []
  const datasets: string[] = []
  if (clickContainers?.length) {
    userOptions.options.clickContainers?.forEach((item) => {
      if (item.startsWith('#')) {
        ids.push(item.slice(1))
      }
      else if (item.startsWith('.')) {
        classes.push(item.slice(1))
      }
      else if (item.startsWith('[data-track')) {
        datasets.push(item.slice(10))
      }
    })

    clickContainers = {
      ids,
      classes,
      datasets,
    }
  }

  return formatPluginOptions(userOptions, {
    click: true,
    clickContainers: [],
    ids,
    classes,
    datasets,
    network: true,
    hash: true,
    history: true,
    pageView: true,
    uniqueVisitor: true,
    deviceInfo: true,
    filterXhrUrlRegExp: /.*/,
  }, 'user')
}

export function formatVitalsOptions(vitalsOptions: VitalsPlugin) {
  return formatPluginOptions(vitalsOptions, {
    FCP: true,
    CLS: true,
    INP: true,
    FID: true,
    FPS: true,
    FSP: true,
    LCP: true,
    Resource: true,
    TTFB: true,
    LONGTASK: true,
    FSPContainers: [],
  }, 'vitals')
}

export function formatAbnormalOptions(abnormalOptions: AbnormalPlugin) {
  return formatPluginOptions(abnormalOptions, {
    network: true,
    codeError: true,
    unhandledrejection: true,
    resource: true,
    whitescreen: true,
    repeatError: true,
  }, 'abnormal')
}
