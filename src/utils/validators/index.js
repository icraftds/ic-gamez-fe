import { validateStdout } from './StdoutValidator.js';
import { validateSqlResult } from './SqlValidator.js';
import { validateDom } from './DomValidator.js';

/**
 * Fungsi utama (Router) untuk memvalidasi berdasarkan `validation_type`.
 * 
 * @param {string} validationType - Jenis validasi (stdout, sql_result, dom_check)
 * @param {Array} testCases - Array dari test case yang didapat dari DB
 * @param {Array} runnerOutputArray - Array dari output console
 * @param {string} userCode - Kode mentah pengguna
 * @returns {boolean} - true jika berhasil, false jika gagal
 */
export async function runValidation(validationType, testCases, runnerOutputArray, userCode, lesson = null) {
  // Cegah submit kosong
  if (!userCode || userCode.trim() === '') return false;
  
  // Pengecekan Universal: Jika kode masih memiliki "___" (abaikan komentar)
  const codeWithoutComments = userCode
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/--.*$/gm, '')
    .replace(/#.*$/gm, '');
  if (codeWithoutComments.includes('___')) return false;

  const isSql = validationType === 'sql_result' || lesson?.language === 'sql';

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
        let found = false;
        if (isSql) {
          if (/^[^a-zA-Z0-9_]+$/.test(keyword.trim())) {
            found = codeWithoutComments.includes(keyword);
          } else {
            const escaped = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
            const regex = new RegExp(`(?:^|[^a-zA-Z0-9_])${escaped}(?:[^a-zA-Z0-9_]|$)`, 'i');
            found = regex.test(codeWithoutComments);
          }
        } else {
          found = codeWithoutComments.includes(keyword);
        }

        if (!found) {
          runnerOutputArray.push({ type: 'error', text: `Validasi Gagal: Kode Anda harus menggunakan '${keyword}'` });
          return false;
        }
      }
    }

    if (practiceData && practiceData.restricted_keywords && Array.isArray(practiceData.restricted_keywords)) {
      for (const keyword of practiceData.restricted_keywords) {
        let restrictedFound = false;
        if (isSql) {
          if (/^[^a-zA-Z0-9_]+$/.test(keyword.trim())) {
            restrictedFound = codeWithoutComments.includes(keyword);
          } else {
            const escaped = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
            const regex = new RegExp(`(?:^|[^a-zA-Z0-9_])${escaped}(?:[^a-zA-Z0-9_]|$)`, 'i');
            restrictedFound = regex.test(codeWithoutComments);
          }
        } else {
          restrictedFound = codeWithoutComments.includes(keyword);
        }

        if (restrictedFound) {
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
      return await validateSqlResult(runnerOutputArray, firstCase.expected_output, userCode, lesson);
    case 'string_match':
      // Membandingkan kode yang diketik user dengan string yang diharapkan (mengabaikan spasi berlebih)
      const looseExpected = (firstCase.expected_output || '').replace(/\\n/g, ' ').toLowerCase().replace(/\s+/g, ' ').replace(/["']/g, '');
      const looseActual = userCode.toLowerCase().replace(/\s+/g, ' ').replace(/["']/g, '');
      return looseActual.includes(looseExpected) || looseExpected.includes(looseActual);
    case 'dom_check':
      return validateDom(userCode, firstCase.expected_output);
    default:
      // Fallback jika tidak ada validation_type yang dikenali
      return validateStdout(runnerOutputArray, firstCase.expected_output);
  }
}
