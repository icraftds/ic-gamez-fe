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

<style scoped>
.avatar-sm {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid transparent;
}
.border-gold { border-color: #fbbf24; }
.border-blue { border-color: #3b82f6; }
.border-gray { border-color: #9ca3af; }

.user-dropdown-menu {
  position: absolute;
  top: 130%;
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
:global(body.dark-mode) .user-dropdown-menu {
  background: #1f2937;
  border-color: #374151;
}
.dropdown-header {
  display: flex;
  align-items: center;
  padding: 0 16px 12px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 8px;
}
:global(body.dark-mode) .dropdown-header {
  border-bottom-color: #374151;
}
.dropdown-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  border: 2px solid transparent;
}
.dropdown-user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.user-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
:global(body.dark-mode) .user-name { color: #f9fafb; }
.user-name-short {
  color: #111827;
}
:global(body.dark-mode) .user-name-short { color: #f9fafb; }
.user-email {
  font-size: 0.8rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
:global(body.dark-mode) .user-email { color: #9ca3af; }
.dropdown-stats {
  padding: 0 16px 8px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 8px;
}
:global(body.dark-mode) .dropdown-stats { border-bottom-color: #374151; }
.stat-item {
  display: flex;
  align-items: center;
  padding: 6px 0;
  font-size: 0.9rem;
  color: #374151;
  font-weight: 600;
}
:global(body.dark-mode) .stat-item { color: #d1d5db; }
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
:global(body.dark-mode) .dropdown-actions button { color: #d1d5db; }
.dropdown-actions button:hover { background: #f9fafb; }
:global(body.dark-mode) .dropdown-actions button:hover { background: #374151; }
.dropdown-actions button i { width: 20px; margin-right: 8px; }
.dropdown-actions button.text-danger { color: #ef4444; }
.dropdown-actions button.text-danger:hover { background: #fef2f2; }
:global(body.dark-mode) .dropdown-actions button.text-danger:hover { background: rgba(239, 68, 68, 0.1); }
.dropdown-actions button.text-primary { color: #3b82f6; }
.dropdown-actions button.text-primary:hover { background: #eff6ff; }
:global(body.dark-mode) .dropdown-actions button.text-primary:hover { background: rgba(59, 130, 246, 0.1); }
</style>
<style src="../../assets/css/components/HomeNavbar.css" scoped></style>
