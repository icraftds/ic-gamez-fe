export const categories = [
  { id: 'all', label: 'Semua Modul' },
  { id: 'data', label: '📊 Data & Bisnis' },
  { id: 'dev', label: '💻 Developer & DevOps' },
  { id: 'sys', label: '⚙️ Sistem & Keamanan' },
  { id: 'ai', label: '🚀 Desain & AI' },
]

export const cheatsheets = [
  // 1. Data & Bisnis
  {
    slug: 'excel',
    title: 'Microsoft Excel',
    desc: '70+ rumus (SUM, XLOOKUP, INDEX MATCH, SUMIFS), 9 Data Tools, Pivot Table, dan shortcuts Win/Mac.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-file-excel',
    highlight: '70+ Rumus & Data Tools',
    questions: 22,
    file: 'excel.html'
  },
  {
    slug: 'googlesheets',
    title: 'Google Sheets & Apps Script',
    desc: 'Formula =QUERY(), =IMPORTRANGE(), =ARRAYFORMULA(), serta dasar otomasi Google Apps Script.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-table',
    highlight: 'QUERY & Otomasi Script',
    questions: 12,
    file: 'googlesheets.html'
  },
  {
    slug: 'sql',
    title: 'SQL & Database Querying',
    desc: 'SELECT, Visual JOINs, GROUP BY, Window Functions, CTE (WITH clause), dan indeks optimasi query.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-database',
    highlight: 'JOINs, CTE & Window Fn',
    questions: 15,
    file: 'sql.html'
  },
  {
    slug: 'powerbi',
    title: 'Power BI & DAX Functions',
    desc: 'Formula DAX CALCULATE(), FILTER(), RELATED(), Time Intelligence, Star Schema, dan visualisasi interaktif.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-chart-column',
    highlight: 'DAX, Star Schema & KPI',
    questions: 12,
    file: 'powerbi.html'
  },
  {
    slug: 'accounting',
    title: 'Akuntansi & Laporan Keuangan',
    desc: 'Persamaan dasar akuntansi, debit/kredit, jurnal penyesuaian, laporan laba rugi, neraca, dan arus kas.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-calculator',
    highlight: 'Jurnal, Laba Rugi & Neraca',
    questions: 12,
    file: 'accounting.html'
  },
  {
    slug: 'hr-payroll',
    title: 'HR & Penggajian (Payroll)',
    desc: 'Siklus rekrutmen, perhitungan PPh 21 tarif TER, BPJS Ketenagakerjaan/Kesehatan, dan pesangon UU Ciptaker.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-users-gear',
    highlight: 'PPh 21 TER & BPJS',
    questions: 12,
    file: 'hr-payroll.html'
  },
  {
    slug: 'supply-chain',
    title: 'Supply Chain & Logistik',
    desc: 'Metode EOQ, Reorder Point (ROP), Safety Stock, Incoterms 2020 (FOB, CIF, DDP), dan manajemen gudang.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-truck-fast',
    highlight: 'EOQ, ROP & Incoterms 2020',
    questions: 12,
    file: 'supply-chain.html'
  },
  {
    slug: 'regex',
    title: 'Regular Expression (RegEx)',
    desc: 'Karakter khusus, quantifier, capturing groups, lookaround assertions (lookahead/lookbehind), dan flags.',
    category: 'data',
    categoryLabel: 'Data & Bisnis',
    icon: 'fa-solid fa-code',
    highlight: 'Lookaround & Grouping',
    questions: 12,
    file: 'regex.html'
  },

  // 2. Developer & DevOps
  {
    slug: 'typescript',
    title: 'TypeScript Modern',
    desc: 'Generics, Utility Types (Partial, Omit, Pick, Record), type guards, keyof/typeof, dan tsconfig practices.',
    category: 'dev',
    categoryLabel: 'Developer & DevOps',
    icon: 'fa-solid fa-code',
    highlight: 'Generics & Utility Types',
    questions: 12,
    file: 'typescript.html'
  },
  {
    slug: 'javascript',
    title: 'JavaScript ES6+ & Async',
    desc: 'Array methods (map, filter, reduce), destructuring, closures, Event Loop, Promise chaining, dan async/await.',
    category: 'dev',
    categoryLabel: 'Developer & DevOps',
    icon: 'fa-brands fa-js',
    highlight: 'Async/Await & Event Loop',
    questions: 12,
    file: 'javascript.html'
  },
  {
    slug: 'git',
    title: 'Git & Version Control',
    desc: 'Branching strategy, merge vs rebase, stashing, cherry-pick, conventional commits, dan undo mistakes.',
    category: 'dev',
    categoryLabel: 'Developer & DevOps',
    icon: 'fa-brands fa-git-alt',
    highlight: 'Rebase, Merge & Stash',
    questions: 15,
    file: 'git.html'
  },
  {
    slug: 'docker',
    title: 'Docker & Containerization',
    desc: 'Lifecycle container, multi-stage Dockerfile, docker-compose, networking, persistent volume, dan security.',
    category: 'dev',
    categoryLabel: 'Developer & DevOps',
    icon: 'fa-brands fa-docker',
    highlight: 'Multi-stage & Compose',
    questions: 12,
    file: 'docker.html'
  },
  {
    slug: 'kubernetes',
    title: 'Kubernetes (K8s)',
    desc: 'Arsitektur control plane/worker node, Pod, Deployment, Service (ClusterIP/NodePort), Ingress, dan ConfigMap.',
    category: 'dev',
    categoryLabel: 'Developer & DevOps',
    icon: 'fa-solid fa-dharmachakra',
    highlight: 'Pods, Probes & CLI',
    questions: 12,
    file: 'kubernetes.html'
  },
  {
    slug: 'http-api',
    title: 'HTTP Status & RESTful API',
    desc: 'Matriks status code (401 vs 403, 502), method PUT vs PATCH, header idempotency, CORS, dan OAuth 2.0 flow.',
    category: 'dev',
    categoryLabel: 'Developer & DevOps',
    icon: 'fa-solid fa-network-wired',
    highlight: 'Status Code & CORS',
    questions: 12,
    file: 'http-api.html'
  },
  {
    slug: 'postman',
    title: 'Postman & API Testing',
    desc: 'Assertions pm.test, environment/collection variables, script pre-request, automated runner, dan mock server.',
    category: 'dev',
    categoryLabel: 'Developer & DevOps',
    icon: 'fa-solid fa-paper-plane',
    highlight: 'pm.test & Token Chaining',
    questions: 12,
    file: 'postman.html'
  },
  {
    slug: 'html-css',
    title: 'HTML5 & Modern CSS Layout',
    desc: 'Elemen semantik, box-sizing, teknik centering Flexbox, 12-kolom CSS Grid, clamp() responsive, dan animasi.',
    category: 'dev',
    categoryLabel: 'Developer & DevOps',
    icon: 'fa-brands fa-html5',
    highlight: 'Grid, Flexbox & Clamp',
    questions: 12,
    file: 'html-css.html'
  },

  // 3. Sistem & Keamanan
  {
    slug: 'linux',
    title: 'Linux CLI & Administration',
    desc: 'Navigasi bash, manipulasi file, permission chmod/chown, pipeline grep/awk/sed, systemctl, dan disk monitoring.',
    category: 'sys',
    categoryLabel: 'Sistem & Keamanan',
    icon: 'fa-brands fa-linux',
    highlight: 'Piping, Chmod & Systemd',
    questions: 15,
    file: 'linux.html'
  },
  {
    slug: 'networking',
    title: 'Computer Networking & TCP/IP',
    desc: 'Model 7 lapis OSI, TCP 3-way handshake vs UDP, subnetting IPv4/CIDR, DNS resolution, dan TLS 1.3 handshake.',
    category: 'sys',
    categoryLabel: 'Sistem & Keamanan',
    icon: 'fa-solid fa-server',
    highlight: 'OSI Layer, Subnet & Handshake',
    questions: 12,
    file: 'networking.html'
  },
  {
    slug: 'security',
    title: 'Keamanan Web & OWASP Top 10',
    desc: 'Mitigasi SQL Injection, XSS (CSP header), CSRF token, hashing bcrypt/argon2, Rate Limiting, dan JWT security.',
    category: 'sys',
    categoryLabel: 'Sistem & Keamanan',
    icon: 'fa-solid fa-shield-halved',
    highlight: 'SQLi, XSS, CSRF & JWT',
    questions: 12,
    file: 'security.html'
  },
  {
    slug: 'python',
    title: 'Python for Engineering & Data',
    desc: 'List comprehensions, generator yield, decorator @, context manager with, penanganan exception, dan OOP.',
    category: 'sys',
    categoryLabel: 'Sistem & Keamanan',
    icon: 'fa-brands fa-python',
    highlight: 'Decorators, Yield & OOP',
    questions: 15,
    file: 'python.html'
  },

  // 4. Desain & AI
  {
    slug: 'figma',
    title: 'Figma & UI/UX Design System',
    desc: 'Auto Layout (Hug vs Fill), component sets & variants, spacing 8pt grid, dan 10 prinsip heuristik Jakob Nielsen.',
    category: 'ai',
    categoryLabel: 'Desain & AI',
    icon: 'fa-brands fa-figma',
    highlight: 'Auto Layout & 8pt Grid',
    questions: 12,
    file: 'figma.html'
  },
  {
    slug: 'prompting',
    title: 'Prompt Engineering & Generative AI',
    desc: 'Framework RTCE, teknik Few-Shot, Chain-of-Thought (CoT), output JSON terstruktur, dan strategi anti-halusinasi.',
    category: 'ai',
    categoryLabel: 'Desain & AI',
    icon: 'fa-solid fa-robot',
    highlight: 'RTCE, CoT & JSON Output',
    questions: 12,
    file: 'prompting.html'
  },
  {
    slug: 'digital-marketing',
    title: 'Digital Marketing & SEO Metrics',
    desc: 'Formula kalkulasi ROAS, CAC, target rasio LTV 3:1, CTR, CPM, tag canonical, schema markup, dan Core Web Vitals.',
    category: 'ai',
    categoryLabel: 'Desain & AI',
    icon: 'fa-solid fa-bullhorn',
    highlight: 'ROAS, CAC & Core Web Vitals',
    questions: 12,
    file: 'digital-marketing.html'
  },
  {
    slug: 'markdown',
    title: 'Markdown & GitHub Flavored (GFM)',
    desc: 'Heading, alignment tabel, task list checkbox, GitHub alerts blockquote, diagram Mermaid, dan rumus KaTeX math.',
    category: 'ai',
    categoryLabel: 'Desain & AI',
    icon: 'fa-brands fa-markdown',
    highlight: 'Mermaid, KaTeX & Alerts',
    questions: 10,
    file: 'markdown.html'
  }
]

export const getCheatsheetBySlug = (slug) => {
  return cheatsheets.find(c => c.slug === slug) || null
}
