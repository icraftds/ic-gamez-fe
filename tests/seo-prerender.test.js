import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { buildHead, injectPage, pageMeta } from '../server/seo/pageHead.js'

const ORIGIN = 'https://gamez.icraftds.id'
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
const TEMPLATE = read('../index.html')

test('learning path head has unique title, canonical, OG and Course schema', () => {
  const head = buildHead({
    url: '/learning/dasar-python',
    kind: 'path',
    path: { slug: 'dasar-python', title: 'Dasar Python', description: 'Sintaks & logika.', is_premium: true, chapters: [{ title: 'Bab 1', lessons: [{}, {}] }] },
  }, { origin: ORIGIN })

  assert.match(head, /<title>Belajar Dasar Python — Learning Path \| iC Game-Z<\/title>/)
  assert.match(head, /<link rel="canonical" href="https:\/\/gamez\.icraftds\.id\/learning\/dasar-python" \/>/)
  assert.match(head, /<meta property="og:url" content="https:\/\/gamez\.icraftds\.id\/learning\/dasar-python" \/>/)
  assert.match(head, /<meta property="og:image" content="https:\/\/gamez\.icraftds\.id\/og-image\.png" \/>/)
  assert.match(head, /Sintaks &amp; logika\. 2 materi/)
  const course = pageMeta({ url: '/learning/dasar-python', kind: 'path', path: { slug: 'dasar-python', title: 'Dasar Python', is_premium: true } }, ORIGIN).schema[0]
  assert.equal(course['@type'], 'Course')
  assert.equal(course.isAccessibleForFree, false)
})

test('article content cannot break out of attributes or the JSON-LD script', () => {
  const topic = (title) => buildHead({ url: '/encyclopedia/xss', kind: 'topic', topic: { slug: 'xss', title, content: 'Body $& $1 <b>bold</b>' } }, { origin: ORIGIN })

  const injected = topic('Judul </script><script>alert(1)</script>')
  assert.ok(!injected.includes('<script>alert(1)'), 'injected script tag must not appear')
  assert.equal((injected.match(/<\/script>/g) || []).length, (injected.match(/<script /g) || []).length, 'only our own script tags are closed')

  const operators = topic('Operator a < b "quoted"')
  assert.ok(operators.includes('a \\u003c b'), 'JSON-LD escapes < so it can never close the script tag')
  assert.ok(operators.includes('a &lt; b &quot;quoted&quot;'), 'attribute values are HTML-escaped')
})

test('injectPage replaces default tags once and keeps $ sequences literal', () => {
  const html = injectPage(TEMPLATE, {
    head: '<title>Halaman $& Uji</title>\n<meta name="description" content="x" />',
    appHtml: '<h1>Harga $1 dan $&</h1>',
    preload: '<link rel="stylesheet" href="/assets/a.css">',
  })
  assert.equal((html.match(/<title>/g) || []).length, 1)
  assert.equal((html.match(/<meta name="description"/g) || []).length, 1)
  assert.equal((html.match(/<meta property="og:title"/g) || []).length, 0, 'default og:title removed (page head supplies its own)')
  assert.ok(html.includes('<title>Halaman $& Uji</title>'))
  assert.ok(html.includes('<div id="app"><h1>Harga $1 dan $&</h1></div>'))
  assert.ok(html.indexOf('/assets/a.css') < html.indexOf('</head>'))
  assert.throws(() => injectPage('<html></html>', { head: '', appHtml: '' }), /missing <div id="app">/)
})

test('404 page is noindex and has no canonical', () => {
  const head = buildHead({ url: '/404', kind: 'notfound' }, { origin: ORIGIN })
  assert.match(head, /<meta name="robots" content="noindex" \/>/)
  assert.ok(!head.includes('rel="canonical"'))
})

test('every router route is reachable on Vercel (prerendered, SPA rewrite, or redirect)', () => {
  const config = JSON.parse(read('../vercel.json'))
  const spaSections = new Set(config.rewrites
    .filter((r) => r.destination === '/spa.html')
    .flatMap((r) => (r.source.match(/^\/\(([^)]+)\)/)?.[1] || '').split('|')))
  const redirected = new Set(config.redirects.map((r) => r.source.split('/')[1]))

  const router = read('../src/router.js')
  const paths = [...router.matchAll(/(?:path|alias): '([^']+)'/g)].map((m) => m[1])
  assert.ok(paths.length > 20, 'router paths parsed')

  for (const path of paths) {
    if (path === '/' || path.startsWith('/:pathMatch')) continue
    const section = path.split('/')[1]
    assert.ok(spaSections.has(section) || redirected.has(section), `route ${path} has no Vercel rewrite or redirect`)
  }
})

test('index.html loads fonts and icons without render-blocking stylesheets', () => {
  const blocking = TEMPLATE
    .replace(/<noscript>[\s\S]*?<\/noscript>/g, '')
    .match(/<link\b[^>]*rel="stylesheet"[^>]*>/g) || []
  assert.deepEqual(blocking, [])
  assert.match(TEMPLATE, /<html lang="id">/)
})
