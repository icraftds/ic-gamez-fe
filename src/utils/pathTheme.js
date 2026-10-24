/**
 * Authentic brand colors and icons for IC Game-Z learning paths.
 * Reflects genuine ecosystem branding (e.g. Laravel Red, React Cyan, Node Green, etc.)
 * rather than forcing yellow/amber on PRO paths.
 */

export const BRAND_COLORS = {
  // PHP & Laravel: Authentic Laravel Red
  'php-laravel': '#ff2d20',
  'laravel': '#ff2d20',
  
  // Frontend Framework: React Cyan
  'frontend-framework': '#00d8ff',
  'react': '#00d8ff',
  
  // Backend Developer: Node.js Green
  'backend-development': '#22c55e',
  'backend-developer': '#22c55e',
  'node': '#22c55e',
  
  // JavaScript: JS Gold / Yellow
  'javascript-pemula': '#facc15',
  'javascript-untuk-pemula': '#facc15',
  'javascript': '#facc15',
  
  // HTML & CSS: HTML5 Orange
  'html-css-dasar': '#f97316',
  'html-css': '#f97316',
  'html': '#f97316',
  
  // Layout & Desain Responsif: CSS3 Royal Blue
  'layout-dan-responsive-design': '#3b82f6',
  'layout': '#3b82f6',
  'css': '#3b82f6',
  
  // Python: Python Blue
  'dasar-python': '#38bdf8',
  'python': '#38bdf8',
  
  // Database & SQL: Database Blue
  'database-sql': '#0284c7',
  'sql': '#0284c7',
  
  // Logika & Berpikir Komputasional: Synapse Hot Pink / Magenta
  'logika-dan-berpikir-komputasional': '#ec4899',
  'logika': '#ec4899',
  
  // Matematika untuk Informatika: Math Violet / Electric Purple
  'matematika-informatika': '#a855f7',
  'matematika': '#a855f7',
  
  // Dasar Pemrograman: Cyber Cyan
  'dasar-pemrograman': '#00f0ff',
  
  // Frontend Web: Modern Teal
  'frontend-web': '#14b8a6',
  
  // Global Challenges: Trophy Gold
  'global-challenges': '#eab308'
}

export const FALLBACK_PALETTE = [
  '#00f0ff',
  '#ec4899',
  '#a855f7',
  '#10b981',
  '#3b82f6',
  '#f97316',
  '#ff2d20',
  '#00d8ff',
  '#22c55e',
  '#facc15'
]

export function getPathThemeColor(path, index = 0) {
  if (!path) return '#00f0ff'
  
  // Locked paths retain dark slate
  if (path.isLocked || path.is_locked) {
    return '#475569'
  }
  
  const slug = (path.slug || '').toLowerCase()
  const title = (path.title || '').toLowerCase()
  const icon = (path.icon || '').toLowerCase()

  // 1. Exact slug match
  if (BRAND_COLORS[slug]) {
    return BRAND_COLORS[slug]
  }

  // 2. Keyword heuristic on slug, title, or icon
  if (slug.includes('laravel') || title.includes('laravel') || icon.includes('laravel')) return BRAND_COLORS['php-laravel']
  if (slug.includes('react') || title.includes('react') || icon.includes('react')) return BRAND_COLORS['frontend-framework']
  if (slug.includes('node') || slug.includes('backend') || title.includes('backend') || icon.includes('node')) return BRAND_COLORS['backend-development']
  if (slug.includes('javascript') || slug.includes('js') || title.includes('javascript') || icon.includes('fa-js')) return BRAND_COLORS['javascript-pemula']
  if (slug.includes('html') || title.includes('html') || icon.includes('html5')) {
    if (slug.includes('frontend-web') || title.includes('frontend web')) return BRAND_COLORS['frontend-web']
    return BRAND_COLORS['html-css-dasar']
  }
  if (slug.includes('layout') || slug.includes('responsive') || title.includes('layout') || title.includes('responsive') || icon.includes('css3')) return BRAND_COLORS['layout-dan-responsive-design']
  if (slug.includes('python') || title.includes('python') || icon.includes('python')) return BRAND_COLORS['dasar-python']
  if (slug.includes('database') || slug.includes('sql') || title.includes('database') || title.includes('sql') || icon.includes('database')) return BRAND_COLORS['database-sql']
  if (slug.includes('logika') || title.includes('logika') || icon.includes('brain')) return BRAND_COLORS['logika-dan-berpikir-komputasional']
  if (slug.includes('matematika') || title.includes('matematika') || icon.includes('calculator')) return BRAND_COLORS['matematika-informatika']
  if (slug.includes('dasar-pemrograman') || title.includes('dasar pemrograman')) return BRAND_COLORS['dasar-pemrograman']
  if (slug.includes('frontend-web') || title.includes('frontend web')) return BRAND_COLORS['frontend-web']
  if (slug.includes('challenge') || title.includes('challenge') || icon.includes('trophy')) return BRAND_COLORS['global-challenges']

  // 3. Fallback rotation
  return FALLBACK_PALETTE[index % FALLBACK_PALETTE.length] || '#00f0ff'
}

export function getPathIconClass(path) {
  if (path?.icon) return path.icon
  const slug = (path?.slug || '').toLowerCase()
  
  if (slug.includes('laravel')) return 'fa-brands fa-laravel'
  if (slug.includes('react') || slug.includes('framework')) return 'fa-brands fa-react'
  if (slug.includes('backend') || slug.includes('node')) return 'fa-solid fa-server'
  if (slug.includes('javascript') || slug.includes('js')) return 'fa-brands fa-js'
  if (slug.includes('html')) return 'fa-brands fa-html5'
  if (slug.includes('layout') || slug.includes('responsive')) return 'fa-solid fa-table-cells-large'
  if (slug.includes('python')) return 'fa-brands fa-python'
  if (slug.includes('database') || slug.includes('sql')) return 'fa-solid fa-database'
  if (slug.includes('logika')) return 'fa-solid fa-brain'
  if (slug.includes('matematika')) return 'fa-solid fa-calculator'
  if (slug.includes('dasar-pemrograman')) return 'fa-solid fa-code'
  if (slug.includes('frontend-web')) return 'fa-brands fa-html5'
  if (slug.includes('challenge')) return 'fa-solid fa-trophy'

  return 'fa-solid fa-code'
}
