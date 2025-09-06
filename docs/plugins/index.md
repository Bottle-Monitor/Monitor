# 📖 插件
Bottle-Monitor 是一个插件化设计的 SDK，核心包包含以下插件：
- [错误监控插件](./error.md)
- [性能监控插件](./performance.md)
- [用户行为插件](./user.md)

此外，你也可以[自定义插件](./custom.md)。

# 🔧 插件系统设计
调用 userPlugin 等插件初始化方法时，初始化选项会被赋予默认值并进行格式化。

调用 BottleMonitor 方法将插件注册后，SDK 会自动初始化插件及其相关的上报队列。

此后插件收集的数据会通过事件总线上报至 Transport 层。Transport 负责接收数据，将数据格式化并存放到相应的上报队列中。在达到上报要求后（如队列容量满或达到间隔时间），Transport 会优先采用 sendBeacon 将数据发送出去（降级策略是 fetch），然后清空相关的上报队列。

# 插件开发规范
建议采用驼峰命名法，例如 errorPlugin、performancePlugin、userPlugin 等。
