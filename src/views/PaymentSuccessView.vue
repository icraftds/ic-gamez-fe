<template>
  <div class="payment-success-view">
    <SimpleBackground />
    <HomeNavbar />

    <div class="success-container">
      <div class="success-card">
        <div v-if="isLoading" class="status-content">
          <div class="spinner-large">
            <i class="fa-solid fa-spinner fa-spin"></i>
          </div>
          <h2>Sedang memverifikasi pembayaran Anda...</h2>
          <p>Mohon jangan tutup halaman ini. Kami sedang melakukan sinkronisasi dengan sistem bank dan payment gateway.</p>
        </div>
        <div v-else-if="isSuccess" class="status-content success">
          <div class="icon-circle">
            <i class="fa-solid fa-check"></i>
          </div>
          <h2>Berhasil! Koin/Akses Pro sudah aktif.</h2>
          <p>Pembayaran Anda telah diverifikasi. Selamat menikmati layanan iCraft!</p>
          <button class="btn-primary" @click="goToDashboard">
            Kembali ke Dashboard
          </button>
        </div>
        <div v-else class="status-content error">
          <div class="icon-circle error">
            <i class="fa-solid fa-xmark"></i>
          </div>
          <h2>Terjadi Kesalahan / Waktu Habis</h2>
          <p>Pembayaran belum terdeteksi setelah beberapa saat. Jika saldo Anda terpotong, silakan hubungi tim support kami.</p>
          <button class="btn-primary" @click="goToDashboard">
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAccount } from '../composables/useUserAccount'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import HomeNavbar from '../components/home/HomeNavbar.vue'

const router = useRouter()
const { fetchUser, isPremiumUser, credits } = useUserAccount()

const isLoading = ref(true)
const isSuccess = ref(false)
let pollingInterval = null
let maxAttempts = 15 // Cek maksimal 15 kali (60 detik)
let attempts = 0

const checkPaymentStatus = async () => {
  attempts++
  try {
    // Catat state awal sebelum fetch
    const initialIsPremium = isPremiumUser.value
    const initialCredits = userProfile.value?.credits || 0
    const initialPlan = userProfile.value?.current_plan?.slug || userProfile.value?.current_plan || 'free'
    
    await fetchUser() // fetch /auth/me ke Main Backend
    
    // Pembayaran sukses HANYA JIKA:
    // 1. Sebelumnya Free, sekarang jadi Premium
    // 2. Atau paketnya berubah (misal upgrade dari pro ke expert)
    // 3. Atau credits bertambah
    const newPlan = userProfile.value?.current_plan?.slug || userProfile.value?.current_plan || 'free'
    const becamePremium = !initialIsPremium && isPremiumUser.value
    const planChanged = isPremiumUser.value && initialPlan !== newPlan
    const gainedCredits = (userProfile.value?.credits || 0) > initialCredits
    
    if (becamePremium || planChanged || gainedCredits) {
      isLoading.value = false
      isSuccess.value = true
      stopPolling()
      fireConfetti()
    }
  } catch (err) {
    console.error('Failed to verify payment', err)
  }

  if (attempts >= maxAttempts && isLoading.value) {
    isLoading.value = false
    isSuccess.value = false
    stopPolling()
  }
}

const startPolling = () => {
  stopPolling()
  checkPaymentStatus() // initial check
  pollingInterval = setInterval(checkPaymentStatus, 4000)
}

const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

const fireConfetti = async () => {
  try {
    const confettiModule = await import('canvas-confetti')
    const confetti = confettiModule.default || confettiModule
    confetti({ particleCount: 180, spread: 80, origin: { y: 0.55 }, colors: ['#00f0ff', '#7c3aed', '#ec4899', '#f59e0b', '#10b981'] })
  } catch (e) {
    console.warn('Confetti fail', e)
  }
}

const goToDashboard = () => {
  router.push('/dashboard')
}

onMounted(() => {
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})
</script>

<style scoped>
.payment-success-view {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.success-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px 20px 20px 20px;
  position: relative;
  z-index: 2;
}

.success-card {
  background: var(--bg-surface);
  border: 1px solid var(--white-alpha-0_1);
  border-radius: 16px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.status-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner-large i {
  font-size: 3rem;
  color: var(--primary);
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  color: #10b981;
}

.icon-circle.error {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

p {
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.btn-primary {
  margin-top: 10px;
  background: var(--primary);
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}
</style>
