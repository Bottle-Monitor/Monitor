# 🚨 错误监控插件

错误监控插件是 Bottle Monitor 的核心功能之一，能够自动捕获和上报各种类型的错误，帮助开发者快速定位和解决问题。

## ✨ 功能特性

- **🔍 自动捕获**：无需手动配置，自动捕获各种错误
- **📊 智能分类**：按错误类型自动分类和去重
- **🔄 实时上报**：错误发生后立即上报，支持离线缓存
- **🎯 精准定位**：提供完整的错误堆栈和上下文信息
- **🛡️ 白屏检测**：智能检测页面白屏问题
- **🔧 灵活配置**：支持自定义错误过滤和处理规则

## 📦 安装

```bash
# 错误监控插件已包含在核心包中
npm install @bottle-monitor/core
```

## 🚀 快速开始

### 基础配置

```typescript
import { bottleMonitorInit, errorPlugin } from '@bottle-monitor/core'

const monitor = bottleMonitorInit({
  dsnURL: 'https://your-api.com/monitor',
  plugins: [
    errorPlugin({
      options: {
        codeError: true,           // JavaScript 运行时错误
        unhandledrejection: true,  // Promise 未捕获错误
        resource: true,            // 资源加载错误
        network: true,             // 网络请求错误
        whitescreen: true          // 白屏检测
      }
    })
  ]
})
```

### 手动上报错误

```typescript
import { getBottleMonitor } from '@bottle-monitor/core'

const monitor = getBottleMonitor()

// 上报业务错误
monitor.track('error', {
  type: 'business_error',
  message: '用户权限不足',
  level: 'warning',
  stack: new Error().stack,
  extra: {
    userId: 'user-123',
    action: 'access_admin_panel',
    timestamp: Date.now()
  }
})

// 上报自定义错误
monitor.track('error', {
  type: 'custom_error',
  message: '表单验证失败',
  level: 'error',
  category: 'validation',
  extra: {
    formId: 'login-form',
    field: 'email',
    value: 'invalid-email'
  }
})
```

## ⚙️ 配置选项

### 插件配置

```typescript
errorPlugin({
  // 监控选项
  options: {
    // JavaScript 运行时错误
    codeError: true,
    
    // Promise 未捕获错误
    unhandledrejection: true,
    
    // 资源加载错误（图片、脚本、样式等）
    resource: true,
    
    // 网络请求错误
    network: true,
    
    // 白屏检测
    whitescreen: true,
    
    // 重复错误去重
    repeatError: false,
    
    // 错误过滤规则
    filterXhrUrlRegExp: /api/,
    
    // 忽略特定错误
    ignoreErrors: [
      /Script error/,
      /ResizeObserver loop limit exceeded/
    ]
  },
  
  // 面包屑配置
  breadcrumbs: {
    // 面包屑容量
    capacity: 50,
    
    // 是否包含 DOM 元素
    includeDom: true,
    
    // 是否包含控制台日志
    includeConsole: true,
    
    // 是否包含网络请求
    includeNetwork: true
  }
})
```

### 全局配置

```typescript
bottleMonitorInit({
  // ... 其他配置
  
  // 错误监控全局配置
  errorMonitor: {
    // 错误采样率 (0-1)
    sampleRate: 1.0,
    
    // 最大错误数量限制
    maxErrors: 1000,
    
    // 错误上报间隔 (毫秒)
    reportInterval: 5000,
    
    // 是否在开发环境启用
    enableInDev: false,
    
    // 自定义错误处理器
    onError: (error) => {
      console.log('捕获到错误:', error)
      return error
    }
  }
})
```

## 🔍 错误类型详解

### 1. JavaScript 运行时错误

自动捕获 `error` 事件，包括：

- **语法错误**：代码语法问题
- **运行时错误**：执行过程中的错误
- **引用错误**：访问未定义变量
- **类型错误**：类型不匹配错误

```typescript
// 示例：访问未定义变量
console.log(undefinedVariable) // 自动捕获 ReferenceError

// 示例：类型错误
const number = 42
number.toUpperCase() // 自动捕获 TypeError
```

### 2. Promise 未捕获错误

自动捕获 `unhandledrejection` 事件：

```typescript
// 示例：未处理的 Promise 错误
Promise.reject(new Error('Promise 错误')) // 自动捕获

// 示例：异步函数中的错误
async function fetchData() {
  throw new Error('网络请求失败')
}
fetchData() // 自动捕获
```

