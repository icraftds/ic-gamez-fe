<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFriends } from '../../composables/useFriends'
import CyberLevel from '../ui/CyberLevel.vue'

const {
  isFriendsSidebarOpen,
  friends,
  searchResults,
  isSearching,
  isLoadingFriends,
  toggleFriendsSidebar,
  searchUsers,
  addFriend,
  removeFriend
} = useFriends()

const router = useRouter()
const searchQuery = ref('')
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

const visitProfile = (slug) => {
  if (slug) {
    toggleFriendsSidebar() // close sidebar
    router.push(`/coderz/${slug}`)
  }
}

const handleAddFriend = async (userId) => {
  await addFriend(userId)
  searchQuery.value = ''
  searchResults.value = []
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
            <img :src="user.avatar_url || '/images/default-avatar.png'" alt="Avatar" class="fs-avatar">
            <div class="fs-user-info">
              <div class="fs-user-name">{{ user.name }}</div>
              <div class="fs-user-slug">@{{ user.slug || user.id }}</div>
            </div>
            <div class="fs-user-actions">
              <button 
                class="fs-btn fs-btn-add" 
                @click="handleAddFriend(user.id)"
                v-if="!friends.find(f => f.id === user.id)"
                title="Tambah Teman"
              >
                <i class="fa-solid fa-user-plus"></i>
              </button>
              <button 
                class="fs-btn fs-btn-visit" 
                @click="visitProfile(user.slug)"
                v-if="user.slug"
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
            <img :src="friend.avatar_url || '/images/default-avatar.png'" alt="Avatar" class="fs-friend-avatar">
          </div>
          <div class="fs-friend-details">
            <div class="fs-friend-name">{{ friend.name }}</div>
            <div class="fs-friend-meta">
              <CyberLevel :level="friend.level" :size="'small'" />
            </div>
          </div>
          <div class="fs-friend-actions">
            <button class="fs-btn fs-btn-visit" @click="visitProfile(friend.slug)" v-if="friend.slug" title="Kunjungi Profil">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="fs-btn fs-btn-remove" @click="handleRemoveFriend(friend.id)" title="Hapus Teman">
              <i class="fa-solid fa-user-minus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
@import '@/assets/css/components/common/FriendsSidebar.css';
</style>
