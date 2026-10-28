function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null || b === null) return false;

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

export function validateStdout(actualOutputArray, expectedOutputText) {
  if (expectedOutputText === undefined || expectedOutputText === null) return true;
  const expStr = String(expectedOutputText).trim();
  if (expStr === '') return true;

  // Extract raw text entries and joined output
  const rawTexts = (actualOutputArray || []).map(o => String(o.text ?? '')).filter(t => t.length > 0);
  const actualJoined = rawTexts.join('\n').trim();
  if (!actualJoined) return false;

  // 1. Coba perbandingan objek JSON mendalam jika kedua output valid JSON
  try {
    const parsedActual = JSON.parse(actualJoined);
    const parsedExpected = JSON.parse(expStr);
    if (deepEqual(parsedActual, parsedExpected)) {
      return true;
    }
  } catch (e) {
    // Bukan JSON, lanjut ke pencocokan teks
  }

  // 2. Normalisasi baris demi baris (CRLF -> LF, trim setiap baris)
  const normExpectedLines = expStr.replace(/\r\n/g, '\n').split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const normActualLines = actualJoined.replace(/\r\n/g, '\n').split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Jika jumlah baris sama dan semua baris cocok persis
  if (normExpectedLines.length > 0 && normExpectedLines.length === normActualLines.length) {
    const allLinesMatch = normExpectedLines.every((expLine, idx) => {
      const actLine = normActualLines[idx];
      return actLine.toLowerCase() === expLine.toLowerCase();
    });
    if (allLinesMatch) return true;
  }

  // 3. Normalisasi spasi gabungan (single line atau multi-token)
  const normExpectedFlat = normExpectedLines.join(' ').toLowerCase().replace(/\s+/g, ' ');
  const normActualFlat = normActualLines.join(' ').toLowerCase().replace(/\s+/g, ' ');

  // Cocok persis setelah normalisasi spasi
  if (normActualFlat === normExpectedFlat) return true;

  // 4. Token & Boundary Matching:
  // Actual output mengandung expected output sebagai token/frasa tersendiri (dibatasi spasi, tanda baca, dsb.)
  // Mencegah '3' cocok di dalam '12345' atau angka lain.
  const escapedExpected = normExpectedFlat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const boundaryRegex = new RegExp(`(?:^|[\\s,;:()<>\\[\\]{}"'!=])${escapedExpected}(?:$|[\\s,;:()<>\\[\\]{}"'!=])`, 'i');
  if (boundaryRegex.test(normActualFlat)) {
    return true;
  }

  return false;
}
