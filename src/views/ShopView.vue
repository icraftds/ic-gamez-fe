<template>
  <div class="shop-view-wrapper">
    <p v-if="walletStatus !== 'fresh' || walletInitializationPending" role="status">
      Saldo belum dapat diperbarui.
      <button @click="async () => { await initializeWallet(true); await fetchWallet() }">Coba lagi</button>
    </p>
    <!-- Compact Header -->
    <div class="shop-compact-header container">
      <div class="header-content-left">
        <div class="title-with-icon">
          <div class="header-icon-box">
            <i class="fa-solid fa-store"></i>
          </div>
          <div class="header-text-group">
            <h1>GameZ Shop</h1>
            <p>Dapatkan tambahan energi untuk menyelesaikan tantangan.</p>
          </div>
        </div>
      </div>
      <div class="header-content-right">
        <div class="wallet-compact-badge" title="Saldo iCoinZ">
          <img src="/images/icoinz.svg" alt="iCoinZ" class="icoinz-icon" />
          <span class="coin-amount">{{ coinz === null ? '—' : coinz }}</span>
        </div>
      </div>
    </div>

    <!-- Shop Content -->
    <div class="shop-content-section container">

      <div v-if="isLoading" class="loading-state">
        <img src="/images/icoinz.svg" alt="Loading" class="icoinz-loading-icon" />
        <p>Memuat etalase...</p>
      </div>

      <div v-else-if="packages.length === 0" class="empty-state">
        <div class="empty-icon-wrapper">
          <i class="fa-solid fa-box-open"></i>
        </div>
        <h3>Toko Sedang Kosong</h3>
        <p>Belum ada paket yang tersedia saat ini. Silakan kembali lagi nanti.</p>
      </div>

      <div v-else class="packages-grid">
        <div 
          v-for="pkg in packages" 
          :key="pkg.id" 
          class="package-card"
        >
          <div class="package-card-inner">
            <div class="package-header">
              <div class="package-icon">
                <i class="fa-solid fa-bolt"></i>
              </div>
              <div class="energy-badge">+{{ pkg.energy_amount }}</div>
            </div>
            <div class="package-body">
              <h3>{{ pkg.name }}</h3>
              <div class="package-divider"></div>
              
              <div class="purchase-options">
                <button 
                  class="btn-buy coinz-buy" 
                  @click="purchaseWithCoinz(pkg)"
                  :disabled="isProcessing || walletStatus !== 'fresh' || coinz < pkg.price_icoinz"
                  title="Beli dengan iCoinZ"
                >
                  <img src="/images/icoinz.svg" alt="iCoinZ" class="icoinz-icon-small" /> {{ pkg.price_icoinz }}
                </button>
                <div class="or-divider"><span>ATAU</span></div>
                <button 
                  class="btn-buy idr-buy" 
                  :disabled="true" title="Pembayaran energi QRIS menunggu konfirmasi"
                >
                  Rp {{ formatPrice(pkg.price_idr) }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Animation Overlay -->
    <div v-if="showSuccessAnim" class="success-overlay">
      <div class="success-content">
        <img src="/images/icoinz.svg" alt="Success" class="success-icon-img" />
        <h3>Pembelian Berhasil!</h3>
        <p class="energy-gained">+{{ purchasedEnergy }} Energi</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { useUserAccount } from '../composables/useUserAccount'
import confetti from 'canvas-confetti'

const router = useRouter()
const { coinz, fetchUser, fetchWallet, walletStatus, walletInitializationPending, initializeWallet } = useUserAccount()

const packages = ref([])
const isLoading = ref(false)
const isProcessing = ref(false)
const showSuccessAnim = ref(false)
const purchasedEnergy = ref(0)

const fetchPackages = async () => {
  try {
    isLoading.value = true
    const res = await api.get('/shop/packages')
    packages.value = res.data.data
  } catch (error) {
    console.error('Failed to fetch packages:', error.response?.status || 'request_failed')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchPackages()
  fetchWallet()
})

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

const playSuccessAnimation = (energyAmount) => {
  purchasedEnergy.value = energyAmount
  showSuccessAnim.value = true
  
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#f59e0b', '#fbbf24', '#fcd34d']
  })

  setTimeout(() => {
    showSuccessAnim.value = false
  }, 2500)
}

const purchaseWithCoinz = (pkg) => {
  if (coinz.value < pkg.price_icoinz) {
    alert('Saldo iCoinZ kamu tidak cukup.')
    return
  }
  
  router.push({
    path: '/shop/checkout',
    query: {
      pkgId: pkg.id,
      name: pkg.name,
      energy: pkg.energy_amount,
      method: 'coinz',
      price: pkg.price_icoinz
    }
  })
}

