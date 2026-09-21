<template>
  <teleport to="body">
    <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')" title="Tutup">
        <i class="fa-solid fa-xmark"></i>
      </button>
      
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Memuat instruksi pembayaran...</p>
      </div>

      <div v-else-if="!isSuccess" class="payment-details">
        <h2 class="gradient-text">Instruksi Pembayaran</h2>
        <p class="subtitle">Selesaikan pembayaran untuk mengaktifkan paket {{ planName }}</p>
        
        <div class="qr-container">
          <div class="qr-placeholder">
            <i class="fa-solid fa-qrcode fa-5x"></i>
          </div>
          <p class="text-sm">Scan QRIS menggunakan M-Banking atau E-Wallet Anda</p>
        </div>

        <div class="va-container">
          <span class="va-label">Atau bayar melalui Virtual Account:</span>
          <div class="va-box">
            <span class="va-number">88000 1234 5678 9999</span>
            <button class="copy-btn" @click="copyVA" title="Salin VA">
              <i class="fa-solid fa-copy"></i>
            </button>
          </div>
        </div>

        <div class="dummy-action">
          <p class="text-muted text-xs">Mode Simulasi Pembayaran (Dummy)</p>
          <button class="btn-primary w-full shadow-glow" @click="simulateSuccess">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Simulasikan Bayar Sukses
          </button>
        </div>
      </div>
      
      <div v-else class="success-state">
        <div class="success-icon">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h2 class="text-glow">Selamat!</h2>
        <p>Paket berhasil diubah menjadi Premium!</p>
        <button class="btn-primary mt-4 w-full" @click="$emit('success-closed')">
          Lanjutkan Bermain
        </button>
      </div>
    </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import * as confettiPkg from 'canvas-confetti'
const confetti = confettiPkg.default || confettiPkg
import { useUserAccount } from '../../composables/useUserAccount'

const props = defineProps({
  isOpen: Boolean,
  planName: String,
  planId: String
})

const emit = defineEmits(['close', 'success-closed', 'success'])

const isLoading = ref(true)
const isSuccess = ref(false)
const userAccount = useUserAccount()

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    isLoading.value = true
    isSuccess.value = false
    // Simulasi delay ambil response QR dari backend
    setTimeout(() => {
      isLoading.value = false
    }, 1500)
  }
})

const copyVA = () => {
  navigator.clipboard.writeText("88000123456789999")
  alert("Nomor Virtual Account berhasil disalin!")
}

const simulateSuccess = async () => {
  isLoading.value = true
  
  try {
    // Simulasi delay hit endpoint success
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Secara langsung update Pinia / State agar efeknya langsung terasa (Responsive UX)
    userAccount.isPremiumUser.value = true
    userAccount.currentPlan.value = props.planId
    userAccount.credits.value = 9999
    
    isSuccess.value = true
    isLoading.value = false
    
    // Jalankan efek partikel kembang api khas game
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00ffea', '#ff0055', '#7000ff']
    })
    
    emit('success')
  } catch (error) {
    isLoading.value = false
    console.error(error)
  }
}
</script>

<style scoped src="../../assets/css/components/pricing/PaymentInstructionModal.css"></style>
