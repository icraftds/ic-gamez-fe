<template>
  <div class="shop-view-wrapper">
    <p v-if="walletStatus !== 'fresh' || walletInitializationPending" role="status" class="wallet-status-msg">
      Saldo belum dapat diperbarui.
      <button class="btn-retry" @click="async () => { await initializeWallet(true); await fetchWallet() }">Coba lagi</button>
    </p>

    <!-- Compact Header -->
    <div class="shop-compact-header container">
      <div class="header-content-left">
        <div class="title-with-icon">
          <div class="header-icon-box">
            <i class="fa-solid fa-store"></i>
          </div>
          <div class="header-text-group">
            <h1>GameZ Black Market</h1>
            <p>Dapatkan tambahan energi dan perlengkapan profil eksklusif.</p>
          </div>
        </div>
      </div>
      <div class="header-content-right">
        <div class="wallet-compact-badge" title="Saldo iCoinZ">
          <img src="/images/icoinz.svg" alt="iCoinZ" class="icoinz-icon" />
          <span class="coin-amount">{{ coinz === null ? '—' : formatPrice(coinz) }}</span>
        </div>
      </div>
    </div>

    <!-- Shop Content -->
    <div class="shop-content-section container">

      <!-- Shop Controls -->
      <div class="shop-controls">
        <!-- TABS -->
        <div class="shop-tabs">
          <button class="shop-tab" :class="{ active: activeTab === 'energy' }" @click="activeTab = 'energy'">
            <CyberEnergy :pkgId="1" :isAnimated="false" style="width: 32px; height: 32px; margin-right: 8px;" /> Energi
          </button>
          <button class="shop-tab" :class="{ active: activeTab === 'border' }" @click="activeTab = 'border'">
            <div style="width: 32px; height: 32px; margin-right: 6px; display: inline-flex; align-items: center; justify-content: center;">
              <CyberBorder tierId="BB1" style="width: 100%; height: 100%;" />
            </div>
            Border Premium
          </button>
          <button class="shop-tab" :class="{ active: activeTab === 'item' }" @click="activeTab = 'item'">
            <i class="fa-solid fa-gift" style="font-size: 24px; margin-right: 8px;"></i> Items
          </button>
        </div>

        <div class="shop-sort">
          <select v-if="activeTab === 'border'" v-model="filterOwnership" class="sort-select" style="margin-right: 10px;">
            <option value="all">Semua</option>
            <option value="not_owned">Belum Dimiliki</option>
            <option value="owned">Dimiliki</option>
          </select>
          <select v-model="sortOrder" class="sort-select">
            <option value="default">Urutan Default</option>
            <option value="asc">Paling Murah</option>
            <option value="desc">Paling Mahal</option>
          </select>
        </div>
      </div>

      <!-- ENERGY TAB -->
      <div v-if="activeTab === 'energy'" class="tab-content energy-tab">
        <div v-if="isLoading" class="loading-state">
          <img src="/images/icoinz.svg" alt="Loading" class="icoinz-loading-icon" />
          <p>Memuat etalase energi...</p>
        </div>

        <div v-else-if="packages.length === 0" class="empty-state">
          <div class="empty-icon-wrapper">
            <i class="fa-solid fa-box-open"></i>
          </div>
          <h3>Toko Energi Sedang Kosong</h3>
          <p>Belum ada paket yang tersedia saat ini. Silakan kembali lagi nanti.</p>
        </div>

        <div v-else class="shop-item-grid">
          <div 
            v-for="pkg in sortedPackages" 
            :key="pkg.id" 
            class="border-shop-card energy-card"
          >
            <div class="border-preview-box" style="flex-direction: column; margin: 5px 0;">
               <div class="energy-giant-icon" style="width: 120px; height: 120px;">
                 <CyberEnergy :pkgId="pkg.id" :isAnimated="true" style="width: 100%; height: 100%;" />
               </div>
               <div class="energy-float-badge">+{{ pkg.energy_amount }} Energi</div>
            </div>
            <div class="border-info-box">
              <h4>{{ pkg.name }}</h4>
              <p class="border-desc">{{ pkg.description || `Mendapatkan tambahan ${pkg.energy_amount} energi secara instan untuk menyelesaikan berbagai challenge.` }}</p>
              
              <div class="border-price-row">
                <span class="price-label">Harga:</span>
                <span class="price-value"><img src="/images/icoinz.svg" class="icoinz-icon-xs"/> {{ formatPrice(pkg.price_icoinz) }}</span>
              </div>
              
              <button class="btn-buy coinz-buy" :class="{ 'disabled-buy': isProcessing || walletStatus !== 'fresh' || coinz < pkg.price_icoinz }" @click="purchaseEnergy(pkg)">
                Beli Energi
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- BORDER TAB -->
      <div v-if="activeTab === 'border'" class="tab-content border-tab">
        <div class="shop-item-grid">
          <div v-for="border in sortedBorders" :key="border.id" class="border-shop-card">
            <div class="border-preview-box" style="margin: 5px 0;">
               <CyberBorder :tierId="border.id" class="shop-border-svg" style="transform: scale(0.95); transform-origin: center;" />
            </div>
            <div class="border-info-box">
              <h4>{{ parseName(border.name) }}</h4>
              <p class="border-desc">{{ border.desc }}</p>
              
              <div class="border-price-row">
                <span class="price-label">Harga:</span>
                <span class="price-value"><img src="/images/icoinz.svg" class="icoinz-icon-xs"/> {{ formatPrice(getBorderPrice(border.id)) }}</span>
              </div>
              
              <button v-if="isBought(border.id)" class="btn-buy btn-bought" disabled>
                <i class="fa-solid fa-check"></i> Dimiliki
              </button>
              <button v-else class="btn-buy coinz-buy" :class="{ 'disabled-buy': coinz < getBorderPrice(border.id) || walletStatus !== 'fresh' }" @click="buyBorder(border.id)">
                Beli Border
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ITEMS TAB -->
      <div v-if="activeTab === 'item'" class="tab-content border-tab">
        <div v-if="isLoading" class="loading-state">
          <img src="/images/icoinz.svg" alt="Loading" class="icoinz-loading-icon" />
          <p>Memuat item...</p>
        </div>
        <div v-else-if="items.length === 0" class="empty-state">
          <div class="empty-icon-wrapper">
            <i class="fa-solid fa-box-open"></i>
          </div>
          <h3>Toko Item Sedang Kosong</h3>
          <p>Belum ada item yang tersedia saat ini.</p>
        </div>
        <div v-else class="shop-item-grid">
          <div v-for="item in items" :key="item.id" class="border-shop-card">
            <div class="border-preview-box" style="margin: 5px 0;">
               <img v-if="item.slug === 'changename-usn'" src="/favicon.png" alt="Icon" style="width: 100px; height: 100px; object-fit: contain;" />
               <i v-else class="fa-solid fa-gift" style="font-size: 5rem; color: #fbbf24;"></i>
            </div>
            <div class="border-info-box">
              <h4>{{ item.name }}</h4>
              <p class="border-desc">{{ item.description }}</p>
              
              <div class="border-price-row">
                <span class="price-label">Harga:</span>
                <span class="price-value"><img src="/images/icoinz.svg" class="icoinz-icon-xs"/> {{ formatPrice(item.price) }}</span>
              </div>
              
              <button class="btn-buy coinz-buy" :class="{ 'disabled-buy': isProcessing || walletStatus !== 'fresh' || coinz < item.price }" @click="buyItem(item)">
                Beli Item
              </button>
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
        <p class="energy-gained">{{ successMsg }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { useUserAccount } from '../composables/useUserAccount'
import confetti from 'canvas-confetti'
import { TIERS } from '../utils/tiers.js'
import CyberBorder from '../components/ui/CyberBorder.vue'
import CyberEnergy from '../components/ui/CyberEnergy.vue'

const router = useRouter()
const { coinz, fetchWallet, walletStatus, walletInitializationPending, initializeWallet } = useUserAccount()

const activeTab = ref('energy')
const sortOrder = ref('default')
const filterOwnership = ref('all')
const packages = ref([])
const items = ref([])
const isLoading = ref(false)
const isProcessing = ref(false)

const showSuccessAnim = ref(false)
const successMsg = ref('')

const boughtBorders = ref([])

const borderPrices = {
  'BB1': 15000, 'BB2': 20000, 'BB3': 45000, 'BB4': 65000, 
  'BB5': 50000, 'BB6': 45000, 'BB7': 40000, 'BB8': 50000, 
  'BB9': 55000, 'BB10': 25000, 'BB11': 60000, 'BB12': 35000, 'BB13': 75000
}

const sortedPackages = computed(() => {
  let pkgs = [...packages.value]
  if (sortOrder.value === 'asc') {
    pkgs.sort((a, b) => a.price_icoinz - b.price_icoinz)
  } else if (sortOrder.value === 'desc') {
    pkgs.sort((a, b) => b.price_icoinz - a.price_icoinz)
  }
  return pkgs
})

const sortedBorders = computed(() => {
  let b = TIERS.filter(t => typeof t.id === 'string' && t.id.startsWith('BB'))
  
  if (filterOwnership.value === 'owned') {
    b = b.filter(t => isBought(t.id))
  } else if (filterOwnership.value === 'not_owned') {
    b = b.filter(t => !isBought(t.id))
  }

  if (sortOrder.value === 'asc') {
    b.sort((a, b) => getBorderPrice(a.id) - getBorderPrice(b.id))
  } else if (sortOrder.value === 'desc') {
    b.sort((a, b) => getBorderPrice(b.id) - getBorderPrice(a.id))
  }
  return b
})

const parseName = (name) => {
  if (name.includes(': ')) return name.split(': ')[1]
  return name
}

const getBorderPrice = (id) => borderPrices[id] || 99999

const isBought = (id) => boughtBorders.value.includes(id)

const fetchPackages = async () => {
  try {
    isLoading.value = true
    const [resPackages, resItems] = await Promise.all([
      api.get('/shop/packages'),
      api.get('/shop/items')
    ])
    packages.value = resPackages.data.data
    items.value = resItems.data.data
  } catch (error) {
    console.error('Failed to fetch packages:', error.response?.status || 'request_failed')
  } finally {
    isLoading.value = false
  }
}

const loadBoughtBorders = async () => {
  try {
    const res = await api.get('/user/borders')
    if (res.data.success) {
      boughtBorders.value = res.data.data
    }
  } catch (err) {
    console.error('Failed to load borders', err)
  }
}

onMounted(() => {
  fetchPackages()
  fetchWallet()
  loadBoughtBorders()
})

const formatPrice = (price) => {
  if (price === undefined || price === null) return '0'
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

const playSuccessAnimation = (msg) => {
  successMsg.value = msg
  showSuccessAnim.value = true
  
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#00f0ff', '#ff3887']
  })

  setTimeout(() => {
    showSuccessAnim.value = false
  }, 2500)
}

