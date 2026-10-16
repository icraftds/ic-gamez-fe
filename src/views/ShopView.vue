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
               <img v-if="item.image_url" :src="getImageUrl(item.image_url)" alt="Icon" style="width: 200px; height: 200px; object-fit: contain;" />
               <img v-else-if="item.slug === 'changename-usn'" src="/favicon.png" alt="Icon" style="width: 100px; height: 100px; object-fit: contain;" />
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

const getImageUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  const baseUrl = import.meta.env.VITE_BASE_URL || 'https://icgamez.unikom.my.id/api'
  return baseUrl.replace(/\/api\/?$/, '') + url
}

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
<style scoped src="../assets/css/views/ShopView.css"></style>

