import { ref, computed } from 'vue'
import api from '../services/api'
import { prerenderData } from '../services/prerenderData'

const CACHE_KEY = 'ic_learning_paths_cache_v3'

/**
 * Snapshot index satu kali jalan (single-pass) untuk key localStorage
 * (`quiz_state_*`, `practice_state_*`, `theory_completed_*`) sehingga
 * normalizePathProgress tidak memanggil localStorage.getItem() 6.294 kali di main thread.
 */
function buildLocalProgressSnapshot() {
  const quizPassedSet = new Set()
  const practiceDoneSet = new Set()
  const theoryDoneSet = new Set()

  if (typeof localStorage === 'undefined') {
    return { quizPassedSet, practiceDoneSet, theoryDoneSet }
  }

  try {
    const len = typeof localStorage.length === 'number' ? localStorage.length : 0
    if (len > 0 && typeof localStorage.key === 'function') {
      for (let i = 0; i < len; i++) {
        const k = localStorage.key(i)
        if (!k) continue
        if (k.startsWith('quiz_state_')) {
          const id = k.slice('quiz_state_'.length)
          const raw = localStorage.getItem(k)
          if (raw) {
            try { if (JSON.parse(raw)?.isCorrect) quizPassedSet.add(String(id)) } catch {}
          }
        } else if (k.startsWith('practice_state_')) {
          const id = k.slice('practice_state_'.length)
          const raw = localStorage.getItem(k)
          if (raw) {
            try { if (JSON.parse(raw)?.status === 'success') practiceDoneSet.add(String(id)) } catch {}
          }
        } else if (k.startsWith('theory_completed_')) {
          const id = k.slice('theory_completed_'.length)
          if (localStorage.getItem(k) === 'true') {
            theoryDoneSet.add(String(id))
          }
        }
      }
      return { quizPassedSet, practiceDoneSet, theoryDoneSet, indexed: true }
    }
  } catch {
    // Fallback below if storage enumeration is restricted
  }

  return { quizPassedSet, practiceDoneSet, theoryDoneSet, indexed: false }
}

function readLocalFlag(key) {
  if (typeof localStorage === 'undefined') return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

/**
 * Normalisasi progres lesson dari payload backend (`progress`) dan state lokal,
 * digunakan konsisten di fetchPaths, fetchPathDetails, maupun cache sessionStorage.
 */
function normalizePathProgress(path, hasBeenScoredFn = null, snapshot = null) {
  if (!path || !Array.isArray(path.chapters)) return path
  const snap = snapshot || buildLocalProgressSnapshot()
  const scoredFn = typeof hasBeenScoredFn === 'function' ? hasBeenScoredFn : () => false

  for (const chapter of path.chapters) {
    if (!Array.isArray(chapter.lessons)) continue
    for (const lesson of chapter.lessons) {
      let prog = lesson.progress
      if (Array.isArray(prog)) {
        prog = prog.length > 0 ? prog[0] : null
      }

      const idKey = String(lesson.id)
      let localQuizPassed = false
      let localPracticeDone = false
      let localTheoryDone = false

      if (snap.indexed) {
        localQuizPassed = snap.quizPassedSet.has(idKey)
        localPracticeDone = snap.practiceDoneSet.has(idKey)
        localTheoryDone = snap.theoryDoneSet.has(idKey)
      } else {
        const lsQuizStr = readLocalFlag(`quiz_state_${lesson.id}`)
        if (lsQuizStr) {
          try { localQuizPassed = Boolean(JSON.parse(lsQuizStr).isCorrect) } catch {}
        }
        const lsPracticeStr = readLocalFlag(`practice_state_${lesson.id}`)
        if (lsPracticeStr) {
          try { localPracticeDone = JSON.parse(lsPracticeStr).status === 'success' } catch {}
        }
        localTheoryDone = readLocalFlag(`theory_completed_${lesson.id}`) === 'true'
      }

      if (prog && Object.keys(prog).length > 0) {
        lesson.isCompleted = Boolean(prog.is_completed || localTheoryDone)
        lesson.quizPassed = Boolean(prog.quiz_passed || localQuizPassed)
        lesson.practiceDone = Boolean(prog.saved_code || localPracticeDone)
      } else {
        lesson.isCompleted = Boolean(lesson.isCompleted || scoredFn('theory', lesson.id) || localTheoryDone)
        lesson.quizPassed = Boolean(lesson.quizPassed || scoredFn('quiz', lesson.id) || localQuizPassed)
        lesson.practiceDone = Boolean(lesson.practiceDone || scoredFn('practice', lesson.id) || localPracticeDone)
      }
    }
  }

  return path
}

function loadCachedPaths() {
  const snap = buildLocalProgressSnapshot()
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 1) {
        return parsed.map((p) => normalizePathProgress(p, null, snap))
      }
    }
  } catch (e) {}
  const seededPaths = typeof prerenderData !== 'undefined' ? prerenderData?.paths : null
  if (Array.isArray(seededPaths) && seededPaths.length > 1) {
    return seededPaths.map((p) => normalizePathProgress({ ...p }, null, snap))
  }
  return []
}

