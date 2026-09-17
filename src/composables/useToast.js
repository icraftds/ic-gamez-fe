import { ref } from 'vue'

const isVisible = ref(false)
const toastMessage = ref('')
const toastType = ref('info')
let timer = null

export function useToast() {
  const showToast = (message, type = 'info') => {
    toastMessage.value = message
    toastType.value = type
    isVisible.value = true
    
    clearTimeout(timer)
    timer = setTimeout(() => {
      isVisible.value = false
    }, 4000)
  }

  return {
    isVisible,
    toastMessage,
    toastType,
    showToast
  }
}
