<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
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

const router = useRouter()
const searchQuery = ref('')
const activeTab = ref(initialSidebarTab.value === 'permintaan' ? 'permintaan' : 'teman')
let searchTimeout

/* ═══════════════════════════════════════════════════════════════
   ASSISTIVETOUCH / DRAGGABLE EDGE SNAPPING LOGIC (iCraftDS style)
   ═══════════════════════════════════════════════════════════════ */
const STORAGE_KEY = 'ic_friends_btn_pos_v2'
const edgeTabRef = ref(null)

const isDragging = ref(false)
const dockSide = ref('right') // 'left' | 'right'
const dockYRatio = ref(0.5) // default middle of screen (50%)
const dragScreenX = ref(0)
const dragScreenY = ref(0)

const viewportW = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)
const viewportH = ref(typeof window !== 'undefined' ? window.innerHeight : 800)

let pointerActive = false
let pointerId = -1
let startClientX = 0
let startClientY = 0
let startScreenX = 0
let startScreenY = 0
let hasMoved = false
let suppressNextClick = false

const getBtnMetrics = () => {
  const isMobile = viewportW.value <= 768
  const width = isMobile ? 44 : 52
  const height = isMobile ? 40 : 48
  const minY = isMobile ? 65 : 75
  const maxY = Math.max(minY, viewportH.value - height - (isMobile ? 25 : 30))
  return { isMobile, width, height, minY, maxY }
}

const loadSavedPosition = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.dockSide === 'left' || parsed.dockSide === 'right') {
        dockSide.value = parsed.dockSide
      }
      if (typeof parsed.dockYRatio === 'number' && !isNaN(parsed.dockYRatio)) {
        dockYRatio.value = Math.min(0.92, Math.max(0.08, parsed.dockYRatio))
      }
    }
  } catch (err) {
    console.warn('Failed to load friends button position', err)
  }
}

const savePosition = () => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        dockSide: dockSide.value,
        dockYRatio: dockYRatio.value
      })
    )
  } catch (err) {
    // Ignore storage quota/security errors
  }
}

const handleResize = () => {
  viewportW.value = window.innerWidth
  viewportH.value = window.innerHeight
}

const buttonStyle = computed(() => {
  const { isMobile, width, height, minY, maxY } = getBtnMetrics()
  
  if (isDragging.value) {
    return {
      left: `${dragScreenX.value}px`,
      top: `${dragScreenY.value}px`,
      transition: 'none',
      cursor: 'grabbing'
    }
  }

  // Not dragging: Docked state
  const currentY = Math.min(maxY, Math.max(minY, dockYRatio.value * viewportH.value))

  // When sidebar is open on mobile: hide floating button to avoid UI clash
  if (isFriendsSidebarOpen.value && isMobile) {
    return {
      left: dockSide.value === 'left' ? '0px' : `${viewportW.value - width}px`,
      top: `${currentY}px`,
      opacity: '0',
      pointerEvents: 'none'
    }
  }

  // When sidebar is open on desktop (drawer width is 390px):
  if (isFriendsSidebarOpen.value) {
    if (dockSide.value === 'left') {
      return {
        left: '390px',
        top: `${currentY}px`
      }
    } else {
      return {
        left: `${viewportW.value - 390 - width}px`,
        top: `${currentY}px`
      }
    }
  }

  // When sidebar is closed: docked flush to left or right edge
  if (dockSide.value === 'left') {
    return {
      left: '0px',
      top: `${currentY}px`
    }
  } else {
    return {
      left: `${viewportW.value - width}px`,
      top: `${currentY}px`
    }
  }
})

function handlePointerDown(e) {
  if (e.pointerType === 'mouse' && e.button !== 0) return

  const { width, minY, maxY } = getBtnMetrics()
  const btnEl = edgeTabRef.value
  let currentLeft = 0
  let currentTop = 0

  if (btnEl) {
    const rect = btnEl.getBoundingClientRect()
    currentLeft = rect.left
    currentTop = rect.top
  } else {
    currentLeft = dockSide.value === 'left' ? 0 : viewportW.value - width
    currentTop = dockYRatio.value * viewportH.value
  }

  pointerActive = true
  pointerId = e.pointerId
  hasMoved = false
  startClientX = e.clientX
  startClientY = e.clientY
  startScreenX = currentLeft
  startScreenY = currentTop

  dragScreenX.value = currentLeft
  dragScreenY.value = currentTop

  if (e.currentTarget && e.currentTarget.setPointerCapture) {
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // ignore capture errors
    }
  }
}

