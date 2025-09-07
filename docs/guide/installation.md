# 安装指南
## 📦 安装 SDK
### 使用包管理器安装
### npm
```bash
npm install bottle-monitor
```
### yarn
```bash
yarn add bottle-monitor
```
### pnpm
```bash
pnpm add bottle-monitor
```

### CDN 引入（可选）
```html
<script src="https://cdn.jsdelivr.net/npm/bottle-monitor@latest/dist/index.js"></script>
```

## 🚀 引入 SDK
### 模块引入
```typescript
import BottleMonitor from 'bottle-monitor'
```

## 插件引入
### 错误监控插件
```typescript
import { ErrorPlugin } from 'bottle-monitor'
```

### 性能监控插件
```typescript
import { PerformancePlugin } from 'bottle-monitor'
```

### 用户行为插件
```typescript
import { UserPlugin } from 'bottle-monitor'
```

## 🔧 启用 Service Worker 脚本（可选）
Service Worker 可以提供离线缓存、网络重试等高级功能，提升数据上报的可靠性。该步骤不影响数据上报功能。

### 方法一：使用内置脚本安装
安装 SDK 后，可以使用内置的脚本自动复制 Service Worker 文件：
```bash
# 复制 sw.js 到项目的 public 目录
npx bottle-copy-sw

# 或者指定目标目录
npx bottle-copy-sw --dir=static
```

### 方法二：手动复制
从 node_modules/@bottle-monitor/core/scripts/sw.js 复制文件到你的静态资源目录（如 public/sw.js ）

## 🎯 安装完成
安装完成后，打开浏览器开发者工具，你应该能看到：

- Console 中的初始化成功日志
- Network 面板中的数据上报请求
- Application 面板中注册的 Service Worker（如果启用）

## 🎯 下一步
安装完成后，你可以：

1. 查看 [配置指南](./config.md) 了解详细配置选项
2. 查看 [插件文档](../plugins/index.md) 了解各插件的具体功能
3. 查看 [API 文档](./api.md) 了解可用的 API 方法
