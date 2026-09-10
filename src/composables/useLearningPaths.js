import { ref, computed } from 'vue'
import { dasarPemrogramanChapters } from '../data/pathDasarPemrograman'
import { databaseChapters } from '../data/pathDatabase'
import { frontendChapters } from '../data/pathFrontend'
import { backendChapters } from '../data/pathBackend'

export function useLearningPaths() {
  const paths = ref([
    {
      id: 'dasar',
      title: 'Dasar Pemrograman',
      description: 'Pelajari konsep dasar pemrograman, variabel, tipe data, logika dasar, dan struktur data menggunakan syntax universal.',
      icon: 'fa-solid fa-code',
      isPremium: false,
      isLocked: false,
      chapters: dasarPemrogramanChapters
    },
    {
      id: 'database',
      title: 'Dunia Database (SQL)',
      description: 'Pelajari cara menyimpan, mengambil, dan mengelola data dalam database relasional menggunakan bahasa SQL.',
      icon: 'fa-solid fa-database',
      isPremium: false,
      isLocked: false,
      chapters: databaseChapters
    },
    {
      id: 'frontend',
      title: 'Frontend Mastery',
      description: 'Kuasai keterampilan merancang antarmuka web dengan HTML, CSS, JavaScript dan arsitektur modern yang responsif.',
      icon: 'fa-brands fa-vuejs',
      isPremium: false,
      isLocked: false,
      chapters: frontendChapters
    },
    {
      id: 'backend',
      title: 'Backend Development',
      description: 'Bangun server yang kuat, buat REST API, dan integrasi dengan database relasional menggunakan ekosistem Node.js.',
      icon: 'fa-brands fa-node-js',
      isPremium: false,
      isLocked: false,
      chapters: backendChapters
    }
  ])

  const getPathById = (id) => {
    return paths.value.find(p => p.id === id)
  }

  const getChapterById = (pathId, chapterId) => {
    const path = getPathById(pathId)
    if (!path) return null
    return path.chapters.find(c => c.id === chapterId)
  }

  const getLessonById = (pathId, chapterId, lessonId) => {
    const chapter = getChapterById(pathId, chapterId)
    if (!chapter) return null
    return chapter.lessons.find(l => l.id === lessonId)
  }

  const allChallenges = computed(() => {
    const challenges = []
    paths.value.forEach(path => {
      path.chapters.forEach(chapter => {
        chapter.lessons.forEach(lesson => {
          if (lesson.type === 'code') {
            challenges.push({
              ...lesson,
              pathId: path.id,
              chapterId: chapter.id,
              category: path.title,
              difficulty: lesson.isPremium ? 'Hard' : 'Medium' // Mock difficulty
            })
          }
        })
      })
    })
    return challenges
  })

  return {
    paths,
    getPathById,
    getChapterById,
    getLessonById,
    allChallenges
  }
}