const initialCached = loadCachedPaths()
const globalPaths = ref(initialCached)
const globalIsLoading = ref(false)
const globalIsPreparingLesson = ref(false)
const globalHasFetchedAllPaths = ref(false)
let inFlightPathsRequest = null

/**
 * Menggabungkan daftar path terbaru dari API dengan chapter/quiz detail yang sudah di-cache
 * sambil tetap meremajakan status progres lesson (`progress`, `saved_code`).
 */
export function mergeFreshPathsWithCache(freshPaths, cachedPaths, hasBeenScoredFn = null) {
  const snap = buildLocalProgressSnapshot()
  const detailedMap = new Map()
  ;(cachedPaths || []).forEach(p => {
    if (Array.isArray(p.chapters) && p.chapters.some(c => c.lessons?.some(l => l.quizzes !== undefined))) {
      detailedMap.set(p.slug || String(p.id), p.chapters)
    }
  })

  return freshPaths.map(newPath => {
    const key = newPath.slug || String(newPath.id)
    const existingChapters = detailedMap.get(key)
    if (!existingChapters) {
      return normalizePathProgress(newPath, hasBeenScoredFn, snap)
    }

    const freshLessonMap = new Map()
    newPath.chapters?.forEach(ch => {
      ch.lessons?.forEach(l => freshLessonMap.set(l.id, l))
    })

    const syncedChapters = existingChapters.map(ch => ({
      ...ch,
      lessons: ch.lessons?.map(l => {
        const fresh = freshLessonMap.get(l.id)
        if (!fresh) return l
        const wasLocked = l.can_access === false || l.explanation === null
        const nowUnlocked = Boolean(fresh.can_access ?? newPath.is_unlocked)
        return {
          ...l,
          can_access: fresh.can_access ?? l.can_access,
          is_premium: fresh.is_premium ?? l.is_premium,
          quizzes: (wasLocked && nowUnlocked) ? undefined : l.quizzes,
          is_completed: fresh.is_completed ?? l.is_completed,
          quiz_passed: fresh.quiz_passed ?? l.quiz_passed,
          saved_code: fresh.saved_code ?? l.saved_code,
          progress: fresh.progress ?? l.progress,
        }
      })
    }))

    return normalizePathProgress({ ...newPath, chapters: syncedChapters }, hasBeenScoredFn, snap)
  })
}

if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('gamez-session-loaded', () => {
    const hasLockedPremiumPaths = globalPaths.value.some(p => p.is_premium && !p.is_unlocked)
    if (hasLockedPremiumPaths) {
      const { fetchPaths } = useLearningPaths()
      fetchPaths(true).catch(() => {})
    }
  })
}

/** Build-time prerendering only: fill the shared state with public (logged-out) API data. */
export function seedLearningPathsForPrerender(pathList) {
  globalPaths.value = Array.isArray(pathList) ? pathList : []
  globalHasFetchedAllPaths.value = true
}

