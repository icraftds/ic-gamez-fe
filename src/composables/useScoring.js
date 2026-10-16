import { ref } from 'vue'
import { useUserAccount } from './useUserAccount'
import api from '../services/api'

// ── XP Constants (dipakai untuk Optimistic UI, tanpa menunggu API) ─────────
const XP_REWARDS = Object.freeze({
  theory: 10,
  quiz: { default: 25, hard: 50 },
  practice: { easy: 25, medium: 50, hard: 100, boss: 150 }
})

const COINZ_REWARDS = Object.freeze({
  default: 10,
  hard: 15,
  boss: 25,
})

function computeLocalCoinz(difficulty = '', chapterOrder = 1) {
  const diff = (difficulty || '').toLowerCase()
  if (diff === 'boss' || diff.includes('boss')) return COINZ_REWARDS.boss
  if (chapterOrder >= 4 || ['hard', 'sulit'].includes(diff)) return COINZ_REWARDS.hard
  return COINZ_REWARDS.default
}

// ── Client-side guard: cegah scoring ganda tanpa menunggu server ────────────
const scoredActivities = ref(new Set())
const isProgressLoaded = ref(false)
let progressLoadPromise = null

// ── Outbox Queue: pending sync yang akan dikirim ke backend ─────────────────
const OUTBOX_KEY = 'xp_outbox'
const MAX_ATTEMPTS = 3
const SYNC_DELAY_MS = 3000   // Delay sebelum kirim ke progress endpoint
const WALLET_DELAY_MS = 2000 // Delay sebelum sync wallet (setelah progress)

let outboxTimer = null // Prevent concurrent processing
let isProcessingOutbox = false // Concurrency lock

/**
 * Hitung XP lokal berdasarkan type, difficulty, dan chapter order.
 * Digunakan untuk Optimistic UI tanpa menunggu server.
 */
function computeLocalXp(type, difficulty = '', chapterOrder = 1) {
  const diff = (difficulty || '').toLowerCase()
  if (type === 'theory') return XP_REWARDS.theory
  if (type === 'quiz') {
    if (chapterOrder >= 4 || ['hard', 'sulit', 'boss'].includes(diff)) {
      return XP_REWARDS.quiz.hard
    }
    return XP_REWARDS.quiz.default
  }
  if (type === 'practice') {
    if (diff === 'boss') return XP_REWARDS.practice.boss
    if (chapterOrder >= 4 || ['hard', 'sulit'].includes(diff)) return XP_REWARDS.practice.hard
    if (chapterOrder >= 2 || ['medium', 'sedang'].includes(diff)) return XP_REWARDS.practice.medium
    return XP_REWARDS.practice.easy
  }
  return 25
}

/**
 * Baca outbox dari localStorage.
 */
function readOutbox() {
  try {
    return JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]')
  } catch {
    return []
  }
}

/**
 * Simpan outbox ke localStorage.
 */
function writeOutbox(entries) {
  try {
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(entries))
  } catch {
    console.warn('[Outbox] Gagal menyimpan ke localStorage.')
  }
}

/**
 * Tambahkan entry baru ke outbox.
 */
function enqueueSync(type, lessonId, extraData = {}, localXp = 0, localCoinz = 0) {
  const entries = readOutbox()
  const entry = {
    id: `${lessonId}:${type}:${Date.now()}`,
    type,
    lessonId,
    extraData,
    localXp,
    localCoinz,
    timestamp: Date.now(),
    attempts: 0,
    status: 'pending'
  }
  entries.push(entry)
  writeOutbox(entries)
}

/**
 * Kirim satu entry ke backend.
 * Return true jika berhasil, false jika gagal.
 */
async function sendSyncEntry(entry) {
  let endpoint = ''
  if (entry.type === 'quiz') endpoint = '/progress/quiz-pass'
  else if (entry.type === 'practice') endpoint = '/progress/practice-complete'
  else if (entry.type === 'theory') endpoint = '/progress/complete'

  if (!endpoint) return true // Tipe tidak dikenal, hapus saja

  const payload = { lesson_id: entry.lessonId, ...entry.extraData }

  try {
    await api.post(endpoint, payload)
    return true
  } catch (error) {
    // 400: sudah pernah dapat XP → anggap sukses (tidak perlu retry)
    if (error.response?.status === 400) return true
    // 401: tidak login → jangan retry
    if (error.response?.status === 401) return true
    // 429: rate limit → lempar agar ditangani outbox processor
    if (error.response?.status === 429) throw error
    return false
  }
}

