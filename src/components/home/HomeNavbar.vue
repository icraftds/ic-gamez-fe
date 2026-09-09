<template>
  <nav class="navbar">
    <div class="nav-left">
      <div class="logo">
        <i class="fa-solid fa-cube text-primary"></i>
        <span>Icraft<span class="text-secondary">DS</span></span>
      </div>
    </div>
    
    <div class="nav-center">
      <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">Beranda</router-link>
      <router-link to="/learning" class="nav-link" :class="{ active: $route.path.startsWith('/learning') }">Learning Path</router-link>
      <router-link to="/challenges" class="nav-link" :class="{ active: $route.path.startsWith('/challenges') }">Tantangan</router-link>
      <router-link to="/encyclopedia" class="nav-link" :class="{ active: $route.path === '/encyclopedia' }">Ensiklopedia</router-link>
      <router-link to="/leaderboard" class="nav-link" :class="{ active: $route.path === '/leaderboard' }">Leaderboard</router-link>
    </div>

    <div class="nav-right">
      <div class="credits-indicator" v-if="!isPremiumUser">
        <i class="fa-solid fa-bolt text-warning"></i>
        <span>{{ credits }}/{{ maxCredits }}</span>
      </div>
      <div class="premium-badge" v-else>
        <i class="fa-solid fa-crown"></i> PRO
      </div>

      <button class="icon-btn"><i class="fa-solid fa-moon"></i></button>
      
      <template v-if="isLoggedIn">
        <button class="icon-btn"><i class="fa-solid fa-bell"></i></button>
        <router-link to="/dashboard" class="user-profile-btn">
          <img :src="userProfile.avatar" alt="User Avatar" class="avatar-sm">
          <span>{{ userProfile.name }}</span>
        </router-link>
        <button class="btn-logout" @click="handleLogoutClick" title="Logout"><i class="fa-solid fa-right-from-bracket"></i></button>
      </template>
      <template v-else>
        <button class="btn-login" @click="login">Masuk</button>
        <button class="btn-register" @click="login">Daftar</button>
      </template>
    </div>
    <ConfirmModal 
      v-model="showLogoutConfirm"
      title="Konfirmasi Logout"
      message="Apakah Anda yakin ingin keluar dari akun Anda?"
      confirmText="Keluar"
      type="danger"
      @confirm="handleLogoutConfirm"
    />
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useUserAccount } from '../../composables/useUserAccount'
import ConfirmModal from '../common/ConfirmModal.vue'

const { credits, maxCredits, isPremiumUser, isLoggedIn, userProfile, login, logout } = useUserAccount()

const showLogoutConfirm = ref(false)

const handleLogoutClick = () => {
  showLogoutConfirm.value = true
}

const handleLogoutConfirm = () => {
  logout()
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  background: rgba(15, 10, 30, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.text-primary { color: var(--primary); }
.text-secondary { color: var(--secondary); }
.text-warning { color: #f59e0b; }

.nav-center {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: #94a3b8;
  text-decoration: none;
  font-weight: 500;
  padding: 5px 0;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link:hover, .nav-link.active {
  color: white;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  border-radius: 2px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.credits-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 600;
  color: #fcd34d;
}

.premium-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #d97706, #f59e0b);
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  color: white;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
}

.icon-btn, .btn-logout {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.icon-btn:hover, .btn-logout:hover {
  color: white;
}

.user-profile-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: white;
  background: rgba(255, 255, 255, 0.05);
  padding: 5px 15px 5px 5px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.user-profile-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #333;
}

.btn-login {
  background: transparent;
  border: none;
  color: white;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 15px;
}

.btn-register {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.3);
  transition: transform 0.2s ease;
}

.btn-register:hover {
  transform: translateY(-2px);
}
</style>
