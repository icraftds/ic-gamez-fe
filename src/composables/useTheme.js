import { ref } from 'vue'

const globalIsLightMode = ref(false)
const hasInitialized = ref(false)

export function useTheme() {
  if (!hasInitialized.value) {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') {
      globalIsLightMode.value = true
      document.body.classList.add('light-mode')
    }
    hasInitialized.value = true
  }

  const toggleTheme = () => {
    globalIsLightMode.value = !globalIsLightMode.value
    if (globalIsLightMode.value) {
      document.body.classList.add('light-mode')
      localStorage.setItem('theme', 'light')
    } else {
      document.body.classList.remove('light-mode')
      localStorage.setItem('theme', 'dark')
    }
  }

  return {
    isLightMode: globalIsLightMode,
    toggleTheme
  }
}