/**
 * Sync wallet setelah progress berhasil dikirim.
 * Berjalan diam-diam di background tanpa alert apapun.
 */
async function syncWalletBackground() {
  const { fetchWallet } = useUserAccount()
  try {
    await fetchWallet()
  } catch {
    // Silent fail - wallet akan di-refresh saat user buka app lagi
  }
}

/**
 * Process semua pending entries di outbox.
 * Dipanggil dengan delay dari scheduleSyncOutbox().
 */
async function processOutbox() {
  if (isProcessingOutbox) return
  isProcessingOutbox = true
  try {
    await doProcessOutbox()
  } finally {
    isProcessingOutbox = false
  }
}

async function doProcessOutbox() {

  const entries = readOutbox()
  const pending = entries.filter(e => e.status === 'pending' && e.attempts < MAX_ATTEMPTS)

  if (pending.length === 0) {
    writeOutbox(entries.filter(e => e.status !== 'done'))
    return
  }

  let anySynced = false

  for (const entry of pending) {
    const index = entries.findIndex(e => e.id === entry.id)
    if (index === -1) continue

    entries[index].status = 'processing'
    entries[index].attempts++
    writeOutbox(entries)

    try {
      const success = await sendSyncEntry(entry)
      if (success) {
        entries[index].status = 'done'
        anySynced = true
      } else if (entries[index].attempts >= MAX_ATTEMPTS) {
        entries[index].status = 'failed'
        console.warn(`[Outbox] Entry ${entry.id} gagal setelah ${MAX_ATTEMPTS}x percobaan.`)
      } else {
        entries[index].status = 'pending' // Akan dicoba lagi
      }
    } catch (rateLimitError) {
      // Rate limit: tandai pending dan beri jeda
      entries[index].status = 'pending'
      const retryAfter = (rateLimitError.retryAfter || 60) * 1000
      console.warn(`[Outbox] Rate limit. Retry setelah ${Math.ceil(retryAfter / 1000)}s.`)
      writeOutbox(entries)
      // Jadwalkan ulang setelah cooldown
      outboxTimer = setTimeout(() => {
        outboxTimer = null
        processOutbox()
      }, retryAfter + 500)
      return
    }

    writeOutbox(entries)

    // Jika berhasil dan ada coinz reward, sync wallet setelah delay
    if (entries[index].status === 'done' && entry.localCoinz > 0) {
      setTimeout(syncWalletBackground, WALLET_DELAY_MS)
    }
  }

  writeOutbox(entries.filter(e => e.status !== 'done'))

  // Refresh stats diam-diam jika ada yang berhasil
  if (anySynced) {
    const { fetchUser } = useUserAccount()
    fetchUser(true).catch(() => {}) // silent
  }
}


/**
 * Flush outbox secara instan tanpa menunggu timer (misal saat unmount atau next lesson).
 */
async function flushOutboxNow() {
  if (outboxTimer) {
    clearTimeout(outboxTimer)
    outboxTimer = null
  }
  await processOutbox()
}

/**
 * Jadwalkan sync outbox dengan delay aman (untuk menghindari rate limit).
 */
function scheduleSyncOutbox(delayMs = SYNC_DELAY_MS) {
  if (outboxTimer) return // Sudah ada timer aktif
  outboxTimer = setTimeout(() => {
    outboxTimer = null
    processOutbox()
  }, delayMs)
}

