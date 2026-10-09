<template>
  <div class="dashboard-container" style="padding-top: 100px; padding-bottom: 50px;">
    <div class="dash-home-grid" v-if="!isLoading && userProfile">
      <!-- MAIN COLUMN: GREETING CARD & STATS -->
      <div class="dash-main-col" style="position: relative;">
        <button class="vp-back-btn" @click="$router.back()">
          <i class="fa-solid fa-arrow-left"></i> Kembali
        </button>
        <div class="dashboard-hero" style="margin-bottom: 0;">
          <div class="hero-content">
            <div class="user-info-section">
              <div class="avatar-wrapper">
                <div class="user-avatar-cyber-wrapper">
                  <CyberBorder
                    :tierId="borderId"
                    :accountBadge="currentBadgeStatus"
                    :avatarUrl="userProfile.avatar_url || 'https://ui-avatars.com/api/?name=' + userProfile.name + '&background=random'"
                  />
                </div>
              </div>
              <div class="user-details" style="position: relative; width: 100%;">
                <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                  <h1 class="greeting-text" style="margin: 0;">
                    <span class="highlight-name">{{ userProfile.name }}</span>
                  </h1>
                  <button v-if="loggedInUser && loggedInUser.id !== userProfile.id" @click="handleAddFriend" class="add-friend-btn" :disabled="isAddingFriend || hasAdded">
                    <i v-if="isAddingFriend" class="fa-solid fa-spinner fa-spin"></i>
                    <i v-else-if="hasAdded" class="fa-solid fa-clock"></i>
                    <i v-else class="fa-solid fa-user-plus"></i>
                    <span class="btn-text">{{ hasAdded ? 'Menunggu Persetujuan' : 'Add Friend' }}</span>
                  </button>
                  <button v-else-if="loggedInUser && loggedInUser.id === userProfile.id" disabled class="add-friend-btn" style="opacity: 0.6; cursor: not-allowed; background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); color: #ccc;">
                    <i class="fa-solid fa-user"></i>
                    <span class="btn-text">Profil Anda</span>
                  </button>
                </div>
                <p class="motivational-text">Pemain aktif di iC GameZ</p>
                
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
            
            <!-- STATS GRID -->
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
                  <span class="stat-value">{{ userProfile.streak_days || userProfile.longest_streak || 0 }} Hari</span>
                  <span class="stat-label">Streak</span>
                </div>
              </div>
              <div class="stat-card lesson-stat">
                <div class="stat-icon"><i class="fa-solid fa-book-open"></i></div>
                <div class="stat-info">
                  <span class="stat-value">{{ stats?.completed_lessons || 0 }}</span>
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

        <!-- STATS HEATMAP & TIMELINE -->
        <div class="gh-stats-container" v-if="stats && heatmapData">
          <!-- Top Text -->
          <div class="gh-header">
            <h2>{{ heatmapData.meta?.total_activities || 0 }} Aktivitas Belajar Setahun Terakhir</h2>
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
                <span style="color: #64748b; font-size: 12px;">Kontribusi dinilai dari aktivitas belajar harian</span>
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
                <p class="gh-contributed-text" v-if="stats.completed_exercises?.breakdown && Object.keys(stats.completed_exercises.breakdown).length > 0">
                  <i class="fa-solid fa-book-open"></i> Menyelesaikan modul 
                  <strong class="gh-highlight-link" v-for="(count, pathSlug, index) in stats.completed_exercises.breakdown" :key="pathSlug">
                    <router-link :to="`/learning/${pathSlug}`" style="color: inherit; text-decoration: none;">
                      {{ pathSlug.replace('-', ' ') }}
                    </router-link>{{ index < Object.keys(stats.completed_exercises.breakdown).length - 1 ? ', ' : '' }}
                  </strong>
                </p>
                <p class="gh-contributed-text" v-else>
                  <i class="fa-solid fa-book-open"></i> Belum ada aktivitas pembelajaran.
                </p>
              </div>
              <div class="gh-overview-right">
                <div class="gh-chart-bars">
                  <div class="gh-chart-item" v-for="(count, pathSlug) in stats.completed_exercises?.breakdown || {}" :key="pathSlug">
                    <span class="gh-chart-label">{{ pathSlug.replace('-', ' ') }}</span>
                    <div class="gh-chart-bar-bg">
                      <div class="gh-chart-bar-fill" :style="{ width: (count / stats.completed_exercises.total * 100) + '%' }"></div>
                    </div>
                    <span class="gh-chart-pct">{{ Math.round((count / stats.completed_exercises.total) * 100) }}%</span>
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
            
            <div class="gh-timeline-event" v-if="stats.completed_exercises?.total > 0">
              <div class="gh-event-icon-wrapper">
                <div class="gh-event-icon"><i class="fa-solid fa-code-commit"></i></div>
                <div class="gh-event-line"></div>
              </div>
              <div class="gh-event-body">
                <div class="gh-event-header">
                  <h4>Menyelesaikan {{ stats.completed_exercises.total }} latihan di {{ Object.keys(stats.completed_exercises.breakdown).length }} modul</h4>
                  <i class="fa-solid fa-chevron-up"></i>
                </div>
                <ul class="gh-event-list">
                  <li v-for="(count, pathSlug) in stats.completed_exercises.breakdown" :key="pathSlug">
                    <div class="gh-event-list-left">
                      <router-link :to="`/learning/${pathSlug}`" class="gh-highlight-link">{{ pathSlug.replace('-', ' ') }}</router-link>
                      <span class="gh-event-list-count">{{ count }} latihan</span>
                    </div>
                    <div class="gh-event-list-right">
                      <div class="gh-mini-bar"><div class="gh-mini-bar-fill" :style="{ width: (count / stats.completed_exercises.total * 100) + '%' }"></div></div>
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
              <div class="gh-event-body" style="padding: 10px 0;">
                <p style="color: #64748b; font-size: 14px;">Masih belum ada aktivitas terkini.</p>
              </div>
            </div>
          </div>

          <!-- Leaderboard Rank -->
          <div class="gh-box" style="margin-top: 24px; padding: 24px;">
            <h3 style="margin-top: 0; font-size: 16px; font-weight: 400; margin-bottom: 16px;">Peringkat Leaderboard</h3>
            <div class="gh-rank-grid">
              <div class="gh-rank-card">
                <span class="gh-rank-period">BULAN INI</span>
                <span class="gh-rank-number" v-if="stats.rank?.this_month">#{{ stats.rank.this_month }}</span>
                <p class="gh-rank-empty" v-else>Belum ada XP bulan ini</p>
              </div>
              <div class="gh-rank-card">
                <span class="gh-rank-period">SEPANJANG MASA</span>
                <span class="gh-rank-number" v-if="stats.rank?.all_time">#{{ stats.rank.all_time }}</span>
                <p class="gh-rank-empty" v-else>-</p>
                <span class="gh-rank-xp" v-if="stats.xp?.total">{{ stats.xp.total }} XP</span>
              </div>
            </div>
            <router-link to="/leaderboard" class="gh-highlight-link" style="display: block; margin-top: 16px; font-size: 14px;">Lihat Leaderboard Lengkap →</router-link>
          </div>
        </div>
      </div>

      <!-- SIDE COLUMN: PENCAPAIAN -->
      <div class="dash-side-col">
        <div class="badge-collection-wrapper">
          <div class="section-card">
            <div class="card-header-with-tabs" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px;">
              <h2 class="section-title" style="margin: 0;">Pencapaian</h2>
              <div class="showcase-tabs" style="display: flex; gap: 4px; background: rgba(0,0,0,0.2); padding: 4px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                <button :class="{ active: activeTab === 'medali' }" @click="activeTab = 'medali'" class="tab-btn">Medali</button>
                <button :class="{ active: activeTab === 'piala' }" @click="activeTab = 'piala'" class="tab-btn">Piala</button>
                <button :class="{ active: activeTab === 'sertifikat' }" @click="activeTab = 'sertifikat'" class="tab-btn">Sertifikat</button>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <span style="font-size: 0.85rem; color: #94a3b8;">Menampilkan pencapaian tertinggi</span>
            </div>

            <div class="badges-empty" v-if="displayBadges.length === 0">
              <i class="fa-solid fa-medal" style="font-size: 2rem; color: #475569; margin-bottom: 10px;"></i>
              <p><strong>Belum Ada Pencapaian</strong></p>
            </div>
            
            <div class="badges-grid" v-else style="display: grid; grid-template-columns: 1fr; gap: 15px; margin-bottom: 20px;">
              <div class="badge-item" v-for="item in displayBadges" :key="item.id" style="display: flex; flex-direction: row; align-items: center; background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                <div style="width: 50px; height: 50px; margin-right: 15px; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                  <CyberMedal v-if="activeTab !== 'sertifikat'" :tierId="item.tierId" :isLocked="false" :iconType="item.iconType" style="width: 100%; height: 100%;" />
                  <i v-else :class="item.iconType" style="font-size: 2.5rem; color: #f59e0b;"></i>
                </div>
                <span style="font-size: 0.9rem; color: #e2e8f0; font-weight: 500;">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Memuat profil...</p>
    </div>
    
    <div v-else class="error-state">
      <h2><i class="fa-solid fa-triangle-exclamation"></i> Profil Tidak Ditemukan</h2>
      <p>User yang kamu cari mungkin tidak ada atau URL salah.</p>
      <button @click="$router.push('/dashboard')" class="btn-primary">Kembali ke Dashboard</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import CyberBorder from '../components/ui/CyberBorder.vue'
