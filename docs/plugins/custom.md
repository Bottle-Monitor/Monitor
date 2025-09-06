# 🔧 自定义插件开发指南
自定义插件是 Bottle Monitor 的扩展机制，允许开发者根据业务需求创建专属的监控功能，实现个性化的数据收集和处理。

## ✨ 功能特性
- 🎯 灵活扩展 ：基于插件架构，支持任意功能扩展
- 📊 数据定制 ：自定义数据收集和处理逻辑
- 🔄 事件驱动 ：基于事件总线的松耦合设计
- ⚡ 高性能 ：异步初始化，不影响主线程性能
- 🛡️ 类型安全 ：完整的 TypeScript 类型支持
- 🔧 配置灵活 ：支持动态配置和运行时调整

## 🚀 快速开始
实现自定义插件非常简单，只需要实现 initPlugin() 方法即可。Bottle-Monitor 会在 SDK 初始化时注入事件总线和选项。transport 层通过监听 bottle-monitor:custom 事件来收集自定义事件。

一个简单的自定义插件如下：
```typescript
import type { EventBusReturn, CustomPlugin } from '@bottle-monitor/types'

// 定义插件配置接口
interface MyPluginOptions {
  enabled: boolean
  interval: number
  customField: string
}

// 创建自定义插件
function MyCustomPlugin({
  eventBus,
  options,
}: {
  eventBus: EventBusReturn
  options: MyPluginOptions
}) {
  // 插件初始化逻辑
  const initPlugin = () => {
    if (!options.enabled) return
    
    console.log('自定义插件已启动')
    
    // 定时收集数据
    setInterval(() => {
      const data = {
        timestamp: Date.now(),
        customData: options.customField,
        value: Math.random() * 100
      }
      
      // 通过事件总线发送数据
      eventBus.emit('bottle-monitor:custom', 'my_custom_event', data)
    }, options.interval)
  }
  
  // 执行初始化
  initPlugin()
  
  // 返回插件控制接口
  return {
    // 手动触发数据收集
    collect: (customData: any) => {
      eventBus.emit('bottle-monitor:custom', 'manual_collect', {
        timestamp: Date.now(),
        data: customData
      })
    },
    
    // 插件销毁方法
    destroy: () => {
      console.log('自定义插件已销毁')
    }
  }
}

export default MyCustomPlugin
```

使用它：
```typescript
import { BottleMonitor } from '@bottle-monitor/core'
BottleMonitor({
    plugins: []
})

MyCustomPlugin({
  options: {
      enabled: true
  },
  breadcrumbs: {
      capacity: 10
  }
})
```

## 🔗 相关链接

- 📖 [性能监控插件](./performance.md)
- 👤 [用户行为插件](./user.md)
- 🔧 [错误监控插件](./error.md)
- 📱 [集成示例](../examples/)
- 🐛 [常见问题](../faq.md)

如果您在使用错误监控插件时遇到任何问题，欢迎：

- 📝 查看 [常见问题](../faq.md)
- 🐛 提交 [Issue](https://github.com/Bottle-Monitor/Monitor/issues)
- 💬 参与 [讨论](https://github.com/Bottle-Monitor/Monitor/discussions)
