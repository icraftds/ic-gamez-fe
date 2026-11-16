// Per-page <head> tags for prerendered pages: title, description, canonical,
// Open Graph/Twitter, and schema.org JSON-LD. Pure functions (unit-tested).
import { SITE } from './crawlers.js'

const BRAND = 'iC Game-Z'
const OG_IMAGE = '/og-image.png'

const STATIC_META = {
  '/': {
    title: 'iC Game-Z | Belajar Pemrograman Sambil Bermain — iCraftDS',
    description: 'Belajar pemrograman dari nol dengan cara seru: learning path terstruktur, editor kode di browser, kuis, tantangan coding, dan leaderboard. Python, JavaScript, SQL, PHP, HTML/CSS.',
  },
  '/learning': {
    title: 'Learning Path Pemrograman — Python, JavaScript, SQL, PHP | iC Game-Z',
    description: 'Pilih learning path terstruktur dari dasar pemrograman hingga AI & machine learning. Belajar bertahap dengan materi, kuis, dan latihan kode langsung di browser.',
  },
  '/encyclopedia': {
    title: 'Ensiklopedia Pemrograman — Konsep Dasar hingga Lanjutan | iC Game-Z',
    description: 'Penjelasan konsep pemrograman dalam Bahasa Indonesia: variabel, percabangan, perulangan, fungsi, OOP, struktur data, dan lainnya.',
  },
  '/cheatsheet': {
    title: 'Cheatsheet Programming & Tools — Git, SQL, Python, Excel | iC Game-Z',
    description: 'Kumpulan cheatsheet ringkas untuk Git, Docker, SQL, Python, JavaScript, Excel, Figma, dan lainnya. Rujukan cepat untuk developer dan profesional.',
  },
  '/pricing': {
    title: 'Harga & Paket PRO | iC Game-Z',
    description: 'Bandingkan paket gratis dan PRO iC Game-Z. Buka semua learning path, cheatsheet premium, dan fitur belajar lanjutan.',
  },
  '/leaderboard': {
    title: 'Leaderboard Coder | iC Game-Z',
    description: 'Peringkat coder iC Game-Z berdasarkan XP bulanan dan sepanjang masa.',
  },
  '/faq': { title: 'FAQ — Pertanyaan Umum | iC Game-Z', description: 'Jawaban atas pertanyaan umum seputar akun, learning path, langganan PRO, dan pembayaran di iC Game-Z.' },
  '/panduan': { title: 'Panduan Penggunaan | iC Game-Z', description: 'Panduan lengkap menggunakan iC Game-Z: mulai belajar, mengerjakan kuis dan tantangan, serta mengelola akun.' },
  '/developer': { title: 'Developer | iC Game-Z', description: 'Tim pengembang di balik platform belajar pemrograman iC Game-Z.' },
  '/tentang-kami': { title: 'Tentang Kami | iC Game-Z', description: 'iC Game-Z dari iCraftDS: platform belajar pemrograman berbasis gamifikasi untuk pelajar Indonesia.' },
  '/hubungi-kami': { title: 'Hubungi Kami | iC Game-Z', description: 'Hubungi tim iC Game-Z untuk pertanyaan, kerja sama, atau bantuan akun.' },
  '/kebijakan-privasi': { title: 'Kebijakan Privasi | iC Game-Z', description: 'Kebijakan privasi iC Game-Z: data yang kami kumpulkan dan cara kami melindunginya.' },
  '/syarat-ketentuan': { title: 'Syarat & Ketentuan | iC Game-Z', description: 'Syarat dan ketentuan penggunaan layanan iC Game-Z.' },
}

export const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

const clean = (value) => String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/[#*_`>]/g, '').replace(/\s+/g, ' ').trim()

const clip = (value, max = 160) => {
  const text = clean(value)
  return text.length <= max ? text : `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`
}

// JSON inside <script> must not be able to close the tag.
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

const organization = (origin) => ({
  '@type': 'Organization',
  name: BRAND,
  url: `${origin}/`,
  logo: `${origin}/favicon.png`,
  parentOrganization: { '@type': 'Organization', name: 'iCraftDS' },
})

const breadcrumbs = (origin, items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], index) => ({
    '@type': 'ListItem', position: index + 1, name, item: `${origin}${path}`,
  })),
})

