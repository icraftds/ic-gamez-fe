import { ref } from 'vue'

const showWipModal = ref(false)

export const useWipModal = () => {
  const openWipModal = () => {
    showWipModal.value = true
  }

  const closeWipModal = () => {
    showWipModal.value = false
  }

  return {
    showWipModal,
    openWipModal,
    closeWipModal
  }
}
