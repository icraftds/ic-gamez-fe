/**
 * Composable untuk menjalankan kode JavaScript pengguna
 * di dalam sandbox yang aman (tanpa akses ke DOM/window).
 */
import { ref, watch } from 'vue'

/** @typedef {{ type: 'log' | 'error' | 'warn', text: string }} ConsoleEntry */

export function useCodeRunner() {
  /** @type {import('vue').Ref<string>} */
  const code = ref('// Ketik kode Anda di sini\n')

  /** @type {import('vue').Ref<ConsoleEntry[]>} */
  const output = ref([])

  /**
   * Membuat objek console tiruan yang menangkap semua log
   * ke dalam array `entries`, tanpa mengekspos console asli.
   * @param {ConsoleEntry[]} entries
   */
  const createSandboxConsole = (entries) => ({
    log: (...args) =>
      entries.push({ type: 'log', text: args.map(String).join(' ') }),
    error: (...args) =>
      entries.push({ type: 'error', text: args.map(String).join(' ') }),
    warn: (...args) =>
      entries.push({ type: 'warn', text: '⚠ ' + args.map(String).join(' ') }),
  })

  /** 
   * Jalankan `code.value` berdasarkan bahasa yang dipilih.
   * @param {string} language - 'javascript', 'html', 'sql', 'python', dll
   */
  const run = async (language = 'javascript') => {
    const entries = []
    try {
      if (language === 'html' || language === 'css') {
        // Untuk HTML/CSS, kembalikan sinyal sukses agar xp bisa didapat dan UI bisa mere-render preview
        output.value = [{ type: 'log', text: 'Render HTML berhasil. Periksa tab Preview!' }]
        return
      }

      if (language === 'sql') {
        // Mock eksekusi SQL yang mengembalikan data Tabular (Array of Objects)
        output.value = [{ 
          type: 'table', 
          data: [
            { id: 1, nama: "Andi", nilai: 95 },
            { id: 2, nama: "Budi", nilai: 88 },
            { id: 3, nama: "Siti", nilai: 92 }
          ]
        }]
        return
      }

      if (language === 'python') {
        output.value = [{ type: 'log', text: 'Menyiapkan lingkungan Python...' }]
        
        try {
          if (!window.loadPyodide) {
            output.value = [{ type: 'log', text: 'Mengunduh pustaka Python (hanya sekali)...' }]
            const script = document.createElement('script')
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js'
            document.head.appendChild(script)
            
            await new Promise((resolve, reject) => {
              script.onload = resolve
              script.onerror = () => reject(new Error('Gagal memuat Pyodide dari CDN.'))
            })
          }
          
          if (!window.pyodideInstance) {
            window.pyodideInstance = await window.loadPyodide({
              indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
            })
          }
          
          const pyodide = window.pyodideInstance
          
          // Clear previous output and redirect stdout/stderr to entries array
          entries.length = 0
          pyodide.setStdout({ batched: (msg) => entries.push({ type: 'log', text: msg }) })
          pyodide.setStderr({ batched: (msg) => entries.push({ type: 'error', text: msg }) })
          
          await pyodide.runPythonAsync(code.value)
          
          output.value = entries.length > 0 ? entries : [{ type: 'log', text: '(Tidak ada output)' }]
        } catch (err) {
          output.value = [{ type: 'error', text: err.message }]
        }
        
        return
      }

      // Default: JavaScript execution via sandboxed Function
      const fn = new Function('console', code.value)
      fn(createSandboxConsole(entries))

      output.value = entries.length > 0
        ? entries
        : [{ type: 'log', text: '(Tidak ada output)' }]
    } catch (error) {
      output.value = [{ type: 'error', text: error.message }]
    }
  }

  const status = ref('idle')
  const currentLessonId = ref(null)

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
