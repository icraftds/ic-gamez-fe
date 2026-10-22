/**
 * Memvalidasi hasil query SQL pengguna terhadap ekspektasi.
 * Mendukung ekspektasi berupa:
 * 1. Query SQL referensi (misal: "SELECT name, price FROM products LIMIT 5;")
 * 2. Array of objects (JSON data tabel yang diharapkan)
 * 3. JSON string dari array of objects
 * 
 * @param {Array} actualOutputArray - Output dari code runner (berisi { type: 'table', data: [...] })
 * @param {any} expectedOutput - Ekspektasi jawaban
 * @param {string} userCode - Query mentah pengguna
 * @returns {Promise<boolean>}
 */
export async function validateSqlResult(actualOutputArray, expectedOutput, userCode = '', context = null) {
  // 1. Cek apakah ada error pada eksekusi kode pengguna
  const hasError = actualOutputArray.some(e => e.type === 'error');
  if (hasError) return false;

  // 2. Ambil data tabel aktual dari output pengguna
  const tableEntry = actualOutputArray.find(e => e.type === 'table');

  // Jika query DDL/DML tanpa return row (misal CREATE TABLE, INSERT INTO)
  if (!tableEntry || !tableEntry.data) {
    const successEntry = actualOutputArray.find(e => e.type === 'log');
    return !!successEntry;
  }

  const actualRows = tableEntry.data;

  // 3. Normalisasi expectedOutput
  let targetExpected = expectedOutput;

  // Jika expectedOutput adalah JSON string, parse terlebih dahulu
  if (typeof expectedOutput === 'string') {
    const trimmed = expectedOutput.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        targetExpected = JSON.parse(trimmed);
      } catch (e) {}
    }
  }

  // Jika expectedOutput adalah query SQL referensi (dimulai dengan SELECT, WITH, SHOW, PRAGMA)
  if (typeof targetExpected === 'string' && /^(SELECT|WITH|SHOW|PRAGMA)/i.test(targetExpected.trim())) {
    try {
      const { executeSqlQuery } = await import('../sql/sqlEngine.js');
      const customInitSql = context?.setup_code || null;
      const refResult = await executeSqlQuery(targetExpected, { customInitSql });
      if (refResult.success && refResult.tables.length > 0) {
        targetExpected = refResult.tables[refResult.tables.length - 1].data;
      }
    } catch (e) {
      console.warn('[SqlValidator] Gagal mengeksekusi expected SQL query:', e);
    }
  }

  // 4. Jika targetExpected adalah array of objects (baris data yang diharapkan):
  if (Array.isArray(targetExpected)) {
    return compareTableRows(actualRows, targetExpected, userCode);
  }

  // Fallback jika tidak ada expectedOutput khusus: selama tabel memiliki baris data dan tidak error -> true
  return actualRows.length > 0;
}

/**
 * Membandingkan dua set baris data tabular secara mendalam.
 * Case-insensitive pada nama kolom, case-insensitive pada string nilai, toleran terhadap format angka & desimal,
 * serta mendukung fallback multiset matching jika tanpa ORDER BY.
 */
function compareTableRows(actual, expected, userCode = '') {
  if (actual.length !== expected.length) return false;
  if (actual.length === 0 && expected.length === 0) return true;

  // Coba perbandingan urut (ordered comparison) terlebih dahulu
  let orderedMatch = true;
  for (let i = 0; i < expected.length; i++) {
    if (!isRowMatch(actual[i], expected[i])) {
      orderedMatch = false;
      break;
    }
  }
  if (orderedMatch) return true;

  // Jika perbandingan terurut gagal:
  // Cek apakah query user atau soal secara eksplisit mewajibkan ORDER BY.
  // Jika tidak ada ORDER BY, hasil SQL dalam teori basis data adalah himpunan (unordered multiset).
  // Izinkan pencocokan 1-ke-1 tanpa memandang urutan baris.
  const requiresOrderBy = /\bORDER\s+BY\b/i.test(userCode);
  if (!requiresOrderBy) {
    const matchedActualIndices = new Set();
    for (let i = 0; i < expected.length; i++) {
      const expRow = expected[i];
      let foundIndex = -1;
      for (let j = 0; j < actual.length; j++) {
        if (!matchedActualIndices.has(j) && isRowMatch(actual[j], expRow)) {
          foundIndex = j;
          break;
        }
      }
      if (foundIndex === -1) {
        return false;
      }
      matchedActualIndices.add(foundIndex);
    }
    return matchedActualIndices.size === expected.length;
  }

  return false;
}

/**
 * Membandingkan satu baris data aktual dengan baris harapan.
 * Case-insensitive pada nama kolom, case-insensitive pada string nilai, toleran terhadap format angka & desimal,
 * serta memastikan integritas nilai NULL.
 */
function isRowMatch(actRow, expRow) {
  if (!actRow || !expRow) return false;

  const expKeys = Object.keys(expRow);
  const actKeys = Object.keys(actRow);

  if (expKeys.length !== actKeys.length) return false;

  for (const expKey of expKeys) {
    const matchingActKey = actKeys.find(k => k.toLowerCase() === expKey.toLowerCase());
    if (!matchingActKey) return false;

    const expVal = expRow[expKey];
    const actVal = actRow[matchingActKey];

    // 1. Cek NULL
    const isExpNull = expVal === null || expVal === undefined;
    const isActNull = actVal === null || actVal === undefined;
    if (isExpNull || isActNull) {
      if (isExpNull !== isActNull) return false;
      continue;
    }

    // 2. Perbandingan String (Case-Insensitive & Trimmed)
    const strExp = String(expVal).trim().toLowerCase();
    const strAct = String(actVal).trim().toLowerCase();

    if (strExp === strAct) continue;

    // 3. Perbandingan Numerik & Floating-Point
    const numExp = Number(expVal);
    const numAct = Number(actVal);
    if (!isNaN(numExp) && !isNaN(numAct)) {
      if (Math.abs(numExp - numAct) <= 0.01) {
        continue;
      }
    }

    return false;
  }

  return true;
}
