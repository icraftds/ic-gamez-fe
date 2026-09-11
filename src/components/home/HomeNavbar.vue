<template>
  <nav class="navbar">
    <div class="nav-left">
      <div class="logo">
        <i class="fa-solid fa-cube text-primary"></i>
        <span>Icraft<span class="text-secondary">DS</span></span>
      </div>
    </div>

    <!-- Hamburger Button (mobile only) -->
    <button class="hamburger" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Toggle menu">
      <i :class="mobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
    </button>

    <!-- Mobile Overlay -->
    <div class="mobile-overlay" :class="{ open: mobileMenuOpen }" @click="mobileMenuOpen = false"></div>

    <!-- Nav Center + Right wrapped for mobile drawer -->
    <div class="nav-drawer" :class="{ open: mobileMenuOpen }">
      <div class="nav-center">
        <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }" @click="mobileMenuOpen = false">Beranda</router-link>
        <router-link to="/learning" class="nav-link" :class="{ active: $route.path.startsWith('/learning') }" @click="mobileMenuOpen = false">Learning Path</router-link>
        <router-link to="/challenges" class="nav-link" :class="{ active: $route.path.startsWith('/challenges') }" @click="mobileMenuOpen = false">Tantangan</router-link>
        <router-link to="/encyclopedia" class="nav-link" :class="{ active: $route.path === '/encyclopedia' }" @click="mobileMenuOpen = false">Ensiklopedia</router-link>
        <router-link to="/leaderboard" class="nav-link" :class="{ active: $route.path === '/leaderboard' }" @click="mobileMenuOpen = false">Leaderboard</router-link>
      </div>

      <div class="nav-right">
        <div class="credits-indicator" v-if="!isPremiumUser">
          <i class="fa-solid fa-bolt text-warning"></i>
          <span>{{ credits }}/{{ maxCredits }}</span>
        </div>
        <div class="premium-badge" v-else>
          <i class="fa-solid fa-crown"></i> PRO
        </div>

        <template v-if="isLoggedIn">
          <router-link to="/dashboard" class="user-profile-btn" @click="mobileMenuOpen = false">
            <img :src="userProfile.avatar" alt="User Avatar" class="avatar-sm">
            <span class="user-name">{{ userProfile.name }}</span>
          </router-link>
          <button class="btn-logout" @click="handleLogoutClick" title="Logout"><i class="fa-solid fa-right-from-bracket"></i></button>
        </template>
        <template v-else>
          <button class="btn-login" @click="login">Masuk</button>
          <button class="btn-register" @click="login">Daftar</button>
        </template>
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
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAccount } from '../../composables/useUserAccount'
import ConfirmModal from '../common/ConfirmModal.vue'

const { credits, maxCredits, isPremiumUser, isLoggedIn, userProfile, login, logout } = useUserAccount()
const router = useRouter()

const showLogoutConfirm = ref(false)
const mobileMenuOpen = ref(false)

const handleLogoutClick = () => {
  showLogoutConfirm.value = true
  mobileMenuOpen.value = false
}

const performLogout = () => {
  logout()
  router.push('/')
}
</script>

<style src="../../assets/css/components/HomeNavbar.css" scoped></style>

