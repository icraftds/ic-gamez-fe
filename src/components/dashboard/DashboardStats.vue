<template>
  <div class="gh-stats-container">
    <div v-if="isCurrentlyLoading" class="loading-state">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>Loading activity data...</p>
    </div>

    <template v-else-if="activeStats && activeHeatmap">
      
      <!-- XP & Streak Restored (Optional for Visit Page) -->
      <div v-if="showTopStats && activeStats.xp && activeStats.streak" class="gh-top-stats-grid">
        <div class="gh-stat-card">
          <span class="gh-stat-value text-cyan">{{ activeStats.xp.total || 0 }}</span>
          <span class="gh-stat-label">Total XP</span>
          <div class="gh-xp-mini" v-if="activeUser">
            <span>Level {{ activeStats.xp.level || activeUser.level || 1 }}</span>
            <span>{{ activeUser.xp || 0 }}/{{ activeStats.xp.next_level_xp || 1000 }} XP</span>
          </div>
          <div class="gh-xp-bar-bg"><div class="gh-xp-bar-fill" :style="{ width: xpPercentage + '%' }"></div></div>
          <p class="gh-xp-hint" v-if="activeUser && activeStats.xp.next_level_xp">{{ Math.max(0, activeStats.xp.next_level_xp - (activeUser.xp || 0)) }} XP lagi ke Level {{ (activeStats.xp.level || activeUser.level || 1) + 1 }}</p>
        </div>
        <div class="gh-stat-card">
          <span class="gh-stat-value text-orange">{{ activeStats.streak.current || 0 }}</span>
          <span class="gh-stat-label">Streak Hari Ini</span>
          <p class="gh-streak-sub">Streak terpanjang: <strong>{{ activeStats.streak.longest || 0 }} hari</strong></p>
        </div>
      </div>

      <!-- Top Text -->
      <div class="gh-header">
        <h2>{{ activeHeatmap.meta?.total_activities || 0 }} Aktivitas Belajar Setahun Terakhir</h2>
      </div>

      <!-- Heatmap Box -->
      <div class="gh-box">
        <div class="gh-heatmap-wrapper">
          <!-- Horizontal scrollable container for the heatmap matrix -->
          <div class="gh-heatmap-scroll">
            <div class="gh-heatmap-matrix">
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
            <p class="gh-contributed-text" v-if="activeStats.completed_exercises?.breakdown && Object.keys(activeStats.completed_exercises.breakdown).length > 0">
              <i class="fa-solid fa-book-open"></i> Menyelesaikan modul 
              <strong class="gh-highlight-link" v-for="(count, pathSlug, index) in activeStats.completed_exercises.breakdown" :key="pathSlug">
                <router-link :to="`/learning/${pathSlug}`" style="color: inherit; text-decoration: none;">
                  {{ pathSlug.replace('-', ' ') }}
                </router-link>{{ index < Object.keys(activeStats.completed_exercises.breakdown).length - 1 ? ', ' : '' }}
              </strong>
            </p>
            <p class="gh-contributed-text" v-else>
              <i class="fa-solid fa-book-open"></i> Belum ada aktivitas pembelajaran.
            </p>
          </div>
          <div class="gh-overview-right">
            <div class="gh-chart-bars" v-if="activeStats.completed_exercises?.breakdown && Object.keys(activeStats.completed_exercises.breakdown).length > 0">
              <div class="gh-chart-item" v-for="(count, pathSlug) in activeStats.completed_exercises.breakdown" :key="pathSlug">
                <span class="gh-chart-label" :title="pathSlug.replace('-', ' ')">{{ pathSlug.replace('-', ' ') }}</span>
                <div class="gh-chart-bar-bg">
                  <div class="gh-chart-bar-fill" :style="{ width: Math.min(100, (count / (activeStats.completed_exercises.total || 1) * 100)) + '%' }"></div>
                </div>
                <span class="gh-chart-pct">{{ Math.round((count / (activeStats.completed_exercises.total || 1)) * 100) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contribution Activity Timeline -->
      <div v-if="showTimeline" class="gh-timeline-section">
        <h3 class="gh-timeline-title">Riwayat Aktivitas</h3>
        <div class="gh-timeline-period">
          <span class="gh-period-label">Terkini</span>
          <div class="gh-period-line"></div>
        </div>
        
        <div class="gh-timeline-event" v-if="activeStats.completed_exercises?.total > 0">
          <div class="gh-event-icon-wrapper">
            <div class="gh-event-icon"><i class="fa-solid fa-code-commit"></i></div>
            <div class="gh-event-line"></div>
          </div>
          <div class="gh-event-body">
            <div class="gh-event-header">
              <h4>Menyelesaikan {{ activeStats.completed_exercises.total }} latihan di {{ Object.keys(activeStats.completed_exercises.breakdown || {}).length }} modul</h4>
              <i class="fa-solid fa-chevron-up"></i>
            </div>
            <ul class="gh-event-list">
              <li v-for="(count, pathSlug) in activeStats.completed_exercises.breakdown" :key="pathSlug">
                <div class="gh-event-list-left">
                  <router-link :to="`/learning/${pathSlug}`" class="gh-highlight-link">{{ pathSlug.replace('-', ' ') }}</router-link>
                  <span class="gh-event-list-count">{{ count }} latihan</span>
                </div>
                <div class="gh-event-list-right">
                  <div class="gh-mini-bar"><div class="gh-mini-bar-fill" :style="{ width: Math.min(100, (count / (activeStats.completed_exercises.total || 1) * 100)) + '%' }"></div></div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="gh-timeline-event" v-else>
          <div class="gh-event-icon-wrapper">
            <div class="gh-event-icon"><i class="fa-solid fa-bed"></i></div>
            <div class="gh-event-line"></div>
          </div>
          <div class="gh-event-body" style="padding: 6px 0;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">Masih belum ada aktivitas terkini.</p>
          </div>
        </div>
      </div>

      <!-- Leaderboard Rank -->
      <div v-if="showLeaderboard && activeStats.rank" class="gh-box" style="margin-top: 24px; padding: 24px;">
        <h3 style="margin-top: 0; font-size: 16px; font-weight: 400; margin-bottom: 16px;">Peringkat Leaderboard</h3>
        <div class="gh-rank-grid">
          <div class="gh-rank-card">
            <span class="gh-rank-period">BULAN INI</span>
            <span class="gh-rank-number" v-if="activeStats.rank.this_month">#{{ activeStats.rank.this_month }}</span>
            <p class="gh-rank-empty" v-else>Belum ada XP bulan ini</p>
          </div>
          <div class="gh-rank-card">
            <span class="gh-rank-period">SEPANJANG MASA</span>
            <span class="gh-rank-number" v-if="activeStats.rank.all_time">#{{ activeStats.rank.all_time }}</span>
            <p class="gh-rank-empty" v-else>-</p>
            <span class="gh-rank-xp" v-if="activeStats.xp?.total">{{ activeStats.xp.total }} XP</span>
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

const props = defineProps({
  userProfile: {
    type: Object,
    default: null
  },
  statsData: {
    type: Object,
    default: null
  },
  heatmapData: {
    type: Object,
    default: null
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  showTopStats: {
    type: Boolean,
    default: true
  },
  showTimeline: {
    type: Boolean,
    default: true
  },
  showLeaderboard: {
    type: Boolean,
    default: true
  }
})

const { userProfile: defaultUserProfile } = useUserAccount()
const {
  statsData: defaultStatsData,
  heatmapData: defaultHeatmapData,
  isLoadingStats,
  isLoadingHeatmap,
  fetchStats,
  fetchHeatmap
} = useDashboardStats()
const { openWipModal } = useWipModal()

onMounted(() => {
  if (!props.statsData) {
    fetchStats()
  }
  if (!props.heatmapData) {
    fetchHeatmap()
  }
})

const activeUser = computed(() => props.userProfile || defaultUserProfile.value)
const activeStats = computed(() => props.statsData || defaultStatsData.value)
const activeHeatmap = computed(() => props.heatmapData || defaultHeatmapData.value)

const isCurrentlyLoading = computed(() => {
  if (props.statsData || props.heatmapData) {
    return props.isLoading
  }
  return isLoadingStats.value || isLoadingHeatmap.value
})

const xpPercentage = computed(() => {
  if (!activeStats.value || !activeUser.value) return 0
  const curXp = activeUser.value.xp || 0
  const nextXp = activeStats.value.xp?.next_level_xp || ((activeUser.value.level || 1) * 1000)
  return Math.min(100, Math.round((curXp / nextXp) * 100))
})

// Generate Heatmap Cells with proper spacing for CSS Grid Auto Flow
const generatedHeatmapCells = computed(() => {
  const cells = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const activityMap = {}
  if (activeHeatmap.value && activeHeatmap.value.data) {
    activeHeatmap.value.data.forEach(item => {
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
    const dateStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
    
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
