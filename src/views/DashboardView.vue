<script setup>
import { ref, computed } from 'vue'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import DashboardHome from '../components/dashboard/DashboardHome.vue'
import DashboardStats from '../components/dashboard/DashboardStats.vue'
import DashboardMedals from '../components/dashboard/DashboardMedals.vue'
import DashboardSubscription from '../components/dashboard/DashboardSubscription.vue'
import ConfirmModal from '../components/common/ConfirmModal.vue'
import CoinzRewardModal from '../components/common/CoinzRewardModal.vue'
import { useUserAccount } from '../composables/useUserAccount'
import { useLearningPaths } from '../composables/useLearningPaths'
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import api from '../services/api'

// Profile modal state
const showProfileModal = ref(false)
const isSavingProfile = ref(false)
const profileForm = ref({
  name: '',
  phone: '',
  avatar: null, // File object
  password: ''
})

const openProfileModal = () => {
  profileForm.value = {
    name: userProfile.value.name,
    phone: userProfile.value.phone || '',
    avatar: null,
    password: ''
  }
  showProfileModal.value = true
}

const handleAvatarChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2 MB')
      e.target.value = ''
      return
    }
    profileForm.value.avatar = file
  }
}

const saveProfile = async () => {
  try {
    isSavingProfile.value = true
    
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('name', profileForm.value.name)
    if (profileForm.value.phone) formData.append('phone', profileForm.value.phone)
    if (profileForm.value.password) formData.append('password', profileForm.value.password)
    if (profileForm.value.avatar) formData.append('avatar', profileForm.value.avatar)

    const response = await api.post('/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    userProfile.value.name = profileForm.value.name
    userProfile.value.phone = profileForm.value.phone
    
    // Update avatar from backend response if exists
    if (response.data && response.data.data && response.data.data.avatar_url) {
      userProfile.value.avatar = response.data.data.avatar_url
    }
    
    showProfileModal.value = false
  } catch (err) {
    alert('Gagal memperbarui profil: ' + (err.response?.data?.message || err.message))
  } finally {
    isSavingProfile.value = false
  }
}

const { isLoggedIn, userProfile, credits, coinz, maxCredits, isPremiumUser, currentPlan, upgradeToPremium, logout, isLoading: isUserLoading } = useUserAccount()

const showUserDropdown = ref(false)

const goToMarket = () => {
  const token = localStorage.getItem('auth_token') || ''
  // Menggunakan VITE_MARKET_URL dari .env (fallback ke default jika tidak ada)
  const marketUrl = import.meta.env.VITE_MARKET_URL || 'https://ic-market.unikom.my.id'
  window.open(`${marketUrl}/auto-login?token=${token}`, '_blank')
}
const handleClickOutside = (e) => {
  if (showUserDropdown.value && !e.target.closest('.dropdown-container')) {
    showUserDropdown.value = false
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
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
  if (route.query.pro_success === '1') {
    // Show CoinZ reward modal instead of old static modal
    showCoinzModal.value = true
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
  activeTab.value = 'langganan'
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
  { id: 'medali', label: 'Medali' },
  { id: 'langganan', label: 'Langganan' }
]
</script>

<template>
  <div class="dashboard-view">
    <SimpleBackground />
    
    <!-- Dashboard Navbar -->
    <nav class="dash-navbar">
      <div class="dash-nav-left">
        <router-link to="/" class="logo">
          <img src="/images/Favicon GameZ.png" alt="IC Game Z Icon" class="logo-icon" />
          <img src="/images/Logo iC GameZ Lightmode.png" alt="IC Game Z" class="logo-text-img logo-light" />
          <img src="/images/Logo iC GameZ darkmode.png" alt="IC Game Z" class="logo-text-img logo-dark" />
        </router-link>

      </div>

      <div class="dash-nav-center">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="dash-tab"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >{{ tab.label }}</button>
      </div>

      <div class="dash-nav-right">
        <div class="coinz-badge">
          <img :src="'/images/icoinz.svg'" alt="iCoinZ" class="coinz-icon" />
          <div class="coinz-info">
            <span class="coinz-label">ICOINZ</span>
            <span class="coinz-amount">
              <i v-if="isUserLoading" class="fa-solid fa-circle-notch fa-spin" style="font-size: 0.9rem; opacity: 0.7;"></i>
              <span v-else>{{ coinz.toLocaleString('id-ID') }}</span>
            </span>
          </div>
        </div>

        <button class="btn-upgrade-nav" v-if="!isPremiumUser" @click="activeTab = 'langganan'"><i class="fa-solid fa-arrow-up"></i> Upgrade</button>
        
        <div class="user-profile-group">
          <div class="dropdown-container" @click="showUserDropdown = !showUserDropdown" style="position: relative; display: flex; align-items: center; cursor: pointer;">
            <div class="user-profile-btn">
              <div style="position: relative;">
                <img :src="userProfile.avatar" alt="Avatar" class="avatar-sm" :class="{'avatar-pro': currentPlan === 'pro', 'avatar-expert': currentPlan === 'expert'}" />

              </div>
              <span style="margin-left: 8px;">{{ userProfile.name.split(' ')[0] }}</span>
              <i class="fa-solid fa-chevron-down" style="margin-left: 8px; font-size: 0.8rem; color: #6b7280;"></i>
            </div>
            
            <!-- User Dropdown Menu -->
            <div v-if="showUserDropdown" class="user-dropdown-menu" @click.stop>
              <div class="dropdown-header" @click="openProfileModal" style="cursor: pointer;" title="Edit Profil">
                <img :src="userProfile.avatar" class="dropdown-avatar" :class="{'avatar-pro': currentPlan === 'pro', 'avatar-expert': currentPlan === 'expert'}" />
                <div class="dropdown-user-info">
                  <div class="user-name">{{ userProfile.name }} <i class="fa-solid fa-pen" style="font-size: 0.7rem; color: #9ca3af; margin-left: 4px;"></i></div>
                  <div class="user-email">{{ userProfile.email }}</div>
                </div>
              </div>
              <div class="dropdown-stats">
                <div class="stat-item" title="Level Anda">
                  <i class="fa-solid fa-star text-warning"></i> Lvl {{ userProfile.level }}
                </div>
                <div class="stat-item" title="Total XP Anda">
                  <i class="fa-solid fa-arrow-trend-up text-primary"></i> {{ userProfile.totalXp ?? userProfile.xp }} XP
                </div>
                <div class="stat-item" title="Sisa Energi">
                  <i class="fa-solid fa-bolt text-warning"></i> {{ credits }}
                </div>
              </div>
              <div class="dropdown-actions">
                <button @click="goToMarket" class="text-primary" title="Buka iC-Market">
                  <i class="fa-solid fa-store"></i> Buka iC-Market
                </button>
                <button @click="handleLogoutClick" class="text-danger"><i class="fa-solid fa-right-from-bracket"></i> Keluar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <!-- Profile Edit Modal -->
    <div v-if="showProfileModal" class="modal-backdrop" @click.self="showProfileModal = false">
      <div class="modal-content profile-modal">
        <div class="modal-header">
          <h3>Edit Profil</h3>
          <button class="close-btn" @click="showProfileModal = false"><i class="fa-solid fa-times"></i></button>
        </div>
        <form @submit.prevent="saveProfile" class="profile-form">
          <div class="form-group">
            <label>Foto Profil (Maks 2 MB)</label>
            <input type="file" @change="handleAvatarChange" accept="image/*" class="form-control" style="padding: 8px;">
          </div>
          <div class="form-group">
            <label>Nama Lengkap</label>
            <input type="text" v-model="profileForm.name" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Nomor Telepon</label>
            <input type="text" v-model="profileForm.phone" class="form-control">
          </div>
          <div class="form-group">
            <label>Password Baru (Opsional)</label>
            <input type="password" v-model="profileForm.password" class="form-control" placeholder="Kosongkan jika tidak ingin diubah">
          </div>
          <button type="submit" class="btn-save-profile" :disabled="isSavingProfile">
            {{ isSavingProfile ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </form>
      </div>
    </div>
    <!-- Content -->
    <div class="container dash-content" v-if="isLoggedIn">
      <div v-if="isDataFetching" class="data-fetch-loader">
        <div class="loader-ring"></div>
        <p>Memuat Data Dashboard...</p>
      </div>
      <template v-else>
      <DashboardHome v-if="activeTab === 'beranda'" />
      <DashboardStats v-else-if="activeTab === 'statistik'" />
      <DashboardMedals v-else-if="activeTab === 'medali'" />
      <LeaderboardTable v-else-if="activeTab === 'leaderboard'" :isFullView="true" />
      <DashboardSubscription v-else-if="activeTab === 'langganan'" />
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
  </div>
</template>



<style src="../assets/css/pages/DashboardView.css" scoped></style>
<style scoped>
.market-modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: var(--black-alpha-0_75);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.market-modal-content {
  background: var(--glass-bg-modal-0_95);
  padding: 40px;
  border-radius: 20px;
  max-width: 400px;
  text-align: center;
  border: 1px solid rgba(245, 158, 11, 0.5);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 40px rgba(245, 158, 11, 0.2);
}
.modal-icon-gold {
  font-size: 4rem;
  color: #f59e0b;
  margin-bottom: 20px;
  text-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
}
.market-modal-content h2 {
  color: var(--text-main-hex);
  margin-bottom: 15px;
  font-size: 1.4rem;
}
.market-modal-content p {
  color: var(--text-sub-hex);
  margin-bottom: 25px;
  line-height: 1.6;
}
.btn-market {
  display: block;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  text-decoration: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: bold;
  margin-bottom: 15px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-market:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(245, 158, 11, 0.4);
}
.btn-close-modal {
  background: none;
  border: none;
  color: var(--text-sub-hex);
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;
}
.btn-close-modal:hover {
  color: var(--text-main-hex);
}

.promo-modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: promoFadeIn 0.3s ease-out;
}
.promo-modal-content {
  background: linear-gradient(145deg, #1f2937, #111827);
  padding: 40px 30px;
  border-radius: 20px;
  max-width: 450px;
  text-align: center;
  border: 2px solid #ef4444;
  box-shadow: 0 10px 40px rgba(0,0,0,0.7), 0 0 50px rgba(239, 68, 68, 0.4);
  position: relative;
  overflow: hidden;
  animation: promoPopIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.promo-badge {
  position: absolute;
  top: 25px;
  right: -40px;
  background: #ef4444;
  color: white;
  padding: 5px 45px;
  transform: rotate(45deg);
  font-weight: 900;
  font-size: 0.85rem;
  letter-spacing: 1px;
  box-shadow: 0 2px 10px rgba(239, 68, 68, 0.5);
}
.modal-icon-fire {
  font-size: 5rem;
  background: linear-gradient(to right, #ef4444, #f59e0b);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
  animation: promoPulse 1s infinite alternate;
}
.hard-sell-title {
  color: #fff;
  font-size: 1.8rem;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 15px;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}
.hard-sell-desc {
  color: #cbd5e1;
  font-size: 1.05rem;
  margin-bottom: 15px;
  line-height: 1.5;
}
.hard-sell-desc strong {
  color: #f59e0b;
}
.hard-sell-urgency {
  color: #ef4444;
  font-weight: bold;
  font-size: 0.95rem;
  margin-bottom: 25px;
  animation: promoFlash 2s infinite;
}
.btn-promo-action {
  display: block;
  width: 100%;
  background: linear-gradient(135deg, #ef4444, #b91c1c);
  color: white;
  border: none;
  padding: 16px 20px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 900;
  cursor: pointer;
  margin-bottom: 15px;
  text-transform: uppercase;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}
.btn-promo-action:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.6);
}
@keyframes promoPulse {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}
@keyframes promoFlash {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0.5; }
}
@keyframes promoPopIn {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes promoFadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.profile-modal {
  background: linear-gradient(145deg, #1f2937, #111827);
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 420px;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: promoPopIn 0.3s ease-out;
}
.profile-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 12px;
}
.profile-modal .modal-header h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #f8fafc;
}
.profile-modal .modal-header .close-btn {
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;
  padding: 4px;
}
.profile-modal .modal-header .close-btn:hover {
  color: white;
}
.profile-form .form-group {
  margin-bottom: 20px;
  text-align: left;
}
.profile-form label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #cbd5e1;
}
.profile-form .form-control {
  width: 100%;
  padding: 12px 14px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid #334155;
  border-radius: 8px;
  color: white;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.profile-form .form-control:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}
.profile-form input[type="file"]::file-selector-button {
  background: #334155;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 12px;
  font-weight: 500;
  transition: background 0.2s;
}
.profile-form input[type="file"]::file-selector-button:hover {
  background: #475569;
}
.btn-save-profile {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  margin-top: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-save-profile:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}
.btn-save-profile:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.coinz-badge {
  display: flex;
  align-items: center;
  /* Default: Dark mode style (cyberpunk/glassmorphism) */
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.6));
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 30px;
  border: 1px solid rgba(75, 85, 99, 0.4);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  margin-right: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, border 0.3s ease;
  cursor: default;
}
.coinz-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(96, 165, 250, 0.2);
}
:global(.light-mode) .coinz-badge {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(249, 250, 251, 0.7));
  border: 1px solid rgba(229, 231, 235, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
:global(.light-mode) .coinz-badge:hover {
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.2);
}
.coinz-icon {
  width: 28px;
  height: 28px;
  margin-right: 10px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  transition: transform 0.3s ease;
}
.coinz-badge:hover .coinz-icon {
  transform: scale(1.1) rotate(5deg);
}
.coinz-info {
  display: flex;
  flex-direction: column;
}
.coinz-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: #60a5fa;
  line-height: 1;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
}
:global(.light-mode) .coinz-label {
  color: #3b82f6;
}
.coinz-amount {
  font-size: 1.1rem;
  font-weight: 900;
  color: #f9fafb;
  line-height: 1.2;
  transition: color 0.3s ease;
}
:global(.light-mode) .coinz-amount {
  color: #111827;
}

