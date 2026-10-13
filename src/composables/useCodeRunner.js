/**
 * Composable untuk mengelola state editor, persistence, dan eksekusi kode pengguna.
 * Menerapkan Clean Code & Strategy Pattern melalui modul runners terpisah.
 */
import { ref, watch } from 'vue'
import { executeCode } from '../utils/runners'

/** @typedef {{ type: 'log' | 'error' | 'warn' | 'table', text?: string, data?: any, columns?: any }} ConsoleEntry */

export function useCodeRunner() {
  /** @type {import('vue').Ref<string>} */
  const code = ref('// Ketik kode Anda di sini\n')

  /** @type {import('vue').Ref<ConsoleEntry[]>} */
  const output = ref([])

  const status = ref('idle')
  const currentLessonId = ref(null)

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

  const saveToStorage = () => {
    if (!currentLessonId.value) return
    const data = {
      code: code.value,
      output: output.value,
      status: status.value
    }
    localStorage.setItem(`practice_state_${currentLessonId.value}`, JSON.stringify(data))
  }

  const loadFromStorage = (lessonId, initialCode = null) => {
    currentLessonId.value = lessonId
    let parsedInitialCode = initialCode
    if (initialCode) {
      try {
        const json = JSON.parse(initialCode)
        parsedInitialCode = json.initial_code || json.initial_query || initialCode
      } catch (e) {}
    }

    const dataStr = localStorage.getItem(`practice_state_${lessonId}`)
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr)
        let savedCode = data.code
        // Deteksi bug lama: jika savedCode adalah raw JSON materi, abaikan!
        if (savedCode && (savedCode.trim().startsWith('{"title":') || savedCode.trim().startsWith('{"instruction":') || savedCode === initialCode)) {
          savedCode = null
        }
        code.value = savedCode || parsedInitialCode || '// Ketik kode Anda di sini\n'
        output.value = data.output || []
        status.value = data.status || 'idle'
      } catch (e) {
        resetCode(parsedInitialCode)
      }
    } else {
      resetCode(parsedInitialCode)
    }
  }

  // Watch for changes to persist
  watch([code, output, status], () => {
    saveToStorage()
  }, { deep: true })

  const clearOutput = () => {
    output.value = []
    status.value = 'idle'
  }

  const resetCode = (initialCode = null) => {
    let parsedInitialCode = initialCode
    if (initialCode) {
      try {
        const json = JSON.parse(initialCode)
        parsedInitialCode = json.initial_code || json.initial_query || initialCode
      } catch (e) {}
    }
    code.value = parsedInitialCode || '// Ketik kode Anda di sini\n'
    output.value = []
    status.value = 'idle'
  }

  return { code, output, status, run, clearOutput, resetCode, loadFromStorage }
}
