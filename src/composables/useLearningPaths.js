import { ref, computed } from 'vue'
import api from '../services/api'

const CACHE_KEY = 'ic_learning_paths_cache'

function loadCachedPaths() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 1) {
        return parsed
      }
    }
  } catch (e) {}
  return []
}

const initialCached = loadCachedPaths()
const globalPaths = ref(initialCached)
const globalIsLoading = ref(false)
const globalIsPreparingLesson = ref(false)
const globalHasFetchedAllPaths = ref(initialCached.length > 1)

export function useLearningPaths() {
  const paths = globalPaths
  const isLoading = globalIsLoading
  const isPreparingLesson = globalIsPreparingLesson
  const hasFetchedAllPaths = globalHasFetchedAllPaths

  const fetchPaths = async (force = false) => {
    if (isLoading.value && !force) return
    try {
      isLoading.value = true
      const response = await api.get('/paths')
      if (response.data && Array.isArray(response.data.data)) {
        const freshPaths = response.data.data

        // Map existing detailed chapters to retain loaded lessons/quizzes
        const detailedMap = new Map()
        paths.value.forEach(p => {
          if (p.chapters && p.chapters.length > 0) {
            detailedMap.set(p.slug || String(p.id), p.chapters)
          }
        })

        paths.value = freshPaths.map(newPath => {
          const key = newPath.slug || String(newPath.id)
          const existingChapters = detailedMap.get(key)
          if (existingChapters) {
            return {
              ...newPath,
              chapters: existingChapters
            }
          }
          return newPath
        })

        hasFetchedAllPaths.value = true
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(freshPaths))
        } catch (e) {}
      }
    } catch (error) {
      console.error('Failed to fetch learning paths', error)
    } finally {
      isLoading.value = false
    }
  }

  // To get detailed info including chapters and lessons for a specific path
  const fetchPathDetails = async (slug, skipLoadingState = false) => {
    if (!slug || slug === 'null' || slug === 'undefined') return null
    try {
      if (!skipLoadingState) isLoading.value = true
      const response = await api.get(`/paths/${slug}`)
      // Update or insert the detailed path into our state
      const detailedPath = response.data.data

      // Try loading global progress first to fill in missing progress
      const { loadProgress, hasBeenScored } = (await import('./useScoring')).useScoring();
      await loadProgress();

      // Normalize progress fields for frontend reactivity
      if (detailedPath.chapters) {
        detailedPath.chapters.forEach(chapter => {
          if (chapter.lessons) {
            chapter.lessons.forEach(lesson => {
              let prog = lesson.progress;
              if (Array.isArray(prog)) {
                prog = prog.length > 0 ? prog[0] : null;
              }
              
              const lsQuizStr = localStorage.getItem(`quiz_state_${lesson.id}`);
              let localQuizPassed = false;
              if (lsQuizStr) {
                try { localQuizPassed = JSON.parse(lsQuizStr).isCorrect; } catch(e){}
              }
              const lsPracticeStr = localStorage.getItem(`practice_state_${lesson.id}`);
              let localPracticeDone = false;
              if (lsPracticeStr) {
                try { localPracticeDone = JSON.parse(lsPracticeStr).status === 'success'; } catch(e){}
              }
              const localTheoryDone = localStorage.getItem(`theory_completed_${lesson.id}`) === 'true';

              if (prog && Object.keys(prog).length > 0) {
                lesson.isCompleted = prog.is_completed || localTheoryDone;
                lesson.quizPassed = prog.quiz_passed || localQuizPassed;
                lesson.practiceDone = !!prog.saved_code || localPracticeDone;
              } else {
                lesson.isCompleted = hasBeenScored('theory', lesson.id) || localTheoryDone;
                lesson.quizPassed = hasBeenScored('quiz', lesson.id) || localQuizPassed;
                lesson.practiceDone = hasBeenScored('practice', lesson.id) || localPracticeDone;
              }
            });
          }
        });
      }

      const index = paths.value.findIndex(p => p.slug === slug || String(p.id) === String(slug))
      if (index !== -1) {
        paths.value[index] = detailedPath
      } else {
        paths.value.push(detailedPath)
        // If paths list is incomplete, fetch full list in background
        if (!hasFetchedAllPaths.value || paths.value.length <= 1) {
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
      await fetchPaths();
    }
    isLoading.value = true;
    try {
      const promises = paths.value.map(p => fetchPathDetails(p.slug || p.id, true));
      await Promise.all(promises);
    } finally {
      isLoading.value = false;
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
    const chapter = getChapterById(pathId, chapterId)
    if (chapter && chapter.lessons) {
      const found = chapter.lessons.find(l => String(l.id) === String(lessonId) || l.slug === lessonId)
      if (found) return found
    }

    // Fallback: cari di seluruh paths dan chapters jika format ID/slug berbeda
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

