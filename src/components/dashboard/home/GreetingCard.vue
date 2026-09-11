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
    <button v-if="!isPremiumUser" class="btn-upgrade-sm" @click="upgradeToPremium">Upgrade Premium</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserAccount } from '../../../composables/useUserAccount'
import { useLearningPaths } from '../../../composables/useLearningPaths'

const { userProfile, isPremiumUser, upgradeToPremium } = useUserAccount()
const { paths } = useLearningPaths()

const completedLessons = computed(() => {
  let count = 0
  paths.value.forEach(p => p.chapters.forEach(c => c.lessons.forEach(l => { if (l.isCompleted) count++ })))
  return count
})
</script>

<style scoped>
.greeting-card {
  background: rgba(15, 10, 30, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
  transform-style: preserve-3d;
}

.greeting-card:hover {
  transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-5px);
  box-shadow: -10px 15px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.3);
}
.greeting-card h1 { font-size: 2rem; margin-bottom: 8px; }
.highlight-name {
  background: linear-gradient(135deg, #f59e0b, #fcd34d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: underline;
  text-decoration-color: #f59e0b;
  text-underline-offset: 4px;
}
.greeting-card > .greeting-left > p { color: #94a3b8; margin-bottom: 20px; }
.quick-stats { display: flex; gap: 30px; }
.qs-item { display: flex; align-items: baseline; gap: 6px; }
.qs-value { font-size: 1.5rem; font-weight: 800; color: white; }
.qs-label { color: #64748b; font-size: 0.9rem; }
.text-cyan { color: #22d3ee; }
.text-orange { color: #f97316; }

.btn-upgrade-sm {
  background: transparent;
  border: 1.5px solid #f59e0b;
  color: #f59e0b;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
}
.btn-upgrade-sm:hover { background: rgba(245, 158, 11, 0.1); }

@media (max-width: 768px) {
  .greeting-card {
    flex-direction: column;
    gap: 15px;
    padding: 20px;
  }
  .greeting-card h1 { font-size: 1.5rem; }
  .quick-stats { gap: 15px; flex-wrap: wrap; }
  .qs-value { font-size: 1.2rem; }
  .btn-upgrade-sm { width: 100%; text-align: center; }
  .greeting-card:hover { transform: none; }
}
</style>
