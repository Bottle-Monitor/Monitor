# 前端监控系统提示词工程

## 项目概述

这是一个基于 React + TypeScript + Ant Design 的前端监控系统 Demo，集成了自研的 `@bottle-monitor` SDK，实现了全链路的前端监控功能。

## 核心功能模块

### 1. 监控概览 (Dashboard)
- **路径**: `/dashboard`
- **功能**: 实时展示各类监控指标的概览
- **特性**:
  - 错误数量统计
  - 性能数据统计
  - 用户行为统计
  - 错误趋势图表
  - 性能指标饼图
  - 最近错误列表

### 2. 错误监控 (ErrorMonitoring)
- **路径**: `/errors`
- **功能**: 详细的错误监控和分析
- **特性**:
  - 错误类型分布图
  - 24小时错误趋势
  - 错误列表筛选 (类型、关键词、时间范围)
  - 错误详情查看
  - 支持的错误类型: JS错误、Promise错误、资源错误、XHR错误、Fetch错误

### 3. 性能监控 (PerformanceMonitoring)
- **路径**: `/performance`
- **功能**: Core Web Vitals 和关键性能指标监控
- **特性**:
  - FCP, LCP, FID, CLS, TTFB 指标展示
  - 性能趋势图表
  - 性能评分分布
  - 性能评级系统 (优秀/良好/需要改进)
  - 详细的性能数据表格

### 4. 用户行为分析 (UserBehavior)
- **路径**: `/user-behavior`
- **功能**: 用户交互行为监控和分析
- **特性**:
  - 用户行为类型分布
  - 用户活跃度趋势
  - 页面访问量统计
  - 实时行为时间线
  - 详细行为记录表格

### 5. 测试页面集合
#### 5.1 错误测试页面 (ErrorTest)
- **路径**: `/test-pages/error-test`
- **功能**: 测试各种类型的前端错误
- **测试项**:
  - JS运行时错误
  - Promise拒绝错误
  - 资源加载错误
  - 网络请求错误 (Fetch/XHR)
  - 语法错误
  - 类型错误
  - 引用错误

#### 5.2 性能测试页面 (PerformanceTest)
- **路径**: `/test-pages/performance-test`
- **功能**: 测试各种性能场景
- **测试项**:
  - 长任务阻塞主线程
  - 大量DOM操作
  - 布局偏移 (CLS)
  - 慢速网络请求
  - 内存分配测试
  - 强制重排重绘

#### 5.3 用户交互测试页面 (UserTest)
- **路径**: `/test-pages/user-test`
- **功能**: 测试各种用户交互行为
- **测试项**:
  - 按钮点击事件
  - 表单填写和提交
  - 弹窗和抽屉交互
  - 页面路由跳转
  - 表格操作
  - 外部链接点击

## SDK 集成配置

### 监控 SDK 初始化
```typescript
import { abnormalPlugin, bottleMonitorInit, userPlugin, vitalsPlugin } from '@bottle-monitor/core'

// 用户行为插件
const userPlugin_instance = userPlugin({
  options: {
    click: true,
    hash: true,
    history: true,
  },
  breadcrumbs: {},
})

// 性能监控插件
const vitalsPlugin_instance = vitalsPlugin({
  options: {
    FCP: true,
    LCP: true,
    FID: true,
    CLS: true,
    TTFB: true,
  },
  breadcrumbs: {},
})

// 异常监控插件
const abnormalPlugin_instance = abnormalPlugin({
  options: {
    codeError: true,
    unhandledrejection: true,
    resource: true,
    network: true,
  },
  breadcrumbs: {},
})

// 初始化监控
bottleMonitorInit({
  userId: 'demo-user-001',
  dsnURL: '/api/report',
  plugins: [userPlugin_instance, vitalsPlugin_instance, abnormalPlugin_instance],
  hook: {
    beforeTransport: (data) => {
      console.log('监控数据收集:', data)
      // 可以在这里处理监控数据
    },
  },
})
```

## 技术栈

