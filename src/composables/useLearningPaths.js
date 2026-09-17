import { ref, computed } from 'vue'
import api from '../services/api'

const globalPaths = ref([])
const globalIsLoading = ref(false)
const globalIsPreparingLesson = ref(false)
const globalHasFetchedAllPaths = ref(false)

export function useLearningPaths() {
  const paths = globalPaths
  const isLoading = globalIsLoading
  const isPreparingLesson = globalIsPreparingLesson
  const hasFetchedAllPaths = globalHasFetchedAllPaths

  const fetchPaths = async () => {
    try {
      isLoading.value = true
      const response = await api.get('/paths')
      paths.value = response.data.data
      hasFetchedAllPaths.value = true
    } catch (error) {
      console.error('Failed to fetch learning paths', error)
    } finally {
      isLoading.value = false
    }
  }

  // To get detailed info including chapters and lessons for a specific path
  const fetchPathDetails = async (slug) => {
    try {
      isLoading.value = true
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
              if (prog && Object.keys(prog).length > 0) {
                lesson.isCompleted = prog.is_completed || false;
                lesson.quizPassed = prog.quiz_passed || false;
                lesson.practiceDone = !!prog.saved_code;
              } else {
                lesson.isCompleted = hasBeenScored('theory', lesson.id) || false;
                lesson.quizPassed = hasBeenScored('quiz', lesson.id) || false;
                lesson.practiceDone = hasBeenScored('practice', lesson.id) || false;
              }
            });
          }
        });
      }

      const index = paths.value.findIndex(p => p.slug === slug)
      if (index !== -1) {
        paths.value[index] = detailedPath
      } else {
        paths.value.push(detailedPath)
      }
      return detailedPath
    } catch (error) {
      console.error('Failed to fetch path details', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const fetchAllPathsDetails = async () => {
    if (paths.value.length === 0) {
      await fetchPaths();
    }
    const promises = paths.value.map(p => fetchPathDetails(p.slug || p.id));
    await Promise.all(promises);
  }

  const getPathById = (id) => {
    return paths.value.find(p => p.id === id || p.slug === id)
  }

  const getChapterById = (pathId, chapterId) => {
    const path = getPathById(pathId)
    if (!path || !path.chapters) return null
    return path.chapters.find(c => c.id === chapterId || c.slug === chapterId)
  }

  const getLessonById = (pathId, chapterId, lessonId) => {
    const chapter = getChapterById(pathId, chapterId)
    if (!chapter || !chapter.lessons) return null
    return chapter.lessons.find(l => l.id === lessonId || l.slug === lessonId)
  }

  // Jika diperlukan untuk backward compatibility
  const allChallenges = computed(() => {
    const challenges = []
    paths.value.forEach(path => {
      if (path.chapters) {
        path.chapters.forEach(chapter => {
          if (chapter.lessons) {
            chapter.lessons.forEach(lesson => {
              if (lesson.type === 'code') {
                challenges.push({
                  ...lesson,
                  pathId: path.slug || path.id,
                  chapterId: chapter.slug || chapter.id,
                  category: path.title,
                  difficulty: lesson.is_premium ? 'Sulit' : 'Sedang'
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
