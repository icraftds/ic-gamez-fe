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
          <button class="shop-tab" :class="{ active: activeTab === 'module' }" @click="activeTab = 'module'">
            <i class="fa-solid fa-layer-group" style="font-size: 20px; margin-right: 8px;"></i> Modul Belajar
          </button>
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
          <select v-if="activeTab === 'border' || activeTab === 'module'" v-model="filterOwnership" class="sort-select" style="margin-right: 10px;">
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

      <!-- MODULE TAB -->
      <div v-if="activeTab === 'module'" class="tab-content module-tab">
        <div class="module-promo-banner">
          <div class="promo-left">
            <span class="promo-pill">
              <i class="fa-solid fa-tags"></i> Diskon Multi-Beli {{ moduleMeta.discount_percent }}%
            </span>
            <p class="promo-text">
              Beli satuan <strong>{{ formatPrice(moduleMeta.module_default_price) }} iCoinZ</strong> (akses {{ moduleMeta.module_default_duration_days }} hari), atau pilih
              <strong>&ge; 2 modul sekaligus</strong> untuk langsung dapat <strong>diskon {{ moduleMeta.discount_percent }}%</strong>!
            </p>
          </div>
          <div class="promo-note">
            <i class="fa-solid fa-circle-info"></i>
            Pembelian modul satuan hanya membuka materi modul terpilih (tidak termasuk akses Global Challenge).
          </div>
        </div>

        <TerminalLoader v-if="isLoading" label="etalase modul" />

        <div v-else-if="sortedModules.length === 0" class="empty-state">
          <div class="empty-icon-wrapper">
            <i class="fa-solid fa-layer-group"></i>
          </div>
          <h3>Belum Ada Modul di Toko</h3>
          <p>Silakan cek kembali nanti atau pilih paket berlangganan.</p>
        </div>

        <div v-else class="shop-item-grid">
          <div
            v-for="mod in sortedModules"
            :key="mod.id"
            class="border-shop-card module-shop-card"
            :class="{
              'is-owned': mod.is_unlocked,
              'is-selected': isModuleSelected(mod.id)
            }"
          >
            <div class="border-preview-box module-preview-box">
              <span class="module-duration-pill">
                <i class="fa-regular fa-clock"></i> {{ mod.duration_days }} Hari
              </span>
              <div class="module-icon-circle">
                <i :class="mod.icon || 'fa-solid fa-book-open'"></i>
              </div>
              <div class="module-meta-chips">
                <span><i class="fa-solid fa-book"></i> {{ mod.chapters_count || 0 }} Bab</span>
                <span><i class="fa-solid fa-code"></i> {{ mod.lessons_count || 0 }} Materi</span>
              </div>
            </div>

            <div class="border-info-box">
              <h4>{{ mod.title }}</h4>
              <p class="border-desc">{{ mod.description || 'Akses penuh seluruh bab dan materi pada alur belajar ini.' }}</p>

              <div class="border-price-row">
                <span class="price-label">Status / Harga</span>
                <span v-if="mod.is_unlocked" class="module-status-tag">
                  {{ formatModuleAccessBadge(mod) }}
                </span>
                <span v-else class="price-val-group">
                  <img src="/images/icoinz.svg" alt="C" class="mini-coin-svg" /> {{ formatPrice(mod.price_icoinz) }}
                </span>
              </div>

              <div v-if="mod.is_unlocked" class="module-card-actions">
                <router-link :to="`/learn/path/${mod.slug || mod.id}`" class="btn-buy-shop btn-open-module">
                  <i class="fa-solid fa-play"></i> Buka Modul
                </router-link>
              </div>
              <div v-else class="module-card-actions dual">
                <button
                  type="button"
                  class="btn-select-module"
                  :class="{ active: isModuleSelected(mod.id) }"
                  @click="toggleModuleSelect(mod.id)"
                >
                  <i :class="isModuleSelected(mod.id) ? 'fa-solid fa-square-check' : 'fa-regular fa-square'"></i>
                  {{ isModuleSelected(mod.id) ? 'Dipilih' : 'Pilih' }}
                </button>
                <button
                  type="button"
                  class="btn-buy-shop"
                  @click="checkoutSingleModule(mod)"
                >
                  Beli
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sticky Multi-Buy Checkout Bar -->
        <div v-if="selectedModuleIds.length > 0" class="module-checkout-bar">
          <div class="checkout-bar-summary">
            <div class="selected-count-pill">
              {{ selectedModuleIds.length }} Modul Dipilih
              <span v-if="selectedModuleIds.length >= 2" class="discount-applied-badge">
                DISKON {{ moduleMeta.discount_percent }}% AKTIF!
              </span>
              <span v-else class="discount-hint-badge">
                Tambah 1 modul lagi untuk diskon {{ moduleMeta.discount_percent }}%
              </span>
            </div>
            <div class="selected-price-breakdown">
              <span v-if="selectedModuleIds.length >= 2" class="subtotal-strike">
                {{ formatPrice(moduleSubtotal) }} c
              </span>
              <span class="final-total-coinz">
                <img src="/images/icoinz.svg" alt="C" class="mini-coin-svg" />
                {{ formatPrice(moduleFinalTotal) }} iCoinZ
              </span>
            </div>
          </div>
          <div class="checkout-bar-actions">
            <button type="button" class="btn-clear-modules" @click="selectedModuleIds = []">
              Reset
            </button>
            <button type="button" class="btn-checkout-modules" @click="checkoutSelectedModules">
              <i class="fa-solid fa-bolt"></i> Bayar Sekarang
            </button>
          </div>
        </div>
      </div>

      <!-- ENERGY TAB -->
      <div v-if="activeTab === 'energy'" class="tab-content energy-tab">
        <TerminalLoader v-if="isLoading" label="etalase energi" />

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
        <TerminalLoader v-if="isLoading" label="item" />
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

    <InsufficientBalanceModal
      v-model="showInsufficientModal"
      :itemName="insufficientPayload.itemName"
      :requiredAmount="insufficientPayload.requiredAmount"
      :currentBalance="Number(coinz || 0)"
      :marketUrl="moduleMeta.market_topup_url || systemConfig.market_topup_url"
      :marketRedirectEnabled="systemConfig.market_redirect_enabled"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'
