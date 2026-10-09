import { ref } from 'vue'
import api from '../services/api'
import { useUserAccount } from './useUserAccount'

const isFriendsSidebarOpen = ref(false)
const friends = ref([])
const searchResults = ref([])
const isSearching = ref(false)
const isLoadingFriends = ref(false)

export function useFriends() {
  const { isLoggedIn } = useUserAccount()

  const toggleFriendsSidebar = () => {
    if (!isLoggedIn.value) return
    isFriendsSidebarOpen.value = !isFriendsSidebarOpen.value
    if (isFriendsSidebarOpen.value && friends.value.length === 0) {
      fetchFriends()
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

  return {
    isFriendsSidebarOpen,
    friends,
    searchResults,
    isSearching,
    isLoadingFriends,
    toggleFriendsSidebar,
    fetchFriends,
    searchUsers,
    addFriend,
    removeFriend
  }
}
