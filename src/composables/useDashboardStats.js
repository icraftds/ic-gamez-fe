import { ref } from 'vue'
import api from '../services/api'

const statsData = ref(null)
const heatmapData = ref(null)
const isLoadingStats = ref(false)
const isLoadingHeatmap = ref(false)

export function useDashboardStats() {
  const fetchStats = async () => {
    try {
      isLoadingStats.value = true
      const response = await api.get('/user/statistics')
      statsData.value = response.data.data
    } catch (error) {
      console.error('Gagal mengambil data statistik:', error)
    } finally {
      isLoadingStats.value = false
    }
  }

  const fetchHeatmap = async () => {
    try {
      isLoadingHeatmap.value = true
      const response = await api.get('/user/activity-heatmap')
      heatmapData.value = {
        data: response.data.data,
        meta: response.data.meta
      }
    } catch (error) {
      console.error('Gagal mengambil data heatmap:', error)
    } finally {
      isLoadingHeatmap.value = false
    }
  }

  return {
    statsData,
    heatmapData,
    isLoadingStats,
    isLoadingHeatmap,
    fetchStats,
    fetchHeatmap
  }
}
