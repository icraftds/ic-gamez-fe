<template>
  <div class="payment-success-view">
    <SimpleBackground />
    
    <div class="success-container">
      <div class="success-card">
        <!-- State: Verifikasi Pembayaran (Loading) -->
        <div v-if="isLoading" class="status-content">
          <TerminalLoader size="lg" label="verifikasi pembayaran" />
          <h2 class="loading-title">Memverifikasi Pembayaran</h2>
          <p class="loading-subtitle">
            Mohon tunggu sebentar. Kami sedang menyinkronkan status dengan sistem pembayaran dan bank.
          </p>

          <div class="loading-actions">
            <button class="btn-secondary-action" @click="goToCheckout">
              <i class="fa-solid fa-arrow-left"></i> Belum Bayar? Lanjutkan ke Checkout
            </button>
            <button class="btn-cancel-action" @click="cancelAndGoToPricing">
              Batalkan Transaksi
            </button>
          </div>
        </div>

        <!-- State: Pembayaran Sukses -->
        <div v-else-if="isSuccess" class="status-content success">
          <div class="icon-circle success">
            <i class="fa-solid fa-check"></i>
          </div>
          <h2>Akses paket sudah aktif!</h2>
          <p>Pembayaran Anda telah berhasil diverifikasi. Selamat menikmati semua materi dan fitur premium iCraft!</p>
          <button class="btn-primary" @click="goToDashboard">
            <i class="fa-solid fa-gauge"></i> Masuk ke Dashboard
          </button>
        </div>

        <!-- State: Belum Bayar / Menunggu Pembayaran -->
        <div v-else class="status-content pending-unpaid">
          <div class="icon-circle pending">
            <i class="fa-solid fa-clock-rotate-left"></i>
          </div>
          <h2>Pembayaran Belum Dikonfirmasi</h2>
          <p>
            Kami belum mendeteksi pembayaran untuk transaksi Anda. Jika Anda baru saja membayar, klik <strong>Cek Ulang Status</strong>.
          </p>

          <!-- Order Summary Details -->
          <div v-if="savedCheckout" class="order-summary-box">
            <div class="summary-row">
              <span class="label">Paket</span>
              <span class="value highlight">{{ savedCheckout.planName || 'Pro' }} Plan</span>
            </div>
            <div v-if="savedCheckout.paymentDetails?.order_id" class="summary-row">
              <span class="label">No. Invoice</span>
              <span class="value monospace">{{ savedCheckout.paymentDetails.order_id }}</span>
            </div>
            <div v-if="formattedPrice" class="summary-row">
              <span class="label">Total Tagihan</span>
              <span class="value price">Rp {{ formattedPrice }}</span>
            </div>
          </div>

          <!-- Action Buttons Group -->
          <div class="action-buttons-group">
            <button class="btn-primary btn-action" @click="goToCheckout">
              <i class="fa-solid fa-credit-card"></i>
              <span>Lanjutkan Pembayaran</span>
            </button>
            <button class="btn-secondary btn-action" @click="startPolling" :disabled="isLoading">
              <i class="fa-solid fa-rotate-right"></i>
              <span>Cek Ulang Status</span>
            </button>
            <button class="btn-outline-danger btn-action" @click="cancelAndGoToPricing">
              <i class="fa-solid fa-xmark"></i>
              <span>Batalkan & Ganti Paket</span>
            </button>
            <button class="btn-ghost btn-action" @click="goToDashboard">
              Kembali ke Dashboard
            </button>
          </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
const savedCheckout = ref(null)

// CoinZ reward modal state
const showCoinzModal  = ref(false)
const coinzAmount     = ref(0)
const coinzPlan       = ref('pro')

const formattedPrice = computed(() => {
  const price = savedCheckout.value?.discountedPrice ?? savedCheckout.value?.planPrice ?? savedCheckout.value?.paymentDetails?.amount
  if (price == null) return null
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
})

const poll = createPaymentPoll(async (isCurrent) => {
  const saved = JSON.parse(localStorage.getItem('ic_pending_checkout') || 'null')
  if (saved) savedCheckout.value = saved

  await fetchUser(true)
  const isMatchUser = !saved?.userId || String(saved.userId) === String(userProfile.value?.id)
  const expectedPlan = isMatchUser ? (saved?.planSlug || currentPlan.value) : null
  
  const [user, response] = await Promise.all([fetchUser(true), api.get('/subscription')])
  if (!isCurrent()) return false
  const active = response.data?.data
  const baseline = saved?.paymentDetails?.baselineSubscription
  const newGrant = !baseline || (active && (active.id !== baseline.id || active.expires_at !== baseline.expires_at))
  
  if ((newGrant || !baseline) && user && isPremiumUser.value && (!expectedPlan || currentPlan.value === expectedPlan) && active?.status === 'active') {
    await fetchWallet()
    localStorage.removeItem('ic_pending_checkout')
    isLoading.value = false
    isSuccess.value = true
    fireConfetti()
    return true
  }
  return false
}, { 
  isAuthenticated: () => isLoggedIn.value, 
  onTimeout: () => { isLoading.value = false },
  timeoutMs: 12000,
  delays: [1500, 2000, 2500, 3000]
})