import { useUserAccount } from '../composables/useUserAccount'
import confetti from 'canvas-confetti'
import { TIERS } from '../utils/tiers.js'
import CyberBorder from '../components/ui/CyberBorder.vue'
import CyberEnergy from '../components/ui/CyberEnergy.vue'
import InsufficientBalanceModal from '../components/shop/InsufficientBalanceModal.vue'
import { useToast } from '../composables/useToast'

const { showToast } = useToast()

const getImageUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  const baseUrl = import.meta.env.VITE_BASE_URL || 'https://icgamez.unikom.my.id/api'
  return baseUrl.replace(/\/api\/?$/, '') + url
}

const router = useRouter()
const route = useRoute()
const {
  coinz,
  fetchWallet,
  walletStatus,
  walletInitializationPending,
  initializeWallet,
  systemConfig,
  fetchPublicConfig
} = useUserAccount()

const activeTab = ref('energy')
const sortOrder = ref('default')
const filterOwnership = ref('all')
const packages = ref([])
const items = ref([])
const modules = ref([])
const selectedModuleIds = ref([])
const moduleMeta = ref({
  module_default_price: 14999,
  discount_percent: 25,
  module_default_duration_days: 30,
  market_topup_url: 'https://market.icraftds.id/topup',
  user_plan: 'free'
})
const isLoading = ref(false)
const isProcessing = ref(false)

const showSuccessAnim = ref(false)
const successMsg = ref('')
const showInsufficientModal = ref(false)
const insufficientPayload = ref({
  itemName: '',
  requiredAmount: 0
})

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

const sortedModules = computed(() => {
  let list = [...modules.value]
  if (filterOwnership.value === 'owned') {
    list = list.filter(m => m.is_unlocked)
  } else if (filterOwnership.value === 'not_owned') {
    list = list.filter(m => !m.is_unlocked)
  }

  if (sortOrder.value === 'asc') {
    list.sort((a, b) => (a.price_icoinz || 0) - (b.price_icoinz || 0))
  } else if (sortOrder.value === 'desc') {
    list.sort((a, b) => (b.price_icoinz || 0) - (a.price_icoinz || 0))
  }
  return list
})

const selectedModuleObjects = computed(() =>
  modules.value.filter(m => selectedModuleIds.value.includes(m.id) && !m.is_unlocked)
)

