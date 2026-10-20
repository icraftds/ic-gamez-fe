import { ref, computed } from 'vue'
import api from '../services/api'
import { useUserAccount } from './useUserAccount'

const materials = ref([])
const groupedMaterials = ref({ free: [], pro: [] })
const meta = ref({
  tier: 'all',
  user_plan: 'free',
  is_pro_user: false,
  counts: { all: 0, free: 0, pro: 0 }
})
const isLoading = ref(false)
const selectedTier = ref('all') // 'all', 'free', 'pro'
const searchQuery = ref('')

export function useMaterials() {
  const { isPremiumUser } = useUserAccount()

  const fetchMaterials = async (tier = selectedTier.value, search = searchQuery.value) => {
    isLoading.value = true
    try {
      const response = await api.get('/materials', {
        params: {
          tier: tier || 'all',
          search: search || ''
        }
      })
      if (response.data && response.data.status === 'success') {
        materials.value = response.data.data || []
        if (response.data.grouped) {
          groupedMaterials.value = response.data.grouped
        }
        if (response.data.meta) {
          meta.value = response.data.meta
        }
      }
    } catch (error) {
      console.error('Failed to fetch materials from /materials, attempting fallback...', error)
      try {
        const { useLearningPaths } = await import('./useLearningPaths')
        const { paths, fetchAllPathsDetails } = useLearningPaths()
        await fetchAllPathsDetails()
        materials.value = paths.value || []
      } catch (fallbackErr) {
        console.error('Fallback also failed', fallbackErr)
      }
    } finally {
      isLoading.value = false
    }
  }

  const getLessonById = (pathId, chapterId, lessonId) => {
    const path = materials.value.find(p => String(p.id) === String(pathId) || p.slug === pathId)
    if (!path || !path.chapters) return null
    const chapter = path.chapters.find(c => String(c.id) === String(chapterId) || c.slug === chapterId)
    if (!chapter || !chapter.lessons) return null
    return chapter.lessons.find(l => String(l.id) === String(lessonId) || l.slug === lessonId)
  }

  const getPathById = (pathId) => {
    return materials.value.find(p => String(p.id) === String(pathId) || p.slug === pathId)
  }

  const getChapterById = (pathId, chapterId) => {
    const path = getPathById(pathId)
    if (!path || !path.chapters) return null
    return path.chapters.find(c => String(c.id) === String(chapterId) || c.slug === chapterId)
  }

  return {
    materials,
    groupedMaterials,
    meta,
    isLoading,
    selectedTier,
    searchQuery,
    fetchMaterials,
    getLessonById,
    getPathById,
    getChapterById
  }
}
