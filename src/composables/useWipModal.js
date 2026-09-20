import { ref } from 'vue'

const showWipModal = ref(false)
const wipTitle = ref('Fitur Dalam Pengembangan')
const wipDesc = ref('Stay tune ya! Fitur ini sedang kami siapkan untuk Anda.')
const wipIcon = ref('fa-person-digging')

export const useWipModal = () => {
  const openWipModal = (options = {}) => {
    wipTitle.value = options.title || 'Fitur Dalam Pengembangan'
    wipDesc.value = options.desc || 'Stay tune ya! Fitur ini sedang kami siapkan untuk Anda.'
    wipIcon.value = options.icon || 'fa-person-digging'
    showWipModal.value = true
  }

  const closeWipModal = () => {
    showWipModal.value = false
  }

  return {
    showWipModal,
    wipTitle,
    wipDesc,
    wipIcon,
    openWipModal,
    closeWipModal
  }
}
