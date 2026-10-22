import { runHtml } from './htmlRunner'
import { runSql } from './sqlRunner'
import { runPython } from './pythonRunner'
import { runPhp } from './phpRunner'
import { runJavascript } from './javascriptRunner'

/**
 * Dispatcher untuk mengeksekusi kode berdasarkan bahasa pemrograman.
 * Menerapkan Strategy Pattern agar useCodeRunner tetap ramping, modular, dan maintainable.
 *
 * @param {string} language - 'javascript', 'html', 'css', 'sql', 'python', 'php'
 * @param {string} code - Kode sumber pengguna
 * @param {object|null} context - Objek materi / lesson untuk parsing test case input
 * @returns {Promise<Array>} Array of output entries ({ type, text, data, columns })
 */
export async function executeCode(language = 'javascript', code = '', context = null) {
  const lang = (language || 'javascript').toLowerCase()

  switch (lang) {
    case 'html':
    case 'css':
      return await runHtml()

    case 'sql':
      return await runSql(code, context)

    case 'python':
      return await runPython(code)

    case 'php':
      return await runPhp(code, context)

    case 'javascript':
    case 'js':
    default:
      return await runJavascript(code, context)
  }
}
