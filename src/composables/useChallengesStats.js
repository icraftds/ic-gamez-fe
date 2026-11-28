import { computed, ref } from "vue";
import api from "../services/api.js";
import { useUserAccount } from "./useUserAccount.js";

const defaultStats = () => ({
  total: 0,
  completed: 0,
  mudah: { total: 0, completed: 0 },
  sedang: { total: 0, completed: 0 },
  sulit: { total: 0, completed: 0 },
});

const challengeStats = ref(defaultStats());
let inFlightStatsRequest = null;

export function useChallengesStats() {
  const fetchChallengeStats = async (force = false) => {
    if (inFlightStatsRequest && !force) {
      return inFlightStatsRequest;
    }

    const req = (async () => {
      try {
        const res = await api.get("/challenges/stats");
        const data = res?.data?.data;
        if (data && typeof data === "object") {
          challengeStats.value = {
            total: Number(data.total ?? 0),
            completed: Number(data.completed ?? 0),
            mudah: {
              total: Number(data.mudah?.total ?? 0),
              completed: Number(data.mudah?.completed ?? 0),
            },
            sedang: {
              total: Number(data.sedang?.total ?? 0),
              completed: Number(data.sedang?.completed ?? 0),
            },
            sulit: {
              total: Number(data.sulit?.total ?? 0),
              completed: Number(data.sulit?.completed ?? 0),
            },
          };
        }
      } catch {
        // Pertahankan statistik terakhir saat jaringan bermasalah
      } finally {
        if (inFlightStatsRequest === req) {
          inFlightStatsRequest = null;
        }
      }
    })();

    inFlightStatsRequest = req;
    return req;
  };

  const totalChallengesCount = computed(() => challengeStats.value.total);
  const completedCount = computed(() => challengeStats.value.completed);
  const completionPercentage = computed(() => {
    if (totalChallengesCount.value <= 0) return 0;
    return Math.round((completedCount.value / totalChallengesCount.value) * 100);
  });

  const totalMudah = computed(() => challengeStats.value.mudah.total);
  const completedMudah = computed(() => challengeStats.value.mudah.completed);

  const totalSedang = computed(() => challengeStats.value.sedang.total);
  const completedSedang = computed(() => challengeStats.value.sedang.completed);

  const totalSulit = computed(() => challengeStats.value.sulit.total);
  const completedSulit = computed(() => challengeStats.value.sulit.completed);

  return {
    challengeStats,
    fetchChallengeStats,
    totalChallengesCount,
    completedCount,
    completionPercentage,
    totalMudah,
    completedMudah,
    totalSedang,
    completedSedang,
    totalSulit,
    completedSulit,
  };
}

if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
  window.addEventListener("gamez-session-loaded", () => {
    const { fetchChallengeStats } = useChallengesStats();
    fetchChallengeStats(true).catch(() => {});
  });
}
