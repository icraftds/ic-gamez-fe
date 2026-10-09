<template>
  <div class="dropdown-container dropdown-trigger" @click.stop="!isLoading && (showUserDropdown = !showUserDropdown)">
    <template v-if="isLoading">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-name"></div>
    </template>
    <template v-else>
      <div class="avatar-sm avatar-cyber">
        <CyberBorder
          :tierId="borderId"
          :accountBadge="currentBadgeStatus"
          :avatarUrl="userProfile.avatar"
        />
      </div>
    </template>
    
    <UserDropdownMenu 
      v-if="showUserDropdown && !isLoading" 
      :allow-profile-edit="allowProfileEdit"
      @close="showUserDropdown = false" 
      @open-profile="emit('open-profile')"
      @logout-click="handleLogoutClick" 
    />
    
    <ConfirmModal
      v-model="showLogoutConfirm"
      title="Konfirmasi Keluar"
      message="Apakah Anda yakin ingin keluar dari akun Anda?"
      confirmText="Ya, Keluar"
      type="warning"
      @confirm="performLogout"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserAccount } from '../../composables/useUserAccount';
import UserDropdownMenu from './UserDropdownMenu.vue';
import ConfirmModal from './ConfirmModal.vue';
import CyberBorder from '../ui/CyberBorder.vue';

const props = defineProps({
  allowProfileEdit: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['open-profile']);

const { isLoading, userProfile, currentPlan, isPremiumUser, logout, activeBorderId } = useUserAccount();
const router = useRouter();

const showUserDropdown = ref(false);
const showLogoutConfirm = ref(false);

const firstName = computed(() => {
  if (!userProfile.value || !userProfile.value.name) return '';
  return userProfile.value.name.split(' ')[0];
});

const currentBadgeStatus = computed(() => {
  if (currentPlan.value === 'expert') return 'EXPERT';
  if (currentPlan.value === 'pro' || isPremiumUser.value) return 'PRO';
  return 'FREE';
});

const borderId = computed(() => {
  if (activeBorderId.value) return activeBorderId.value;
  if (currentPlan.value === 'expert') return 'D_EXPERT';
  if (currentPlan.value === 'pro' || isPremiumUser.value) return 'D_PRO';
  return 'D_FREE';
});

const handleLogoutClick = () => {
  showLogoutConfirm.value = true;
  showUserDropdown.value = false;
};

const performLogout = async () => {
  await logout();
  router.push("/");
};

const handleClickOutside = (e) => {
  if (showUserDropdown.value && !e.target.closest('.dropdown-container')) {
    showUserDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.dropdown-trigger {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  padding: 0;
  border-radius: 50%;
  border: none;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 48px;
  width: 48px;
}
.dropdown-trigger:hover {
  transform: scale(1.05);
}

.avatar-sm {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}
.avatar-cyber {
  transform: scale(1.6);
  transform-origin: center;
  margin-right: 8px;
  margin-left: 2px;
}



.skeleton-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-name {
  width: 60px;
  height: 16px;
  border-radius: 4px;
  background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}


</style>