const purchaseEnergy = (pkg) => {
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

const buyBorder = (id) => {
  const price = getBorderPrice(id)
  if (coinz.value < price) {
    alert('Saldo iCoinZ tidak cukup untuk membeli border ini.')
    return
  }
  
  const b = TIERS.find(t => t.id === id)
  
  router.push({
    path: '/shop/checkout',
    query: {
      pkgId: id,
      name: parseName(b.name),
      energy: 0,
      type: 'border',
      method: 'coinz',
      price: price
    }
  })
}

const buyItem = (item) => {
  if (coinz.value < item.price) {
    alert('Saldo iCoinZ tidak cukup untuk membeli item ini.')
    return
  }
  
  router.push({
    path: '/shop/checkout',
    query: {
      pkgId: item.id,
      name: item.name,
      energy: 0,
      type: 'item',
      method: 'coinz',
      price: item.price
    }
  })
}
</script>

<style scoped>
.shop-view-wrapper {
  min-height: 100vh;
  padding-bottom: 80px;
  background: var(--bg-main-hex);
}

.wallet-status-msg {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  padding: 12px;
  text-align: center;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.btn-retry {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.shop-compact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 50px;
  margin-bottom: 40px;
  padding: 20px 30px;
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
}

.title-with-icon {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon-box {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #A225F8, #FF3887);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #fff;
  box-shadow: 0 4px 15px rgba(255, 56, 135, 0.4);
}

.header-text-group h1 {
  margin: 0 0 5px 0;
  font-size: 1.8rem;
  color: #fff;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.header-text-group p {
  margin: 0;
  color: #94A3B8;
  font-size: 0.95rem;
}

.wallet-compact-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 12px 24px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.1);
}

.icoinz-icon {
  width: 28px;
  height: 28px;
}

.coin-amount {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fcd34d;
  font-family: "Poppins", sans-serif;
}

/* Tabs & Controls */
.shop-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.shop-tabs {
  display: flex;
  gap: 15px;
}

.shop-sort .sort-select {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #fff;
  padding: 12px 20px;
  border-radius: 12px;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition: all 0.3s;
}

.shop-sort .sort-select:hover, .shop-sort .sort-select:focus {
  background: rgba(30, 41, 59, 0.9);
  border-color: rgba(245, 158, 11, 0.4);
}

.shop-sort .sort-select option {
  background: #1e293b;
  color: #fff;
}

.shop-tab {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #94A3B8;
  padding: 12px 30px;
  border-radius: 12px;
  font-family: "Poppins", sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.shop-tab:hover {
  background: rgba(30, 41, 59, 0.9);
  color: #fff;
}

.shop-tab.active {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
}

/* Grids */
.shop-item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

/* Common Card Base */
.border-shop-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.package-card:hover, .border-shop-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

/* Energy Shop Specific */
.energy-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 4px;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  opacity: 0; transition: opacity 0.3s;
}
.energy-card:hover::before { opacity: 1; }

.energy-giant-icon {
  font-size: 5rem;
  color: #fbbf24;
  margin-bottom: 10px;
  text-shadow: 0 0 30px rgba(245, 158, 11, 0.6);
}

.energy-float-badge {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: #000;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 1.1rem;
  font-family: "Poppins", sans-serif;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.5);
}

