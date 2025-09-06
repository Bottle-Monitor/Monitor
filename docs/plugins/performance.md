# ⚡ 性能监控插件

性能监控插件是 Bottle Monitor 的核心功能之一，能够自动收集和上报各种性能指标，帮助开发者监控和优化应用性能。

## ✨ 功能特性

- **📊 Core Web Vitals**：自动收集 FCP、LCP、CLS、FID、INP、TTFB 等核心指标
- **🎯 自定义指标**：支持 FPS、FSP、资源性能、长任务等扩展监控
- **🔄 实时监控**：性能数据实时收集和上报
- **📈 智能分析**：自动计算性能评级和趋势分析
- **🎨 可视化支持**：提供丰富的性能数据用于可视化展示
- **🔧 灵活配置**：支持自定义阈值和采样策略

## 📦 安装

```bash
# 性能监控插件已包含在核心包中
npm install @bottle-monitor/core
```

## 🚀 快速开始

### 基础配置

```typescript
import { bottleMonitorInit, vitalsPlugin } from '@bottle-monitor/core'

const monitor = bottleMonitorInit({
  dsnURL: 'https://your-api.com/monitor',
  plugins: [
    vitalsPlugin({
      options: {
        FCP: true,        // First Contentful Paint
        LCP: true,        // Largest Contentful Paint
        CLS: true,        // Cumulative Layout Shift
        FID: true,        // First Input Delay
        INP: true,        // Interaction to Next Paint
        TTFB: true,       // Time to First Byte
        FPS: true,        // 帧率监控
        FSP: true,        // First Screen Paint
        Resource: true,   // 资源性能
      }
    })
  ]
})
```

### 手动上报性能数据

```typescript
import { getBottleMonitor } from '@bottle-monitor/core'

const monitor = getBottleMonitor()

// 上报自定义性能指标
monitor.track('vitals', {
  type: 'custom_metric',
  name: 'api_response_time',
  value: 1200,
  rating: 'good',
  timestamp: Date.now(),
  extra: {
    endpoint: '/api/users',
    method: 'GET',
    cacheHit: false
  }
})

// 上报业务性能指标
monitor.track('vitals', {
  type: 'business_metric',
  name: 'page_load_complete',
  value: 2500,
  rating: 'needs-improvement',
  extra: {
    pageType: 'product_detail',
    userId: 'user-123',
    deviceType: 'mobile'
  }
})
```

## ⚙️ 配置选项

### 插件配置

```typescript
vitalsPlugin({
  // 监控选项
  options: {
    // Core Web Vitals
    FCP: true,        // First Contentful Paint
    LCP: true,        // Largest Contentful Paint
    CLS: true,        // Cumulative Layout Shift
    FID: true,        // First Input Delay
    INP: true,        // Interaction to Next Paint
    TTFB: true,       // Time to First Byte
    
    // 自定义性能指标
    FPS: true,        // 帧率监控
    FSP: true,        // First Screen Paint
    Resource: true,   // 资源性能监控
    
    // 性能阈值配置
    thresholds: {
      FCP: [1800, 3000],    // [good, poor] 毫秒
      LCP: [2500, 4000],    // [good, poor] 毫秒
      CLS: [0.1, 0.25],     // [good, poor] 分数
      FID: [100, 300],      // [good, poor] 毫秒
      INP: [200, 500],      // [good, poor] 毫秒
      TTFB: [800, 1800],    // [good, poor] 毫秒
      FPS: [30, 20],        // [good, poor] 帧/秒
      FSP: [1500, 3000]     // [good, poor] 毫秒
    },
    
    // 采样配置
    sampleRate: 1.0,      // 采样率 (0-1)
    reportAllChanges: false, // 是否上报所有变化
    attribution: true     // 是否包含归因信息
  },
  
  // 面包屑配置
  breadcrumbs: {
    // 面包屑容量
    capacity: 20,
    
    // 上报间隔
    uploadInterval: 30000,
    
    // 是否包含性能时间线
    includeTimeline: true,
    
    // 是否包含资源详情
    includeResourceDetails: true
  }
})
```

### 全局配置

