<template>
  <nav class="navbar">
    <div class="nav-left">
      <router-link to="/" class="logo">
        <img src="/images/Logo iC GameZ Lightmode.png" alt="IC Game Z" class="logo-text-img logo-light" />
        <img src="/images/Logo iC GameZ darkmode.png" alt="IC Game Z" class="logo-text-img logo-dark" />
      </router-link>
    </div>

    <!-- Hamburger Button (mobile only) -->
    <button
      class="hamburger"
      @click="mobileMenuOpen = !mobileMenuOpen"
      aria-label="Toggle menu"
    >
      <i :class="mobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
    </button>

    <!-- Mobile Overlay -->
    <div
      class="mobile-overlay"
      :class="{ open: mobileMenuOpen }"
      @click="mobileMenuOpen = false"
    ></div>

    <!-- Nav Center + Right wrapped for mobile drawer -->
    <div class="nav-drawer" :class="{ open: mobileMenuOpen }">
      <div class="nav-center">
        <router-link
          to="/"
          class="nav-link"
          :class="{ active: $route.path === '/' }"
          @click="mobileMenuOpen = false"
          >Beranda</router-link
        >
        <router-link
          to="/learning"
          class="nav-link"
          :class="{ active: $route.path.startsWith('/learning') }"
          @click="mobileMenuOpen = false"
          >Alur Belajar</router-link
        >
        <router-link
          to="/challenges"
          class="nav-link"
          :class="{ active: $route.path.startsWith('/challenges') }"
          @click="mobileMenuOpen = false"
          >Tantangan</router-link
        >
        <router-link
          to="/encyclopedia"
          class="nav-link"
          :class="{ active: $route.path === '/encyclopedia' }"
          @click="mobileMenuOpen = false"
          >Ensiklopedia</router-link
        >
        <router-link
          to="/leaderboard"
          class="nav-link"
          :class="{ active: $route.path === '/leaderboard' }"
          @click="mobileMenuOpen = false"
          >Leaderboard</router-link
        >
        <router-link
          v-if="!isLoggedIn"
          to="/pricing"
          class="nav-link"
          :class="{ active: $route.path === '/pricing' }"
          @click="mobileMenuOpen = false"
          >Paket</router-link
        >
      </div>

      <div class="nav-right">
        <template v-if="isLoggedIn">
          <div class="credits-indicator">
            <i class="fa-solid fa-bolt text-warning"></i>
            <span>{{ credits }}</span>
          </div>

          <div class="dropdown-container" @click="showUserDropdown = !showUserDropdown" style="position: relative; display: flex; align-items: center; cursor: pointer; margin-left: 1rem;">
            <img
              :src="userProfile.avatar"
              :alt="userProfile.name"
              class="avatar-sm"
              :class="avatarBorderClass"
              :title="'Masuk sebagai ' + userProfile.name"
            />
            <span class="user-name-short" style="margin-left: 8px; font-weight: 600;">{{ firstName }}</span>
            <i class="fa-solid fa-chevron-down" style="margin-left: 8px; font-size: 0.8rem; color: #6b7280;"></i>
            
            <div v-if="showUserDropdown" class="user-dropdown-menu" @click.stop>
              <div class="dropdown-header">
                <img :src="userProfile.avatar" class="dropdown-avatar" :class="avatarBorderClass" />
                <div class="dropdown-user-info">
                  <div class="user-name">{{ userProfile.name }}</div>
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
                <button @click="$router.push('/dashboard')"><i class="fa-solid fa-chart-pie"></i> Kembali ke Dashboard</button>
                <button @click="goToMarket" class="text-primary" title="Buka iC-Market"><i class="fa-solid fa-store"></i> Buka iC-Market</button>
                <button @click="handleLogoutClick" class="text-danger"><i class="fa-solid fa-right-from-bracket"></i> Keluar</button>
              </div>
            </div>
          </div>
        </template>
        
        <router-link
          v-else
          to="/login"
          class="btn-login"
          @click="mobileMenuOpen = false"
          >Masuk / Daftar</router-link
        >
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
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserAccount } from "../../composables/useUserAccount";
import ConfirmModal from "../common/ConfirmModal.vue";

const { credits, maxCredits, isPremiumUser, currentPlan, isLoggedIn, userProfile, logout, fetchUser } =
  useUserAccount();
const router = useRouter();

const showLogoutConfirm = ref(false);
const mobileMenuOpen = ref(false);
const showUserDropdown = ref(false);

const firstName = computed(() => {
  if (!userProfile.value || !userProfile.value.name) return '';
  return userProfile.value.name.split(' ')[0];
});

const avatarBorderClass = computed(() => {
  if (currentPlan.value === 'expert') return 'border-gold';
  if (isPremiumUser.value) return 'border-blue';
  return 'border-gray';
});

const goToMarket = () => {
  const token = localStorage.getItem('auth_token') || '';
  const marketUrl = import.meta.env.VITE_MARKET_URL || 'https://ic-market.unikom.my.id';
  window.open(`${marketUrl}/auto-login?token=${token}`, '_blank');
};

const handleClickOutside = (e) => {
  if (showUserDropdown.value && !e.target.closest('.dropdown-container')) {
    showUserDropdown.value = false;
  }
};

const handleLogoutClick = () => {
  showLogoutConfirm.value = true;
  mobileMenuOpen.value = false;
  showUserDropdown.value = false;
};

const performLogout = async () => {
  await logout();
  router.push("/");
};

onMounted(() => {
  if (isLoggedIn.value) {
    fetchUser();
  }
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>


<style src="../../assets/css/components/HomeNavbar.css" scoped></style>

<style scoped src="../../assets/css/components/home/HomeNavbar.css"></style>
