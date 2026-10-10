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
export function runValidation(validationType, testCases, runnerOutputArray, userCode) {
  // Cegah submit kosong
  if (!userCode || userCode.trim() === '') return false;
  
  // Pengecekan Universal: Jika kode masih memiliki "___"
  const codeWithoutComments = userCode
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/#.*$/gm, '');
  if (codeWithoutComments.includes('___')) return false;

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
