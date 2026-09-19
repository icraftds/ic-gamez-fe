<template>
  <div class="gh-stats-container">
    <div v-if="isLoadingStats || isLoadingHeatmap" class="loading-state">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>Loading activity data...</p>
    </div>

    <template v-else-if="statsData && heatmapData">
      
      <!-- XP & Streak Restored -->
      <div class="gh-top-stats-grid">
        <div class="gh-stat-card">
          <span class="gh-stat-value text-cyan">{{ statsData.xp.total }}</span>
          <span class="gh-stat-label">Total XP</span>
          <div class="gh-xp-mini">
            <span>Level {{ statsData.xp.level }}</span>
            <span>{{ userProfile.xp }}/{{ statsData.xp.next_level_xp }} XP</span>
          </div>
          <div class="gh-xp-bar-bg"><div class="gh-xp-bar-fill" :style="{ width: xpPercentage + '%' }"></div></div>
          <p class="gh-xp-hint">{{ statsData.xp.next_level_xp - userProfile.xp }} XP lagi ke Level {{ statsData.xp.level + 1 }}</p>
        </div>
        <div class="gh-stat-card">
          <span class="gh-stat-value text-orange">{{ statsData.streak.current }}</span>
          <span class="gh-stat-label">Streak Hari Ini</span>
          <p class="gh-streak-sub">Streak terpanjang: <strong>{{ statsData.streak.longest }} hari</strong></p>
        </div>
      </div>

      <!-- Top Text -->
      <div class="gh-header">
        <h2>{{ heatmapData.meta.total_activities }} Aktivitas Belajar Setahun Terakhir</h2>
      </div>

      <!-- Heatmap Box -->
      <div class="gh-box">
        <div class="gh-heatmap-wrapper">
          <div class="gh-heatmap-months">
            <span v-for="(month, index) in heatmapMonths" :key="index" :style="{ gridColumn: month.col }">{{ month.label }}</span>
          </div>
          <div class="gh-heatmap-inner">
            <div class="gh-heatmap-days">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
            <div class="gh-heatmap-grid">
              <div
                v-for="cell in generatedHeatmapCells"
                :key="cell.id"
                class="gh-cell"
                :class="[cell.isSpacer ? 'spacer' : 'level-' + cell.level]"
                :title="!cell.isSpacer ? (cell.count + ' contributions on ' + cell.date) : ''"
              ></div>
            </div>
          </div>
          <div class="gh-heatmap-footer">
            <a href="#" @click.prevent="openWipModal">Pelajari cara kami menghitung aktivitas</a>
            <div class="gh-legend">
              <span>Less</span>
              <div class="gh-cell level-0"></div>
              <div class="gh-cell level-1"></div>
              <div class="gh-cell level-2"></div>
              <div class="gh-cell level-3"></div>
              <div class="gh-cell level-4"></div>
              <span>More</span>
            </div>
          </div>
        </div>

        <div class="gh-overview-divider"></div>

        <!-- Activity Overview -->
        <div class="gh-overview-section">
          <div class="gh-overview-left">
            <h3>Ringkasan Aktivitas</h3>
            <p class="gh-contributed-text" v-if="Object.keys(statsData.completed_exercises.breakdown).length > 0">
              <i class="fa-solid fa-book-open"></i> Menyelesaikan modul 
              <strong class="gh-highlight-link" v-for="(count, pathSlug, index) in statsData.completed_exercises.breakdown" :key="pathSlug">
                <router-link :to="`/learning/${pathSlug}`" style="color: inherit; text-decoration: none;">
                  {{ pathSlug.replace('-', ' ') }}
                </router-link>{{ index < Object.keys(statsData.completed_exercises.breakdown).length - 1 ? ', ' : '' }}
              </strong>
            </p>
            <p class="gh-contributed-text" v-else>
              <i class="fa-solid fa-book-open"></i> Belum ada aktivitas pembelajaran.
            </p>
          </div>
          <div class="gh-overview-right">
            <!-- Simulated Crosshair or simple horizontal bars -->
            <div class="gh-chart-bars">
              <div class="gh-chart-item" v-for="(count, pathSlug) in statsData.completed_exercises.breakdown" :key="pathSlug">
                <span class="gh-chart-label">{{ pathSlug.replace('-', ' ') }}</span>
                <div class="gh-chart-bar-bg">
                  <div class="gh-chart-bar-fill" :style="{ width: (count / statsData.completed_exercises.total * 100) + '%' }"></div>
                </div>
                <span class="gh-chart-pct">{{ Math.round((count / statsData.completed_exercises.total) * 100) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contribution Activity Timeline -->
      <div class="gh-timeline-section">
        <h3 class="gh-timeline-title">Riwayat Aktivitas</h3>
        <div class="gh-timeline-period">
          <span class="gh-period-label">Terkini</span>
          <div class="gh-period-line"></div>
        </div>
        
        <div class="gh-timeline-event">
          <div class="gh-event-icon-wrapper">
            <div class="gh-event-icon"><i class="fa-solid fa-code-commit"></i></div>
            <div class="gh-event-line"></div>
          </div>
          <div class="gh-event-body">
            <div class="gh-event-header">
              <h4>Menyelesaikan {{ statsData.completed_exercises.total }} latihan di {{ Object.keys(statsData.completed_exercises.breakdown).length }} modul</h4>
              <i class="fa-solid fa-chevron-up"></i>
            </div>
            <ul class="gh-event-list">
              <li v-for="(count, pathSlug) in statsData.completed_exercises.breakdown" :key="pathSlug">
                <div class="gh-event-list-left">
                  <router-link :to="`/learning/${pathSlug}`" class="gh-highlight-link">{{ pathSlug.replace('-', ' ') }}</router-link>
                  <span class="gh-event-list-count">{{ count }} latihan</span>
                </div>
                <div class="gh-event-list-right">
                  <div class="gh-mini-bar"><div class="gh-mini-bar-fill" :style="{ width: (count / statsData.completed_exercises.total * 100) + '%' }"></div></div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Leaderboard Restored -->
      <div class="gh-box" style="margin-top: 24px; padding: 24px;">
        <h3 style="margin-top: 0; font-size: 16px; font-weight: 400; margin-bottom: 16px;">Peringkat Leaderboard</h3>
        <div class="gh-rank-grid">
          <div class="gh-rank-card">
            <span class="gh-rank-period">BULAN INI</span>
            <span class="gh-rank-number" v-if="statsData.rank.this_month">#{{ statsData.rank.this_month }}</span>
            <p class="gh-rank-empty" v-else>Belum ada XP bulan ini</p>
          </div>
          <div class="gh-rank-card">
            <span class="gh-rank-period">SEPANJANG MASA</span>
            <span class="gh-rank-number">#{{ statsData.rank.all_time }}</span>
            <span class="gh-rank-xp">{{ statsData.xp.total }} XP</span>
          </div>
        </div>
        <router-link to="/leaderboard" class="gh-highlight-link" style="display: block; margin-top: 16px; font-size: 14px;">Lihat Leaderboard Lengkap →</router-link>
      </div>

    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useUserAccount } from '../../composables/useUserAccount'
import { useDashboardStats } from '../../composables/useDashboardStats'
import { useWipModal } from '../../composables/useWipModal'

const { userProfile } = useUserAccount()
const { statsData, heatmapData, isLoadingStats, isLoadingHeatmap, fetchStats, fetchHeatmap } = useDashboardStats()
const { openWipModal } = useWipModal()

onMounted(() => {
  fetchStats()
  fetchHeatmap()
})

const xpPercentage = computed(() => {
  if (!statsData.value) return 0
  return Math.round((userProfile.value.xp / statsData.value.xp.next_level_xp) * 100)
})

// Generate Heatmap Cells with proper spacing for CSS Grid Auto Flow
const generatedHeatmapCells = computed(() => {
  const cells = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const activityMap = {}
  if (heatmapData.value && heatmapData.value.data) {
    heatmapData.value.data.forEach(item => {
      let level = item.level
      if (level === 3 && item.count > 10) level = 4 
      activityMap[item.date] = { level: level, count: item.count }
    })
  }

  // Calculate 364 days ago
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - 364)

  // Align to Sunday
  const startDayOfWeek = startDate.getDay() // 0 = Sun
  for (let i = 0; i < startDayOfWeek; i++) {
    cells.push({ id: `spacer-start-${i}`, isSpacer: true })
  }

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    
    if (activityMap[dateStr]) {
      cells.push({ id: dateStr, date: dateStr, level: activityMap[dateStr].level, count: activityMap[dateStr].count })
    } else {
      cells.push({ id: dateStr, date: dateStr, level: 0, count: 0 })
    }
  }

  return cells
})

// Generate Month Labels
const heatmapMonths = computed(() => {
  const months = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - 364)

  let currentMonth = -1
  let currentWeekCol = 1

  const startDayOfWeek = startDate.getDay()
  let dayCounter = startDayOfWeek

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    
    if (d.getMonth() !== currentMonth) {
      if (currentMonth !== -1) {
        months.push({
          label: d.toLocaleString('en-US', { month: 'short' }),
          col: currentWeekCol
        })
      }
      currentMonth = d.getMonth()
    }
    
    dayCounter++
    if (dayCounter > 6) {
      dayCounter = 0
      currentWeekCol++
    }
  }
  return months
})

</script>

<style scoped src="../../assets/css/components/dashboard/DashboardStats.css"></style>
