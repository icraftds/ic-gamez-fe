// Builders for crawler-facing files: sitemap.xml, llms.txt and llms-full.txt.
// Pure functions (easy to test) + a small fetch layer against the public backend API.
import { cheatsheets } from '../../src/data/cheatsheets.js'

export const SITE = {
  name: 'iC Game-Z',
  origin: 'https://gamez.icraftds.id',
  backendOrigin: 'https://icgamez.unikom.my.id',
  summary:
    'iC Game-Z adalah platform belajar pemrograman berbasis gamifikasi (Bahasa Indonesia) dari iCraftDS: ' +
    'learning path terstruktur, editor kode langsung di browser, kuis, tantangan coding, leaderboard, ' +
    'ensiklopedia konsep pemrograman, dan cheatsheet.',
}

// Public, indexable pages whose content does not come from the API.
export const STATIC_PAGES = [
  { path: '/', title: 'Beranda', changefreq: 'weekly', priority: 1.0 },
  { path: '/learning', title: 'Learning Path', changefreq: 'weekly', priority: 0.9 },
  { path: '/encyclopedia', title: 'Ensiklopedia Pemrograman', changefreq: 'weekly', priority: 0.8 },
  { path: '/cheatsheet', title: 'Cheatsheet', changefreq: 'monthly', priority: 0.8 },
  { path: '/pricing', title: 'Harga & Paket', changefreq: 'monthly', priority: 0.7 },
  { path: '/leaderboard', title: 'Leaderboard', changefreq: 'daily', priority: 0.5 },
  { path: '/faq', title: 'FAQ', changefreq: 'monthly', priority: 0.6 },
  { path: '/panduan', title: 'Panduan', changefreq: 'monthly', priority: 0.6 },
  { path: '/developer', title: 'Developer', changefreq: 'yearly', priority: 0.4 },
  { path: '/tentang-kami', title: 'Tentang Kami', changefreq: 'yearly', priority: 0.4 },
  { path: '/hubungi-kami', title: 'Hubungi Kami', changefreq: 'yearly', priority: 0.3 },
  { path: '/kebijakan-privasi', title: 'Kebijakan Privasi', changefreq: 'yearly', priority: 0.2 },
  { path: '/syarat-ketentuan', title: 'Syarat & Ketentuan', changefreq: 'yearly', priority: 0.2 },
]

const xmlEscape = (value) =>
  String(value).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c])

const mdText = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()

const isSlug = (value) => typeof value === 'string' && /^[a-z0-9][a-z0-9-]*$/i.test(value)

const day = (iso) => (iso && !Number.isNaN(Date.parse(iso)) ? new Date(iso).toISOString().slice(0, 10) : null)

/**
 * @param {string} origin
 * @param {{ entries: Array<{type: string, slug: string, updated_at?: string|null}> }} content
 */
export function buildSitemapXml(origin, { entries = [] } = {}) {
  const urls = [
    ...STATIC_PAGES.map((p) => ({ loc: origin + p.path, changefreq: p.changefreq, priority: p.priority })),
    ...cheatsheets.filter((c) => isSlug(c.slug)).map((c) => ({
      loc: `${origin}/cheatsheet/${c.slug}`, changefreq: 'monthly', priority: 0.6,
    })),
    ...entries.filter((e) => isSlug(e.slug)).flatMap((e) => {
      if (e.type === 'learning_path') return [{ loc: `${origin}/learning/${e.slug}`, lastmod: day(e.updated_at), changefreq: 'weekly', priority: 0.8 }]
      if (e.type === 'encyclopedia_topic') return [{ loc: `${origin}/encyclopedia/${e.slug}`, lastmod: day(e.updated_at), changefreq: 'monthly', priority: 0.7 }]
      return []
    }),
  ]

  const seen = new Set()
  const body = urls
    .filter((u) => !seen.has(u.loc) && seen.add(u.loc))
    .map((u) => [
      '  <url>',
      `    <loc>${xmlEscape(u.loc)}</loc>`,
      u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : null,
      `    <changefreq>${u.changefreq}</changefreq>`,
      `    <priority>${u.priority.toFixed(1)}</priority>`,
      '  </url>',
    ].filter(Boolean).join('\n'))
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}

/**
 * llms.txt (https://llmstxt.org): a Markdown index for AI agents, which usually
 * cannot execute this SPA's JavaScript.
 */
