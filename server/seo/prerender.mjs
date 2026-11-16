// Build-time prerendering of public pages (run after `vite build` + the SSR build).
// Writes dist/<route>/index.html with real content and per-page SEO tags, so search
// engines and link previews get HTML instead of an empty <div id="app">.
// Usage: node server/seo/prerender.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { cheatsheets } from '../../src/data/cheatsheets.js'
import { SITE, STATIC_PAGES } from './crawlers.js'
import { buildHead, injectPage } from './pageHead.js'

// The app reads Web Storage while loading. Prerendering renders as a first-time,
// logged-out visitor, which is exactly an empty storage. (window/document are
// deliberately NOT faked, so browser-only code keeps detecting it is not in a browser.)
function memoryStorage() {
  const items = new Map()
  return {
    get length() { return items.size },
    key: (index) => [...items.keys()][index] ?? null,
    getItem: (key) => (items.has(String(key)) ? items.get(String(key)) : null),
    setItem: (key, value) => { items.set(String(key), String(value)) },
    removeItem: (key) => { items.delete(String(key)) },
    clear: () => { items.clear() },
  }
}
for (const name of ['localStorage', 'sessionStorage']) {
  Object.defineProperty(globalThis, name, { value: memoryStorage(), configurable: true, writable: true })
}
// Read by the app (e.g. useUserAccount) to render content instead of the session loader.
globalThis.__PRERENDER__ = true

const ROOT = resolve(import.meta.dirname, '../..')
const DIST = join(ROOT, 'dist')
const ORIGIN = (process.env.APP_ORIGIN || SITE.origin).replace(/\/$/, '')
const API = (process.env.VITE_BASE_URL || `${SITE.backendOrigin}/api`).replace(/\/$/, '')
const isSlug = (value) => typeof value === 'string' && /^[a-z0-9][a-z0-9-]*$/i.test(value)

async function getJson(path) {
  const response = await fetch(`${API}${path}`, {
    headers: { Accept: 'application/json', 'Accept-Language': 'id' },
    signal: AbortSignal.timeout(30000),
  })
  if (!response.ok) throw new Error(`GET ${path} -> HTTP ${response.status}`)
  return (await response.json()).data
}

async function settle(label, promise, fallback) {
  try {
    return await promise
  } catch (error) {
    console.warn(`[prerender] ${label} unavailable: ${error.message}`)
    return fallback
  }
}

async function mapLimit(items, limit, fn) {
  const results = []
  for (let i = 0; i < items.length; i += limit) {
    results.push(...(await Promise.all(items.slice(i, i + limit).map(fn))))
  }
  return results
}

async function loadContent() {
  const [paths, plans, sections] = await Promise.all([
    settle('learning paths', getJson('/paths'), []),
    settle('plans', getJson('/plans'), []),
    settle('encyclopedia', getJson('/encyclopedia'), []),
  ])
  const pathList = (paths || []).filter((p) => isSlug(p.slug))
  const topicSlugs = (sections || []).flatMap((s) => (s.topics || []).map((t) => t.slug)).filter(isSlug)

  const pathDetails = Object.fromEntries((await mapLimit(pathList, 4, async (p) =>
    [p.slug, await settle(`path ${p.slug}`, getJson(`/paths/${p.slug}`), null)])).filter(([, d]) => d))
  const topics = Object.fromEntries((await mapLimit(topicSlugs, 6, async (slug) =>
    [slug, await settle(`topic ${slug}`, getJson(`/encyclopedia/${slug}`), null)])).filter(([, t]) => t))

  console.log(`[prerender] content: ${pathList.length} paths (${Object.keys(pathDetails).length} detailed), ${Object.keys(topics).length} articles, ${(plans || []).length} plans`)
  return { paths: pathList, plans: plans || [], sections: sections || [], pathDetails, topics }
}