export function useLearningPaths() {
  const paths = globalPaths
  const isLoading = globalIsLoading
  const isPreparingLesson = globalIsPreparingLesson
  const hasFetchedAllPaths = globalHasFetchedAllPaths

  const fetchPaths = async (force = false) => {
    if (inFlightPathsRequest && !force) {
      return inFlightPathsRequest
    }

    const request = (async () => {
      try {
        isLoading.value = true
        const scoringPromise = import('./useScoring')
          .then(({ useScoring }) => {
            const s = useScoring()
            return s.loadProgress().catch(() => {}).then(() => s.hasBeenScored)
          })
          .catch(() => null)
        const [response, hasBeenScored] = await Promise.all([
          api.get('/paths'),
          scoringPromise,
        ])
        if (response.data && Array.isArray(response.data.data)) {
          const freshPaths = response.data.data

          paths.value = mergeFreshPathsWithCache(freshPaths, paths.value, hasBeenScored)

          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(freshPaths))
          } catch (e) {}
        }
      } catch (error) {
        console.error('Failed to fetch learning paths', error)
      } finally {
        if (inFlightPathsRequest === request) {
          inFlightPathsRequest = null
        }
        isLoading.value = false
      }
    })()

    inFlightPathsRequest = request
    return request
  }

  // To get detailed info including chapters and lessons for a specific path
  const fetchPathDetails = async (slug, skipLoadingState = false, mode = null) => {
    if (!slug || slug === 'null' || slug === 'undefined') return null
    try {
      if (!skipLoadingState) isLoading.value = true
      const params = mode === 'challenge' ? { mode: 'challenge' } : undefined
      const response = await api.get(`/paths/${slug}`, { params })
      const detailedPath = response.data.data
      if (mode === 'challenge') {
        detailedPath._challengeModeOnly = true
      }

      const { loadProgress, hasBeenScored } = (await import('./useScoring')).useScoring()
      await loadProgress()

      normalizePathProgress(detailedPath, hasBeenScored)

      const index = paths.value.findIndex(p => p.slug === slug || String(p.id) === String(slug))
      if (index !== -1) {
        // Jangan timpa path kurikulum yang sudah lengkap dengan payload khusus mode=challenge
        const existingHasFullCurriculum = Array.isArray(paths.value[index]?.chapters) &&
          paths.value[index].chapters.length > 0 &&
          !paths.value[index]._challengeModeOnly
        if (!(mode === 'challenge' && existingHasFullCurriculum)) {
          paths.value[index] = detailedPath
        }
      } else {
        paths.value.push(detailedPath)
        if (paths.value.length <= 1) {
          fetchPaths()
        }
      }
      return detailedPath
    } catch (error) {
      console.error('Failed to fetch path details', error)
      return null
    } finally {
      if (!skipLoadingState) isLoading.value = false
    }
  }

  const fetchAllPathsDetails = async () => {
    if (paths.value.length === 0) {
      await fetchPaths()
    }
    const needsDetailFetch = paths.value.some(p => !Array.isArray(p.chapters) || p.chapters.length === 0)
    if (!needsDetailFetch) {
      globalHasFetchedAllPaths.value = true
      return
    }
    isLoading.value = true
    try {
      const promises = paths.value.map(p => fetchPathDetails(p.slug || p.id, true))
      await Promise.all(promises)
      globalHasFetchedAllPaths.value = true
    } finally {
      isLoading.value = false
    }
  }

  const getPathById = (id) => {
    return paths.value.find(p => String(p.id) === String(id) || p.slug === id)
  }

  const getChapterById = (pathId, chapterId) => {
    const path = getPathById(pathId)
    if (!path || !path.chapters) return null
    return path.chapters.find(c => String(c.id) === String(chapterId) || c.slug === chapterId)
  }

  const getLessonById = (pathId, chapterId, lessonId) => {
    // 1. Cari secara tepat di path dan chapter yang diminta
    const path = getPathById(pathId)
    if (path && path.chapters) {
      const chapter = path.chapters.find(c => String(c.id) === String(chapterId) || c.slug === chapterId)
      if (chapter && chapter.lessons) {
        const found = chapter.lessons.find(l => String(l.id) === String(lessonId) || l.slug === lessonId)
        if (found) return found
      }
      // Jika tidak di chapter tersebut, cari di chapter lain dalam PATH YANG SAMA (jangan bocor ke alur belajar lain)
      for (const c of path.chapters) {
        if (c.lessons) {
          const found = c.lessons.find(l => String(l.id) === String(lessonId) || l.slug === lessonId)
          if (found) return found
        }
      }
    }

    // 2. Fallback global HANYA JIKA pathId tidak ditentukan sama sekali (misal dari challenge atau search global)
    if (!pathId) {
      for (const p of paths.value) {
        if (p.chapters) {
          for (const c of p.chapters) {
            if (c.lessons) {
              const found = c.lessons.find(l => String(l.id) === String(lessonId) || l.slug === lessonId)
              if (found) return found
            }
          }
        }
      }
    }
    return null
  }

  // Jika diperlukan untuk backward compatibility
  const allChallenges = computed(() => {
    const challenges = []
    let completedLocal = []
    try {
      completedLocal = JSON.parse(localStorage.getItem('completed_challenges') || '[]')
    } catch (e) {}

    paths.value.forEach(path => {
      if (path.chapters) {
        path.chapters.forEach(chapter => {
          if (chapter.lessons) {
            chapter.lessons.forEach(lesson => {
              if (lesson.type === 'code') {
                let prog = lesson.progress
                if (Array.isArray(prog)) prog = prog.length > 0 ? prog[0] : null
                const isChallengeDone = Boolean((prog && prog.challenge_completed) || completedLocal.includes(lesson.id))

                challenges.push({
                  ...lesson,
                  isChallengeDone,
                  pathId: path.slug || path.id,
                  chapterId: chapter.slug || chapter.id,
                  category: path.title,
                  difficulty: lesson.difficulty || (lesson.is_premium ? 'Sulit' : 'Sedang')
                })
              }
            })
          }
        })
      }
    })
    return challenges
  })

  return {
    paths,
    isLoading,
    isPreparingLesson,
    fetchPaths,
    fetchPathDetails,
    fetchAllPathsDetails,
    getPathById,
    getChapterById,
    getLessonById,
    allChallenges,
    hasFetchedAllPaths
  }
}

