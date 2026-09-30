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
  avatar_url: '',
  password: ''
})

const openProfileModal = () => {
  profileForm.value = {
    name: userProfile.value.name,
    phone: userProfile.value.phone || '',
    avatar_url: userProfile.value.avatar.includes('dicebear') ? '' : userProfile.value.avatar,
    password: ''
  }
  showProfileModal.value = true
}

const saveProfile = async () => {
  try {
    isSavingProfile.value = true
    const payload = {
      name: profileForm.value.name,
      phone: profileForm.value.phone,
      avatar_url: profileForm.value.avatar_url || null
    }
    if (profileForm.value.password) {
      payload.password = profileForm.value.password
    }
    
    await api.post('/user/profile', payload)
    
    userProfile.value.name = profileForm.value.name
    userProfile.value.phone = profileForm.value.phone
    if (profileForm.value.avatar_url) {
      userProfile.value.avatar = profileForm.value.avatar_url
    }
    
    showProfileModal.value = false
  } catch (err) {
    alert('Gagal memperbarui profil: ' + (err.response?.data?.message || err.message))
  } finally {
    isSavingProfile.value = false
  }
}

const { isLoggedIn, userProfile, credits, maxCredits, isPremiumUser, currentPlan, upgradeToPremium, logout } = useUserAccount()
const { hasFetchedAllPaths, fetchAllPathsDetails } = useLearningPaths()
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
        <span class="dash-label">DASHBOARD</span>
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
          <img :src="'/images/coin.svg'" alt="iCoinZ" class="coinz-icon" />
          <div class="coinz-info">
            <span class="coinz-label">ICOINZ</span>
            <span class="coinz-amount">{{ credits.toLocaleString('id-ID') }}</span>
          </div>
        </div>
        <!-- Pro badge -->
        <div v-if="currentPlan === 'pro'" class="premium-badge-nav badge-pro-nav">
          <i class="fa-solid fa-rocket"></i> PRO
        </div>
        <!-- Expert badge -->
        <div v-else-if="currentPlan === 'expert'" class="premium-badge-nav badge-expert-nav">
          <i class="fa-solid fa-crown"></i> EXPERT
        </div>
        <!-- Fallback premium badge -->
        <div v-else class="premium-badge-nav">
          <i class="fa-solid fa-bolt" style="color: #f59e0b;"></i> PRO
        </div>
        <!-- Removed moon and bell icons here -->
        <button class="btn-upgrade-nav" v-if="!isPremiumUser" @click="activeTab = 'langganan'"><i class="fa-solid fa-arrow-up"></i> Upgrade</button>
        <div class="user-profile-group">
          <div class="user-profile-btn" @click="openProfileModal" style="cursor: pointer;">
            <img :src="userProfile.avatar" alt="Avatar" class="avatar-sm" />
            <span>{{ userProfile.name.split(' ')[0] }}</span>
          </div>
          <button class="btn-logout" @click="handleLogoutClick" title="Logout"><i class="fa-solid fa-right-from-bracket"></i></button>
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
            <label>Foto Profil (URL)</label>
            <input type="text" v-model="profileForm.avatar_url" class="form-control" placeholder="https://example.com/avatar.jpg">
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
      <DashboardHome v-if="activeTab === 'beranda'" />
      <DashboardStats v-else-if="activeTab === 'statistik'" />
      <DashboardMedals v-else-if="activeTab === 'medali'" />
      <LeaderboardTable v-else-if="activeTab === 'leaderboard'" :isFullView="true" />
      <DashboardSubscription v-else-if="activeTab === 'langganan'" />
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
  background: #111827;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  color: white;
  border: 1px solid #1f2937;
}
.profile-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.profile-modal .modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
}
.profile-form .form-group {
  margin-bottom: 16px;
}
.profile-form label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #9ca3af;
}
.profile-form .form-control {
  width: 100%;
  padding: 10px 12px;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 6px;
  color: white;
}
.profile-form .form-control:focus {
  outline: none;
  border-color: #6366f1;
}
.btn-save-profile {
  width: 100%;
  padding: 12px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}
.btn-save-profile:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.coinz-badge {
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  margin-right: 12px;
}
.coinz-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}
.coinz-info {
  display: flex;
  flex-direction: column;
}
.coinz-label {
  font-size: 0.6rem;
  font-weight: 700;
  color: #3b82f6;
  line-height: 1;
}
.coinz-amount {
  font-size: 0.9rem;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}
</style>
