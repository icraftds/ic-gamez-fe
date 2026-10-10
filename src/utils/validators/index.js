import { validateStdout } from './StdoutValidator';
import { validateSqlResult } from './SqlValidator';
import { validateDom } from './DomValidator';

/**
 * Fungsi utama (Router) untuk memvalidasi berdasarkan `validation_type`.
 * 
 * @param {string} validationType - Jenis validasi (stdout, sql_result, dom_check)
 * @param {Array} testCases - Array dari test case yang didapat dari DB
 * @param {Array} runnerOutputArray - Array dari output console
 * @param {string} userCode - Kode mentah pengguna
 * @returns {boolean} - true jika berhasil, false jika gagal
 */
export function runValidation(validationType, testCases, runnerOutputArray, userCode, lesson = null) {
  // Cegah submit kosong
  if (!userCode || userCode.trim() === '') return false;
  
  // Pengecekan Universal: Jika kode masih memiliki "___"
  const codeWithoutComments = userCode
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/#.*$/gm, '');
  if (codeWithoutComments.includes('___')) return false;

  // Anti-Cheat: Required Keywords Check
  if (lesson && lesson.practice) {
    let practiceData = lesson.practice;
    if (typeof practiceData === 'string') {
      try {
        practiceData = JSON.parse(practiceData);
      } catch (e) {}
    }

    if (practiceData && practiceData.required_keywords && Array.isArray(practiceData.required_keywords)) {
      for (const keyword of practiceData.required_keywords) {
        if (!codeWithoutComments.includes(keyword)) {
          runnerOutputArray.push({ type: 'error', text: `Validasi Gagal: Kode Anda harus menggunakan '${keyword}'` });
          return false;
        }
      }
    }

    if (practiceData && practiceData.restricted_keywords && Array.isArray(practiceData.restricted_keywords)) {
      for (const keyword of practiceData.restricted_keywords) {
        if (codeWithoutComments.includes(keyword)) {
          runnerOutputArray.push({ type: 'error', text: `Validasi Gagal: Kode Anda tidak boleh menggunakan '${keyword}'` });
          return false;
        }
      }
    }
  }

  // Cek apakah test cases tersedia
  if (!testCases || testCases.length === 0) return true;
  
  const firstCase = testCases[0];

  switch(validationType) {
    case 'stdout':
      return validateStdout(runnerOutputArray, firstCase.expected_output);
    case 'sql_result':
      return validateSqlResult(runnerOutputArray, firstCase.expected_output);
    case 'dom_check':
      return validateDom(userCode, firstCase.expected_output);
    default:
      // Fallback jika tidak ada validation_type yang dikenali
      return validateStdout(runnerOutputArray, firstCase.expected_output);
  }
}
