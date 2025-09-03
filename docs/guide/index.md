# 🚀 快速开始

欢迎使用 Bottle Monitor SDK！这是一个功能强大、类型安全的前端监控解决方案。

## ✨ 什么是 Bottle Monitor？

Bottle Monitor 是一个基于插件化架构的现代化前端监控 SDK，专门为现代 Web 应用设计。它提供了：

- **🔍 全面监控**：错误监控、性能监控、用户行为追踪
- **🔧 插件化架构**：按需加载，支持自定义插件扩展
- **📱 类型安全**：完整的 TypeScript 支持
- **⚡ 高性能**：轻量级设计，对应用性能影响微乎其微
- **🌐 广泛兼容**：支持现代浏览器及 IE11+

## 🎯 核心概念

### 插件系统 (Plugin System)

Bottle Monitor 采用插件化架构，每个功能模块都是一个独立的插件：

```typescript
// 插件结构
interface Plugin {
  name: string;           // 插件名称
  init: Function;         // 初始化函数
  destroy?: Function;     // 销毁函数（可选）
}
```

### 事件总线 (Event Bus)

插件间通过事件总线进行通信，支持发布-订阅模式：

```typescript
// 事件发布
eventBus.emit('bottle-monitor:error', 'js_error', errorData);

// 事件订阅
eventBus.on('bottle-monitor:error', (type, data) => {
  // 处理错误数据
});
```

### 数据队列 (Data Queue)

智能的数据收集和上报机制：

- **实时处理**：数据立即进入处理队列
- **智能去重**：自动识别重复数据
- **批量上报**：优化网络请求性能
- **离线缓存**：网络异常时自动缓存

## 🚀 5分钟快速上手

### 1. 安装依赖

```bash
# 使用 npm
npm install @bottle-monitor/core @bottle-monitor/plugins

# 使用 pnpm
pnpm add @bottle-monitor/core @bottle-monitor/plugins

# 使用 yarn
yarn add @bottle-monitor/core @bottle-monitor/plugins
```

### 2. 基础配置

```typescript
import { bottleMonitorInit, errorPlugin, performancePlugin, userPlugin } from '@bottle-monitor/core'

// 初始化监控
const monitor = bottleMonitorInit({
  dsnURL: 'https://your-api.com/monitor',  // 数据上报地址
  userId: 'user-123',                      // 用户标识
  projectId: 'my-project',                 // 项目标识
  environment: 'production',               // 环境标识
  plugins: [
    // 错误监控插件
    errorPlugin({
      options: { 
        codeError: true,                   // JavaScript 错误
        unhandledrejection: true,          // Promise 错误
        resource: true,                    // 资源加载错误
        network: true                      // 网络请求错误
      }
    }),
    
    // 性能监控插件
    performancePlugin({
      options: { 
        FCP: true,                         // First Contentful Paint
        LCP: true,                         // Largest Contentful Paint
        CLS: true                          // Cumulative Layout Shift
      }
    }),
    
    // 用户行为插件
    userPlugin({
      options: { 
        click: true,                       // 点击事件
        pageView: true,                    // 页面访问
        network: true                      // 网络请求
      }
    })
  ]
})
```

### 3. 手动上报数据

```typescript
// 获取监控实例
const monitor = getBottleMonitor()

// 上报自定义事件
monitor.track('custom_event', {
  category: 'user_action',
  action: 'button_click',
  label: 'submit_form',
  value: 1,
  extra: {
    formId: 'login-form',
    timestamp: Date.now()
  }
})

// 上报错误
monitor.track('error', {
  type: 'business_error',
  message: '用户权限不足',
  level: 'warning',
  stack: new Error().stack,
  extra: {
    userId: 'user-123',
    action: 'access_admin_panel'
  }
})
```

### 4. 配置 Hook 系统

