import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

import { initCsrf } from './services/api'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  console.error('[IC Game-Z Error]', err, info)
}

import CyberEnergy from './components/ui/CyberEnergy.vue'
import CyberXp from './components/ui/CyberXp.vue'
import CyberLevel from './components/ui/CyberLevel.vue'

app.use(createPinia())
app.use(router)
app.component('CyberEnergy', CyberEnergy)
app.component('CyberXp', CyberXp)
app.component('CyberLevel', CyberLevel)

initCsrf().then(() => {
  app.mount('#app')
})

