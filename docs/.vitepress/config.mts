import { defineConfig } from 'vitepress'
import { existsSync, readFileSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import { createSeoHead } from './seo'
import { componentSidebar } from './component-categories.mjs'

const siteUrl = process.env.SITE_URL || 'https://vibe.itkdm.com'
const siteOrigin = new URL(siteUrl).origin
const docsRoot = resolve(process.cwd(), 'docs')

function isNoindexPage(url: string) {
  const route = decodeURIComponent(new URL(url, siteOrigin).pathname).replace(/^\/+|\/+$/g, '')
  const sourceFiles = route
    ? [resolve(docsRoot, `${route}.md`), resolve(docsRoot, route, 'index.md')]
    : [resolve(docsRoot, 'index.md')]

  for (const sourceFile of sourceFiles) {
    if (!sourceFile.startsWith(`${docsRoot}${sep}`) || !existsSync(sourceFile)) continue
    const source = readFileSync(sourceFile, 'utf8')
    const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
    if (frontmatter && /^noindex:\s*true\s*$/m.test(frontmatter[1])) return true
  }

  return false
}

export default defineConfig({
  lang: 'zh-CN',
  title: '布吉岛 Vibe 教程',
  description: '布吉岛 Vibe 教程帮助零基础读者看懂界面组件与交互效果，认识专业术语，并把需求表达成 Vibe Coding 提示词。',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: siteOrigin,
    transformItems: (items) => items.filter((item) => !isNoindexPage(item.url))
  },
  head: [
    ['meta', { name: 'theme-color', content: '#f5f9ff' }],
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
      { text: '组件词典', link: '/components/' }
    ],
    sidebar: {
      '/components/': componentSidebar,
      '/overview/': [{ text: '开始了解', items: [{ text: '概览', link: '/overview/' }] }]
    },
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新于' },
    footer: {
      message: '看懂界面效果，学会专业表达。',
      copyright: '© 2026 布吉岛 Vibe 教程'
    }
  }
})
