import { defineConfig } from 'vitepress'
import { createSeoHead } from './seo'

const siteUrl = process.env.SITE_URL || 'https://vibe.itkdm.com'
const siteOrigin = new URL(siteUrl).origin

export default defineConfig({
  lang: 'zh-CN',
  title: '布吉岛 Vibe 教程',
  description: '看见下拉框、抽屉等界面效果，认识专业术语，再学会把需求说给 Vibe Coding 工具。',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: siteOrigin },
  head: [
    ['meta', { name: 'theme-color', content: '#f5f9ff' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '128x128', href: '/favicon.png' }],
    ['link', { rel: 'describedby', href: '/llms.txt' }]
  ],
  transformHead({ pageData, siteData, title, description }) {
    return createSeoHead({ pageData, siteData, title, description, siteUrl })
  },
  themeConfig: {
    logo: { src: '/favicon.svg', alt: '布吉岛 Vibe 教程标志' },
    siteTitle: '布吉岛 Vibe 教程',
    nav: [
      { text: '概览', link: '/overview/' }
    ],
    sidebar: {
      '/overview/': [{ text: '开始了解', items: [{ text: '概览', link: '/overview/' }] }]
    },
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新于' },
    footer: {
      message: '先看见效果，再把想法说清楚。',
      copyright: '© 2026 布吉岛 Vibe 教程'
    }
  }
})
