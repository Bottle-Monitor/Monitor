# 👤 用户行为追踪插件
用户行为追踪插件是 Bottle Monitor 的核心功能之一，能够自动捕获和记录用户在页面上的各种交互行为，帮助开发者了解用户使用习惯和页面访问情况。

## ✨ 功能特性
- 🖱️ 点击追踪 ：自动记录用户点击事件和目标元素信息
- 🧭 路由监控 ：监听 History API 和 Hash 路由变化
- 🌐 网络请求 ：追踪 XHR 和 Fetch 请求的性能数据
- 📱 设备信息 ：自动收集用户设备和浏览器信息
- 👁️ 页面访问 ：记录页面浏览量（PV）和唯一访客（UV）
- 🔄 实时上报 ：行为数据实时上报，支持离线缓存
- 🎯 精准定位 ：提供详细的用户行为轨迹和上下文信息

### 📦 安装
```bash
# 用户行为追踪插件已包含在核心包中
npm install @bottle-monitor/core
```

### 🚀 快速开始
#### 基础配置
```typescript
import { bottleMonitorInit, userPlugin } from '@bottle-monitor/core'

const monitor = bottleMonitorInit({
  dsnURL: 'https://your-api.com/monitor',
  plugins: [
    userPlugin({
      options: {
        click: true,              // 点击事件追踪
        history: true,            // History 路由监控
        hash: true,               // Hash 路由监控
        network: true,            // 网络请求监控
        pageView: true,           // 页面浏览量统计
        uniqueVisitor: true,      // 唯一访客统计
        deviceInfo: true          // 设备信息收集
      }
    })
  ]
})
```

#### 手动追踪用户行为
```typescript
import { getBottleMonitor } from '@bottle-monitor/core'

const monitor = getBottleMonitor()

// 追踪自定义用户行为
monitor.track('user', {
  type: 'custom_action',
  action: 'button_click',
  target: 'subscribe_button',
  extra: {
    buttonText: '立即订阅',
    position: 'header',
    userId: 'user-123'
  }
})

// 追踪业务事件
monitor.track('user', {
  type: 'business_event',
  event: 'purchase_completed',
  data: {
    orderId: 'order-456',
    amount: 99.99,
    currency: 'CNY',
    products: ['product-1', 'product-2']
  }
})
```

### ⚙️ 配置选项
#### 插件配置
```typescript
userPlugin({
  // 监控选项
  options: {
    // 点击事件追踪
    click: true,
    
    // 点击事件容器（可选，指定监听范围）
    clickContainers: ['.main-content', '#app'],
    
    // 网络请求监控
    network: true,
    
    // Hash 路由监控
    hash: true,
    
    // History 路由监控
    history: true,
    
    // 页面浏览量统计
    pageView: true,
    
    // 唯一访客统计
    uniqueVisitor: true,
    
    // 设备信息收集
    deviceInfo: true,
    
    // 过滤网络请求的正则表达式
    filterXhrUrlRegExp: /\/(api|static)\//
  },
  
  // 行为栈配置
  breadcrumbs: {
    capacity: 20,           // 最大存储数量
    uploadInterval: 5000,   // 上报间隔（毫秒）
    breadcrumbId: 'user-behavior'
  }
})
```

#### 全局配置
```typescript
const monitor = bottleMonitorInit({
  dsnURL: 'https://your-api.com/monitor',
  userId: 'user-123',
  projectId: 'my-project',
  
  // 全局钩子函数
  hooks: {
    // 行为数据添加到队列前的处理
    beforePushBreadcrumb: (data) => {
      // 过滤敏感信息
      if (data.type === 'click' && data.clickTarget?.class?.includes('sensitive')) {
        return null // 不记录敏感元素点击
      }
      return data
    },
    
    // 数据上报前的处理
    beforeTransport: (data) => {
      // 添加额外的用户信息
      return {
        ...data,
        userRole: 'premium',
        sessionDuration: Date.now() - sessionStartTime
      }
    }
  },
  
  plugins: [userPlugin({ /* 配置 */ })]
})
```

## 📊 行为类型详解
### 点击事件 (CLICK)
自动捕获用户点击行为，记录目标元素和位置信息：
```typescript
{
  type: 'click',
  clickTarget: {
    tagName: 'BUTTON',
    className: 'primary-btn',
    id: 'submit-btn',
    textContent: '提交'
  },
  clickPosition: {
    x: 100,
    y: 200
  }
}
```

### 路由变化 (ROUTE)
自动监听路由变化，记录当前路由信息：
```typescript
{
  type: 'route',
  route: '/home',
  hash: '#/home',
  query: {
    page: '1',
    sort: 'asc'
  }
}
```

### 网络请求 (XHR/FETCH)
追踪 XHR 和 FETCH 请求的性能数据：
```typescript
// XHR 请求
{
  type: 'xhr',
  emitTime: '2024-01-15 10:30:25',
  method: 'POST',
  url: '/api/users',
  status: 200,
  duration: 245.6         // 请求耗时（毫秒）
}

// Fetch 请求
{
  type: 'fetch',
  emitTime: '2024-01-15 10:30:25',
  method: 'GET',
  url: '/api/products',
  status: 200,
  duration: 156.3
}
```

### 设备信息 (DEVICE)
收集用户设备相关信息：
```typescript
{
  type: 'device',
  emitTime: '2024-01-15 10:30:25',
  deviceInfo: {
    browser: 'Chrome',           // 浏览器名称
    browserVersion: '120.0.0.0', // 浏览器版本
    os: 'Windows',               // 操作系统
    osVersion: '10',             // 系统版本
    ua: 'Mozilla/5.0...',        // User Agent
    device: {                    // 设备信息
      type: 'desktop',
      vendor: undefined,
      model: undefined
    }
  }
}
```

