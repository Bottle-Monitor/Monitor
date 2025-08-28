import type { Req, Res } from '../types'

/* 下次别把普通请求的请求体塞进来了，塞进来是同一个实例，发完了不能再设置请求头了 */
const clients = new Set<Res>()

export function handleSSEReport(data: any) {
  clients.forEach((client) => {
    console.log('SSE Report: ', data)
    client.write(`data: ${JSON.stringify(data)}\n\n`)
  })
}

export function createSSE(_req: Req, res: Res) {
  console.log('SSE Created!')
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  })

  res.flushHeaders?.()

  clients.add(res)

  res.on('close', () => {
    clients.delete(res)
    console.log('SSE Closed!')
  })
}
