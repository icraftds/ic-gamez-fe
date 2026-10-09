<template>
  <div class="checkout-view">
    <SimpleBackground />
    
    <div class="checkout-wrapper">
      <!-- Breadcrumb -->
      <div class="checkout-breadcrumb">
        <router-link to="/shop">GameZ Shop</router-link>
        <span class="separator"><i class="fa-solid fa-chevron-right"></i></span>
        <span class="current">Pembayaran</span>
      </div>

      <!-- Main Card -->
      <div class="checkout-card">
        <Transition name="fade-slide" mode="out-in">
          
          <!-- State 1: Confirmation -->
          <div v-if="state === 'confirm'" key="confirm" class="checkout-step">
            <h2 class="section-title">Konfirmasi Pembelian</h2>
            <p class="section-subtitle">Tinjau kembali pesanan paket energi Anda.</p>
            
            <div class="order-summary shop-order">
              <div class="order-plan-name">
                <i v-if="type === 'border'" class="fa-solid fa-hexagon-nodes text-warning"></i>
                <CyberEnergy :pkgId="1" :isAnimated="false" />
                <span>{{ pkgName }} <span v-if="type !== 'border'">(+{{ pkgEnergy }} Energi)</span></span>
              </div>
              <div class="order-price">
                <span v-if="method === 'coinz'" style="display: flex; align-items: center; gap: 6px;">
                  <img src="/images/icoinz.svg" alt="iCoinZ" class="inline-coinz" />
                  {{ formattedPrice }}
                </span>
                <span v-else>Rp {{ formattedPrice }}</span>
              </div>
            </div>

            <div class="payment-method-summary">
              <h4>Metode Pembayaran</h4>
              <div class="method-card selected">
                <div class="method-icon" :class="method === 'coinz' ? 'coinz' : 'qris'">
                  <img v-if="method === 'coinz'" src="/images/icoinz.svg" alt="iCoinZ" />
                  <i v-else class="fa-solid fa-qrcode"></i>
                </div>
                <div class="method-info">
                  <div class="method-name">{{ method === 'coinz' ? 'Saldo iCoinZ' : 'QRIS / E-Wallet' }}</div>
                  <div class="method-desc">{{ method === 'coinz' ? 'Pembayaran instan dengan koin' : 'Scan kode QR untuk membayar' }}</div>
                </div>
              </div>
            </div>

            <div v-if="errorMsg" class="payment-error-message">
              <i class="fa-solid fa-circle-exclamation"></i> {{ errorMsg }}
            </div>

            <div class="checkout-actions">
              <button class="btn-cancel" @click="$router.push('/shop')">Batal</button>
              <button class="btn-primary" :disabled="method !== 'coinz' || state === 'processing'" @click="processPayment">
                <i class="fa-solid fa-check"></i> Konfirmasi & Bayar
              </button>
            </div>
          </div>

          <!-- State 2: Processing -->
          <div v-else-if="state === 'processing'" key="processing" class="checkout-step center-content">
            <div class="processing-spinner">
              <img src="/images/icoinz.svg" alt="Processing" class="icoinz-loading-spin" />
            </div>
            <h3>Memproses Pembayaran...</h3>
            <p>Mohon tunggu sebentar, jangan tutup halaman ini.</p>
          </div>

          <!-- State 3: Success (Coinz Only) -->
          <div v-else-if="state === 'success'" key="success" class="checkout-step center-content">
            <div class="success-icon-wrapper">
              <div class="success-icon-bg"></div>
              <img src="/images/icoinz.svg" alt="Success" class="icoinz-success-icon" />
              <div class="success-check-badge"><i class="fa-solid fa-check"></i></div>
            </div>
            <h2 class="success-title">Pembayaran Berhasil!</h2>
            <p class="success-desc">Anda telah berhasil membeli <strong>{{ pkgName }}</strong>.<br>
            <span v-if="type === 'border'">Border telah ditambahkan ke koleksi Anda.</span>
            <span v-else>Energi Anda telah ditambahkan.</span>
            </p>
            
            <div class="success-actions">
              <button class="btn-primary" @click="$router.push('/dashboard')">
                Kembali ke Dashboard
              </button>
              <button class="btn-outline" @click="$router.push('/shop')">
                Beli Lagi
              </button>
            </div>
          </div>

          <!-- State 4: QRIS Instruction -->
          <div v-else-if="state === 'qris'" key="qris" class="checkout-step">
            <h2 class="section-title">Instruksi Pembayaran</h2>
            <p class="section-subtitle">Selesaikan pembayaran sebelum waktu habis.</p>

            <!-- Method Badge -->
            <div class="instruction-method-badge">
              <i class="fa-solid fa-qrcode"></i>
              QRIS
            </div>

            <!-- Order Summary -->
            <div class="order-summary shop-order">
              <div class="order-plan-name">
                <i v-if="type === 'border'" class="fa-solid fa-hexagon-nodes text-warning"></i>
                <CyberEnergy :pkgId="1" :isAnimated="false" />
                <span>{{ pkgName }} <span v-if="type !== 'border'">(+{{ pkgEnergy }} Energi)</span></span>
              </div>
              <div class="order-price">
                <span>Rp {{ formattedPrice }}</span>
              </div>
            </div>

            <!-- QR Code Display -->
            <div class="qr-display" :class="{ 'is-expired': countdown === 0 }">
              <div class="qr-box-wrapper">
                <div class="qr-box">
                  <QrcodeVue v-if="qrString" :value="qrString" :size="200" level="H" />
                  <div v-else class="qr-dummy-label">
                    <i class="fa-solid fa-spinner fa-spin"></i> Memuat QR...
                  </div>
                </div>
              </div>
              <p class="qr-hint">Buka aplikasi e-wallet atau m-banking Anda, scan kode QR di atas untuk membayar.</p>
            </div>

            <!-- Awaiting Section -->
            <div class="awaiting-section">
              <div v-if="countdown > 0" class="awaiting-pulse">
                <span class="pulse-dot"></span>
                Menunggu Pembayaran...
              </div>
              <div v-else class="awaiting-pulse expired-text">
                <i class="fa-solid fa-circle-xmark"></i>
                Waktu Pembayaran Habis
              </div>
              <p v-if="countdown > 0" class="awaiting-timer">Selesaikan dalam <span class="timer-value">{{ formattedCountdown }}</span></p>
              <p v-else class="awaiting-timer text-muted">Silakan ulangi proses atau ganti metode pembayaran.</p>
            </div>

            <button class="btn-outline full-width" @click="state = 'confirm'">
              <i class="fa-solid fa-arrow-left"></i> Kembali
            </button>
          </div>

        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import api from '../services/api'
