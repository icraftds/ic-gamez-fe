<template>
  <div v-if="modelValue" class="modal-backdrop" @click="close">
    <div class="modal-content" @click.stop>
      <div class="modal-icon">
        <i class="fa-solid fa-crown"></i>
      </div>
      <h2>Konten Premium</h2>
      <p>Modul pembelajaran ini berbayar. Silakan berlangganan Premium terlebih dahulu untuk mengakses seluruh materi secara lengkap.</p>
      
      <div class="modal-actions">
        <button class="btn-cancel" @click="close">Batal</button>
        <button class="btn-subscribe" @click="subscribe">Berlangganan Sekarang</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserAccount } from '../../composables/useUserAccount'

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
const router = useRouter()
const { isLoggedIn } = useUserAccount()

const close = () => {
  emit('update:modelValue', false)
}

const subscribe = () => {
  emit('update:modelValue', false)
  if (isLoggedIn.value) {
    router.push('/dashboard?tab=langganan')
  } else {
    router.push('/?auth=login')
  }
}
</script>

<style scoped src="../../assets/css/components/common/PremiumModal.css"></style>
