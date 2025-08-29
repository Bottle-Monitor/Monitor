self.addEventListener('install', () => {
  // 立即激活
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // 立即生效
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/report')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // 缓存到 IndexedDB，待网络恢复再发
        // saveReport(event.request)
        return new Response('cached', { status: 202 })
      }),
    )
  }
})

self.addEventListener('sync', (event) => {
  if (event.tag === 'retry-reports') {
    // event.waitUntil(retryReports())
  }
})

self.addEventListener('message', (event) => {
  const msg = event.data
  console.log('msg: ', msg)
  event.source.postMessage('收到力!')
  if (msg.type === 'REPORT_EVENT') {
    console.log('收到页面消息', msg.payload)
    // 可以写入 IndexedDB 或缓存队列
  }
})
