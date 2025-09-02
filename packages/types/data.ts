import type { BreadcrumbType } from './options'

/**
 * HTTP请求方法
 */
export type RequestMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | 'HEAD' | 'OPTIONS'

/**
 * 请求状态
 */
export type RequestStatus = 'success' | 'error' | 'timeout' | 'abort'

/**
 * 网络请求数据
 */
export interface RequestData {
  url: string // 接口请求地址
  method: RequestMethod
  status: RequestStatus // 请求状态
  statusCode?: number // HTTP状态码
  responseTime: number // 响应耗时 (ms)
  requestSize?: number // 请求大小 (bytes)
  responseSize?: number // 响应大小 (bytes)
  startTime: number // 请求开始时间
  endTime: number // 请求结束时间
  errorMessage?: string // 错误信息
}

/**
 * 性能评级
 */
export type PerformanceRating = 'good' | 'needs-improvement' | 'poor'

/**
 * Core Web Vitals 指标数据
 */
export interface WebVitalsData {
  name: string // 指标名称 (FCP, LCP, CLS, FID, INP)
  value: number // 指标数值
  rating: PerformanceRating // 性能评级
  delta: number // 与上次测量的差值
  id: string // 唯一标识符
  entries: PerformanceEntry[] // 相关的性能条目
  navigationType?: string // 导航类型
}

/**
 * 自定义性能指标
 */
export interface CustomVitalsData {
  name: string // 指标名称
  value: number
  unit?: string // 单位
  timestamp: number
  metadata?: Record<string, any>
}

/**
 * 设备类型
 */
export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'unknown'

/**
 * 网络类型
 */
export type NetworkType = 'wifi' | '4g' | '3g' | '2g' | 'slow-2g' | 'offline' | 'unknown'

/**
 * 设备信息
 */
export interface DeviceData {
  userAgent: string
  language: string
  platform: string

  // 操作系统信息
  os: {
    name: string
    version: string
  }

  // 浏览器信息
  browser: {
    name: string
    version: string
    engine: string
  }

  // 设备信息
  device: {
    type: DeviceType
    vendor?: string
    model?: string
  }

  // 屏幕信息
  screen: {
    width: number
    height: number
    availWidth: number
    availHeight: number
    colorDepth: number
    pixelDepth: number
    orientation?: string
  }

  // 网络信息
  network?: {
    type: NetworkType
    effectiveType?: string
    downlink?: number
    rtt?: number
    saveData?: boolean
  }

  // 内存信息
  memory?: {
    deviceMemory?: number
    usedJSHeapSize?: number
    totalJSHeapSize?: number
    jsHeapSizeLimit?: number
  }
}

/**
 * 资源类型
 */
export type ResourceType = 'script' | 'stylesheet' | 'image' | 'font' | 'document' | 'other'

/**
 * 资源信息
 */
export interface ResourceData {
  name: string // 资源名称
  url: string // 资源URL
  type: ResourceType // 资源类型
  size?: number // 资源大小
  duration: number // 加载耗时
  startTime: number // 开始时间
  responseEnd: number // 响应结束时间
  transferSize?: number // 传输大小
  encodedBodySize?: number // 编码后大小
  decodedBodySize?: number // 解码后大小
  cacheHit?: boolean // 是否命中缓存
  protocol?: string // 协议
}

/**
 * 错误信息
 */
export interface ErrorData {
  message: string // 错误信息
  stack?: string // 错误堆栈
  filename?: string // 文件名
  lineno?: number // 行号
  colno?: number // 列号
  source?: string // 错误源码
  name?: string // 错误名称
  cause?: any // 错误原因
}

/**
 * 用户交互数据
 */
export interface UserInteractionData {
  type: 'click' | 'input' | 'scroll' | 'navigation' | 'page_view'
  target?: string // 目标元素
  selector?: string // CSS选择器
  xpath?: string // XPath路径
  text?: string // 元素文本
  value?: string // 输入值
  url?: string // 页面URL
  referrer?: string // 来源页面
  coordinates?: {
    x: number
    y: number
  }
}

/**
 * 白屏检测数据
 */
export interface WhiteScreenData {
  isWhiteScreen: boolean // 是否白屏
  score: number // 白屏得分 (0-1)
  reason: string // 检测原因
  samplingPoints: Array<{
    x: number
    y: number
    isWhite: boolean
  }> // 采样点
}

/**
 * 行为栈数据 - 统一的数据格式
 */
export interface BreadcrumbData {
  type: string // 具体监听项 FCP、codeError、click...
  category: BreadcrumbType // 分类
  timestamp: number // 收集时间
  level: 'info' | 'warning' | 'error' | 'fatal' // 严重程度
  message?: string // 描述信息
  data:
    | RequestData
    | DeviceData
    | WebVitalsData
    | CustomVitalsData
    | ResourceData
    | ErrorData
    | UserInteractionData
    | WhiteScreenData
    | Record<string, any> // 自定义数据
}

/**
 * 路由数据
 */
export interface RouteData {
  from: string // 来源路由
  to: string // 目标路由
  mode: 'hash' | 'history' // 路由模式
  timestamp: number // 切换时间
  duration?: number // 切换耗时
}

/**
 * 上报数据格式 - 统一的数据传输格式
 */
export interface TransportData {
  // 基础信息
  projectId?: string // 项目标识
  userId: string // 用户 ID
  sessionId: string // 会话 ID
  pageUrl: string // 页面地址
  timestamp: number // 上报时间
  sdkVersion: string // SDK 版本

  // 行为栈信息
  breadcrumbType: BreadcrumbType // 行为栈类型 vitals、user...
  breadcrumbId: string // 行为栈标识
  breadcrumb: BreadcrumbData[] // 行为栈数据

  // 设备和环境信息
  device?: DeviceData // 设备信息

  // 页面信息
  pageInfo?: {
    title: string // 页面标题
    referrer: string // 来源页面
    visibility: 'visible' | 'hidden' | 'prerender' // 页面可见性
  }

  // 额外元数据
  metadata?: Record<string, any>
}
