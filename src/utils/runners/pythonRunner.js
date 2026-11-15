import { extractTestInput, parsePracticeData, serializeTestInput, stripCommentsByLanguage } from './testInputHelper.js'

function shouldBindPythonInputVariable(code = '', testInput = null) {
  if (testInput === null || testInput === undefined) return false
  const clean = stripCommentsByLanguage(code, 'python')
  // Jangan timpa built-in input() jika kode user memang memanggil fungsi input(...) atau meng-assign input = ...
  if (/\binput\s*\(/.test(clean) || /(?:^|\n)\s*input\s*=[^=]/.test(clean)) {
    return false
  }
  return true
}

function detectPythonTargetFunction(code = '', context = null) {
  const practiceObj = parsePracticeData(context)
  const explicit = context?.function_name || practiceObj?.function_name
  if (explicit) return explicit
  const match = code.match(/(?:async\s+)?def\s+(solve\w*)\s*\(/)
  return match ? match[1] : 'solve'
}

/**
 * Runner untuk Python menggunakan Pyodide WebAssembly (100% Client-side di browser)
 */
export async function runPython(code, context = null) {
  const entries = []
  const testInput = extractTestInput(context)
  const rawInputStr = serializeTestInput(testInput)
  const practiceObj = parsePracticeData(context)

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

  const targetFnName = detectPythonTargetFunction(code, context)
  const bindInputVar = shouldBindPythonInputVariable(code, testInput)
  const jsonInputLiteral = JSON.stringify(JSON.stringify(testInput))

  // Siapkan environment terisolasi: sys.argv, sys.stdin, input object, serta bersihkan fungsi sisa run sebelumnya
  await pyodide.runPythonAsync(`
import sys, io, json, builtins, inspect, os
os.makedirs('/tmp', exist_ok=True)
sys.argv = ['solution.py', ${JSON.stringify(rawInputStr)}]
sys.stdin = io.StringIO(${JSON.stringify(rawInputStr)})
input = builtins.input
__ic_test_input = json.loads(${jsonInputLiteral})
for __ic_stale in ('solve', ${JSON.stringify(targetFnName)}):
    if __ic_stale in globals() and __ic_stale != 'input':
        del globals()[__ic_stale]
${bindInputVar ? 'input = __ic_test_input' : ''}
`)

  // Eksekusi setup_code jika disediakan
  if (context?.setup_code || practiceObj?.setup_code) {
    try {
      await pyodide.runPythonAsync(context?.setup_code || practiceObj?.setup_code)
    } catch (e) {
      entries.push({ type: 'error', text: `Setup Error: ${e.message}` })
    }
  }

  await pyodide.runPythonAsync(code)

  // Jika kode mendefinisikan solve(...) / targetFnName tanpa mencetak output, panggil otomatis dengan __ic_test_input
  if (entries.length === 0) {
    const postRunCode = `
__ic_fn = globals().get(${JSON.stringify(targetFnName)}) or globals().get('solve')
if callable(__ic_fn):
    __ic_sig = inspect.signature(__ic_fn)
    __ic_wrote = [False]
    __ic_orig_write = sys.stdout.write
    def __ic_track_write(s):
        if s and s.strip():
            __ic_wrote[0] = True
        return __ic_orig_write(s)
    sys.stdout.write = __ic_track_write
    try:
        __ic_res = __ic_fn() if len(__ic_sig.parameters) == 0 else __ic_fn(__ic_test_input)
        if inspect.isawaitable(__ic_res):
            __ic_res = await __ic_res
    finally:
        sys.stdout.write = __ic_orig_write
    if not __ic_wrote[0]:
        if __ic_res is None:
            print("null")
        elif isinstance(__ic_res, (dict, list, bool, int, float)):
            print(json.dumps(__ic_res, ensure_ascii=False))
        else:
            print(str(__ic_res))
`
    await pyodide.runPythonAsync(postRunCode)
  }

  // Kembalikan builtins.input setelah selesai agar session Pyodide tetap bersih
  try {
    await pyodide.runPythonAsync(`import builtins\ninput = builtins.input`)
  } catch {}

  return entries.length > 0
    ? entries
    : [{ type: 'log', text: '(Tidak ada output)' }]
}
