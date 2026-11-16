import fs from 'node:fs'
import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

const CRAWLER_FILES = { '/sitemap.xml': 'sitemap', '/llms.txt': 'llms', '/llms-full.txt': 'llms-full' }

// Dev only: serve the crawler files that Vercel serves through api/seo.js in production.
function seoCrawlerFilesDev(env) {
  return {
    name: 'seo-crawler-files-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const file = CRAWLER_FILES[(req.url || '').split('?')[0]]
        if (!file) return next()
        const { renderCrawlerFile } = await import('./api/seo.js')
        const backendOrigin = (env.VITE_BASE_URL || 'https://icgamez.unikom.my.id/api').replace(/\/api\/?$/, '')
        const origin = `http://${req.headers.host}`
        const result = await renderCrawlerFile(file, { origin, backendOrigin })
        res.statusCode = result.status
        res.setHeader('Content-Type', result.type)
        res.end(result.body)
      })
    },
  }
}

// Emit dist/spa.html (the plain SPA shell) on every client build. vercel.json routes app
// pages to it, so routing works even if the prerender step is skipped.
function spaShell() {
  return {
    name: 'spa-shell',
    apply: 'build',
    writeBundle(options) {
      const index = path.join(options.dir, 'index.html')
      if (fs.existsSync(index)) fs.copyFileSync(index, path.join(options.dir, 'spa.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    define: {
      __SSO_ENABLED__: JSON.stringify(process.env.SSO_ENABLED === 'true'),
      __SSO_GLOBAL_LOGOUT_ENABLED__: JSON.stringify(process.env.SSO_GLOBAL_LOGOUT_ENABLED === 'true'),
    },
    plugins: [vue(), seoCrawlerFilesDev(env), spaShell()],
    resolve: {
      dedupe: [
        '@codemirror/state',
        '@codemirror/view',
        '@codemirror/language',
        '@codemirror/commands',
        '@codemirror/autocomplete',
        '@codemirror/lint',
      ],
    },
    build: {
      chunkSizeWarningLimit: 1000,
    },
  }
})
