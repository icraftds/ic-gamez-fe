<template>
  <div class="greeting-card">
    <div class="greeting-left">
      <h1>Halo, <span class="highlight-name">{{ userProfile.name }}</span> 👋</h1>
      <p>Yuk lanjutin streak-mu! 5 menit konsisten lebih efektif daripada maraton sehari.</p>
      <div class="quick-stats">
        <div class="qs-item"><span class="qs-value text-cyan">{{ userProfile.xp }}</span> <span class="qs-label">XP</span></div>
        <div class="qs-item"><span class="qs-value text-orange">{{ userProfile.streak }}</span> <span class="qs-label">hari streak</span></div>
        <div class="qs-item"><span class="qs-value">{{ completedLessons }}</span> <span class="qs-label">latihan selesai</span></div>
        <div class="qs-item"><span class="qs-value">0</span> <span class="qs-label">sertifikat</span></div>
      </div>
    </div>
    <button v-if="!isPremiumUser" class="btn-upgrade-sm" @click="$router.push({ path: '/dashboard', query: { tab: 'langganan' } })">Upgrade Premium</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserAccount } from '../../../composables/useUserAccount'
import { useLearningPaths } from '../../../composables/useLearningPaths'

const { userProfile, isPremiumUser } = useUserAccount()
const { paths } = useLearningPaths()

const completedLessons = computed(() => {
  let count = 0
  paths.value?.forEach(p => p.chapters?.forEach(c => c.lessons?.forEach(l => { if (l.isCompleted) count++ })))
  return count
})
</script>

<style scoped src="../../../assets/css/components/dashboard/home/GreetingCard.css"></style>
