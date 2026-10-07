<template>
  <div class="dropdown-container dropdown-trigger" @click.stop="!isLoading && (showUserDropdown = !showUserDropdown)">
    <template v-if="isLoading">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-name"></div>
    </template>
    <template v-else>
      <img
        :src="userProfile.avatar"
        :alt="userProfile.name"
        class="avatar-sm"
        :class="avatarBorderClass"
        :title="'Masuk sebagai ' + userProfile.name"
      />
      <span class="user-name-short">{{ firstName }}</span>
      <i class="fa-solid fa-chevron-down dropdown-icon"></i>
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

const props = defineProps({
  allowProfileEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['open-profile']);

const { isLoading, userProfile, currentPlan, isPremiumUser, logout } = useUserAccount();
const router = useRouter();

const showUserDropdown = ref(false);
const showLogoutConfirm = ref(false);

const firstName = computed(() => {
  if (!userProfile.value || !userProfile.value.name) return '';
  return userProfile.value.name.split(' ')[0];
});

const avatarBorderClass = computed(() => {
  if (currentPlan.value === 'expert') return 'border-expert';
  if (currentPlan.value === 'pro' || isPremiumUser.value) return 'border-pro';
  return 'border-gray';
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
  gap: 12px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 16px 4px 6px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  height: 48px;
  box-sizing: border-box;
}
.dropdown-trigger:hover {
  background: rgba(255, 255, 255, 0.1);
}
.dropdown-icon {
  font-size: 0.8rem;
  color: #6b7280;
}

.avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #333;
}

.user-name-short {
  font-weight: 600;
  color: var(--text-main-hex, #f3f4f6);
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

@media (max-width: 1024px) {
  .user-name-short, .dropdown-icon {
    display: none;
  }
  .dropdown-trigger {
    padding: 4px;
    gap: 0;
  }
}
</style>
