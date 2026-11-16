import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { buildSitemapXml, buildLlmsTxt, buildLlmsFullTxt, STATIC_PAGES } from '../server/seo/crawlers.js'
import { renderCrawlerFile } from '../api/seo.js'

const ORIGIN = 'https://gamez.icraftds.id'

test('sitemap lists static pages, cheatsheets, paths and encyclopedia topics with lastmod', () => {
  const xml = buildSitemapXml(ORIGIN, {
    entries: [
      { type: 'learning_path', slug: 'dasar-python', updated_at: '2026-11-01T10:00:00+07:00' },
      { type: 'encyclopedia_topic', slug: 'variabel', updated_at: null },
      { type: 'learning_path', slug: '../evil', updated_at: null },
      { type: 'unknown', slug: 'x' },
    ],
  })

  assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>/)
  for (const page of STATIC_PAGES) assert.ok(xml.includes(`<loc>${ORIGIN}${page.path}</loc>`), page.path)
  assert.ok(xml.includes(`<loc>${ORIGIN}/cheatsheet/git</loc>`))
  assert.ok(xml.includes(`<loc>${ORIGIN}/learning/dasar-python</loc>\n    <lastmod>2026-11-01</lastmod>`))
  assert.ok(xml.includes(`<loc>${ORIGIN}/encyclopedia/variabel</loc>`))
  assert.ok(!xml.includes('evil'), 'unsafe slugs are dropped')
  assert.ok(!xml.includes('/dashboard'), 'private pages are never listed')
  assert.equal((xml.match(/<url>/g) || []).length, new Set(xml.match(/<loc>[^<]+<\/loc>/g)).size, 'no duplicate URLs')
})

test('llms.txt is a Markdown index following llmstxt.org structure', () => {
  const txt = buildLlmsTxt(ORIGIN, {
    paths: [{ slug: 'dasar-python', title: 'Dasar Python', description: 'Sintaks\n dasar', is_premium: true }],
    sections: [{ topics: [{ slug: 'variabel', title: 'Variabel & Tipe Data', subtitle: 'Memori' }] }],
  })

  assert.match(txt, /^# iC Game-Z\n\n> /)
  assert.ok(txt.includes(`- [Dasar Python](${ORIGIN}/learning/dasar-python): Sintaks dasar (PRO)`))
  assert.ok(txt.includes(`- [Variabel & Tipe Data](${ORIGIN}/encyclopedia/variabel): Memori`))
  assert.ok(txt.includes(`${ORIGIN}/llms-full.txt`))
  assert.ok(txt.includes('## Cheatsheet'))
})

test('llms-full.txt contains each topic body with its canonical URL', () => {
  const txt = buildLlmsFullTxt(ORIGIN, {
    topics: [
      { slug: 'variabel', title: 'Variabel', category: 'Beginner', content: 'Variabel adalah wadah.\n\n### Tipe' },
      { slug: 'kosong', title: 'Kosong', content: '' },
    ],
  })
  assert.ok(txt.includes(`## Variabel\n\nURL: ${ORIGIN}/encyclopedia/variabel`))
  assert.ok(txt.includes('Variabel adalah wadah.\n\n### Tipe'))
  assert.ok(!txt.includes('## Kosong'), 'topics without content are skipped')
})

test('renderCrawlerFile: CDN caching on success, safe fallbacks on failure', async () => {
  const ok = await renderCrawlerFile('llms', { origin: ORIGIN, load: async () => ({ paths: [], sections: [] }) })
  assert.equal(ok.status, 200)
  assert.match(ok.type, /text\/markdown/)
  assert.match(ok.cache, /s-maxage=3600/)

  const failing = async () => { throw new Error('backend down') }
  const sitemap = await renderCrawlerFile('sitemap', { origin: ORIGIN, load: failing })
  assert.equal(sitemap.status, 200, 'sitemap degrades to static pages instead of erroring')
  assert.ok(sitemap.body.includes(`<loc>${ORIGIN}/</loc>`))
  assert.match(sitemap.cache, /s-maxage=300/)

  const llms = await renderCrawlerFile('llms', { origin: ORIGIN, load: failing })
  assert.equal(llms.status, 503)

  const unknown = await renderCrawlerFile('../../etc/passwd', { origin: ORIGIN })
  assert.equal(unknown.status, 404)
})

test('vercel.json routes crawler files before the SPA rewrites and noindexes raw cheatsheets', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'))
  const sources = config.rewrites.map((r) => r.source)
  const firstSpa = config.rewrites.findIndex((r) => r.destination === '/spa.html')
  assert.ok(firstSpa > -1)
  for (const file of ['/sitemap.xml', '/llms.txt', '/llms-full.txt']) {
    assert.ok(sources.indexOf(file) > -1 && sources.indexOf(file) < firstSpa, file)
  }
  const header = config.headers.find((h) => h.source.startsWith('/cheatsheet/'))
  assert.deepEqual(header.headers, [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }])
})

test('robots.txt allows AI crawlers, blocks private areas and points to the sitemap', () => {
  const robots = readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8')
  for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) assert.ok(robots.includes(`User-agent: ${bot}`), bot)
  for (const path of ['/dashboard', '/checkout', '/api/']) assert.ok(robots.includes(`Disallow: ${path}`), path)
  assert.match(robots, /^Sitemap: https:\/\/gamez\.icraftds\.id\/sitemap\.xml$/m)
})
