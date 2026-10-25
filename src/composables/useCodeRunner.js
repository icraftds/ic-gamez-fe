/**
 * Composable untuk mengelola state editor, persistence, dan eksekusi kode pengguna.
 * Menerapkan Clean Code & Strategy Pattern melalui modul runners terpisah.
 */
import { ref, watch } from 'vue'
import { executeCode } from '../utils/runners'

/** @typedef {{ type: 'log' | 'error' | 'warn' | 'table', text?: string, data?: any, columns?: any }} ConsoleEntry */

/**
 * Ekstraksi kode awal (initial_code atau initial_query) secara aman
 * dari objek practice atau JSON string.
 */
function extractInitialCode(practice) {
  if (!practice) return ''
  if (typeof practice === 'object') {
    return practice.initial_code || practice.initial_query || practice.code || ''
  }
  if (typeof practice === 'string') {
    try {
      const parsed = JSON.parse(practice)
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed.initial_code || parsed.initial_query || parsed.code || ''
      }
    } catch (e) {
      if (!practice.trim().startsWith('{')) {
        return practice
      }
    }
  }
  return ''
}

export function useCodeRunner() {
  /** @type {import('vue').Ref<string>} */
  const code = ref('// Ketik kode Anda di sini\n')

  /** @type {import('vue').Ref<ConsoleEntry[]>} */
  const output = ref([])

  const status = ref('idle')
  const currentLessonId = ref(null)
  const currentLessonSlug = ref(null)

  /**
   * Jalankan `code.value` berdasarkan bahasa yang dipilih melalui runner engine terisolasi.
   * @param {string} language - 'javascript', 'html', 'css', 'sql', 'python', 'php'
   * @param {object|null} context - Objek materi aktif
   */
  const run = async (language = 'javascript', context = null) => {
    try {
      output.value = await executeCode(language, code.value, context)
    } catch (error) {
      output.value = [{ type: 'error', text: error.message }]
    }
  }

  const isChallengeMode = () => {
    return typeof window !== 'undefined' && window.location.search.includes('mode=challenge')
  }

  const getStorageKey = (identifier) => {
    return isChallengeMode() ? `challenge_practice_state_${identifier}` : `practice_state_${identifier}`
  }

  const saveToStorage = () => {
    const keyId = currentLessonSlug.value || currentLessonId.value
    if (!keyId) return
    const data = {
      lessonId: currentLessonId.value,
      slug: currentLessonSlug.value,
      code: code.value,
      output: output.value,
      status: status.value
    }
    localStorage.setItem(getStorageKey(keyId), JSON.stringify(data))
    if (currentLessonId.value && currentLessonSlug.value && currentLessonId.value !== currentLessonSlug.value) {
      localStorage.setItem(getStorageKey(currentLessonId.value), JSON.stringify(data))
    }
  }

  const loadFromStorage = (lessonOrId, initialPractice = null, extraSlug = null) => {
    let lessonId = null
    let lessonSlug = null

    if (lessonOrId && typeof lessonOrId === 'object') {
      lessonId = lessonOrId.id
      lessonSlug = lessonOrId.slug
    } else {
      lessonId = lessonOrId
      lessonSlug = extraSlug || (typeof lessonOrId === 'string' && isNaN(Number(lessonOrId)) ? lessonOrId : null)
    }

    currentLessonId.value = lessonId
    currentLessonSlug.value = lessonSlug

    const defaultCode = extractInitialCode(initialPractice) || '// Ketik kode Anda di sini\n'

    // Coba storage key berbasis slug dulu untuk menghindari tabrakan ID antar materi/seeder
    const primaryKey = lessonSlug ? getStorageKey(lessonSlug) : (lessonId ? getStorageKey(lessonId) : null)
    let dataStr = primaryKey ? localStorage.getItem(primaryKey) : null

    // Fallback ke integer ID key jika slug key belum ada
    if (!dataStr && lessonId) {
      dataStr = localStorage.getItem(getStorageKey(lessonId))
    }

    if (dataStr) {
      try {
        const data = JSON.parse(dataStr)
        // Cegah kontaminasi: jika data di storage tersimpan dengan slug lain, abaikan
        if (data.slug && lessonSlug && data.slug !== lessonSlug) {
          resetCode(initialPractice)
          return
        }

        let savedCode = data.code
        // Deteksi bug lama: jika savedCode adalah raw JSON materi, abaikan
        if (savedCode && (
          savedCode.trim().startsWith('{"title":') ||
          savedCode.trim().startsWith('{"instruction":') ||
          savedCode.trim().startsWith('{"quizzes":')
        )) {
          savedCode = null
        }

        // Cegah kontaminasi silang seeder lama (contoh RESTful API bocor ke materi dasar pemrograman)
        if (savedCode && lessonSlug && !lessonSlug.includes('api') && !lessonSlug.includes('rest')) {
          if (savedCode.includes('apiBlueprint') || savedCode.includes('RESTful API Endpoints')) {
            savedCode = null
          }
        }

        code.value = (savedCode !== null && savedCode !== undefined) ? savedCode : defaultCode
        output.value = data.output || []
        status.value = data.status || 'idle'
        return
      } catch (e) {
        resetCode(initialPractice)
        return
      }
    }

    resetCode(initialPractice)
  }

  // Watch for changes to persist
  watch([code, output, status], () => {
    saveToStorage()
  }, { deep: true })

  const clearOutput = () => {
    output.value = []
    status.value = 'idle'
  }

  const resetCode = (initialPractice = null) => {
    const defaultCode = extractInitialCode(initialPractice) || '// Ketik kode Anda di sini\n'
    code.value = defaultCode
    output.value = []
    status.value = 'idle'
    
    // Hapus data lama yang salah dari localStorage untuk lesson ini
    const keyId = currentLessonSlug.value || currentLessonId.value
    if (keyId) {
      localStorage.removeItem(getStorageKey(keyId))
      if (currentLessonId.value) {
        localStorage.removeItem(getStorageKey(currentLessonId.value))
      }
    }
  }

  return { code, output, status, run, clearOutput, resetCode, loadFromStorage }
}
