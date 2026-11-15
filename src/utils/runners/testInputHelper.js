/**
 * Helper bersama untuk mengekstrak dan menormalisasi data test case dari context latihan.
 */

export function parsePracticeData(context) {
  let practiceObj = context?.practice
  if (typeof practiceObj === 'string') {
    try {
      practiceObj = JSON.parse(practiceObj)
    } catch {
      practiceObj = null
    }
  }
  return practiceObj && typeof practiceObj === 'object' ? practiceObj : null
}

export function extractTestCases(context) {
  if (!context) return []
  const practiceObj = parsePracticeData(context)
  const cases = context.test_cases || practiceObj?.test_cases
  return Array.isArray(cases) ? cases : []
}

export function parseCaseInput(rawInput) {
  if (rawInput === undefined || rawInput === null) return null
  if (typeof rawInput !== 'string') return rawInput
  try {
    return JSON.parse(rawInput)
  } catch {
    return rawInput
  }
}

export function extractTestInput(context, index = 0) {
  const testCases = extractTestCases(context)
  const target = testCases[index]
  if (!target || target.input === undefined || target.input === null) return null
  return parseCaseInput(target.input)
}

export function serializeTestInput(testInput) {
  if (testInput === undefined || testInput === null) return ''
  return typeof testInput === 'object' ? JSON.stringify(testInput) : String(testInput)
}

/**
 * Menghapus komentar dari source code sesuai bahasa sambil mempertahankan isi literal string
 * (`'...'`, `"..."`, template literal) agar URL (`http://`, `postgres://`), operator `--`,
 * dan `#hex`/`#id` CSS tidak ikut terhapus.
 */
export function stripCommentsByLanguage(source = '', language = '') {
  const lang = String(language || '').toLowerCase()
  const parts = ['("(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\'|`(?:\\\\.|[^`\\\\])*`)']
  const commentParts = ['\\/\\*[\\s\\S]*?\\*\\/', '<!--[\\s\\S]*?-->']

  if (lang !== 'python' && lang !== 'sql') {
    commentParts.push('\\/\\/[^\\n]*')
  }
  if (lang === 'sql') {
    commentParts.push('--[^\\n]*')
  }
  if (lang === 'python' || lang === 'php') {
    commentParts.push('#[^\\n]*')
  }

  const pattern = new RegExp(`${parts[0]}|(?:${commentParts.join('|')})`, 'g')
  return String(source).replace(pattern, (match, stringLiteral) => (stringLiteral !== undefined ? stringLiteral : ''))
}