import { useUserAccount } from '../composables/useUserAccount'
import SimpleBackground from '../components/common/SimpleBackground.vue'

const route = useRoute()
const { fetchUser, fetchWallet, userProfile } = useUserAccount()
const pkgId = route.query.pkgId
const pkgName = route.query.name || 'Paket'
const pkgEnergy = route.query.energy || 0
const type = route.query.type || 'energy'
const method = route.query.method || 'gateway'
const price = route.query.price || 0
const state = ref('confirm')
const errorMsg = ref(method !== 'coinz' ? 'Pembayaran menggunakan QRIS belum tersedia. Gunakan iCoinz.' : '')
const qrString = ref('')
const countdown = ref(0)
const formattedCountdown = computed(() => '00:00')
const formattedPrice = computed(() => Number(price).toLocaleString('id-ID'))
const intentKey = computed(() => `ic_energy_purchase:${userProfile.value.id}`)

const processPayment = async () => {
  if (state.value === 'processing' || method !== 'coinz') return
  if (!userProfile.value.id) { errorMsg.value = 'Silakan masuk kembali.'; return }
  errorMsg.value = ''
  state.value = 'processing'
  try {
    let intent = JSON.parse(localStorage.getItem(intentKey.value) || 'null')
    if (intent && String(intent.package_id) !== String(pkgId)) {
      throw new Error('Pembelian sebelumnya belum pasti. Cek kembali paket sebelumnya sebelum membeli paket lain.')
    }
    if (!intent) {
      intent = { key: crypto.randomUUID(), package_id: pkgId, status: 'pending' }
      localStorage.setItem(intentKey.value, JSON.stringify(intent))
    }
    if (type === 'border') {
      // Simulate API call for Border
      await new Promise(resolve => setTimeout(resolve, 1000))
      const bought = JSON.parse(localStorage.getItem('bought_borders') || '[]')
      if (!bought.includes(pkgId)) {
        bought.push(pkgId)
        localStorage.setItem('bought_borders', JSON.stringify(bought))
      }
      localStorage.removeItem(intentKey.value)
    } else {
      const response = await api.post('/shop/purchase/coinz', { package_id: intent.package_id }, {
        headers: { 'Idempotency-Key': intent.key }
      })
      if (response.data.success !== true) throw new Error(response.data.message || 'Pembelian belum dapat dikonfirmasi')
      localStorage.removeItem(intentKey.value)
      await Promise.all([fetchUser(true), fetchWallet()])
    }
    state.value = 'success'
  } catch (error) {
    // Only a definitive rejection permits a new purchase intent.
    if (error.response?.status === 400 && error.response?.data?.success === false) localStorage.removeItem(intentKey.value)
    state.value = 'confirm'
    errorMsg.value = error.response?.data?.message || error.message || 'Pembelian belum pasti. Coba kembali dengan referensi yang sama.'
  }
}
</script>

