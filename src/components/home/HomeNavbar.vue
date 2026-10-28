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
            <!-- Dedicated Notifications & Gift Box Page Button -->
            <button
              class="nav-icon-btn notif-btn"
              :class="{ active: $route.path.startsWith('/notifications') }"
              @click="$router.push('/notifications')"
              aria-label="Kotak Pesan & Notifikasi"
            >
              <i class="fa-regular fa-bell"></i>
              <span v-if="hasUnclaimedGifts" class="notif-gift-dot" title="Hadiah iCoinz tersedia!"></span>
              <span v-else-if="hasUnread" class="notif-red-dot" title="Pesan baru belum dibaca"></span>
              <span class="nav-tooltip">Kotak Pesan & Hadiah</span>
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
            <div class="nav-coinz-pill" @click="$router.push('/shop')" :aria-label="`Saldo: ${fullCoinzFormatted} iCoinZ`">
              <img src="/images/icoinz.svg" alt="iCoinZ" class="nav-coinz-icon" />
              <TerminalLoader v-if="isLoading" variant="inline" size="sm" />
              <span v-else class="nav-coinz-val">{{ shortCoinz }}</span>
              <span class="nav-tooltip">{{ fullCoinzFormatted }} iCoinZ</span>
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
        <div v-if="isLoggedIn" class="mobile-coinz-pill" @click="$router.push('/shop')" :title="`Saldo: ${fullCoinzFormatted} iCoinZ`">
          <img src="/images/icoinz.svg" alt="iCoinZ" class="nav-coinz-icon" />
          <span class="nav-coinz-val">{{ shortCoinz }}</span>
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
              <button
                class="nav-icon-btn notif-btn"
                :class="{ active: $route.path.startsWith('/notifications') }"
                @click="$router.push('/notifications'); mobileMenuOpen = false"
                title="Kotak Pesan & Hadiah"
              >
                <i class="fa-regular fa-bell"></i>
                <span v-if="hasUnclaimedGifts" class="notif-gift-dot"></span>
                <span v-else-if="hasUnread" class="notif-red-dot"></span>
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
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserAccount } from "../../composables/useUserAccount";
import { useTheme } from "../../composables/useTheme";
import UserProfileDropdown from "../common/UserProfileDropdown.vue";
import { useNotifications } from "../../composables/useNotifications";

const { isLightMode, toggleTheme } = useTheme();

const { isPremiumUser, isLoggedIn, isLoading, fetchUser, coinz } = useUserAccount();
const { hasUnread, hasUnclaimedGifts, startPolling, stopPolling } = useNotifications();

const formatShortCoinz = (val) => {
  if (val === null || val === undefined) return '—';
  const num = Number(val);
  if (isNaN(num)) return '—';
  if (num >= 1_000_000_000) {
    return `${Math.floor(num / 1_000_000_000)}B`;
  }
  if (num >= 1_000_000) {
    return `${Math.floor(num / 1_000_000)}M`;
  }
  if (num >= 1_000) {
    return `${Math.floor(num / 1_000)}k`;
  }
  return num.toLocaleString('id-ID');
};

const shortCoinz = computed(() => formatShortCoinz(coinz.value));
const fullCoinzFormatted = computed(() => {
  if (coinz.value === null || coinz.value === undefined) return '0';
  const num = Number(coinz.value);
  return isNaN(num) ? '0' : num.toLocaleString('id-ID');
});

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

const handleClickOutside = (e) => {
  if (mobileMenuOpen.value && !e.target.closest('.nav-drawer') && !e.target.closest('.hamburger-btn')) {
    mobileMenuOpen.value = false;
  }
};

watch(isLoggedIn, (logged) => {
  if (logged) {
    startPolling();
  } else {
    stopPolling(true);
  }
});

onMounted(() => {
  if (isLoggedIn.value) {
    fetchUser();
    startPolling();
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
  stopPolling(false);
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', updatePill);
});
</script>

<style scoped src="../../assets/css/components/home/HomeNavbar.css"></style>
