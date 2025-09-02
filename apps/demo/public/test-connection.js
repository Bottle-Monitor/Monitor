// 测试前后端连接
async function testConnection() {
  console.log('🧪 测试前后端连接...')

  try {
    // 测试后端直接连接
    console.log('\n1️⃣ 测试后端直接连接...')
    const directResponse = await fetch('http://localhost:3000/stats')
    if (directResponse.ok) {
      const data = await directResponse.json()
      console.log('✅ 后端直接连接成功:', data)
    }
    else {
      console.log('❌ 后端直接连接失败:', directResponse.status)
    }
  }
  catch (error) {
    console.log('❌ 后端直接连接错误:', error.message)
  }

  try {
    // 测试前端代理连接
    console.log('\n2️⃣ 测试前端代理连接...')
    const proxyResponse = await fetch('/api/stats')
    if (proxyResponse.ok) {
      const data = await proxyResponse.json()
      console.log('✅ 前端代理连接成功:', data)
    }
    else {
      console.log('❌ 前端代理连接失败:', proxyResponse.status)
    }
  }
  catch (error) {
    console.log('❌ 前端代理连接错误:', error.message)
  }

  try {
    // 测试监控数据上报
    console.log('\n3️⃣ 测试监控数据上报...')
    const reportResponse = await fetch('/api/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: 'test',
        type: 'connection-test',
        data: { message: '测试连接' },
      }),
    })

    if (reportResponse.ok) {
      const data = await reportResponse.json()
      console.log('✅ 监控数据上报成功:', data)
    }
    else {
      console.log('❌ 监控数据上报失败:', reportResponse.status)
    }
  }
  catch (error) {
    console.log('❌ 监控数据上报错误:', error.message)
  }
}

// 页面加载完成后执行测试
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', testConnection)
}
else {
  testConnection()
}
