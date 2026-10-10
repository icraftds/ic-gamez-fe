export function validateStdout(actualOutputArray, expectedOutputText) {
  if (!expectedOutputText) return true;

  // Gabungkan semua output console menjadi satu string
  const actualOutput = actualOutputArray.map(o => o.text).join(' ').trim();
  
  // Normalisasi string (hapus spasi ganda, samakan huruf kecil)
  const looseExpected = expectedOutputText.toLowerCase().replace(/\s+/g, ' ').replace(/["']/g, '');
  const looseActual = actualOutput.toLowerCase().replace(/\s+/g, ' ').replace(/["']/g, '');
  
  return looseActual.includes(looseExpected) || looseExpected.includes(looseActual);
}
