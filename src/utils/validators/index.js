import { validateStdout } from './StdoutValidator.js';
import { validateSqlResult } from './SqlValidator.js';
import { validateDom } from './DomValidator.js';
import { executeCode } from '../runners/index.js';
import { stripCommentsByLanguage } from '../runners/testInputHelper.js';

const PER_CASE_RUNNABLE_LANGUAGES = new Set(['javascript', 'js', 'python', 'php']);

function checkKeywordConstraints(codeWithoutComments, practiceRaw, isSql, runnerOutputArray) {
  let practiceData = practiceRaw;
  if (typeof practiceData === 'string') {
    try {
      practiceData = JSON.parse(practiceData);
    } catch {
      practiceData = null;
    }
  }
  if (!practiceData || typeof practiceData !== 'object') return true;

  const hasKeyword = (keyword) => {
    if (!isSql) return codeWithoutComments.includes(keyword);
    if (/^[^a-zA-Z0-9_]+$/.test(keyword.trim())) {
      return codeWithoutComments.includes(keyword);
    }
    const escaped = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    return new RegExp(`(?:^|[^a-zA-Z0-9_])${escaped}(?:[^a-zA-Z0-9_]|$)`, 'i').test(codeWithoutComments);
  };

  if (Array.isArray(practiceData.required_keywords)) {
    for (const keyword of practiceData.required_keywords) {
      if (!hasKeyword(keyword)) {
        runnerOutputArray.push({ type: 'error', text: `Validasi Gagal: Kode Anda harus menggunakan '${keyword}'` });
        return false;
      }
    }
  }

  if (Array.isArray(practiceData.restricted_keywords)) {
    for (const keyword of practiceData.restricted_keywords) {
      if (hasKeyword(keyword)) {
        runnerOutputArray.push({ type: 'error', text: `Validasi Gagal: Kode Anda tidak boleh menggunakan '${keyword}'` });
        return false;
      }
    }
  }

  return true;
}

async function validateSingleCase(validationType, testCase, runnerOutputArray, userCode, lesson) {
  switch (validationType) {
    case 'stdout':
      return validateStdout(runnerOutputArray, testCase.expected_output);
    case 'sql_result':
      return await validateSqlResult(runnerOutputArray, testCase.expected_output, userCode, lesson);
    case 'string_match': {
      const looseExpected = (testCase.expected_output || '').replace(/\\n/g, ' ').toLowerCase().replace(/\s+/g, ' ').replace(/["']/g, '');
      const looseActual = userCode.toLowerCase().replace(/\s+/g, ' ').replace(/["']/g, '');
      return looseActual.includes(looseExpected) || looseExpected.includes(looseActual);
    }
    case 'dom_check':
      return validateDom(userCode, testCase.expected_output);
    default:
      return validateStdout(runnerOutputArray, testCase.expected_output);
  }
}

/**
 * Fungsi utama (Router) untuk memvalidasi berdasarkan `validation_type`
 * termasuk verifikasi seluruh hidden test cases untuk eksekusi stdout.
 *
 * @param {string} validationType - Jenis validasi (stdout, sql_result, dom_check, string_match)
 * @param {Array} testCases - Array dari test case yang didapat dari DB
 * @param {Array} runnerOutputArray - Array dari output console
 * @param {string} userCode - Kode mentah pengguna
 * @param {object|null} lesson - Objek lesson aktif
 * @returns {Promise<boolean>} - true jika seluruh test case lolos, false jika tidak
 */
export async function runValidation(validationType, testCases, runnerOutputArray, userCode, lesson = null) {
  if (!userCode || userCode.trim() === '') return false;

  const effectiveLang = String(lesson?.language || (validationType === 'sql_result' ? 'sql' : (validationType === 'dom_check' ? 'html' : 'javascript'))).toLowerCase();

  // Pengecekan Universal: Jika kode masih memiliki "___" (abaikan komentar sesuai bahasa)
  const codeWithoutComments = stripCommentsByLanguage(userCode, effectiveLang);
  if (codeWithoutComments.includes('___')) return false;

  const isSql = validationType === 'sql_result' || effectiveLang === 'sql';

  // Anti-Cheat: Required & Restricted Keywords Check
  if (lesson?.practice && !checkKeywordConstraints(codeWithoutComments, lesson.practice, isSql, runnerOutputArray)) {
    return false;
  }

  if (!testCases || testCases.length === 0) return true;

  // Validasi kasus publik pertama memakai output run utama agar tidak dobel eksekusi
  const firstCase = testCases[0];
  const firstPassed = await validateSingleCase(validationType, firstCase, runnerOutputArray, userCode, lesson);
  if (!firstPassed) {
    return false;
  }

  // Eksekusi & validasi test case lanjutan (termasuk hidden test) agar solusi hardcode tidak lolos
  const lessonLanguage = String(lesson?.language || 'javascript').toLowerCase();
  const usesStdoutExecution = !['sql_result', 'string_match', 'dom_check'].includes(validationType);

  if (testCases.length > 1 && usesStdoutExecution && PER_CASE_RUNNABLE_LANGUAGES.has(lessonLanguage)) {
    for (let i = 1; i < testCases.length; i++) {
      const tc = testCases[i];
      let caseOutput = [];
      try {
        caseOutput = await executeCode(lessonLanguage, userCode, {
          ...(lesson || {}),
          test_cases: [tc],
        });
      } catch (err) {
        runnerOutputArray.push({
          type: 'error',
          text: tc?.is_hidden
            ? 'Validasi Gagal: Terjadi error saat menjalankan hidden test case.'
            : `Validasi Gagal pada test case #${i + 1}: ${err?.message || 'Execution error'}`,
        });
        return false;
      }

      const hasCaseError = caseOutput.some((e) => e.type === 'error');
      const casePassed = !hasCaseError && validateStdout(caseOutput, tc.expected_output);

      if (!casePassed) {
        runnerOutputArray.push({
          type: 'error',
          text: tc?.is_hidden
            ? 'Validasi Gagal: Solusi belum lolos pada hidden test case. Pastikan logika menangani variasi input lain (tidak hardcode).'
            : `Validasi Gagal: Output pada test case #${i + 1} belum sesuai harapan.`,
        });
        return false;
      }
    }
  }

  return true;
}
