import { ref, computed } from 'vue'
import api from '../services/api'
import { useUserAccount } from './useUserAccount'

const notifications = ref([])
const unreadCount = ref(0)
const unclaimedRewardsCount = ref(0)
const isLoadingNotifications = ref(false)
const isClaiming = ref({})
const lastClaimedReward = ref(null)

// Singleton request deduplication & smart polling state
let inFlightListPromise = null
let inFlightSummaryPromise = null
let lastListFetchedAt = 0
let lastSummaryFetchedAt = 0
let pollTimer = null
let expiryTimer = null
let listenersAttached = false

const LIST_CACHE_TTL_MS = 10000
const ACTIVE_POLL_INTERVAL_MS = 4000 // 4s active polling for real-time notification badge
const BACKGROUND_POLL_INTERVAL_MS = 25000 // 25s when browser tab is inactive / minimized
const MIN_FETCH_GAP_MS = 1500 // 1.5s debounce to prevent duplicate network spam

// Cross-tab synchronization via BroadcastChannel & localStorage
const notifChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('gamez_notif_sync') : null

const broadcastSync = () => {
  if (typeof window === 'undefined') return
  const payload = {
    unread: unreadCount.value,
    unclaimed: unclaimedRewardsCount.value,
    timestamp: Date.now()
  }
  try {
    notifChannel?.postMessage(payload)
    localStorage.setItem('gamez_notif_sync', JSON.stringify(payload))
  } catch (e) {}
}

if (typeof window !== 'undefined') {
  if (notifChannel) {
    notifChannel.onmessage = (e) => {
      if (e.data) {
        unreadCount.value = Number(e.data.unread) || 0
        unclaimedRewardsCount.value = Number(e.data.unclaimed) || 0
      }
    }
  }
  window.addEventListener('storage', (e) => {
    if (e.key === 'gamez_notif_sync' && e.newValue) {
      try {
        const data = JSON.parse(e.newValue)
        unreadCount.value = Number(data.unread) || 0
        unclaimedRewardsCount.value = Number(data.unclaimed) || 0
      } catch (err) {}
    }
  })
}

const isNotificationExpired = (notif) => {
  if (!notif?.expires_at) return false
  const expTime = new Date(notif.expires_at).getTime()
  return !Number.isNaN(expTime) && expTime <= Date.now()
}

const recalculateCountsFromList = () => {
  let unread = 0
  let unclaimed = 0
  for (const n of notifications.value) {
    if (!n.is_read) unread++
    if (n.reward_coinz > 0 && !n.is_claimed && !isNotificationExpired(n)) unclaimed++
  }
  unreadCount.value = unread
  unclaimedRewardsCount.value = unclaimed
}

const pruneExpiredClientSide = () => {
  if (notifications.value.length === 0) return
  const beforeLen = notifications.value.length
  const filtered = notifications.value.filter(n => !isNotificationExpired(n))
  if (filtered.length !== beforeLen) {
    notifications.value = filtered
    recalculateCountsFromList()
  }
}

