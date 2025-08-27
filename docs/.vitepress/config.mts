import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Bottle-Monitor docs',
  description: 'Docs for Bottle-Monitor',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],
    sidebar: [
      {
        text: '目录',
        items: [
          { text: '快速开始', link: '/start' },
          { text: '架构和设计', link: '/design' },
          { text: '开发小记', link: '/tips' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
})
