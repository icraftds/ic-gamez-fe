<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '../composables/useNotifications'
import CoinzRewardModal from '../components/common/CoinzRewardModal.vue'

const router = useRouter()

const {
  notifications,
  unreadCount,
  unclaimedRewardsCount,
  isLoadingNotifications,
  isClaiming,
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  claimReward
} = useNotifications()

const activeFilter = ref('all') // 'all' | 'unread' | 'gift'
const selectedId = ref(null)
const claimToast = ref(null)
const claimErrorToast = ref(null)
const showRewardModal = ref(false)
const rewardedAmount = ref(0)
let toastTimer = null

onMounted(() => {
  fetchNotifications({ force: true })
})

onUnmounted(() => {
  clearTimeout(toastTimer)
})

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'unread') {
    return notifications.value.filter(n => !n.is_read)
  }
  if (activeFilter.value === 'gift') {
    return notifications.value.filter(n => n.reward_coinz > 0)
  }
  return notifications.value
})

const selectedNotif = computed(() => {
  if (!selectedId.value) return null
  return notifications.value.find(n => n.id === selectedId.value) || null
})

// Reset selection if the selected notification is pruned/removed
watch(notifications, (list) => {
  if (selectedId.value && !list.some(n => n.id === selectedId.value)) {
    selectedId.value = null
  }
})

const selectMail = (notif) => {
  selectedId.value = notif.id
  if (!notif.is_read) {
    markAsRead(notif.id)
  }
}

const closeReaderMobile = () => {
  selectedId.value = null
}

const handleClaimReward = async (notif) => {
  if (!notif) return
  const amount = Number(notif.reward_coinz) || 0
  const result = await claimReward(notif)
  clearTimeout(toastTimer)
  if (result.success) {
    claimErrorToast.value = null
    claimToast.value = result.message || `Selamat! +${amount.toLocaleString('id-ID')} iCoinZ berhasil diklaim!`
    rewardedAmount.value = amount
    showRewardModal.value = true
  } else {
    claimToast.value = null
    claimErrorToast.value = result.message || 'Gagal mengklaim hadiah.'
  }
  toastTimer = setTimeout(() => {
    claimToast.value = null
    claimErrorToast.value = null
  }, 4500)
}

const navigateCta = (url) => {
  if (!url) return
  if (url.startsWith('http://') || url.startsWith('https://')) {
    window.open(url, '_blank')
  } else {
    router.push(url)
  }
}

const formatCoinz = (val) => {
  if (val === null || val === undefined) return '0'
  const num = Number(val)
  return Number.isNaN(num) ? '0' : num.toLocaleString('id-ID')
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

const formatFullDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatExpiryRemaining = (dateStr) => {
  if (!dateStr) return ''
  const expDate = new Date(dateStr)
  const diffSec = Math.floor((expDate - new Date()) / 1000)
  if (diffSec <= 0) return 'Kedaluwarsa'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `Berakhir dlm ${diffMin} menit`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `Berakhir dlm ${diffHour} jam`
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay <= 7) return `Berakhir dlm ${diffDay} hari`
  return `Hingga ${expDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`
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
    case 'gift': return 'Hadiah iCoinZ'
    default: return 'Pengumuman'
  }
}
</script>

