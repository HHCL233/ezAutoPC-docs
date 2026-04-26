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
  base: "/ezAutoPC-docs",
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
          { text: 'WebUI', link: '/use/webui' },
          { text: '工具调用', link: '/use/tool-calls' },
          { text: 'Skills', link: '/use/skills' },
          { text: 'MCP', link: '/use/mcp' }
        ]
      },
      {
        text: '开发',
        items: [
          { text: '外部调用', link: '/dev/custom-dashboard' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/HHCL233/ezAutoPC-docs' }
    ],

    search: {
      provider: 'local'
    }
  }
})
