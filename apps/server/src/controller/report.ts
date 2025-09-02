import type { Req, Res } from '../types'

// 全局变量存储监控数据
interface MonitoringData {
  id: string
  timestamp: number
  category: string
  type: string
  data: any
  userId?: string
  sessionId?: string
  url?: string
  userAgent?: string
}

// 错误类型统计
const errorTypeStats = {
  codeError: 0,
  unhandledrejection: 0,
  resource: 0,
  network: 0,
  whitescreen: 0,
  custom_error: 0,
  batch_error: 0,
}

// 性能指标统计
const performanceStats = {
  FCP: { count: 0, total: 0, min: Infinity, max: 0, good: 0, needsImprovement: 0, poor: 0 },
  LCP: { count: 0, total: 0, min: Infinity, max: 0, good: 0, needsImprovement: 0, poor: 0 },
  CLS: { count: 0, total: 0, min: Infinity, max: 0, good: 0, needsImprovement: 0, poor: 0 },
  FID: { count: 0, total: 0, min: Infinity, max: 0, good: 0, needsImprovement: 0, poor: 0 },
  TTFB: { count: 0, total: 0, min: Infinity, max: 0, good: 0, needsImprovement: 0, poor: 0 },
  longTask: { count: 0, total: 0, min: Infinity, max: 0 },
  memory: { count: 0, total: 0, min: Infinity, max: 0 },
}

// 用户行为统计
const userBehaviorStats = {
  click: { count: 0, total: 0, pages: new Set(), users: new Set() },
  pageView: { count: 0, total: 0, pages: new Set(), users: new Set() },
  history: { count: 0, total: 0, pages: new Set(), users: new Set() },
  network: { count: 0, total: 0, pages: new Set(), users: new Set() },
  deviceInfo: { count: 0, total: 0, pages: new Set(), users: new Set() },
  custom: { count: 0, total: 0, pages: new Set(), users: new Set() },
}

// 全局存储
const globalMonitoringData: MonitoringData[] = []
const globalStats = {
  totalEvents: 0,
  userActions: 0,
  errors: 0,
  vitals: 0,
  customEvents: 0,
  lastUpdate: Date.now(),
  errorTypeStats,
  performanceStats,
  userBehaviorStats,
}

// 数据清理间隔（24小时）
const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000

// 性能指标评估函数
function evaluatePerformanceMetric(type: string, value: number) {
  const thresholds = {
    FCP: { good: 1800, needsImprovement: 3000 },
    LCP: { good: 2500, needsImprovement: 4000 },
    CLS: { good: 0.1, needsImprovement: 0.25 },
    FID: { good: 100, needsImprovement: 300 },
    TTFB: { good: 200, needsImprovement: 600 },
  }

  const threshold = thresholds[type as keyof typeof thresholds]
  if (!threshold)
    return 'unknown'

  if (value <= threshold.good)
    return 'good'
  if (value <= threshold.needsImprovement)
    return 'needsImprovement'
  return 'poor'
}

// 定期清理旧数据
setInterval(() => {
  const cutoffTime = Date.now() - CLEANUP_INTERVAL
  const initialLength = globalMonitoringData.length

  // 移除24小时前的数据
  for (let i = globalMonitoringData.length - 1; i >= 0; i--) {
    if (globalMonitoringData[i].timestamp < cutoffTime) {
      globalMonitoringData.splice(i, 1)
    }
  }

  if (globalMonitoringData.length !== initialLength) {
    console.log(`清理了 ${initialLength - globalMonitoringData.length} 条旧数据`)
    updateStats()
  }
}, CLEANUP_INTERVAL)

// 更新统计信息
function updateStats() {
  // 重置错误类型统计
  Object.keys(errorTypeStats).forEach((key) => {
    errorTypeStats[key as keyof typeof errorTypeStats] = 0
  })

  // 重置性能指标统计
  Object.keys(performanceStats).forEach((key) => {
    const metric = performanceStats[key as keyof typeof performanceStats]
    metric.count = 0
    metric.total = 0
    metric.min = Infinity
    metric.max = 0
    if ('good' in metric) {
      metric.good = 0
      metric.needsImprovement = 0
      metric.poor = 0
    }
  })

  // 重置用户行为统计
  Object.keys(userBehaviorStats).forEach((key) => {
    const behavior = userBehaviorStats[key as keyof typeof userBehaviorStats]
    behavior.count = 0
    behavior.total = 0
    behavior.pages.clear()
    behavior.users.clear()
  })

  // 统计各类数据
  globalMonitoringData.forEach((item) => {
    if (item.category === 'abnormal' || item.category === 'error') {
      errorTypeStats[item.type as keyof typeof errorTypeStats]
        = (errorTypeStats[item.type as keyof typeof errorTypeStats] || 0) + 1
    }

    if (item.category === 'vitals' || item.category === 'performance') {
      const metricType = item.type
      const metricValue = item.data?.value || item.data

      if (metricType && typeof metricValue === 'number' && performanceStats[metricType as keyof typeof performanceStats]) {
        const metric = performanceStats[metricType as keyof typeof performanceStats]
        metric.count++
        metric.total += metricValue
        metric.min = Math.min(metric.min, metricValue)
        metric.max = Math.max(metric.max, metricValue)

        // 评估性能等级
        if ('good' in metric) {
          const level = evaluatePerformanceMetric(metricType, metricValue)
          if (level === 'good')
            metric.good++
          else if (level === 'needsImprovement')
            metric.needsImprovement++
          else if (level === 'poor')
            metric.poor++
        }
      }
    }

    if (item.category === 'user') {
      const behaviorType = item.type
      if (behaviorType && userBehaviorStats[behaviorType as keyof typeof userBehaviorStats]) {
        const behavior = userBehaviorStats[behaviorType as keyof typeof userBehaviorStats]
        behavior.count++
        behavior.total++

        // 记录页面和用户信息
        if (item.url)
          behavior.pages.add(item.url)
        if (item.userId)
          behavior.users.add(item.userId)
      }
    }
  })

  const stats = {
    totalEvents: globalMonitoringData.length,
    userActions: globalMonitoringData.filter(item => item.category === 'user').length,
    errors: globalMonitoringData.filter(item =>
      item.category === 'abnormal' || item.category === 'error',
    ).length,
    vitals: globalMonitoringData.filter(item =>
      item.category === 'vitals' || item.category === 'performance',
    ).length,
    customEvents: globalMonitoringData.filter(item => item.category === 'custom').length,
    lastUpdate: Date.now(),
    errorTypeStats, // 添加错误类型统计
    performanceStats, // 添加性能指标统计
    userBehaviorStats: Object.fromEntries(
      Object.entries(userBehaviorStats).map(([key, value]) => [
        key,
        {
          count: value.count,
          total: value.total,
          pages: Array.from(value.pages),
          users: Array.from(value.users),
        },
      ]),
    ), // 添加用户行为统计
  }

  Object.assign(globalStats, stats)
  return stats
}

