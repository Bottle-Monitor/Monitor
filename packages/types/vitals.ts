export interface LayoutShift extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
}

/**
 * Core Web Vitals 指标类型
 */
export type CoreWebVitalsMetric = 'FCP' | 'LCP' | 'CLS' | 'FID' | 'INP' | 'TTFB'

/**
 * 自定义性能指标类型
 */
export type CustomVitalsMetric = 'FPS' | 'FSP' | 'Resource' | 'LongTask'

/**
 * 所有性能指标类型
 */
export type VitalsMetric = CoreWebVitalsMetric | CustomVitalsMetric

/**
 * 性能指标阈值配置
 */
export interface VitalsThresholds {
  FCP: [number, number] // [good, poor] 例如 [1800, 3000]
  LCP: [number, number] // [good, poor] 例如 [2500, 4000]
  CLS: [number, number] // [good, poor] 例如 [0.1, 0.25]
  FID: [number, number] // [good, poor] 例如 [100, 300]
  INP: [number, number] // [good, poor] 例如 [200, 500]
  TTFB: [number, number] // [good, poor] 例如 [800, 1800]
  FPS: [number, number] // [good, poor] 例如 [30, 20]
  FSP: [number, number] // [good, poor] 例如 [1500, 3000]
}

/**
 * 性能指标数据
 */
export interface VitalsMetricData {
  name: VitalsMetric
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  timestamp: number
  entries: PerformanceEntry[]
  navigationType?: 'navigate' | 'reload' | 'back_forward' | 'prerender'
}

/**
 * FPS 监控数据
 */
export interface FPSData {
  fps: number
  timestamp: number
  dropped: number // 丢帧数
  total: number // 总帧数
}

/**
 * 长任务监控数据
 */
export interface LongTaskData {
  duration: number // 任务持续时间
  startTime: number // 开始时间
  name: string // 任务名称
  attribution?: PerformanceEventTiming['attribution'] // 归因信息
}

/**
 * 资源性能数据
 */
export interface ResourcePerfData {
  name: string
  type: string
  duration: number
  size: number
  transferSize: number
  cacheHit: boolean
  protocol: string
  timestamp: number
}

/**
 * Web Vitals 插件配置
 */
export interface WebVitalsPlugin {
  // Core Web Vitals
  FCP: boolean
  LCP: boolean
  CLS: boolean
  FID: boolean
  INP: boolean
  TTFB: boolean

  // 自定义指标
  FPS: boolean
  FSP: boolean
  Resource: boolean
  LongTask: boolean

  // 配置选项
  reportAllChanges?: boolean // 是否上报所有变化
  thresholds?: Partial<VitalsThresholds> // 自定义阈值
  attribution?: boolean // 是否包含归因信息
  sampleRate?: number // 采样率 0-1
}
