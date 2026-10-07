<template>
  <div class="user-dropdown-menu" @click.stop>
    <div class="dropdown-header" @click="emit('open-profile')" :style="{ cursor: allowProfileEdit ? 'pointer' : 'default' }" :title="allowProfileEdit ? 'Edit Profil' : ''">
      <img :src="userProfile.avatar" class="dropdown-avatar" :class="avatarBorderClass" />
      <div class="dropdown-user-info">
        <div class="user-name">
          {{ userProfile.name }}
          <i v-if="allowProfileEdit" class="fa-solid fa-pen" style="font-size: 0.7rem; color: #9ca3af; margin-left: 4px;"></i>
        </div>
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
      <button @click="$router.push(dashboardToggleRoute)">
        <i :class="isLandingPage ? 'fa-solid fa-chart-pie' : 'fa-solid fa-home'"></i> 
        {{ dashboardToggleText }}
      </button>
      <button v-if="allowProfileEdit" @click="emit('open-profile')" title="Edit Profil Anda">
        <i class="fa-solid fa-user-pen"></i> Edit Profil
      </button>
      <button @click="toggleTheme" title="Ganti Tema Warna">
        <i :class="isLightMode ? 'fas fa-moon' : 'fas fa-sun'"></i> 
        {{ isLightMode ? 'Mode Gelap' : 'Mode Terang' }}
      </button>
      <button @click="goToMarket" class="text-primary" title="Buka iC-Market">
        <i class="fa-solid fa-store"></i> Buka iC-Market
      </button>
      <button @click="emit('logout-click')" class="text-danger">
        <i class="fa-solid fa-right-from-bracket"></i> Keluar
      </button>
      <button v-if="globalLogoutEnabled" type="button" @click="goToGlobalLogout" class="text-danger">
        <i class="fa-solid fa-right-from-bracket"></i> Keluar dari semua aplikasi
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserAccount } from '../../composables/useUserAccount';
import { useTheme } from '../../composables/useTheme';
import { ssoEnabled, globalLogoutEnabled } from '../../services/sso';

const props = defineProps({
  allowProfileEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['logout-click', 'open-profile', 'close']);

const route = useRoute();
const { isLightMode, toggleTheme } = useTheme();
const { userProfile, credits, currentPlan, isPremiumUser } = useUserAccount();

const avatarBorderClass = computed(() => {
  if (currentPlan.value === 'expert') return 'border-expert';
  if (currentPlan.value === 'pro' || isPremiumUser.value) return 'border-pro';
  return 'border-gray';
});

const isLandingPage = computed(() => route.path === '/');
const dashboardToggleText = computed(() => isLandingPage.value ? 'Kembali ke Dashboard' : 'Kembali ke Beranda');
const dashboardToggleRoute = computed(() => isLandingPage.value ? '/dashboard' : '/');

const goToMarket = () => {
  const marketUrl = ssoEnabled ? 'https://market.icraftds.id/auth/start?return_to=%2F' : 'https://market.icraftds.id/';
  window.open(marketUrl, '_blank', 'noopener,noreferrer');
  emit('close');
};

const goToGlobalLogout = () => {
  window.location.assign('https://ic-auth.unikom.my.id/logout');
};
</script>

<style scoped src="../../assets/css/components/common/UserDropdownMenu.css"></style>
