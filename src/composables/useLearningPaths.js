import { ref, computed } from 'vue'
import api from '../services/api'

const CACHE_KEY = 'ic_learning_paths_cache_v3'

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
function normalizePathProgress(path, hasBeenScoredFn = null) {
  if (!path || !Array.isArray(path.chapters)) return path

  for (const chapter of path.chapters) {
    if (!Array.isArray(chapter.lessons)) continue
    for (const lesson of chapter.lessons) {
      let prog = lesson.progress
      if (Array.isArray(prog)) {
        prog = prog.length > 0 ? prog[0] : null
      }

      const lsQuizStr = readLocalFlag(`quiz_state_${lesson.id}`)
      let localQuizPassed = false
      if (lsQuizStr) {
        try { localQuizPassed = Boolean(JSON.parse(lsQuizStr).isCorrect) } catch {}
      }

      const lsPracticeStr = readLocalFlag(`practice_state_${lesson.id}`)
      let localPracticeDone = false
      if (lsPracticeStr) {
        try { localPracticeDone = JSON.parse(lsPracticeStr).status === 'success' } catch {}
      }

      const localTheoryDone = readLocalFlag(`theory_completed_${lesson.id}`) === 'true'
      const scoredFn = typeof hasBeenScoredFn === 'function' ? hasBeenScoredFn : () => false

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
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 1) {
        return parsed.map((p) => normalizePathProgress(p))
      }
    }
  } catch (e) {}
  return []
}

const initialCached = loadCachedPaths()
const globalPaths = ref(initialCached)
const globalIsLoading = ref(false)
const globalIsPreparingLesson = ref(false)
const globalHasFetchedAllPaths = ref(false)
let inFlightPathsRequest = null

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
        const response = await api.get('/paths')
        if (response.data && Array.isArray(response.data.data)) {
          const freshPaths = response.data.data
          const { loadProgress, hasBeenScored } = (await import('./useScoring')).useScoring()
          await loadProgress().catch(() => {})

          // Pertahankan chapter detail yang sudah pernah dimuat (misal quizzes) sembari meremajakan progress terbaru
          const detailedMap = new Map()
          paths.value.forEach(p => {
            if (Array.isArray(p.chapters) && p.chapters.some(c => c.lessons?.some(l => l.quizzes !== undefined))) {
              detailedMap.set(p.slug || String(p.id), p.chapters)
            }
          })

          paths.value = freshPaths.map(newPath => {
            const key = newPath.slug || String(newPath.id)
            const existingChapters = detailedMap.get(key)
            const mergedPath = existingChapters
              ? { ...newPath, chapters: existingChapters }
              : newPath
            return normalizePathProgress(mergedPath, hasBeenScored)
          })

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
  const fetchPathDetails = async (slug, skipLoadingState = false) => {
    if (!slug || slug === 'null' || slug === 'undefined') return null
    try {
      if (!skipLoadingState) isLoading.value = true
      const response = await api.get(`/paths/${slug}`)
      const detailedPath = response.data.data

      const { loadProgress, hasBeenScored } = (await import('./useScoring')).useScoring()
      await loadProgress()

      normalizePathProgress(detailedPath, hasBeenScored)

      const index = paths.value.findIndex(p => p.slug === slug || String(p.id) === String(slug))
      if (index !== -1) {
        paths.value[index] = detailedPath
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

