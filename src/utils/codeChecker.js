import { runValidation } from './validators/index.js';

/**
 * Memeriksa apakah output dari code runner sesuai dengan harapan dari soal praktik.
 * @param {string} lessonLanguage - Bahasa pemrograman (html, css, javascript, dll)
 * @param {string} lessonPractice - Template kode praktik yang berisi komentar harapan/output
 * @param {Array} runnerOutputArray - Array output dari code runner
 * @param {string} currentCode - Kode yang ditulis oleh pengguna saat ini
 * @param {Object} lesson - Objek lesson secara utuh (untuk mendapatkan validation_type dan test_cases)
 * @returns {boolean} - True jika output sesuai harapan, False jika tidak
 */
export const checkOutputMatch = async (lessonLanguage, lessonPractice, runnerOutputArray, currentCode, lesson = null) => {
  // Parsing initial code dari JSON jika format baru (string atau object)
  let initialCodeForCheck = '';
  if (lessonPractice) {
    if (typeof lessonPractice === 'object') {
      initialCodeForCheck = lessonPractice.initial_code || lessonPractice.initial_query || '';
    } else if (typeof lessonPractice === 'string') {
      try {
        const json = JSON.parse(lessonPractice);
        initialCodeForCheck = json.initial_code || json.initial_query || lessonPractice;
      } catch (e) {
        initialCodeForCheck = lessonPractice;
      }
    }
  }

  // Anti-cheat Universal: Jika kode sama persis dengan template (belum ada perubahan)
  if (typeof initialCodeForCheck === 'string' && initialCodeForCheck.trim() && currentCode && currentCode.trim() === initialCodeForCheck.trim()) {
    return false;
  }

  // 1. CEK DUKUNGAN VALIDATOR BARU (VERSI 2 PRD)
  let testCases = lesson?.test_cases;
  if ((!testCases || testCases.length === 0) && lessonPractice) {
    try {
      const parsedP = typeof lessonPractice === 'string' ? JSON.parse(lessonPractice) : lessonPractice;
      testCases = parsedP?.test_cases;
    } catch (e) {}
  }

  const validationType = lesson?.validation_type || (lessonLanguage === 'sql' ? 'sql_result' : (testCases && testCases.length > 0 ? 'stdout' : null));

  if (validationType && testCases && testCases.length > 0) {
    return await runValidation(validationType, testCases, runnerOutputArray, currentCode, lesson);
  }

  // 2. LOGIKA LEGACY (VERSI LAMA JAVASCRIPT)
  // Cegah submit kosong
  if (!currentCode || currentCode.trim() === '') {
    return false;
  }

  // Pengecekan Universal: Jika masih ada "___" di bagian kode utama (abaikan komentar), berarti belum diisi!
  if (currentCode) {
    const codeWithoutComments = currentCode
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/--.*$/gm, '')
      .replace(/#.*$/gm, '');
    if (codeWithoutComments.includes('___')) return false;
  }

  if (['html', 'css'].includes(lessonLanguage)) return true;
  if (lessonLanguage === 'sql') {
    const hasError = runnerOutputArray.some(e => e.type === 'error');
    const hasTableOrLog = runnerOutputArray.some(e => e.type === 'table' || e.type === 'log');
    return !hasError && hasTableOrLog;
  }

  const practiceStr = typeof lessonPractice === 'string'
    ? lessonPractice
    : (lessonPractice?.initial_code || lessonPractice?.task_description || '');
  if (!practiceStr) return true;
  
  const lines = practiceStr.split('\n');
  let expectedOutput = '';
  let inOutputSection = false;
  
  for (let line of lines) {
    let t = line.trim();
    if (!t.startsWith('//')) {
      if (t !== '') break;
      continue;
    }
    let commentText = t.replace(/^\/\/\s*/, '');
    let lowerLine = commentText.toLowerCase();
    
    if (lowerLine.startsWith('harapan:') || lowerLine.startsWith('output:')) {
      inOutputSection = true;
      expectedOutput += commentText.replace(/(?:harapan|output):/i, '').trim() + ' ';
      continue;
    } else if (lowerLine.match(/^(tugas|contoh|🎯)/i) && inOutputSection) {
      inOutputSection = false;
    }
    
    if (inOutputSection && commentText.trim() !== '') {
      expectedOutput += commentText + ' ';
    }
  }
  
  expectedOutput = expectedOutput.trim();
  if (!expectedOutput) return true; 
  
  const actualOutput = runnerOutputArray.map(o => o.text).join(' ').trim();
  const looseExpected = expectedOutput.toLowerCase().replace(/\s+/g, ' ').replace(/["']/g, '');
  if (looseActual === looseExpected) return true;
  const escaped = looseExpected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const boundaryRegex = new RegExp(`(?:^|[\\s,;:()<>\\[\\]{}"'!=])${escaped}(?:$|[\\s,;:()<>\\[\\]{}"'!=])`, 'i');
  return boundaryRegex.test(looseActual);
}

