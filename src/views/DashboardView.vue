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
const { hasFetchedAllPaths, fetchPaths } = useLearningPaths()
const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (!hasFetchedAllPaths.value) {
    fetchPaths()
  }
})

const showLogoutConfirm = ref(false)

const handleLogoutClick = () => {
  showLogoutConfirm.value = true
}

const performLogout = async () => {
  await logout()
  router.push('/')
}

const activeTab = ref(route.query.tab || 'beranda')

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
          <i class="fa-solid fa-cube text-primary"></i>
          <span>Icraft<span class="text-secondary">DS</span></span>
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
        <button class="icon-btn"><i class="fa-solid fa-moon"></i></button>
        <button class="icon-btn"><i class="fa-solid fa-bell"></i></button>
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
  </div>
</template>



<style src="../assets/css/pages/DashboardView.css" scoped></style>