function handlePointerMove(e) {
  if (!pointerActive || e.pointerId !== pointerId) return

  const dx = e.clientX - startClientX
  const dy = e.clientY - startClientY

  if (!hasMoved && Math.hypot(dx, dy) > 5) {
    hasMoved = true
    isDragging.value = true
  }

  if (hasMoved) {
    const { width, minY, maxY } = getBtnMetrics()
    const clampedX = Math.min(viewportW.value - width, Math.max(0, startScreenX + dx))
    const clampedY = Math.min(maxY, Math.max(minY, startScreenY + dy))

    dragScreenX.value = clampedX
    dragScreenY.value = clampedY
  }
}

function handlePointerUp(e) {
  if (!pointerActive || e.pointerId !== pointerId) return
  pointerActive = false

  if (e.currentTarget && e.currentTarget.releasePointerCapture) {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }

  if (hasMoved) {
    suppressNextClick = true
    setTimeout(() => {
      suppressNextClick = false
    }, 350)

    const { width, minY, maxY } = getBtnMetrics()
    const centerX = dragScreenX.value + width / 2
    dockSide.value = centerX < viewportW.value / 2 ? 'left' : 'right'

    const clampedY = Math.min(maxY, Math.max(minY, dragScreenY.value))
    dockYRatio.value = viewportH.value > 0 ? clampedY / viewportH.value : 0.5
    savePosition()
    isDragging.value = false
  }
}

function handleClick() {
  if (suppressNextClick) return
  toggleFriendsSidebar('teman')
}

onMounted(() => {
  fetchFriendRequests()
  loadSavedPosition()
  viewportW.value = window.innerWidth
  viewportH.value = window.innerHeight
  window.addEventListener('resize', handleResize, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

watch(initialSidebarTab, (newTab) => {
  if (newTab === 'teman' || newTab === 'permintaan') {
    activeTab.value = newTab
  }
})

watch(isFriendsSidebarOpen, (isOpen) => {
  if (isOpen) {
    if (activeTab.value === 'teman') {
      if (friends.value.length === 0) fetchFriends()
    } else if (activeTab.value === 'permintaan') {
      fetchFriendRequests({ force: true })
    }
  }
})

watch(activeTab, (tab) => {
  if (!isFriendsSidebarOpen.value) return
  if (tab === 'teman') {
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
</script>

<template>
  <!-- 1. Floating AssistiveTouch Friends Edge Tab (Draggable & Snaps to Nearest Edge) -->
  <button 
    ref="edgeTabRef"
    class="fs-edge-tab" 
    :class="{ 
      'is-open': isFriendsSidebarOpen,
      'is-dragging': isDragging,
      'is-left-side': dockSide === 'left',
      'is-right-side': dockSide === 'right'
    }"
    :style="buttonStyle"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointercancel="handlePointerUp"
    @click="handleClick"
    :title="isFriendsSidebarOpen ? 'Tutup Daftar Teman' : 'Daftar Teman & Komunitas (Tahan untuk Drag)'"
    :aria-label="isFriendsSidebarOpen ? 'Tutup Daftar Teman' : 'Daftar Teman & Komunitas'"
    type="button"
  >
    <div class="fs-edge-tab-inner">
      <i class="fa-solid" :class="isFriendsSidebarOpen ? 'fa-xmark' : 'fa-user-group'"></i>
      <i 
        v-if="!isFriendsSidebarOpen" 
        class="fa-solid fs-edge-chevron"
        :class="dockSide === 'left' ? 'fa-chevron-right' : 'fa-chevron-left'"
      ></i>
    </div>
    <!-- Notification Dot on edge tab for Friend Requests only -->
    <span v-if="hasUnreadRequests" class="fs-tab-dot" title="Permintaan pertemanan baru"></span>
  </button>

  <!-- 2. Backdrop Blur Overlay -->
  <div 
    class="friends-sidebar-overlay" 
    :class="{ 'is-open': isFriendsSidebarOpen }" 
    @click="toggleFriendsSidebar()"
  ></div>
  
  <!-- 3. Sidebar Drawer (Opens smoothly from Left or Right depending on snap edge) -->
  <aside 
    class="friends-sidebar" 
    :class="{ 
      'is-open': isFriendsSidebarOpen,
      'from-left': dockSide === 'left'
    }"
  >
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
      <button class="fs-close-btn" @click="toggleFriendsSidebar()" title="Tutup">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <!-- Floating Capsule Tabs (2 Tabs: Teman & Permintaan) -->
    <div class="fs-tabs-wrapper">
      <div class="fs-tabs-capsule">
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
