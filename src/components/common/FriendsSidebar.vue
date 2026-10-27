<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFriends } from '../../composables/useFriends'
import { useNotifications } from '../../composables/useNotifications'
import CyberLevel from '../ui/CyberLevel.vue'

const {
  isFriendsSidebarOpen,
  friends,
  friendRequests,
  searchResults,
  isSearching,
  isLoadingFriends,
  isLoadingRequests,
  toggleFriendsSidebar,
  fetchFriends,
  fetchFriendRequests,
  hasUnreadRequests,
  searchUsers,
  addFriend,
  removeFriend,
  acceptFriendRequest,
  rejectFriendRequest,
  initialSidebarTab
} = useFriends()

const {
  notifications,
  unreadCount,
  unclaimedRewardsCount,
  isLoadingNotifications,
  isClaiming,
  hasUnread,
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  claimReward
} = useNotifications()

const router = useRouter()
const searchQuery = ref('')
const activeTab = ref(initialSidebarTab.value || 'notifikasi')
const claimToast = ref(null)
let searchTimeout
let toastTimeout

onMounted(() => {
  fetchFriendRequests()
  if (isFriendsSidebarOpen.value && activeTab.value === 'notifikasi') {
    fetchNotifications()
  }
})

watch(initialSidebarTab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab
  }
})

watch(isFriendsSidebarOpen, (isOpen) => {
  if (isOpen) {
    if (activeTab.value === 'notifikasi') {
      fetchNotifications({ force: true })
    } else if (activeTab.value === 'teman') {
      if (friends.value.length === 0) fetchFriends()
    } else if (activeTab.value === 'permintaan') {
      fetchFriendRequests()
    }
  }
})

watch(activeTab, (tab) => {
  if (!isFriendsSidebarOpen.value) return
  if (tab === 'notifikasi') {
    fetchNotifications()
  } else if (tab === 'teman') {
    if (friends.value.length === 0) fetchFriends()
  } else if (tab === 'permintaan') {
    fetchFriendRequests()
  }
})

watch(searchQuery, (newVal) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (newVal.trim().length >= 2) {
      searchUsers(newVal.trim())
    } else {
      searchResults.value = []
    }
  }, 300)
})

const visitProfile = (slugOrId) => {
  if (slugOrId) {
    toggleFriendsSidebar()
    router.push(`/coderz/${slugOrId}`)
  }
}

const handleAddFriend = async (userId) => {
  await addFriend(userId)
}

const handleRemoveFriend = async (userId) => {
  if (confirm('Hapus dari daftar teman?')) {
    await removeFriend(userId)
  }
}

const handleNotifClick = (notif) => {
  if (!notif.is_read) {
    markAsRead(notif.id)
  }
}

const handleClaimReward = async (notif) => {
  const result = await claimReward(notif)
  if (result.success) {
    claimToast.value = result.message || `Berhasil mengklaim +${notif.reward_coinz} iCoinz!`
    clearTimeout(toastTimeout)
    toastTimeout = setTimeout(() => {
      claimToast.value = null
    }, 4500)
  } else {
    alert(result.message)
  }
}

const navigateCta = (url) => {
  toggleFriendsSidebar()
  if (url.startsWith('http://') || url.startsWith('https://')) {
    window.open(url, '_blank')
  } else {
    router.push(url)
  }
}

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffSec = Math.floor((now - date) / 1000)
  if (diffSec < 60) return 'Baru saja'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m lalu`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}j lalu`
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 7) return `${diffDay}h lalu`
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

const formatExpiryRemaining = (dateStr) => {
  if (!dateStr) return ''
  const expDate = new Date(dateStr)
  const diffSec = Math.floor((expDate - new Date()) / 1000)
  if (diffSec <= 0) return 'Kedaluwarsa'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `Berakhir dlm ${diffMin}m`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `Berakhir dlm ${diffHour}j`
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay <= 7) return `Berakhir dlm ${diffDay} hari`
  return `Hingga ${expDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`
}