const moduleSubtotal = computed(() =>
  selectedModuleObjects.value.reduce((sum, m) => sum + Number(m.price_icoinz || 0), 0)
)

const moduleDiscountAmount = computed(() => {
  if (selectedModuleObjects.value.length < 2) return 0
  const pct = Number(moduleMeta.value.discount_percent ?? 25)
  return Math.round((moduleSubtotal.value * pct) / 100)
})

const moduleFinalTotal = computed(() => Math.max(0, moduleSubtotal.value - moduleDiscountAmount.value))

const isModuleSelected = (id) => selectedModuleIds.value.includes(id)

const toggleModuleSelect = (id) => {
  const idx = selectedModuleIds.value.indexOf(id)
  if (idx >= 0) {
    selectedModuleIds.value.splice(idx, 1)
  } else {
    selectedModuleIds.value.push(id)
  }
}

const formatModuleAccessBadge = (mod) => {
  if (mod.access_status === 'expert_full') return 'Full Access (Expert)'
  if (mod.access_status === 'pro_quota') {
    return mod.remaining_days ? `Kuota Pro (${mod.remaining_days}h)` : 'Aktif via Kuota Pro'
  }
  if (mod.access_status === 'owned') {
    return mod.remaining_days ? `Aktif (${mod.remaining_days} hari)` : 'Sudah Dimiliki'
  }
  return 'Gratis'
}

const openInsufficientBalance = (itemName, requiredAmount) => {
  insufficientPayload.value = {
    itemName,
    requiredAmount: Number(requiredAmount || 0)
  }
  showInsufficientModal.value = true
}

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
    const [resPackages, resItems, resModules] = await Promise.all([
      api.get('/shop/packages'),
      api.get('/shop/items'),
      api.get('/shop/modules').catch(() => ({ data: { data: [], meta: null } }))
    ])
    packages.value = resPackages.data.data || []
    items.value = resItems.data.data || []
    modules.value = resModules.data?.data || []
    if (resModules.data?.meta) {
      moduleMeta.value = { ...moduleMeta.value, ...resModules.data.meta }
    }

    const preselectId = Number(route.query.select)
    if (preselectId && !selectedModuleIds.value.includes(preselectId)) {
      const target = modules.value.find(m => Number(m.id) === preselectId && !m.is_unlocked)
      if (target) selectedModuleIds.value.push(target.id)
    }
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
  if (route.query.tab === 'module') {
    activeTab.value = 'module'
  }
  fetchPublicConfig()
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

const checkoutModulesList = (modsList) => {
  if (!modsList.length) return
  const subtotal = modsList.reduce((sum, m) => sum + Number(m.price_icoinz || 0), 0)
  const discountPercent = modsList.length >= 2 ? Number(moduleMeta.value.discount_percent ?? 25) : 0
  const discountAmount = Math.round((subtotal * discountPercent) / 100)
  const total = Math.max(0, subtotal - discountAmount)
  const names = modsList.map(m => m.title).join(', ')

  if (Number(coinz.value || 0) < total) {
    openInsufficientBalance(
      modsList.length > 1 ? `${modsList.length} Modul (${names})` : names,
      total
    )
    return
  }

  router.push({
    path: '/shop/checkout',
    query: {
      type: 'module',
      pathIds: modsList.map(m => m.id).join(','),
      name: modsList.length > 1 ? `${modsList.length} Modul Belajar` : modsList[0].title,
      names,
      durationDays: modsList[0]?.duration_days || moduleMeta.value.module_default_duration_days,
      subtotal,
      discountPercent,
      discountAmount,
      method: 'coinz',
      price: total
    }
  })
}

const checkoutSingleModule = (mod) => {
  checkoutModulesList([mod])
}

const checkoutSelectedModules = () => {
  checkoutModulesList(selectedModuleObjects.value)
}

const purchaseEnergy = (pkg) => {
  if (Number(coinz.value || 0) < pkg.price_icoinz) {
    openInsufficientBalance(pkg.name, pkg.price_icoinz)
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
  const b = TIERS.find(t => t.id === id)
  if (Number(coinz.value || 0) < price) {
    openInsufficientBalance(b ? parseName(b.name) : `Border ${id}`, price)
    return
  }
  
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
  if (Number(coinz.value || 0) < item.price) {
    openInsufficientBalance(item.name, item.price)
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

