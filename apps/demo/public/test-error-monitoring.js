// 测试错误监控的前后端交互
async function testErrorMonitoring() {
  console.log('🧪 测试错误监控前后端交互...')

  try {
    // 1. 测试错误数据上报
    console.log('\n1️⃣ 测试错误数据上报...')
    const errorData = {
      category: 'abnormal',
      type: 'codeError',
      data: {
        message: '测试JavaScript错误',
        error: 'TypeError: Cannot read property of null',
        stack: 'Error: Cannot read property of null\n    at testFunction (test.js:10:5)',
        url: window.location.href,
        timestamp: Date.now(),
      },
      userId: 'test-user-123',
      sessionId: 'test-session-456',
    }

    const reportResponse = await fetch('/api/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorData),
    })

    if (reportResponse.ok) {
      const result = await reportResponse.json()
      console.log('✅ 错误数据上报成功:', result)
    }
    else {
      console.log('❌ 错误数据上报失败:', reportResponse.status)
    }

    // 2. 测试获取错误统计
    console.log('\n2️⃣ 测试获取错误统计...')
    const statsResponse = await fetch('/api/stats')
    if (statsResponse.ok) {
      const stats = await statsResponse.json()
      console.log('✅ 错误统计获取成功:', stats)
      console.log('错误类型统计:', stats.data.errorTypeStats)
    }
    else {
      console.log('❌ 错误统计获取失败:', statsResponse.status)
    }

    // 3. 测试获取错误数据列表
    console.log('\n3️⃣ 测试获取错误数据列表...')
    const errorListResponse = await fetch('/api/data?category=abnormal&limit=10')
    if (errorListResponse.ok) {
      const errorList = await errorListResponse.json()
      console.log('✅ 错误列表获取成功:', errorList)
      console.log('错误数量:', errorList.data.items.length)
    }
    else {
      console.log('❌ 错误列表获取失败:', errorListResponse.status)
    }

    // 4. 测试错误类型过滤
    console.log('\n4️⃣ 测试错误类型过滤...')
    const filteredResponse = await fetch('/api/data?category=abnormal&type=codeError')
    if (filteredResponse.ok) {
      const filtered = await filteredResponse.json()
      console.log('✅ 错误类型过滤成功:', filtered)
      console.log('JavaScript错误数量:', filtered.data.items.length)
    }
    else {
      console.log('❌ 错误类型过滤失败:', filteredResponse.status)
    }

    console.log('\n🎉 错误监控前后端交互测试完成！')
  }
  catch (error) {
    console.error('❌ 测试过程中出现错误:', error)
  }
}

// 页面加载完成后执行测试
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', testErrorMonitoring)
}
else {
  testErrorMonitoring()
}
