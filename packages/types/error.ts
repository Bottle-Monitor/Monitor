import type { EventBusReturn } from './eventBus'
import type { InitOptions } from './options'

export interface ErrorPluginReturn {
  capturePromise: (eventBus: EventBusReturn, options: InitOptions) => void
  captureCodeError: (eventBus: EventBusReturn, options: InitOptions) => void
}

/**
 * 错误堆栈信息
 */
export interface ErrorStackFrame {
  filename: string // 文件名
  functionName: string // 函数名
  lineNumber: number // 行号
  columnNumber: number // 列号
  source: string // 源码
  args?: any[] // 函数参数
}

/**
 * 错误类型
 */
export type ErrorType
  = | 'javascript' // JavaScript 运行时错误
    | 'promise' // Promise 未捕获错误
    | 'resource' // 资源加载错误
    | 'network' // 网络请求错误
    | 'white-screen' // 白屏错误
    | 'custom' // 自定义错误

/**
 * 错误严重级别
 */
export type ErrorLevel = 'fatal' | 'error' | 'warning' | 'info'

/**
 * 基础错误信息
 */
export interface BaseErrorInfo {
  type: ErrorType
  level: ErrorLevel
  message: string
  timestamp: number
  url: string // 出错页面URL
  userId?: string
  sessionId?: string
}

/**
 * JavaScript 错误信息
 */
export interface JavaScriptErrorInfo extends BaseErrorInfo {
  type: 'javascript'
  filename: string
  lineNumber: number
  columnNumber: number
  stack: ErrorStackFrame[]
  errorName: string
  source?: string // 错误源码
}

/**
 * Promise 错误信息
 */
export interface PromiseErrorInfo extends BaseErrorInfo {
  type: 'promise'
  reason: any // 拒绝原因
  stack?: ErrorStackFrame[]
}

/**
 * 资源错误信息
 */
export interface ResourceErrorInfo extends BaseErrorInfo {
  type: 'resource'
  resourceType: 'script' | 'image' | 'stylesheet' | 'font' | 'media' | 'other'
  resourceUrl: string
  statusCode?: number
  crossOrigin?: boolean
}

/**
 * 网络错误信息
 */
export interface NetworkErrorInfo extends BaseErrorInfo {
  type: 'network'
  requestUrl: string
  requestMethod: string
  statusCode?: number
  responseTime?: number
  errorType: 'timeout' | 'abort' | 'network' | 'cors' | 'other'
}

/**
 * 白屏错误信息
 */
export interface WhiteScreenErrorInfo extends BaseErrorInfo {
  type: 'white-screen'
  score: number // 白屏得分
  threshold: number // 检测阈值
  samplingMethod: 'canvas' | 'element' | 'mutation'
  details: {
    samplingPoints?: Array<{ x: number, y: number, isWhite: boolean }>
    keyElements?: string[]
    mutations?: number
  }
}

/**
 * 自定义错误信息
 */
export interface CustomErrorInfo extends BaseErrorInfo {
  type: 'custom'
  category?: string
  extra?: Record<string, any>
}

/**
 * 联合错误类型
 */
export type ErrorInfo
  = | JavaScriptErrorInfo
    | PromiseErrorInfo
    | ResourceErrorInfo
    | NetworkErrorInfo
    | WhiteScreenErrorInfo
    | CustomErrorInfo
