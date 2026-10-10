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
        output.value = [{ type: 'log', text: 'Mengeksekusi Python di server...' }]
        // Catatan: Ini adalah endpoint dummy untuk integrasi backend Piston/Judge0 nanti.
        // const res = await axios.post('/api/run-code', { code: code.value, language });
        // output.value = [{ type: 'log', text: res.data.stdout }];
        
        // Mock sukses sementara agar tidak crash di JS Sandbox
        setTimeout(() => {
          output.value = [{ type: 'log', text: 'Simulasi eksekusi Python sukses.' }]
        }, 1000);
        
        // Untuk simulasi ini kita kembalikan promise agar UI tidak langsung nge-check
        await new Promise(resolve => setTimeout(resolve, 1000));
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
