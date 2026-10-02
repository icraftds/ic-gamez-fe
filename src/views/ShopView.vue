<template>
  <div class="shop-page">
    <div class="shop-container">
      <div class="shop-header">
        <h2><i class="fa-solid fa-cart-plus text-warning"></i> GameZ Shop</h2>
        <p>Kehabisan energi? Tambah energi kamu untuk terus belajar dan menyelesaikan tantangan!</p>
        
        <div class="wallet-info">
          <div class="wallet-badge coinz-badge">
            <i class="fa-solid fa-coins"></i>
            <span>{{ coinz }} iCoinZ</span>
          </div>
        </div>
      </div>

      <div class="shop-body">
        <div v-if="isLoading" class="loading-state">
          <div class="spinner-large"></div>
          <p>Memuat paket energi...</p>
        </div>

        <div v-else-if="packages.length === 0" class="empty-state">
          <i class="fa-solid fa-box-open"></i>
          <p>Toko sedang kosong saat ini.</p>
        </div>

        <div v-else class="packages-grid">
          <div 
            v-for="pkg in packages" 
            :key="pkg.id" 
            class="package-card"
          >
            <div class="package-icon">
              <i class="fa-solid fa-bolt"></i>
            </div>
            <div class="package-details">
              <h3>{{ pkg.name }}</h3>
              <p class="energy-amount">+{{ pkg.energy_amount }} Energi</p>
            </div>
            <div class="package-actions">
              <button 
                class="btn-buy coinz-buy" 
                @click="purchaseWithCoinz(pkg)"
                :disabled="isProcessing || coinz < pkg.price_icoinz"
              >
                <i class="fa-solid fa-coins"></i> {{ pkg.price_icoinz }}
              </button>
              <button 
                class="btn-buy idr-buy" 
                @click="purchaseWithGateway(pkg)"
                :disabled="isProcessing"
              >
                Rp {{ formatPrice(pkg.price_idr) }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Animation Overlay -->
      <div v-if="showSuccessAnim" class="success-overlay">
        <div class="success-content">
          <i class="fa-solid fa-circle-check success-icon"></i>
          <h3>Pembelian Berhasil!</h3>
          <p class="energy-gained">+{{ purchasedEnergy }} Energi</p>
        </div>
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
const { coinz, fetchUser } = useUserAccount()

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
    console.error('Failed to fetch packages:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchPackages()
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

const purchaseWithCoinz = async (pkg) => {
  if (coinz.value < pkg.price_icoinz) {
    alert('Saldo iCoinZ kamu tidak cukup.')
    return
  }
  
  if (!confirm(`Beli ${pkg.name} dengan ${pkg.price_icoinz} iCoinZ?`)) return

  try {
    isProcessing.value = true
    await api.post('/shop/purchase/coinz', { package_id: pkg.id })
    await fetchUser() // Refresh balance & energy
    playSuccessAnimation(pkg.energy_amount)
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal melakukan pembelian')
  } finally {
    isProcessing.value = false
  }
}

const purchaseWithGateway = async (pkg) => {
  if (!confirm(`Lanjut ke pembayaran Rp ${formatPrice(pkg.price_idr)} untuk ${pkg.name}?`)) return

  try {
    isProcessing.value = true
    const res = await api.post('/shop/purchase/gateway', { 
      package_id: pkg.id,
      payment_method: 'qris' // Default to qris, can be dynamic if you add a selection modal
    })
    
    // Redirect to checkout URL provided by gateway
    const checkoutUrl = res.data.data.checkout_url || res.data.data.payment_url
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    } else {
      alert('Berhasil dibuat, tapi URL pembayaran tidak ditemukan.')
    }
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal membuat transaksi')
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped>
.shop-page {
  min-height: calc(100vh - 140px);
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.shop-container {
  background: var(--bg-alt);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.shop-header {
  padding: 40px 30px 30px;
  text-align: center;
  border-bottom: 1px solid var(--glass-border);
  background: linear-gradient(180deg, rgba(245,158,11,0.05) 0%, transparent 100%);
}

.shop-header h2 {
  color: var(--text-light);
  font-size: 2.2rem;
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.text-warning { color: #f59e0b; }

.shop-header p {
  color: var(--text-muted);
  font-size: 1.05rem;
  margin: 0 0 25px;
  line-height: 1.5;
}

.wallet-info {
  display: flex;
  justify-content: center;
}

.wallet-badge {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 10px 20px;
  border-radius: 20px;
  color: #fbbf24;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
}

.shop-body {
  padding: 30px 40px 40px;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 25px;
}

.package-card {
  background: var(--bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 25px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
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

.package-card:hover {
  transform: translateY(-5px);
  border-color: rgba(245, 158, 11, 0.4);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2), 0 0 20px rgba(245, 158, 11, 0.15);
}

.package-card:hover::before {
  opacity: 1;
}

.package-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.1));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #f59e0b;
  margin-bottom: 20px;
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);
}

.package-details h3 {
  color: var(--text-light);
  font-size: 1.2rem;
  margin: 0 0 8px;
}

.energy-amount {
  color: #f59e0b;
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 25px;
}

.package-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
}

.btn-buy {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
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
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.coinz-buy:hover:not(:disabled) {
  background: rgba(245, 158, 11, 0.25);
}

.idr-buy {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: #fff;
}

.idr-buy:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--secondary), var(--primary));
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Loading & Empty states */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: var(--text-muted);
  gap: 20px;
}
.empty-state i {
  font-size: 4rem;
  opacity: 0.5;
}

/* Success Overlay */
.success-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  animation: fadeIn 0.3s;
}

.success-content {
  text-align: center;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.success-icon {
  font-size: 6rem;
  color: #10b981;
  margin-bottom: 20px;
  animation: scalePulse 2s infinite;
}

.success-content h3 {
  color: #fff;
  font-size: 2rem;
  margin: 0 0 10px;
}

.energy-gained {
  color: #fbbf24;
  font-size: 3rem;
  font-weight: 800;
  margin: 0;
  text-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

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
  .shop-page {
    padding: 20px 10px;
  }
  .shop-body {
    padding: 20px;
  }
  .packages-grid {
    grid-template-columns: 1fr;
  }
}
</style>
