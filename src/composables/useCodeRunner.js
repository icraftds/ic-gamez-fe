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

  /** Jalankan `code.value` di dalam sandbox dan tampung hasilnya ke `output`. */
  const run = () => {
    const entries = []
    try {
      // new Function() scope-nya terisolasi dari module scope
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
