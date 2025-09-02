// 简化的性能监控测试脚本
async function testPerformanceSimple() {
  console.log('🧪 简化性能监控测试...')

  try {
    // 1. 测试基础连接
    console.log('\n1️⃣ 测试后端连接...')
    const statsResponse = await fetch('/api/stats')
    if (statsResponse.ok) {
      const stats = await statsResponse.json()
      console.log('✅ 后端连接成功:', stats)
    }
    else {
      console.log('❌ 后端连接失败:', statsResponse.status)
      return
    }

    // 2. 测试性能数据上报
    console.log('\n2️⃣ 测试性能数据上报...')
    const testData = {
      category: 'vitals',
      type: 'FCP',
      data: { value: 1200 },
      userId: 'test-user',
      sessionId: 'test-session',
    }

    const reportResponse = await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    })

    if (reportResponse.ok) {
      console.log('✅ 性能数据上报成功')
    }
    else {
      console.log('❌ 性能数据上报失败:', reportResponse.status)
    }

    // 3. 等待一下再获取统计
    await new Promise(resolve => setTimeout(resolve, 500))

    // 4. 再次获取统计
    console.log('\n3️⃣ 获取更新后的统计...')
    const updatedStatsResponse = await fetch('/api/stats')
    if (updatedStatsResponse.ok) {
      const updatedStats = await updatedStatsResponse.json()
      console.log('✅ 更新后的统计:', updatedStats)
      if (updatedStats.data?.performanceStats) {
        console.log('性能统计:', updatedStats.data.performanceStats)
      }
    }

    console.log('\n🎉 简化测试完成！')
  }
  catch (error) {
    console.error('❌ 测试错误:', error)
  }
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', testPerformanceSimple)
}
else {
  testPerformanceSimple()
}
