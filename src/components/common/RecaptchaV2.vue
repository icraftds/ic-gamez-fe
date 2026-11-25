<template>
  <div v-if="effectiveSiteKey" class="recaptcha-widget-wrap">
    <div ref="containerRef" class="recaptcha-v2-mount"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useUserAccount } from '../../composables/useUserAccount'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  theme: {
    type: String,
    default: 'dark'
  }
})

const emit = defineEmits(['update:modelValue', 'expired', 'error'])

const { systemConfig, fetchPublicConfig } = useUserAccount()
const containerRef = ref(null)
const widgetId = ref(null)

const envSiteKey = (import.meta.env.VITE_RECAPTCHA_SITE_KEY || '').trim()
const effectiveSiteKey = computed(() => {
  if (envSiteKey) return envSiteKey
  if (systemConfig.value?.recaptcha_enabled && systemConfig.value?.recaptcha_site_key) {
    return String(systemConfig.value.recaptcha_site_key).trim()
  }
  return ''
})

let scriptPromise = null
const ensureRecaptchaScript = () => {
  if (typeof window === 'undefined') return Promise.resolve(null)
  if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
    return Promise.resolve(window.grecaptcha)
  }
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const callbackName = '__onGamezRecaptchaLoaded'
    window[callbackName] = () => {
      resolve(window.grecaptcha)
    }

    const existing = document.querySelector('script[data-gamez-recaptcha="1"]')
    if (existing) {
      if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
        resolve(window.grecaptcha)
      }
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?onload=${callbackName}&render=explicit&hl=id`
    script.async = true
    script.defer = true
    script.dataset.gamezRecaptcha = '1'
    script.onerror = () => {
      scriptPromise = null
      reject(new Error('Gagal memuat Google reCAPTCHA v2'))
    }
    document.head.appendChild(script)
  })

  return scriptPromise
}

const mountWidget = async () => {
  if (!effectiveSiteKey.value || !containerRef.value || widgetId.value !== null) return
  try {
    const grecaptcha = await ensureRecaptchaScript()
    if (!grecaptcha || !containerRef.value || widgetId.value !== null) return

    widgetId.value = grecaptcha.render(containerRef.value, {
      sitekey: effectiveSiteKey.value,
      theme: props.theme,
      callback: (token) => {
        emit('update:modelValue', token || '')
      },
      'expired-callback': () => {
        emit('update:modelValue', '')
        emit('expired')
      },
      'error-callback': () => {
        emit('update:modelValue', '')
        emit('error')
      }
    })
  } catch {
    // Biarkan form tetap berfungsi jika jaringan Google reCAPTCHA terblokir di sisi klien
  }
}

const reset = () => {
  emit('update:modelValue', '')
  if (typeof window !== 'undefined' && window.grecaptcha && widgetId.value !== null) {
    try {
      window.grecaptcha.reset(widgetId.value)
    } catch {}
  }
}

defineExpose({
  reset,
  isEnabled: computed(() => Boolean(effectiveSiteKey.value))
})

watch([effectiveSiteKey, containerRef], ([key, el]) => {
  if (key && el) {
    mountWidget()
  }
})

onMounted(() => {
  if (!envSiteKey && !systemConfig.value?.recaptcha_site_key) {
    fetchPublicConfig().catch(() => {})
  }
  if (effectiveSiteKey.value) {
    mountWidget()
  }
})

onBeforeUnmount(() => {
  widgetId.value = null
})
</script>

<style scoped>
.recaptcha-widget-wrap {
  display: flex;
  justify-content: center;
  margin: 4px 0 20px;
  min-height: 78px;
}
</style>