```typescript
bottleMonitorInit({
  // ... 其他配置
  hooks: {
    // 数据入队前处理
    beforePushBreadcrumb: (data) => {
      // 数据脱敏
      if (data.type === 'network' && data.url.includes('/api/user')) {
        delete data.response
      }
      return data
    },

    // 上报前最终处理
    beforeTransport: (dataArray) => {
      // 批量数据处理
      return dataArray.map(item => ({
        ...item,
        timestamp: Date.now(),
        environment: process.env.NODE_ENV,
        version: '1.0.0'
      }))
    }
  }
})
```

## 🔧 高级配置

### 自定义插件

```typescript
// 创建自定义插件
const customPlugin = {
  name: 'custom_monitor',
  init: ({ eventBus, config }) => {
    // 监听特定事件
    eventBus.on('bottle-monitor:custom', (type, data) => {
      console.log('Custom event:', type, data)
    })
    
    // 定时发送心跳
    setInterval(() => {
      eventBus.emit('bottle-monitor:heartbeat', 'alive', {
        timestamp: Date.now(),
        status: 'healthy'
      })
    }, 60000)
  },
  
  destroy: () => {
    // 清理定时器
    clearInterval(heartbeatTimer)
  }
}

// 注册插件
const monitor = getBottleMonitor()
monitor.registerPlugin(customPlugin)
```

### Service Worker 集成

```javascript
// sw.js
self.addEventListener('message', (event) => {
  if (event.data.type === 'CACHE_MONITOR_DATA') {
    // 缓存监控数据
    caches.open('bottle-monitor').then((cache) => {
      cache.put('/monitor-data', new Response(JSON.stringify(event.data.payload)))
    })
  }
})

self.addEventListener('sync', (event) => {
  if (event.tag === 'monitor-data-sync') {
    // 网络恢复时重试发送
    event.waitUntil(retrySendData())
  }
})
```

## 📱 框架集成

### React 集成

```tsx
// App.tsx
import { useEffect } from 'react'
import { bottleMonitorInit, errorPlugin, performancePlugin, userPlugin } from '@bottle-monitor/core'

function App() {
  useEffect(() => {
    bottleMonitorInit({
      dsnURL: process.env.REACT_APP_MONITOR_URL,
      userId: 'current-user-id',
      framework: 'react',
      plugins: [
        errorPlugin({
          options: {
            codeError: true,
            unhandledrejection: true,
            whitescreen: true
          }
        }),
        performancePlugin({
          options: { FCP: true, LCP: true, CLS: true }
        }),
        userPlugin({
          options: {
            click: true,
            history: true, // React Router 支持
            pageView: true
          }
        })
      ]
    })
  }, [])

  return <div>Your React App</div>
}
```

### Vue 集成

```vue
<!-- App.vue -->
<script>
import { bottleMonitorInit, errorPlugin, performancePlugin, userPlugin } from '@bottle-monitor/core'

export default {
  name: 'App',
  mounted() {
    bottleMonitorInit({
      dsnURL: process.env.VUE_APP_MONITOR_URL,
      userId: 'current-user-id',
      framework: 'vue',
      plugins: [
        errorPlugin({
          options: {
            codeError: true,
            whitescreen: true
          }
        }),
        performancePlugin({
          options: { FCP: true, LCP: true, CLS: true }
        }),
        userPlugin({
          options: {
            click: true,
            hash: true,    // Vue Router Hash 模式
            history: true  // Vue Router History 模式
          }
        })
      ]
    })
  }
}
</script>
```

## 🎯 下一步

现在您已经了解了 Bottle Monitor 的基础概念和快速上手方法。接下来可以：

- 📖 阅读 [安装指南](./installation.md) 了解详细的安装步骤
- 🔧 查看 [配置选项](./configuration.md) 了解所有可配置项
- 🔌 学习 [插件系统](./plugins.md) 了解如何开发自定义插件
- 📱 参考 [集成示例](../examples/) 了解各种框架的集成方法

如果您在使用过程中遇到任何问题，欢迎：

- 📝 查看 [常见问题](../faq.md)
- 🐛 提交 [Issue](https://github.com/bottle414/bottle-monitor/issues)
- 💬 参与 [讨论](https://github.com/bottle414/bottle-monitor/discussions)

祝您使用愉快！🚀
