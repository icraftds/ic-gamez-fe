<script setup>
import { ref, computed } from 'vue'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import DashboardHome from '../components/dashboard/DashboardHome.vue'
import DashboardStats from '../components/dashboard/DashboardStats.vue'
import DashboardMedals from '../components/dashboard/DashboardMedals.vue'
import DashboardInventory from '../components/dashboard/DashboardInventory.vue'
import PricingView from './PricingView.vue'
import ConfirmModal from '../components/common/ConfirmModal.vue'
import CoinzRewardModal from '../components/common/CoinzRewardModal.vue'
import UserProfileDropdown from '../components/common/UserProfileDropdown.vue'
import { useUserAccount } from '../composables/useUserAccount'
import { useLearningPaths } from '../composables/useLearningPaths'
import { useTheme } from '../composables/useTheme'
import LeaderboardTable from '../components/home/LeaderboardTable.vue'
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import api from '../services/api'


const { isLoggedIn, userProfile, credits, coinz, walletStatus, maxCredits, isPremiumUser, currentPlan, upgradeToPremium, logout, isLoading: isUserLoading } = useUserAccount()
const { isLightMode, toggleTheme } = useTheme()

import { onUnmounted } from 'vue'
const { hasFetchedAllPaths, fetchAllPathsDetails, isLoading: isPathsLoading } = useLearningPaths()
const isDataFetching = computed(() => isPathsLoading.value || isUserLoading.value)
const route = useRoute()
const router = useRouter()

// Determine coinz amount based on current plan
const coinzBonusAmount = computed(() => {
  const plan = currentPlan.value
  if (plan === 'expert') return 300000
  if (plan === 'pro')    return 200000
  return 0
})
const coinzBonusPlan = computed(() => {
  const plan = currentPlan.value
  if (plan === 'expert') return 'expert'
  return 'pro'
})

const showCoinzModal = ref(false)
const showPromoModal = ref(false)

onMounted(() => {
  if (!hasFetchedAllPaths.value) {
    fetchAllPathsDetails()
  }


  if (sessionStorage.getItem('just_logged_in') === 'true') {
    sessionStorage.removeItem('just_logged_in')
    if (isLoggedIn.value && !isPremiumUser.value) {
      showPromoModal.value = true
    }
  }
})

const closePromoModal = () => {
  showPromoModal.value = false
}

const goToSubscription = () => {
  showPromoModal.value = false
  router.push('/pricing')
}

const closeCoinzModal = () => {
  showCoinzModal.value = false
  const newQuery = { ...route.query }
  delete newQuery.pro_success
  router.replace({ query: newQuery })
}

const showLogoutConfirm = ref(false)

const handleLogoutClick = () => {
  showLogoutConfirm.value = true
}

const performLogout = async () => {
  await logout()
  router.push('/')
}

const activeTab = ref(route.query.tab || 'beranda')

import { watch } from 'vue'

watch(() => route.query.tab, (newTab) => {
  if (newTab && newTab !== activeTab.value) {
    activeTab.value = newTab
  }
})

watch(activeTab, (newTab) => {
  if (route.query.tab !== newTab) {
    router.replace({ query: { ...route.query, tab: newTab } })
  }
})

const tabs = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'statistik', label: 'Statistik' },
  { id: 'pencapaian', label: 'Pencapaian' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'langganan', label: 'Langganan' }]

// Mobile bottom nav: Beranda (home) sits in the middle as the raised button.
// Desktop sidebar order stays the same; mobile order is applied via CSS `order`.
const centerTabId = 'beranda'
const mobileTabOrder = ['statistik', 'pencapaian', 'beranda', 'inventory', 'langganan']
const getMobileOrder = (id) => {
  const idx = mobileTabOrder.indexOf(id)
  return idx === -1 ? mobileTabOrder.length : idx
}

const isSidebarCollapsed = ref(false)
const getTabIcon = (id) => {
  if (id === 'beranda') return 'fa-solid fa-house'
  if (id === 'statistik') return 'fa-solid fa-chart-line'
  if (id === 'pencapaian') return 'fa-solid fa-medal'
  if (id === 'inventory') return 'fa-solid fa-box-open'
  if (id === 'langganan') return 'fa-solid fa-crown'
  return 'fa-solid fa-circle'
}
</script>