import CyberXp from '../components/ui/CyberXp.vue'
import CyberMedal from '../components/ui/CyberMedal.vue'
import { useUserAccount } from '../composables/useUserAccount'

const route = useRoute()
const router = useRouter()
const { userProfile: loggedInUser } = useUserAccount()

const isLoading = ref(true)
const isAddingFriend = ref(false)
const hasAdded = ref(false)
const userProfile = ref(null)
const stats = ref(null)
const heatmapData = ref(null)

const activeTab = ref('medali')

const fetchProfile = async () => {
  isLoading.value = true
  try {
    const slug = route.params.slug
    const res = await api.get(`/user/${slug}/profile`)
    if (res.data.success) {
      userProfile.value = res.data.data.user
      stats.value = res.data.data.stats
      heatmapData.value = res.data.data.heatmap
    }
  } catch (error) {
    console.error('Failed to fetch profile', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})

const handleAddFriend = async () => {
  if (!userProfile.value) return
  isAddingFriend.value = true
  try {
    const res = await api.post('/user/friends', { friend_id: userProfile.value.id })
    if (res.data.success || res.status === 200) {
      hasAdded.value = true
    }
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('yourself')) {
      alert('Tidak bisa menambah diri sendiri.')
    } else {
      alert('Gagal menambah teman')
    }
  } finally {
    isAddingFriend.value = false
  }
}

