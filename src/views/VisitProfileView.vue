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
            
            <template v-if="loggedInUser && loggedInUser.id !== userProfile.id && !isAlreadyFriend">
              <button v-if="hasIncomingRequest" @click="handleAcceptFriend" class="add-friend-btn vp-add-friend-top" :disabled="isAddingFriend">
                <i v-if="isAddingFriend" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-solid fa-check"></i>
                <span class="btn-text">Terima Pertemanan</span>
              </button>
              <button v-else @click="handleAddFriend" class="add-friend-btn vp-add-friend-top" :disabled="isAddingFriend || isPendingFriend">
                <i v-if="isAddingFriend" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else-if="isPendingFriend" class="fa-solid fa-clock"></i>
                <i v-else class="fa-solid fa-user-plus"></i>
                <span class="btn-text">{{ isPendingFriend ? 'Menunggu Persetujuan' : 'Add Friend' }}</span>
              </button>
            </template>
            <button v-else-if="loggedInUser && loggedInUser.id === userProfile.id" disabled class="add-friend-btn vp-add-friend-top" style="opacity: 0.6; cursor: not-allowed; background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); color: #ccc;">
              <i class="fa-solid fa-user"></i>
              <span class="btn-text">Profil Anda</span>
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
                    <h1 class="greeting-text" style="margin: 0; display: flex; flex-direction: column; gap: 5px;">
                      <span class="highlight-name">{{ userProfile.username ? userProfile.username + '#' + userProfile.tag_id : userProfile.name }}</span>
                      <span class="user-tag" style="font-size: 1rem; color: #94a3b8; font-weight: 500;">
                        {{ userProfile.username ? userProfile.name : '@' + (userProfile.slug || userProfile.id) }}
                      </span>
                    </h1>
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
                <span style="font-size: 0.85rem; color: #94a3b8;">{{ hasSavedShowcase ? 'Pencapaian pilihan' : 'Menampilkan pencapaian tertinggi' }}</span>
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

      <!-- FULL WIDTH STATS COMPONENT -->
      <div class="vp-stats-section">
        <DashboardStats
          :userProfile="userProfile"
          :statsData="stats"
          :heatmapData="heatmapData"
          :isLoading="isLoading"
          :showTopStats="false"
        />
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
import DashboardStats from '../components/dashboard/DashboardStats.vue'
import { useUserAccount } from '../composables/useUserAccount'
import { useFriends } from '../composables/useFriends'
import { buildMedals } from '../composables/useAchievements'

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

// Katalog medali sama persis dengan dashboard pemilik akun (useAchievements)
const earnedByTab = computed(() => {
  if (!stats.value || !userProfile.value) return { medali: [], piala: [], sertifikat: [] }
  const earned = buildMedals(userProfile.value, stats.value).filter(m => m.earned)
  return { medali: earned, piala: earned, sertifikat: [] }
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
  return [...earned].sort((a, b) => b.tierId - a.tierId).slice(0, MAX_SHOWCASE)
});
</script>

<style scoped src="../assets/css/components/dashboard/home/GreetingCard.css"></style>
<style scoped>
.vp-content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.vp-stats-section {
  width: 100%;
  max-width: 1200px;
  margin-top: 1.5rem;
  box-sizing: border-box;
}

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
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
}

.dash-main-col, .dash-side-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 1024px) {
  .dash-home-grid {
    grid-template-columns: 1fr;
  }
}

.vp-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  gap: 15px;
}

@media (max-width: 768px) {
  .vp-header-row {
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
}

.section-card {
  background: var(--glass-bg-card-0_6, rgba(15, 23, 42, 0.6));
  border: 1px solid var(--white-alpha-0_05, rgba(255, 255, 255, 0.05));
  border-radius: 20px;
  padding: 25px;
  backdrop-filter: blur(12px);
  height: 100%;
  box-sizing: border-box;
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

.vp-top-actions {
  position: absolute;
  top: -55px;
  left: 0;
  z-index: 10;
  display: flex;
  gap: 15px;
  align-items: center;
  width: 100%;
}

.vp-back-btn {
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

.vp-add-friend-top {
  padding: 10px 20px !important;
  border-radius: 30px !important;
  font-size: 0.95rem !important;
  gap: 10px !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .vp-top-actions {
    top: -48px;
    gap: 10px;
  }
  .vp-back-btn, .vp-add-friend-top {
    padding: 8px 16px !important;
    font-size: 0.85rem !important;
  }
}
</style>
