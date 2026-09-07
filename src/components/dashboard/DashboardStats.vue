<template>
  <div class="dash-stats">
    <h2>Statistik Belajar</h2>
    <p class="subtitle">Pertumbuhan dan pencapaianmu di seluruh tools IC Game-Z.</p>

    <!-- XP & Streak -->
    <div class="top-stats-grid">
      <div class="stat-big-card">
        <span class="stat-big-value text-cyan">{{ userProfile.xp }}</span>
        <span class="stat-big-label">Total XP</span>
        <div class="xp-mini">
          <span>Level {{ userProfile.level }}</span>
          <span>{{ userProfile.xp }}/{{ userProfile.nextLevelXp }} XP</span>
        </div>
        <div class="xp-bar-bg"><div class="xp-bar-fill" :style="{ width: xpPercentage + '%' }"></div></div>
        <p class="xp-hint">{{ userProfile.nextLevelXp - userProfile.xp }} XP lagi ke Level {{ userProfile.level + 1 }}</p>
      </div>
      <div class="stat-big-card">
        <span class="stat-big-value text-orange">{{ userProfile.streak }}</span>
        <span class="stat-big-label">Streak Hari Ini</span>
        <p class="streak-sub">Streak terpanjang: <strong>{{ userProfile.streak }} hari</strong></p>
      </div>
    </div>

    <!-- Latihan Selesai -->
    <div class="section-card">
      <h3>Latihan Selesai</h3>
      <div class="exercise-grid">
        <div class="exercise-item" v-for="path in paths" :key="path.id">
          <span class="ex-value text-cyan">{{ getCompletedForPath(path) }}</span>
          <span class="ex-label">{{ path.title }}</span>
        </div>
        <div class="exercise-item">
          <span class="ex-value">0</span>
          <span class="ex-label">Proyek</span>
        </div>
      </div>
      <p class="total-text">Total: {{ totalCompleted }} latihan & tantangan.</p>
    </div>

    <!-- Activity Heatmap -->
    <div class="section-card">
      <div class="heatmap-header">
        <h3>Aktivitas Belajar</h3>
        <span class="heatmap-info">{{ totalActiveDays }} aktivitas dalam {{ totalActiveDays }} hari</span>
      </div>
      <div class="heatmap-grid">
        <div class="heatmap-labels">
          <span>Sen</span><span>Rab</span><span>Jum</span>
        </div>
        <div class="heatmap-months">
          <span v-for="month in months" :key="month">{{ month }}</span>
        </div>
        <div class="heatmap-cells">
          <div
            v-for="(cell, i) in heatmapData"
            :key="i"
            class="heatmap-cell"
            :class="'level-' + cell"
            :title="cell + ' aktivitas'"
          ></div>
        </div>
        <div class="heatmap-legend">
          <span>Kosong</span>
          <div class="heatmap-cell level-0"></div>
          <div class="heatmap-cell level-1"></div>
          <div class="heatmap-cell level-2"></div>
          <div class="heatmap-cell level-3"></div>
          <span>5+ / hari</span>
        </div>
      </div>
    </div>

    <!-- Peringkat Leaderboard -->
    <div class="section-card">
      <h3>Peringkat Leaderboard</h3>
      <div class="rank-grid">
        <div class="rank-card">
          <span class="rank-period">BULAN INI</span>
          <p class="rank-empty">Belum ada XP bulan ini</p>
          <p class="rank-hint">Satu soal selesai sudah cukup buat memulai hitungannya.</p>
        </div>
        <div class="rank-card">
          <span class="rank-period">SEPANJANG MASA</span>
          <span class="rank-number">#{{ allTimeRank }}</span>
          <span class="rank-xp">{{ userProfile.xp }} XP</span>
        </div>
      </div>
      <router-link to="/dashboard/leaderboard" class="link-action">Lihat Leaderboard Lengkap →</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserAccount } from '../../composables/useUserAccount'
import { useLearningPaths } from '../../composables/useLearningPaths'

const { userProfile } = useUserAccount()
const { paths } = useLearningPaths()

const xpPercentage = computed(() => Math.round((userProfile.value.xp / userProfile.value.nextLevelXp) * 100))

const getCompletedForPath = (path) => {
  let count = 0
  path.chapters.forEach(c => c.lessons.forEach(l => { if (l.isCompleted) count++ }))
  return count
}

