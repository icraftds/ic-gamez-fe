import api from '../../services/api'

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
 * Runner untuk PHP menggunakan isolated backend execution service
 */
export async function runPhp(code, context = null) {
  const testInput = extractTestInput(context)

  try {
    const res = await api.post('/execute/php', {
      code,
      input: testInput
    })

    const data = res.data
    const outputEntries = []
    if (data.output && String(data.output).length > 0) {
      outputEntries.push({ type: 'log', text: String(data.output) })
    }
    if (data.error && String(data.error).length > 0) {
      outputEntries.push({ type: 'error', text: String(data.error) })
    }
    if (outputEntries.length === 0) {
      outputEntries.push({ type: 'log', text: '(Tidak ada output)' })
    }
    return outputEntries
  } catch (apiErr) {
    const errMsg = apiErr.response?.data?.error || apiErr.response?.data?.message || apiErr.message
    return [{ type: 'error', text: `PHP Execution Error: ${errMsg}` }]
  }
}