const xpPercentage = computed(() => {
  if (!userProfile.value) return 0
  const current = userProfile.value.xp || 0
  const max = (userProfile.value.level || 1) * 1000
  return Math.min(100, Math.max(0, (current / max) * 100))
})

const currentPlan = computed(() => {
  return userProfile.value?.subscription?.plan_model?.slug || 'free'
})

const currentBadgeStatus = computed(() => {
  if (currentPlan.value === 'expert') return 'EXPERT';
  if (currentPlan.value === 'pro' || userProfile.value?.is_premium) return 'PRO';
  return 'FREE';
});

const borderId = computed(() => {
  if (userProfile.value?.active_border_id) return userProfile.value.active_border_id;
  if (currentPlan.value === 'expert') return 'D_EXPERT';
  if (currentPlan.value === 'pro' || userProfile.value?.is_premium) return 'D_PRO';
  return 'D_FREE';
});

// --- HEATMAP GENERATION LOGIC ---
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
    const dateStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
    
    if (activityMap[dateStr]) {
      cells.push({ id: dateStr, date: dateStr, level: activityMap[dateStr].level, count: activityMap[dateStr].count })
    } else {
      cells.push({ id: dateStr, date: dateStr, level: 0, count: 0 })
    }
  }

  return cells
})

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
// --- END HEATMAP LOGIC ---

