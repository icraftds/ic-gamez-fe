<template>
  <section class="hero reveal active">
    <template v-if="!showLoggedInHero">
      <h1>
        IC Game-Z <br /><span class="gradient-text">Level up your Skill!</span>
      </h1>
      <p>
        Ready to Explore?. Selesaikan tantangan algoritma, asah logika Anda, dan
        jadilah yang terbaik di papan peringkat global.
      </p>
      <div class="hero-actions">
        <router-link to="/challenges" class="btn-start btn-hero">
          Lihat Tantangan
          <i class="fa-solid fa-arrow-right bounce-icon"></i>
        </router-link>
        <router-link to="/leaderboard" class="btn-start btn-gold btn-hero">
          Lihat Top Global
          <i class="fa-solid fa-trophy trophy-icon"></i>
        </router-link>
      </div>
    </template>

    <template v-else>
      <div class="welcome-row">
        <div class="welcome-avatar">
          <div class="welcome-avatar-wrapper">
            <CyberBorder
              :tierId="borderId"
              :accountBadge="currentBadgeStatus"
              :avatarUrl="displayProfile.avatar"
              :imageUrl="displayProfile.active_border_url"
            />
          </div>
        </div>
        <div class="welcome-text">
          <h1 class="welcome-heading">
            Selamat datang kembali,<br /><span class="gradient-text"
              >{{ displayProfile.name }}!</span
            >
          </h1>
          <p class="welcome-sub">Lanjutkan perjalanan belajarmu hari ini.</p>
        </div>
      </div>

      <div class="hero-actions hero-actions-logged">
        <router-link to="/learning" class="btn-start btn-hero">
          Lanjutkan Belajar
          <i class="fa-solid fa-arrow-right icon-right"></i>
        </router-link>
        <router-link to="/dashboard" class="btn-start btn-gold btn-hero">
          Dashboard Saya
        </router-link>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useUserAccount } from "../../composables/useUserAccount";
import CyberBorder from '../ui/CyberBorder.vue';

const { isLoggedIn, isBootstrapping, userProfile, currentPlan, isPremiumUser, activeBorderId } = useUserAccount();
const cachedDisplay = ref(null);

onMounted(() => {
  try {
    const raw = sessionStorage.getItem('ic_user_display_v1');
    if (raw) cachedDisplay.value = JSON.parse(raw);
  } catch {}
});

const showLoggedInHero = computed(() =>
  isLoggedIn.value || (isBootstrapping.value && Boolean(cachedDisplay.value?.name))
);

const displayProfile = computed(() => {
  if (isLoggedIn.value) return userProfile.value;
  return cachedDisplay.value || userProfile.value;
});

const resolvedPlan = computed(() =>
  isLoggedIn.value ? currentPlan.value : (cachedDisplay.value?.currentPlan || 'free')
);

const resolvedPremium = computed(() =>
  isLoggedIn.value ? isPremiumUser.value : Boolean(cachedDisplay.value?.isPremiumUser)
);

const currentBadgeStatus = computed(() => {
  if (resolvedPlan.value === 'lifetime') return 'LIFETIME';
  if (resolvedPlan.value === 'expert') return 'EXPERT';
  if (resolvedPlan.value === 'pro' || resolvedPremium.value) return 'PRO';
  return 'FREE';
});

const borderId = computed(() => {
  const bId = isLoggedIn.value ? activeBorderId.value : cachedDisplay.value?.activeBorderId;
  if (bId) return bId;
  if (resolvedPlan.value === 'expert' || resolvedPlan.value === 'lifetime') return 'D_EXPERT';
  if (resolvedPlan.value === 'pro' || resolvedPremium.value) return 'D_PRO';
  return 'D_FREE';
});
</script>

<style scoped src="../../assets/css/components/home/HeroSection.css"></style>