<style scoped>
.checkout-view {
  min-height: 100vh;
  padding: 100px 20px 40px;
  position: relative;
  display: flex;
  justify-content: center;
}

.checkout-wrapper {
  width: 100%;
  max-width: 600px;
  position: relative;
  z-index: 2;
}

.checkout-breadcrumb {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
  font-size: 0.95rem;
}
.checkout-breadcrumb a {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.3s;
}
.checkout-breadcrumb a:hover { color: var(--text-light); }
.separator { color: #4b5563; font-size: 0.8rem; }
.current { color: var(--primary); font-weight: 600; }

.checkout-card {
  background: var(--glass-bg-card-0_8);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-light);
  margin-bottom: 8px;
}
.section-subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 30px;
}

.order-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 30px;
}
.order-plan-name {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-light);
}
.text-warning { color: #f59e0b; }
.order-plan-name i { font-size: 1.3rem; }
.order-price {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 8px;
}
.inline-coinz { width: 24px; height: 24px; }

.payment-method-summary h4 {
  margin-bottom: 15px;
  color: var(--text-light);
  font-weight: 600;
}
.method-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.1);
}
.method-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}
.method-icon.coinz { background: rgba(245, 158, 11, 0.2); }
.method-icon.coinz img { width: 24px; }
.method-icon.qris { background: rgba(2, 132, 199, 0.2); color: #38bdf8; }
.method-info .method-name { font-weight: 700; color: var(--text-light); margin-bottom: 4px; }
.method-info .method-desc { font-size: 0.85rem; color: var(--text-muted); }

.checkout-actions {
  display: flex;
  gap: 15px;
}
.btn-primary, .btn-cancel, .btn-outline {
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.3);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(147, 51, 234, 0.4); }
.btn-cancel {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-muted);
}
.btn-cancel:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-light); }
.btn-outline {
  background: transparent;
  border: 1px solid var(--primary);
  color: var(--primary);
}
.btn-outline:hover { background: rgba(0, 240, 255, 0.1); }
.btn-outline.full-width { width: 100%; }

.payment-error-message {
  padding: 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.center-content {
  text-align: center;
  padding: 40px 0;
}
.processing-spinner {
  font-size: 3rem;
  color: var(--primary);
  margin-bottom: 20px;
}
.center-content h3 { font-size: 1.3rem; color: var(--text-light); margin-bottom: 10px; }
.center-content p { color: var(--text-muted); font-size: 0.95rem; }

.success-icon-wrapper {
  position: relative;
  width: 90px;
  height: 90px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icoinz-success-icon {
  width: 70px;
  height: 70px;
  z-index: 2;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
.success-check-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  z-index: 3;
  border: 3px solid var(--glass-bg-card-0_8);
  animation: popIn 0.4s 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

@keyframes popIn {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

.success-title { font-size: 1.8rem; color: var(--text-light); margin-bottom: 15px; font-weight: 800; }
.success-desc { color: var(--text-muted); margin-bottom: 30px; line-height: 1.6; }
.success-actions { display: flex; gap: 15px; }

/* QRIS Instruction Styles */
.instruction-method-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(2, 132, 199, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 20px;
  color: #38bdf8;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.qr-display {
  text-align: center;
  padding: 30px 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 25px;
  transition: opacity 0.3s;
}
.qr-display.is-expired { opacity: 0.3; pointer-events: none; }

.qr-box-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}
.qr-box {
  background: white;
  padding: 16px;
  border-radius: 12px;
  display: inline-flex;
}
.qr-dummy-label {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.95rem;
}
.qr-hint {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-top: 10px;
}

.awaiting-section {
  text-align: center;
  margin-bottom: 25px;
}
.awaiting-pulse {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #fbbf24;
  font-size: 1rem;
  margin-bottom: 8px;
}
.pulse-dot {
  width: 10px;
  height: 10px;
  background: #fbbf24;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
}
.expired-text { color: #ef4444; }
.awaiting-timer {
  color: var(--text-muted);
  font-size: 0.95rem;
}
.timer-value {
  font-weight: 800;
  color: #fbbf24;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.1rem;
}
.text-muted { color: var(--text-muted); }

/* Transitions */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(30px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-30px); }

/* Custom iCoinZ Spinner */
.icoinz-loading-spin {
  width: 60px;
  height: 60px;
  animation: pulseRotate 1.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.5));
}

@keyframes pulseRotate {
  0% { transform: scale(0.9) rotate(0deg); opacity: 0.8; }
  50% { transform: scale(1.1) rotate(180deg); opacity: 1; filter: drop-shadow(0 0 20px rgba(245, 158, 11, 0.8)); }
  100% { transform: scale(0.9) rotate(360deg); opacity: 0.8; }
}
</style>