/* Border Shop Specific */
.border-shop-card {
  display: flex;
  flex-direction: column;
}

.border-shop-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 4px;
  background: linear-gradient(90deg, #A225F8, #FF3887);
  opacity: 0; transition: opacity 0.3s;
}
.border-shop-card:hover::before { opacity: 1; }

.border-preview-box {
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, rgba(30,41,59,0.8) 0%, rgba(15,23,42,1) 100%);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.shop-border-svg {
  width: 140px;
  height: 140px;
  transform: scale(1.4);
}

.border-info-box {
  padding: 25px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.border-info-box h4 {
  margin: 0 0 10px 0;
  font-family: "Poppins", sans-serif;
  font-size: 1.3rem;
  color: #fff;
}

.border-desc {
  font-size: 0.9rem;
  color: #94A3B8;
  line-height: 1.5;
  flex: 1;
  margin-bottom: 20px;
}

.border-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0,0,0,0.2);
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid rgba(255,255,255,0.02);
}

.price-label {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
}

.price-value {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1.2rem;
  font-weight: 800;
  color: #fcd34d;
  font-family: "Poppins", sans-serif;
}

.icoinz-icon-xs {
  width: 20px; height: 20px;
}
.icoinz-icon-small {
  width: 22px; height: 22px;
}

