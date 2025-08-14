/**
 * 上报类型
 */
export enum USER {
    CLICK = 'click', // 点击
    HISTORY_ROUTE = 'history', // 路由
    HASH_ROUTE = 'hash',
    DEVICE = 'device', // 设备信息
    XHR = 'xhr', // 网络请求
    FETCH = 'fetch'
}

export enum VITALS {
    WEBVITALS = 'web-vitals' // 性能检测
}

export enum ABNORMAL {
    CODE = 'code', // 代码错误
    CUSTOM = 'custom', // 自定义错误
    UNHANDLEDREJECTION = 'unhandledRejection', // 未捕获错误
    RESOURCE = 'resource', // 资源加载错误
    WHITESCREEN = 'whitescreen' // 白屏
}

export enum CATEGORY {
    USER = 'user',
    VITALS = 'vitals',
    ABNORMAL = 'abnormal',
    CUSTOM = 'custom'
}

/**
 * 行为栈
 */
export type BreadcrumbType = 'user' | 'vitals' | 'abnormal' | 'custom'
export interface BreadcrumbOption {
    breadcrumbType: BreadcrumbType
    breadcrumbId?: string // 行为栈标识, 自定义栈要有
    capacity: number // 最大存储量，1 为立即上报
    uploadInterval?: number // 定时上报间隔
}
export type BreadcrumbOptions = BreadcrumbOption[]

/**
 * 禁用选项
 */
export type SilentOptions = Partial<{
    click: boolean
    hash: boolean
    history: boolean
    webVitals: boolean
    error: boolean
    codeError: boolean
    unhandledrejection: boolean
    resource: boolean
    whitescreen: boolean
}>

/**
 * 生命周期
 */
export type Hook = Partial<{
    beforePushBreadcrumb: (data: any) => void // 行为栈添加前
    beroreTransport: (data: any) => Promise<boolean> // 数据上报前
}>

/**
 * 项目框架
 */
type FrameWork = 'normal' | 'vue' | 'react'

/**
 * 初始化选项
 */
export interface InitOptions {
    dsnURL: string
    userId: string
    projectId?: string
    disabled?: boolean
    repeatError?: boolean // 重复上报同一错误
    framework?: FrameWork
    filterXhrUrlRegExp?: RegExp // 过滤接口请求的正则
    silent?: SilentOptions
    breadcrumb?: BreadcrumbOptions
    hook?: Hook
    [key: string]: any
}
