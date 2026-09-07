import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  console.error('[IC Game-Z Error]', err, info)
}

app.use(createPinia())
app.use(router)
app.mount('#app')

