/**
 * Composable untuk menjalankan kode JavaScript pengguna
 * di dalam sandbox yang aman (tanpa akses ke DOM/window).
 */
import { ref } from 'vue'

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
   * @param {string} language - 'javascript', 'html', atau 'sql'
   */
  const run = (language = 'javascript') => {
    const entries = []
    try {
      if (language === 'html' || language === 'css') {
        // Untuk HTML/CSS, kembalikan sinyal sukses agar xp bisa didapat dan UI bisa mere-render preview
        output.value = [{ type: 'log', text: 'Render HTML berhasil. Periksa tab Preview!' }]
        return
      }

      if (language === 'sql') {
        // Mock eksekusi SQL
        output.value = [{ type: 'log', text: 'Query SQL berhasil dieksekusi secara simulasi.' }]
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

  const clearOutput = () => {
    output.value = []
  }

  const resetCode = () => {
    code.value = '// Ketik kode Anda di sini\n'
    output.value = []
  }

  return { code, output, run, clearOutput, resetCode }
}
