<template>
  <div class="dashboard-view">
    <BackgroundEffects :show-orb3="true" />
    
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
          <span>{{ credits }}/{{ maxCredits }}</span>
        </div>
        <div class="premium-badge-nav" v-else>
          <i class="fa-solid fa-crown"></i> PRO
        </div>
        <button class="icon-btn"><i class="fa-solid fa-moon"></i></button>
        <button class="icon-btn"><i class="fa-solid fa-bell"></i></button>
        <button class="btn-upgrade-nav" v-if="!isPremiumUser" @click="upgradeToPremium"><i class="fa-solid fa-arrow-up"></i> Upgrade</button>
        <div class="user-avatar-wrapper">
          <img :src="userProfile.avatar" alt="Avatar" class="avatar-sm" />
        </div>
      </div>
    </nav>

    <!-- Content -->
    <div class="container dash-content" v-if="isLoggedIn">
      <DashboardHome v-if="activeTab === 'beranda'" />
      <DashboardStats v-else-if="activeTab === 'statistik'" />
      <DashboardMedals v-else-if="activeTab === 'medali'" />
      <DashboardLeaderboard v-else-if="activeTab === 'leaderboard'" />
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BackgroundEffects from '../components/common/BackgroundEffects.vue'
import DashboardHome from '../components/dashboard/DashboardHome.vue'
import DashboardStats from '../components/dashboard/DashboardStats.vue'
import DashboardMedals from '../components/dashboard/DashboardMedals.vue'
import DashboardLeaderboard from '../components/dashboard/DashboardLeaderboard.vue'
import DashboardSubscription from '../components/dashboard/DashboardSubscription.vue'
import { useUserAccount } from '../composables/useUserAccount'

const { isLoggedIn, userProfile, credits, maxCredits, isPremiumUser, upgradeToPremium } = useUserAccount()

const activeTab = ref('beranda')

const tabs = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'statistik', label: 'Statistik' },
  { id: 'medali', label: 'Medali' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'langganan', label: 'Langganan' }
]
</script>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  padding-bottom: 50px;
}

/* Dashboard Navbar */
.dash-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 40px;
  background: rgba(15, 10, 30, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.dash-nav-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo {
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: white;
}
.text-primary { color: var(--primary); }
.text-secondary { color: var(--secondary); }

.dash-label {
  color: #475569;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 2px;
  padding-left: 15px;
  border-left: 1px solid rgba(255,255,255,0.1);
}

.dash-nav-center {
  display: flex;
  gap: 5px;
  background: rgba(0,0,0,0.3);
  padding: 4px;
  border-radius: 10px;
}

.dash-tab {
  padding: 8px 18px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}
.dash-tab.active {
  background: #22d3ee;
  color: #0f0a1e;
}
.dash-tab:hover:not(.active) {
  color: white;
  background: rgba(255,255,255,0.05);
}

.dash-nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.text-warning { color: #f59e0b; }

.credits-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 5px 10px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  color: #fcd34d;
}

.premium-badge-nav {
  display: flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(135deg, #d97706, #f59e0b);
  padding: 5px 10px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.8rem;
  color: white;
}

.icon-btn {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 1.1rem;
  cursor: pointer;
  transition: color 0.2s;
}
.icon-btn:hover { color: white; }

.btn-upgrade-nav {
  padding: 6px 14px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: transform 0.2s;
}
.btn-upgrade-nav:hover { transform: translateY(-1px); }

.avatar-sm {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.1);
  cursor: pointer;
  background: #333;
}

/* Content */
.dash-content {
  margin-top: 30px;
}

.not-logged-in {
  margin-top: 100px;
  display: flex;
  justify-content: center;
}
.card-center {
  text-align: center;
  background: rgba(15, 10, 30, 0.7);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  padding: 60px 50px;
}
.card-center h2 { margin-bottom: 10px; }
.card-center p { color: #94a3b8; margin-bottom: 25px; }
.btn-back {
  display: inline-block;
  padding: 12px 24px;
  background: var(--primary);
  color: white;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
}
</style>