let disposed = false
const startPolling = async () => {
  isLoading.value = true
  const ready = await bootstrapSession(true)
  if (disposed) return
  if (!ready) { isLoading.value = false; return }
  poll.start()
}
const stopPolling = () => poll.stop()

const goToCheckout = () => {
  stopPolling()
  router.push({ name: 'checkout', query: { resume: 'true' } })
}

const cancelAndGoToPricing = () => {
  stopPolling()
  localStorage.removeItem('ic_pending_checkout')
  router.push('/pricing')
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
  try {
    const saved = localStorage.getItem('ic_pending_checkout')
    if (saved) savedCheckout.value = JSON.parse(saved)
  } catch (e) {}

  startPolling()
})

onUnmounted(() => { 
  disposed = true
  poll.dispose() 
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
  padding: 100px 20px 40px 20px;
  position: relative;
  z-index: 2;
}

.success-card {
  background: var(--bg-surface, #13141f);
  border: 1px solid var(--white-alpha-0_15, rgba(255, 255, 255, 0.15));
  border-radius: 20px;
  padding: 40px 32px;
  max-width: 520px;
  width: 100%;
  text-align: center;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
}

.status-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.4rem;
  margin-bottom: 4px;
}
.icon-circle.success {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  box-shadow: 0 0 25px rgba(16, 185, 129, 0.3);
}
.icon-circle.pending {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  box-shadow: 0 0 25px rgba(245, 158, 11, 0.3);
}
.icon-circle.error {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  box-shadow: 0 0 25px rgba(239, 68, 68, 0.3);
}

h2 {
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--text-light, #f1f5f9);
  margin: 0;
}
.loading-title {
  margin-top: 10px;
}
.loading-subtitle {
  color: var(--text-muted, #94a3b8);
  font-size: 0.95rem;
  line-height: 1.5;
}
p {
  color: var(--text-muted, #94a3b8);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

.order-summary-box {
  width: 100%;
  background: var(--white-alpha-0_05, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--white-alpha-0_1, rgba(255, 255, 255, 0.1));
  border-radius: 12px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}
.summary-row .label {
  color: var(--text-muted, #94a3b8);
}
.summary-row .value {
  color: var(--text-light, #e2e8f0);
  font-weight: 600;
}
.summary-row .value.highlight {
  color: var(--primary, #00f0ff);
  font-weight: 700;
}
.summary-row .value.monospace {
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
}
.summary-row .value.price {
  color: #10b981;
  font-weight: 800;
  font-size: 1rem;
}

.action-buttons-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-top: 8px;
}
.loading-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: 14px;
}

.btn-primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  border: none;
  padding: 13px 22px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  text-decoration: none;
  width: 100%;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
}

.btn-secondary {
  background: var(--white-alpha-0_08, rgba(255, 255, 255, 0.08));
  color: var(--text-light, #e2e8f0);
  border: 1px solid var(--white-alpha-0_2, rgba(255, 255, 255, 0.2));
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s ease;
  width: 100%;
}
.btn-secondary:hover:not(:disabled) {
  background: var(--white-alpha-0_15, rgba(255, 255, 255, 0.15));
  border-color: var(--primary, #00f0ff);
  color: var(--primary, #00f0ff);
  transform: translateY(-2px);
}
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline-danger {
  background: transparent;
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 11px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s ease;
  width: 100%;
}
.btn-outline-danger:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  transform: translateY(-2px);
}

.btn-ghost {
  background: transparent;
  color: var(--text-muted, #94a3b8);
  border: none;
  padding: 8px 16px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
  width: 100%;
}
.btn-ghost:hover {
  color: var(--text-light, #e2e8f0);
}

.btn-secondary-action {
  background: var(--white-alpha-0_08, rgba(255, 255, 255, 0.08));
  color: var(--primary, #00f0ff);
  border: 1px solid var(--primary, #00f0ff);
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  width: 100%;
}
.btn-secondary-action:hover {
  background: var(--primary, #00f0ff);
  color: #0b0c15;
}

.btn-cancel-action {
  background: transparent;
  color: var(--text-muted, #94a3b8);
  border: none;
  font-size: 0.85rem;
  padding: 6px;
  cursor: pointer;
}
.btn-cancel-action:hover {
  color: #ef4444;
}

@media (max-width: 480px) {
  .success-card {
    padding: 30px 18px;
    border-radius: 16px;
  }
  .success-container {
    padding-top: 80px;
  }
  h2 {
    font-size: 1.25rem;
  }
  .icon-circle {
    width: 64px;
    height: 64px;
    font-size: 2rem;
  }
}
</style>
