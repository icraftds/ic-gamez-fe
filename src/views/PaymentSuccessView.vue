<template>
  <div class="payment-success-view">
    <SimpleBackground />
    
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
          <h2>Akses paket sudah aktif.</h2>
          <p>Pembayaran Anda telah diverifikasi. Selamat menikmati layanan iCraft!</p>
          <button class="btn-primary" @click="goToDashboard">
            Kembali ke Dashboard
          </button>
        </div>
        <div v-else class="status-content error">
          <div class="icon-circle error">
            <i class="fa-solid fa-xmark"></i>
          </div>
          <h2>Pembayaran masih diproses</h2>
          <p>Aktivasi paket belum dapat dikonfirmasi. Cek ulang atau hubungi dukungan; jangan membuat pembayaran baru.</p>
          <button class="btn-primary" @click="startPolling">Cek ulang</button>
          <button class="btn-primary" @click="goToDashboard">Kembali ke Dashboard</button>
        </div>
      </div>
    </div>

    <!-- CoinZ Reward Modal -->
    <CoinzRewardModal
      v-model="showCoinzModal"
      :amount="coinzAmount"
      :plan="coinzPlan"
    />
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserAccount } from '../composables/useUserAccount'
import api from '../services/api'
import { createPaymentPoll } from '../utils/paymentPoll'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import CoinzRewardModal from '../components/common/CoinzRewardModal.vue'

const router = useRouter()
const route  = useRoute()
const { bootstrapSession, fetchUser, fetchWallet, isPremiumUser, currentPlan, isLoggedIn, userProfile } = useUserAccount()

const isLoading  = ref(true)
const isSuccess  = ref(false)

// CoinZ reward modal state
const showCoinzModal  = ref(false)
const coinzAmount     = ref(0)
const coinzPlan       = ref('pro')

const poll = createPaymentPoll(async (isCurrent) => {
  const saved = JSON.parse(localStorage.getItem('ic_pending_checkout') || 'null')
  await fetchUser(true)
  const expectedPlan = saved?.userId === userProfile.value.id ? saved.planSlug : null
  if (!expectedPlan) return false
  const [user, response] = await Promise.all([fetchUser(true), api.get('/subscription')])
  if (!isCurrent()) return false
  const active = response.data.data
  const baseline = saved?.paymentDetails?.baselineSubscription
  const newGrant = !baseline || (active && (active.id !== baseline.id || active.expires_at !== baseline.expires_at))
  if (newGrant && user && isPremiumUser.value && currentPlan.value === expectedPlan && response.data.data?.status === 'active') {
    await fetchWallet()
    localStorage.removeItem('ic_pending_checkout')
    isLoading.value = false
    isSuccess.value = true
    fireConfetti()
    return true
  }
  return false
}, { isAuthenticated: () => isLoggedIn.value, onTimeout: () => { isLoading.value = false } })
let disposed = false
const startPolling = async () => {
  isLoading.value = true
  const ready = await bootstrapSession()
  if (disposed) return
  if (!ready) { isLoading.value = false; return }
  poll.start()
}
const stopPolling = () => poll.stop()

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

onMounted(() => { startPolling() })
onUnmounted(() => { disposed = true; poll.dispose() })
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
