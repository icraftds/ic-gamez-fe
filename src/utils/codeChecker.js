/**
 * Memeriksa apakah output dari code runner sesuai dengan harapan dari soal praktik.
 * @param {string} lessonLanguage - Bahasa pemrograman (html, css, javascript, dll)
 * @param {string} lessonPractice - Template kode praktik yang berisi komentar harapan/output
 * @param {Array} runnerOutputArray - Array output dari code runner
 * @param {string} currentCode - Kode yang ditulis oleh pengguna saat ini
 * @returns {boolean} - True jika output sesuai harapan, False jika tidak
 */
export const checkOutputMatch = (lessonLanguage, lessonPractice, runnerOutputArray, currentCode) => {
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
      .replace(/#.*$/gm, '');
    if (codeWithoutComments.includes('___')) return false;
  }

  // Anti-cheat: Jika kode sama persis dengan template (belum ada perubahan)
  if (lessonPractice && currentCode.trim() === lessonPractice.trim()) {
    return false;
  }

  if (['html', 'css', 'sql'].includes(lessonLanguage)) return true;
  if (!lessonPractice) return true;
  
  const lines = lessonPractice.split('\n');
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
  const looseActual = actualOutput.toLowerCase().replace(/\s+/g, ' ').replace(/["']/g, '');
  
  return looseActual.includes(looseExpected) || looseExpected.includes(looseActual);
}
