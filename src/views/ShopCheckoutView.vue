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
                <i v-else-if="type === 'item'" class="fa-solid fa-box text-info"></i>
                <CyberEnergy v-else :pkgId="1" :isAnimated="false" />
                <span>{{ pkgName }} <span v-if="type === 'energy'">(+{{ pkgEnergy }} Energi)</span></span>
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
            <span v-else-if="type === 'item'">Item telah ditambahkan ke inventory Anda.</span>
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
      const response = await api.post('/shop/purchase/border', { border_id: intent.package_id, price: price })
      if (response.data.success !== true) throw new Error(response.data.message || 'Pembelian belum dapat dikonfirmasi')

      localStorage.removeItem(intentKey.value)
      await Promise.all([fetchUser(true), fetchWallet()])
    } else if (type === 'item') {
      const response = await api.post('/shop/purchase/item', { item_id: intent.package_id })
      if (response.data.success !== true) throw new Error(response.data.message || 'Pembelian belum dapat dikonfirmasi')
      localStorage.removeItem(intentKey.value)
      await Promise.all([fetchUser(true), fetchWallet()])
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
<style scoped src="../assets/css/views/ShopCheckoutView.css"></style>