// Calculate badges identically to useAchievements
const allMedals = computed(() => {
  if (!stats.value || !userProfile.value) return [];
  const sqlCount = (stats.value.completed_exercises?.breakdown?.sql || 0) + (stats.value.events?.daily || 0);
  const feCount = stats.value.completed_exercises?.breakdown?.frontend || 0;
  const streakCount = userProfile.value.longest_streak || 0;
  const lvlCount = userProfile.value.level || 1;
  
  return [
    { id: 'sql-1', category: 'sql', iconType: 'sql', tierId: 1, name: 'Halo, SELECT!', earned: sqlCount >= 1 },
    { id: 'sql-2', category: 'sql', iconType: 'sql', tierId: 2, name: 'Lagi Anget-Angetnya', earned: sqlCount >= 5 },
    { id: 'sql-3', category: 'sql', iconType: 'sql', tierId: 3, name: 'Mulai Ketagihan Ngulik', earned: sqlCount >= 10 },
    { id: 'sql-4', category: 'sql', iconType: 'sql', tierId: 4, name: 'Pendekar Query', earned: sqlCount >= 25 },
    { id: 'sql-5', category: 'sql', iconType: 'sql', tierId: 5, name: 'Suhu SQL', earned: sqlCount >= 50 },
    { id: 'sql-6', category: 'sql', iconType: 'sql', tierId: 6, name: 'Master Data', earned: sqlCount >= 75 },
    { id: 'sql-7', category: 'sql', iconType: 'sql', tierId: 7, name: 'Legenda Ngulik SQL', earned: sqlCount >= 100 },
    { id: 'fe-1', category: 'frontend', iconType: 'frontend', tierId: 1, name: 'Hello, World!', earned: feCount >= 1 },
    { id: 'fe-2', category: 'frontend', iconType: 'frontend', tierId: 2, name: 'CSS Wizard', earned: feCount >= 5 },
    { id: 'fe-3', category: 'frontend', iconType: 'frontend', tierId: 3, name: 'DOM Tamer', earned: feCount >= 10 },
    { id: 'fe-4', category: 'frontend', iconType: 'frontend', tierId: 4, name: 'JS Manipulator', earned: feCount >= 25 },
    { id: 'fe-5', category: 'frontend', iconType: 'frontend', tierId: 5, name: 'Frontend Ninja', earned: feCount >= 50 },
    { id: 'fe-6', category: 'frontend', iconType: 'frontend', tierId: 6, name: 'React Architect', earned: feCount >= 75 },
    { id: 'fe-7', category: 'frontend', iconType: 'frontend', tierId: 7, name: 'Dewa Frontend', earned: feCount >= 100 },
    { id: 'st-1', category: 'streak', iconType: 'streak', tierId: 1, name: 'Pemanasan', earned: streakCount >= 3 },
    { id: 'st-2', category: 'streak', iconType: 'streak', tierId: 2, name: 'Konsisten 7 Hari', earned: streakCount >= 7 },
    { id: 'st-3', category: 'streak', iconType: 'streak', tierId: 3, name: 'Pecandu Belajar', earned: streakCount >= 14 },
    { id: 'st-4', category: 'streak', iconType: 'streak', tierId: 4, name: 'Maraton 30 Hari', earned: streakCount >= 30 },
    { id: 'st-5', category: 'streak', iconType: 'streak', tierId: 5, name: 'Mesin Pembelajaran', earned: streakCount >= 60 },
    { id: 'st-6', category: 'streak', iconType: 'streak', tierId: 6, name: 'Satu Abad Streak', earned: streakCount >= 100 },
    { id: 'st-7', category: 'streak', iconType: 'streak', tierId: 7, name: 'Tahun Kejayaan', earned: streakCount >= 365 },
    { id: 'lv-1', category: 'level', iconType: 'level', tierId: 1, name: 'Pendatang Baru', earned: lvlCount >= 5 },
    { id: 'lv-2', category: 'level', iconType: 'level', tierId: 2, name: 'Petualang Muda', earned: lvlCount >= 25 },
    { id: 'lv-3', category: 'level', iconType: 'level', tierId: 3, name: 'Ksatria Kode', earned: lvlCount >= 50 },
    { id: 'lv-4', category: 'level', iconType: 'level', tierId: 4, name: 'Veteran Tempur', earned: lvlCount >= 75 },
    { id: 'lv-5', category: 'level', iconType: 'level', tierId: 5, name: 'Master GameZ', earned: lvlCount >= 100 },
    { id: 'lv-6', category: 'level', iconType: 'level', tierId: 6, name: 'Grandmaster', earned: lvlCount >= 125 },
    { id: 'lv-7', category: 'level', iconType: 'level', tierId: 7, name: 'Legenda iC GameZ', earned: lvlCount >= 150 },
  ];
});

