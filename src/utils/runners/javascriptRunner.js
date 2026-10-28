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
 * Runner untuk JavaScript di dalam isolated Function sandbox dengan polyfill Node/FS
 */
export async function runJavascript(code, context = null) {
  const entries = []
  const testInput = extractTestInput(context)

  const execState = { logged: false }
  const sandboxConsole = {
    log: (...args) => {
      execState.logged = true
      entries.push({ type: 'log', text: args.map(String).join(' ') })
    },
    error: (...args) => entries.push({ type: 'error', text: args.map(String).join(' ') }),
    warn: (...args) => entries.push({ type: 'warn', text: '⚠ ' + args.map(String).join(' ') }),
  }

  const rawInputStr = typeof testInput === 'object' && testInput !== null
    ? JSON.stringify(testInput)
    : String(testInput ?? '')

  let practiceObj = context?.practice
  if (typeof practiceObj === 'string') {
    try { practiceObj = JSON.parse(practiceObj) } catch {}
  }
  let customFnName = context?.function_name || practiceObj?.function_name || null
  if (!customFnName) {
    const fnMatch = code.match(/function\s+(solve\w*)\s*\(/) || code.match(/(?:const|let|var)\s+(solve\w*)\s*=\s*(?:function|\([^)]*\)\s*=>)/)
    if (fnMatch) {
      customFnName = fnMatch[1]
    }
  }
  const setupCode = context?.setup_code || ''

  const fakeRequire = (mod) => {
    if (mod === 'fs') {
      return {
        readFileSync: () => rawInputStr
      }
    }
    return {}
  }

  const fakeProcess = {
    argv: ['node', 'solution.js', rawInputStr],
    stdin: {
      read: () => rawInputStr,
      on: () => {}
    },
    stdout: {
      write: (...args) => sandboxConsole.log(...args)
    }
  }

  const harnessCode = `
    let __INPUT__ = ${JSON.stringify(testInput)};
    ${setupCode ? setupCode + '\n;' : ''}
    ${code}
    ;
    let __fnToRun = null;
    ${customFnName ? `try { if (typeof ${customFnName} === 'function') __fnToRun = ${customFnName}; } catch(e){}` : ''}
    if (!__fnToRun) {
      try { if (typeof solve === 'function') __fnToRun = solve; } catch(e){}
    }
    if (__fnToRun && !__state.logged) {
      try {
        const __res = __fnToRun(__INPUT__);
        if (__res !== undefined) {
          console.log(typeof __res === 'object' && __res !== null ? JSON.stringify(__res) : String(__res));
        }
      } catch(e) {
        console.error(e.message);
      }
    }
  `

  const fn = new Function('console', '__state', 'require', 'process', harnessCode)
  fn(sandboxConsole, execState, fakeRequire, fakeProcess)

  return entries.length > 0
    ? entries
    : [{ type: 'log', text: '(Tidak ada output)' }]
}
