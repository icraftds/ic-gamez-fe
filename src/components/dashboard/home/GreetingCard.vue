<template>
  <div class="dashboard-hero">
    <div class="hero-content">
      <div class="user-info-section">
        <div class="avatar-wrapper">
          <div class="user-avatar-cyber-wrapper">
            <CyberBorder
              :tierId="borderId"
              :accountBadge="currentBadgeStatus"
              :avatarUrl="userProfile.avatar || 'https://ui-avatars.com/api/?name=' + userProfile.name + '&background=random'"
            />
          </div>
        </div>
        <div class="user-details">
          <h1 class="greeting-text">
            Welcome back, <br />
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span class="highlight-name">{{ userProfile.username ? userProfile.username + '#' + userProfile.tag_id : userProfile.name }}</span>
              <span style="font-size: 1.1rem; color: #94a3b8; font-weight: 500;">
                {{ userProfile.username ? userProfile.name : '@' + (userProfile.slug || userProfile.id) }}
              </span>
            </div>
          </h1>
          <p class="motivational-text">Lanjutkan misimu hari ini! Konsistensi adalah kunci menguasai pemrograman.</p>
          
          <div class="tier-progress">
            <div class="tier-labels">
              <span class="current-tier">Lv. {{ userProfile.level }}</span>
              <span class="xp-text">{{ userProfile.xp }} / {{ (userProfile.level * 1000) }} XP</span>
              <span class="next-tier">Lv. {{ userProfile.level + 1 }}</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" :style="{ width: xpPercentage + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card xp-stat">
          <div class="stat-icon"><CyberXp style="width: 24px; height: 24px;" /></div>
          <div class="stat-info">
            <span class="stat-value">{{ userProfile.xp }}</span>
            <span class="stat-label">Total XP</span>
          </div>
        </div>
        <div class="stat-card streak-stat">
          <div class="stat-icon"><i class="fa-solid fa-fire"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ userProfile.streak || 0 }} Hari</span>
            <span class="stat-label">Streak Aktif</span>
          </div>
        </div>
        <div class="stat-card lesson-stat">
          <div class="stat-icon"><i class="fa-solid fa-book-open"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ completedLessons }}</span>
            <span class="stat-label">Materi Selesai</span>
          </div>
        </div>
        <div class="stat-card cert-stat">
          <div class="stat-icon"><i class="fa-solid fa-certificate"></i></div>
          <div class="stat-info">
            <span class="stat-value">0</span>
            <span class="stat-label">Sertifikat</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAccount } from '../../../composables/useUserAccount'
import { useLearningPaths } from '../../../composables/useLearningPaths'

const { userProfile, isPremiumUser, currentPlan, activeBorderId } = useUserAccount()
const { paths } = useLearningPaths()
const router = useRouter()
import CyberBorder from '../../ui/CyberBorder.vue'

const completedLessons = computed(() => {
  let count = 0
  paths.value?.forEach(p => p.chapters?.forEach(c => c.lessons?.forEach(l => { if (l.isCompleted) count++ })))
  return count
})

const xpPercentage = computed(() => {
  const current = userProfile.value.xp || 0
  const max = (userProfile.value.level || 1) * 1000
  return Math.min(100, Math.max(0, (current / max) * 100))
})

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
</script>

<style scoped src="../../../assets/css/components/dashboard/home/GreetingCard.css"></style>
