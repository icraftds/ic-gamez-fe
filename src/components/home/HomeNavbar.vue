<template>
  <nav class="navbar">
    <div class="nav-left">
      <router-link to="/" class="logo">
        <img src="/images/Logo iC GameZ Lightmode.png" alt="IC Game Z" class="logo-text-img logo-light" />
        <img src="/images/Logo iC GameZ darkmode.png" alt="IC Game Z" class="logo-text-img logo-dark" />
      </router-link>
    </div>

    <!-- Mobile Nav Actions (Profile + Hamburger) -->
    <div class="mobile-nav-actions">
      <UserProfileDropdown v-if="isLoggedIn" class="mobile-only-profile" />
      <button
        class="hamburger"
        @click="mobileMenuOpen = !mobileMenuOpen"
        aria-label="Toggle menu"
      >
        <i :class="mobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
      </button>
    </div>

    <!-- Mobile Overlay -->
    <div
      class="mobile-overlay"
      :class="{ open: mobileMenuOpen }"
      @click="mobileMenuOpen = false"
    ></div>

    <!-- Nav Center + Right wrapped for mobile drawer -->
    <div class="nav-drawer" :class="{ open: mobileMenuOpen }">
      <div class="nav-center" ref="navCenter">
        <div class="nav-indicator" :style="indicatorStyle"></div>
        <router-link
          :to="$route.path === '/' ? '/' : '/dashboard'"
          class="nav-link"
          :class="{ active: $route.path === '/' || $route.path.startsWith('/dashboard') }"
          @click="mobileMenuOpen = false"
          >{{ $route.path === '/' ? 'Beranda' : 'Dashboard' }}</router-link
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
          <!-- 1. Upgrade Button (Khusus Free User) -->
          <button v-if="!isPremiumUser" class="nav-btn upgrade-btn" @click="$router.push('/pricing')" title="Upgrade ke Premium">
            <i class="fa-solid fa-crown text-warning"></i> Upgrade
          </button>
          
          <!-- 2. GameZ Shop -->
          <button class="nav-btn shop-btn nav-shop-btn" @click="$router.push('/shop')" title="GameZ Shop (Top Up)" >
            <i class="fa-solid fa-cart-plus"></i>
          </button>
          
          <!-- 3. iCoinz -->
          <div class="nav-coinz" title="Saldo iCoinZ">
            <img src="/images/icoinz.svg" alt="iCoinZ" class="nav-coinz-icon" />
            <i v-if="isLoading" class="fa-solid fa-circle-notch fa-spin" style="margin-left: 4px; font-size: 0.9rem; opacity: 0.7;"></i>
            <span v-else class="nav-coinz-val">{{ coinz === null ? '—' : coinz.toLocaleString('id-ID') }}<small v-if="walletStatus !== 'fresh'"> · belum diperbarui</small></span>
          </div>

          <!-- 4. Profile Dropdown -->
          <UserProfileDropdown class="desktop-only-profile" />
        </template>
        
        <div v-else class="guest-actions" style="display: flex; align-items: center; gap: 15px;">
          <button @click="toggleTheme" class="nav-btn" style="background: transparent; color: var(--text-main-hex); border: 1px solid var(--glass-border); padding: 8px 12px; border-radius: 8px;" :title="isLightMode ? 'Beralih ke Dark Mode' : 'Beralih ke Light Mode'">
            <i :class="isLightMode ? 'fas fa-moon' : 'fas fa-sun'"></i>
          </button>
          <router-link
            to="/login"
            class="btn-login"
            @click="mobileMenuOpen = false"
            >Masuk / Daftar</router-link
          >
        </div>
      </div>
    </div>


  </nav>
</template>

<script setup>
import { ssoEnabled, globalLogoutEnabled } from '../../services/sso';
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserAccount } from "../../composables/useUserAccount";
import { useTheme } from "../../composables/useTheme";
import UserProfileDropdown from "../common/UserProfileDropdown.vue";

const { isLightMode, toggleTheme } = useTheme();

const { credits, maxCredits, isPremiumUser, currentPlan, isLoggedIn, isLoading, userProfile, logout, fetchUser, coinz, walletStatus } =
  useUserAccount();
const router = useRouter();
const route = useRoute();

const mobileMenuOpen = ref(false);

const navCenter = ref(null);
const indicatorStyle = ref({ width: '0px', left: '0px', opacity: 0 });

const updateIndicator = async () => {
  await nextTick();
  if (!navCenter.value) return;
  const activeLink = navCenter.value.querySelector('.nav-link.active');
  if (activeLink) {
    const parentRect = navCenter.value.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    indicatorStyle.value = {
      width: `${linkRect.width}px`,
      left: `${linkRect.left - parentRect.left}px`,
      opacity: 1
    };
  } else {
    indicatorStyle.value.opacity = 0;
  }
};

watch(() => route.path, () => {
  updateIndicator();
});



const handleClickOutside = (e) => {
  if (mobileMenuOpen.value && !e.target.closest('.nav-drawer') && !e.target.closest('.hamburger')) {
    mobileMenuOpen.value = false;
  }
};

const isLandingPage = computed(() => route.path === '/');
const dashboardToggleText = computed(() => isLandingPage.value ? 'Kembali ke Dashboard' : 'Kembali ke Beranda');
const dashboardToggleRoute = computed(() => isLandingPage.value ? '/dashboard' : '/');



onMounted(() => {
  if (isLoggedIn.value) {
    fetchUser();
  }
  document.addEventListener('click', handleClickOutside);
  updateIndicator();
  window.addEventListener('resize', updateIndicator);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', updateIndicator);
});
function goToGlobalLogout() {
  window.location.assign('https://ic-auth.unikom.my.id/logout');
}
</script>



<style scoped src="../../assets/css/components/home/HomeNavbar.css"></style>