<template>
  <div class="dashboard-view">
    <SimpleBackground />
    <div class="dash-layout" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <!-- Dashboard Sidebar -->
      <aside class="dash-sidebar" :class="{ 'is-collapsed': isSidebarCollapsed }">
        <div class="sidebar-header">
          <button class="toggle-btn" @click="isSidebarCollapsed = !isSidebarCollapsed" :title="isSidebarCollapsed ? 'Buka Menu' : 'Tutup Menu'">
            <i :class="isSidebarCollapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left'"></i>
          </button>
        </div>
        <div class="sidebar-menu">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :id="`dash-tab-${tab.id}`"
            class="dash-tab-btn"
            :class="{ active: activeTab === tab.id, 'is-center': tab.id === centerTabId }"
            :style="{ '--m-order': getMobileOrder(tab.id) }"
            @click="activeTab = tab.id"
            :title="isSidebarCollapsed ? tab.label : ''"
            :aria-label="tab.label"
          >
            <i :class="getTabIcon(tab.id)"></i>
            <span v-if="!isSidebarCollapsed" class="tab-label">{{ tab.label }}</span>
          </button>
        </div>
      </aside>

      <div class="dash-main-wrapper">
    <!-- Content -->
    <div class="container dash-content" v-if="isLoggedIn">
      <div v-if="isDataFetching" class="data-fetch-loader">
        <div class="loader-ring"></div>
        <p>Memuat Data Dashboard...</p>
      </div>
      <template v-else>
      <DashboardHome v-if="activeTab === 'beranda'" />
      <DashboardStats v-else-if="activeTab === 'statistik'" />
      <DashboardMedals v-else-if="activeTab === 'pencapaian'" />
      <DashboardInventory v-else-if="activeTab === 'inventory'" />
      <PricingView v-else-if="activeTab === 'langganan'" :isEmbedded="true" />
      <LeaderboardTable v-else-if="activeTab === 'leaderboard'" :isFullView="true" />
      </template>
    </div>

    <div v-else class="container not-logged-in">
      <div class="card-center">
        <i class="fa-solid fa-lock" style="font-size: 3rem; color: #475569; margin-bottom: 20px;"></i>
        <h2>Akses Ditolak</h2>
        <p>Anda harus masuk untuk melihat Dashboard.</p>
        <router-link to="/" class="btn-back">Kembali ke Beranda</router-link>
      </div>
    </div>
    <ConfirmModal
      v-model="showLogoutConfirm"
      title="Konfirmasi Keluar"
      message="Apakah Anda yakin ingin keluar dari akun Anda?"
      confirmText="Ya, Keluar"
      type="warning"
      @confirm="performLogout"
    />
    
    <!-- CoinZ Reward Modal -->
    <CoinzRewardModal
      v-model="showCoinzModal"
      :amount="coinzBonusAmount"
      :plan="coinzBonusPlan"
      @close="closeCoinzModal"
    />

    <!-- Promo Modal -->
    <div v-if="showPromoModal" class="promo-modal-overlay">
      <div class="promo-modal-content">
        <div class="promo-badge">PROMO TERBATAS!</div>
        <i class="fa-solid fa-fire modal-icon-fire"></i>
        <h2 class="hard-sell-title">AYO DAPATKAN 1 JUTA MU SEKARANG JUGA!!</h2>
        <p class="hard-sell-desc">Tingkatkan keanggotaanmu menjadi <strong>PRO</strong> dan buka semua fitur eksklusif, kursus premium, dan kesempatan mendapatkan koin jutaan rupiah!</p>
        <p class="hard-sell-urgency">⏳ WAKTU TERBATAS! Jangan biarkan kesempatan ini hilang! ⏳</p>
        <button class="btn-promo-action" @click="goToSubscription">🌟 UPGRADE SEKARANG & KLAIM! 🌟</button>
        <button class="btn-close-modal" @click="closePromoModal">Nanti saja, saya rela rugi</button>
      </div>
    </div>
    
      </div> <!-- End dash-main-wrapper -->
    </div> <!-- End dash-layout -->
  </div>
</template>



<style src="../assets/css/pages/DashboardView.css" scoped></style>
<style scoped src="../assets/css/views/DashboardView.css"></style>