### 3. 资源加载错误

监控各种资源的加载状态：

- **图片加载失败**
- **脚本加载失败**
- **样式文件加载失败**
- **字体文件加载失败**

```typescript
// 示例：图片加载失败
const img = new Image()
img.src = 'non-existent-image.jpg' // 自动捕获加载错误
```

### 4. 网络请求错误

监控 HTTP 请求状态：

- **4xx 客户端错误**
- **5xx 服务器错误**
- **网络超时**
- **请求被取消**

```typescript
// 示例：网络请求错误
fetch('/api/non-existent-endpoint')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return response.json()
  })
  // 错误会被自动捕获
```

### 5. 白屏检测

智能检测页面白屏问题：

```typescript
errorPlugin({
  options: {
    whitescreen: true,
    whitescreen: {
      // 检测间隔 (毫秒)
      interval: 2000,
      
      // 检测阈值
      threshold: 0.8,
      
      // 检测元素选择器
      selectors: ['body', '#app', '.main-content'],
      
      // 自定义检测逻辑
      checkFunction: (canvas) => {
        // 返回 true 表示白屏
        return canvas.getImageData(0, 0, 100, 100).data.every(pixel => pixel === 255)
      }
    }
  }
})
```

## 🎯 错误数据结构

### 错误对象结构

```typescript
interface ErrorData {
  // 错误类型
  type: 'js_error' | 'promise_error' | 'resource_error' | 'network_error' | 'whitescreen_error' | 'custom_error'
  
  // 错误消息
  message: string
  
  // 错误堆栈
  stack?: string
  
  // 错误级别
  level: 'info' | 'warning' | 'error' | 'fatal'
  
  // 错误分类
  category?: string
  
  // 错误来源
  source?: string
  
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
    language: string
    screen: {
      width: number
      height: number
    }
  }
  
  // 面包屑信息
  breadcrumbs: Breadcrumb[]
  
  // 额外信息
  extra?: Record<string, any>
  
  // 时间戳
  timestamp: number
  
  // 会话 ID
  sessionId: string
}
```

### 面包屑结构

```typescript
interface Breadcrumb {
  // 面包屑类型
  type: 'navigation' | 'click' | 'console' | 'network' | 'dom' | 'custom'
  
  // 面包屑消息
  message: string
  
  // 面包屑数据
  data?: Record<string, any>
  
  // 时间戳
  timestamp: number
  
  // 级别
  level: 'info' | 'warning' | 'error'
}
```

## 🔧 高级功能

### 自定义错误处理器

```typescript
errorPlugin({
  options: {
    // ... 其他选项
    
    // 自定义错误处理器
    onError: (error) => {
      // 过滤特定错误
      if (error.message.includes('ResizeObserver')) {
        return null // 返回 null 表示忽略此错误
      }
      
      // 添加额外信息
      error.extra = {
        ...error.extra,
        customField: 'custom value',
        processedAt: Date.now()
      }
      
      return error
    }
  }
})
```

### 错误分组和去重

```typescript
errorPlugin({
  options: {
    // ... 其他选项
    
    // 错误分组策略
    groupingStrategy: {
      // 按消息分组
      byMessage: true,
      
      // 按堆栈分组
      byStack: true,
      
      // 自定义分组函数
      custom: (error1, error2) => {
        // 返回 true 表示两个错误属于同一组
        return error1.message === error2.message && 
               error1.type === error2.type
      }
    },
    
    // 去重配置
    deduplication: {
      // 去重时间窗口 (毫秒)
      timeWindow: 60000,
      
      // 最大重复次数
      maxDuplicates: 10
    }
  }
})
```

### 错误上报策略

```typescript
errorPlugin({
  options: {
    // ... 其他选项
    
    // 上报策略
    reporting: {
      // 立即上报
      immediate: true,
      
      // 批量上报
      batch: {
        enabled: true,
        size: 10,
        interval: 5000
      },
      
      // 重试策略
      retry: {
        maxAttempts: 3,
        backoff: 'exponential', // exponential, linear
        initialDelay: 1000
      }
    }
  }
})
```

## 📱 框架集成

### React 集成

