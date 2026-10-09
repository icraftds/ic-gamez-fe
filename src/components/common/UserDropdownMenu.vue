<template>
  <div class="user-dropdown-menu" @click.stop>
    <div class="dropdown-header" @click="allowProfileEdit ? handleProfileClick() : null" :style="{ cursor: allowProfileEdit ? 'pointer' : 'default' }" :title="allowProfileEdit ? 'Edit Profil' : ''">
      <div class="dropdown-user-info" style="margin-left: 0; align-items: flex-start;">
        <div class="user-name">
          {{ userProfile.name }}
        </div>
        <div class="user-email">{{ userProfile.email }}</div>
      </div>
    </div>
    <div class="dropdown-stats">
      <div class="stat-item" title="Level Anda">
        <CyberLevel style="width: 30px; height: 30px; margin-right: 8px; flex-shrink: 0;" /> Lvl {{ userProfile.level }}
      </div>
      <div class="stat-item" title="Total XP Anda">
        <CyberXp style="width: 30px; height: 30px; margin-right: 8px; flex-shrink: 0;" /> {{ userProfile.totalXp ?? userProfile.xp }} XP
      </div>
      <div class="stat-item" title="Sisa Energi">
        <CyberEnergy :pkgId="1" :isAnimated="false" style="width: 30px; height: 30px; margin-right: 8px; flex-shrink: 0;" /> {{ credits }}
      </div>
    </div>
    <div class="dropdown-actions">
      <button @click="handleDashboardClick" class="text-primary" :disabled="isNavigating">
        <i v-if="isNavigating" class="fa-solid fa-spinner fa-spin"></i>
        <i v-else class="fa-solid fa-chart-pie"></i> 
        {{ dashboardToggleText }}
      </button>
      <button v-if="allowProfileEdit" @click="handleProfileClick" class="text-primary" title="Edit Profil Anda">
        <i class="fa-solid fa-user-pen"></i> Edit Profil
      </button>
      <button @click="toggleTheme" class="text-primary" title="Ganti Tema Warna">
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
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserAccount } from '../../composables/useUserAccount';
import { useTheme } from '../../composables/useTheme';
import { ssoEnabled, globalLogoutEnabled } from '../../services/sso';

const props = defineProps({
  allowProfileEdit: {
    type: Boolean,
    default: true
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

const levelTierId = computed(() => {
  const lvl = userProfile.value?.level || 1;
  if (lvl >= 150) return 7;
  if (lvl >= 125) return 6;
  if (lvl >= 100) return 5;
  if (lvl >= 75) return 4;
  if (lvl >= 50) return 3;
  if (lvl >= 25) return 2;
  return 1;
});

const dashboardToggleText = computed(() => 'Dashboard');
const dashboardToggleRoute = computed(() => '/dashboard');

const isNavigating = ref(false);
const router = useRouter();

const handleDashboardClick = async () => {
  if (isNavigating.value) return;
  isNavigating.value = true;
  if (route.path !== dashboardToggleRoute.value) {
    await router.push(dashboardToggleRoute.value);
  }
  isNavigating.value = false;
  emit('close');
};

const handleProfileClick = () => {
  router.push('/profile/edit');
  emit('close');
};

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