/* Purchase Options */
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
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-buy.disabled-buy, .btn-buy:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.coinz-buy {
  background: rgba(245, 158, 11, 0.15);
  color: #fcd34d;
  border: 1px solid rgba(245, 158, 11, 0.4);
}
.coinz-buy:hover:not(:disabled):not(.disabled-buy) {
  background: rgba(245, 158, 11, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);
}

.idr-buy {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
}
.idr-buy:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-bought {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.or-divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #64748b;
  font-size: 0.8rem;
  margin: 4px 0;
}
.or-divider::before, .or-divider::after {
  content: ''; flex: 1; border-bottom: 1px solid rgba(255,255,255,0.1);
}
.or-divider span {
  padding: 0 10px; font-weight: 600;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  text-align: center;
}

.empty-icon-wrapper {
  width: 100px; height: 100px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 2.5rem; color: #64748b;
  margin-bottom: 20px;
}
.empty-state h3 { color: #fff; margin-bottom: 10px; }
.empty-state p { color: #94A3B8; }

.icoinz-loading-icon {
  width: 50px; height: 50px;
  animation: spin 2s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin { 100% { transform: rotate(360deg); } }

.success-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999;
}

.success-content {
  background: linear-gradient(145deg, #1e293b, #0f172a);
  padding: 50px; border-radius: 24px; text-align: center;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(245, 158, 11, 0.2);
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes popIn {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.success-icon-img {
  width: 80px; height: 80px;
  margin-bottom: 20px;
}

.success-content h3 {
  color: #fff; font-size: 2rem; margin-bottom: 10px;
  font-family: "Poppins", sans-serif;
}

.energy-gained {
  color: #10b981; font-size: 1.5rem; font-weight: 800;
}

@media (max-width: 768px) {
  .shop-compact-header {
    flex-direction: column; gap: 20px; text-align: center;
  }
  .title-with-icon { flex-direction: column; }
  .shop-item-grid { grid-template-columns: 1fr; }
}
</style>
