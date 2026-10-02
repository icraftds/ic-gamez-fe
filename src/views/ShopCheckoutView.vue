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
                <i class="fa-solid fa-bolt text-warning"></i>
                <span>{{ pkgName }} (+{{ pkgEnergy }} Energi)</span>
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
                  <div class="method-desc">{{ method === 'coinz' ? 'Pembayaran instan dengan koin' : 'Diarahkan ke payment gateway' }}</div>
                </div>
              </div>
            </div>

            <div v-if="errorMsg" class="payment-error-message">
              <i class="fa-solid fa-circle-exclamation"></i> {{ errorMsg }}
            </div>

            <div class="checkout-actions">
              <button class="btn-cancel" @click="$router.push('/shop')">Batal</button>
              <button class="btn-primary" @click="processPayment">
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
            <p class="success-desc">Anda telah berhasil membeli <strong>{{ pkgName }}</strong>.<br>Energi Anda telah ditambahkan.</p>
            
            <div class="success-actions">
              <button class="btn-primary" @click="$router.push('/dashboard')">
                Kembali ke Dashboard
              </button>
              <button class="btn-outline" @click="$router.push('/shop')">
                Beli Lagi
              </button>
            </div>
          </div>

        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import api from '../services/api'
import { useUserAccount } from '../composables/useUserAccount'
import SimpleBackground from '../components/common/SimpleBackground.vue'

const router = useRouter()
const route = useRoute()
const { fetchUser, userProfile } = useUserAccount()

const pkgId = route.query.pkgId
const pkgName = route.query.name || 'Paket'
const pkgEnergy = route.query.energy || 0
const method = route.query.method || 'gateway'
const price = route.query.price || 0

const state = ref('confirm') // confirm, processing, success
const errorMsg = ref('')

const formattedPrice = computed(() => {
  if (method === 'coinz') return price.toString()
  return Number(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
})

const processPayment = async () => {
  errorMsg.value = ''
  state.value = 'processing'
  
  try {
    if (method === 'coinz') {
      await api.post('/shop/purchase/coinz', { package_id: pkgId })
      await fetchUser()
      state.value = 'success'
    } else {
      const res = await api.post('/shop/purchase/gateway', { 
        package_id: pkgId,
        payment_method: 'qris'
      })
      
      const tx = res.data?.data || {}
      let checkoutUrl = tx.checkout_url || tx.payment_url
      
      if (!checkoutUrl && tx.pakasir_txn_id) {
        checkoutUrl = `https://app.pakasir.com/pay-v2/${tx.pakasir_txn_id}`
      }
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      } else {
        throw new Error('URL pembayaran tidak ditemukan dari server.')
      }
    }
  } catch (error) {
    state.value = 'confirm'
    errorMsg.value = error.response?.data?.message || error.message || 'Gagal memproses pembayaran'
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
