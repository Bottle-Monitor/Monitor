/**
 * 上报类型
 */
export enum USER {
  CLICK = 'click', // 点击
  HISTORY_ROUTE = 'history', // 路由
  HASH_ROUTE = 'hash',
  DEVICE = 'device', // 设备信息
  XHR = 'xhr', // 网络请求
  FETCH = 'fetch',
  UNIQUEVIEW = 'uv', // 唯一访客数
}

export enum VITALS {
  FCP = 'FCP',
  CLS = 'CLS',
  INP = 'INP',
  FID = 'FID',
  FPS = 'FPS',
  FSP = 'FSP',
  LCP = 'LCP',
  TTFB = 'TTFB',
  LONGTASK = 'longtask',
  Resource = 'resource',
}

export enum ABNORMAL {
  CODE = 'code', // 代码错误
  CUSTOM = 'custom', // 自定义错误
  UNHANDLEDREJECTION = 'unhandledRejection', // 未捕获错误
  RESOURCE = 'resource', // 资源加载错误
  WHITESCREEN = 'whitescreen', // 白屏
}

export enum CATEGORY {
  USER = 'user',
  VITALS = 'vitals',
  ABNORMAL = 'abnormal',
  CUSTOM = 'custom',
}

/**
 * BREADCRUMBS
 */
export type BreadcrumbType = 'user' | 'vitals' | 'abnormal' | 'custom'
export interface BreadcrumbOption {
  breadcrumbType?: BreadcrumbType
  breadcrumbId?: string // 行为栈标识, 自定义栈要有
  capacity?: number // 最大存储量，1 为立即上报
  uploadInterval?: number // 定时上报间隔
  perBeforePushBreadcrumb?: (data: any) => any // 不同队列的 hook
  perBeforeTransport?: (data: any) => any
}
export type BreadcrumbOptions = BreadcrumbOption[]

/**
 * GLOBAL_HOOKS
 */
export type Hook = Partial<{
  beforePushBreadcrumb: (data: any) => any // 行为栈添加前
  beforeTransport: (data: any) => any // 数据上报前
}>

/**
 * FRAME_WORK
 */
export type FrameWork = 'normal' | 'vue' | 'react'

/**
 * USER_PLUGIN
 */
export type UserOptions = Partial<{
  click: boolean // 监听点击
  clickContainers: string[] // 点击事件容器
  network: boolean // 监听网络请求
  hash: boolean
  history: boolean
  pageView: boolean // 检测 pv
  uniqueVisitor: boolean // 检测 uv
  deviceInfo: boolean // 记录设备信息
  filterXhrUrlRegExp: RegExp // 过滤接口请求的正则
}>

/**
 * WEB_VITALS_PLUGIN
 */
export type VitalsOptions = Partial<{
  FCP: boolean
  CLS: boolean
  INP: boolean
  FID: boolean
  FPS: boolean
  FSP: boolean
  LCP: boolean
  Resource: boolean
  TTFB: boolean
}>

/**
 * ABNORMAL_PLUGIN
 */
export type AbnormalOptions = Partial<{
  network: boolean // 监听接口错误
  codeError: boolean // 监听代码报错
  unhandledrejection: boolean // 监听未捕获的错误
  resource: boolean // 监听资源加载错误
  whitescreen: boolean // 检测白屏

  repeatError: boolean // 重复上报同一错误
  filterXhrUrlRegExp: RegExp // 过滤接口请求的正则
}>

export interface PluginBase<T> {
  options: T
  breadcrumbs: BreadcrumbOption
}

export type UserPlugin = PluginBase<UserOptions>
export type VitalsPlugin = PluginBase<VitalsOptions>
export type AbnormalPlugin = PluginBase<AbnormalOptions>
export interface CustomPlugin extends PluginBase<Record<string, any>> {
  [key: string]: any
}

/**
 * PLUGINS
 */
export type Plugin = UserPlugin | VitalsPlugin | AbnormalPlugin | CustomPlugin
export type Plugins = Plugin[]
export type PluginFormatted = (UserPlugin | VitalsPlugin | AbnormalPlugin | CustomPlugin) & {
  pluginName: BreadcrumbType
}
export type PluginsFormatted = PluginFormatted[]

/**
 * 初始化选项
 */
export interface InitOptions {
  dsnURL: string
  userId: string
  projectId?: string
  framework?: FrameWork // 项目框架
  plugins?: PluginsFormatted // 插件配置
  hooks?: Hook // 全局 hook
  [key: string]: any
}
