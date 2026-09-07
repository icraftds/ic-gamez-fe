<template>
  <aside class="sidebar">
    <div class="card sub-status">
      <h3>Status Akun</h3>
      <div class="status-row">
        <span>Paket</span>
        <span class="badge" :class="isPremiumUser ? 'premium' : 'free'">{{
          subscriptionStatus
        }}</span>
      </div>

      <div v-if="!isPremiumUser" class="upgrade-box">
        <p><strong>Upgrade ke Premium untuk:</strong></p>
        <ul>
          <li>
            <i class="fa-solid fa-arrow-right"></i> Akses semua tantangan
            premium
          </li>
          <li>
            <i class="fa-solid fa-arrow-right"></i> Akses materi lanjutan
          </li>
          <li>
            <i class="fa-solid fa-arrow-right"></i> Tanpa batas kredit
            harian
          </li>
        </ul>
        <button class="btn-upgrade" @click="upgradeToPremium">
          Upgrade Ke Premium
        </button>
      </div>
    </div>

    <div class="card progress-card">
      <h3>Progress Kamu</h3>
      <div class="progress-circle">
        <svg viewBox="0 0 36 36" class="circular-chart">
          <path
            class="circle-bg"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            class="circle"
            :stroke-dasharray="`${completionPercentage}, 100`"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="20.35" class="percentage">
            {{ completionPercentage }}%
          </text>
        </svg>
      </div>
      <p class="progress-text">
        {{ completedCount }} / {{ allChallenges.length }} selesai
      </p>

      <div class="progress-stats">
        <div class="stat-row">
          <span class="diff-mudah">Mudah</span>
          <span>{{ completedMudah }} / {{ totalMudah }}</span>
        </div>
        <div class="stat-row">
          <span class="diff-sedang">Sedang</span>
          <span>{{ completedSedang }} / {{ totalSedang }}</span>
        </div>
        <div class="stat-row">
          <span class="diff-sulit">Sulit</span>
          <span>{{ completedSulit }} / {{ totalSulit }}</span>
        </div>
      </div>
    </div>

    <div class="card tags-card">
      <h3>Tag</h3>
      <div class="tags-container">
        <span class="tag">SQL Dasar</span>
        <span class="tag">Filtering</span>
        <span class="tag">HTML</span>
        <span class="tag">Algoritma</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useLearningPaths } from "../../composables/useLearningPaths.js";
import { useUserAccount } from "../../composables/useUserAccount.js";

const { allChallenges } = useLearningPaths();
const { isPremiumUser, subscriptionStatus, upgradeToPremium } = useUserAccount();

const completedCount = computed(
  () => allChallenges.value.filter((c) => c.isCompleted).length
);
const completionPercentage = computed(() => {
  if (allChallenges.value.length === 0) return 0;
  return Math.round((completedCount.value / allChallenges.value.length) * 100);
});

const getDiffStats = (diff) => {
  const challenges = allChallenges.value.filter((c) => c.difficulty === diff);
  return {
    total: challenges.length,
    completed: challenges.filter((c) => c.isCompleted).length,
  };
};

const mudahStats = computed(() => getDiffStats("Mudah"));
const totalMudah = computed(() => mudahStats.value.total);
const completedMudah = computed(() => mudahStats.value.completed);

const sedangStats = computed(() => getDiffStats("Sedang"));
const totalSedang = computed(() => sedangStats.value.total);
const completedSedang = computed(() => sedangStats.value.completed);

const sulitStats = computed(() => getDiffStats("Sulit"));
const totalSulit = computed(() => sulitStats.value.total);
const completedSulit = computed(() => sulitStats.value.completed);
</script>

<style scoped>
.sidebar {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  background: rgba(15, 10, 30, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 25px;
  backdrop-filter: blur(10px);
}

.card h3 {
  font-size: 1.1rem;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}

.badge.free {
  background: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

.badge.premium {
  background: linear-gradient(135deg, #d97706, #f59e0b);
  color: white;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
}

.upgrade-box {
  background: rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 12px;
  border: 1px dashed rgba(245, 158, 11, 0.3);
}

.upgrade-box ul {
  list-style: none;
  padding: 0;
  margin: 15px 0;
}

.upgrade-box li {
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.upgrade-box li i {
  color: #38bdf8;
  font-size: 0.8rem;
}

.btn-upgrade {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #d97706, #f59e0b);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-upgrade:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(245, 158, 11, 0.4);
}

/* Progress Chart */
.progress-circle {
  width: 120px;
  margin: 0 auto 20px;
}

.circular-chart {
  display: block;
  margin: 10px auto;
  max-width: 80%;
  max-height: 250px;
}

.circle-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 2.5;
}

.circle {
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke: #38bdf8;
  animation: progress 1s ease-out forwards;
}

@keyframes progress {
  0% {
    stroke-dasharray: 0 100;
  }
}

.percentage {
  fill: white;
  font-family: sans-serif;
  font-size: 0.5em;
  text-anchor: middle;
  font-weight: bold;
}

.progress-text {
  text-align: center;
  color: #94a3b8;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.progress-stats .stat-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.diff-mudah {
  color: #10b981;
}
.diff-sedang {
  color: #f59e0b;
}
.diff-sulit {
  color: #ef4444;
}

/* Tags */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #cbd5e1;
  cursor: pointer;
}
.tag:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
</style>
