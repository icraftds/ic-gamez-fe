import { ref, computed } from 'vue'

export function useLearningPaths() {
  const paths = ref([
    {
      id: 'dasar',
      title: 'Dasar Pemrograman',
      description: 'Pelajari konsep dasar pemrograman, variabel, tipe data, dan logika dasar menggunakan syntax yang universal.',
      icon: 'fa-solid fa-code',
      isPremium: false,
      chapters: [
        {
          id: 'c1',
          title: 'Pengenalan & Variabel',
          completedSubMateri: 2,
          totalSubMateri: 2,
          lessons: [
            {
              id: 'l1',
              title: 'Apa itu Pemrograman?',
              isCompleted: true,
              type: 'text',
              isPremium: false,
              costCredit: 0,
              explanation: `
                <h3>Pemrograman: Memberi Perintah Kepada Komputer</h3>
                <p>Bayangkan komputer adalah pekerja yang sangat cepat namun tidak bisa mengambil keputusan sendiri. <strong>Pemrograman</strong> adalah cara kita menulis instruksi langkah demi langkah agar komputer tahu apa yang harus ia kerjakan.</p>
                <p>Instruksi ini ditulis menggunakan <strong>Bahasa Pemrograman</strong> (seperti Python, JavaScript, C++, dll).</p>
                <br>
                <h3>Mengapa Belajar Pemrograman?</h3>
                <ul>
                  <li><strong>Otomatisasi:</strong> Menyelesaikan tugas berulang dalam hitungan detik.</li>
                  <li><strong>Penciptaan:</strong> Membuat website, game, hingga kecerdasan buatan (AI).</li>
                  <li><strong>Problem Solving:</strong> Melatih cara berpikir yang terstruktur dan logis.</li>
                </ul>
              `,
              quiz: [
                {
                  question: 'Manakah analogi terbaik untuk mendeskripsikan pemrograman?',
                  options: ['Menonton film di bioskop', 'Menulis resep masakan untuk diikuti koki', 'Mengendarai mobil di jalan raya', 'Menghafal buku sejarah'],
                  answerIndex: 1
                }
              ],
              practice: 'Jelaskan dengan bahasamu sendiri apa itu pemrograman di dunia nyata.'
            },
            {
              id: 'l2',
              title: 'Variabel dan Tipe Data Dasar',
              isCompleted: true,
              type: 'code',
              isPremium: false,
              costCredit: 0,
              explanation: `
                <h3>Variabel: Kotak Penyimpan Data</h3>
                <p>Dalam pemrograman, <strong>Variabel</strong> adalah tempat (seperti kotak) untuk menyimpan data sementara. Anda bisa memberi nama kotak tersebut agar mudah dicari.</p>
                <p>Contoh dalam kode (pseudocode):</p>
                <pre><code>namaPemain = "Alex"
skor = 100
sedangBermain = true</code></pre>
                <br>
                <h3>Tipe Data Dasar</h3>
                <ul>
                  <li><strong>String (Teks):</strong> Data berupa huruf atau kata, selalu diapit tanda kutip (contoh: <code>"Halo Dunia"</code>).</li>
                  <li><strong>Integer (Angka Bulat):</strong> Angka tanpa desimal (contoh: <code>100</code>, <code>-5</code>).</li>
                  <li><strong>Float (Angka Desimal):</strong> Angka dengan pecahan desimal (contoh: <code>3.14</code>).</li>
                  <li><strong>Boolean:</strong> Hanya memiliki dua nilai, yaitu <code>true</code> (benar) atau <code>false</code> (salah).</li>
                </ul>
              `,
              quiz: [
                {
                  question: 'Tipe data apa yang paling cocok untuk menyimpan nilai "umur" seseorang (contoh: 25)?',
                  options: ['String', 'Integer', 'Boolean', 'Float'],
                  answerIndex: 1
                },
                {
                  question: 'Nilai "true" atau "false" termasuk ke dalam tipe data?',
                  options: ['Boolean', 'Integer', 'String', 'Array'],
                  answerIndex: 0
                }
              ],
              practice: 'Buatlah 3 variabel dengan tipe data berbeda (String, Integer, dan Boolean).'
            }
          ]
        },
        {
          id: 'c2',
          title: 'Logika & Perulangan',
          completedSubMateri: 0,
          totalSubMateri: 2,
          lessons: [
            {
              id: 'l3',
              title: 'Percabangan If-Else',
              isCompleted: false,
              type: 'code',
              isPremium: true,
              costCredit: 1,
              explanation: `
                <h3>Logika Kondisional (If-Else)</h3>
                <p>Percabangan digunakan saat program harus mengambil keputusan berdasarkan kondisi tertentu.</p>
                <p>Sama seperti di dunia nyata: <em>"Jika hujan turun, maka bawa payung. Jika tidak, pakai topi."</em></p>
                <pre><code>if (skor > 80) {
  tampilkan("Selamat, Anda Lulus!");
} else {
  tampilkan("Maaf, Coba Lagi.");
}</code></pre>
                <p>Operator yang sering digunakan: <code>></code> (lebih besar), <code><</code> (lebih kecil), <code>==</code> (sama dengan), <code>!=</code> (tidak sama dengan).</p>
              `,
              quiz: [
                {
                  question: 'Pada kode di atas, apa yang akan terjadi jika nilai skor adalah 70?',
                  options: ['Menampilkan "Selamat, Anda Lulus!"', 'Menampilkan "Maaf, Coba Lagi."', 'Program Error', 'Tidak menampilkan apa-apa'],
                  answerIndex: 1
                }
              ],
              practice: 'Tuliskan logika if-else untuk mengecek apakah umur pengguna >= 18 tahun untuk mendapatkan akses dewasa.'
            },
            {
              id: 'l4',
              title: 'Perulangan (Loops)',
              isCompleted: false,
              type: 'code',
              isPremium: true,
              costCredit: 1,
              explanation: `
                <h3>Mengapa Menggunakan Perulangan?</h3>
                <p>Bayangkan Anda harus mencetak kata "Halo" sebanyak 100 kali. Menulisnya manual tentu melelahkan. <strong>Loop</strong> menyelesaikan masalah ini dengan mengeksekusi blok kode berulang kali.</p>
                <br>
                <h3>Perulangan FOR</h3>
                <p>Digunakan saat Anda sudah tahu pasti berapa kali blok kode harus diulang.</p>
                <pre><code>for (i = 1; i <= 5; i++) {
  tampilkan("Perulangan ke-" + i);
}</code></pre>
              `,
              quiz: [
                {
                  question: 'Apa tujuan utama dari fitur Perulangan (Loop)?',
                  options: ['Membuat aplikasi menjadi lebih lambat', 'Menyembunyikan data dari pengguna', 'Menjalankan instruksi berulang kali tanpa menuliskannya secara manual', 'Menghapus file secara otomatis'],
                  answerIndex: 2
                }
              ],
              practice: 'Tuliskan kode perulangan yang mencetak angka 1 sampai 10.'
            }
          ]
        }
      ]
    },
    {
      id: 'database',
      title: 'Dunia Database (SQL)',
      description: 'Pelajari cara menyimpan, mengambil, dan mengelola data dalam database relasional menggunakan bahasa SQL.',
      icon: 'fa-solid fa-database',
      isPremium: false,
      chapters: [
        {
          id: 'db1',
          title: 'Dasar Pengambilan Data',
          completedSubMateri: 1,
          totalSubMateri: 2,
          lessons: [
            {
              id: 'dbl1',
              title: 'Mengambil Data dengan SELECT',
              isCompleted: true,
              type: 'sql',
              isPremium: false,
              costCredit: 0,
              explanation: `
                <h3>Apa itu SQL?</h3>
                <p><strong>Structured Query Language (SQL)</strong> adalah bahasa standar yang digunakan untuk berkomunikasi dengan sistem database relasional seperti MySQL, PostgreSQL, atau SQLite.</p>
                <br>
                <h3>Perintah Dasar: SELECT</h3>
                <p>Perintah <code>SELECT</code> berfungsi untuk mengambil (membaca) data dari suatu tabel.</p>
                <p>Mengambil <strong>seluruh kolom</strong> dari tabel bernama <em>users</em>:</p>
                <pre><code>SELECT * FROM users;</code></pre>
                <p>Mengambil <strong>kolom tertentu saja</strong> (sangat disarankan untuk performa):</p>
                <pre><code>SELECT nama, email FROM users;</code></pre>
              `,
              quiz: [
                { 
                  question: 'Simbol apa yang digunakan dalam SELECT untuk mengambil SEMUA kolom dari sebuah tabel?', 
                  options: ['%', '&', '*', '#'], 
                  answerIndex: 2 
                }
              ],
              practice: 'Tuliskan query SQL untuk mengambil kolom "judul" dan "penulis" dari tabel "buku".'
            },
            {
              id: 'dbl2',
              title: 'Memfilter Data (Klausa WHERE)',
              isCompleted: false,
              type: 'sql',
              isPremium: true,
              costCredit: 1,
              explanation: `
                <h3>Klausa WHERE</h3>
                <p>Kita jarang membutuhkan seluruh data dari tabel. <code>WHERE</code> digunakan untuk memfilter baris data berdasarkan kriteria tertentu.</p>
                <pre><code>SELECT * FROM users WHERE kota = 'Jakarta';</code></pre>
                <br>
                <h3>Operator dalam WHERE</h3>
                <ul>
                  <li><code>=</code> : Sama dengan</li>
                  <li><code>></code> / <code><</code> : Lebih besar / Lebih kecil dari</li>
                  <li><code>LIKE</code> : Pencarian pola (contoh: <code>LIKE 'A%'</code> untuk awalan A)</li>
                  <li><code>AND</code> / <code>OR</code> : Menggabungkan dua kondisi</li>
                </ul>
              `,
              quiz: [
                { 
                  question: 'Query mana yang benar untuk mengambil data produk yang harganya di atas 50000?', 
                  options: ['SELECT * FROM produk FILTER harga > 50000', 'SELECT * FROM produk WHERE harga > 50000', 'GET produk WHERE harga > 50000', 'SELECT produk WHERE harga = 50000'], 
                  answerIndex: 1 
                }
              ],
              practice: 'Tuliskan query untuk mengambil semua data dari tabel "karyawan" yang memiliki "jabatan" sebagai "Manager".'
            }
          ]
        },
        {
          id: 'db2',
          title: 'Manipulasi Data (CRUD)',
          completedSubMateri: 0,
          totalSubMateri: 2,
          lessons: [
            {
              id: 'dbl3',
              title: 'Menambah Data dengan INSERT',
              isCompleted: false,
              type: 'sql',
              isPremium: true,
              costCredit: 2,
              explanation: `
                <h3>Perintah INSERT INTO</h3>
                <p>Untuk menambahkan baris data baru ke dalam tabel, kita menggunakan perintah <code>INSERT INTO</code>.</p>
                <br>
                <p><strong>Format Dasar:</strong></p>
                <pre><code>INSERT INTO nama_tabel (kolom1, kolom2)
VALUES ('nilai1', 'nilai2');</code></pre>
                <p>Contoh nyata:</p>
                <pre><code>INSERT INTO users (nama, umur)
VALUES ('Budi', 25);</code></pre>
              `,
              quiz: [
                { 
                  question: 'Kata kunci (keyword) yang mengikuti perintah INSERT INTO untuk menentukan nilainya adalah?', 
                  options: ['DATA', 'INPUT', 'VALUES', 'SET'], 
                  answerIndex: 2 
                }
              ],
              practice: 'Tambahkan data pelanggan baru dengan nama "Siti" dan kota "Bandung" ke tabel "pelanggan".'
            },
            {
              id: 'dbl4',
              title: 'Mengubah (UPDATE) & Menghapus (DELETE)',
              isCompleted: false,
              type: 'sql',
              isPremium: true,
              costCredit: 2,
              explanation: `
                <h3>UPDATE (Mengubah Data)</h3>
                <p>Digunakan untuk memodifikasi data yang sudah ada. <strong>Selalu gunakan WHERE</strong> jika tidak ingin semua baris berubah!</p>
                <pre><code>UPDATE users 
SET umur = 26 
WHERE nama = 'Budi';</code></pre>
                <br>
                <h3>DELETE (Menghapus Data)</h3>
                <p>Digunakan untuk menghapus baris dari tabel. Sekali lagi, hati-hati tanpa WHERE!</p>
                <pre><code>DELETE FROM users WHERE id = 10;</code></pre>
              `,
              quiz: [
                { 
                  question: 'Apa yang terjadi jika Anda menjalankan perintah UPDATE tanpa klausa WHERE?', 
                  options: ['Akan terjadi error syntax', 'Hanya baris pertama yang diubah', 'Semua baris di dalam tabel akan ikut berubah', 'Perintah akan dibatalkan otomatis'], 
                  answerIndex: 2 
                }
              ],
              practice: 'Tuliskan query untuk menghapus data dari tabel "pesanan" yang memiliki status "Batal".'
            }
          ]
        }
      ]
    },
    {
      id: 'frontend',
      title: 'Frontend Mastery',
      description: 'Kuasai keterampilan merancang antarmuka web dengan HTML, CSS, JavaScript dan arsitektur modern.',
      icon: 'fa-brands fa-vuejs',
      isPremium: true,
      chapters: [
        {
          id: 'fe1',
          title: 'Struktur & Gaya Fundamental',
          completedSubMateri: 0,
          totalSubMateri: 2,
          lessons: [
            {
              id: 'fel1',
              title: 'Anatomi HTML5',
              isCompleted: false,
              type: 'code',
              isPremium: true,
              costCredit: 2,
              explanation: `
                <h3>Apa itu HTML?</h3>
                <p><strong>HyperText Markup Language (HTML)</strong> adalah tulang punggung dari semua halaman web. HTML mendefinisikan struktur dan konten (seperti teks, gambar, dan link).</p>
                <br>
                <h3>Struktur Dasar Dokumen HTML5</h3>
                <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="id"&gt;
  &lt;head&gt;
    &lt;title&gt;Halaman Pertamaku&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Halo, Dunia!&lt;/h1&gt;
    &lt;p&gt;Ini adalah paragraf pertama saya.&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>
                <p>Tag <code>&lt;head&gt;</code> memuat metadata dan pengaturan, sedangkan <code>&lt;body&gt;</code> adalah area visual yang akan tampil di layar pengguna.</p>
              `,
              quiz: [
                { 
                  question: 'Tag manakah yang bertugas membungkus seluruh konten visual yang dilihat oleh pengguna di web browser?', 
                  options: ['<title>', '<head>', '<body>', '<html>'], 
                  answerIndex: 2 
                }
              ],
              practice: 'Tuliskan elemen HTML untuk membuat sebuah tautan (link) yang mengarah ke google.com.'
            },
            {
              id: 'fel2',
              title: 'Styling dengan CSS',
              isCompleted: false,
              type: 'code',
              isPremium: true,
              costCredit: 3,
              explanation: `
                <h3>Apa itu CSS?</h3>
                <p><strong>Cascading Style Sheets (CSS)</strong> bertanggung jawab atas penampilan atau gaya dari struktur HTML. Tanpa CSS, web hanya berupa teks hitam di atas latar belakang putih.</p>
                <br>
                <h3>Sintaks CSS</h3>
                <pre><code>selector {
  properti: nilai;
}</code></pre>
                <p>Contoh pengaplikasian untuk mengubah seluruh paragraf menjadi biru:</p>
                <pre><code>p {
  color: blue;
  font-size: 16px;
  margin-top: 20px;
}</code></pre>
                <p>Anda bisa memilih elemen berdasarkan tag (<code>p</code>), class (<code>.nama-kelas</code>), atau id (<code>#nama-id</code>).</p>
              `,
              quiz: [
                { 
                  question: 'Bagaimana cara menargetkan elemen HTML yang memiliki class "tombol-utama" di CSS?', 
                  options: ['#tombol-utama', '.tombol-utama', '*tombol-utama', 'tombol-utama'], 
                  answerIndex: 1 
                }
              ],
              practice: 'Tuliskan kode CSS untuk mengubah background warna halaman (body) menjadi hitam (#000000).'
            }
          ]
        },
        {
          id: 'fe2',
          title: 'Interaktivitas Dasar',
          completedSubMateri: 0,
          totalSubMateri: 1,
          lessons: [
            {
              id: 'fel3',
              title: 'Pengenalan DOM Javascript',
              isCompleted: false,
              type: 'code',
              isPremium: true,
              costCredit: 5,
              explanation: `
                <h3>Document Object Model (DOM)</h3>
                <p>Javascript dapat membuat halaman web menjadi hidup dan interaktif dengan cara memanipulasi DOM. DOM adalah representasi struktur HTML sebagai sebuah pohon objek.</p>
                <br>
                <h3>Memilih dan Mengubah Elemen</h3>
                <p>Misalkan kita memiliki elemen <code>&lt;h1 id="judul"&gt;Halo&lt;/h1&gt;</code>. Kita bisa mengubah teksnya melalui Javascript:</p>
                <pre><code>// 1. Pilih elemennya
const elemenJudul = document.getElementById("judul");

// 2. Ubah isi teksnya
elemenJudul.textContent = "Selamat Datang di Javascript!";</code></pre>
                <p>Selain mengubah teks, Anda juga bisa bereaksi terhadap klik tombol (Event Listeners), mengubah warna, menyembunyikan elemen, dsb.</p>
              `,
              quiz: [
                { 
                  question: 'Metode apa di Javascript yang paling spesifik digunakan untuk memilih SATU elemen berdasarkan atribut ID-nya?', 
                  options: ['querySelector', 'getElementsByClassName', 'getElementById', 'getElementsByTagName'], 
                  answerIndex: 2 
                }
              ],
              practice: 'Tuliskan satu baris perintah Javascript untuk mengambil elemen dengan ID "btn-kirim".'
            }
          ]
        }
      ]
    }
  ])

  // Extract all challenges for the new Challenges View
  const allChallenges = computed(() => {
    let list = []
    paths.value.forEach(path => {
      path.chapters.forEach(chapter => {
        chapter.lessons.forEach(lesson => {
          list.push({
            id: lesson.id,
            pathId: path.id,
            chapterId: chapter.id,
            title: lesson.title,
            category: path.title,
            difficulty: lesson.isPremium ? 'Sulit' : (lesson.id === 'l1' ? 'Mudah' : 'Sedang'),
            isPremium: lesson.isPremium,
            isCompleted: lesson.isCompleted,
            costCredit: lesson.costCredit,
            tags: [path.id, lesson.type]
          })
        })
      })
    })
    return list
  })

  const getPathById = (id) => {
    return paths.value.find(p => p.id === id)
  }

  const getLessonByIds = (pathId, chapterId, lessonId) => {
    const path = getPathById(pathId)
    if (!path) return null
    const chapter = path.chapters.find(c => c.id === chapterId)
    if (!chapter) return null
    return chapter.lessons.find(l => l.id === lessonId)
  }

  return {
    paths,
    allChallenges,
    getPathById,
    getLessonByIds
  }
}
