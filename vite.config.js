import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  define: {
    __SSO_ENABLED__: JSON.stringify(process.env.SSO_ENABLED === 'true'),
    __SSO_GLOBAL_LOGOUT_ENABLED__: JSON.stringify(process.env.SSO_GLOBAL_LOGOUT_ENABLED === 'true'),
  },
  plugins: [vue()],
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
  }
})
