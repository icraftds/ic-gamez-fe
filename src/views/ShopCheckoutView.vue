<template>
  <div class="checkout-view">
    <SimpleBackground />
    
    <div class="checkout-wrapper">
      <!-- Breadcrumb -->
      <div class="checkout-breadcrumb">
        <span v-if="state === 'processing'" style="opacity: 0.5; cursor: not-allowed;">GameZ Shop</span>
        <router-link v-else to="/shop">GameZ Shop</router-link>
        <span class="separator"><i class="fa-solid fa-chevron-right"></i></span>
        <span class="current">Pembayaran</span>
      </div>

      <!-- Main Card -->
      <div class="checkout-card">
        <Transition name="fade-slide" mode="out-in">
          
          <!-- State 1: Confirmation -->
          <div v-if="state === 'confirm'" key="confirm" class="checkout-step">
            <h2 class="section-title">Konfirmasi Pembelian</h2>
            <p class="section-subtitle">
              {{ type === 'module' ? 'Tinjau kembali alur belajar yang akan Anda beli menggunakan iCoinZ.' : 'Tinjau kembali pesanan Anda.' }}
            </p>
            
            <div class="order-summary shop-order">
              <div class="order-plan-name">
                <i v-if="type === 'module'" class="fa-solid fa-layer-group text-info"></i>
                <i v-else-if="type === 'border'" class="fa-solid fa-hexagon-nodes text-warning"></i>
                <i v-else-if="type === 'item'" class="fa-solid fa-box text-info"></i>
                <CyberEnergy v-else :pkgId="1" :isAnimated="false" />
                <div>
                  <span>{{ pkgName }} <span v-if="type === 'energy'">(+{{ pkgEnergy }} Energi)</span></span>
                  <div v-if="type === 'module' && moduleNames" style="font-size: 0.8rem; opacity: 0.78; margin-top: 4px;">
                    {{ moduleNames }} • Durasi akses {{ durationDays }} hari
                  </div>
                </div>
              </div>
              <div class="order-price">
                <span v-if="method === 'coinz'" style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
                  <span v-if="type === 'module' && discountPercent > 0" style="font-size: 0.78rem; color: #34d399;">
                    Diskon Multi-Beli {{ discountPercent }}%
                  </span>
                  <span style="display: flex; align-items: center; gap: 6px;">
                    <img src="/images/icoinz.svg" alt="iCoinZ" class="inline-coinz" />
                    {{ formattedPrice }}
                  </span>
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
              <button class="btn-cancel" :disabled="state === 'processing'" @click="cancelCheckout">Batal</button>
              <button class="btn-primary" :disabled="method !== 'coinz' || state === 'processing'" @click="processPayment">
                <i class="fa-solid fa-check"></i> Konfirmasi & Bayar
              </button>
            </div>
          </div>

          <!-- State 2: Processing -->
          <div v-else-if="state === 'processing'" key="processing" class="checkout-step center-content">
            <TerminalLoader size="lg" label="pembayaran" />
            <p style="margin-top: 14px; color: var(--text-sub-hex, #94a3b8);">Memproses transaksi & sinkronisasi wallet... Mohon jangan tutup atau tinggalkan halaman ini.</p>
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
            <span v-if="type === 'module'">Akses modul telah aktif selama {{ durationDays }} hari. Selamat belajar!</span>
            <span v-else-if="type === 'border'">Border telah ditambahkan ke koleksi Anda.</span>
            <span v-else-if="type === 'item'">Item telah ditambahkan ke inventory Anda.</span>
            <span v-else>Energi Anda telah ditambahkan.</span>
            </p>
            
            <div class="success-actions">
              <button v-if="type === 'module'" class="btn-primary" @click="$router.push('/learn')">
                Mulai Belajar
              </button>
              <button v-else class="btn-primary" @click="$router.push('/dashboard')">
                Kembali ke Dashboard
              </button>
              <button class="btn-outline" @click="cancelCheckout">Beli Lagi</button>
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
                <i v-else-if="type === 'item'" class="fa-solid fa-box text-info"></i>
                <CyberEnergy v-else :pkgId="1" :isAnimated="false" />
                <span>{{ pkgName }} <span v-if="type === 'energy'">(+{{ pkgEnergy }} Energi)</span></span>
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
                    <TerminalLoader size="sm" label="QR" />
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

    <InsufficientBalanceModal
      v-model="showInsufficientModal"
      :itemName="pkgName"
      :requiredAmount="Number(insufficientRequired || price || 0)"
      :currentBalance="Number(coinz || 0)"
      :marketUrl="marketRedirectUrl"
      :marketRedirectEnabled="systemConfig.market_redirect_enabled"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import api from '../services/api'
