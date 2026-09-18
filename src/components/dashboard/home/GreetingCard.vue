<template>
  <div class="greeting-card">
    <div class="greeting-left">
      <h1>Selamat datang, <span class="highlight-name">{{ userProfile.name }}</span> 🚀</h1>
      <p>Terus tingkatkan kemampuan coding kamu hari ini. Konsistensi adalah kunci keberhasilan.</p>
      <div class="quick-stats">
        <div class="qs-item"><span class="qs-value text-cyan">{{ userProfile.xp }}</span> <span class="qs-label">Poin Pengalaman</span></div>
        <div class="qs-item"><span class="qs-value text-orange">{{ userProfile.streak }}</span> <span class="qs-label">Hari Berturut-turut</span></div>
        <div class="qs-item"><span class="qs-value">{{ completedLessons }}</span> <span class="qs-label">Modul Diselesaikan</span></div>
        <div class="qs-item"><span class="qs-value">0</span> <span class="qs-label">Sertifikat Diraih</span></div>
      </div>
    </div>
    <button v-if="!isPremiumUser" class="btn-upgrade-sm" @click="goToSubscription">Upgrade Premium</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAccount } from '../../../composables/useUserAccount'
import { useLearningPaths } from '../../../composables/useLearningPaths'

const { userProfile, isPremiumUser } = useUserAccount()
const { paths } = useLearningPaths()
const router = useRouter()

const completedLessons = computed(() => {
  let count = 0
  paths.value?.forEach(p => p.chapters?.forEach(c => c.lessons?.forEach(l => { if (l.isCompleted) count++ })))
  return count
})

const goToSubscription = () => {
  router.push({ path: '/dashboard', query: { tab: 'langganan' } })
}
</script>

<style scoped src="../../../assets/css/components/dashboard/home/GreetingCard.css"></style>