.badge-pro-avatar {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
  font-size: 0.55rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 8px;
  border: 1px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
}

.user-dropdown-menu {
  position: absolute;
  top: 120%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 250px;
  z-index: 9999;
  border: 1px solid #e5e7eb;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
}
.dropdown-header {
  display: flex;
  align-items: center;
  padding: 0 16px 12px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 8px;
}
.dropdown-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}
.dropdown-user-info {
  display: flex;
  flex-direction: column;
}
.user-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: #111827;
}
.user-email {
  font-size: 0.8rem;
  color: #6b7280;
}
.dropdown-stats {
  padding: 0 16px 8px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 8px;
}
.stat-item {
  display: flex;
  align-items: center;
  padding: 6px 0;
  font-size: 0.9rem;
  color: #374151;
  font-weight: 600;
}
.stat-item i {
  width: 20px;
  margin-right: 8px;
}
.dropdown-actions button {
  width: 100%;
  text-align: left;
  padding: 10px 16px;
  background: transparent;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.dropdown-actions button:hover {
  background: #f9fafb;
}
.dropdown-actions button i {
  width: 20px;
  margin-right: 8px;
}
.dropdown-actions button.text-danger {
  color: #ef4444;
}
.dropdown-actions button.text-danger:hover {
  background: #fef2f2;
}
.dropdown-actions button.text-primary {
  color: #3b82f6;
}
.dropdown-actions button.text-primary:hover {
  background: #eff6ff;
}

@media (max-width: 768px) {
  .coinz-badge {
    padding: 6px 12px;
    margin-right: 8px;
  }
  .coinz-icon {
    width: 22px;
    height: 22px;
    margin-right: 6px;
  }
  .coinz-label {
    font-size: 0.55rem;
  }
  .coinz-amount {
    font-size: 0.95rem;
  }
}
.data-fetch-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: var(--text-sub-hex, #9ca3af);
}
.loader-ring {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spinLoader 1s linear infinite;
  margin-bottom: 20px;
}
@keyframes spinLoader {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.avatar-pro {
  border: 2px solid #3b82f6;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
}
.avatar-expert {
  border: 2px solid #f59e0b;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.6);
}
</style>
