<template>
  <header class="ws-topbar">
    <div class="topbar-left">
      <button
        class="back-btn"
        @click="$emit('back')"
        :title="'Kembali ke ' + pathTitle"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
      <nav class="breadcrumb" aria-label="breadcrumb">
        <span class="breadcrumb-chapter clickable" @click="$emit('back')" title="Kembali ke Chapter">{{ chapterTitle }}</span>
        <i v-if="previousLessonTitle" class="fa-solid fa-chevron-right separator"></i>
        <span v-if="previousLessonTitle" class="breadcrumb-lesson clickable" @click="$emit('prev-lesson')" title="Kembali ke Materi Sebelumnya">{{ previousLessonTitle }}</span>
        <i class="fa-solid fa-chevron-right separator"></i>
        <span class="breadcrumb-lesson current">{{ lessonTitle }}</span>
      </nav>
    </div>

    <ol class="progress-steps" aria-label="Progress belajar">
      <li
        v-for="(step, index) in STEPS"
        :key="step.label"
        class="step"
        :class="{
          active: activeStep >= step.number,
          done: isStepDone(step.number, lesson, activeStep),
        }"
      >
        <div
          class="step-dot"
          :aria-current="activeStep === step.number ? 'step' : undefined"
        >
          <i v-if="isStepDone(step.number, lesson, activeStep)" class="fa-solid fa-check"></i>
          <span v-else>{{ step.number }}</span>
        </div>
        <span class="step-label">{{ step.label }}</span>
        <div
          v-if="index < STEPS.length - 1"
          class="step-connector"
          :class="{ active: isStepDone(step.number, lesson, activeStep) }"
        ></div>
      </li>
    </ol>

    <!-- User Indicator -->
    <div class="user-indicator" v-if="isLoggedIn">
      <div class="separator-vertical"></div>
      
      <!-- Energy Display -->
      <div class="nav-energy" title="Sisa Energi">
        <i class="fa-solid fa-bolt text-warning"></i>
        <span>{{ credits }}</span>
      </div>

      <div class="dropdown-container" @click="showUserDropdown = !showUserDropdown" style="position: relative; display: flex; align-items: center; cursor: pointer;">
        <img
          :src="userProfile.avatar"
          :alt="userProfile.name"
          class="avatar-sm"
          :class="avatarBorderClass"
          :title="'Masuk sebagai ' + userProfile.name"
        />
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
            <button @click="$router.push('/dashboard')"><i class="fa-solid fa-chart-pie"></i> Kembali ke Beranda</button>
            <button @click="goToMarket" class="text-primary" title="Buka iC-Market"><i class="fa-solid fa-store"></i> Buka iC-Market</button>
            <button @click="handleLogout" class="text-danger"><i class="fa-solid fa-right-from-bracket"></i> Keluar</button>
            <button v-if="globalLogoutEnabled" type="button" @click="goToGlobalLogout" class="text-danger"><i class="fa-solid fa-right-from-bracket"></i> Keluar dari semua aplikasi</button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ssoEnabled, globalLogoutEnabled } from '../../services/sso';
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserAccount } from "../../composables/useUserAccount";

const router = useRouter();
const { isLoggedIn, userProfile, isPremiumUser, currentPlan, credits, logout, fetchUser } = useUserAccount();

const avatarBorderClass = computed(() => {
  if (currentPlan.value === 'expert') return 'border-expert';
  if (currentPlan.value === 'pro' || isPremiumUser.value) return 'border-pro';
  return 'border-gray';
});

const STEPS = [
  { number: 1, label: "Materi" },
  { number: 2, label: "Tes" },
  { number: 3, label: "Praktik" },
];

defineProps({
  pathTitle: { type: String, default: "" },
  chapterTitle: { type: String, default: "" },
  lessonTitle: { type: String, default: "" },
  previousLessonTitle: { type: String, default: "" },
  activeStep: { type: Number, required: true },
  lesson: { type: Object, default: () => ({}) },
});

const isStepDone = (stepNum, lessonObj, currentStep) => {
  if (currentStep > stepNum) return true;
  if (!lessonObj) return false;
  if (stepNum === 1 && lessonObj.isCompleted) return true;
  if (stepNum === 2 && lessonObj.quizPassed) return true;
  if (stepNum === 3 && lessonObj.practiceDone) return true;
  return false;
};

defineEmits(["back", "prev-lesson"]);

const showUserDropdown = ref(false);

const goToMarket = () => {
  const marketUrl = ssoEnabled ? 'https://market.icraftds.id/auth/start?return_to=%2F' : (import.meta.env.VITE_MARKET_URL || 'https://market.icraftds.id/');
  window.open(marketUrl, '_blank', 'noopener,noreferrer');
};

const handleLogout = async () => {
  await logout();
  router.push('/login');
};

const handleClickOutside = (e) => {
  if (showUserDropdown.value && !e.target.closest('.dropdown-container')) {
    showUserDropdown.value = false;
  }
};

onMounted(() => {
  fetchUser();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
function goToGlobalLogout() {
  window.location.assign('https://ic-auth.unikom.my.id/logout');
}
</script>


<style
  scoped
  src="../../assets/css/components/workspace/WorkspaceTopbar.css"
></style>

<style scoped src="../../assets/css/components/workspace/WorkspaceTopbar.css"></style>