export function useScoring() {
  const { addXpLocal, addCoinzLocal } = useUserAccount()

  const loadProgress = async () => {
    if (isProgressLoaded.value) return
    if (progressLoadPromise) {
      await progressLoadPromise
      return
    }

    try {
      progressLoadPromise = api.get('/progress')
      const response = await progressLoadPromise
      const progressList = response.data.data

      const newSet = new Set()
      progressList.forEach(p => {
        if (p.is_completed) newSet.add(`${p.lesson_id}:theory`)
        if (p.quiz_passed) newSet.add(`${p.lesson_id}:quiz`)
        if (p.saved_code) newSet.add(`${p.lesson_id}:practice`)
      })
      scoredActivities.value = newSet
      isProgressLoaded.value = true
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('[Scoring] Gagal memuat progress user', error)
      }
    } finally {
      progressLoadPromise = null
    }
  }

  /**
   * OPTIMISTIC: Kalkulasi XP lokal dan update state UI seketika.
   * Return { xp, coinz, alreadyScored }
   */
  const awardXpOptimistic = (type, lessonId, options = {}) => {
    const key = `${lessonId}:${type}`

    // Quiz selalu diproses (perlu validasi jawaban dari server)
    // untuk tipe lain, cek apakah sudah pernah dihitung
    if (type !== 'quiz' && scoredActivities.value.has(key)) {
      return { xp: 0, coinz: 0, alreadyScored: true }
    }

    const { difficulty = '', chapterOrder = 1, awardCoinz = false } = options
    const xp = computeLocalXp(type, difficulty, chapterOrder)
    const coinz = awardCoinz ? computeLocalCoinz(difficulty, chapterOrder) : 0

    // Update UI state secara optimistic
    addXpLocal(xp)
    if (coinz > 0) addCoinzLocal(coinz)

    // Tandai agar tidak double-count secara lokal
    if (type !== 'quiz') {
      scoredActivities.value.add(key)
    }

    return { xp, coinz, alreadyScored: false }
  }

  /**
   * BACKGROUND SYNC: Kirim ke server dengan delay.
   * Dipanggil setelah awardXpOptimistic, tidak perlu di-await.
   */
  const enqueueSyncToServer = (type, lessonId, extraData = {}, xp = 0, coinz = 0) => {
    enqueueSync(type, lessonId, extraData, xp, coinz)
    scheduleSyncOutbox(SYNC_DELAY_MS)
  }

  /**
   * LEGACY COMPAT: awardXp yang sebelumnya dipakai (sync dengan server).
   * Masih dipertahankan untuk Quiz (butuh validasi jawaban dari server).
   */
  const awardXp = async (type, lessonId, extraData = {}) => {
    const key = `${lessonId}:${type}`

    // Untuk non-quiz: cek client-side guard
    if (scoredActivities.value.has(key) && type !== 'quiz') {
      return { success: true, awarded: false, xp: 0 }
    }

    try {
      let endpoint = ''
      if (type === 'quiz') endpoint = '/progress/quiz-pass'
      else if (type === 'practice') endpoint = '/progress/practice-complete'
      else if (type === 'theory') endpoint = '/progress/complete'

      if (!endpoint) return { success: false, awarded: false, xp: 0, error: 'Endpoint invalid' }

      const payload = { lesson_id: lessonId, ...extraData }
      const response = await api.post(endpoint, payload)

      scoredActivities.value.add(key)

      const awarded = response.data?.awarded ?? response.data?.data?.awarded ?? true
      const xp = response.data?.xp_earned ?? response.data?.data?.xp_earned ?? computeLocalXp(type)
      const explanation = response.data?.explanation || response.data?.data?.explanation

      const results = response.data?.results || response.data?.data?.results
      const totalQuizzes = response.data?.total_quizzes
      const correctCount = response.data?.correct_count

      // Update XP lokal seketika saat award berhasil (0 delay untuk kuis/teori)
      if (awarded && xp > 0) {
        addXpLocal(xp)
        setTimeout(() => {
          const { fetchUser } = useUserAccount()
          fetchUser(true).catch(() => {})
        }, 1500)
      }

      return { 
        success: true, 
        awarded, 
        xp, 
        explanation, 
        results, 
        total_quizzes: totalQuizzes, 
        correct_count: correctCount,
        data: response.data 
      }
    } catch (error) {
      if (error.response?.status === 400) {
        return { 
          success: false, 
          awarded: false, 
          xp: 0, 
          error: error.response.data?.message || 'Gagal memproses',
          results: error.response.data?.results,
          total_quizzes: error.response.data?.total_quizzes,
          correct_count: error.response.data?.correct_count,
          data: error.response.data
        }
      }
      return { success: false, awarded: false, xp: 0, error: error.response?.data?.message || 'Terjadi kesalahan sistem.' }
    }
  }

  const hasBeenScored = (type, lessonId) => {
    return scoredActivities.value.has(`${lessonId}:${type}`)
  }

  /**
   * Proses outbox yang tersisa dari sesi sebelumnya (app startup).
   */
  const processPendingFromPreviousSession = () => {
    const entries = readOutbox()
    const hasPending = entries.some(e => e.status === 'pending' && e.attempts < MAX_ATTEMPTS)
    if (hasPending) {
      // Langsung proses (tidak perlu delay, session baru)
      scheduleSyncOutbox(1000)
    }
  }

  return {
    awardXp,
    awardXpOptimistic,
    enqueueSyncToServer,
    hasBeenScored,
    loadProgress,
    processPendingFromPreviousSession,
    flushOutboxNow,
    XP_REWARDS,
    COINZ_REWARDS,
    computeLocalXp,
    computeLocalCoinz,
  }
}
