import type { BreadcrumbType } from './options'

/**
 * 收到接口请求数据
 */
type RequestMethod = 'GET' | 'POST' | 'DELETE' | 'PUT'
export interface RequestData {
  url: string // 接口请求地址
  code: number // 响应码
  status: string // 请求状态失败/超时/成功
  method: RequestMethod
  response: any // 响应体
  time: number // 响应耗时
}

/**
 * 性能指标数据
 */
export interface WebVitalsData {
  type: string // 性能指标
  value: number // 数值
  rating: 'good' | 'normal' | 'bad' // 评分
}

/**
 * 设备信息
 */
export interface DeviceData {
  ua: string
  os: string // 操作系统
  osVersion: string
  browser: string
  browserVersion: string
  device: 'pc' | 'mobile'
}

/**
 * 资源信息
 */
export interface ResourceData {
  src?: string
  href?: string
  localName?: string
}

/**
 * 行为栈数据
 */
export interface BreadcrumbData {
  type: string // 具体监听项 FCP、codeError、click...
  timestamp: number // 收集时间
  data: RequestData | DeviceData | WebVitalsData // 收集的信息 性能指标、具体报错信息、用户行为...
}

/**
 * 路由数据
 */
export interface RouteData {
  from: string
  to: string
}

/**
 * 上报数据格式
 */
export interface TransportData {
  projectId?: string // 项目标识
  userId: string // 用户 id
  pageUrl: string // 页面地址
  timestamp: number // 上报时间
  sdkVersion: string
  breadcrumbType: BreadcrumbType // 行为栈类型 vitals、user...
  breadcrumbId: string // 行为栈标识
  breadcrumb: BreadcrumbData[] // 行为栈
}
