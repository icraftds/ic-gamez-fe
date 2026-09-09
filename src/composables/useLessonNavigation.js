/**
 * Composable untuk mengelola navigasi antar lesson (prev/next)
 * dalam sebuah learning path.
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export function useLessonNavigation(path, lessonId, pathId) {
  const router = useRouter()

  /** Daftar semua lesson dari semua chapter, diratakan jadi satu array. */
  const allLessons = computed(() => {
    if (!path.value) return []
    return path.value.chapters.flatMap((chapter) =>
      chapter.lessons.map((lesson) => ({ ...lesson, chapterId: chapter.id }))
    )
  })

  const currentIndex = computed(() =>
    allLessons.value.findIndex((l) => l.id === lessonId.value)
  )

  const isFirstLesson = computed(() => currentIndex.value <= 0)
  const isLastLesson = computed(() => currentIndex.value >= allLessons.value.length - 1)

  /** Navigasi ke lesson tertentu berdasarkan chapter dan lesson-nya. */
  const goToLesson = (chapterId, lessonId) => {
    router.push(`/learning/${pathId.value}/lesson/${chapterId}/${lessonId}`)
  }

  const goToPrevLesson = () => {
    if (isFirstLesson.value) return
    const prev = allLessons.value[currentIndex.value - 1]
    goToLesson(prev.chapterId, prev.id)
  }

  const goToNextLesson = () => {
    if (isLastLesson.value) {
      router.push(`/learning/${pathId.value}`)
      return
    }
    const next = allLessons.value[currentIndex.value + 1]
    goToLesson(next.chapterId, next.id)
  }

  return {
    allLessons,
    currentIndex,
    isFirstLesson,
    isLastLesson,
    goToLesson,
    goToPrevLesson,
    goToNextLesson,
  }
}