const purchaseWithGateway = (pkg) => {
  router.push({
    path: '/shop/checkout',
    query: {
      pkgId: pkg.id,
      name: pkg.name,
      energy: pkg.energy_amount,
      method: 'gateway',
      price: pkg.price_idr
    }
  })
}
</script>

<style scoped>
.shop-view-wrapper {
  min-height: 100vh;
  padding-bottom: 80px;
}

.shop-compact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 50px;
  margin-bottom: 40px;
  padding: 20px 30px;
  background: var(--glass-bg-card-0_8);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
}

.title-with-icon {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon-box {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #fbbf24;
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.15);
}

.header-text-group h1 {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-light);
  margin-bottom: 4px;
}

.header-text-group p {
  font-size: 0.95rem;
  color: var(--text-muted);
}

.wallet-compact-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 30px;
}

.wallet-compact-badge img {
  width: 24px;
  height: 24px;
  filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.4));
}

.coin-amount {
  font-size: 1.3rem;
  font-weight: 800;
  color: #fbbf24;
}

@media (max-width: 768px) {
  .shop-compact-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    padding: 20px;
  }
  .header-content-right {
    width: 100%;
  }
  .wallet-compact-badge {
    justify-content: center;
    width: 100%;
  }
}

.shop-content-section {
  margin-top: 10px;
}

.section-title {
  text-align: center;
  margin-bottom: 40px;
}

.section-title h2 {
  font-size: 2rem;
  color: var(--text-light);
  margin-bottom: 8px;
}

.section-title .subtitle {
  color: var(--text-muted);
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.package-card {
  background: var(--bg-alt);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.package-card:hover {
  transform: translateY(-10px);
  border-color: rgba(245, 158, 11, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(245, 158, 11, 0.1);
}

.package-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  opacity: 0;
  transition: opacity 0.3s;
}
.package-card:hover::before {
  opacity: 1;
}

.package-card-inner {
  padding: 30px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.package-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.package-icon {
  width: 60px;
  height: 60px;
  background: rgba(245, 158, 11, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #fbbf24;
}

.energy-badge {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: #fff;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 1.1rem;
  box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);
}

.package-body h3 {
  color: var(--text-light);
  font-size: 1.4rem;
  margin-bottom: 20px;
}

.package-divider {
  height: 1px;
  background: var(--glass-border);
  margin-bottom: 20px;
}

.purchase-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
}

.btn-buy {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-buy:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.coinz-buy {
  background: rgba(245, 158, 11, 0.1);
  color: #fcd34d;
  border: 1px solid rgba(245, 158, 11, 0.3);
}
.coinz-buy:hover:not(:disabled) {
  background: rgba(245, 158, 11, 0.2);
}

.or-divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.8rem;
  margin: 4px 0;
}
.or-divider::before, .or-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--glass-border);
}
.or-divider span {
  padding: 0 10px;
}

.idr-buy {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: #fff;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
}
.idr-buy:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  text-align: center;
}

.empty-icon-wrapper {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: var(--text-muted);
  margin-bottom: 24px;
}

.empty-state h3 {
  color: var(--text-light);
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.empty-state p {
  color: var(--text-muted);
}

.success-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s;
}

.icoinz-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.icoinz-icon-small {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.icoinz-loading-icon {
  width: 60px;
  height: 60px;
  object-fit: contain;
  animation: floatSpin 2s ease-in-out infinite;
  margin-bottom: 15px;
}

@keyframes floatSpin {
  0% { transform: translateY(0) rotateY(0deg); }
  50% { transform: translateY(-10px) rotateY(180deg); }
  100% { transform: translateY(0) rotateY(360deg); }
}

.success-content {
  text-align: center;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.success-icon-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 20px;
  animation: scalePulse 2s infinite;
  filter: drop-shadow(0 0 20px rgba(245, 158, 11, 0.4));
}
.success-content h3 {
  color: #fff;
  font-size: 2.5rem;
  margin: 0 0 10px;
}
.energy-gained {
  color: #fbbf24;
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0;
  text-shadow: 0 0 30px rgba(245, 158, 11, 0.5);
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes popIn {
  0% { opacity: 0; transform: scale(0.5); }
  70% { transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes scalePulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@media (max-width: 768px) {
  .shop-hero {
    padding: 60px 20px;
  }
  .shop-hero-content h1 {
    font-size: 2.2rem;
  }
  .packages-grid {
    grid-template-columns: 1fr;
  }
}
</style>