### 唯一访客统计（UNIQUE_VISITOR）
记录唯一访客信息：
```typescript
{
  type: 'uv',
  emitTime: '2024-01-15 10:30:25',
  url: 'https://example.com/home',
  visitorId: 'visitor-abc123'    // 访客唯一标识
}
```

## 🔧 高级功能
### 自定义点击容器
限制点击事件的监听范围：
```typescript
userPlugin({
  options: {
    click: true,
    clickContainers: [
      '.main-content',    // 只监听主内容区域
      '#sidebar',         // 和侧边栏的点击
      '[data-track]'      // 以及带有 data-track 属性的元素
    ]
  }
})
```

### 网络请求过滤
过滤掉不需要监控的网络请求：
```typescript
userPlugin({
  options: {
     network: true,
    filterXhrUrlRegExp: /\/(api|static)\//,  // 过滤 /api/ 和 /static/ 开头的请求
    filterFetchUrlRegExp: /\/api\/(auth|login)/  // 过滤 /api/auth/ 和 /api/login/ 开头的请求
  }
})
```

### 行为数据预处理
在数据上报前进行自定义处理：
```typescript
userPlugin({
  breadcrumbs: {
    // 行为数据添加到队列前的处理
    perBeforePushBreadcrumb: (data) => {
      // 添加业务标识
      return {
        ...data,
        businessId: getCurrentBusinessId(),
        timestamp: Date.now()
      }
    },
    
    // 数据上报前的最终处理
    perBeforeTransport: (data) => {
      // 数据压缩或加密
      return compressData(data)
    }
  }
})
```

## 🎯 框架集成
### React 集成
```typescript
// React Hook 集成
import { useEffect } from 'react'
import { getBottleMonitor } from '@bottle-monitor/core'

function useUserTracking() {
  const monitor = getBottleMonitor()
  
  const trackPageView = (pageName: string) => {
    monitor.track('user', {
      type: 'page_view',
      page: pageName,
      timestamp: Date.now()
    })
  }
  
  const trackUserAction = (action: string, data?: any) => {
    monitor.track('user', {
      type: 'user_action',
      action,
      data
    })
  }
  
  return { trackPageView, trackUserAction }
}

// 组件中使用
function MyComponent() {
  const { trackPageView, trackUserAction } = useUserTracking()
  
  useEffect(() => {
    trackPageView('MyComponent')
  }, [])
  
  const handleButtonClick = () => {
    trackUserAction('button_click', { buttonId: 'submit' })
  }
  
  return <button onClick={handleButtonClick}>提交</button>
}
```

### Vue 集成
```typescript
// Vue 3 Composition API
import { onMounted } from 'vue'
import { getBottleMonitor } from '@bottle-monitor/core'

export function useUserTracking() {
  const monitor = getBottleMonitor()
  
  const trackPageView = (pageName: string) => {
    monitor.track('user', {
      type: 'page_view',
      page: pageName,
      timestamp: Date.now()
    })
  }
  
  return { trackPageView }
}

// 组件中使用
export default {
  setup() {
    const { trackPageView } = useUserTracking()
    
    onMounted(() => {
      trackPageView('HomePage')
    })
    
    return { trackPageView }
  }
}
```

## 🧪 测试和调试
### 调试模式
```typescript
// 开启调试模式查看行为数据
const monitor = bottleMonitorInit({
  dsnURL: 'https://your-api.com/monitor',
  debug: true,  // 开启调试模式
  plugins: [userPlugin({ /* 配置 */ })]
})

// 手动触发测试
function testUserTracking() {
  const monitor = getBottleMonitor()
  
  // 测试点击事件
  document.querySelector('#test-button')?.click()
  
  // 测试路由变化
  history.pushState({}, '', '/test-page')
  
  // 测试网络请求
  fetch('/api/test').then(() => {
    console.log('网络请求测试完成')
  })
}
```

### 数据验证
```typescript
// 验证上报数据格式
const monitor = bottleMonitorInit({
  hooks: {
    beforeTransport: (data) => {
      // 验证必要字段
      if (!data.userId || !data.timestamp) {
        console.warn('用户行为数据缺少必要字段:', data)
        return null
      }
      
      // 验证数据格式
      if (data.type === 'click' && !data.clickTarget) {
        console.warn('点击事件缺少目标元素信息:', data)
      }
      
      return data
    }
  }
})
```

## ⚡ 性能优化
### 采样率控制
```typescript
// 设置采样率减少数据量
userPlugin({
  breadcrumbs: {
    // 自定义采样逻辑
    perBeforePushBreadcrumb: (data) => {
      // 只采样 10% 的点击事件
      if (data.type === 'click' && Math.random() > 0.1) {
        return null
      }
      return data
    }
  }
})
```

### 批量上报
```typescript
// 配置批量上报减少网络请求
userPlugin({
  breadcrumbs: {
    capacity: 50,         // 累积50条数据后上报
    uploadInterval: 30000 // 或30秒后强制上报
  }
})
```


## 🔗 相关链接

- 📖 [性能监控插件](./performance.md)
- 👤 [用户行为插件](./user.md)
- 🔧 [插件开发指南](./custom.md)
- 📱 [集成示例](../examples/)
- 🐛 [常见问题](../faq.md)

如果您在使用错误监控插件时遇到任何问题，欢迎：

- 📝 查看 [常见问题](../faq.md)
- 🐛 提交 [Issue](https://github.com/bottle414/bottle-monitor/issues)
- 💬 参与 [讨论](https://github.com/bottle414/bottle-monitor/discussions)