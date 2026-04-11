import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith('mdui-')
      }
    }
  },
  base: "/ezAutoPC",
  title: "ezAutoPC 文档",
  description: "ezAutoPC 文档",
  head: [['link', { rel: 'icon', href: '/logo.png' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/getting-started' }
    ],

    sidebar: [
      {
        text: '入门',
        items: [
          { text: '快速入门', link: '/getting-started' }
        ]
      },
      {
        text: '使用',
        items: [
          { text: '工具调用', link: '/tool-calls' },
          { text: 'Skills', link: '/skills' },
          { text: 'MCP', link: '/mcp' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    search: {
      provider: 'local'
    }
  }
})
