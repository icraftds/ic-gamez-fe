<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div class="modal-header">
        <h2><i class="fa-solid fa-store text-warning"></i> iC-Market</h2>
        <p>Kehabisan energi? Tambah energi kamu untuk terus belajar dan menyelesaikan tantangan!</p>
        
        <div class="wallet-info">
          <div class="wallet-badge coinz-badge">
            <i class="fa-solid fa-coins"></i>
            <span>{{ coinz }} iCoinZ</span>
          </div>
        </div>
      </div>

      <div class="modal-body">
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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api'
import { useUserAccount } from '../../composables/useUserAccount'
import confetti from 'canvas-confetti'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'purchased'])
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

watch(() => props.isOpen, (newVal) => {
  if (newVal && packages.value.length === 0) {
    fetchPackages()
  }
})

const close = () => {
  if (!isProcessing.value) {
    emit('close')
  }
}

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
    emit('purchased', energyAmount) // trigger parent to update UI counter
    close()
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: var(--bg-alt);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(245, 158, 11, 0.15);
  overflow: hidden;
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--white-alpha-0_1);
  border: none;
  color: var(--text-muted);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  transform: rotate(90deg);
}

.modal-header {
  padding: 30px 30px 20px;
  text-align: center;
  border-bottom: 1px solid var(--glass-border);
  background: linear-gradient(180deg, rgba(245,158,11,0.05) 0%, transparent 100%);
}

.modal-header h2 {
  color: var(--text-light);
  font-size: 1.8rem;
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.text-warning { color: #f59e0b; }

.modal-header p {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0 0 20px;
  line-height: 1.5;
}

.wallet-info {
  display: flex;
  justify-content: center;
}

.wallet-badge {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 8px 16px;
  border-radius: 20px;
  color: #fbbf24;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.modal-body {
  padding: 20px 30px 30px;
  overflow-y: auto;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.package-card {
  background: var(--bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 20px;
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
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.1));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #f59e0b;
  margin-bottom: 16px;
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);
}

.package-details h3 {
  color: var(--text-light);
  font-size: 1.1rem;
  margin: 0 0 8px;
}

.energy-amount {
  color: #f59e0b;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 20px;
}

.package-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
}

.btn-buy {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
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
  padding: 40px 0;
  color: var(--text-muted);
  gap: 16px;
}
.empty-state i {
  font-size: 3rem;
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
  border-radius: 20px;
  animation: fadeIn 0.3s;
}

.success-content {
  text-align: center;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.success-icon {
  font-size: 5rem;
  color: #10b981;
  margin-bottom: 20px;
  animation: scalePulse 2s infinite;
}

.success-content h3 {
  color: #fff;
  font-size: 1.8rem;
  margin: 0 0 10px;
}

.energy-gained {
  color: #fbbf24;
  font-size: 2.5rem;
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
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
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

@media (max-width: 640px) {
  .packages-grid {
    grid-template-columns: 1fr;
  }
}
</style>