export function buildLlmsTxt(origin, { paths = [], sections = [] } = {}) {
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.summary}`,
    '',
    'Konten utama berbahasa Indonesia. Materi gratis bisa diakses tanpa login; sebagian learning path dan cheatsheet khusus paket PRO.',
    `Teks lengkap ensiklopedia tersedia di ${origin}/llms-full.txt.`,
    '',
    '## Learning Path',
    '',
    ...paths.filter((p) => isSlug(p.slug)).map((p) =>
      `- [${mdText(p.title)}](${origin}/learning/${p.slug})${p.description ? `: ${mdText(p.description)}` : ''}${p.is_premium ? ' (PRO)' : ''}`),
    '',
    '## Ensiklopedia Pemrograman',
    '',
    ...sections.flatMap((s) => (s.topics || []).filter((t) => isSlug(t.slug)).map((t) =>
      `- [${mdText(t.title)}](${origin}/encyclopedia/${t.slug})${t.subtitle ? `: ${mdText(t.subtitle)}` : ''}`)),
    '',
    '## Cheatsheet',
    '',
    ...cheatsheets.filter((c) => isSlug(c.slug)).map((c) =>
      `- [${mdText(c.title)}](${origin}/cheatsheet/${c.slug}): ${mdText(c.desc)}`),
    '',
    '## Halaman',
    '',
    ...STATIC_PAGES.filter((p) => !['/', '/learning', '/encyclopedia', '/cheatsheet'].includes(p.path))
      .map((p) => `- [${p.title}](${origin}${p.path})`),
    '',
  ]
  return lines.join('\n')
}

/** llms-full.txt: the full public encyclopedia text in one Markdown file. */
export function buildLlmsFullTxt(origin, { topics = [] } = {}) {
  const parts = [
    `# ${SITE.name}: Ensiklopedia Pemrograman`,
    '',
    `> ${SITE.summary}`,
    '',
    `Sumber: ${origin}/encyclopedia`,
    '',
  ]
  for (const t of topics) {
    if (!isSlug(t.slug) || !t.content) continue
    parts.push(
      `## ${mdText(t.title)}`,
      '',
      `URL: ${origin}/encyclopedia/${t.slug}`,
      t.subtitle ? `Ringkasan: ${mdText(t.subtitle)}` : null,
      t.category ? `Level: ${mdText(t.category)}` : null,
      '',
      String(t.content).trim(),
      '',
    )
  }
  return parts.filter((l) => l !== null).join('\n')
}

async function getJson(url, timeoutMs = 8000) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json', 'Accept-Language': 'id' },
    signal: AbortSignal.timeout(timeoutMs),
  })
  if (!response.ok) throw new Error(`${url} -> HTTP ${response.status}`)
  return response.json()
}

/** Fetches what a given file needs. Backend responses are cached server-side (anonymous). */
export async function loadContent(file, backendOrigin = SITE.backendOrigin) {
  const api = `${backendOrigin.replace(/\/$/, '')}/api`
  if (file === 'sitemap') {
    return { entries: (await getJson(`${api}/seo/sitemap`)).data || [] }
  }
  if (file === 'llms') {
    const [paths, sections] = await Promise.all([getJson(`${api}/paths`), getJson(`${api}/encyclopedia`)])
    return { paths: paths.data || [], sections: sections.data || [] }
  }
  if (file === 'llms-full') {
    const sections = (await getJson(`${api}/encyclopedia`)).data || []
    const slugs = sections.flatMap((s) => (s.topics || []).map((t) => t.slug)).filter(isSlug)
    const topics = []
    for (let i = 0; i < slugs.length; i += 6) {
      const batch = await Promise.allSettled(slugs.slice(i, i + 6).map((slug) => getJson(`${api}/encyclopedia/${slug}`)))
      for (const r of batch) if (r.status === 'fulfilled' && r.value?.data) topics.push(r.value.data)
    }
    return { topics }
  }
  throw new Error(`Unknown crawler file: ${file}`)
}

export const FILES = {
  sitemap: { type: 'application/xml; charset=utf-8', build: buildSitemapXml },
  llms: { type: 'text/markdown; charset=utf-8', build: buildLlmsTxt },
  'llms-full': { type: 'text/markdown; charset=utf-8', build: buildLlmsFullTxt },
}
