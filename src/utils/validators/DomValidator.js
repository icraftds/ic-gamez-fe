export function validateDom(userCode, expectedCondition) {
  if (!userCode || !expectedCondition) return false;

  try {
    // 1. Parsing string HTML murid menjadi objek Document virtual yang aman
    const parser = new DOMParser();
    const virtualDoc = parser.parseFromString(userCode, 'text/html');

    // 2. Mengeksekusi kondisi DOM secara dinamis (contoh kondisi: "document.querySelector('img') !== null")
    // Kita melempar virtualDoc ke dalam fungsi sebagai variabel 'document' agar seleksinya terisolasi.
    const validatorFn = new Function('document', `
      try {
        return !!(${expectedCondition});
      } catch(e) {
        return false;
      }
    `);

    return validatorFn(virtualDoc) === true;
  } catch (error) {
    console.error('DomValidator error:', error);
    return false;
  }
}
