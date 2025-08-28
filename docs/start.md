# 快速开始

## 安装

- 使用 pnpm（推荐）

```bash
pnpm add @bottle-monitor/core
```

- 使用 npm

```bash
npm install @bottle-monitor/core
```

- 使用 yarn

```bash
yarn add @bottle-monitor/core
```

## 初始化

在你的应用入口处调用初始化函数 `bottleMonitorInit`。

```ts
import { bottleMonitorInit } from '@bottle-monitor/core'

bottleMonitorInit({
  userId: 'your-user-id',
  dsnURL: '/api/report', // 你的上报端点（支持相对/绝对地址）
  breadcrumbs: [// 配置了相应的 breadcrumbType，才会采集数据；capacity 为对应队列的容量阈值，达到后立刻触发上报。
    { breadcrumbType: 'user', capacity: 2 },
    { breadcrumbType: 'vitals', capacity: 1 },
    { breadcrumbType: 'abnormal', capacity: 1 },
    { breadcrumbType: 'custom', capacity: 1 }
  ],
  // silent: { webVitals: false, resource: false, ... } // 可用来按需屏蔽采集项
  // hooks: { beforePushBreadcrumb: (data) => data, beforeTransport: (queue) => queue }
})
```

## 配置项概览

- dsnURL: string
  - 数据上报地址。支持相对路径（便于本地代理）或绝对地址（直连服务端）。
- userId: string
  - 当前用户标识（若不传，部分插件可能使用 nanoid 生成临时 ID）。
- breadcrumbs: BreadcrumbOptions
  - 多队列上报配置。每个队列包含：
  - breadcrumbType: 'user' | 'vitals' | 'abnormal' | 'custom'
  - capacity: number 队列容量阈值（达到后立刻触发上报）
  - uploadInterval?: number 定时上报间隔（双触发：容量或时间）
  - perBeforePushBreadcrumb?: (data) => any 队列级数据入栈前钩子
  - perBeforeTransport?: (queue) => any 队列级上报前钩子
- silent?: SilentOptions
  - 按需屏蔽采集项（如 webVitals、resource、error 等）。
- hooks?: Hook
  - beforePushBreadcrumb(data): 全局入栈前钩子
  - beforeTransport(queue): 全局上报前钩子
- filterXhrUrlRegExp?: RegExp
  - 过滤不需要采集的请求地址。
- framework?: 'normal' | 'vue' | 'react'
  - 声明宿主框架（当前版本主要用于信息描述）。

## Service Worker（可选）

当前版本 SDK 有可选的 Service Worker 功能，用于离线缓存与自动重试等容错能力（注册失败不会影响正常上报，SDK 仍然会通过 sendBeacon/XHR 正常上报，只是离线重试能力受限。）。
使用指令 `npx bottle-copy-sw` 可以将 `sw.js` 拷贝到项目 `public/` 目录下。
