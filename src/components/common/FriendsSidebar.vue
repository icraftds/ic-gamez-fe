<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFriends } from '../../composables/useFriends'
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
  fetchFriendRequests,
  hasUnreadRequests,
  searchUsers,
  addFriend,
  removeFriend,
  acceptFriendRequest,
  rejectFriendRequest
} = useFriends()

const router = useRouter()
const searchQuery = ref('')
const activeTab = ref('teman')
let searchTimeout

onMounted(() => {
  fetchFriendRequests()
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
    toggleFriendsSidebar() // close sidebar
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
</script>

<template>
  <!-- Backdrop Blur Overlay -->
  <div 
    class="friends-sidebar-overlay" 
    :class="{ 'is-open': isFriendsSidebarOpen }" 
    @click="toggleFriendsSidebar"
  ></div>
  
  <aside class="friends-sidebar" :class="{ 'is-open': isFriendsSidebarOpen }">
    <!-- Sleek Floating Capsule Edge Tab (Matches Topbar & Leftbar Capsule Concept) -->
    <button 
      class="fs-edge-tab" 
      @click.stop="toggleFriendsSidebar"
      :class="{ 'is-open': isFriendsSidebarOpen }"
      :title="isFriendsSidebarOpen ? 'Tutup Teman' : 'Daftar Teman'"
      :aria-label="isFriendsSidebarOpen ? 'Tutup Teman' : 'Daftar Teman'"
      type="button"
    >
      <div class="fs-edge-tab-inner">
        <i class="fa-solid" :class="isFriendsSidebarOpen ? 'fa-xmark' : 'fa-user-group'"></i>
        <i v-if="!isFriendsSidebarOpen" class="fa-solid fa-chevron-left fs-edge-chevron"></i>
      </div>
      <!-- Red Dot Notification for New Friend Requests -->
      <span v-if="hasUnreadRequests" class="fs-tab-dot" title="Permintaan pertemanan baru"></span>
    </button>

    <!-- Header Section -->
    <div class="fs-header">
      <div class="fs-header-branding">
        <div class="fs-header-icon-box">
          <i class="fa-solid fa-user-group"></i>
        </div>
        <div class="fs-header-texts">
          <h3 class="fs-title">Daftar Teman</h3>
          <span class="fs-subtitle">Komunitas & Koneksi Game-Z</span>
        </div>
      </div>
      <button class="fs-close-btn" @click="toggleFriendsSidebar" title="Tutup">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <!-- Floating Capsule Tabs (Identical to Topbar & Leftbar Capsule Concept) -->
    <div class="fs-tabs-wrapper">
      <div class="fs-tabs-capsule">
        <button 
          class="fs-tab-pill" 
          :class="{ active: activeTab === 'teman' }" 
          @click="activeTab = 'teman'"
        >
          <i class="fa-solid fa-users"></i>
          <span>Teman</span>
          <span class="fs-tab-count">{{ friends.length }}</span>
        </button>
        <button 
          class="fs-tab-pill" 
          :class="{ active: activeTab === 'permintaan' }" 
          @click="activeTab = 'permintaan'"
        >
          <i class="fa-solid fa-user-plus"></i>
          <span>Permintaan</span>
          <span class="fs-tab-count" :class="{ 'has-badge': hasUnreadRequests }">{{ friendRequests.length }}</span>
        </button>
      </div>
    </div>

    <!-- Search Section -->
    <div class="fs-search-container">
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
