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
let visibilityListenerAttached = false

const LIST_CACHE_TTL_MS = 15000
const SUMMARY_POLL_INTERVAL_MS = 45000

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

    if (typeof document !== 'undefined' && document.visibilityState === 'hidden' && !force) {
      return
    }

    const now = Date.now()
    if (!force && lastSummaryFetchedAt > 0 && now - lastSummaryFetchedAt < 10000) {
      return
    }
    if (inFlightSummaryPromise) {
      return inFlightSummaryPromise
    }

    inFlightSummaryPromise = (async () => {
      try {
        const res = await api.get('/notifications/unread-summary')
        if (res.data?.status === 'success' && res.data?.data) {
          unreadCount.value = res.data.data.unread_count || 0
          unclaimedRewardsCount.value = res.data.data.unclaimed_rewards_count || 0
          lastSummaryFetchedAt = Date.now()
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

    try {
      await api.post(`/notifications/${id}/read`)
    } catch (err) {
      // Rollback optimistic update on failure
      item.is_read = false
      unreadCount.value++
      console.error('Failed to mark notification as read:', err)
    }
  }

  const markAllAsRead = async () => {
    const unreadItems = notifications.value.filter(n => !n.is_read)
    if (unreadItems.length === 0 && unreadCount.value === 0) return

    const prevUnreadCount = unreadCount.value
    unreadItems.forEach(n => { n.is_read = true })
    unreadCount.value = 0

    try {
      await api.post('/notifications/read-all')
    } catch (err) {
      // Rollback optimistic update on failure
      unreadItems.forEach(n => { n.is_read = false })
      unreadCount.value = prevUnreadCount
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

  const handleVisibilityChange = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible' && isLoggedIn.value) {
      pruneExpiredClientSide()
      if (Date.now() - lastSummaryFetchedAt >= SUMMARY_POLL_INTERVAL_MS) {
        fetchUnreadSummary()
      }
    }
  }

  const startPolling = () => {
    if (!isLoggedIn.value) return
    fetchUnreadSummary()

    if (!pollTimer) {
      pollTimer = setInterval(() => {
        fetchUnreadSummary()
      }, SUMMARY_POLL_INTERVAL_MS)
    }

    if (!expiryTimer) {
      expiryTimer = setInterval(() => {
        pruneExpiredClientSide()
      }, 30000)
    }

    if (typeof document !== 'undefined' && !visibilityListenerAttached) {
      document.addEventListener('visibilitychange', handleVisibilityChange)
      visibilityListenerAttached = true
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
    if (typeof document !== 'undefined' && visibilityListenerAttached) {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      visibilityListenerAttached = false
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