export function handleReport(req: Req, res: Res) {
  try {
    const data = req.body

    if (!data || typeof data !== 'object') {
      return res.status(400).json({
        status: 400,
        message: '无效的数据格式',
      })
    }

    // 创建监控数据记录
    const monitoringRecord: MonitoringData = {
      id: `monitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      category: data.category || 'unknown',
      type: data.type || 'unknown',
      data,
      userId: data.userId || req.headers['x-user-id'] as string,
      sessionId: data.sessionId || req.headers['x-session-id'] as string,
      url: data.url || req.headers.referer,
      userAgent: req.headers['user-agent'],
    }

    // 添加到全局存储
    globalMonitoringData.push(monitoringRecord)

    // 更新统计信息
    updateStats()

    console.log('收到监控数据:', {
      category: monitoringRecord.category,
      type: monitoringRecord.type,
      timestamp: new Date(monitoringRecord.timestamp).toISOString(),
      totalCount: globalMonitoringData.length,
    })

    res.json({
      status: 200,
      message: '监控数据接收成功',
      data: {
        id: monitoringRecord.id,
        timestamp: monitoringRecord.timestamp,
        totalEvents: globalStats.totalEvents,
      },
    })
  }
  catch (error) {
    console.error('处理监控数据时出错:', error)
    res.status(500).json({
      status: 500,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误',
    })
  }
}

// 获取监控数据
export function getMonitoringData(req: Req, res: Res) {
  try {
    const {
      category,
      type,
      limit = '100',
      offset = '0',
      startTime,
      endTime,
    } = req.query

    let filteredData = [...globalMonitoringData]

    // 按类别过滤
    if (category && category !== 'all') {
      filteredData = filteredData.filter(item => item.category === category)
    }

    // 按类型过滤
    if (type && type !== 'all') {
      filteredData = filteredData.filter(item => item.type === type)
    }

    // 按时间范围过滤
    if (startTime) {
      const start = Number.parseInt(startTime as string)
      filteredData = filteredData.filter(item => item.timestamp >= start)
    }

    if (endTime) {
      const end = Number.parseInt(endTime as string)
      filteredData = filteredData.filter(item => item.timestamp <= end)
    }

    // 排序（最新的在前）
    filteredData.sort((a, b) => b.timestamp - a.timestamp)

    // 分页
    const limitNum = Number.parseInt(limit as string)
    const offsetNum = Number.parseInt(offset as string)
    const paginatedData = filteredData.slice(offsetNum, offsetNum + limitNum)

    res.json({
      status: 200,
      data: {
        items: paginatedData,
        total: filteredData.length,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < filteredData.length,
      },
      stats: globalStats,
    })
  }
  catch (error) {
    console.error('获取监控数据时出错:', error)
    res.status(500).json({
      status: 500,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误',
    })
  }
}

// 获取统计信息
export function getStats(req: Req, res: Res) {
  try {
    res.json({
      status: 200,
      data: globalStats,
    })
  }
  catch (error) {
    console.error('获取统计信息时出错:', error)
    res.status(500).json({
      status: 500,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误',
    })
  }
}

// 清空所有数据（仅用于测试）
export function clearAllData(req: Req, res: Res) {
  try {
    const count = globalMonitoringData.length
    globalMonitoringData.length = 0
    updateStats()

    console.log(`清空了 ${count} 条监控数据`)

    res.json({
      status: 200,
      message: `成功清空 ${count} 条数据`,
      data: {
        clearedCount: count,
        remainingCount: 0,
      },
    })
  }
  catch (error) {
    console.error('清空数据时出错:', error)
    res.status(500).json({
      status: 500,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误',
    })
  }
}

// 导出全局数据供其他模块使用
export { globalMonitoringData, globalStats, updateStats }