const getCategoryIcon = (category) => {
  switch (category) {
    case 'maintenance': return 'fa-screwdriver-wrench'
    case 'new_feature': return 'fa-rocket'
    case 'gift': return 'fa-gift'
    default: return 'fa-bullhorn'
  }
}

const getCategoryLabel = (category) => {
  switch (category) {
    case 'maintenance': return 'Maintenance'
    case 'new_feature': return 'Fitur Baru'
    case 'gift': return 'Hadiah iCoinz'
    default: return 'Pengumuman'
  }
}
</script>

<template>
  <!-- Backdrop Blur Overlay -->
  <div 
    class="friends-sidebar-overlay" 
    :class="{ 'is-open': isFriendsSidebarOpen }" 
    @click="toggleFriendsSidebar()"
  ></div>
  
  <aside class="friends-sidebar" :class="{ 'is-open': isFriendsSidebarOpen }">
    <!-- Sleek Floating Capsule Edge Tab -->
    <button 
      class="fs-edge-tab" 
      @click.stop="toggleFriendsSidebar('teman')"
      :class="{ 'is-open': isFriendsSidebarOpen }"
      :title="isFriendsSidebarOpen ? 'Tutup Sidebar' : 'Buka Notifikasi & Teman'"
      :aria-label="isFriendsSidebarOpen ? 'Tutup Sidebar' : 'Buka Notifikasi & Teman'"
      type="button"
    >
      <div class="fs-edge-tab-inner">
        <i class="fa-solid" :class="isFriendsSidebarOpen ? 'fa-xmark' : (activeTab === 'notifikasi' ? 'fa-bell' : 'fa-user-group')"></i>
        <i v-if="!isFriendsSidebarOpen" class="fa-solid fa-chevron-left fs-edge-chevron"></i>
      </div>
      <!-- Notification Dot on edge tab -->
      <span v-if="unclaimedRewardsCount > 0" class="fs-tab-dot" style="background: #f59e0b; box-shadow: 0 0 8px #f59e0b;" title="Hadiah iCoinz tersedia!"></span>
      <span v-else-if="hasUnread || hasUnreadRequests" class="fs-tab-dot" title="Pesan atau permintaan baru"></span>
    </button>

    <!-- Header Section -->
    <div class="fs-header">
      <div class="fs-header-branding">
        <div class="fs-header-icon-box" :class="{ 'icon-notif': activeTab === 'notifikasi' }">
          <i class="fa-solid" :class="activeTab === 'notifikasi' ? 'fa-bell' : 'fa-user-group'"></i>
        </div>
        <div class="fs-header-texts">
          <h3 class="fs-title">{{ activeTab === 'notifikasi' ? 'Pusat Notifikasi' : 'Daftar Teman' }}</h3>
          <span class="fs-subtitle">{{ activeTab === 'notifikasi' ? 'Pengumuman Sistem & Kotak Hadiah' : 'Komunitas & Koneksi Game-Z' }}</span>
        </div>
      </div>
      <button class="fs-close-btn" @click="toggleFriendsSidebar()" title="Tutup">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <!-- Floating Capsule Tabs (3 Tabs: Pesan, Teman, Permintaan) -->
    <div class="fs-tabs-wrapper">
      <div class="fs-tabs-capsule">
        <button 
          class="fs-tab-pill" 
          :class="{ active: activeTab === 'notifikasi' }" 
          @click="activeTab = 'notifikasi'"
        >
          <i class="fa-solid fa-bell"></i>
          <span>Pesan</span>
          <!-- Gold badge if unclaimed gifts exist -->
          <span v-if="unclaimedRewardsCount > 0" class="fs-tab-count fs-gift-badge" title="Hadiah belum diklaim">
            <i class="fa-solid fa-gift"></i> {{ unclaimedRewardsCount }}
          </span>
          <span v-else-if="unreadCount > 0" class="fs-tab-count has-badge">{{ unreadCount }}</span>
        </button>

        <button 
          class="fs-tab-pill" 
          :class="{ active: activeTab === 'teman' }" 
          @click="activeTab = 'teman'"
        >
          <i class="fa-solid fa-users"></i>
          <span>Teman</span>
          <span v-if="friends.length > 0" class="fs-tab-count">{{ friends.length }}</span>
        </button>

        <button 
          class="fs-tab-pill" 
          :class="{ active: activeTab === 'permintaan' }" 
          @click="activeTab = 'permintaan'"
        >
          <i class="fa-solid fa-user-plus"></i>
          <span>Permintaan</span>
          <span v-if="friendRequests.length > 0" class="fs-tab-count" :class="{ 'has-badge': hasUnreadRequests }">{{ friendRequests.length }}</span>
        </button>
      </div>
    </div>

    <!-- Quick Action Toolbar for Notifications -->
    <div v-if="activeTab === 'notifikasi' && notifications.length > 0" class="fs-notif-toolbar">
      <span class="fs-notif-count-label">
        {{ notifications.length }} Pesan Masuk
      </span>
      <button v-if="unreadCount > 0" class="fs-btn-read-all" @click="markAllAsRead">
        <i class="fa-solid fa-check-double"></i>
        <span>Tandai Semua Dibaca</span>
      </button>
    </div>

    <!-- Claim Toast Notification Alert -->
    <transition name="dropdown-fade">
      <div v-if="claimToast" class="fs-claim-toast">
        <i class="fa-solid fa-circle-check"></i>
        <span>{{ claimToast }}</span>
      </div>
    </transition>

    <!-- Search Section (Only for Friends & Requests Tabs) -->
    <div v-if="activeTab !== 'notifikasi'" class="fs-search-container">
      <div class="fs-search-capsule">
        <i class="fa-solid fa-magnifying-glass fs-search-icon"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Cari teman (nama, slug, id)..." 
          class="fs-search-input"
        >
        <button 
          v-if="searchQuery.length > 0" 
          class="fs-search-clear-btn" 
          @click="searchQuery = ''"
          title="Hapus pencarian"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
        <TerminalLoader v-if="isSearching" variant="inline" size="sm" class="fs-search-spinner" />
      </div>

      <!-- Autocomplete Dropdown -->
      <transition name="dropdown-fade">
        <div v-if="searchQuery.trim().length >= 2" class="fs-autocomplete-dropdown">
          <div v-if="isSearching && searchResults.length === 0" class="fs-search-msg">
            <i class="fa-solid fa-circle-notch fa-spin"></i>
            <span>Mencari coderz...</span>
          </div>
          <div v-else-if="!isSearching && searchResults.length === 0" class="fs-search-msg fs-no-results">
            <i class="fa-regular fa-face-frown"></i>
            <span>Tidak ada user ditemukan.</span>
          </div>
          <div v-else class="fs-search-results">
            <div v-for="user in searchResults" :key="user.id" class="fs-user-item">
              <div class="fs-avatar-wrap" @click="visitProfile(user.slug || user.id)">
                <img :src="user.avatar_url || 'https://ui-avatars.com/api/?name=' + user.name + '&background=random'" alt="Avatar" class="fs-avatar">
              </div>
              <div class="fs-user-info" @click="visitProfile(user.slug || user.id)">
                <div class="fs-user-name">{{ user.username ? user.username + '#' + user.tag_id : user.name }}</div>
                <div class="fs-user-slug">{{ user.username ? user.name : '@' + (user.slug || user.id) }}</div>
              </div>
              <div class="fs-user-actions">
                <template v-if="!user.is_friend">
                  <button 
                    v-if="user.has_incoming_request"
                    class="fs-action-btn btn-accept" 
                    @click="acceptFriendRequest(user.id); toggleFriendsSidebar()"
                    title="Terima Permintaan"
                  >
                    <i class="fa-solid fa-check"></i>
                  </button>
                  <button 
                    v-else
                    class="fs-action-btn btn-add" 
                    @click="handleAddFriend(user.id)"
                    :title="user.is_pending ? 'Permintaan Terkirim' : 'Tambah Teman'"
                    :disabled="user.is_pending"
                    :class="{ 'is-pending': user.is_pending }"
                  >
                    <i class="fa-solid" :class="user.is_pending ? 'fa-clock' : 'fa-user-plus'"></i>
                  </button>
                </template>
                <button 
                  class="fs-action-btn btn-view" 
                  @click="visitProfile(user.slug || user.id)"
                  v-if="user.slug || user.id"
                  title="Lihat Profil"
                >
                  <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Content Area -->
    <div class="fs-content">
      <!-- 0. Tab Notifikasi & Pesan Hadiah -->
      <div v-if="activeTab === 'notifikasi'" class="fs-tab-content">
        <div v-if="isLoadingNotifications" class="fs-loading-wrap">
          <TerminalLoader size="sm" label="pesan" />
        </div>
        <div v-else-if="notifications.length === 0" class="fs-empty-state">
          <div class="fs-empty-icon-wrap icon-notif">
            <i class="fa-solid fa-envelope-open-text"></i>
          </div>
          <h4>Belum Ada Pesan</h4>
          <p>Pengumuman sistem, info maintenance, dan pesan hadiah dari admin akan tampil di sini.</p>
        </div>
        <div v-else class="fs-notifications-list">
          <div 
            v-for="notif in notifications" 
            :key="notif.id" 
            class="fs-notif-card"
            :class="[
              'category-' + notif.category,
              { 'is-unread': !notif.is_read, 'has-reward': notif.reward_coinz > 0 }
            ]"
            @click="handleNotifClick(notif)"
          >
            <!-- Header Row -->
            <div class="fs-notif-header">
              <div class="fs-notif-badge-group">
                <span class="fs-category-badge" :class="'cat-' + notif.category">
                  <i class="fa-solid" :class="getCategoryIcon(notif.category)"></i>
                  {{ getCategoryLabel(notif.category) }}
                </span>
                <span v-if="!notif.is_read" class="fs-unread-dot" title="Belum dibaca"></span>
              </div>
              <span class="fs-notif-time">{{ formatTimeAgo(notif.created_at) }}</span>
            </div>

            <!-- Title & Body -->
            <h4 class="fs-notif-title">{{ notif.title }}</h4>
            <p class="fs-notif-msg">{{ notif.message }}</p>

            <!-- Expiration / Deadline Info -->
            <div v-if="notif.expires_at" class="fs-notif-expiry">
              <i class="fa-regular fa-clock"></i>
              <span>{{ formatExpiryRemaining(notif.expires_at) }}</span>
            </div>

            <!-- Reward Gift Box (if has coinz) -->
            <div v-if="notif.reward_coinz > 0" class="fs-reward-box">
              <div class="fs-reward-info">
                <div class="fs-reward-coin-icon">
                  <i class="fa-solid fa-coins"></i>
                </div>
                <div class="fs-reward-texts">
                  <span class="fs-reward-label">Hadiah Bonus</span>
                  <span class="fs-reward-val">+{{ notif.reward_coinz.toLocaleString('id-ID') }} iCoinz</span>
                </div>
              </div>

              <div class="fs-reward-action">
                <button 
                  v-if="notif.can_claim" 
                  class="fs-btn-claim" 
                  :disabled="isClaiming[notif.id]"
                  @click.stop="handleClaimReward(notif)"
                >
                  <i v-if="isClaiming[notif.id]" class="fa-solid fa-circle-notch fa-spin"></i>
                  <template v-else>
                    <i class="fa-solid fa-gift"></i>
                    <span>Klaim</span>
                  </template>
                </button>
                <span v-else-if="notif.is_claimed" class="fs-badge-claimed">
                  <i class="fa-solid fa-check"></i> Sudah Diklaim
                </span>
                <span v-else-if="notif.is_expired" class="fs-badge-expired">
                  <i class="fa-solid fa-clock"></i> Kedaluwarsa
                </span>
              </div>
            </div>

            <!-- Optional CTA Link -->
            <div v-if="notif.action_url" class="fs-notif-action-row">
              <a 
                :href="notif.action_url" 
                class="fs-notif-cta-btn" 
                @click.prevent.stop="navigateCta(notif.action_url)"
              >
                <span>{{ notif.action_label || 'Lihat Selengkapnya' }}</span>
                <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 1. Teman Tab -->
      <div v-if="activeTab === 'teman'" class="fs-tab-content">
        <div v-if="isLoadingFriends" class="fs-loading-wrap">
          <TerminalLoader size="sm" label="teman" />
        </div>
        <div v-else-if="friends.length === 0" class="fs-empty-state">
          <div class="fs-empty-icon-wrap">
            <i class="fa-solid fa-user-group"></i>
          </div>
          <h4>Belum Ada Teman</h4>
          <p>Cari coderz lain melalui kolom pencarian di atas untuk mulai berteman dan terhubung!</p>
        </div>
        <div v-else class="fs-friends-list">
          <div v-for="friend in friends" :key="friend.id" class="fs-friend-card">
            <div class="fs-friend-avatar-wrap" @click="visitProfile(friend.slug || friend.id)">
              <img :src="friend.avatar_url || 'https://ui-avatars.com/api/?name=' + friend.name + '&background=random'" alt="Avatar" class="fs-friend-avatar">
            </div>
            <div class="fs-friend-details" @click="visitProfile(friend.slug || friend.id)">
              <div class="fs-friend-name">{{ friend.username ? friend.username + '#' + friend.tag_id : friend.name }}</div>
              <div class="fs-friend-meta">
                <div class="fs-cyber-level-box">
                  <CyberLevel :level="friend.level" :size="'small'" />
                </div>
                <span class="fs-level-badge">Lv. {{ friend.level }}</span>
              </div>
            </div>
            <div class="fs-friend-actions">
              <button class="fs-action-btn btn-view" @click="visitProfile(friend.slug || friend.id)" v-if="friend.slug || friend.id" title="Kunjungi Profil">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </button>
              <button class="fs-action-btn btn-remove" @click="handleRemoveFriend(friend.id)" title="Hapus Teman">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Permintaan Tab -->
      <div v-if="activeTab === 'permintaan'" class="fs-tab-content">
        <div v-if="isLoadingRequests" class="fs-loading-wrap">
          <TerminalLoader size="sm" label="permintaan" />
        </div>
        <div v-else-if="friendRequests.length === 0" class="fs-empty-state">
          <div class="fs-empty-icon-wrap icon-requests">
            <i class="fa-regular fa-envelope-open"></i>
          </div>
          <h4>Tidak Ada Permintaan</h4>
          <p>Belum ada permintaan pertemanan yang masuk saat ini.</p>
        </div>
        <div v-else class="fs-friends-list">
          <div v-for="request in friendRequests" :key="request.id" class="fs-friend-card request-card">
            <div class="fs-friend-avatar-wrap" @click="visitProfile(request.slug)">
              <img :src="request.avatar_url || 'https://ui-avatars.com/api/?name=' + request.name + '&background=random'" alt="Avatar" class="fs-friend-avatar">
            </div>
            <div class="fs-friend-details" @click="visitProfile(request.slug)">
              <div class="fs-friend-name">{{ request.username ? request.username + '#' + request.tag_id : request.name }}</div>
              <div class="fs-friend-meta">
                <div class="fs-cyber-level-box">
                  <CyberLevel :level="request.level" :size="'small'" />
                </div>
                <span class="fs-level-badge">Lv. {{ request.level }}</span>
              </div>
            </div>
            <div class="fs-friend-actions">
              <button class="fs-action-btn btn-view" @click="visitProfile(request.slug)" v-if="request.slug" title="Kunjungi Profil">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </button>
              <button class="fs-action-btn btn-accept" @click="acceptFriendRequest(request.id)" title="Terima Permintaan">
                <i class="fa-solid fa-check"></i>
              </button>
              <button class="fs-action-btn btn-remove" @click="rejectFriendRequest(request.id)" title="Tolak Permintaan">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
@import '../../assets/css/components/common/FriendsSidebar.css';
</style>