<style scoped>
.dash-layout {
  display: flex;
  min-height: calc(100vh - 75px); 
  position: relative;
}
.dash-sidebar {
  width: 250px;
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding-top: 20px;
  position: fixed;
  top: 75px;
  left: 0;
  bottom: 0;
  z-index: 50;
}
.dash-sidebar::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-right: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
  -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 2%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0.2) 98%, rgba(0,0,0,0) 100%);
  mask-image: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 2%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0.2) 98%, rgba(0,0,0,0) 100%);
}
.dash-sidebar.is-collapsed {
  width: 80px;
}
.sidebar-header {
  display: flex;
  justify-content: flex-end;
  padding: 0 16px 20px;
}
.dash-sidebar.is-collapsed .sidebar-header {
  justify-content: center;
  padding: 0 0 20px;
}
.toggle-btn {
  background: var(--glass-bg-card-0_6, rgba(30, 41, 59, 0.5));
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
  color: var(--text-light, #f1f5f9);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.toggle-btn:hover {
  background: var(--glass-border, rgba(255, 255, 255, 0.2));
}
.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0;
}
.dash-tab-btn {
  background: transparent;
  border: none;
  color: var(--text-muted, #94a3b8);
  padding: 14px 40px;
  border-radius: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
}
.dash-sidebar.is-collapsed .dash-tab-btn {
  justify-content: center;
  padding: 14px 0;
}
.dash-tab-btn:hover {
  background: var(--glass-bg-card-0_6, rgba(255, 255, 255, 0.05));
  color: var(--text-light, white);
}
.dash-tab-btn.active {
  background: linear-gradient(to left, rgba(129, 140, 248, 0.2), transparent);
  color: var(--primary, #818cf8);
  border-left: none;
  border-right: 3px solid var(--primary, #818cf8);
}

.dash-tab-btn i {
  font-size: 1.3rem;
  width: 24px;
  text-align: center;
}
.dash-main-wrapper {
  flex: 1;
  padding: 30px;
  margin-left: 250px;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 100%;
}
.dash-layout.sidebar-collapsed .dash-main-wrapper {
  margin-left: 80px;
}
/* ===== Tablet / Mobile: Bottom Navigation (icons only) ===== */
@media (max-width: 768px) {
  .dash-layout {
    flex-direction: column;
  }

  .dash-sidebar,
  .dash-sidebar.is-collapsed {
    position: fixed;
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100% !important;
    height: calc(64px + env(safe-area-inset-bottom, 0px));
    padding: 0;
    z-index: 90;
    border: none;
  }

  /* Bar background with a curved notch for the center button */
  .dash-sidebar::before {
    background: var(--bg-deep, #050511);
    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.08));
    border-bottom: none;
    border-radius: 24px 24px 0 0;
    box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.4);
    -webkit-mask-image: radial-gradient(circle 40px at 50% 0, rgba(0,0,0,0) 39px, rgba(0,0,0,1) 40px);
    mask-image: radial-gradient(circle 40px at 50% 0, rgba(0,0,0,0) 39px, rgba(0,0,0,1) 40px);
  }

  .sidebar-header {
    display: none;
  }

  .sidebar-menu {
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    height: 64px;
    padding: 0 8px;
    margin-bottom: env(safe-area-inset-bottom, 0px);
    gap: 0;
    overflow: visible;
  }

  .dash-tab-btn,
  .dash-sidebar.is-collapsed .dash-tab-btn {
    flex: 1;
    justify-content: center;
    height: 100%;
    padding: 0;
    gap: 0;
    border: none !important;
    border-radius: 0;
    background: transparent !important;
    color: var(--text-muted, #94a3b8);
    opacity: 0.7;
    overflow: visible;
    order: var(--m-order, 0);
  }

  /* Icons only */
  .dash-tab-btn .tab-label {
    display: none;
  }

  .dash-tab-btn i {
    font-size: 1.35rem;
    transition: transform 0.25s ease, color 0.25s ease;
  }

  .dash-tab-btn:hover {
    opacity: 1;
    color: var(--text-light, #f1f5f9);
  }

  .dash-tab-btn.active {
    opacity: 1;
    color: var(--primary, #818cf8);
  }
  .dash-tab-btn.active i {
    transform: translateY(-2px) scale(1.1);
  }

  /* Raised center button sitting in the notch */
  .dash-tab-btn.is-center,
  .dash-sidebar.is-collapsed .dash-tab-btn.is-center {
    flex: 0 0 58px;
    width: 58px;
    height: 58px;
    margin: 0 10px;
    border-radius: 50%;
    transform: translateY(-32px);
    background: linear-gradient(135deg, var(--primary, #818cf8), #a855f7) !important;
    color: #fff;
    opacity: 1;
    box-shadow: 0 8px 20px rgba(129, 140, 248, 0.45);
  }
  .dash-tab-btn.is-center i {
    font-size: 1.4rem;
  }
  .dash-tab-btn.is-center:hover {
    color: #fff;
    transform: translateY(-34px);
  }
  .dash-tab-btn.is-center.active {
    color: #fff;
    box-shadow: 0 8px 24px rgba(129, 140, 248, 0.6), 0 0 0 4px rgba(129, 140, 248, 0.2);
  }
  .dash-tab-btn.is-center.active i {
    transform: none;
  }

  .dash-main-wrapper,
  .dash-layout.sidebar-collapsed .dash-main-wrapper {
    margin-left: 0;
    padding: 15px;
    /* keep content clear of the bottom nav */
    padding-bottom: calc(110px + env(safe-area-inset-bottom, 0px));
  }
}
</style>