import { useUserAccount } from '../composables/useUserAccount'
import { useLearningPaths } from '../composables/useLearningPaths'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import InsufficientBalanceModal from '../components/shop/InsufficientBalanceModal.vue'

const route = useRoute()
const router = useRouter()
const { fetchUser, fetchWallet, userProfile, coinz, systemConfig, fetchPublicConfig } = useUserAccount()
const { fetchPaths } = useLearningPaths()

const pkgId = route.query.pkgId
const pkgName = route.query.name || 'Paket'
const pkgEnergy = route.query.energy || 0
const type = route.query.type || 'energy'
const method = route.query.method || 'gateway'
const price = route.query.price || 0
const pathIds = String(route.query.pathIds || '')
  .split(',')
  .map((id) => Number(id.trim()))
  .filter(Boolean)
const moduleNames = route.query.names || ''
const durationDays = Number(route.query.durationDays || 30)
const discountPercent = Number(route.query.discountPercent || 0)

const state = ref('confirm')
const errorMsg = ref(method !== 'coinz' ? 'Pembayaran menggunakan QRIS belum tersedia. Gunakan iCoinz.' : '')
const qrString = ref('')
const countdown = ref(0)
const formattedCountdown = computed(() => '00:00')
const formattedPrice = computed(() => Number(price).toLocaleString('id-ID'))
const idempotencyKey = ref(crypto.randomUUID())

const showInsufficientModal = ref(false)
const insufficientRequired = ref(0)
const marketRedirectUrl = ref(systemConfig.value.market_topup_url || 'https://market.icraftds.id/topup')

onBeforeRouteLeave((_to, _from, next) => {
  if (state.value === 'processing') {
    next(false)
    return
  }
  next()
})

// Bersihkan kunci intent lama dari localStorage yang berpotensi mengunci pembelian user
onMounted(() => {
  fetchPublicConfig()
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('ic_energy_purchase')) {
        localStorage.removeItem(key)
      }
    })
  } catch (e) {
    // Abaikan error storage
  }
})

const cancelCheckout = () => {
  if (state.value === 'processing') return
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('ic_energy_purchase')) {
        localStorage.removeItem(key)
      }
    })
  } catch (e) {}
  router.push(type === 'module' ? '/shop?tab=module' : '/shop')
}

const processPayment = async () => {
  if (state.value === 'processing' || method !== 'coinz') return
  if (!userProfile.value?.id) { errorMsg.value = 'Silakan masuk kembali.'; return }
  errorMsg.value = ''
  state.value = 'processing'

  const executePurchase = async () => {
    if (type === 'module') {
      const response = await api.post('/shop/purchase/modules', { path_ids: pathIds })
      if (response.data.success !== true) throw new Error(response.data.message || 'Pembelian modul gagal')
      try { localStorage.removeItem('ic_learning_paths_cache_v3') } catch {}
    } else if (type === 'border') {
      const response = await api.post('/shop/purchase/border', { border_id: pkgId, price: price })
      if (response.data.success !== true) throw new Error(response.data.message || 'Pembelian border gagal')
    } else if (type === 'item') {
      const response = await api.post('/shop/purchase/item', { item_id: pkgId })
      if (response.data.success !== true) throw new Error(response.data.message || 'Pembelian item gagal')
    } else {
      const response = await api.post('/shop/purchase/coinz', { package_id: pkgId }, {
        headers: { 'Idempotency-Key': idempotencyKey.value }
      })
      if (response.data.success !== true) throw new Error(response.data.message || 'Pembelian energi gagal')
    }
  }

  try {
    await Promise.all([
      executePurchase(),
      new Promise((resolve) => setTimeout(resolve, 1600))
    ])

    await Promise.all([
      fetchUser(true),
      fetchWallet(),
      type === 'module' ? fetchPaths(true) : Promise.resolve()
    ])
    state.value = 'success'
  } catch (error) {
    idempotencyKey.value = crypto.randomUUID()
    state.value = 'confirm'
    const data = error.response?.data
    if (data?.code === 'INSUFFICIENT_ICOINZ') {
      insufficientRequired.value = Number(data.required_amount || price || 0)
      if (data.market_topup_url) {
        marketRedirectUrl.value = data.market_topup_url
      }
      await fetchWallet()
      showInsufficientModal.value = true
    }
    errorMsg.value = data?.message || error.message || 'Pembelian gagal. Silakan coba lagi.'
  }
}
</script>
<style scoped src="../assets/css/views/ShopCheckoutView.css"></style>