```typescript
bottleMonitorInit({
  // ... 其他配置
  
  // 性能监控全局配置
  vitalsMonitor: {
    // 性能数据采样率 (0-1)
    sampleRate: 0.5,
    
    // 最大性能数据数量限制
    maxMetrics: 500,
    
    // 性能数据上报间隔 (毫秒)
    reportInterval: 30000,
    
    // 是否在开发环境启用
    enableInDev: true,
    
    // 自定义性能数据处理器
    onMetric: (metric) => {
      console.log('收集到性能指标:', metric)
      return metric
    }
  }
})
```

## 🔍 性能指标详解

### 1. Core Web Vitals

#### First Contentful Paint (FCP)
首次内容绘制时间，衡量页面开始加载到首个内容元素渲染的时间。

```typescript
// FCP 阈值
// 好：< 1.8s
// 需要改进：1.8s - 3.0s  
// 差：> 3.0s

// 示例：优化 FCP
// 1. 减少关键资源大小
// 2. 移除阻塞渲染的资源
// 3. 使用 CDN 加速
```

#### Largest Contentful Paint (LCP)
最大内容绘制时间，衡量页面主要内容完成渲染的时间。

```typescript
// LCP 阈值
// 好：< 2.5s
// 需要改进：2.5s - 4.0s
// 差：> 4.0s

// 示例：优化 LCP
// 1. 优化图片加载
// 2. 预加载关键资源
// 3. 优化服务器响应时间
```

#### Cumulative Layout Shift (CLS)
累积布局偏移，衡量页面视觉稳定性。

```typescript
// CLS 阈值
// 好：< 0.1
// 需要改进：0.1 - 0.25
// 差：> 0.25

// 示例：优化 CLS
// 1. 为图片和视频设置尺寸属性
// 2. 避免在现有内容上方插入内容
// 3. 使用 transform 动画而非改变布局的动画
```

#### First Input Delay (FID)
首次输入延迟，衡量用户首次交互到浏览器响应的时间。

```typescript
// FID 阈值
// 好：< 100ms
// 需要改进：100ms - 300ms
// 差：> 300ms

// 示例：优化 FID
// 1. 减少 JavaScript 执行时间
// 2. 分割长任务
// 3. 使用 Web Workers
```

#### Interaction to Next Paint (INP)
交互到下次绘制，衡量页面对用户交互的响应性。

```typescript
// INP 阈值
// 好：< 200ms
// 需要改进：200ms - 500ms
// 差：> 500ms

// 示例：优化 INP
// 1. 优化事件处理器
// 2. 减少主线程阻塞
// 3. 使用 requestIdleCallback
```

#### Time to First Byte (TTFB)
首字节时间，衡量服务器响应速度。

```typescript
// TTFB 阈值
// 好：< 800ms
// 需要改进：800ms - 1800ms
// 差：> 1800ms

// 示例：优化 TTFB
// 1. 优化服务器性能
// 2. 使用 CDN
// 3. 启用缓存
```

### 2. 自定义性能指标

#### Frames Per Second (FPS)
帧率监控，衡量页面动画流畅度。

```typescript
vitalsPlugin({
  options: {
    FPS: true,
    fpsConfig: {
      // 监控间隔
      interval: 1000,
      // 低帧率阈值
      lowFpsThreshold: 30,
      // 监控持续时间
      duration: 10000
    }
  }
})
```

#### First Screen Paint (FSP)
首屏绘制时间，衡量首屏内容完成渲染的时间。

```typescript
vitalsPlugin({
  options: {
    FSP: true,
    fspConfig: {
      // 首屏元素选择器
      selectors: ['.main-content', '#app', '.container'],
      // 检测间隔
      checkInterval: 100
    }
  }
})
```

#### 资源性能监控
监控各种资源的加载性能。

```typescript
vitalsPlugin({
  options: {
    Resource: true,
    resourceConfig: {
      // 监控的资源类型
      types: ['script', 'link', 'img', 'fetch', 'xmlhttprequest'],
      // 慢资源阈值 (毫秒)
      slowResourceThreshold: 3000,
      // 是否监控缓存命中率
      trackCacheHit: true
    }
  }
})
```

## 🎯 性能数据结构

### 性能指标对象结构

