# 使用示例
```typescript
/**
 * Bottle Monitor SDK 基本使用示例
 */

import { abnormalPlugin, bottleMonitorInit, userPlugin, vitalsPlugin } from '@bottle-monitor/core'

// 基本配置
const monitor = bottleMonitorInit({
  dsnURL: 'https://api.example.com/monitor',
  userId: 'user-123',
  projectId: 'my-project',
  plugins: [
    // 用户行为监控
    userPlugin({
      options: {
        click: true, // 点击事件
        network: true, // 网络请求
        hash: true, // Hash路由
        history: true, // History路由
        pageView: true, // 页面访问
        deviceInfo: true, // 设备信息
      },
      breadcrumbs: {
        capacity: 50, // 队列容量
        uploadInterval: 30000, // 30秒上报一次
      },
    }),

    // 性能监控
    vitalsPlugin({
      options: {
        FCP: true, // First Contentful Paint
        LCP: true, // Largest Contentful Paint
        CLS: true, // Cumulative Layout Shift
        FID: true, // First Input Delay
        INP: true, // Interaction to Next Paint
        TTFB: true, // Time to First Byte
        FPS: true, // 帧率监控
        Resource: true, // 资源性能
      },
      breadcrumbs: {
        capacity: 20,
        uploadInterval: 30000,
      },
    }),

    // 错误监控
    abnormalPlugin({
      options: {
        codeError: true, // JavaScript错误
        unhandledrejection: true, // Promise未捕获错误
        resource: true, // 资源加载错误
        network: true, // 网络请求错误
        whitescreen: true, // 白屏检测
        repeatError: false, // 去重复错误
      },
      breadcrumbs: {
        capacity: 1, // 错误立即上报
        uploadInterval: 0,
      },
    }),
  ],

  // 全局Hook
  hooks: {
    beforePushBreadcrumb: (data) => {
      // 数据入队前处理
      console.log('Before push breadcrumb:', data)
      return data
    },

    beforeTransport: (data) => {
      // 上报前最终处理
      console.log('Before transport:', data)
      return data
    },
  },
})

// 手动上报自定义事件
monitor.track('button_click', {
  buttonId: 'submit-btn',
  page: 'checkout',
  timestamp: Date.now(),
})

// 错误演示
setTimeout(() => {
  // 这会触发JavaScript错误监控
  throw new Error('Test error for monitoring')
}, 5000)

// Promise错误演示
setTimeout(() => {
  // 这会触发Promise错误监控
  Promise.reject(new Error('Test promise rejection'))
}, 8000)

console.log('Bottle Monitor initialized successfully!')
```