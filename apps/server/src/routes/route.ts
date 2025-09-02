import * as express from 'express'
import { handleCode } from '../controller/code'
import {
  clearAllData,
  getMonitoringData,
  getStats,
  handleReport,
} from '../controller/report'
import { createSSE } from '../controller/SSE'

const reportRoute = express.Router()
const dataRoute = express.Router()
const codeRoute = express.Router()

// 监控数据上报
reportRoute.post('/report', handleReport)

// 数据查询接口
dataRoute.get('/data', getMonitoringData)
dataRoute.get('/stats', getStats)
dataRoute.delete('/data', clearAllData) // 清空数据（仅用于测试）

// 代码相关接口
codeRoute.post('/code', handleCode)

// SSE接口（保留原有功能）
dataRoute.get('/sse', createSSE)

export { codeRoute, dataRoute, reportRoute }
