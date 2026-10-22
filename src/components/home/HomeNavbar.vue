<template>
  <header class="navbar-wrapper" :class="{ 'is-scrolled': isScrolled }">
    <nav class="navbar-container">
      <!-- 1. Floating Logo Capsule (Left) -->
      <div class="nav-capsule nav-logo-capsule">
        <router-link to="/" class="logo-link">
          <img src="/images/Logo iC GameZ Lightmode.png" alt="IC Game Z" class="logo-text-img logo-light" />
          <img src="/images/Logo iC GameZ darkmode.png" alt="IC Game Z" class="logo-text-img logo-dark" />
        </router-link>
      </div>

      <!-- 2. Floating Center Navigation Capsule (PERSIS DI TENGAH) -->
      <div class="nav-capsule nav-center-capsule desktop-center-capsule" ref="navCenter">
        <!-- Sliding Active Capsule Background -->
        <div
          class="nav-sliding-pill"
          :class="{ animated: isPillAnimated }"
          :style="pillStyle"
          aria-hidden="true"
        ></div>

        <router-link
          :to="isLoggedIn ? '/dashboard' : '/'"
          class="nav-link"
          :class="{ active: $route.path === '/' || $route.path.startsWith('/dashboard') }"
          @click="handleNavClick"
          >{{ isLoggedIn ? 'Dashboard' : 'Beranda' }}</router-link
        >
        <router-link
          to="/learning"
          class="nav-link"
          :class="{ active: $route.path.startsWith('/learning') }"
          @click="handleNavClick"
          >Alur Belajar</router-link
        >
        <router-link
          to="/challenges"
          class="nav-link"
          :class="{ active: $route.path.startsWith('/challenges') }"
          @click="handleNavClick"
          >Tantangan</router-link
        >
        <router-link
          to="/leaderboard"
          class="nav-link"
          :class="{ active: $route.path === '/leaderboard' }"
          @click="handleNavClick"
          >Leaderboard</router-link
        >
        <router-link
          v-if="!isLoggedIn"
          to="/pricing"
          class="nav-link"
          :class="{ active: $route.path === '/pricing' }"
          @click="handleNavClick"
          >Paket</router-link
        >
      </div>

      <!-- 3. Actions & iCoinz Capsule + Profile Dropdown (Right) -->
      <div class="nav-right-cluster desktop-right-cluster">
        <template v-if="isLoggedIn">
          <!-- Floating Actions Capsule -->
          <div class="nav-capsule nav-actions-capsule">
            <!-- Search Icon Button -->
            <button class="nav-icon-btn" @click="handleSearchClick" aria-label="Cari Tantangan & Modul">
              <i class="fa-solid fa-magnifying-glass"></i>
              <span class="nav-tooltip">Cari Tantangan</span>
            </button>

            <!-- Notifications / Friend Requests Bell with Red Dot -->
            <button class="nav-icon-btn notif-btn" @click="toggleFriendsSidebar" aria-label="Notifikasi & Teman">
              <i class="fa-regular fa-bell"></i>
              <span v-if="hasUnreadRequests" class="notif-red-dot"></span>
              <span class="nav-tooltip">Notifikasi & Teman</span>
            </button>

            <!-- GameZ Shop Button -->
            <button
              class="nav-icon-btn shop-btn"
              :class="{ active: $route.path.startsWith('/shop') }"
              @click="$router.push('/shop')"
              aria-label="GameZ Shop (Top Up)"
            >
              <i class="fa-solid fa-cart-shopping"></i>
              <span class="nav-tooltip">GameZ Shop</span>
            </button>

            <!-- Upgrade Button (Only for Free User) -->
            <button v-if="!isPremiumUser" class="nav-upgrade-pill" @click="$router.push('/pricing')" aria-label="Upgrade ke Premium">
              <i class="fa-solid fa-crown text-warning"></i>
              <span>Upgrade</span>
              <span class="nav-tooltip">Upgrade ke Premium</span>
            </button>

            <!-- iCoinz Display -->
            <div class="nav-coinz-pill" @click="$router.push('/shop')" aria-label="Saldo iCoinZ (Klik untuk Top Up)">
              <img src="/images/icoinz.svg" alt="iCoinZ" class="nav-coinz-icon" />
              <TerminalLoader v-if="isLoading" variant="inline" size="sm" />
              <span v-else class="nav-coinz-val">{{ coinz === null ? '—' : coinz.toLocaleString('id-ID') }}</span>
              <span class="nav-tooltip">Saldo iCoinZ (Top Up)</span>
            </div>
          </div>

          <!-- Profile Dropdown (untouched, preserved as requested) -->
          <div class="nav-profile-wrapper">
            <UserProfileDropdown class="desktop-only-profile" />
          </div>
        </template>

        <template v-else>
          <!-- Guest state -->
          <div class="nav-capsule nav-actions-capsule">
            <button @click="toggleTheme" class="nav-icon-btn" :aria-label="isLightMode ? 'Beralih ke Dark Mode' : 'Beralih ke Light Mode'">
              <i :class="isLightMode ? 'fa-solid fa-moon' : 'fa-solid fa-sun'"></i>
              <span class="nav-tooltip">{{ isLightMode ? 'Mode Gelap' : 'Mode Terang' }}</span>
            </button>
          </div>

          <div class="nav-capsule nav-login-capsule">
            <router-link to="/login" class="nav-login-link">
              Masuk / Daftar
            </router-link>
          </div>
        </template>
      </div>

      <!-- Mobile Actions (Profile + Hamburger) -->
      <div class="mobile-nav-actions">
        <div v-if="isLoggedIn" class="mobile-coinz-pill" @click="$router.push('/shop')" title="Saldo iCoinZ">
          <img src="/images/icoinz.svg" alt="iCoinZ" class="nav-coinz-icon" />
          <span class="nav-coinz-val">{{ coinz === null ? '—' : coinz.toLocaleString('id-ID') }}</span>
        </div>
        <UserProfileDropdown v-if="isLoggedIn" class="mobile-only-profile" />
        <button
          class="hamburger-btn"
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

      <!-- Mobile Drawer -->
      <div class="nav-drawer" :class="{ open: mobileMenuOpen }">
        <div class="nav-capsule nav-center-capsule mobile-center-capsule">
          <router-link
            :to="isLoggedIn ? '/dashboard' : '/'"
            class="nav-link"
            :class="{ active: $route.path === '/' || $route.path.startsWith('/dashboard') }"
            @click="mobileMenuOpen = false"
            >{{ isLoggedIn ? 'Dashboard' : 'Beranda' }}</router-link
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

        <div class="nav-right-cluster mobile-drawer-actions">
          <template v-if="isLoggedIn">
            <div class="nav-capsule nav-actions-capsule">
              <button class="nav-icon-btn" @click="handleSearchClick" title="Cari Tantangan">
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
              <button class="nav-icon-btn notif-btn" @click="toggleFriendsSidebar(); mobileMenuOpen = false" title="Notifikasi & Teman">
                <i class="fa-regular fa-bell"></i>
                <span v-if="hasUnreadRequests" class="notif-red-dot"></span>
              </button>
              <button
                class="nav-icon-btn shop-btn"
                :class="{ active: $route.path.startsWith('/shop') }"
                @click="$router.push('/shop'); mobileMenuOpen = false"
                title="GameZ Shop"
              >
                <i class="fa-solid fa-cart-shopping"></i>
              </button>
              <button v-if="!isPremiumUser" class="nav-upgrade-pill" @click="$router.push('/pricing'); mobileMenuOpen = false">
                <i class="fa-solid fa-crown text-warning"></i>
                <span>Upgrade</span>
              </button>
            </div>
          </template>
          <template v-else>
            <div class="nav-capsule nav-login-capsule">
              <router-link to="/login" class="nav-login-link" @click="mobileMenuOpen = false">
                Masuk / Daftar
              </router-link>
            </div>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ssoEnabled, globalLogoutEnabled } from '../../services/sso';
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserAccount } from "../../composables/useUserAccount";
import { useTheme } from "../../composables/useTheme";
import UserProfileDropdown from "../common/UserProfileDropdown.vue";
import { useFriends } from "../../composables/useFriends";