const totalCompleted = computed(() => {
  let count = 0
  paths.value.forEach(p => p.chapters.forEach(c => c.lessons.forEach(l => { if (l.isCompleted) count++ })))
  return count
})

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const totalActiveDays = 0
const allTimeRank = 2689

// Generate heatmap data (mock - mostly empty with a few highlights)
const heatmapData = computed(() => {
  const cells = []
  for (let i = 0; i < 364; i++) {
    cells.push(Math.random() > 0.92 ? Math.floor(Math.random() * 3) + 1 : 0)
  }
  return cells
})
</script>

<style scoped>
.dash-stats h2 { font-size: 1.6rem; margin-bottom: 5px; }
.subtitle { color: #94a3b8; margin-bottom: 25px; }

.top-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
.stat-big-card {
  background: rgba(15, 10, 30, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 25px;
  text-align: center;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
  transform-style: preserve-3d;
}

.stat-big-card:hover {
  transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-5px);
  box-shadow: -10px 15px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(147, 51, 234, 0.2);
  border-color: rgba(147, 51, 234, 0.3);
}
.stat-big-value { font-size: 3rem; font-weight: 900; display: block; }
.stat-big-label { color: #64748b; font-size: 0.9rem; display: block; margin-bottom: 15px; }
.text-cyan { color: #22d3ee; }
.text-orange { color: #f97316; }
.xp-mini { display: flex; justify-content: space-between; color: #94a3b8; font-size: 0.8rem; margin-bottom: 8px; }
.xp-bar-bg { height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
.xp-bar-fill { height: 100%; background: linear-gradient(90deg, #22d3ee, #3b82f6); border-radius: 4px; }
.xp-hint { color: #64748b; font-size: 0.8rem; margin-top: 10px; }
.streak-sub { color: #94a3b8; font-size: 0.9rem; margin-top: 10px; }

.section-card {
  background: rgba(15, 10, 30, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 25px;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
  transform-style: preserve-3d;
  margin-bottom: 25px;
}

.section-card:hover {
  transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-5px);
  box-shadow: -10px 15px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(34, 211, 238, 0.2);
  border-color: rgba(34, 211, 238, 0.3);
}
.section-card h3 { font-size: 1.2rem; margin-bottom: 20px; }

.exercise-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 15px; }
.exercise-item { text-align: center; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 12px; }
.ex-value { font-size: 1.8rem; font-weight: 800; display: block; margin-bottom: 5px; }
.ex-label { color: #64748b; font-size: 0.85rem; }
.total-text { color: #64748b; font-size: 0.85rem; }

.heatmap-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.heatmap-header h3 { margin-bottom: 0; }
.heatmap-info { color: #64748b; font-size: 0.85rem; }

.heatmap-grid { position: relative; }
.heatmap-labels { display: flex; flex-direction: column; gap: 8px; position: absolute; left: 0; top: 30px; color: #475569; font-size: 0.7rem; }
.heatmap-months { display: flex; gap: 28px; margin-left: 40px; margin-bottom: 8px; color: #475569; font-size: 0.75rem; }
.heatmap-cells { display: flex; flex-wrap: wrap; gap: 3px; margin-left: 40px; max-height: 80px; }
.heatmap-cell { width: 12px; height: 12px; border-radius: 2px; }
.level-0 { background: rgba(255,255,255,0.05); }
.level-1 { background: #0e4429; }
.level-2 { background: #006d32; }
.level-3 { background: #26a641; }
.heatmap-legend { display: flex; align-items: center; gap: 4px; margin-top: 12px; margin-left: 40px; color: #475569; font-size: 0.7rem; }

.rank-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.rank-card {
  background: rgba(0,0,0,0.2);
  border-radius: 12px;
  padding: 25px;
  text-align: center;
}
.rank-period { color: #64748b; font-size: 0.8rem; font-weight: 700; letter-spacing: 1px; display: block; margin-bottom: 15px; }
.rank-empty { color: #94a3b8; font-weight: 600; }
.rank-hint { color: #475569; font-size: 0.8rem; }
.rank-number { font-size: 2.5rem; font-weight: 900; color: #22d3ee; display: block; }
.rank-xp { color: #94a3b8; font-size: 0.9rem; }
.link-action { color: #22d3ee; text-decoration: none; font-weight: 600; font-size: 0.9rem; }
.link-action:hover { text-decoration: underline; }
</style>