```typescript
interface VitalsData {
  // 指标类型
  type: 'FCP' | 'LCP' | 'CLS' | 'FID' | 'INP' | 'TTFB' | 'FPS' | 'FSP' | 'Resource' | 'LongTask'
  
  // 指标名称
  name: string
  
  // 指标值
  value: number
  
  // 性能评级
  rating: 'good' | 'needs-improvement' | 'poor'
  
  // 变化量
  delta: number
  
  // 唯一标识
  id: string
  
  // 导航类型
  navigationType?: 'navigate' | 'reload' | 'back_forward' | 'prerender'
  
  // 性能条目
  entries: PerformanceEntry[]
  
  // 归因信息
  attribution?: {
    element?: string
    url?: string
    source?: string
  }
  
  // 页面信息
  page: {
    url: string
    title: string
    referrer: string
  }
  
  // 设备信息
  device: {
    userAgent: string
    platform: string
    connection?: {
      effectiveType: string
      downlink: number
      rtt: number
    }
  }
  
  // 额外信息
  extra?: Record<string, any>
  
  // 时间戳
  timestamp: number
  
  // 会话 ID
  sessionId: string
}
```

### 资源性能数据结构

```typescript
interface ResourcePerfData {
  // 资源名称
  name: string
  
  // 资源类型
  type: 'script' | 'link' | 'img' | 'fetch' | 'xmlhttprequest'
  
  // 加载时长
  duration: number
  
  // 资源大小
  size: number
  
  // 传输大小
  transferSize: number
  
  // 是否缓存命中
  cacheHit: boolean
  
  // 协议版本
  protocol: string
  
  // 时间戳
  timestamp: number
}
```

## 🔧 高级功能

### 自定义性能指标处理器

```typescript
vitalsPlugin({
  options: {
    // ... 其他选项
    
    // 自定义指标处理器
    onMetric: (metric) => {
      // 过滤特定指标
      if (metric.name === 'FCP' && metric.value < 100) {
        return null // 返回 null 表示忽略此指标
      }
      
      // 添加额外信息
      metric.extra = {
        ...metric.extra,
        customField: 'custom value',
        processedAt: Date.now()
      }
      
      return metric
    }
  }
})
```

### 性能预算监控

```typescript
vitalsPlugin({
  options: {
    // ... 其他选项
    
    // 性能预算配置
    performanceBudget: {
      // 页面加载时间预算
      pageLoadTime: 3000,
      
      // 资源大小预算
      resourceSize: {
        script: 500 * 1024,  // 500KB
        style: 100 * 1024,   // 100KB
        image: 1024 * 1024   // 1MB
      },
      
      // 预算超出时的处理
      onBudgetExceeded: (metric, budget) => {
        console.warn(`性能预算超出: ${metric.name} = ${metric.value}, 预算: ${budget}`)
      }
    }
  }
})
```

### 性能数据聚合

```typescript
vitalsPlugin({
  options: {
    // ... 其他选项
    
    // 数据聚合配置
    aggregation: {
      // 聚合间隔
      interval: 60000, // 1分钟
      
      // 聚合策略
      strategy: {
        FCP: 'p75',     // 75分位数
        LCP: 'p75',     // 75分位数
        CLS: 'average', // 平均值
        FID: 'p95',     // 95分位数
        FPS: 'min'      // 最小值
      }
    }
  }
})
```

## 📱 框架集成

### React 集成

```tsx
import { useEffect } from 'react'
import { bottleMonitorInit, vitalsPlugin } from '@bottle-monitor/core'

function App() {
  useEffect(() => {
    bottleMonitorInit({
      dsnURL: process.env.REACT_APP_MONITOR_URL,
      plugins: [
        vitalsPlugin({
          options: {
            FCP: true,
            LCP: true,
            CLS: true,
            FID: true,
            INP: true,
            // React 特定配置
            react: {
              // 监控组件渲染性能
              componentRender: true,
              // 监控 Hook 性能
              hookPerformance: true
            }
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
<script>
import { bottleMonitorInit, vitalsPlugin } from '@bottle-monitor/core'

export default {
  name: 'App',
  mounted() {
    bottleMonitorInit({
      dsnURL: process.env.VUE_APP_MONITOR_URL,
      plugins: [
        vitalsPlugin({
          options: {
            FCP: true,
            LCP: true,
            CLS: true,
            FID: true,
            INP: true,
            // Vue 特定配置
            vue: {
              // 监控组件生命周期性能
              lifecycle: true,
              // 监控路由切换性能
              routerPerformance: true
            }
          }
        })
      ]
    })
  }
}
</script>
```

