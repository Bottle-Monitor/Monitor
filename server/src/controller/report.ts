import type { Req, Res } from '../types'
import { handleSSEReport } from './SSE'

export function handleReport(req: Req, res: Res) {
  const data = req.body
  console.log('server recived: ', data)
  handleSSEReport(data)
  res.send({
    status: 200,
    message: `发过来的 ${data} 已接收!`,
  })
}
