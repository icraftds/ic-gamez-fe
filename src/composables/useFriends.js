import { ref } from 'vue'
import api from '../services/api'
import { useUserAccount } from './useUserAccount'

const isFriendsSidebarOpen = ref(false)
const friends = ref([])
const friendRequests = ref([])
const searchResults = ref([])
const isSearching = ref(false)
const isLoadingFriends = ref(false)
const isLoadingRequests = ref(false)

const hasUnreadRequests = ref(false)

const initialSidebarTab = ref('notifikasi')

export function useFriends() {
  const { isLoggedIn } = useUserAccount()

  const toggleFriendsSidebar = (targetTab = null) => {
    if (!isLoggedIn.value) return
    if (targetTab) {
      initialSidebarTab.value = targetTab
    }
    isFriendsSidebarOpen.value = !isFriendsSidebarOpen.value
    if (isFriendsSidebarOpen.value) {
      // Hilangkan titik merah ketika sidebar dibuka
      hasUnreadRequests.value = false
      localStorage.setItem('seen_friend_requests_count', String(friendRequests.value.length || 0))

      if (friends.value.length === 0) fetchFriends()
      fetchFriendRequests()
    }
  }

  const fetchFriends = async () => {
    try {
      isLoadingFriends.value = true
      const res = await api.get('/user/friends')
      friends.value = res.data.data
    } catch (err) {
      console.error('Failed to fetch friends', err)
    } finally {
      isLoadingFriends.value = false
    }
  }

  const fetchFriendRequests = async () => {
    try {
      isLoadingRequests.value = true
      const res = await api.get('/user/friend-requests')
      const data = res.data.data || []
      friendRequests.value = data

      // Cek apakah ada permintaan teman baru yang belum dilihat
      const seenCount = parseInt(localStorage.getItem('seen_friend_requests_count') || '0', 10)
      if (data.length > 0 && data.length > seenCount && !isFriendsSidebarOpen.value) {
        hasUnreadRequests.value = true
      } else if (data.length === 0 || isFriendsSidebarOpen.value) {
        hasUnreadRequests.value = false
        if (data.length === 0) {
          localStorage.setItem('seen_friend_requests_count', '0')
        }
      }
    } catch (err) {
      console.error('Failed to fetch friend requests', err)
    } finally {
      isLoadingRequests.value = false
    }
  }

  const searchUsers = async (q) => {
    if (q.length < 2) {
      searchResults.value = []
      return
    }
    try {
      isSearching.value = true
      const res = await api.get('/users/search', { params: { q } })
      searchResults.value = res.data.data
    } catch (err) {
      console.error('Failed to search users', err)
    } finally {
      isSearching.value = false
    }
  }

  const addFriend = async (friendId) => {
    try {
      await api.post('/user/friends', { friend_id: friendId })
      const userIdx = searchResults.value.findIndex(u => u.id === friendId)
      if (userIdx !== -1) {
        searchResults.value[userIdx].is_pending = true
      }
      await fetchFriends()
    } catch (err) {
      console.error('Failed to add friend', err)
    }
  }

  const removeFriend = async (friendId) => {
    try {
      await api.delete(`/user/friends/${friendId}`)
      friends.value = friends.value.filter(f => f.id !== friendId)
    } catch (err) {
      console.error('Failed to remove friend', err)
    }
  }

  const acceptFriendRequest = async (friendId) => {
    try {
      await api.post(`/user/friend-requests/${friendId}/accept`)
      friendRequests.value = friendRequests.value.filter(f => f.id !== friendId)
      await fetchFriends()
    } catch (err) {
      console.error('Failed to accept request', err)
    }
  }

  const rejectFriendRequest = async (friendId) => {
    try {
      await api.post(`/user/friend-requests/${friendId}/reject`)
      friendRequests.value = friendRequests.value.filter(f => f.id !== friendId)
    } catch (err) {
      console.error('Failed to reject request', err)
    }
  }

  return {
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
    searchUsers,
    addFriend,
    removeFriend,
    acceptFriendRequest,
    rejectFriendRequest,
    hasUnreadRequests,
    initialSidebarTab
  }
}
