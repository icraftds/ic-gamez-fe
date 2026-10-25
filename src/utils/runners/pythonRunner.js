/**
 * Helper untuk mengekstrak input pertama dari context latihan
 */
function extractTestInput(context) {
  if (!context) return null
  let practiceObj = context.practice
  if (typeof practiceObj === 'string') {
    try { practiceObj = JSON.parse(practiceObj) } catch {}
  }
  const testCases = context.test_cases || practiceObj?.test_cases
  if (testCases && testCases[0] && testCases[0].input) {
    try {
      return JSON.parse(testCases[0].input)
    } catch {
      return testCases[0].input
    }
  }
  return null
}

/**
 * Runner untuk Python menggunakan Pyodide WebAssembly (100% Client-side di browser)
 */
export async function runPython(code, context = null) {
  const entries = []
  const testInput = extractTestInput(context)
  const rawInputStr = typeof testInput === 'object' && testInput !== null
    ? JSON.stringify(testInput)
    : String(testInput ?? '')

  if (!window.loadPyodide) {
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
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
    })
  }

  const pyodide = window.pyodideInstance

  pyodide.setStdout({ batched: (msg) => entries.push({ type: 'log', text: msg }) })
  pyodide.setStderr({ batched: (msg) => entries.push({ type: 'error', text: msg }) })

  // Auto-load external packages (seperti numpy, pandas, matplotlib) jika diimpor di kode
  if (pyodide.loadPackagesFromImports) {
    try {
      await pyodide.loadPackagesFromImports(code)
    } catch (e) {
      console.warn('Pyodide package load warning:', e)
    }
  }

  // Siapkan sys.argv dengan input dari test case
  try {
    await pyodide.runPythonAsync(`import sys\nsys.argv = ['solution.py', ${JSON.stringify(rawInputStr)}]`)
  } catch (e) {
    console.warn('Gagal set sys.argv:', e)
  }

  // Eksekusi setup_code jika disediakan
  if (context?.setup_code) {
    try {
      await pyodide.runPythonAsync(context.setup_code)
    } catch (e) {
      entries.push({ type: 'error', text: `Setup Error: ${e.message}` })
    }
  }

  await pyodide.runPythonAsync(code)

  return entries.length > 0
    ? entries
    : [{ type: 'log', text: '(Tidak ada output)' }]
}
