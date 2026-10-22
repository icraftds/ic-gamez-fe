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
import { useWipModal } from '../composables/useWipModal'
import LeaderboardTable from '../components/home/LeaderboardTable.vue'
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import api from '../services/api'


const { isLoggedIn, userProfile, credits, coinz, walletStatus, maxCredits, isPremiumUser, currentPlan, upgradeToPremium, logout, isLoading: isUserLoading } = useUserAccount()
const { isLightMode, toggleTheme } = useTheme()
const { showWipModal } = useWipModal()
const setThemeMode = (light) => {
  if (isLightMode.value !== light) toggleTheme()
}

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
    <div class="dash-layout">
      <!-- Floating Modular Sidebar (Matching Image 2) -->
      <aside class="dash-floating-sidebar">
        <!-- 1. Top Capsule: Theme Switcher -->
        <div class="sidebar-capsule capsule-theme">
          <button
            class="sidebar-pill-btn"
            :class="{ active: isLightMode }"
            @click="setThemeMode(true)"
            aria-label="Mode Terang"
          >
            <i class="fa-regular fa-sun"></i>
            <span class="sidebar-tooltip">Mode Terang</span>
          </button>
          <button
            class="sidebar-pill-btn"
            :class="{ active: !isLightMode }"
            @click="setThemeMode(false)"
            aria-label="Mode Gelap"
          >
            <i class="fa-regular fa-moon"></i>
            <span class="sidebar-tooltip">Mode Gelap</span>
          </button>
        </div>

        <!-- 2. Middle Capsule: Navigation Icons (5 tabs sesuai sebelumnya) -->
        <div class="sidebar-capsule capsule-nav">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :id="`dash-tab-${tab.id}`"
            class="sidebar-pill-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
            :aria-label="tab.label"
          >
            <i :class="getTabIcon(tab.id)"></i>
            <span class="sidebar-tooltip">{{ tab.label }}</span>
          </button>
        </div>

        <!-- 3. Bottom Capsule: Help & Logout (matches Image 2 bottom capsule) -->
        <div class="sidebar-capsule capsule-bottom">
          <!-- Help / Question mark circle -->
          <button
            class="sidebar-pill-btn"
            @click="showWipModal = true"
            aria-label="Bantuan & Dukungan"
          >
            <i class="fa-regular fa-circle-question"></i>
            <span class="sidebar-tooltip">Bantuan & Dukungan</span>
          </button>

          <!-- Logout door icon -->
          <button
            class="sidebar-pill-btn logout-pill-btn"
            @click="handleLogoutClick"
            aria-label="Keluar dari Akun"
          >
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span class="sidebar-tooltip">Keluar</span>
          </button>
        </div>
      </aside>

      <div class="dash-main-wrapper">
    <!-- Content -->
    <div class="container dash-content" v-if="isLoggedIn">
      <TerminalLoader v-if="isDataFetching" label="data dashboard" />
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
/* ═══════════════════════════════════════════
   FLOATING MODULAR SIDEBAR (Inspired by Image 2)
   ═══════════════════════════════════════════ */
.dash-layout {
  display: flex;
  min-height: calc(100vh - 86px);
  position: relative;
}

.dash-floating-sidebar {
  position: fixed;
  top: 90px;
  left: 28px;
  bottom: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  z-index: 50;
  width: 52px;
  pointer-events: none;
}

.sidebar-capsule {
  pointer-events: auto;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02);
  border-radius: 9999px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

body:not(.light-mode) .sidebar-capsule {
  background: rgba(18, 22, 34, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.09);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
}

/* 1. Theme Capsule */
.capsule-theme {
  padding: 6px;
  gap: 4px;
}

/* 2. Nav Icons Capsule */
.capsule-nav {
  padding: 12px 6px;
  gap: 14px;
}

/* 3. Bottom Capsule */
.capsule-bottom {
  padding: 8px 6px;
  gap: 8px;
}

/* Sidebar Pill Buttons */
.sidebar-pill-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.sidebar-pill-btn:hover:not(.active) {
  background: rgba(0, 0, 0, 0.05);
  color: #0f172a;
}

body:not(.light-mode) .sidebar-pill-btn {
  color: #94a3b8;
}

body:not(.light-mode) .sidebar-pill-btn:hover:not(.active) {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

/* Active Icon in Nav Capsule: Solid circle (matches Image 2) */
.capsule-nav .sidebar-pill-btn.active {
  background: #111827;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
}

body:not(.light-mode) .capsule-nav .sidebar-pill-btn.active {
  background: #ffffff;
  color: #0b0f19;
  box-shadow: 0 4px 18px rgba(255, 255, 255, 0.3);
}

/* Active Theme Toggle Icon */
.capsule-theme .sidebar-pill-btn.active {
  background: #f1f5f9;
  color: #f59e0b;
}

body:not(.light-mode) .capsule-theme .sidebar-pill-btn.active {
  background: rgba(255, 255, 255, 0.12);
  color: #38bdf8;
}

/* Logout button hover */
.logout-pill-btn:hover {
  color: #ef4444 !important;
}

/* ═══════════════════════════════════════════
   FLOATING GLASS SIDEBAR TOOLTIP
   ═══════════════════════════════════════════ */
.sidebar-tooltip {
  position: absolute;
  left: calc(100% + 14px);
  top: 50%;
  transform: translateY(-50%) translateX(-6px);
  background: #0f172a;
  color: #f8fafc;
  font-family: 'Poppins', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 9999px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              visibility 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 0.05s;
  z-index: 999;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.28), 0 2px 6px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: normal;
}

body:not(.light-mode) .sidebar-tooltip {
  background: rgba(18, 24, 38, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.6), 0 0 12px rgba(56, 189, 248, 0.15);
}

/* Triangle arrow caret pointing left to the button */
.sidebar-tooltip::before {
  content: '';
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-width: 5px 6px 5px 0;
  border-style: solid;
  border-color: transparent #0f172a transparent transparent;
}

body:not(.light-mode) .sidebar-tooltip::before {
  border-color: transparent rgba(18, 24, 38, 0.95) transparent transparent;
}

.sidebar-pill-btn:hover .sidebar-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0);
}

/* Main Content Area */
.dash-main-wrapper {
  flex: 1;
  padding: 24px 32px;
  margin-left: 96px;
  max-width: calc(100% - 96px);
  box-sizing: border-box;
  transition: margin-left 0.3s ease;
}

/* Mobile Responsiveness (≤768px) */
@media (max-width: 768px) {
  .dash-floating-sidebar {
    position: fixed;
    top: auto;
    left: 16px;
    right: 16px;
    bottom: 16px;
    width: auto;
    height: auto;
    flex-direction: row;
    justify-content: center;
    z-index: 99;
  }

  .capsule-theme,
  .capsule-bottom,
  .sidebar-tooltip {
    display: none !important;
  }

  .capsule-nav {
    flex-direction: row;
    padding: 6px 14px;
    gap: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .dash-main-wrapper {
    margin-left: 0;
    max-width: 100%;
    padding: 16px;
    padding-bottom: 90px;
  }
}
</style>
