import * as express from 'express'
import { handleCode } from '../controller/code'
import { handleReport } from '../controller/report'
import { createSSE } from '../controller/SSE'

const reportRoute = express.Router()
const dataRoute = express.Router()
const codeRoute = express.Router()

reportRoute.post('/report', handleReport)
codeRoute.post('/code', handleCode)
dataRoute.get('/data', createSSE)

export { codeRoute, dataRoute, reportRoute }