<template>
  <div class="notifications-fullpage">
    <!-- Full-Viewport Split Game Inbox Layout -->
    <div class="mailbox-full-layout" :class="{ 'has-mobile-selection': !!selectedNotif }">
      <!-- LEFT PANE: Full-Height Game Inbox Sidebar -->
      <aside class="mailbox-list-pane">
        <!-- Integrated Inbox Header -->
        <div class="mailbox-sidebar-header">
          <div class="mailbox-title-group">
            <div class="mailbox-title-icon">
              <i class="fa-solid fa-envelope-open-text"></i>
            </div>
            <div class="mailbox-title-texts">
              <h1>Kotak Pesan</h1>
              <span>{{ notifications.length }} Transmisi Sistem</span>
            </div>
          </div>

          <div class="mailbox-header-actions">
            <button
              v-if="unreadCount > 0"
              type="button"
              class="notif-icon-action"
              @click="markAllAsRead"
              title="Tandai semua telah dibaca"
            >
              <i class="fa-solid fa-check-double"></i>
            </button>
            <button
              type="button"
              class="notif-icon-action"
              :disabled="isLoadingNotifications"
              @click="fetchNotifications({ force: true })"
              title="Muat ulang pesan"
            >
              <i class="fa-solid fa-rotate" :class="{ 'fa-spin': isLoadingNotifications }"></i>
            </button>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="mailbox-filter-bar">
          <button
            class="mail-filter-tab"
            :class="{ active: activeFilter === 'all' }"
            @click="activeFilter = 'all'"
          >
            <span>Semua</span>
            <span v-if="notifications.length > 0" class="filter-count">{{ notifications.length }}</span>
          </button>

          <button
            class="mail-filter-tab"
            :class="{ active: activeFilter === 'unread' }"
            @click="activeFilter = 'unread'"
          >
            <span>Belum Dibaca</span>
            <span v-if="unreadCount > 0" class="filter-count badge-unread">{{ unreadCount }}</span>
          </button>

          <button
            class="mail-filter-tab"
            :class="{ active: activeFilter === 'gift' }"
            @click="activeFilter = 'gift'"
          >
            <i class="fa-solid fa-gift"></i>
            <span>Hadiah</span>
            <span v-if="unclaimedRewardsCount > 0" class="filter-count badge-gift">{{ unclaimedRewardsCount }}</span>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingNotifications" class="mailbox-list-loading">
          <TerminalLoader size="sm" label="kotak pesan" />
        </div>

        <!-- Empty List State -->
        <div v-else-if="filteredNotifications.length === 0" class="mailbox-list-empty">
          <div class="empty-mail-icon">
            <i class="fa-solid fa-inbox"></i>
          </div>
          <h4>Tidak Ada Pesan</h4>
          <p v-if="activeFilter === 'unread'">Semua pesan sudah Anda baca.</p>
          <p v-else-if="activeFilter === 'gift'">Belum ada pesan berhadiah saat ini.</p>
          <p v-else>Belum ada pengumuman atau hadiah baru di kotak pesan Anda.</p>
        </div>

        <!-- Scrollable Mail Items -->
        <div v-else class="mailbox-items-scroll">
          <button
            v-for="notif in filteredNotifications"
            :key="notif.id"
            type="button"
            class="mail-list-item"
            :class="{
              'is-selected': selectedId === notif.id,
              'is-unread': !notif.is_read,
              'has-unclaimed-gift': notif.can_claim
            }"
            @click="selectMail(notif)"
          >
            <!-- Left Icon Envelope / Gift Chest -->
            <div
              class="mail-item-icon"
              :class="[
                'cat-' + notif.category,
                { 'gift-unclaimed': notif.can_claim, 'is-read': notif.is_read && !notif.can_claim }
              ]"
            >
              <i
                v-if="notif.reward_coinz > 0"
                class="fa-solid"
                :class="notif.can_claim ? 'fa-gift' : 'fa-box-open'"
              ></i>
              <i v-else class="fa-solid" :class="getCategoryIcon(notif.category)"></i>
              <span v-if="!notif.is_read" class="mail-unread-dot"></span>
            </div>

            <!-- Center Texts -->
            <div class="mail-item-body">
              <div class="mail-item-top">
                <span class="mail-item-cat" :class="'text-' + notif.category">
                  {{ getCategoryLabel(notif.category) }}
                </span>
                <span class="mail-item-time">{{ formatTimeAgo(notif.created_at) }}</span>
              </div>

              <h4 class="mail-item-title">{{ notif.title }}</h4>

              <div class="mail-item-bottom">
                <span v-if="notif.reward_coinz > 0" class="mail-gift-tag" :class="{ claimed: notif.is_claimed }">
                  <img src="/images/icoinz.svg" alt="" class="mini-coin-icon" />
                  {{ notif.is_claimed ? 'Sudah Diklaim' : `+${formatCoinz(notif.reward_coinz)} iCoinZ` }}
                </span>
                <span v-else class="mail-snippet">{{ notif.message }}</span>
              </div>
            </div>
          </button>
        </div>
      </aside>

      <!-- RIGHT PANE: Full-Screen Message Reader & Reward Claim Canvas -->
      <main class="mailbox-reader-pane">
        <!-- Floating Claim Feedback Banner inside Reader -->
        <transition name="mail-fade">
          <div v-if="claimToast" class="notif-feedback-banner is-success">
            <i class="fa-solid fa-circle-check"></i>
            <span>{{ claimToast }}</span>
          </div>
          <div v-else-if="claimErrorToast" class="notif-feedback-banner is-error">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>{{ claimErrorToast }}</span>
          </div>
        </transition>

        <!-- No Message Clicked Yet (Standby Screen) -->
        <div v-if="!selectedNotif" class="reader-standby-state">
          <div class="standby-hologram">
            <i class="fa-solid fa-envelope-open-text"></i>
          </div>
          <h3>Pilih Transmisi Pesan</h3>
          <p>Klik salah satu pesan pada daftar di sebelah kiri untuk membuka isi pengumuman atau mengklaim hadiah iCoinZ.</p>
          <div class="standby-badges" v-if="unreadCount > 0 || unclaimedRewardsCount > 0">
            <span v-if="unreadCount > 0" class="standby-pill pill-unread">
              <i class="fa-solid fa-envelope"></i> {{ unreadCount }} Pesan Belum Dibaca
            </span>
            <span v-if="unclaimedRewardsCount > 0" class="standby-pill pill-gift">
              <i class="fa-solid fa-gift"></i> {{ unclaimedRewardsCount }} Hadiah Siap Diklaim
            </span>
          </div>
        </div>

        <!-- Active Message Detail Screen -->
        <div v-else class="reader-detail-view" :key="selectedNotif.id">
          <!-- Mobile Back Navigation -->
          <button type="button" class="reader-mobile-back" @click="closeReaderMobile">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Kembali ke Daftar Pesan</span>
          </button>

          <!-- Reader Top Header -->
          <div class="reader-header">
            <div class="reader-meta-row">
              <span class="reader-cat-badge" :class="'badge-' + selectedNotif.category">
                <i class="fa-solid" :class="getCategoryIcon(selectedNotif.category)"></i>
                {{ getCategoryLabel(selectedNotif.category) }}
              </span>

              <span v-if="selectedNotif.expires_at" class="reader-expiry-pill">
                <i class="fa-regular fa-clock"></i>
                {{ formatExpiryRemaining(selectedNotif.expires_at) }}
              </span>
            </div>

            <h2 class="reader-title">{{ selectedNotif.title }}</h2>

            <div class="reader-sender-row">
              <div class="sender-avatar">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <div class="sender-info">
                <span class="sender-name">Admin System IC Game-Z</span>
                <span class="sender-date">{{ formatFullDate(selectedNotif.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Reader Scrollable Content -->
          <div class="reader-body-scroll">
            <div v-if="selectedNotif.banner_url" class="reader-banner-wrap">
              <img :src="selectedNotif.banner_url" :alt="selectedNotif.title" class="reader-banner-img" />
            </div>

            <div class="reader-message-content">{{ selectedNotif.message }}</div>

            <!-- Optional CTA Link Button -->
            <div v-if="selectedNotif.action_url" class="reader-cta-box">
              <button type="button" class="reader-cta-btn" @click="navigateCta(selectedNotif.action_url)">
                <span>{{ selectedNotif.action_label || 'Buka Tautan Terkait' }}</span>
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </button>
            </div>
          </div>

          <!-- Bottom Full-Width In-Game Attachment & Reward Claim Dock -->
          <div v-if="selectedNotif.reward_coinz > 0" class="reader-reward-dock" :class="{ 'is-claimed': selectedNotif.is_claimed }">
            <div class="reward-dock-left">
              <div class="reward-slot-box" :class="{ 'claimed': selectedNotif.is_claimed }">
                <img src="/images/icoinz.svg" alt="iCoinZ" class="reward-slot-img" />
                <span class="reward-slot-qty">x{{ formatCoinz(selectedNotif.reward_coinz) }}</span>
                <div v-if="selectedNotif.is_claimed" class="reward-slot-check">
                  <i class="fa-solid fa-check"></i>
                </div>
              </div>

              <div class="reward-dock-texts">
                <span class="reward-dock-label">Lampiran Hadiah</span>
                <h4 class="reward-dock-amount">+{{ formatCoinz(selectedNotif.reward_coinz) }} iCoinZ</h4>
                <span class="reward-dock-sub">
                  {{ selectedNotif.is_claimed ? 'Hadiah telah ditambahkan ke saldo Wallet Anda' : 'Klik tombol Klaim untuk memasukkan iCoinZ ke Wallet Anda' }}
                </span>
              </div>
            </div>

            <div class="reward-dock-right">
              <button
                v-if="selectedNotif.can_claim"
                type="button"
                class="btn-game-claim"
                :disabled="isClaiming[selectedNotif.id]"
                @click="handleClaimReward(selectedNotif)"
              >
                <i v-if="isClaiming[selectedNotif.id]" class="fa-solid fa-circle-notch fa-spin"></i>
                <template v-else>
                  <i class="fa-solid fa-gift"></i>
                  <span>Klaim Hadiah</span>
                </template>
              </button>

              <div v-else-if="selectedNotif.is_claimed" class="badge-game-claimed">
                <i class="fa-solid fa-circle-check"></i>
                <span>Sudah Diklaim</span>
              </div>

              <div v-else-if="selectedNotif.is_expired" class="badge-game-expired">
                <i class="fa-solid fa-clock"></i>
                <span>Kedaluwarsa</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Animated iCoinZ Reward Celebration Modal -->
    <CoinzRewardModal
      v-model="showRewardModal"
      :amount="rewardedAmount"
      plan="gift"
    />
  </div>
</template>

<style scoped src="../assets/css/views/NotificationsView.css"></style>
