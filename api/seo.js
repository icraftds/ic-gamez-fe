// Vercel function serving /sitemap.xml, /llms.txt and /llms-full.txt (see vercel.json rewrites).
import { FILES, SITE, loadContent } from '../server/seo/crawlers.js'

export async function renderCrawlerFile(file, { origin, backendOrigin, load = loadContent } = {}) {
  const spec = Object.hasOwn(FILES, file) ? FILES[file] : null
  if (!spec) return { status: 404, type: 'text/plain; charset=utf-8', body: 'Not found', cache: 'no-store' }

  try {
    const content = await load(file, backendOrigin)
    return {
      status: 200,
      type: spec.type,
      body: spec.build(origin, content),
      // CDN keeps it for an hour and serves stale for a day while refreshing in the background.
      cache: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    }
  } catch (error) {
    console.error('[seo] failed to build', file, error?.message)
    if (file === 'sitemap') {
      // Still return the static pages so crawlers never receive an empty/broken sitemap.
      return { status: 200, type: spec.type, body: spec.build(origin, {}), cache: 'public, max-age=0, s-maxage=300' }
    }
    return { status: 503, type: 'text/plain; charset=utf-8', body: 'Temporarily unavailable', cache: 'no-store' }
  }
}

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost')
  const result = await renderCrawlerFile(url.searchParams.get('file') || '', {
    origin: (process.env.APP_ORIGIN || SITE.origin).replace(/\/$/, ''),
    backendOrigin: process.env.PRODUCT_BACKEND_URL || SITE.backendOrigin,
  })

  res.statusCode = result.status
  res.setHeader('Content-Type', result.type)
  res.setHeader('Cache-Control', result.cache)
  res.setHeader('X-Content-Type-Options', 'nosniff')
  if (result.status !== 200) res.setHeader('Retry-After', '300')
  res.end(result.body)
}
