<script setup>
import { ref, watch } from 'vue'
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

const pendingAddRequests = ref(new Set())

const handleAddFriend = async (userId) => {
  pendingAddRequests.value.add(userId)
  await addFriend(userId)
}

const handleRemoveFriend = async (userId) => {
  if (confirm('Hapus dari daftar teman?')) {
    await removeFriend(userId)
  }
}
</script>

<template>
  <div class="friends-sidebar-overlay" :class="{ 'is-open': isFriendsSidebarOpen }" @click="toggleFriendsSidebar"></div>
  
  <aside class="friends-sidebar" :class="{ 'is-open': isFriendsSidebarOpen }">
    <div class="fs-header">
      <h3><i class="fa-solid fa-user-group"></i> Daftar Teman</h3>
      <button class="fs-close-btn" @click="toggleFriendsSidebar" title="Tutup">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <div class="fs-tabs">
      <button class="fs-tab-btn" :class="{ active: activeTab === 'teman' }" @click="activeTab = 'teman'">Teman ({{ friends.length }})</button>
      <button class="fs-tab-btn" :class="{ active: activeTab === 'permintaan' }" @click="activeTab = 'permintaan'">Permintaan ({{ friendRequests.length }})</button>
    </div>

    <div class="fs-search-container">
      <div class="fs-search-input-wrapper">
        <i class="fa-solid fa-search fs-search-icon"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Cari teman (nama, slug, id)..." 
          class="fs-search-input"
        >
        <i v-if="isSearching" class="fa-solid fa-circle-notch fa-spin fs-search-spinner"></i>
      </div>

      <!-- Autocomplete Dropdown -->
      <div v-if="searchQuery.trim().length >= 2" class="fs-autocomplete-dropdown">
        <div v-if="isSearching && searchResults.length === 0" class="fs-search-msg">Mencari...</div>
        <div v-else-if="!isSearching && searchResults.length === 0" class="fs-search-msg">Tidak ditemukan.</div>
        <div v-else class="fs-search-results">
          <div v-for="user in searchResults" :key="user.id" class="fs-user-item">
            <img :src="user.avatar_url || 'https://ui-avatars.com/api/?name=' + user.name + '&background=random'" alt="Avatar" class="fs-avatar">
            <div class="fs-user-info">
              <div class="fs-user-name">{{ user.username ? user.username + '#' + user.tag_id : user.name }}</div>
              <div class="fs-user-slug">{{ user.username ? user.name : '@' + (user.slug || user.id) }}</div>
            </div>
            <div class="fs-user-actions">
              <button 
                class="fs-btn fs-btn-add" 
                @click="handleAddFriend(user.id)"
                v-if="!friends.find(f => f.id === user.id)"
                :title="pendingAddRequests.has(user.id) ? 'Permintaan Terkirim' : 'Tambah Teman'"
                :disabled="pendingAddRequests.has(user.id)"
                :style="pendingAddRequests.has(user.id) ? 'opacity: 0.5; cursor: not-allowed;' : ''"
              >
                <i class="fa-solid" :class="pendingAddRequests.has(user.id) ? 'fa-clock' : 'fa-user-plus'"></i>
              </button>
              <button 
                class="fs-btn fs-btn-visit" 
                @click="visitProfile(user.slug || user.id)"
                v-if="user.slug || user.id"
                title="Kunjungi Profil"
              >
                <i class="fa-solid fa-eye"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="fs-content">
      <div v-if="activeTab === 'teman'">
        <div v-if="isLoadingFriends" class="fs-loading">
          <i class="fa-solid fa-circle-notch fa-spin"></i> Memuat teman...
        </div>
        <div v-else-if="friends.length === 0" class="fs-empty">
          <i class="fa-solid fa-ghost"></i>
          <p>Belum ada teman. Cari dan tambah teman sekarang!</p>
        </div>
        <div v-else class="fs-friends-list">
          <div v-for="friend in friends" :key="friend.id" class="fs-friend-card">
            <div class="fs-friend-avatar-wrap">
              <img :src="friend.avatar_url || 'https://ui-avatars.com/api/?name=' + friend.name + '&background=random'" alt="Avatar" class="fs-friend-avatar">
            </div>
            <div class="fs-friend-details">
              <div class="fs-friend-name">{{ friend.username ? friend.username + '#' + friend.tag_id : friend.name }}</div>
              <div class="fs-friend-meta">
                <div style="width: 24px; height: 24px; display: inline-block;">
                  <CyberLevel :level="friend.level" :size="'small'" />
                </div>
                <span style="font-size: 0.85rem; font-weight: bold; color: var(--accent-color);">Lv. {{ friend.level }}</span>
              </div>
            </div>
            <div class="fs-friend-actions">
              <button class="fs-btn fs-btn-visit" @click="visitProfile(friend.slug || friend.id)" v-if="friend.slug || friend.id" title="Kunjungi Profil">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button class="fs-btn fs-btn-remove" @click="handleRemoveFriend(friend.id)" title="Hapus Teman">
                <i class="fa-solid fa-user-minus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'permintaan'">
        <div v-if="isLoadingRequests" class="fs-loading">
          <i class="fa-solid fa-circle-notch fa-spin"></i> Memuat permintaan...
        </div>
        <div v-else-if="friendRequests.length === 0" class="fs-empty-msg">
          <i class="fa-solid fa-envelope-open-text" style="font-size: 2rem; opacity: 0.5; margin-bottom: 10px; display: block;"></i>
          Belum ada permintaan pertemanan.
        </div>
        <div v-else class="fs-friends-list">
          <div v-for="request in friendRequests" :key="request.id" class="fs-friend-card">
            <div class="fs-friend-avatar-wrap">
              <img :src="request.avatar_url || 'https://ui-avatars.com/api/?name=' + request.name + '&background=random'" alt="Avatar" class="fs-friend-avatar">
            </div>
            <div class="fs-friend-details">
              <div class="fs-friend-name">{{ request.username ? request.username + '#' + request.tag_id : request.name }}</div>
              <div class="fs-friend-meta">
                <div style="width: 24px; height: 24px; display: inline-block;">
                  <CyberLevel :level="request.level" :size="'small'" />
                </div>
                <span style="font-size: 0.85rem; font-weight: bold; color: var(--accent-color);">Lv. {{ request.level }}</span>
              </div>
            </div>
            <div class="fs-friend-actions">
              <button class="fs-btn fs-btn-visit" @click="visitProfile(request.slug)" v-if="request.slug" title="Kunjungi Profil">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button class="fs-btn fs-btn-add" @click="acceptFriendRequest(request.id)" title="Terima">
                <i class="fa-solid fa-check"></i>
              </button>
              <button class="fs-btn fs-btn-remove" @click="rejectFriendRequest(request.id)" title="Tolak">
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
