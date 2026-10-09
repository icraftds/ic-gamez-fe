import { computed } from 'vue'
import { useUserAccount } from './useUserAccount'

/**
 * Shared source of truth for user achievements (medali, piala, sertifikat).
 * Used by the Pencapaian page (DashboardMedals) and the dashboard showcase (BadgeCollection).
 */
export function useAchievements() {
  const { userProfile, userStats, fetchUserStats } = useUserAccount()

  const getSqlCount = () => {
    const paths = userStats.value?.completed_exercises?.breakdown?.sql || 0
    const daily = userStats.value?.events?.daily || 0
    return paths + daily
  }
  const getFrontendCount = () => userStats.value?.completed_exercises?.breakdown?.frontend || 0
  const getStreak = () => userProfile.value?.longest_streak || 0
  const getLevel = () => userProfile.value?.level || 1

  const allMedals = computed(() => {
    const sqlCount = getSqlCount()
    const feCount = getFrontendCount()
    const streakCount = getStreak()
    const lvlCount = getLevel()

    return [
      // SQL Medals
      { id: 'sql-1', category: 'sql', iconType: 'sql', tierId: 1, name: 'Halo, SELECT!', description: 'Challenge SQL pertamamu beres! Query pertama emang paling...', target: 1, current: Math.min(sqlCount, 1), earned: sqlCount >= 1 },
      { id: 'sql-2', category: 'sql', iconType: 'sql', tierId: 2, name: 'Lagi Anget-Angetnya', description: '5 challenge kelar. Jarimu mulai hafal WHERE tanpa mikir.', target: 5, current: Math.min(sqlCount, 5), earned: sqlCount >= 5 },
      { id: 'sql-3', category: 'sql', iconType: 'sql', tierId: 3, name: 'Mulai Ketagihan Ngulik', description: '10 challenge SQL! Udah mulai nagih kan?', target: 10, current: Math.min(sqlCount, 10), earned: sqlCount >= 10 },
      { id: 'sql-4', category: 'sql', iconType: 'sql', tierId: 4, name: 'Pendekar Query', description: '25 challenge kamu libas. JOIN sama GROUP BY udah jago.', target: 25, current: Math.min(sqlCount, 25), earned: sqlCount >= 25 },
      { id: 'sql-5', category: 'sql', iconType: 'sql', tierId: 5, name: 'Suhu SQL', description: '50 challenge! Level analis beneran nih.', target: 50, current: Math.min(sqlCount, 50), earned: sqlCount >= 50 },
      { id: 'sql-6', category: 'sql', iconType: 'sql', tierId: 6, name: 'Master Data', description: '75 challenge SQL diselesaikan. Tidak ada relasi yang terlalu rumit.', target: 75, current: Math.min(sqlCount, 75), earned: sqlCount >= 75 },
      { id: 'sql-7', category: 'sql', iconType: 'sql', tierId: 7, name: 'Legenda Ngulik SQL', description: '100 challenge SQL tamat. Kamu resmi legenda.', target: 100, current: Math.min(sqlCount, 100), earned: sqlCount >= 100 },

      // Frontend Medals
      { id: 'fe-1', category: 'frontend', iconType: 'frontend', tierId: 1, name: 'Hello, World!', description: 'Buat halaman HTML pertamamu. Langkah pertama selalu spesial.', target: 1, current: Math.min(feCount, 1), earned: feCount >= 1 },
      { id: 'fe-2', category: 'frontend', iconType: 'frontend', tierId: 2, name: 'CSS Wizard', description: 'Selesaikan 5 tantangan CSS. Layoutmu mulai rapih!', target: 5, current: Math.min(feCount, 5), earned: feCount >= 5 },
      { id: 'fe-3', category: 'frontend', iconType: 'frontend', tierId: 3, name: 'DOM Tamer', description: '10 challenge DOM Javascript ditaklukkan.', target: 10, current: Math.min(feCount, 10), earned: feCount >= 10 },
      { id: 'fe-4', category: 'frontend', iconType: 'frontend', tierId: 4, name: 'JS Manipulator', description: '25 challenge beres. DOM bukan lagi masalah buatmu.', target: 25, current: Math.min(feCount, 25), earned: feCount >= 25 },
      { id: 'fe-5', category: 'frontend', iconType: 'frontend', tierId: 5, name: 'Frontend Ninja', description: '50 challenge diselesaikan. Web responsif dalam hitungan menit.', target: 50, current: Math.min(feCount, 50), earned: feCount >= 50 },
      { id: 'fe-6', category: 'frontend', iconType: 'frontend', tierId: 6, name: 'React Architect', description: '75 challenge Frontend. Komponenmu sangat modular dan bersih!', target: 75, current: Math.min(feCount, 75), earned: feCount >= 75 },
      { id: 'fe-7', category: 'frontend', iconType: 'frontend', tierId: 7, name: 'Dewa Frontend', description: '100 challenge Frontend. UX dan UI di tanganmu adalah keajaiban.', target: 100, current: Math.min(feCount, 100), earned: feCount >= 100 },

      // Streak Medals
      { id: 'st-1', category: 'streak', iconType: 'streak', tierId: 1, name: 'Pemanasan', description: 'Belajar 3 hari berturut-turut. Permulaan yang bagus!', target: 3, current: Math.min(streakCount, 3), earned: streakCount >= 3 },
      { id: 'st-2', category: 'streak', iconType: 'streak', tierId: 2, name: 'Konsisten 7 Hari', description: 'Belajar 7 hari berturut-turut. Disiplin adalah kuncinya!', target: 7, current: Math.min(streakCount, 7), earned: streakCount >= 7 },
      { id: 'st-3', category: 'streak', iconType: 'streak', tierId: 3, name: 'Pecandu Belajar', description: '14 hari tanpa jeda. Belajar sudah jadi kebiasaan.', target: 14, current: Math.min(streakCount, 14), earned: streakCount >= 14 },
      { id: 'st-4', category: 'streak', iconType: 'streak', tierId: 4, name: 'Maraton 30 Hari', description: 'Streak 30 hari tanpa putus. Kamu luar biasa!', target: 30, current: Math.min(streakCount, 30), earned: streakCount >= 30 },
      { id: 'st-5', category: 'streak', iconType: 'streak', tierId: 5, name: 'Mesin Pembelajaran', description: '60 hari konsisten! Otakmu bekerja seperti mesin.', target: 60, current: Math.min(streakCount, 60), earned: streakCount >= 60 },
      { id: 'st-6', category: 'streak', iconType: 'streak', tierId: 6, name: 'Satu Abad Streak', description: '100 hari berturut-turut. Sebuah pencapaian epik!', target: 100, current: Math.min(streakCount, 100), earned: streakCount >= 100 },
      { id: 'st-7', category: 'streak', iconType: 'streak', tierId: 7, name: 'Tahun Kejayaan', description: '1 Tahun penuh dedikasi tanpa bolong sehari pun. Sempurna.', target: 365, current: Math.min(streakCount, 365), earned: streakCount >= 365 },

      // Level Medals
      { id: 'lv-1', category: 'level', iconType: 'level', tierId: 1, name: 'Pendatang Baru', description: 'Mencapai Level 5. Perjalananmu baru dimulai!', target: 5, current: Math.min(lvlCount, 5), earned: lvlCount >= 5 },
      { id: 'lv-2', category: 'level', iconType: 'level', tierId: 2, name: 'Petualang Muda', description: 'Mencapai Level 25. Kamu mulai menunjukkan taringmu.', target: 25, current: Math.min(lvlCount, 25), earned: lvlCount >= 25 },
      { id: 'lv-3', category: 'level', iconType: 'level', tierId: 3, name: 'Ksatria Kode', description: 'Level 50! Separuh jalan menuju puncak kejayaan.', target: 50, current: Math.min(lvlCount, 50), earned: lvlCount >= 50 },
      { id: 'lv-4', category: 'level', iconType: 'level', tierId: 4, name: 'Veteran Tempur', description: 'Level 75! Pengalamanmu sangat berharga.', target: 75, current: Math.min(lvlCount, 75), earned: lvlCount >= 75 },
      { id: 'lv-5', category: 'level', iconType: 'level', tierId: 5, name: 'Master GameZ', description: 'Level 100! Kamu diakui sebagai Master sesungguhnya.', target: 100, current: Math.min(lvlCount, 100), earned: lvlCount >= 100 },
      { id: 'lv-6', category: 'level', iconType: 'level', tierId: 6, name: 'Grandmaster', description: 'Level 125! Hanya segelintir orang yang mencapai ini.', target: 125, current: Math.min(lvlCount, 125), earned: lvlCount >= 125 },
      { id: 'lv-7', category: 'level', iconType: 'level', tierId: 7, name: 'Dewa Kode', description: 'Level 150! Kamu adalah entitas tertinggi di dunia GameZ.', target: 150, current: Math.min(lvlCount, 150), earned: lvlCount >= 150 },
    ]
  })

  // Piala: mengikuti tab Piala di halaman Pencapaian (saat ini memakai daftar yang sama dengan medali)
  const allPiala = computed(() => allMedals.value)

  // Sertifikat: belum ada sumber data (halaman Pencapaian masih menampilkan empty state)
  const allSertifikat = computed(() => [])

  const earnedMedals = computed(() => allMedals.value.filter(m => m.earned))
  const earnedPiala = computed(() => allPiala.value.filter(m => m.earned))
  const earnedSertifikat = computed(() => allSertifikat.value.filter(c => c.earned))

  return {
    userProfile,
    userStats,
    fetchUserStats,
    allMedals,
    allPiala,
    allSertifikat,
    earnedMedals,
    earnedPiala,
    earnedSertifikat
  }
}
