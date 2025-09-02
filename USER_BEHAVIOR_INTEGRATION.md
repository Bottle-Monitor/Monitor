# 👥 用户行为监控前后端联调说明

## 🎯 概述

用户行为监控系统现在完全基于真实数据，实现了前后端的完整联调。系统可以追踪和分析用户在应用中的各种行为模式，包括点击、页面访问、路由变化、网络请求等。

## 🏗️ 系统架构

### 后端增强
- **用户行为统计**: 新增 `userBehaviorStats` 统计对象
- **实时数据处理**: 支持多种用户行为类型的分类统计
- **页面和用户追踪**: 记录每个行为类型涉及的页面和用户

### 前端重构
- **真实数据驱动**: 所有图表和统计都基于后端数据
- **实时更新**: 10秒自动刷新，确保数据实时性
- **动态渲染**: 根据数据状态动态显示内容

## 📊 支持的用户行为类型

### 1. 点击事件 (click)
```javascript
{
  category: 'user',
  type: 'click',
  data: {
    target: 'button-id',
    text: '按钮文本',
    position: { x: 100, y: 200 }
  }
}
```

### 2. 页面访问 (pageView)
```javascript
{
  category: 'user',
  type: 'pageView',
  data: {
    title: '页面标题',
    referrer: '来源页面'
  }
}
```

### 3. 路由变化 (history)
```javascript
{
  category: 'user',
  type: 'history',
  data: {
    from: '/previous-page',
    to: '/current-page',
    action: 'push'
  }
}
```

### 4. 网络请求 (network)
```javascript
{
  category: 'user',
  type: 'network',
  data: {
    method: 'POST',
    url: '/api/endpoint',
    status: 200,
    duration: 150
  }
}
```

### 5. 设备信息 (deviceInfo)
```javascript
{
  category: 'user',
  type: 'deviceInfo',
  data: {
    userAgent: '浏览器信息',
    screen: { width: 1920, height: 1080 },
    viewport: { width: 1920, height: 937 }
  }
}
```

### 6. 自定义事件 (custom)
```javascript
{
  category: 'user',
  type: 'custom',
  data: {
    eventName: 'custom_event',
    properties: { key: 'value' }
  }
}
```

## 🔧 后端实现

### 数据结构
```typescript
const userBehaviorStats = {
  click: { count: 0, total: 0, pages: new Set(), users: new Set() },
  pageView: { count: 0, total: 0, pages: new Set(), users: new Set() },
  history: { count: 0, total: 0, pages: new Set(), users: new Set() },
  network: { count: 0, total: 0, pages: new Set(), users: new Set() },
  deviceInfo: { count: 0, total: 0, pages: new Set(), users: new Set() },
  custom: { count: 0, total: 0, pages: new Set(), users: new Set() },
}
```

### 统计更新逻辑
```typescript
if (item.category === 'user') {
  const behaviorType = item.type
  if (behaviorType && userBehaviorStats[behaviorType]) {
    const behavior = userBehaviorStats[behaviorType]
    behavior.count++
    behavior.total++

    // 记录页面和用户信息
    if (item.url)
      behavior.pages.add(item.url)
    if (item.userId)
      behavior.users.add(item.userId)
  }
}
```

## 🎨 前端实现

### 动态图表生成
```typescript
function getUserBehaviorChartOption() {
  // 基于真实数据生成饼图
  const chartData = Object.entries(userBehaviorStats)
    .map(([type, stats]: [string, any]) => ({
      value: stats.count || 0,
      name: getBehaviorTypeText(type),
    }))
    .filter(item => item.value > 0)

  // 返回ECharts配置
}
```

### 实时数据更新
```typescript
useEffect(() => {
  loadUserBehaviorData()
  // 每10秒刷新一次用户行为数据
  const interval = setInterval(loadUserBehaviorData, 10000)
  return () => clearInterval(interval)
}, [])
```

### 智能数据展示
- **空数据处理**: 当没有数据时显示友好的提示信息
- **动态统计**: 统计卡片基于真实数据计算
- **热门页面**: 自动统计和排序页面访问次数

## 🧪 测试验证

### 测试脚本
创建了 `test-user-behavior.js` 脚本来验证功能：

1. **基础连接测试**: 验证后端API是否正常
2. **数据上报测试**: 测试多种用户行为数据上报
3. **统计获取测试**: 验证用户行为统计数据获取
4. **列表获取测试**: 验证用户行为数据列表获取
5. **过滤测试**: 测试按类型过滤用户行为数据

### 测试步骤
1. 启动前后端服务
2. 打开浏览器开发者工具
3. 查看控制台测试输出
4. 访问用户行为监控页面验证功能

## 📈 功能特性

### 实时监控
- **自动刷新**: 10秒间隔自动更新数据
- **实时统计**: 动态计算各种行为类型的数量
- **用户追踪**: 实时显示用户行为时间线

### 数据可视化
- **行为分布饼图**: 显示各种行为类型的占比
- **活跃度趋势**: 24小时用户活跃度柱状图
- **热门页面**: 页面访问次数排行榜

### 智能分析
- **行为分类**: 自动识别和分类用户行为
- **页面统计**: 统计每个页面的访问情况
- **用户分析**: 分析独立用户数量和活跃度

## 🚀 使用方法

### 1. 启动服务
```bash
# 后端
cd apps/server && npm start

# 前端
cd apps/demo && npm run dev
```

### 2. 访问页面
- 用户行为监控页面: http://localhost:5173/user-behavior
- 查看控制台测试输出

### 3. 验证功能
- 检查页面是否正常加载
- 验证图表是否基于真实数据
- 测试实时数据更新功能
- 确认统计数据的准确性

## 🔍 故障排除

### 常见问题
1. **页面显示"暂无数据"**
   - 检查后端是否正常运行
   - 确认是否有用户行为数据上报
   - 查看网络请求状态

2. **图表不更新**
   - 检查自动刷新是否启用
   - 确认数据格式是否正确
   - 查看控制台错误信息

3. **统计数据不准确**
   - 检查数据上报格式
   - 确认统计逻辑是否正确
   - 验证数据分类是否准确

### 调试技巧
- 使用浏览器开发者工具查看网络请求
- 检查后端控制台日志
- 验证数据上报和获取的API响应

## 🎉 总结

用户行为监控系统现在完全实现了前后端联调：

✅ **后端增强**: 支持多种用户行为类型的统计和分析
✅ **前端重构**: 基于真实数据，提供动态和实时的监控界面
✅ **数据驱动**: 所有图表和统计都基于实际用户行为数据
✅ **实时更新**: 自动刷新确保数据的实时性和准确性
✅ **智能分析**: 自动分类、统计和分析用户行为模式

系统现在可以真正追踪和分析用户在应用中的行为，为产品优化和用户体验改进提供有价值的数据支持！🎊
