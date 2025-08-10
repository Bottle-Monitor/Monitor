import express from 'express'
import { handleReport } from '../controller/report'

const reportRoute = express.Router()

reportRoute.post('/report', handleReport)

export default reportRoute