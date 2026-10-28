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

function isCodeLanguageCompatible(lang, codeStr) {
  if (!codeStr || !lang) return true
  const trimmed = codeStr.trim()
  const lower = trimmed.toLowerCase()

  // Jika bahasa pemrograman (JS, Python, PHP, SQL), kode TIDAK boleh berupa struktur HTML/CSS mentah di root
  if (['javascript', 'python', 'php', 'sql'].includes(lang.toLowerCase())) {
    if (
      lower.startsWith('<!--') ||
      lower.startsWith('<!doctype') ||
      lower.startsWith('<html') ||
      lower.startsWith('<section') ||
      lower.startsWith('<div') ||
      lower.startsWith('<style') ||
      lower.startsWith('<main') ||
      lower.startsWith('<header') ||
      lower.startsWith('<head') ||
      lower.startsWith('<body')
    ) {
      return false
    }
  }

  // Jika HTML/CSS, kode tidak boleh berupa statement JS/Python murni tanpa tag HTML/style
  if (lang.toLowerCase() === 'html' || lang.toLowerCase() === 'css') {
    if (
      (lower.startsWith('const ') || lower.startsWith('let ') || lower.startsWith('var ') || lower.startsWith('def ') || lower.startsWith('import ') || lower.startsWith('function ')) &&
      !lower.includes('<') &&
      !lower.includes('>')
    ) {
      return false
    }
  }

  return true
}

export function useCodeRunner() {
  /** @type {import('vue').Ref<string>} */
  const code = ref('// Ketik kode Anda di sini\n')

  /** @type {import('vue').Ref<ConsoleEntry[]>} */
  const output = ref([])

  const status = ref('idle')
  const currentLessonId = ref(null)
  const currentLessonSlug = ref(null)
  const currentLessonLanguage = ref('javascript')

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
    const keyId = currentLessonSlug.value || (currentLessonId.value ? `id_${currentLessonId.value}` : null)
    if (!keyId) return
    const data = {
      lessonId: currentLessonId.value,
      slug: currentLessonSlug.value,
      language: currentLessonLanguage.value,
      code: code.value,
      output: output.value,
      status: status.value,
      v: 2
    }
    localStorage.setItem(getStorageKey(keyId), JSON.stringify(data))
  }

  const loadFromStorage = (lessonOrId, initialPractice = null, extraSlug = null, expectedLang = null) => {
    let lessonId = null
    let lessonSlug = null
    let lessonLang = expectedLang

    if (lessonOrId && typeof lessonOrId === 'object') {
      lessonId = lessonOrId.id
      lessonSlug = lessonOrId.slug
      lessonLang = lessonLang || lessonOrId.language
    } else {
      lessonId = lessonOrId
      lessonSlug = extraSlug || (typeof lessonOrId === 'string' && isNaN(Number(lessonOrId)) ? lessonOrId : null)
    }

    currentLessonId.value = lessonId
    currentLessonSlug.value = lessonSlug
    currentLessonLanguage.value = lessonLang || 'javascript'

    const defaultCode = extractInitialCode(initialPractice) || '// Ketik kode Anda di sini\n'

    // Coba storage key berbasis slug dulu untuk menghindari tabrakan ID antar materi/seeder
    const primaryKey = lessonSlug ? getStorageKey(lessonSlug) : (lessonId ? getStorageKey(`id_${lessonId}`) : null)
    let dataStr = primaryKey ? localStorage.getItem(primaryKey) : null

    // Fallback ke legacy integer ID key HANYA jika valid dan cocok bahasanya
    if (!dataStr && lessonId) {
      const legacyKey = getStorageKey(lessonId)
      const legacyDataStr = localStorage.getItem(legacyKey)
      if (legacyDataStr) {
        try {
          const parsed = JSON.parse(legacyDataStr)
          // Jika slug tersimpan dan berbeda, atau bahasa tidak kompatibel, buang legacy key yang korup!
          if ((parsed.slug && lessonSlug && parsed.slug !== lessonSlug) || !isCodeLanguageCompatible(lessonLang, parsed.code)) {
            localStorage.removeItem(legacyKey)
          } else {
            dataStr = legacyDataStr
          }
        } catch (e) {
          localStorage.removeItem(legacyKey)
        }
      }
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

        // VALIDASI BAHASA KETAT: Jika kode yang tersimpan tidak sesuai dengan bahasa materi, buang!
        if (savedCode && !isCodeLanguageCompatible(lessonLang, savedCode)) {
          if (primaryKey) localStorage.removeItem(primaryKey)
          if (lessonId) localStorage.removeItem(getStorageKey(lessonId))
          resetCode(initialPractice)
          return
        }

        // Cegah pesan output HTML bocor ke bahasa pemrograman
        let cleanOutput = data.output || []
        let cleanStatus = data.status || 'idle'
        if (lessonLang && !['html', 'css'].includes(lessonLang.toLowerCase())) {
          const hasHtmlOutput = cleanOutput.some(o => o.text && o.text.includes('Render HTML berhasil'))
          if (hasHtmlOutput) {
            cleanOutput = []
            cleanStatus = 'idle'
          }
        }

        code.value = (savedCode !== null && savedCode !== undefined) ? savedCode : defaultCode
        output.value = cleanOutput
        status.value = cleanStatus
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
    const keyId = currentLessonSlug.value || (currentLessonId.value ? `id_${currentLessonId.value}` : null)
    if (keyId) {
      localStorage.removeItem(getStorageKey(keyId))
    }
    if (currentLessonSlug.value) {
      localStorage.removeItem(getStorageKey(currentLessonSlug.value))
    }
    if (currentLessonId.value) {
      localStorage.removeItem(getStorageKey(currentLessonId.value))
      localStorage.removeItem(getStorageKey(`id_${currentLessonId.value}`))
    }
  }

  return { code, output, status, run, clearOutput, resetCode, loadFromStorage }
}