const { isLightMode, toggleTheme } = useTheme();

const { credits, maxCredits, isPremiumUser, currentPlan, isLoggedIn, isLoading, userProfile, logout, fetchUser, coinz, walletStatus } =
  useUserAccount();
const { toggleFriendsSidebar, hasUnreadRequests } = useFriends();

const router = useRouter();
const route = useRoute();

const mobileMenuOpen = ref(false);
const navCenter = ref(null);
const isScrolled = ref(false);

const pillStyle = ref({
  transform: 'translate3d(0, 0, 0)',
  width: '0px',
  opacity: 0,
});
const isPillAnimated = ref(false);

const updatePill = () => {
  if (!navCenter.value) return;
  const activeEl = navCenter.value.querySelector('.nav-link.active');
  if (activeEl) {
    pillStyle.value = {
      transform: `translate3d(${activeEl.offsetLeft}px, 0, 0)`,
      width: `${activeEl.offsetWidth}px`,
      opacity: 1,
    };
    if (!isPillAnimated.value) {
      setTimeout(() => {
        isPillAnimated.value = true;
      }, 50);
    }
  } else {
    pillStyle.value = {
      ...pillStyle.value,
      opacity: 0,
    };
  }
};

const handleNavClick = (e) => {
  const target = e.currentTarget;
  if (!target || !navCenter.value) return;
  pillStyle.value = {
    transform: `translate3d(${target.offsetLeft}px, 0, 0)`,
    width: `${target.offsetWidth}px`,
    opacity: 1,
  };
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

watch(() => route.path, () => {
  nextTick(() => {
    handleScroll();
    updatePill();
  });
});

watch(isLoggedIn, () => {
  nextTick(() => {
    updatePill();
  });
});

const handleSearchClick = () => {
  mobileMenuOpen.value = false;
  router.push('/challenges');
};

const handleClickOutside = (e) => {
  if (mobileMenuOpen.value && !e.target.closest('.nav-drawer') && !e.target.closest('.hamburger-btn')) {
    mobileMenuOpen.value = false;
  }
};

onMounted(() => {
  if (isLoggedIn.value) {
    fetchUser();
  }
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', updatePill, { passive: true });
  handleScroll();
  nextTick(() => {
    updatePill();
    if (document.fonts) {
      document.fonts.ready.then(updatePill);
    }
  });
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', updatePill);
});
</script>

<style scoped src="../../assets/css/components/home/HomeNavbar.css"></style>
