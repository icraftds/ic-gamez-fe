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
            <i class="fa-solid fa-layer-group tab-icon"></i>
            <span>Modul Belajar</span>
          </button>
          <button class="shop-tab" :class="{ active: activeTab === 'energy' }" @click="activeTab = 'energy'">
            <CyberEnergy :pkgId="1" :isAnimated="false" class="tab-icon-energy" />
            <span>Energi</span>
          </button>
          <button class="shop-tab" :class="{ active: activeTab === 'border' }" @click="activeTab = 'border'">
            <div class="tab-icon-border-wrap">
              <CyberBorder tierId="BB1" style="width: 100%; height: 100%;" />
            </div>
            <span>Border Premium</span>
          </button>
          <button class="shop-tab" :class="{ active: activeTab === 'item' }" @click="activeTab = 'item'">
            <i class="fa-solid fa-gift tab-icon"></i>
            <span>Items</span>
          </button>
        </div>

        <div class="shop-sort">
          <select v-if="activeTab === 'border' || activeTab === 'module'" v-model="filterOwnership" class="sort-select filter-select">
            <option value="all">Semua Status</option>
            <option value="not_owned">Belum Dimiliki</option>
            <option value="owned">Dimiliki</option>
          </select>
          <select v-model="sortOrder" class="sort-select order-select">
            <option value="default">Urutan Default</option>
            <option value="asc">Paling Murah</option>
            <option value="desc">Paling Mahal</option>
          </select>
        </div>
      </div>

      <!-- MODULE TAB -->
      <div v-if="activeTab === 'module'" class="tab-content module-tab">
        <div class="module-promo-banner">
          <div class="promo-badge-icon">
            <i class="fa-solid fa-layer-group"></i>
          </div>
          <div class="promo-body">
            <div class="promo-header-row">
              <h3>Akses Alur Belajar Satuan</h3>
              <div class="promo-pills-group">
                <span class="promo-chip price">
                  <img src="/images/icoinz.svg" alt="c" class="icoinz-icon-xs" />
                  {{ formatPrice(moduleMeta.module_default_price) }} / Modul
                </span>
                <span class="promo-chip discount">
                  <i class="fa-solid fa-tags"></i> Diskon {{ moduleMeta.discount_percent }}% (&ge; 2 Modul)
                </span>
                <span class="promo-chip duration">
                  <i class="fa-regular fa-clock"></i> {{ moduleMeta.module_default_duration_days }} Hari
                </span>
              </div>
            </div>
            <p class="promo-note">
              <i class="fa-solid fa-circle-info"></i>
              Pembelian modul satuan hanya menggunakan iCoinZ &amp; membuka materi modul terpilih (tidak termasuk akses Global Challenge).
            </p>
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

        <div v-else class="module-cards-grid">
          <div
            v-for="(mod, idx) in sortedModules"
            :key="mod.id"
            class="module-shop-card"
            :style="{ '--mod-color': getPathThemeColor(mod, idx) }"
            :class="{
              'is-owned': mod.is_unlocked,
              'is-selected': isModuleSelected(mod.id),
              'is-shaking': shakeKey === `mod-${mod.id}`,
              'is-buying': activeBuyingKey === `mod-${mod.id}`
            }"
          >
            <div class="module-card-glow"></div>

            <div class="module-card-header">
              <div class="module-brand-icon">
                <i :class="getPathIconClass(mod)"></i>
              </div>
              <div class="module-header-badges">
                <span class="module-duration-pill">
                  <i class="fa-regular fa-clock"></i> {{ mod.duration_days }} Hari
                </span>
                <span v-if="mod.is_unlocked" class="module-owned-pill">
                  <i class="fa-solid fa-circle-check"></i> {{ formatModuleAccessBadge(mod) }}
                </span>
              </div>
            </div>

            <div class="module-card-body">
              <h4 class="module-title">{{ mod.title }}</h4>
              <div class="module-meta-chips">
                <span><i class="fa-solid fa-book-open"></i> {{ mod.chapters_count || 0 }} Bab</span>
                <span><i class="fa-solid fa-code"></i> {{ mod.lessons_count || 0 }} Materi</span>
              </div>
              <p class="module-desc">{{ mod.description || 'Akses penuh seluruh bab dan materi pada alur belajar ini.' }}</p>
            </div>

            <div class="module-card-footer">
              <div class="module-price-strip">
                <span class="price-label">
                  {{ mod.is_unlocked ? 'Status Akses' : 'Harga Modul' }}
                </span>
                <div v-if="mod.is_unlocked" class="price-unlocked-label">
                  <i class="fa-solid fa-unlock-keyhole"></i> Terbuka
                </div>
                <div v-else class="module-price-values">
                  <span
                    v-if="isModuleSelected(mod.id) && selectedModuleIds.length >= 2"
                    class="price-original-strike"
                  >
                    {{ formatPrice(mod.price_icoinz) }}
                  </span>
                  <span class="price-value">
                    <img src="/images/icoinz.svg" alt="C" class="icoinz-icon-xs" />
                    {{
                      formatPrice(
                        isModuleSelected(mod.id) && selectedModuleIds.length >= 2
                          ? getDiscountedModulePrice(mod.price_icoinz)
                          : mod.price_icoinz
                      )
                    }}
                  </span>
                  <span
                    v-if="isModuleSelected(mod.id) && selectedModuleIds.length >= 2"
                    class="discount-tag-inline"
                  >
                    -{{ moduleMeta.discount_percent }}%
                  </span>
                </div>
              </div>

              <div v-if="mod.is_unlocked" class="module-card-actions">
                <router-link :to="`/learning/${mod.slug || mod.id}`" class="btn-open-module">
                  <i class="fa-solid fa-play"></i> Buka Modul
                </router-link>
              </div>
              <div v-else class="module-card-actions dual">
                <button
                  type="button"
                  class="btn-select-module"
                  :class="{ active: isModuleSelected(mod.id) }"
                  :disabled="isTransitioningCheckout"
                  @click="toggleModuleSelect(mod.id)"
                >
                  <i :class="isModuleSelected(mod.id) ? 'fa-solid fa-circle-check' : 'fa-solid fa-plus'"></i>
                  <span>{{ isModuleSelected(mod.id) ? 'Dipilih' : 'Pilih' }}</span>
                </button>
                <button
                  type="button"
                  class="btn-buy-module"
                  :disabled="isTransitioningCheckout"
                  @click="checkoutSingleModule(mod)"
                >
                  <template v-if="activeBuyingKey === `mod-${mod.id}`">
                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                    <span>Memproses...</span>
                  </template>
                  <template v-else>
                    <i class="fa-solid fa-bag-shopping"></i>
                    <span>Beli</span>
                  </template>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sticky Multi-Buy Checkout Bar -->
        <Transition name="dock-slide">
          <div v-if="selectedModuleIds.length > 0" class="module-checkout-bar">
            <div class="checkout-bar-summary">
              <div class="selected-count-pill">
                <span class="count-dot">{{ selectedModuleIds.length }}</span>
                <span>Modul Dipilih</span>
                <span v-if="selectedModuleIds.length >= 2" class="discount-applied-badge">
                  <i class="fa-solid fa-sparkles"></i> DISKON {{ moduleMeta.discount_percent }}% AKTIF!
                </span>
                <span v-else class="discount-hint-badge">
                  + Pilih 1 modul lagi untuk diskon {{ moduleMeta.discount_percent }}%
                </span>
              </div>
              <div class="selected-price-breakdown">
                <span v-if="selectedModuleIds.length >= 2" class="subtotal-strike">
                  {{ formatPrice(moduleSubtotal) }} c
                </span>
                <span class="final-total-coinz">
                  <img src="/images/icoinz.svg" alt="C" class="icoinz-icon-xs" />
                  {{ formatPrice(moduleFinalTotal) }} iCoinZ
                </span>
              </div>
            </div>
            <div class="checkout-bar-actions">
              <button
                type="button"
                class="btn-clear-modules"
                :disabled="isTransitioningCheckout"
                @click="selectedModuleIds = []"
              >
                Reset
              </button>
              <button
                type="button"
                class="btn-checkout-modules"
                :disabled="isTransitioningCheckout"
                @click="checkoutSelectedModules"
              >
                <template v-if="activeBuyingKey === 'mod-bundle'">
                  <i class="fa-solid fa-circle-notch fa-spin"></i>
                  <span>Menyiapkan Checkout...</span>
                </template>
                <template v-else>
                  <i class="fa-solid fa-bolt"></i>
                  <span>Bayar Sekarang</span>
                </template>
              </button>
            </div>
          </div>
        </Transition>
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
            <div class="border-preview-box energy-preview-box">
               <div class="energy-giant-icon">
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
              
              <button
                class="btn-buy coinz-buy"
                :class="{ 'disabled-buy': isProcessing || isTransitioningCheckout || walletStatus !== 'fresh' || coinz < pkg.price_icoinz }"
                :disabled="isTransitioningCheckout"
                @click="purchaseEnergy(pkg)"
              >
                <template v-if="activeBuyingKey === `energy-${pkg.id}`">
                  <i class="fa-solid fa-circle-notch fa-spin"></i> Menyiapkan...
                </template>
                <template v-else>Beli Energi</template>
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
              <button
                v-else
                class="btn-buy coinz-buy"
                :class="{ 'disabled-buy': isTransitioningCheckout || coinz < getBorderPrice(border.id) || walletStatus !== 'fresh' }"
                :disabled="isTransitioningCheckout"
                @click="buyBorder(border.id)"
              >
                <template v-if="activeBuyingKey === `border-${border.id}`">
                  <i class="fa-solid fa-circle-notch fa-spin"></i> Menyiapkan...
                </template>
                <template v-else>Beli Border</template>
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
            <div class="border-preview-box item-preview-box">
               <img v-if="item.image_url" :src="getImageUrl(item.image_url)" alt="Icon" class="item-shop-img" />
               <img v-else-if="item.slug === 'changename-usn'" src="/favicon.png" alt="Icon" class="item-shop-img sm" />
               <i v-else class="fa-solid fa-gift item-gift-icon"></i>
            </div>
            <div class="border-info-box">
              <h4>{{ item.name }}</h4>
              <p class="border-desc">{{ item.description }}</p>
              
              <div class="border-price-row">
                <span class="price-label">Harga:</span>
                <span class="price-value"><img src="/images/icoinz.svg" class="icoinz-icon-xs"/> {{ formatPrice(item.price) }}</span>
              </div>
              
              <button
                class="btn-buy coinz-buy"
                :class="{ 'disabled-buy': isProcessing || isTransitioningCheckout || walletStatus !== 'fresh' || coinz < item.price }"
                :disabled="isTransitioningCheckout"
                @click="buyItem(item)"
              >
                <template v-if="activeBuyingKey === `item-${item.id}`">
                  <i class="fa-solid fa-circle-notch fa-spin"></i> Menyiapkan...
                </template>
                <template v-else>Beli Item</template>
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

    <!-- Checkout Navigation Transition Overlay -->
    <Transition name="fade-overlay">
      <div v-if="isTransitioningCheckout" class="checkout-transition-backdrop" role="status" aria-live="polite">
        <div class="checkout-transition-card">
          <div class="transition-spinner-ring">
            <img src="/images/icoinz.svg" alt="iCoinZ" class="transition-coin-pulse" />
          </div>
          <h3>Menyiapkan Pembayaran</h3>
          <p class="transition-item-name">{{ transitionItemLabel }}</p>
          <div class="transition-progress-track">
            <div class="transition-progress-fill"></div>
          </div>
          <span class="transition-hint">Mengunci transaksi &amp; mengamankan saldo iCoinZ...</span>
        </div>
      </div>
    </Transition>

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
import { getPathThemeColor, getPathIconClass } from '../utils/pathTheme.js'
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
const isTransitioningCheckout = ref(false)
const activeBuyingKey = ref(null)
const transitionItemLabel = ref('')
const shakeKey = ref(null)

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

