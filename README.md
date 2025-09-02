# 🍶 Bottle Monitor SDK

一个功能强大、类型安全的前端监控SDK，基于插件化架构设计，支持错误监控、性能监控、用户行为追踪等核心功能。

## ✨ 特性

- 🔧 **插件化架构** - 按需加载，支持自定义插件
- 🎯 **类型安全** - 完整的 TypeScript 支持
- 📊 **全面监控** - 错误、性能、用户行为一站式监控
- 🚀 **智能上报** - 多队列管理、离线缓存、指数退避重试
- 💾 **轻量高效** - 核心包 < 20KB，单插件 < 10KB
- 🌐 **浏览器兼容** - 支持现代浏览器及 IE11+

## 📦 安装

```bash
# 使用 npm
npm install @bottle-monitor/core @bottle-monitor/plugins

# 使用 pnpm
pnpm add @bottle-monitor/core @bottle-monitor/plugins

# 使用 yarn
yarn add @bottle-monitor/core @bottle-monitor/plugins
```

## 🚀 快速开始

### 基础配置

```typescript
import { abnormalPlugin, bottleMonitorInit, userPlugin, vitalsPlugin } from '@bottle-monitor/core'

const monitor = bottleMonitorInit({
  dsnURL: 'https://your-api.com/monitor',
  userId: 'user-123',
  projectId: 'my-project',
  plugins: [
    userPlugin({
      options: { click: true, network: true },
      breadcrumbs: { capacity: 50 }
    }),
    vitalsPlugin({
      options: { FCP: true, LCP: true, CLS: true },
      breadcrumbs: { uploadInterval: 30000 }
    }),
    abnormalPlugin({
      options: { codeError: true, resource: true },
      breadcrumbs: { capacity: 1 } // 立即上报
    })
  ]
})
```

### React 集成

```tsx
import { abnormalPlugin, bottleMonitorInit, userPlugin, vitalsPlugin } from '@bottle-monitor/core'
// App.tsx
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    bottleMonitorInit({
      dsnURL: process.env.REACT_APP_MONITOR_URL,
      userId: 'current-user-id',
      framework: 'react',
      plugins: [
        userPlugin({
          options: {
            click: true,
            history: true, // React Router 支持
            pageView: true
          }
        }),
        vitalsPlugin({ options: { FCP: true, LCP: true, CLS: true } }),
        abnormalPlugin({ options: { codeError: true, unhandledrejection: true } })
      ]
    })
  }, [])

  return <div>Your App</div>
}
```

### Vue 集成

```vue
<!-- App.vue -->
<script>
import { abnormalPlugin, bottleMonitorInit, userPlugin, vitalsPlugin } from '@bottle-monitor/core'

export default {
  name: 'App',
  mounted() {
    bottleMonitorInit({
      dsnURL: process.env.VUE_APP_MONITOR_URL,
      userId: 'current-user-id',
      framework: 'vue',
      plugins: [
        userPlugin({
          options: {
            click: true,
            hash: true, // Vue Router Hash 模式
            history: true // Vue Router History 模式
          }
        }),
        vitalsPlugin({ options: { FCP: true, LCP: true, CLS: true } }),
        abnormalPlugin({ options: { codeError: true, whitescreen: true } })
      ]
    })
  }
}
</script>

<template>
  <div id="app">
    <!-- Your App -->
  </div>
</template>
```

## 📖 核心功能

### 🚨 错误监控

自动捕获和上报各种错误：

- **JavaScript 运行时错误** - 同步/异步代码错误
- **Promise 未捕获错误** - `unhandledrejection` 事件
- **资源加载错误** - 图片、脚本、样式文件等
- **网络请求错误** - HTTP 错误状态码
- **白屏检测** - Canvas 采样 + 关键元素检测
- **自定义错误** - 手动上报业务错误

```typescript
// 配置错误监控
abnormalPlugin({
  options: {
    codeError: true, // JavaScript错误
    unhandledrejection: true, // Promise错误
    resource: true, // 资源错误
    network: true, // 网络错误
    whitescreen: true, // 白屏检测
    repeatError: false, // 去重复错误
    filterXhrUrlRegExp: /api/ // 过滤特定URL
  }
})

// 手动上报错误
monitor.track('custom_error', {
  message: 'Business logic error',
  level: 'warning',
  extra: { userId: '123', action: 'submit' }
})
```

