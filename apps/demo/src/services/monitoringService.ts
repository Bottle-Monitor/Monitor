// 监控数据服务
class MonitoringService {
  private baseURL: string
  private isConnected: boolean = false
  private retryCount: number = 0
  private maxRetries: number = 3

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL
  }

  // 检查服务器连接状态
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // 设置较短的超时时间
        signal: AbortSignal.timeout(5000),
      })

      this.isConnected = response.ok
      if (this.isConnected) {
        this.retryCount = 0 // 重置重试计数
      }
      return this.isConnected
    }
    catch (error) {
      console.warn('无法连接到监控服务器:', error)
      this.isConnected = false
      this.retryCount++

      // 如果重试次数未达到上限，尝试重连
      if (this.retryCount < this.maxRetries) {
        console.log(`尝试重连... (${this.retryCount}/${this.maxRetries})`)
        setTimeout(() => this.checkConnection(), 2000)
      }

      return false
    }
  }

  // 获取统计信息
  async getStats() {
    try {
      const response = await fetch(`${this.baseURL}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.data
    }
    catch (error) {
      console.error('获取统计信息失败:', error)
      return null
    }
  }

  // 获取监控数据
  async getMonitoringData(params: {
    category?: string
    type?: string
    limit?: number
    offset?: number
    startTime?: number
    endTime?: number
  } = {}) {
    try {
      const queryParams = new URLSearchParams()

      if (params.category)
        queryParams.append('category', params.category)
      if (params.type)
        queryParams.append('type', params.type)
      if (params.limit)
        queryParams.append('limit', params.limit.toString())
      if (params.offset)
        queryParams.append('offset', params.offset.toString())
      if (params.startTime)
        queryParams.append('startTime', params.startTime.toString())
      if (params.endTime)
        queryParams.append('endTime', params.endTime.toString())

      const url = `${this.baseURL}/data?${queryParams.toString()}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(15000),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.data
    }
    catch (error) {
      console.error('获取监控数据失败:', error)
      return null
    }
  }

  // 清空所有数据（仅用于测试）
  async clearAllData() {
    try {
      const response = await fetch(`${this.baseURL}/data`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('数据清空成功:', result.message)
      return result.data
    }
    catch (error) {
      console.error('清空数据失败:', error)
      return null
    }
  }

  // 获取连接状态
  getConnectionStatus(): boolean {
    return this.isConnected
  }

  // 获取重试次数
  getRetryCount(): number {
    return this.retryCount
  }

  // 设置服务器地址
  setBaseURL(url: string) {
    this.baseURL = url
    this.isConnected = false // 重置连接状态
    this.retryCount = 0 // 重置重试计数
  }

  // 手动重连
  async reconnect(): Promise<boolean> {
    this.retryCount = 0
    return await this.checkConnection()
  }
}

// 创建单例实例
export const monitoringService = new MonitoringService()

// 导出类型
export interface MonitoringData {
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

export interface MonitoringStats {
  totalEvents: number
  userActions: number
  errors: number
  vitals: number
  customEvents: number
  lastUpdate: number
  errorTypeStats?: any
  performanceStats?: any
  userBehaviorStats?: any
}

export interface DataResponse {
  items: MonitoringData[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}
