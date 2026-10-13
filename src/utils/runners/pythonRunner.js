/**
 * Runner untuk Python menggunakan Pyodide WebAssembly (100% Client-side di browser)
 */
export async function runPython(code) {
  const entries = []

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

  await pyodide.runPythonAsync(code)

  return entries.length > 0
    ? entries
    : [{ type: 'log', text: '(Tidak ada output)' }]
}