const getDiscountedModulePrice = (price) => {
  const pct = Number(moduleMeta.value.discount_percent ?? 25)
  return Math.max(0, Math.round((Number(price || 0) * (100 - pct)) / 100))
}

const triggerShake = (key) => {
  shakeKey.value = key
  setTimeout(() => {
    if (shakeKey.value === key) shakeKey.value = null
  }, 450)
}

const navigateWithCheckoutDelay = async (targetRoute, key, itemLabel) => {
  if (isTransitioningCheckout.value) return
  isTransitioningCheckout.value = true
  activeBuyingKey.value = key
  transitionItemLabel.value = itemLabel

  try {
    await new Promise((resolve) => setTimeout(resolve, 900))
    await router.push(targetRoute)
  } finally {
    isTransitioningCheckout.value = false
    activeBuyingKey.value = null
  }
}

const checkoutModulesList = (modsList, triggerKey = 'mod-bundle') => {
  if (!modsList.length || isTransitioningCheckout.value) return
  const subtotal = modsList.reduce((sum, m) => sum + Number(m.price_icoinz || 0), 0)
  const discountPercent = modsList.length >= 2 ? Number(moduleMeta.value.discount_percent ?? 25) : 0
  const discountAmount = Math.round((subtotal * discountPercent) / 100)
  const total = Math.max(0, subtotal - discountAmount)
  const names = modsList.map(m => m.title).join(', ')
  const displayName = modsList.length > 1 ? `${modsList.length} Modul Belajar` : modsList[0].title

  if (Number(coinz.value || 0) < total) {
    triggerShake(triggerKey)
    openInsufficientBalance(
      modsList.length > 1 ? `${modsList.length} Modul (${names})` : names,
      total
    )
    return
  }

  navigateWithCheckoutDelay({
    path: '/shop/checkout',
    query: {
      type: 'module',
      pathIds: modsList.map(m => m.id).join(','),
      name: displayName,
      names,
      durationDays: modsList[0]?.duration_days || moduleMeta.value.module_default_duration_days,
      subtotal,
      discountPercent,
      discountAmount,
      method: 'coinz',
      price: total
    }
  }, triggerKey, displayName)
}

