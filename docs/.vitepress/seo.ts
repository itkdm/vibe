import type { HeadConfig, PageData, SiteData } from 'vitepress'

type SeoOptions = {
  pageData: PageData
  siteData: SiteData
  title: string
  description: string
  siteUrl?: string
}

function normalizeOrigin(siteUrl?: string) {
  if (!siteUrl) return undefined
  try { return new URL(siteUrl).origin } catch { return undefined }
}

function pagePath(relativePath: string) {
  const normalized = relativePath.replace(/\\/g, '/')
  if (normalized === 'index.md') return '/'
  if (normalized.endsWith('/index.md')) return `/${normalized.slice(0, -'index.md'.length)}`
  return `/${normalized.replace(/\.md$/, '')}`
}

function absoluteUrl(origin: string, base: string, path: string) {
  if (/^https?:\/\//i.test(path)) return new URL(path).toString()
  const basePath = `/${base.split('/').filter(Boolean).join('/')}`.replace(/^\/$/, '')
  const pagePath = path.startsWith('/') ? path : `/${path}`
  return new URL(`${basePath}${pagePath}` || '/', origin).toString()
}

function pageKind(relativePath: string) {
  if (relativePath === 'index.md') return 'website'
  if (relativePath.endsWith('/index.md')) return 'section'
  return 'article'
}

export function createSeoHead({ pageData, siteData, title, description, siteUrl }: SeoOptions): HeadConfig[] {
  const origin = normalizeOrigin(siteUrl)
  const frontmatter = pageData.frontmatter
  const kind = pageKind(pageData.relativePath)
  const head: HeadConfig[] = [
    ['meta', { property: 'og:type', content: kind === 'article' ? 'article' : 'website' }],
    ['meta', { property: 'og:site_name', content: siteData.title }],
    ['meta', { property: 'og:locale', content: siteData.lang.replace('-', '_') }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description || siteData.description }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description || siteData.description }]
  ]

  if (frontmatter.noindex === true) head.push(['meta', { name: 'robots', content: 'noindex, follow' }])
  if (!origin || pageData.isNotFound === true) return head

  const canonicalUrl = absoluteUrl(origin, siteData.base, pagePath(pageData.relativePath))
  const imagePath = typeof frontmatter.ogImage === 'string' ? frontmatter.ogImage : '/social/default-share.jpg'
  const imageUrl = absoluteUrl(origin, siteData.base, imagePath)
  const imageAlt = typeof frontmatter.ogImageAlt === 'string' ? frontmatter.ogImageAlt : title

  head.push(
    ['link', { rel: 'canonical', href: canonicalUrl }],
    ['meta', { property: 'og:url', content: canonicalUrl }],
    ['meta', { property: 'og:image', content: imageUrl }],
    ['meta', { property: 'og:image:alt', content: imageAlt }],
    ['meta', { name: 'twitter:image', content: imageUrl }],
    ['meta', { name: 'twitter:image:alt', content: imageAlt }]
  )

  if (kind === 'website') {
    head.push(['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteData.title,
      url: canonicalUrl,
      description: description || siteData.description,
      image: imageUrl,
      inLanguage: siteData.lang
    })])
  } else {
    head.push(['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': kind === 'section' ? 'CollectionPage' : 'Article',
      name: title,
      headline: title,
      description: description || siteData.description,
      url: canonicalUrl,
      image: imageUrl,
      inLanguage: siteData.lang,
      isPartOf: { '@type': 'WebSite', name: siteData.title, url: origin }
    })])
  }

  return head
}
