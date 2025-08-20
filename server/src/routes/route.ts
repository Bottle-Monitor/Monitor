import express from 'express'
import { handleReport } from '../controller/report'
import { createSSE } from '../controller/SSE'
import { handleCode } from '../controller/code'

const reportRoute = express.Router()
const dataRoute = express.Router()
const codeRoute = express.Router()

reportRoute.post('/report', handleReport)
codeRoute.post('/code', handleCode)
dataRoute.get('/data', createSSE)

export { reportRoute, codeRoute, dataRoute }
