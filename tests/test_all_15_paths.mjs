import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import initSqlJs from 'sql.js'

// Import the actual validators and runners from ic-gameZ
import { runJavascript } from '../src/utils/runners/javascriptRunner.js'
import { runHtml } from '../src/utils/runners/htmlRunner.js'
import { checkOutputMatch } from '../src/utils/codeChecker.js'
import { validateDom } from '../src/utils/validators/DomValidator.js'
import { validateSqlResult } from '../src/utils/validators/SqlValidator.js'
import { validateStdout } from '../src/utils/validators/StdoutValidator.js'

const baseAlurDir = 'd:/Project/Icraft/ic-Game Z - Backend/database/Alur Belajar'
const allPaths = fs.readdirSync(baseAlurDir).filter(f => fs.statSync(path.join(baseAlurDir, f)).isDirectory())

console.log('='.repeat(90))
console.log('PENGUJIAN VALIDATOR UNTUK SEMUA 15 ALUR BELAJAR (1 MATERI PER ALUR)')
console.log('='.repeat(90))

const results = []

function findFirstPracticeLesson(dir) {
  const items = fs.readdirSync(dir)
  for (const item of items) {
    const full = path.join(dir, item)
    if (fs.statSync(full).isDirectory()) {
      const found = findFirstPracticeLesson(full)
      if (found) return found
    } else if (item.endsWith('.json') && !item.startsWith('QA_') && !item.startsWith('TIERING_') && !item.includes('combined') && !item.includes('manifest')) {
      try {
        const data = JSON.parse(fs.readFileSync(full, 'utf8'))
        if (data.practice && data.practice.solution_code) {
          return { file: item, fullPath: full, relPath: path.relative(baseAlurDir, full), data }
        }
      } catch (e) {}
    }
  }
  return null
}

let sqlInstance = null
async function getSql() {
  if (!sqlInstance) {
    sqlInstance = await initSqlJs()
  }
  return sqlInstance
}

for (const pName of allPaths) {
  const pathDir = path.join(baseAlurDir, pName)
  const lessonObj = findFirstPracticeLesson(pathDir)

  if (!lessonObj) {
    results.push({
      path: pName,
      status: 'SKIP',
      reason: 'Tidak ada latihan practice ditemukan'
    })
    continue
  }

  const { relPath, data } = lessonObj
  const practice = data.practice
  const language = (data.language || 'javascript').toLowerCase()
  const validationType = data.validation_type || (language === 'sql' ? 'sql_result' : 'stdout')
  const solutionCode = practice.solution_code || ''
  const testCases = practice.test_cases || []
  const firstTestCase = testCases[0] || {}
  const rawInput = firstTestCase.input ?? ''
  const expectedOutput = firstTestCase.expected_output ?? ''

  let runnerOutput = []
  let runError = null

  try {
    if (language === 'javascript' || language === 'js') {
      runnerOutput = await runJavascript(solutionCode, data)
    } else if (language === 'html' || language === 'css') {
      runnerOutput = await runHtml()
    } else if (language === 'python') {
      const testInputStr = typeof rawInput === 'object' ? JSON.stringify(rawInput) : String(rawInput)
      const pyScript = `import sys, json\nsys.argv = ['solution.py', ${JSON.stringify(testInputStr)}]\n${solutionCode}`
      const tempPyFile = path.join(process.cwd(), 'tests', '_temp_py.py')
      fs.writeFileSync(tempPyFile, pyScript, 'utf8')
      const stdout = execSync(`python "${tempPyFile}"`, { encoding: 'utf8', timeout: 5000 })
      try { fs.unlinkSync(tempPyFile) } catch {}
      runnerOutput = stdout.trim().length > 0 ? [{ type: 'log', text: stdout.trim() }] : [{ type: 'log', text: '(Tidak ada output)' }]
    } else if (language === 'php') {
      const testInputObj = typeof rawInput === 'string' && (rawInput.startsWith('{') || rawInput.startsWith('[')) ? JSON.parse(rawInput) : rawInput
      const phpScript = `<?php
$input = json_decode(${JSON.stringify(JSON.stringify(testInputObj))}, true);
${solutionCode}
if (function_exists('solve')) {
    $res = solve($input);
    if ($res !== null) echo is_array($res) ? json_encode($res) : $res;
}
`
      const tempPhpFile = path.join(process.cwd(), 'tests', '_temp_php.php')
      fs.writeFileSync(tempPhpFile, phpScript, 'utf8')
      const stdout = execSync(`php "${tempPhpFile}"`, { encoding: 'utf8', timeout: 5000 })
      try { fs.unlinkSync(tempPhpFile) } catch {}
      runnerOutput = stdout.trim().length > 0 ? [{ type: 'log', text: stdout.trim() }] : [{ type: 'log', text: '(Tidak ada output)' }]
    } else if (language === 'sql') {
      const sql = await getSql()
      const db = new sql.Database()
      if (data.setup_code) {
        db.run(data.setup_code)
      }
      const res = db.exec(solutionCode)
      if (res.length > 0) {
        const lastTable = res[res.length - 1]
        const columns = lastTable.columns
        const rows = lastTable.values.map(valArr => {
          const rowObj = {}
          columns.forEach((col, idx) => { rowObj[col] = valArr[idx] })
          return rowObj
        })
        runnerOutput = [{ type: 'table', data: rows, columns }]
      } else {
        runnerOutput = [{ type: 'log', text: 'Query berhasil dieksekusi.' }]
      }
      db.close()
    }
  } catch (err) {
    runError = err.message
    runnerOutput = [{ type: 'error', text: err.message }]
  }

  // Validate using checkOutputMatch
  let isMatch = false
  try {
    isMatch = await checkOutputMatch(language, practice, runnerOutput, solutionCode, data)
  } catch (valErr) {
    runError = 'Validator Error: ' + valErr.message
  }

  // Format runner output preview
  let outPreview = ''
  if (runnerOutput.length > 0) {
    if (runnerOutput[0].type === 'table') {
      outPreview = `Table (${runnerOutput[0].data?.length || 0} rows)`
    } else {
      outPreview = String(runnerOutput[0].text || '').slice(0, 60).replace(/\r?\n/g, ' ')
    }
  }

  results.push({
    path: pName,
    file: path.basename(relPath),
    lang: language,
    vt: validationType,
    output: outPreview,
    expected: String(expectedOutput).slice(0, 40).replace(/\r?\n/g, ' '),
    isMatch,
    error: runError
  })
}

// Print results table
console.log('\nHASIL PENGUJIAN 1 MATERI PER ALUR BELAJAR:\n')
for (const r of results) {
  const icon = r.isMatch ? 'PASSED' : 'FAILED'
  console.log(`[${icon.padEnd(6)}] ${r.path}`)
  console.log(`         File: ${r.file}`)
  console.log(`         Lang: ${r.lang} | Validation: ${r.vt}`)
  console.log(`         Output Runner  : ${r.output}`)
  console.log(`         Expected Output: ${r.expected}`)
  if (r.error) console.log(`         Error: ${r.error}`)
  console.log('-'.repeat(90))
}

const passedCount = results.filter(r => r.isMatch).length
console.log(`\nRINGKASAN: ${passedCount} / ${results.length} ALUR BELAJAR BERHASIL VALIDASI`)
