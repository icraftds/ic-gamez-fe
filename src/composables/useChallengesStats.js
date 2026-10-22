import { computed } from "vue";
import { useLearningPaths } from "./useLearningPaths.js";

export function useChallengesStats() {
  const { allChallenges } = useLearningPaths();

  const normalizeDiff = (diff) => {
    const d = (diff || '').toLowerCase();
    if (d === 'easy' || d === 'mudah') return 'Mudah';
    if (d === 'medium' || d === 'sedang') return 'Sedang';
    if (d === 'hard' || d === 'sulit' || d === 'boss') return 'Sulit';
    return 'Sedang';
  };

  const isItemCompleted = (c) => {
    return Boolean(c.isChallengeDone || c.isCompleted || c.practiceDone);
  };

  const completedCount = computed(
    () => allChallenges.value.filter(isItemCompleted).length
  );
  
  const completionPercentage = computed(() => {
    if (allChallenges.value.length === 0) return 0;
    return Math.round((completedCount.value / allChallenges.value.length) * 100);
  });

  const getDiffStats = (diff) => {
    const challenges = allChallenges.value.filter((c) => normalizeDiff(c.difficulty) === diff);
    return {
      total: challenges.length,
      completed: challenges.filter(isItemCompleted).length,
    };
  };

  const mudahStats = computed(() => getDiffStats("Mudah"));
  const totalMudah = computed(() => mudahStats.value.total);
  const completedMudah = computed(() => mudahStats.value.completed);

  const sedangStats = computed(() => getDiffStats("Sedang"));
  const totalSedang = computed(() => sedangStats.value.total);
  const completedSedang = computed(() => sedangStats.value.completed);

  const sulitStats = computed(() => getDiffStats("Sulit"));
  const totalSulit = computed(() => sulitStats.value.total);
  const completedSulit = computed(() => sulitStats.value.completed);

  return {
    allChallenges,
    completedCount,
    completionPercentage,
    totalMudah,
    completedMudah,
    totalSedang,
    completedSedang,
    totalSulit,
    completedSulit
  };
}
