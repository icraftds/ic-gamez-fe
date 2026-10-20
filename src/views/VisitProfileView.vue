<template>
  <div class="dashboard-container" style="padding: 100px 15px 50px 15px;">
    <div class="vp-content-wrapper" v-if="!isLoading && userProfile">
      <!-- TOP SECTION: GREETING HERO & PENCAPAIAN SIDEBAR -->
      <div class="dash-home-grid">
        <!-- MAIN COLUMN: GREETING CARD -->
        <div class="dash-main-col" style="position: relative;">
          <div class="vp-top-actions">
            <button class="vp-back-btn" @click="$router.back()">
              <i class="fa-solid fa-arrow-left"></i> Kembali
            </button>
          </div>
          
          <div class="dashboard-hero" style="margin-bottom: 0;">
            <div class="hero-content">
              <div class="user-info-section">
                <div class="avatar-wrapper">
                  <div class="user-avatar-cyber-wrapper">
                    <CyberBorder
                      :tierId="borderId"
                      :accountBadge="currentBadgeStatus"
                      :avatarUrl="userProfile.avatar_url || 'https://ui-avatars.com/api/?name=' + userProfile.name + '&background=random'"
                      :imageUrl="userProfile.active_border_url"
                    />
                  </div>
                </div>
                <div class="user-details" style="position: relative; width: 100%;">
                  <div class="vp-header-row">
                    <h1 class="greeting-text" style="margin: 0; display: flex; flex-direction: column; gap: 4px;">
                      <span class="highlight-name">{{ userProfile.username ? userProfile.username + '#' + userProfile.tag_id : userProfile.name }}</span>
                      <span class="user-tag" style="font-size: 0.95rem; color: #94a3b8; font-weight: 500;">
                        {{ userProfile.username ? userProfile.name : '@' + (userProfile.slug || userProfile.id) }}
                      </span>
                    </h1>

                    <!-- Tombol Add Friend sejajar dengan username di pojok kanan atas -->
                    <div class="vp-hero-actions">
                      <template v-if="loggedInUser && loggedInUser.id !== userProfile.id && !isAlreadyFriend">
                        <button v-if="hasIncomingRequest" @click="handleAcceptFriend" class="add-friend-btn vp-add-friend-hero" :disabled="isAddingFriend">
                          <TerminalLoader v-if="isAddingFriend" variant="inline" />
                          <i v-else class="fa-solid fa-check"></i>
                          <span class="btn-text">Terima Pertemanan</span>
                        </button>
                        <button v-else @click="handleAddFriend" class="add-friend-btn vp-add-friend-hero" :disabled="isAddingFriend || isPendingFriend">
                          <TerminalLoader v-if="isAddingFriend" variant="inline" />
                          <i v-else-if="isPendingFriend" class="fa-solid fa-clock"></i>
                          <i v-else class="fa-solid fa-user-plus"></i>
                          <span class="btn-text">{{ isPendingFriend ? 'Menunggu Persetujuan' : 'Add Friend' }}</span>
                        </button>
                      </template>
                      <div v-else-if="loggedInUser && loggedInUser.id !== userProfile.id && isAlreadyFriend" class="add-friend-btn vp-add-friend-hero vp-friend-badge">
                        <i class="fa-solid fa-user-check"></i>
                        <span class="btn-text">Berteman</span>
                      </div>
                      <div v-else-if="loggedInUser && loggedInUser.id === userProfile.id" class="add-friend-btn vp-add-friend-hero vp-self-badge">
                        <i class="fa-solid fa-user"></i>
                        <span class="btn-text">Profil Anda</span>
                      </div>
                    </div>
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
        </div>

        <!-- SIDE COLUMN: PERINGKAT LEADERBOARD -->
        <div class="dash-side-col">
          <div class="section-card vp-leaderboard-card">
            <div class="vp-card-header">
              <div class="vp-card-title-wrap">
                <div class="vp-trophy-badge">
                  <i class="fa-solid fa-trophy"></i>
                </div>
                <div>
                  <h2 class="section-title">Peringkat Leaderboard</h2>
                  <p class="section-desc">Papan peringkat global iC GameZ</p>
                </div>
              </div>
            </div>

            <div class="vp-rank-grid" v-if="stats?.rank">
              <div class="vp-rank-card">
                <div class="vp-rank-label">
                  <i class="fa-solid fa-calendar-days"></i>
                  <span>BULAN INI</span>
                </div>
                <div class="vp-rank-value-box">
                  <span class="vp-rank-number text-cyan" v-if="stats.rank.this_month">#{{ stats.rank.this_month }}</span>
                  <p class="vp-rank-empty" v-else>Belum ada XP bulan ini</p>
                  <span class="vp-rank-xp-pill" v-if="stats.xp?.this_month !== undefined || stats.rank?.this_month_xp !== undefined">
                    <CyberXp style="width: 13px; height: 13px; display: inline-block; vertical-align: middle;" />
                    {{ stats.xp?.this_month ?? stats.rank?.this_month_xp ?? 0 }} XP
                  </span>
                </div>
              </div>

              <div class="vp-rank-card highlight-rank">
                <div class="vp-rank-label">
                  <i class="fa-solid fa-crown text-amber"></i>
                  <span>SEPANJANG MASA</span>
                </div>
                <div class="vp-rank-value-box">
                  <span class="vp-rank-number text-amber" v-if="stats.rank.all_time">#{{ stats.rank.all_time }}</span>
                  <p class="vp-rank-empty" v-else>-</p>
                  <span class="vp-rank-xp-pill" v-if="stats.xp?.total || userProfile?.xp">
                    <CyberXp style="width: 13px; height: 13px; display: inline-block; vertical-align: middle;" />
                    {{ stats.xp?.total || userProfile?.xp }} XP
                  </span>
                </div>
              </div>
            </div>

            <div class="badges-empty" v-else>
              <i class="fa-solid fa-ranking-star" style="font-size: 2rem; color: #475569; margin-bottom: 10px;"></i>
              <p><strong>Belum Ada Data Peringkat</strong></p>
            </div>

            <router-link to="/leaderboard" class="vp-leaderboard-link">
              <span>Lihat Leaderboard Lengkap</span>
              <i class="fa-solid fa-arrow-right"></i>
            </router-link>
          </div>
        </div>
      </div>

      <!-- SECTION PENCAPAIAN (DIBAWAH CARD GREETING & LEADERBOARD) -->
      <div class="vp-achievements-section">
        <div class="section-card">
          <div class="card-header-with-tabs" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="vp-trophy-badge" style="background: rgba(245, 158, 11, 0.15); border-color: rgba(245, 158, 11, 0.3); color: #f59e0b;">
                <i class="fa-solid fa-medal"></i>
              </div>
              <div>
                <h2 class="section-title" style="margin: 0;">Pencapaian</h2>
                <span style="font-size: 0.85rem; color: #94a3b8;">{{ hasSavedShowcase ? 'Pencapaian pilihan' : 'Menampilkan pencapaian tertinggi' }}</span>
              </div>
            </div>

            <div class="showcase-tabs" style="display: flex; gap: 4px; background: rgba(0,0,0,0.2); padding: 4px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
              <button :class="{ active: activeTab === 'medali' }" @click="activeTab = 'medali'" class="tab-btn">Medali</button>
              <button :class="{ active: activeTab === 'piala' }" @click="activeTab = 'piala'" class="tab-btn">Piala</button>
              <button :class="{ active: activeTab === 'sertifikat' }" @click="activeTab = 'sertifikat'" class="tab-btn">Sertifikat</button>
            </div>
          </div>

          <div class="badges-empty" v-if="displayBadges.length === 0">
            <i class="fa-solid fa-medal" style="font-size: 2rem; color: #475569; margin-bottom: 10px;"></i>
            <p><strong>Belum Ada Pencapaian</strong></p>
          </div>
          
          <div class="badges-grid-full" v-else>
            <div class="badge-item-full" v-for="item in displayBadges" :key="item.id">
              <div class="badge-item-icon-box" style="display: flex; justify-content: center; align-items: center;">
                <CyberMedal v-if="activeTab === 'medali'" :tierId="item.tierId" :isLocked="false" :iconType="item.iconType" style="width: 100%; height: 100%;" />
                <CyberTrophy v-else-if="activeTab === 'piala'" :tier="item.tier" :icon="item.icon || 'none'" :size="65" />
                <i v-else :class="item.iconType" style="font-size: 2.2rem; color: #f59e0b;"></i>
              </div>
              <div class="badge-item-text">
                <span class="badge-item-name">{{ item.title || item.name }}</span>
                <span class="badge-item-desc">{{ activeTab === 'medali' ? 'Lencana Medali' : (activeTab === 'piala' ? 'Trofi Kejuaraan' : 'Sertifikat Resmi') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FULL WIDTH STATS COMPONENT -->
      <div class="vp-stats-section">
        <DashboardStats
          :userProfile="userProfile"
          :statsData="stats"
          :heatmapData="heatmapData"
          :isLoading="isLoading"
          :showTopStats="false"
          :showLeaderboard="false"
        />
      </div>
    </div>
    
    <TerminalLoader v-else-if="isLoading" label="profil" />
    
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
import CyberTrophy from '../components/ui/CyberTrophy.vue'
import DashboardStats from '../components/dashboard/DashboardStats.vue'
import { useUserAccount } from '../composables/useUserAccount'
import { useFriends } from '../composables/useFriends'
import { buildMedals, buildTrophies } from '../composables/useAchievements'

const route = useRoute()
const router = useRouter()
const { userProfile: loggedInUser } = useUserAccount()
const { friends, fetchFriends } = useFriends()

const isLoading = ref(true)
const isAddingFriend = ref(false)
const hasAdded = ref(false)
const isFriendFromApi = ref(false)
const isPendingFromApi = ref(false)
const hasIncomingRequest = ref(false)
const userProfile = ref(null)
const stats = ref(null)
const heatmapData = ref(null)

const activeTab = ref('medali')

const isAlreadyFriend = computed(() => {
  if (isFriendFromApi.value) return true
  if (userProfile.value && friends.value?.length > 0) {
    return friends.value.some(f => f.id === userProfile.value.id)
  }
  return false
})

const isPendingFriend = computed(() => {
  return hasAdded.value || isPendingFromApi.value
})

const fetchProfile = async () => {
  isLoading.value = true
  try {
    const slug = route.params.slug
    const res = await api.get(`/user/${slug}/profile`)
    if (res.data.success) {
      userProfile.value = res.data.data.user
      stats.value = res.data.data.stats
      heatmapData.value = res.data.data.heatmap
      if (res.data.data.is_friend !== undefined) {
        isFriendFromApi.value = Boolean(res.data.data.is_friend)
      }
      if (res.data.data.is_pending !== undefined) {
        isPendingFromApi.value = Boolean(res.data.data.is_pending)
      }
      if (res.data.data.has_incoming_request !== undefined) {
        hasIncomingRequest.value = Boolean(res.data.data.has_incoming_request)
      }
    }
  } catch (error) {
    console.error('Failed to fetch profile', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProfile()
  if (loggedInUser.value && (!friends.value || friends.value.length === 0)) {
    fetchFriends()
  }
})

const handleAddFriend = async () => {
  if (!userProfile.value) return
  isAddingFriend.value = true
  try {
    const res = await api.post('/user/friends', { friend_id: userProfile.value.id })
    if (res.data.success || res.status === 200) {
      if (res.data.message === 'Already friends') {
        isFriendFromApi.value = true
      } else {
        hasAdded.value = true
      }
      fetchFriends()
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

const handleAcceptFriend = async () => {
  if (!userProfile.value) return
  isAddingFriend.value = true
  try {
    const res = await api.post(`/user/friend-requests/${userProfile.value.id}/accept`)
    if (res.data.success || res.status === 200) {
      isFriendFromApi.value = true
      hasIncomingRequest.value = false
      fetchFriends()
    }
  } catch (error) {
    alert('Gagal menerima pertemanan')
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

// Katalog medali & piala sama persis dengan dashboard pemilik akun (useAchievements)
const earnedByTab = computed(() => {
  if (!stats.value || !userProfile.value) return { medali: [], piala: [], sertifikat: [] }
  const earnedMedalList = buildMedals(userProfile.value, stats.value).filter(m => m.earned)
  const earnedPialaList = buildTrophies(stats.value?.trophies || userProfile.value?.trophies || []).filter(p => p.earned)
  return { medali: earnedMedalList, piala: earnedPialaList, sertifikat: [] }
})

const MAX_SHOWCASE = 4

// Pilihan showcase milik user yang dikunjungi (dari DB, bukan localStorage)
const hasSavedShowcase = computed(() => Array.isArray(userProfile.value?.showcase_medals?.[activeTab.value]))

const displayBadges = computed(() => {
  const earned = earnedByTab.value[activeTab.value] || []
  const ids = userProfile.value?.showcase_medals?.[activeTab.value]
  if (Array.isArray(ids)) {
    return ids
      .map(id => earned.find(item => item.id === id))
      .filter(Boolean)
      .slice(0, MAX_SHOWCASE)
  }
  return [...earned].sort((a, b) => (b.tierId || b.tier || 0) - (a.tierId || a.tier || 0)).slice(0, MAX_SHOWCASE)
});
</script>

<style scoped src="../assets/css/components/dashboard/home/GreetingCard.css"></style>
<style scoped src="../assets/css/views/VisitProfileView.css"></style>