function pageList(content) {
  return [
    ...STATIC_PAGES.map((p) => ({ url: p.path, kind: 'static', page: p })),
    ...content.paths.map((p) => ({ url: `/learning/${p.slug}`, kind: 'path', path: content.pathDetails[p.slug] || p })),
    ...Object.values(content.topics).map((t) => ({ url: `/encyclopedia/${t.slug}`, kind: 'topic', topic: t })),
    ...cheatsheets.filter((c) => isSlug(c.slug)).map((c) => ({ url: `/cheatsheet/${c.slug}`, kind: 'cheatsheet', cheatsheet: c })),
  ]
}

/** Vite SSR manifest -> stylesheet/modulepreload tags for the modules a page actually used. */
function preloadLinks(modules, manifest) {
  const seen = new Set()
  const tags = []
  for (const id of modules) {
    for (const file of manifest[id] || []) {
      if (seen.has(file)) continue
      seen.add(file)
      if (file.endsWith('.css')) tags.push(`<link rel="stylesheet" href="${file}">`)
      else if (file.endsWith('.js')) tags.push(`<link rel="modulepreload" crossorigin href="${file}">`)
    }
  }
  return tags.join('\n    ')
}

function outputFile(url) {
  return url === '/' ? join(DIST, 'index.html') : join(DIST, url.replace(/^\//, ''), 'index.html')
}

async function main() {
  // `vite build` empties dist/, so an existing spa.html is the pristine template from an
  // earlier prerender of this same build (index.html has been overwritten by then).
  const template = await readFile(join(DIST, 'spa.html'), 'utf8').catch(() => readFile(join(DIST, 'index.html'), 'utf8'))
  // Untouched SPA shell for every non-prerendered route (vercel.json catch-all).
  await writeFile(join(DIST, 'spa.html'), template)

  const manifest = JSON.parse(await readFile(join(DIST, '.vite', 'ssr-manifest.json'), 'utf8'))
  const { render } = await import(pathToFileURL(join(ROOT, 'dist-ssr', 'entry-server.js')).href)
  const content = await loadContent()

  const pages = pageList(content)
  const failures = []
  let written = 0

  for (const page of pages) {
    globalThis.localStorage.clear()
    globalThis.sessionStorage.clear()
    try {
      const seed = {
        paths: page.kind === 'path'
          ? content.paths.map((p) => (p.slug === page.path.slug ? page.path : p))
          : content.paths,
        plans: content.plans,
        encyclopedia: page.url === '/encyclopedia' || page.kind === 'topic' ? content.sections : null,
        topic: page.kind === 'topic' ? page.topic : null,
      }
      const { html, modules, matched } = await render(page.url, seed)
      if (!matched) throw new Error('route did not match')
      const head = buildHead(page, { origin: ORIGIN })
      const file = outputFile(page.url)
      await mkdir(dirname(file), { recursive: true })
      await writeFile(file, injectPage(template, { head, appHtml: html, preload: preloadLinks(modules, manifest) }))
      written++
    } catch (error) {
      failures.push(`${page.url}: ${error.message}`)
    }
  }

  // Custom 404 page: Vercel serves dist/404.html with HTTP 404 for unknown URLs.
  try {
    globalThis.localStorage.clear()
    globalThis.sessionStorage.clear()
    const { html, modules, name } = await render('/404', { paths: content.paths, plans: content.plans })
    if (name !== 'not-found') throw new Error(`expected the not-found route, got ${String(name)}`)
    const head = buildHead({ url: '/404', kind: 'notfound' }, { origin: ORIGIN })
    await writeFile(join(DIST, '404.html'), injectPage(template, { head, appHtml: html, preload: preloadLinks(modules, manifest) }))
  } catch (error) {
    failures.push(`404.html: ${error.message}`)
  }

  console.log(`[prerender] ${written}/${pages.length} pages written + 404.html (API: ${API})`)
  if (failures.length) {
    console.error(`[prerender] ${failures.length} page(s) failed:\n  ${failures.join('\n  ')}`)
    process.exitCode = 1
  }
}

// The rendered app starts timers (polling, clocks) that would keep Node alive forever.
main().then(
  () => process.exit(process.exitCode ?? 0),
  (error) => { console.error('[prerender] failed:', error); process.exit(1) },
)