const checkoutSingleModule = (mod) => {
  checkoutModulesList([mod], `mod-${mod.id}`)
}

const checkoutSelectedModules = () => {
  checkoutModulesList(selectedModuleObjects.value, 'mod-bundle')
}

const purchaseEnergy = (pkg) => {
  if (isTransitioningCheckout.value) return
  if (Number(coinz.value || 0) < pkg.price_icoinz) {
    triggerShake(`energy-${pkg.id}`)
    openInsufficientBalance(pkg.name, pkg.price_icoinz)
    return
  }

  navigateWithCheckoutDelay({
    path: '/shop/checkout',
    query: {
      pkgId: pkg.id,
      name: pkg.name,
      energy: pkg.energy_amount,
      method: 'coinz',
      price: pkg.price_icoinz
    }
  }, `energy-${pkg.id}`, `${pkg.name} (+${pkg.energy_amount} Energi)`)
}

const buyBorder = (id) => {
  if (isTransitioningCheckout.value) return
  const price = getBorderPrice(id)
  const b = TIERS.find(t => t.id === id)
  const borderName = b ? parseName(b.name) : `Border ${id}`
  if (Number(coinz.value || 0) < price) {
    triggerShake(`border-${id}`)
    openInsufficientBalance(borderName, price)
    return
  }

  navigateWithCheckoutDelay({
    path: '/shop/checkout',
    query: {
      pkgId: id,
      name: borderName,
      energy: 0,
      type: 'border',
      method: 'coinz',
      price: price
    }
  }, `border-${id}`, borderName)
}

const buyItem = (item) => {
  if (isTransitioningCheckout.value) return
  if (Number(coinz.value || 0) < item.price) {
    triggerShake(`item-${item.id}`)
    openInsufficientBalance(item.name, item.price)
    return
  }

  navigateWithCheckoutDelay({
    path: '/shop/checkout',
    query: {
      pkgId: item.id,
      name: item.name,
      energy: 0,
      type: 'item',
      method: 'coinz',
      price: item.price
    }
  }, `item-${item.id}`, item.name)
}
</script>
<style scoped src="../assets/css/views/ShopView.css"></style>

