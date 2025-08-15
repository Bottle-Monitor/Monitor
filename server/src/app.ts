import express from 'express'
import cors from 'cors'
import { dataRoute, reportRoute} from './routes/route'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.text())
app.use(reportRoute)
app.use(dataRoute)

export default app