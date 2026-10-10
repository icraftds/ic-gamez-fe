import { computed } from 'vue'
import { useUserAccount } from './useUserAccount'

/**
 * Shared source of truth for user achievements (medali, piala, sertifikat).
 * Used by the Pencapaian page (DashboardMedals) and the dashboard showcase (BadgeCollection).
 */
/**
 * Pure builder for the medal catalog, so other users' profiles (VisitProfileView)
 * can compute achievements from their own profile + stats payload.
 */
export function buildMedals(profile, stats) {
  const getPathCount = (slug) => stats?.completed_exercises?.breakdown?.[slug] || 0

    const dpCount = getPathCount('dasar-pemrograman')
    const feCount = getPathCount('frontend-web')
    const sqlCount = getPathCount('database-sql')
    const jsCount = getPathCount('javascript-pemula')
    const beCount = getPathCount('backend-development')
    const streakCount = profile?.longest_streak || 0
    const lvlCount = profile?.level || 1
    const friendCount = profile?.friends_count || 0

    return [
      // Dasar Pemrograman Medals
      { id: 'dp-1', category: 'dasar-pemrograman', iconType: 'logic', tierId: 1, name: 'Langkah Pertama', description: 'Tantangan Dasar Pemrograman pertamamu beres!', target: 1, current: Math.min(dpCount, 1), earned: dpCount >= 1 },
      { id: 'dp-2', category: 'dasar-pemrograman', iconType: 'logic', tierId: 2, name: 'Mulai Paham Logika', description: '5 tantangan selesai. Logika komputermu makin terasah.', target: 5, current: Math.min(dpCount, 5), earned: dpCount >= 5 },
      { id: 'dp-3', category: 'dasar-pemrograman', iconType: 'logic', tierId: 3, name: 'Algoritma Pemula', description: '10 tantangan! Udah mulai jago mikir ala programmer.', target: 10, current: Math.min(dpCount, 10), earned: dpCount >= 10 },
      { id: 'dp-4', category: 'dasar-pemrograman', iconType: 'logic', tierId: 4, name: 'Pendekar Logika', description: '25 tantangan kamu libas. Nggak ada masalah yang nggak bisa dipecahkan.', target: 25, current: Math.min(dpCount, 25), earned: dpCount >= 25 },
      { id: 'dp-5', category: 'dasar-pemrograman', iconType: 'logic', tierId: 5, name: 'Suhu Algoritma', description: '50 tantangan! Pola pikirmu sudah seperti mesin.', target: 50, current: Math.min(dpCount, 50), earned: dpCount >= 50 },
      { id: 'dp-6', category: 'dasar-pemrograman', iconType: 'logic', tierId: 6, name: 'Master Struktur', description: '75 tantangan Dasar Pemrograman diselesaikan.', target: 75, current: Math.min(dpCount, 75), earned: dpCount >= 75 },
      { id: 'dp-7', category: 'dasar-pemrograman', iconType: 'logic', tierId: 7, name: 'Legenda Logika', description: '100 tantangan tamat. Dasar pemrogramanmu tak tertandingi.', target: 100, current: Math.min(dpCount, 100), earned: dpCount >= 100 },

      // Frontend Web Medals
      { id: 'fe-1', category: 'frontend-web', iconType: 'frontend', tierId: 1, name: 'Hello, World!', description: 'Buat halaman web pertamamu. Langkah pertama selalu spesial.', target: 1, current: Math.min(feCount, 1), earned: feCount >= 1 },
      { id: 'fe-2', category: 'frontend-web', iconType: 'frontend', tierId: 2, name: 'CSS Wizard', description: 'Selesaikan 5 tantangan Frontend. Layoutmu mulai rapih!', target: 5, current: Math.min(feCount, 5), earned: feCount >= 5 },
      { id: 'fe-3', category: 'frontend-web', iconType: 'frontend', tierId: 3, name: 'Responsive Tamer', description: '10 challenge UI/UX ditaklukkan.', target: 10, current: Math.min(feCount, 10), earned: feCount >= 10 },
      { id: 'fe-4', category: 'frontend-web', iconType: 'frontend', tierId: 4, name: 'Web Manipulator', description: '25 challenge beres. Tampilan bukan lagi masalah buatmu.', target: 25, current: Math.min(feCount, 25), earned: feCount >= 25 },
      { id: 'fe-5', category: 'frontend-web', iconType: 'frontend', tierId: 5, name: 'Frontend Ninja', description: '50 challenge diselesaikan. Desain modern dalam hitungan menit.', target: 50, current: Math.min(feCount, 50), earned: feCount >= 50 },
      { id: 'fe-6', category: 'frontend-web', iconType: 'frontend', tierId: 6, name: 'UI Architect', description: '75 challenge Frontend. Komponenmu sangat modular dan bersih!', target: 75, current: Math.min(feCount, 75), earned: feCount >= 75 },
      { id: 'fe-7', category: 'frontend-web', iconType: 'frontend', tierId: 7, name: 'Dewa Frontend', description: '100 challenge Frontend. UX dan UI di tanganmu adalah keajaiban.', target: 100, current: Math.min(feCount, 100), earned: feCount >= 100 },

      // Database & SQL Medals
      { id: 'sql-1', category: 'database-sql', iconType: 'sql', tierId: 1, name: 'Halo, SELECT!', description: 'Challenge SQL pertamamu beres! Query pertama emang paling...', target: 1, current: Math.min(sqlCount, 1), earned: sqlCount >= 1 },
      { id: 'sql-2', category: 'database-sql', iconType: 'sql', tierId: 2, name: 'Lagi Anget-Angetnya', description: '5 challenge kelar. Jarimu mulai hafal WHERE tanpa mikir.', target: 5, current: Math.min(sqlCount, 5), earned: sqlCount >= 5 },
      { id: 'sql-3', category: 'database-sql', iconType: 'sql', tierId: 3, name: 'Mulai Ketagihan Ngulik', description: '10 challenge SQL! Udah mulai nagih kan?', target: 10, current: Math.min(sqlCount, 10), earned: sqlCount >= 10 },
      { id: 'sql-4', category: 'database-sql', iconType: 'sql', tierId: 4, name: 'Pendekar Query', description: '25 challenge kamu libas. JOIN sama GROUP BY udah jago.', target: 25, current: Math.min(sqlCount, 25), earned: sqlCount >= 25 },
      { id: 'sql-5', category: 'database-sql', iconType: 'sql', tierId: 5, name: 'Suhu SQL', description: '50 challenge! Level analis beneran nih.', target: 50, current: Math.min(sqlCount, 50), earned: sqlCount >= 50 },
      { id: 'sql-6', category: 'database-sql', iconType: 'sql', tierId: 6, name: 'Master Data', description: '75 challenge SQL diselesaikan. Tidak ada relasi yang terlalu rumit.', target: 75, current: Math.min(sqlCount, 75), earned: sqlCount >= 75 },
      { id: 'sql-7', category: 'database-sql', iconType: 'sql', tierId: 7, name: 'Legenda Ngulik SQL', description: '100 challenge SQL tamat. Kamu resmi legenda.', target: 100, current: Math.min(sqlCount, 100), earned: sqlCount >= 100 },

      // JavaScript untuk Pemula Medals
      { id: 'js-1', category: 'javascript-pemula', iconType: 'js', tierId: 1, name: 'JS Newbie', description: 'Console.log() pertamamu berhasil!', target: 1, current: Math.min(jsCount, 1), earned: jsCount >= 1 },
      { id: 'js-2', category: 'javascript-pemula', iconType: 'js', tierId: 2, name: 'Variabel & Fungsi', description: '5 tantangan JS. Kamu mulai paham scope.', target: 5, current: Math.min(jsCount, 5), earned: jsCount >= 5 },
      { id: 'js-3', category: 'javascript-pemula', iconType: 'js', tierId: 3, name: 'Array Tamer', description: '10 tantangan JS! Mulai bisa memanipulasi data.', target: 10, current: Math.min(jsCount, 10), earned: jsCount >= 10 },
      { id: 'js-4', category: 'javascript-pemula', iconType: 'js', tierId: 4, name: 'JS Scripter', description: '25 tantangan selesai. Mulai asik ngoding dinamis.', target: 25, current: Math.min(jsCount, 25), earned: jsCount >= 25 },
      { id: 'js-5', category: 'javascript-pemula', iconType: 'js', tierId: 5, name: 'DOM Manipulator', description: '50 tantangan JS. Interaksi jadi mainanmu.', target: 50, current: Math.min(jsCount, 50), earned: jsCount >= 50 },
      { id: 'js-6', category: 'javascript-pemula', iconType: 'js', tierId: 6, name: 'Async Master', description: '75 tantangan. Callbacks dan Promises tunduk padamu.', target: 75, current: Math.min(jsCount, 75), earned: jsCount >= 75 },
      { id: 'js-7', category: 'javascript-pemula', iconType: 'js', tierId: 7, name: 'Dewa JavaScript', description: '100 tantangan. V8 Engine berjalan di nadimu.', target: 100, current: Math.min(jsCount, 100), earned: jsCount >= 100 },

      // Backend Development Medals
      { id: 'be-1', category: 'backend-development', iconType: 'backend', tierId: 1, name: 'Server Starter', description: 'Server pertamamu berjalan tanpa error!', target: 1, current: Math.min(beCount, 1), earned: beCount >= 1 },
      { id: 'be-2', category: 'backend-development', iconType: 'backend', tierId: 2, name: 'API Builder', description: '5 challenge backend. Mulai bikin route sendiri.', target: 5, current: Math.min(beCount, 5), earned: beCount >= 5 },
      { id: 'be-3', category: 'backend-development', iconType: 'backend', tierId: 3, name: 'Data Handler', description: '10 challenge. Mulai bisa nyambungin database dan server.', target: 10, current: Math.min(beCount, 10), earned: beCount >= 10 },
      { id: 'be-4', category: 'backend-development', iconType: 'backend', tierId: 4, name: 'Backend Architect', description: '25 challenge. Struktur kodemu makin kokoh.', target: 25, current: Math.min(beCount, 25), earned: beCount >= 25 },
      { id: 'be-5', category: 'backend-development', iconType: 'backend', tierId: 5, name: 'Auth Master', description: '50 challenge. Middleware dan Security aman terkendali.', target: 50, current: Math.min(beCount, 50), earned: beCount >= 50 },
      { id: 'be-6', category: 'backend-development', iconType: 'backend', tierId: 6, name: 'Performance Tuner', description: '75 challenge. Aplikasimu kenceng dan scalable.', target: 75, current: Math.min(beCount, 75), earned: beCount >= 75 },
      { id: 'be-7', category: 'backend-development', iconType: 'backend', tierId: 7, name: 'Dewa Backend', description: '100 challenge. Sistem distributed bukan masalah besar!', target: 100, current: Math.min(beCount, 100), earned: beCount >= 100 },

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

      // Friendship Medals
      { id: 'fr-1', category: 'pertemanan', iconType: 'friend', tierId: 1, name: 'Koneksi Awal', description: 'Punya 15 teman. Awal yang bagus untuk membangun relasi.', target: 15, current: Math.min(friendCount, 15), earned: friendCount >= 15 },
      { id: 'fr-2', category: 'pertemanan', iconType: 'friend', tierId: 2, name: 'Membangun Jaringan', description: 'Punya 25 teman. Lingkaran pertemananmu mulai meluas.', target: 25, current: Math.min(friendCount, 25), earned: friendCount >= 25 },
      { id: 'fr-3', category: 'pertemanan', iconType: 'friend', tierId: 3, name: 'Makin Dikenal', description: 'Punya 35 teman. Kamu mulai banyak dikenal di komunitas.', target: 35, current: Math.min(friendCount, 35), earned: friendCount >= 35 },
      { id: 'fr-4', category: 'pertemanan', iconType: 'friend', tierId: 4, name: 'Pusat Perhatian', description: 'Punya 50 teman. Semua orang ingin berteman denganmu.', target: 50, current: Math.min(friendCount, 50), earned: friendCount >= 50 },
      { id: 'fr-5', category: 'pertemanan', iconType: 'friend', tierId: 5, name: 'Influencer', description: 'Punya 75 teman. Jaringan pertemanan yang luar biasa kuat.', target: 75, current: Math.min(friendCount, 75), earned: friendCount >= 75 },
      { id: 'fr-6', category: 'pertemanan', iconType: 'friend', tierId: 6, name: 'Ikon Komunitas', description: 'Punya 90 teman. Kamu adalah sosok ikonik di sini.', target: 90, current: Math.min(friendCount, 90), earned: friendCount >= 90 },
      { id: 'fr-7', category: 'pertemanan', iconType: 'friend', tierId: 7, name: 'Sultan Pertemanan', description: 'Punya 125 teman. Legenda sejati dalam bersosialisasi.', target: 125, current: Math.min(friendCount, 125), earned: friendCount >= 125 },
    ]
}

export function useAchievements() {
  const { userProfile, userStats, fetchUserStats } = useUserAccount()

  const allMedals = computed(() => buildMedals(userProfile.value, userStats.value))

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
