<script setup>
import { ref, computed } from 'vue'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import DashboardHome from '../components/dashboard/DashboardHome.vue'
import DashboardStats from '../components/dashboard/DashboardStats.vue'
import DashboardMedals from '../components/dashboard/DashboardMedals.vue'
import DashboardSubscription from '../components/dashboard/DashboardSubscription.vue'
import ConfirmModal from '../components/common/ConfirmModal.vue'
import CoinzRewardModal from '../components/common/CoinzRewardModal.vue'
import UserProfileDropdown from '../components/common/UserProfileDropdown.vue'
import { useUserAccount } from '../composables/useUserAccount'
import { useLearningPaths } from '../composables/useLearningPaths'
import { useTheme } from '../composables/useTheme'
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
  { id: 'medali', label: 'Medali' },
  { id: 'langganan', label: 'Langganan' }]
</script>

<template>
  <div class="dashboard-view">
    <SimpleBackground />
    
    <!-- Dashboard Navbar -->
    <nav class="dash-navbar">
      <div class="dash-nav-left">
        <router-link to="/" class="logo">
          <!-- <img src="/images/Favicon GameZ.png" alt="IC Game Z Icon" class="logo-icon" /> -->
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
        <button class="btn-upgrade-nav" v-if="!isPremiumUser" @click="$router.push('/pricing')"><i class="fa-solid fa-crown text-warning"></i> Upgrade</button>
        
        <button class="nav-btn shop-btn nav-shop-btn" @click="$router.push('/shop')" title="GameZ Shop (Top Up)">
          <i class="fa-solid fa-cart-plus"></i>
        </button>

        <div class="coinz-badge">
          <img :src="'/images/icoinz.svg'" alt="iCoinZ" class="coinz-icon" />
          <div class="coinz-info">
            <span class="coinz-label">ICOINZ</span>
            <span class="coinz-amount">
              <i v-if="isUserLoading" class="fa-solid fa-circle-notch fa-spin" style="font-size: 0.9rem; opacity: 0.7;"></i>
              <span v-else>{{ coinz === null ? '—' : coinz.toLocaleString('id-ID') }}<small v-if="walletStatus !== 'fresh'"> · belum diperbarui</small></span>
            </span>
          </div>
        </div>

        <div class="user-profile-group">
          <UserProfileDropdown 
            :allow-profile-edit="true" 
            @open-profile="openProfileModal" 
          />
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
      <DashboardSubscription v-else-if="activeTab === 'langganan'" />
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
  </div>
</template>



<style src="../assets/css/pages/DashboardView.css" scoped></style>

<style scoped src="../assets/css/views/DashboardView.css"></style>
