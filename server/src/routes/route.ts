import express from 'express'
import { handleReport } from '../controller/report'
import { createSSE } from '../controller/SSE'

const reportRoute = express.Router()
const dataRoute = express.Router()

reportRoute.post('/report', handleReport)
dataRoute.get('/data', createSSE)

export {
    reportRoute,
    dataRoute
}