```tsx
import { useEffect } from 'react'
import { bottleMonitorInit, errorPlugin } from '@bottle-monitor/core'

function App() {
  useEffect(() => {
    bottleMonitorInit({
      dsnURL: process.env.REACT_APP_MONITOR_URL,
      plugins: [
        errorPlugin({
          options: {
            codeError: true,
            unhandledrejection: true,
            whitescreen: true,
            // React 特定配置
            react: {
              // 捕获 React 错误边界错误
              errorBoundary: true,
              // 捕获 React 组件错误
              componentError: true
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
import { bottleMonitorInit, errorPlugin } from '@bottle-monitor/core'

export default {
  name: 'App',
  mounted() {
    bottleMonitorInit({
      dsnURL: process.env.VUE_APP_MONITOR_URL,
      plugins: [
        errorPlugin({
          options: {
            codeError: true,
            unhandledrejection: true,
            whitescreen: true,
            // Vue 特定配置
            vue: {
              // 捕获 Vue 错误处理器错误
              errorHandler: true,
              // 捕获 Vue 警告
              warnHandler: true
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

### 测试错误捕获

```typescript
// 测试 JavaScript 错误
setTimeout(() => {
  throw new Error('测试错误')
}, 1000)

// 测试 Promise 错误
Promise.reject(new Error('测试 Promise 错误'))

// 测试资源加载错误
const img = new Image()
img.src = 'data:image/png;base64,invalid'

// 测试网络错误
fetch('/api/test-error')
```

### 调试模式

```typescript
errorPlugin({
  options: {
    // ... 其他选项
    
    // 调试模式
    debug: true,
    
    // 控制台输出
    console: {
      enabled: true,
      level: 'info' // info, warning, error
    }
  }
})
```

## 📊 性能优化

### 错误采样

```typescript
errorPlugin({
  options: {
    // ... 其他选项
    
    // 错误采样
    sampling: {
      // 采样率 (0-1)
      rate: 0.1, // 只上报 10% 的错误
      
      // 采样策略
      strategy: 'random', // random, consistent, adaptive
      
      // 自适应采样
      adaptive: {
        enabled: true,
        minRate: 0.01,
        maxRate: 1.0,
        targetErrorsPerMinute: 100
      }
    }
  }
})
```

### 内存管理

```typescript
errorPlugin({
  options: {
    // ... 其他选项
    
    // 内存管理
    memory: {
      // 最大错误数量
      maxErrors: 1000,
      
      // 自动清理间隔
      cleanupInterval: 60000,
      
      // 清理策略
      cleanupStrategy: 'lru' // lru, fifo, random
    }
  }
})
```

## 🎯 最佳实践

### 1. 错误分类

```typescript
// 按业务场景分类错误
monitor.track('error', {
  type: 'business_error',
  category: 'user_authentication',
  subcategory: 'login_failure',
  message: '用户登录失败',
  level: 'warning'
})
```

### 2. 错误上下文

```typescript
// 提供丰富的错误上下文
monitor.track('error', {
  type: 'api_error',
  message: 'API 请求失败',
  extra: {
    endpoint: '/api/users',
    method: 'POST',
    requestId: 'req-123',
    userId: 'user-456',
    userRole: 'admin',
    browser: navigator.userAgent,
    timestamp: Date.now()
  }
})
```

### 3. 错误过滤

```typescript
// 过滤无关错误
errorPlugin({
  options: {
    ignoreErrors: [
      // 忽略第三方库错误
      /Script error/,
      /ResizeObserver loop limit exceeded/,
      /Non-Error promise rejection/,
      
      // 忽略特定域名错误
      /chrome-extension/,
      /moz-extension/,
      
      // 忽略特定错误消息
      /User cancelled the operation/,
      /The operation was aborted/
    ]
  }
})
```

### 4. 错误上报优化

```typescript
// 优化错误上报
errorPlugin({
  options: {
    reporting: {
      // 批量上报减少网络请求
      batch: {
        enabled: true,
        size: 20,
        interval: 10000
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

- 📖 [性能监控插件](./performance.md)
- 👤 [用户行为插件](./user.md)
- 🔧 [插件开发指南](./custom.md)
- 📱 [集成示例](../examples/)
- 🐛 [常见问题](../faq.md)

如果您在使用错误监控插件时遇到任何问题，欢迎：

- 📝 查看 [常见问题](../faq.md)
- 🐛 提交 [Issue](https://github.com/Bottle-Monitor/Monitor/issues)
- 💬 参与 [讨论](https://github.com/Bottle-Monitor/Monitor/discussions)
