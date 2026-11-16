// Server entry for build-time prerendering of public pages (see scripts/prerender.mjs).
// Mirrors main.js, but renders to an HTML string as a logged-out visitor.
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'
import router from './router'
import CyberEnergy from './components/ui/CyberEnergy.vue'
import CyberXp from './components/ui/CyberXp.vue'
import CyberLevel from './components/ui/CyberLevel.vue'
import TerminalLoader from './components/common/TerminalLoader.vue'
import { seedLearningPathsForPrerender } from './composables/useLearningPaths'
import { seedPlansForPrerender } from './composables/usePlans'
import { setPrerenderData } from './services/prerenderData'

/**
 * @param {string} url
 * @param {{ paths?: any[], plans?: any[], encyclopedia?: any[]|null, topic?: object|null }} data
 * @returns {Promise<{ html: string, modules: Set<string>, matched: boolean, name: string|symbol|undefined }>}
 */
export async function render(url, data = {}) {
  seedLearningPathsForPrerender(data.paths || [])
  seedPlansForPrerender(data.plans || [])
  setPrerenderData({ encyclopedia: data.encyclopedia, topic: data.topic })

  const app = createSSRApp(App)
  app.use(createPinia())
  app.use(router)
  app.component('CyberEnergy', CyberEnergy)
  app.component('CyberXp', CyberXp)
  app.component('CyberLevel', CyberLevel)
  app.component('TerminalLoader', TerminalLoader)

  await router.push(url)
  await router.isReady()
  const route = router.currentRoute.value
  const matched = route.matched.length > 0 && route.name !== 'not-found'

  const ctx = {}
  const html = await renderToString(app, ctx)
  return { html, modules: ctx.modules || new Set(), matched, name: route.name }
}
