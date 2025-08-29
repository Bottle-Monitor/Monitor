import cors from 'cors'
import express from 'express'
import { codeRoute, dataRoute, reportRoute } from './routes/route'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.text())
app.use(reportRoute)
app.use(codeRoute)
app.use(dataRoute)

export default app