## 🧪 测试和调试

### 测试性能监控

```typescript
// 测试 Core Web Vitals
setTimeout(() => {
  // 模拟长任务影响 FID
  const start = performance.now()
  while (performance.now() - start < 200) {
    // 阻塞主线程
  }
}, 1000)

// 测试 CLS
setTimeout(() => {
  const element = document.createElement('div')
  element.style.height = '100px'
  element.style.backgroundColor = 'red'
  document.body.insertBefore(element, document.body.firstChild)
}, 2000)

// 测试资源加载性能
const img = new Image()
img.src = 'https://example.com/large-image.jpg'
```

### 调试模式

```typescript
vitalsPlugin({
  options: {
    // ... 其他选项
    
    // 调试模式
    debug: true,
    
    // 控制台输出
    console: {
      enabled: true,
      level: 'info', // info, warning, error
      showTimeline: true // 显示性能时间线
    }
  }
})
```

## 📊 性能优化

### 数据采样

```typescript
vitalsPlugin({
  options: {
    // ... 其他选项
    
    // 性能数据采样
    sampling: {
      // 采样率 (0-1)
      rate: 0.1, // 只上报 10% 的性能数据
      
      // 采样策略
      strategy: 'random', // random, consistent, adaptive
      
      // 自适应采样
      adaptive: {
        enabled: true,
        minRate: 0.01,
        maxRate: 1.0,
        targetMetricsPerMinute: 100
      }
    }
  }
})
```

### 内存管理

```typescript
vitalsPlugin({
  options: {
    // ... 其他选项
    
    // 内存管理
    memory: {
      // 最大性能数据数量
      maxMetrics: 500,
      
      // 自动清理间隔
      cleanupInterval: 60000,
      
      // 清理策略
      cleanupStrategy: 'lru' // lru, fifo, random
    }
  }
})
```

## 🎯 最佳实践

### 1. 性能指标分类

```typescript
// 按页面类型分类性能指标
monitor.track('vitals', {
  type: 'page_performance',
  category: 'product_page',
  subcategory: 'detail_view',
  name: 'LCP',
  value: 2100,
  rating: 'good'
})
```

### 2. 性能上下文

```typescript
// 提供丰富的性能上下文
monitor.track('vitals', {
  type: 'resource_performance',
  name: 'api_response_time',
  value: 850,
  extra: {
    endpoint: '/api/products',
    method: 'GET',
    cacheHit: false,
    userId: 'user-456',
    deviceType: 'mobile',
    connectionType: '4g',
    timestamp: Date.now()
  }
})
```

### 3. 性能阈值配置

```typescript
// 根据业务需求配置性能阈值
vitalsPlugin({
  options: {
    thresholds: {
      // 移动端阈值更宽松
      FCP: window.innerWidth < 768 ? [2000, 4000] : [1800, 3000],
      LCP: window.innerWidth < 768 ? [3000, 5000] : [2500, 4000],
      // 根据网络类型调整
      TTFB: navigator.connection?.effectiveType === '4g' ? [800, 1800] : [1500, 3000]
    }
  }
})
```

### 4. 性能数据上报优化

```typescript
// 优化性能数据上报
vitalsPlugin({
  options: {
    reporting: {
      // 批量上报减少网络请求
      batch: {
        enabled: true,
        size: 10,
        interval: 30000
      },
      
      // 智能重试
      retry: {
        maxAttempts: 3,
        backoff: 'exponential',
        initialDelay: 1000
      }
    }
  }
})
```

## 🔗 相关链接

- 📖 [错误监控插件](./error.md)
- 👤 [用户行为插件](./user.md)
- 🔧 [插件开发指南](./custom.md)
- 📱 [集成示例](../examples/)
- 🐛 [常见问题](../faq.md)

如果您在使用性能监控插件时遇到任何问题，欢迎：

- 📝 查看 [常见问题](../faq.md)
- 🐛 提交 [Issue](https://github.com/bottle414/bottle-monitor/issues)
- 💬 参与 [讨论](https://github.com/bottle414/bottle-monitor/discussions)