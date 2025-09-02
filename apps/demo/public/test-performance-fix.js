// 测试性能监控页面修复
async function testPerformanceFix() {
  console.log('🧪 测试性能监控页面修复...')

  try {
    // 1. 测试基础连接
    console.log('\n1️⃣ 测试后端连接...')
    const statsResponse = await fetch('/api/stats')
    if (statsResponse.ok) {
      const stats = await statsResponse.json()
      console.log('✅ 后端连接成功')
      console.log('性能统计:', stats.data?.performanceStats || '无数据')
    }
    else {
      console.log('❌ 后端连接失败:', statsResponse.status)
      return
    }

    // 2. 测试多种性能数据上报
    console.log('\n2️⃣ 测试多种性能数据上报...')
    const testDataArray = [
      {
        category: 'vitals',
        type: 'FCP',
        data: { value: 1200, unit: 'ms' },
        userId: 'test-user',
        sessionId: 'test-session',
      },
      {
        category: 'vitals',
        type: 'LCP',
        data: { value: 2500, unit: 'ms' },
        userId: 'test-user',
        sessionId: 'test-session',
      },
      {
        category: 'vitals',
        type: 'CLS',
        data: { value: 0.05, unit: '' },
        userId: 'test-user',
        sessionId: 'test-session',
      },
      {
        category: 'vitals',
        type: 'FID',
        data: { value: 80, unit: 'ms' },
        userId: 'test-user',
        sessionId: 'test-session',
      },
      {
        category: 'vitals',
        type: 'TTFB',
        data: { value: 150, unit: 'ms' },
        userId: 'test-user',
        sessionId: 'test-session',
      },
    ]

    for (const testData of testDataArray) {
      const reportResponse = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      })

      if (reportResponse.ok) {
        console.log(`✅ ${testData.type} 数据上报成功`)
      }
      else {
        console.log(`❌ ${testData.type} 数据上报失败:`, reportResponse.status)
      }

      // 等待一下再上报下一条
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // 3. 等待数据更新
    console.log('\n3️⃣ 等待数据更新...')
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 4. 获取更新后的统计
    console.log('\n4️⃣ 获取更新后的统计...')
    const updatedStatsResponse = await fetch('/api/stats')
    if (updatedStatsResponse.ok) {
      const updatedStats = await updatedStatsResponse.json()
      console.log('✅ 更新后的统计获取成功')
      if (updatedStats.data?.performanceStats) {
        console.log('性能统计详情:', updatedStats.data.performanceStats)
      }
    }

    // 5. 获取性能数据列表
    console.log('\n5️⃣ 获取性能数据列表...')
    const performanceListResponse = await fetch('/api/data?category=vitals&limit=10')
    if (performanceListResponse.ok) {
      const performanceList = await performanceListResponse.json()
      console.log('✅ 性能数据列表获取成功')
      console.log('数据数量:', performanceList.data?.items?.length || 0)
      if (performanceList.data?.items?.length > 0) {
        console.log('第一条数据示例:', performanceList.data.items[0])
      }
    }

    console.log('\n🎉 性能监控页面修复测试完成！')
    console.log('现在可以访问性能监控页面查看是否正常工作')
  }
  catch (error) {
    console.error('❌ 测试过程中出现错误:', error)
  }
}

// 页面加载完成后执行测试
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', testPerformanceFix)
}
else {
  testPerformanceFix()
}
