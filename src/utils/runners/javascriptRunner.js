import { extractTestInput, parsePracticeData, serializeTestInput, stripCommentsByLanguage } from './testInputHelper.js'

function hasTopLevelInputDeclaration(code = '') {
  const clean = stripCommentsByLanguage(code, 'javascript')
  return /(?:^|[;\n])\s*(?:const|let|var)\s+input\b/.test(clean)
}

function formatConsoleArg(arg) {
  if (arg !== null && typeof arg === 'object') {
    try {
      return JSON.stringify(arg)
    } catch {
      return String(arg)
    }
  }
  return String(arg)
}

/**
 * Runner untuk JavaScript di dalam isolated async Function sandbox
 * dengan injeksi input, async/await support, serta polyfill Node/FS.
 */
export async function runJavascript(code, context = null) {
  const entries = []
  const testInput = extractTestInput(context)
  const rawInputStr = serializeTestInput(testInput)

  const execState = { logged: false }
  const sandboxConsole = {
    log: (...args) => {
      execState.logged = true
      entries.push({ type: 'log', text: args.map(formatConsoleArg).join(' ') })
    },
    error: (...args) => entries.push({ type: 'error', text: args.map(formatConsoleArg).join(' ') }),
    warn: (...args) => entries.push({ type: 'warn', text: '⚠ ' + args.map(formatConsoleArg).join(' ') }),
  }

  const practiceObj = parsePracticeData(context)
  let customFnName = context?.function_name || practiceObj?.function_name || null
  if (!customFnName) {
    const fnMatch =
      code.match(/(?:async\s+)?function\s+(solve\w*)\s*\(/) ||
      code.match(/(?:const|let|var)\s+(solve\w*)\s*=\s*(?:async\s+)?(?:function|\([^)]*\)\s*=>)/)
    if (fnMatch) {
      customFnName = fnMatch[1]
    }
  }

  const setupCode = context?.setup_code || ''
  const injectInputBinding = !hasTopLevelInputDeclaration(code)

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
    return (async () => {
      let __INPUT__ = ${JSON.stringify(testInput)};
      ${injectInputBinding ? 'let input = __INPUT__;' : ''}
      ${setupCode ? setupCode + '\n;' : ''}
      try {
        ${code}
        ;
        let __fnToRun = null;
        ${customFnName ? `try { if (typeof ${customFnName} === 'function') __fnToRun = ${customFnName}; } catch(e){}` : ''}
        if (!__fnToRun) {
          try { if (typeof solve === 'function') __fnToRun = solve; } catch(e){}
        }
        if (__fnToRun && !__state.logged) {
          const __res = await __fnToRun(__INPUT__);
          if (__res !== undefined) {
            console.log(typeof __res === 'object' && __res !== null ? JSON.stringify(__res) : String(__res));
          }
        }
      } catch (e) {
        console.error(e && e.message ? e.message : String(e));
      }
    })();
  `

  const fn = new Function('console', '__state', 'require', 'process', harnessCode)
  await fn(sandboxConsole, execState, fakeRequire, fakeProcess)

  return entries.length > 0
    ? entries
    : [{ type: 'log', text: '(Tidak ada output)' }]
}