### 📊 性能监控

全面的性能指标采集：

- **Core Web Vitals** - FCP, LCP, CLS, FID, INP, TTFB
- **自定义指标** - FPS, FSP, 长任务, 资源性能
- **实时监控** - 性能变化实时上报
- **归因分析** - 性能问题根因分析

```typescript
vitalsPlugin({
  options: {
    // Core Web Vitals
    FCP: true, // First Contentful Paint
    LCP: true, // Largest Contentful Paint
    CLS: true, // Cumulative Layout Shift
    FID: true, // First Input Delay
    INP: true, // Interaction to Next Paint
    TTFB: true, // Time to First Byte

    // 自定义指标
    FPS: true, // 帧率监控
    FSP: true, // 首屏时间
    Resource: true, // 资源性能
    LongTask: true, // 长任务监控

    // 配置选项
    reportAllChanges: false, // 是否上报所有变化
    attribution: true, // 包含归因信息
    sampleRate: 1.0 // 采样率
  }
})
```

### 👤 用户行为监控

详细的用户交互追踪：

- **点击事件** - 支持 XPath/CSS 选择器定位
- **路由变化** - History API / Hash 路由监听
- **网络请求** - XMLHttpRequest / Fetch 拦截
- **页面访问** - PV/UV 统计
- **设备信息** - 浏览器、操作系统、网络状态

```typescript
userPlugin({
  options: {
    click: true, // 点击监控
    clickContainers: ['body'], // 点击容器
    network: true, // 网络监控
    hash: true, // Hash路由
    history: true, // History路由
    pageView: true, // 页面访问
    uniqueVisitor: true, // 独立访客
    deviceInfo: true, // 设备信息
    filterXhrUrlRegExp: /api/ // 过滤URL
  }
})
```

## ⚙️ 高级配置

### Hook 系统

支持数据预处理和自定义逻辑：

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
        environment: process.env.NODE_ENV
      }))
    }
  }
})
```

### 自定义插件

```typescript
// 创建自定义插件
const customPlugin = {
  name: 'custom',
  init: ({ eventBus, config }) => {
    // 插件初始化逻辑
    setInterval(() => {
      eventBus.emit('bottle-monitor:custom', 'heartbeat', {
        timestamp: Date.now(),
        status: 'alive'
      })
    }, 60000) // 每分钟发送心跳
  }
}

// 注册并使用
const monitor = getBottleMonitor()
monitor.registerPlugin(customPlugin)
```

### Service Worker 增强

支持离线缓存和后台同步：

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

## 🏗️ 架构设计

### 包结构

```
packages/
├── core/           # 核心包 - 事件总线、插件系统
├── plugins/        # 插件包 - 各种监控插件
├── types/          # 类型定义包
└── utils/          # 工具包 - 通用工具函数
```

### 数据流

```
数据采集 → 事件总线 → 队列管理 → 数据处理 → 智能上报
    ↓         ↓         ↓         ↓         ↓
  插件层   EventBus   Transport   Hook    Network
```

## 🛠️ 开发和构建

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建所有包
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 发布版本
pnpm changeset
pnpm version-packages
pnpm release
```

## 📊 性能指标

- **核心包大小**: < 20KB (gzipped)
- **单插件大小**: < 10KB (gzipped)
- **初始化耗时**: < 5ms
- **事件处理**: < 1ms
- **内存占用**: < 2MB
- **对 Core Web Vitals 影响**: 忽略不计

## 🔧 兼容性

- **现代浏览器**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **移动端**: iOS Safari 12+, Android Chrome 60+
- **Node.js**: 14+ (用于构建工具)

## 📝 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新详情。

## 🤝 贡献指南

欢迎贡献代码！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详细信息。

## 📄 许可证

[ISC License](./LICENSE) © 2024 Bottle414

## 🔗 相关链接

- [在线文档](https://bottle-monitor.dev)
- [示例项目](./examples)
- [性能基准](./benchmarks)
- [问题反馈](https://github.com/bottle414/bottle-monitor/issues)