/** @returns {{ title: string, description: string, ogType: string, schema: object[] }} */
export function pageMeta(page, origin) {
  if (page.kind === 'path') {
    const p = page.path
    const lessons = (p.chapters || []).reduce((sum, c) => sum + (c.lessons || []).length, 0)
    return {
      title: `Belajar ${clean(p.title)} — Learning Path | ${BRAND}`,
      description: clip(`${clean(p.description)}${lessons ? ` ${lessons} materi, kuis, dan latihan kode.` : ''}`),
      ogType: 'website',
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: clean(p.title),
          description: clip(p.description, 300) || clean(p.title),
          url: `${origin}/learning/${p.slug}`,
          inLanguage: 'id',
          isAccessibleForFree: !p.is_premium,
          provider: organization(origin),
          ...(p.chapters?.length ? { syllabusSections: p.chapters.map((c) => ({ '@type': 'Syllabus', name: clean(c.title) })) } : {}),
        },
        breadcrumbs(origin, [['Beranda', '/'], ['Learning Path', '/learning'], [clean(p.title), `/learning/${p.slug}`]]),
      ],
    }
  }

  if (page.kind === 'topic') {
    const t = page.topic
    return {
      title: `${clean(t.title)} — Ensiklopedia Pemrograman | ${BRAND}`,
      description: clip(t.subtitle ? `${clean(t.subtitle)}. ${clean(t.content)}` : t.content),
      ogType: 'article',
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: clean(t.title),
          description: clip(t.subtitle || t.content, 300),
          url: `${origin}/encyclopedia/${t.slug}`,
          inLanguage: 'id',
          ...(t.updated_at ? { dateModified: t.updated_at } : {}),
          ...(t.category ? { proficiencyLevel: clean(t.category) } : {}),
          author: organization(origin),
          publisher: organization(origin),
          isAccessibleForFree: true,
        },
        breadcrumbs(origin, [['Beranda', '/'], ['Ensiklopedia', '/encyclopedia'], [clean(t.title), `/encyclopedia/${t.slug}`]]),
      ],
    }
  }

  if (page.kind === 'cheatsheet') {
    const c = page.cheatsheet
    return {
      title: `Cheatsheet ${clean(c.title)} | ${BRAND}`,
      description: clip(c.desc),
      ogType: 'article',
      schema: [
        breadcrumbs(origin, [['Beranda', '/'], ['Cheatsheet', '/cheatsheet'], [clean(c.title), `/cheatsheet/${c.slug}`]]),
      ],
    }
  }

  const meta = STATIC_META[page.url] || { title: `${page.page?.title || BRAND} | ${BRAND}`, description: STATIC_META['/'].description }
  const schema = page.url === '/'
    ? [
        { '@context': 'https://schema.org', ...organization(origin) },
        { '@context': 'https://schema.org', '@type': 'WebSite', name: BRAND, url: `${origin}/`, inLanguage: 'id' },
      ]
    : [breadcrumbs(origin, [['Beranda', '/'], [page.page?.title || BRAND, page.url]])]
  return { ...meta, ogType: 'website', schema }
}

export function buildHead(page, { origin = SITE.origin } = {}) {
  if (page.kind === 'notfound') {
    return [
      `<title>Halaman tidak ditemukan | ${BRAND}</title>`,
      '<meta name="robots" content="noindex" />',
      `<meta name="description" content="Halaman yang Anda cari tidak ditemukan di ${BRAND}." />`,
    ].join('\n    ')
  }
  const { title, description, ogType, schema } = pageMeta(page, origin)
  const url = `${origin}${page.url === '/' ? '/' : page.url}`
  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:image" content="${origin}${OG_IMAGE}" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    ...schema.map(jsonLd),
  ].join('\n    ')
}

// Default per-page tags in index.html that each prerendered page replaces.
const REPLACED_TAGS = [
  /<title>[\s\S]*?<\/title>\s*/,
  /<meta name="description"[^>]*>\s*/,
  /<meta property="og:(type|title|description|url|image)"[^>]*>\s*/g,
]

export function injectPage(template, { head, appHtml, preload = '' }) {
  let html = template
  for (const pattern of REPLACED_TAGS) html = html.replace(pattern, '')
  if (!html.includes('<div id="app"></div>')) throw new Error('index.html is missing <div id="app"></div>')
  return html
    .replace('</head>', () => `    ${head}\n    ${preload}\n  </head>`)
    .replace('<div id="app"></div>', () => `<div id="app">${appHtml}</div>`)
}
