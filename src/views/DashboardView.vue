<script setup>
import { ref } from 'vue'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import DashboardHome from '../components/dashboard/DashboardHome.vue'
import DashboardStats from '../components/dashboard/DashboardStats.vue'
import DashboardMedals from '../components/dashboard/DashboardMedals.vue'
import DashboardSubscription from '../components/dashboard/DashboardSubscription.vue'
import ConfirmModal from '../components/common/ConfirmModal.vue'
import { useUserAccount } from '../composables/useUserAccount'
import { useLearningPaths } from '../composables/useLearningPaths'
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'

const { isLoggedIn, userProfile, credits, maxCredits, isPremiumUser, upgradeToPremium, logout } = useUserAccount()
const { hasFetchedAllPaths, fetchAllPathsDetails } = useLearningPaths()
const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (!hasFetchedAllPaths.value) {
    fetchAllPathsDetails()
  }
  if (route.query.pro_success === '1') {
    showMarketModal.value = true
  }
  
  if (sessionStorage.getItem('just_logged_in') === 'true') {
    sessionStorage.removeItem('just_logged_in')
    if (isLoggedIn.value && !isPremiumUser.value) {
      showPromoModal.value = true
    }
  }
})

const showMarketModal = ref(false)
const showPromoModal = ref(false)

const closePromoModal = () => {
  showPromoModal.value = false
}

const goToSubscription = () => {
  showPromoModal.value = false
  activeTab.value = 'langganan'
}

const closeMarketModal = () => {
  showMarketModal.value = false
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
          <img src="/images/logo-icgamez.png" alt="IC Game Z" class="logo-text-img" />
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
        <div class="credits-indicator" v-if="!isPremiumUser">
          <i class="fa-solid fa-bolt text-warning"></i>
          <span>{{ credits }}</span>
        </div>
        <div class="premium-badge-nav" v-else>
          <i class="fa-solid fa-bolt" style="color: #f59e0b;"></i> PRO
        </div>
        <!-- Removed moon and bell icons here -->
        <button class="btn-upgrade-nav" v-if="!isPremiumUser" @click="activeTab = 'langganan'"><i class="fa-solid fa-arrow-up"></i> Upgrade</button>
        <div class="user-profile-group">
          <div class="user-profile-btn">
            <img :src="userProfile.avatar" alt="Avatar" class="avatar-sm" />
            <span>{{ userProfile.name }}</span>
          </div>
          <button class="btn-logout" @click="handleLogoutClick" title="Logout"><i class="fa-solid fa-right-from-bracket"></i></button>
        </div>
      </div>
    </nav>
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
    
    <!-- IC Market Popup -->
    <div v-if="showMarketModal" class="market-modal-overlay">
      <div class="market-modal-content">
        <i class="fa-solid fa-coins modal-icon-gold"></i>
        <h2>Selamat Anda Mendapatkan Koin!</h2>
        <p>Anda mendapatkan koin ekstra karena telah berhasil berlangganan paket Pro! Koin ini dapat ditukarkan dengan berbagai hadiah menarik di IC Market.</p>
        <a href="https://market.icraftds.id/" target="_blank" class="btn-market">Tukarkan Koin Sekarang?</a>
        <button class="btn-close-modal" @click="closeMarketModal">Tutup</button>
      </div>
    </div>

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
</style>
