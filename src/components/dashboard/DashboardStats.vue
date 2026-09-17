<template>
  <div class="dash-stats">
    <h2>Statistik Belajar</h2>
    <p class="subtitle">Pertumbuhan dan pencapaianmu di seluruh tools IC Game-Z.</p>

    <!-- Loading State Global -->
    <div v-if="isLoadingStats || isLoadingHeatmap" class="loading-state" style="text-align:center; padding: 40px; color:#94a3b8;">
      <i class="fa-solid fa-spinner fa-spin" style="font-size:2rem; margin-bottom:10px;"></i>
      <p>Mengambil data statistik Anda secara real-time...</p>
    </div>

    <template v-else-if="statsData">
      <!-- XP & Streak -->
      <div class="top-stats-grid">
        <div class="stat-big-card">
          <span class="stat-big-value text-cyan">{{ statsData.xp.total }}</span>
          <span class="stat-big-label">Total XP</span>
          <div class="xp-mini">
            <span>Level {{ statsData.xp.level }}</span>
            <span>{{ userProfile.xp }}/{{ statsData.xp.next_level_xp }} XP</span>
          </div>
          <div class="xp-bar-bg"><div class="xp-bar-fill" :style="{ width: xpPercentage + '%' }"></div></div>
          <p class="xp-hint">{{ statsData.xp.next_level_xp - userProfile.xp }} XP lagi ke Level {{ statsData.xp.level + 1 }}</p>
        </div>
        <div class="stat-big-card">
          <span class="stat-big-value text-orange">{{ statsData.streak.current }}</span>
          <span class="stat-big-label">Streak Hari Ini</span>
          <p class="streak-sub">Streak terpanjang: <strong>{{ statsData.streak.longest }} hari</strong></p>
        </div>
      </div>

      <!-- Latihan Selesai -->
      <div class="section-card">
        <h3>Latihan Selesai</h3>
        <div class="exercise-grid">
          <!-- Breakdown dinamis dari backend -->
          <div class="exercise-item" v-for="(count, pathSlug) in statsData.completed_exercises.breakdown" :key="pathSlug">
            <span class="ex-value text-cyan">{{ count }}</span>
            <span class="ex-label" style="text-transform: capitalize;">{{ pathSlug.replace('-', ' ') }}</span>
          </div>
          <!-- Fallback jika kosong -->
          <div class="exercise-item" v-if="Object.keys(statsData.completed_exercises.breakdown).length === 0">
            <span class="ex-value text-cyan">0</span>
            <span class="ex-label">Materi</span>
          </div>
        </div>
        <p class="total-text">Total: {{ statsData.completed_exercises.total }} latihan & tantangan diselesaikan.</p>
      </div>

      <!-- Activity Heatmap -->
      <div class="section-card">
        <div class="heatmap-header">
          <h3>Aktivitas Belajar</h3>
          <span class="heatmap-info" v-if="heatmapData">{{ heatmapData.meta.total_activities }} aktivitas dalam {{ heatmapData.meta.total_active_days }} hari</span>
        </div>
        <div class="heatmap-grid">
          <div class="heatmap-labels">
            <span>Sen</span><span>Rab</span><span>Jum</span>
          </div>
          <!-- Anda bisa menambahkan logika bulan dinamis jika perlu, ini statis sebagai contoh -->
          <div class="heatmap-months">
            <span v-for="month in months" :key="month">{{ month }}</span>
          </div>
          <div class="heatmap-cells">
            <!-- Data yang di-render dari database -->
            <div
              v-for="cell in generatedHeatmapCells"
              :key="cell.id"
              class="heatmap-cell"
              :class="'level-' + cell.level"
              :title="cell.date ? (cell.count + ' aktivitas pada ' + cell.date) : 'Belum ada aktivitas'"
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
            <span class="rank-number" v-if="statsData.rank.this_month">#{{ statsData.rank.this_month }}</span>
            <p class="rank-empty" v-else>Belum ada XP bulan ini</p>
          </div>
          <div class="rank-card">
            <span class="rank-period">SEPANJANG MASA</span>
            <span class="rank-number">#{{ statsData.rank.all_time }}</span>
            <span class="rank-xp">{{ statsData.xp.total }} XP</span>
          </div>
        </div>
        <router-link to="/dashboard/leaderboard" class="link-action">Lihat Leaderboard Lengkap →</router-link>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useUserAccount } from '../../composables/useUserAccount'
import { useDashboardStats } from '../../composables/useDashboardStats'

const { userProfile } = useUserAccount()
const { statsData, heatmapData, isLoadingStats, isLoadingHeatmap, fetchStats, fetchHeatmap } = useDashboardStats()

onMounted(() => {
  // Panggil kedua endpoint secara paralel
  fetchStats()
  fetchHeatmap()
})

// Progress bar logic
const xpPercentage = computed(() => {
  if (!statsData.value) return 0
  return Math.round((userProfile.value.xp / statsData.value.xp.next_level_xp) * 100)
})

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

// Menyiapkan layout 364 kotak (52 minggu) untuk Heatmap GitHub-style
const generatedHeatmapCells = computed(() => {
  const cells = []
  const today = new Date()
  
  // Buat dictionary cepat untuk mencari level berdasarkan tanggal (YYYY-MM-DD)
  const activityMap = {}
  if (heatmapData.value && heatmapData.value.data) {
    heatmapData.value.data.forEach(item => {
      activityMap[item.date] = { level: item.level, count: item.count }
    })
  }

  // Berjalan mundur dari 364 hari yang lalu hingga hari ini
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    
    if (activityMap[dateStr]) {
      cells.push({ id: i, date: dateStr, level: activityMap[dateStr].level, count: activityMap[dateStr].count })
    } else {
      cells.push({ id: i, date: dateStr, level: 0, count: 0 })
    }
  }
  return cells
})
</script>

<style scoped src="../../assets/css/components/dashboard/DashboardStats.css"></style>
