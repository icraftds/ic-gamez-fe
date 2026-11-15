import { ref } from 'vue'
import api from '../services/api'

const STATS_TTL_MS = 30 * 1000

const statsData = ref(null)
const heatmapData = ref(null)
const isLoadingStats = ref(false)
const isLoadingHeatmap = ref(false)

let inFlightStats = null
let inFlightHeatmap = null
let statsFetchedAt = 0
let heatmapFetchedAt = 0

export function invalidateStatsCache() {
  statsFetchedAt = 0
  heatmapFetchedAt = 0
}

export function useDashboardStats() {
  const fetchStats = async (force = false) => {
    if (!force && inFlightStats) {
      return inFlightStats
    }
    if (!force && statsData.value && statsFetchedAt > 0 && Date.now() - statsFetchedAt < STATS_TTL_MS) {
      return statsData.value
    }

    const request = (async () => {
      try {
        isLoadingStats.value = !statsData.value
        const response = await api.get('/user/statistics')
        statsData.value = response.data?.data ?? null
        statsFetchedAt = Date.now()
        return statsData.value
      } catch (error) {
        console.error('Gagal mengambil data statistik:', error)
        return statsData.value
      } finally {
        if (inFlightStats === request) {
          inFlightStats = null
        }
        isLoadingStats.value = false
      }
    })()

    inFlightStats = request
    return request
  }

  const fetchHeatmap = async (force = false) => {
    if (!force && inFlightHeatmap) {
      return inFlightHeatmap
    }
    if (!force && heatmapData.value && heatmapFetchedAt > 0 && Date.now() - heatmapFetchedAt < STATS_TTL_MS) {
      return heatmapData.value
    }

    const request = (async () => {
      try {
        isLoadingHeatmap.value = !heatmapData.value
        const response = await api.get('/user/activity-heatmap')
        heatmapData.value = {
          data: response.data?.data ?? [],
          meta: response.data?.meta ?? {}
        }
        heatmapFetchedAt = Date.now()
        return heatmapData.value
      } catch (error) {
        console.error('Gagal mengambil data heatmap:', error)
        return heatmapData.value
      } finally {
        if (inFlightHeatmap === request) {
          inFlightHeatmap = null
        }
        isLoadingHeatmap.value = false
      }
    })()

    inFlightHeatmap = request
    return request
  }

  return {
    statsData,
    heatmapData,
    isLoadingStats,
    isLoadingHeatmap,
    fetchStats,
    fetchHeatmap,
    invalidateStatsCache
  }
}