const displayBadges = computed(() => {
  if (activeTab.value === 'sertifikat') return [];
  return allMedals.value.filter(m => m.earned).sort((a, b) => b.tierId - a.tierId).slice(0, 4);
});
</script>

<style scoped src="../assets/css/components/dashboard/home/GreetingCard.css"></style>
<style scoped src="../assets/css/components/dashboard/DashboardStats.css"></style>
<style scoped>
.tab-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn:hover {
  color: #e2e8f0;
}
.tab-btn.active {
  background: var(--primary, #8b5cf6);
  color: var(--bg-card, #1e293b) !important;
  box-shadow: 0 2px 10px rgba(139, 92, 246, 0.3);
}

.dash-home-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  padding-bottom: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dash-main-col, .dash-side-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .dash-home-grid {
    grid-template-columns: 1fr;
  }
}

.section-card {
  background: var(--glass-bg-card-0_6, rgba(15, 23, 42, 0.6));
  border: 1px solid var(--white-alpha-0_05, rgba(255, 255, 255, 0.05));
  border-radius: 20px;
  padding: 25px;
  backdrop-filter: blur(12px);
  height: 100%;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
}

.badges-empty {
  text-align: center;
  padding: 40px 0;
  color: #94a3b8;
}

.loading-state, .error-state {
  text-align: center;
  padding: 100px 20px;
  color: #f8fafc;
}
.spinner {
  border: 4px solid rgba(0, 240, 255, 0.2);
  border-top: 4px solid #00f0ff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.btn-primary {
  background: linear-gradient(135deg, #00f0ff, #0066ff);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}

/* Add Friend Button */
.add-friend-btn {
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.3);
  color: #0ea5e9;
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.add-friend-btn:hover:not(:disabled) {
  background: rgba(14, 165, 233, 0.2);
  border-color: #0ea5e9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
}

.add-friend-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.add-friend-btn .fa-check {
  color: #10b981;
}

@media (max-width: 600px) {
  .add-friend-btn .btn-text {
    display: none;
  }
  .add-friend-btn {
    padding: 10px;
    border-radius: 50%;
  }
}

.vp-back-btn {
  position: absolute;
  top: -55px;
  left: 0;
  z-index: 10;
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  padding: 10px 20px;
  border-radius: 30px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: max-content;
  align-self: flex-start;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.vp-back-btn:hover {
  background: rgba(14, 165, 233, 0.15);
  border-color: rgba(14, 165, 233, 0.5);
  color: #fff;
  transform: translateX(-5px);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.25);
}
.vp-back-btn i {
  color: #0ea5e9;
  font-size: 1.1rem;
}
</style>