export function useNotifications() {
  const { fetchWallet, isLoggedIn } = useUserAccount()

  const hasUnread = computed(() => unreadCount.value > 0)
  const hasUnclaimedGifts = computed(() => unclaimedRewardsCount.value > 0)

  const fetchNotifications = async ({ force = false } = {}) => {
    if (!isLoggedIn.value) return
    pruneExpiredClientSide()

    const now = Date.now()
    if (!force && lastListFetchedAt > 0 && now - lastListFetchedAt < LIST_CACHE_TTL_MS) {
      return
    }
    if (inFlightListPromise) {
      return inFlightListPromise
    }

    isLoadingNotifications.value = notifications.value.length === 0
    inFlightListPromise = (async () => {
      try {
        const res = await api.get('/notifications')
        if (res.data?.status === 'success' && res.data?.data) {
          const rawList = res.data.data.notifications || []
          notifications.value = rawList.filter(n => !isNotificationExpired(n))
          recalculateCountsFromList()
          const finishedAt = Date.now()
          lastListFetchedAt = finishedAt
          lastSummaryFetchedAt = finishedAt
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err)
      } finally {
        isLoadingNotifications.value = false
        inFlightListPromise = null
      }
    })()

    return inFlightListPromise
  }

  const fetchUnreadSummary = async ({ force = false } = {}) => {
    if (!isLoggedIn.value) return
    pruneExpiredClientSide()

    const isHidden = typeof document !== 'undefined' && document.visibilityState === 'hidden'
    if (isHidden && !force) {
      return
    }

    const now = Date.now()
    if (!force && lastSummaryFetchedAt > 0 && now - lastSummaryFetchedAt < MIN_FETCH_GAP_MS) {
      return
    }
    if (inFlightSummaryPromise) {
      return inFlightSummaryPromise
    }

    inFlightSummaryPromise = (async () => {
      try {
        const url = force ? '/notifications/unread-summary?fresh=1' : '/notifications/unread-summary'
        const res = await api.get(url)
        if (res.data?.status === 'success' && res.data?.data) {
          const newUnread = Number(res.data.data.unread_count) || 0
          const newUnclaimed = Number(res.data.data.unclaimed_rewards_count) || 0

          const changed = unreadCount.value !== newUnread || unclaimedRewardsCount.value !== newUnclaimed
          unreadCount.value = newUnread
          unclaimedRewardsCount.value = newUnclaimed
          lastSummaryFetchedAt = Date.now()

          if (changed) {
            broadcastSync()
          }
        }
      } catch (err) {
        // Silent fail on background polling
      } finally {
        inFlightSummaryPromise = null
      }
    })()

    return inFlightSummaryPromise
  }

  const markAsRead = async (id) => {
    const item = notifications.value.find(n => n.id === id)
    if (!item || item.is_read) return

    item.is_read = true
    if (unreadCount.value > 0) unreadCount.value--
    broadcastSync()

    try {
      await api.post(`/notifications/${id}/read`)
    } catch (err) {
      // Rollback optimistic update on failure
      item.is_read = false
      unreadCount.value++
      broadcastSync()
      console.error('Failed to mark notification as read:', err)
    }
  }

  const markAllAsRead = async () => {
    const unreadItems = notifications.value.filter(n => !n.is_read)
    if (unreadItems.length === 0 && unreadCount.value === 0) return

    const prevUnreadCount = unreadCount.value
    unreadItems.forEach(n => { n.is_read = true })
    unreadCount.value = 0
    broadcastSync()

    try {
      await api.post('/notifications/read-all')
    } catch (err) {
      // Rollback optimistic update on failure
      unreadItems.forEach(n => { n.is_read = false })
      unreadCount.value = prevUnreadCount
      broadcastSync()
      console.error('Failed to mark all notifications as read:', err)
    }
  }

  const claimReward = async (notification) => {
    if (!notification || isClaiming.value[notification.id] || !notification.can_claim) return false

    if (isNotificationExpired(notification)) {
      pruneExpiredClientSide()
      return { success: false, message: 'Masa klaim hadiah untuk pesan ini telah kedaluwarsa.' }
    }

    isClaiming.value[notification.id] = true
    try {
      const res = await api.post(`/notifications/${notification.id}/claim`)
      if (res.data?.status === 'success') {
        const wasUnread = !notification.is_read
        notification.is_claimed = true
        notification.can_claim = false
        notification.is_read = true

        if (wasUnread && unreadCount.value > 0) {
          unreadCount.value--
        }
        if (unclaimedRewardsCount.value > 0) {
          unclaimedRewardsCount.value--
        }
        broadcastSync()

        lastClaimedReward.value = {
          id: notification.id,
          amount: notification.reward_coinz,
          title: notification.title,
        }

        // Refresh wallet balance instantly in the top navbar!
        try {
          await fetchWallet()
        } catch (walletErr) {
          console.warn('Wallet refresh failed:', walletErr)
        }

        return { success: true, message: res.data.message || 'Hadiah berhasil diklaim!' }
      }
      return { success: false, message: res.data?.message || 'Gagal mengklaim hadiah.' }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Terjadi kesalahan saat mengklaim hadiah.'
      return { success: false, message: errMsg }
    } finally {
      isClaiming.value[notification.id] = false
    }
  }

  const restartPollTimer = (intervalMs) => {
    if (pollTimer) clearInterval(pollTimer)
    pollTimer = setInterval(() => {
      fetchUnreadSummary()
    }, intervalMs)
  }

  const handleVisibilityChange = () => {
    if (typeof document === 'undefined' || !isLoggedIn.value) return
    pruneExpiredClientSide()

    if (document.visibilityState === 'visible') {
      // Instantly refresh when returning to tab
      lastSummaryFetchedAt = 0
      fetchUnreadSummary({ force: true })
      restartPollTimer(ACTIVE_POLL_INTERVAL_MS)
    } else {
      restartPollTimer(BACKGROUND_POLL_INTERVAL_MS)
    }
  }

  const handleWindowFocus = () => {
    if (!isLoggedIn.value) return
    lastSummaryFetchedAt = 0
    fetchUnreadSummary({ force: true })
  }

  const startPolling = () => {
    if (!isLoggedIn.value) return
    lastSummaryFetchedAt = 0
    fetchUnreadSummary({ force: true })

    restartPollTimer(ACTIVE_POLL_INTERVAL_MS)

    if (!expiryTimer) {
      expiryTimer = setInterval(() => {
        pruneExpiredClientSide()
      }, 30000)
    }

    if (typeof window !== 'undefined' && !listenersAttached) {
      document.addEventListener('visibilitychange', handleVisibilityChange)
      window.addEventListener('focus', handleWindowFocus)
      window.addEventListener('gamez-session-loaded', () => {
        lastSummaryFetchedAt = 0
        fetchUnreadSummary({ force: true })
      })
      window.addEventListener('gamez-profile-updated', () => {
        lastSummaryFetchedAt = 0
        fetchUnreadSummary({ force: true })
      })
      listenersAttached = true
    }
  }

  const stopPolling = (resetState = false) => {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
    if (expiryTimer) {
      clearInterval(expiryTimer)
      expiryTimer = null
    }
    if (typeof window !== 'undefined' && listenersAttached) {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleWindowFocus)
      listenersAttached = false
    }
    if (resetState) {
      notifications.value = []
      unreadCount.value = 0
      unclaimedRewardsCount.value = 0
      lastListFetchedAt = 0
      lastSummaryFetchedAt = 0
    }
  }

  return {
    notifications,
    unreadCount,
    unclaimedRewardsCount,
    isLoadingNotifications,
    isClaiming,
    lastClaimedReward,
    hasUnread,
    hasUnclaimedGifts,
    fetchNotifications,
    fetchUnreadSummary,
    markAsRead,
    markAllAsRead,
    claimReward,
    startPolling,
    stopPolling,
    pruneExpiredClientSide,
  }
}