### 前端技术栈
- **框架**: React 19 + TypeScript
- **路由**: React Router v7
- **UI组件库**: Ant Design 5
- **图表库**: ECharts + echarts-for-react
- **样式**: Tailwind CSS
- **构建工具**: Vite
- **日期处理**: dayjs

### 监控 SDK
- **核心包**: `@bottle-monitor/core`
- **插件包**: `@bottle-monitor/plugins`
- **类型定义**: `@bottle-monitor/types`
- **工具函数**: `@bottle-monitor/utils`

## 数据结构

### 监控数据格式
```typescript
interface MonitoringData {
  category: 'abnormal' | 'vitals' | 'user'
  type: string
  message?: string
  time: number
  url?: string
  target?: string
  value?: number
  name?: string
  [key: string]: any
}
```

### 错误数据结构
```typescript
interface ErrorData {
  category: 'abnormal'
  type: 'jsError' | 'promiseReject' | 'resourceError' | 'xhr' | 'fetch'
  message: string
  filename?: string
  lineno?: number
  colno?: number
  stack?: string
  time: number
}
```

### 性能数据结构
```typescript
interface PerformanceData {
  category: 'vitals'
  name: 'FCP' | 'LCP' | 'FID' | 'CLS' | 'TTFB'
  value: number
  time: number
}
```

### 用户行为数据结构
```typescript
interface UserBehaviorData {
  category: 'user'
  type: 'click' | 'history-route' | 'hash-route'
  target: string
  url: string
  time: number
}
```

## 页面布局结构

### 主布局 (Layout)
- **侧边栏**: 深色主题，包含logo和导航菜单
- **顶部栏**: 包含折叠按钮和页面标题
- **内容区**: 白色背景，圆角卡片样式
- **响应式**: 支持移动端适配

### 组件设计原则
1. **一致性**: 统一的颜色方案和交互模式
2. **可读性**: 清晰的数据展示和图表设计
3. **实时性**: 动态更新监控数据
4. **易用性**: 直观的操作界面和导航

## 开发指南

### 添加新的监控页面
1. 在 `src/views/` 目录下创建新组件
2. 更新路由配置 `src/route/index.tsx`
3. 更新侧边栏菜单 `src/layout/index.tsx`
4. 实现数据处理和图表展示逻辑

### 自定义图表配置
使用 ECharts 配置对象，支持：
- 折线图 (趋势分析)
- 饼图 (分布统计)
- 柱状图 (对比分析)
- 热力图 (用户行为)

### 样式定制
通过 `src/index.css` 全局样式和 Ant Design 主题定制：
- 修改色彩方案
- 调整组件间距
- 自定义滚动条样式
- 响应式断点设置

## 部署说明

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 环境配置
- **开发环境**: Vite 开发服务器 + 代理配置
- **生产环境**: 静态文件部署 + 后端API服务

### API代理配置
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

## 最佳实践

### 1. 监控数据处理
- 使用 `useOutletContext` 在页面间共享监控数据
- 实时更新数据状态，避免数据延迟
- 合理的数据过滤和分组逻辑

### 2. 性能优化
- 使用 React 懒加载路由组件
- 图表组件按需渲染
- 合理的内存管理和清理

### 3. 错误处理
- 全局错误边界
- 监控 SDK 错误处理
- 用户友好的错误提示

### 4. 用户体验
- 加载状态指示器
- 空数据状态处理
- 响应式设计适配

## 扩展功能建议

### 1. 数据持久化
- 集成 IndexedDB 本地存储
- 数据同步和缓存策略
- 离线数据收集

### 2. 高级分析
- 用户行为漏斗分析
- 性能基线对比
- 异常告警系统

### 3. 可视化增强
- 热力图展示
- 3D 数据可视化
- 交互式时间轴

### 4. 多维度监控
- 地域分布分析
- 设备和浏览器统计
- 网络环境监控

这个监控系统提供了完整的前端监控解决方案，可以作为监控 SDK 的演示平台和开发测试环境。
