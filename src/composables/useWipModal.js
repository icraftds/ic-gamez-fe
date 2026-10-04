import { ref } from 'vue'

const showWipModal = ref(false)
const wipTitle = ref('Selamat Datang kembali di Game Z')
const wipDesc = ref('Kamu sudah berada di jalur yang benar. Terus lanjutkan petualangan belajarmu!')
const wipIcon = ref('/images/Favicon%20GameZ.png')

export const useWipModal = () => {
  const openWipModal = (options = {}) => {
    wipTitle.value = options.title || 'Selamat Datang kembali di Game Z'
    wipDesc.value = options.desc || 'Kamu sudah berada di jalur yang benar. Terus lanjutkan petualangan belajarmu!'
    wipIcon.value = options.icon || '/images/Favicon%20GameZ.png'
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
