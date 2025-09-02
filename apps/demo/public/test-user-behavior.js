// 测试用户行为监控的前后端交互
async function testUserBehavior() {
  console.log('🧪 测试用户行为监控前后端交互...')

  try {
    // 1. 测试基础连接
    console.log('\n1️⃣ 测试后端连接...')
    const statsResponse = await fetch('/api/stats')
    if (statsResponse.ok) {
      const stats = await statsResponse.json()
      console.log('✅ 后端连接成功')
      console.log('用户行为统计:', stats.data?.userBehaviorStats || '无数据')
    }
    else {
      console.log('❌ 后端连接失败:', statsResponse.status)
      return
    }

    // 2. 测试用户行为数据上报
    console.log('\n2️⃣ 测试用户行为数据上报...')
    const behaviorData = [
      {
        category: 'user',
        type: 'click',
        data: {
          target: 'login-button',
          text: '登录',
          position: { x: 100, y: 200 },
        },
        userId: 'test-user-123',
        sessionId: 'test-session-456',
        url: 'http://localhost:5173/login',
      },
      {
        category: 'user',
        type: 'pageView',
        data: {
          title: '登录页面',
          referrer: 'http://localhost:5173/',
        },
        userId: 'test-user-123',
        sessionId: 'test-session-456',
        url: 'http://localhost:5173/login',
      },
      {
        category: 'user',
        type: 'history',
        data: {
          from: '/',
          to: '/login',
          action: 'push',
        },
        userId: 'test-user-123',
        sessionId: 'test-session-456',
        url: 'http://localhost:5173/login',
      },
      {
        category: 'user',
        type: 'network',
        data: {
          method: 'POST',
          url: '/api/login',
          status: 200,
          duration: 150,
        },
        userId: 'test-user-123',
        sessionId: 'test-session-456',
        url: 'http://localhost:5173/login',
      },
      {
        category: 'user',
        type: 'deviceInfo',
        data: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          screen: { width: 1920, height: 1080 },
          viewport: { width: 1920, height: 937 },
        },
        userId: 'test-user-456',
        sessionId: 'test-session-789',
        url: 'http://localhost:5173/dashboard',
      },
    ]

    // 批量上报用户行为数据
    for (const data of behaviorData) {
      const reportResponse = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (reportResponse.ok) {
        const result = await reportResponse.json()
        console.log(`✅ ${data.type} 用户行为数据上报成功:`, result)
      }
      else {
        console.log(`❌ ${data.type} 用户行为数据上报失败:`, reportResponse.status)
      }

      // 等待一下再上报下一条
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // 3. 等待数据更新
    console.log('\n3️⃣ 等待数据更新...')
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 4. 测试获取用户行为统计
    console.log('\n4️⃣ 测试获取用户行为统计...')
    const updatedStatsResponse = await fetch('/api/stats')
    if (updatedStatsResponse.ok) {
      const updatedStats = await updatedStatsResponse.json()
      console.log('✅ 用户行为统计获取成功:', updatedStats)
      console.log('用户行为统计详情:', updatedStats.data?.userBehaviorStats)
    }
    else {
      console.log('❌ 用户行为统计获取失败:', updatedStatsResponse.status)
    }

    // 5. 测试获取用户行为数据列表
    console.log('\n5️⃣ 测试获取用户行为数据列表...')
    const behaviorListResponse = await fetch('/api/data?category=user&limit=20')
    if (behaviorListResponse.ok) {
      const behaviorList = await behaviorListResponse.json()
      console.log('✅ 用户行为列表获取成功:', behaviorList)
      console.log('用户行为数据数量:', behaviorList.data?.items?.length)
      if (behaviorList.data?.items?.length > 0) {
        console.log('第一条用户行为数据示例:', behaviorList.data.items[0])
      }
    }
    else {
      console.log('❌ 用户行为列表获取失败:', behaviorListResponse.status)
    }

    // 6. 测试用户行为数据过滤
    console.log('\n6️⃣ 测试用户行为数据过滤...')
    const filteredResponse = await fetch('/api/data?category=user&type=click')
    if (filteredResponse.ok) {
      const filtered = await filteredResponse.json()
      console.log('✅ 点击事件过滤成功:', filtered)
      console.log('点击事件数量:', filtered.data?.items?.length)
    }
    else {
      console.log('❌ 点击事件过滤失败:', filteredResponse.status)
    }

    console.log('\n🎉 用户行为监控前后端交互测试完成！')
    console.log('现在可以访问用户行为监控页面查看是否正常工作')
  }
  catch (error) {
    console.error('❌ 测试过程中出现错误:', error)
  }
}

// 页面加载完成后执行测试
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', testUserBehavior)
}
else {
  testUserBehavior()
}
