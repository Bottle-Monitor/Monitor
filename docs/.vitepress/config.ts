import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Bottle Monitor',
  description: '功能强大、类型安全的前端监控SDK，基于插件化架构设计',
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3c877a' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Bottle Monitor',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: '插件', link: '/plugins/' },
      { text: '示例', link: '/examples/' },
      { text: 'GitHub', link: 'https://github.com/bottle414/bottle-monitor' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '快速开始',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '安装', link: '/guide/installation' },
            { text: '快速上手', link: '/guide/quickstart' },
            { text: '配置选项', link: '/guide/configuration' },
          ],
        },
        {
          text: '核心概念',
          items: [
            { text: '插件系统', link: '/guide/plugins' },
            { text: '事件总线', link: '/guide/event-bus' },
            { text: '数据上报', link: '/guide/transport' },
          ],
        },
      ],
      '/api/': [
        {
          text: '核心 API',
          items: [
            { text: '初始化', link: '/api/init' },
            { text: '监控实例', link: '/api/instance' },
            { text: '事件追踪', link: '/api/tracking' },
          ],
        },
      ],
      '/plugins/': [
        {
          text: '内置插件',
          items: [
            { text: '错误监控', link: '/plugins/error' },
            { text: '性能监控', link: '/plugins/performance' },
            { text: '用户行为', link: '/plugins/user' },
          ],
        },
        {
          text: '自定义插件',
          items: [
            { text: '插件开发', link: '/plugins/custom' },
            { text: 'Hook 系统', link: '/plugins/hooks' },
          ],
        },
      ],
      '/examples/': [
        {
          text: '集成示例',
          items: [
            { text: 'React 集成', link: '/examples/react' },
            { text: 'Vue 集成', link: '/examples/vue' },
            { text: '原生 JS', link: '/examples/vanilla' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/bottle414/bottle-monitor' },
    ],
    footer: {
      message: 'Released under the ISC License.',
      copyright: 'Copyright © 2024-present Bottle414',
    },
    search: {
      provider: 'local',
    },
  },
  markdown: {
    theme: 'material-theme-palenight',
    lineNumbers: true,
  },
})
