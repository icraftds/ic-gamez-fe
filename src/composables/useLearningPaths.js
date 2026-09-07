import { ref, computed } from 'vue'

export function useLearningPaths() {
  const paths = ref([
    {
      id: 'dasar',
      title: 'Dasar Pemrograman',
      description: 'Pelajari konsep dasar pemrograman, variabel, tipe data, logika dasar, dan struktur data menggunakan syntax universal.',
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
                <div class="code-block-wrapper">
                  <pre><code>// Contoh sederhana memberi perintah ke komputer
print("Halo, Dunia!");
jalanKeDepan(10);
belokKanan();</code></pre>
                </div>
                <h3>Mengapa Belajar Pemrograman?</h3>
                <ul>
                  <li><strong>Otomatisasi:</strong> Menyelesaikan tugas berulang dalam hitungan detik.</li>
                  <li><strong>Penciptaan:</strong> Membuat website, game, hingga kecerdasan buatan (AI).</li>
                  <li><strong>Problem Solving:</strong> Melatih cara berpikir logis.</li>
                </ul>
              `,
              quiz: [
                {
                  question: 'Manakah analogi terbaik untuk mendeskripsikan pemrograman?',
                  options: ['Menonton film di bioskop', 'Menulis resep masakan untuk diikuti koki', 'Mengendarai mobil', 'Menghafal buku sejarah'],
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
                <p>Dalam pemrograman, <strong>Variabel</strong> adalah tempat untuk menyimpan data sementara. Setiap variabel memiliki <strong>Tipe Data</strong>.</p>
                <div class="code-block-wrapper">
                  <pre><code>nama_pemain = "Alex"    // Teks (String)
skor = 100              // Angka (Integer)
sedang_bermain = true   // Kebenaran (Boolean)</code></pre>
                </div>
                <h3>Tipe Data Dasar yang Wajib Diketahui</h3>
                <ul>
                  <li><strong>String (Teks):</strong> Diapit tanda kutip (<code>"Halo Dunia"</code>).</li>
                  <li><strong>Integer (Angka Bulat):</strong> Angka tanpa pecahan desimal (<code>100</code>, <code>-5</code>).</li>
                  <li><strong>Float (Angka Desimal):</strong> Angka dengan pecahan desimal (<code>3.14</code>).</li>
                  <li><strong>Boolean:</strong> Hanya memiliki dua nilai, <code>true</code> atau <code>false</code>.</li>
                </ul>
              `,
              quiz: [
                {
                  question: 'Tipe data apa yang cocok untuk menyimpan nilai "umur" seseorang (contoh: 25)?',
                  options: ['String', 'Integer', 'Boolean', 'Float'],
                  answerIndex: 1
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
              isPremium: false,
              costCredit: 0,
              explanation: `
                <h3>Logika Kondisional (If-Else)</h3>
                <p>Percabangan digunakan saat program harus mengambil keputusan berdasarkan kondisi tertentu.</p>
                <div class="code-block-wrapper">
                  <pre><code>if (skor >= 80) {
  tampilkan("Lulus!");
} else {
  tampilkan("Gagal.");
}</code></pre>
                </div>
                <p><strong>Operator Perbandingan:</strong></p>
                <ul>
                  <li><code>></code> : lebih besar dari</li>
                  <li><code><</code> : lebih kecil dari</li>
                  <li><code>==</code> : sama persis dengan</li>
                  <li><code>!=</code> : tidak sama dengan</li>
                  <li><code>>=</code> : lebih besar atau sama dengan</li>
                </ul>
              `,
              quiz: [
                {
                  question: 'Pada kode di atas, apa yang terjadi jika skor adalah 70?',
                  options: ['Menampilkan "Lulus!"', 'Menampilkan "Gagal."', 'Error', 'Tidak terjadi apa-apa'],
                  answerIndex: 1
                }
              ],
              practice: 'Tuliskan logika if-else untuk mengecek apakah umur pengguna >= 18 tahun untuk mendapatkan akses.'
            },
            {
              id: 'l4',
              title: 'Perulangan (Loops)',
              isCompleted: false,
              type: 'code',
              isPremium: false,
              costCredit: 0,
              explanation: `
                <h3>Mengapa Menggunakan Perulangan?</h3>
                <p>Bayangkan harus mencetak "Halo" 100 kali. <strong>Loop (Perulangan)</strong> mengeksekusi blok kode berulang kali secara otomatis.</p>
                <div class="code-block-wrapper">
                  <pre><code>for (i = 1; i <= 5; i++) {
  tampilkan("Perulangan ke-" + i);
}</code></pre>
                </div>
                <ul>
                  <li><code>i = 1</code> : Nilai awal.</li>
                  <li><code>i <= 5</code> : Kondisi berhentinya.</li>
                  <li><code>i++</code> : Langkah maju.</li>
                </ul>
              `,
              quiz: [
                {
                  question: 'Apa tujuan utama dari fitur Perulangan (Loop)?',
                  options: ['Memperlambat aplikasi', 'Menyembunyikan data', 'Menjalankan instruksi berulang kali tanpa menulisnya manual', 'Menghapus file'],
                  answerIndex: 2
                }
              ],
              practice: 'Tuliskan kode perulangan yang mencetak angka 1 sampai 10.'
            }
          ]
        },
        {
          id: 'c3',
          title: 'Fungsi & Array',
          completedSubMateri: 0,
          totalSubMateri: 2,
          lessons: [
            {
              id: 'l5',
              title: 'Mengenal Fungsi (Function)',
              isCompleted: false,
              type: 'code',
              isPremium: false,
              costCredit: 0,
              explanation: `
                <h3>Fungsi: Blok Kode yang Bisa Digunakan Kembali</h3>
                <p>Fungsi adalah sekumpulan instruksi yang dibungkus menjadi satu kesatuan tugas. Kita bisa "memanggil" tugas itu berkali-kali tanpa harus menulis ulang kodenya.</p>
                <div class="code-block-wrapper">
                  <pre><code>function sapaPengguna(nama) {
  tampilkan("Halo, selamat datang " + nama);
}

sapaPengguna("Budi"); // Akan mencetak: Halo, selamat datang Budi
sapaPengguna("Siti"); // Akan mencetak: Halo, selamat datang Siti</code></pre>
                </div>
                <p>Fungsi juga bisa mengembalikan sebuah nilai (return):</p>
                <div class="code-block-wrapper">
                  <pre><code>function tambah(a, b) {
  return a + b;
}</code></pre>
                </div>
              `,
              quiz: [
                {
                  question: 'Apa keuntungan utama menggunakan Fungsi?',
                  options: ['Menghindari penulisan kode yang berulang-ulang', 'Membuat tampilan web menjadi berwarna', 'Menyimpan data ke dalam database', 'Mengamankan password'],
                  answerIndex: 0
                }
              ],
              practice: 'Buatlah sebuah fungsi bernama "kalikan" yang menerima dua parameter angka dan mengembalikan hasil kalinya.'
            },
            {
              id: 'l6',
              title: 'Struktur Data: Array',
              isCompleted: false,
              type: 'code',
              isPremium: false,
              costCredit: 0,
              explanation: `
                <h3>Array: Menyimpan Banyak Data dalam Satu Variabel</h3>
                <p>Jika variabel biasa ibarat sebuah kotak kecil, Array ibarat rak loker yang memiliki banyak laci berderet.</p>
                <div class="code-block-wrapper">
                  <pre><code>// Daripada membuat banyak variabel:
buah1 = "Apel"
buah2 = "Mangga"

// Lebih baik gunakan Array:
daftar_buah = ["Apel", "Mangga", "Jeruk", "Pisang"]</code></pre>
                </div>
                <p>Untuk mengakses data di dalam array, kita menggunakan urutan indeks (selalu dimulai dari 0):</p>
                <div class="code-block-wrapper">
                  <pre><code>tampilkan(daftar_buah[0]); // Output: Apel
tampilkan(daftar_buah[2]); // Output: Jeruk</code></pre>
                </div>
              `,
              quiz: [
                {
                  question: 'Angka berapakah yang digunakan untuk mengakses elemen pertama di dalam Array?',
                  options: ['1', '0', '-1', '2'],
                  answerIndex: 1
                }
              ],
              practice: 'Buatlah sebuah Array yang berisi 3 nama negara favoritmu.'
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
                <p><strong>Structured Query Language (SQL)</strong> adalah bahasa standar yang digunakan untuk berkomunikasi dengan sistem database relasional seperti MySQL, PostgreSQL, atau SQLite. Dengan SQL kita bisa membaca, menulis, mengubah, dan menghapus data.</p>
                <br>
                <h3>Perintah Dasar: SELECT</h3>
                <p>Perintah <code>SELECT</code> berfungsi untuk mengambil (membaca) data dari suatu tabel dalam database.</p>
                <div class="code-block-wrapper">
                  <pre><code>SELECT * FROM users;</code></pre>
                </div>
                <p>Tanda asterisk (<code>*</code>) berarti "semua kolom". Ini berguna jika kamu ingin melihat bentuk utuh tabelnya.</p>
                <p>Namun, untuk performa lebih baik, ambil <strong>kolom tertentu saja</strong>:</p>
                <div class="code-block-wrapper">
                  <pre><code>SELECT nama, email FROM users;</code></pre>
                </div>
              `,
              quiz: [
                { 
                  question: 'Simbol apa yang digunakan dalam SELECT untuk mengambil SEMUA kolom?', 
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
              isPremium: false,
              costCredit: 0,
              explanation: `
                <h3>Memfilter dengan WHERE</h3>
                <p><code>SELECT *</code> mengembalikan semua baris dalam tabel. Pakai <code>WHERE</code> buat filter baris berdasarkan kondisi.</p>
                <div class="code-block-wrapper">
                  <pre><code>SELECT * FROM produk WHERE kategori = 'Elektronik';</code></pre>
                </div>
                <p>Struktur umum query dengan WHERE:</p>
                <div class="code-block-wrapper">
                  <pre><code>SELECT kolom1, kolom2
FROM nama_tabel
WHERE kondisi;</code></pre>
                </div>
                <p><strong>Beberapa hal penting:</strong></p>
                <ul>
                  <li><strong>Teks (String):</strong> Diapit tanda kutip tunggal (<code>'contoh'</code>).</li>
                  <li><strong>Angka:</strong> Tidak perlu tanda kutip (Contoh: <code>WHERE harga > 5000</code>).</li>
                </ul>
              `,
              quiz: [
                { 
                  question: 'Query mana yang benar untuk mengambil produk yang harganya di atas 50000?', 
                  options: ['SELECT * FROM produk FILTER harga > 50000', 'SELECT * FROM produk WHERE harga > 50000', 'GET produk WHERE harga > 50000', 'SELECT produk WHERE harga = 50000'], 
                  answerIndex: 1 
                }
              ],
              practice: 'Tuliskan query untuk mengambil semua data dari tabel "karyawan" yang memiliki jabatan "Manager".'
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
              isPremium: false,
              costCredit: 0,
              explanation: `
                <h3>Perintah INSERT INTO</h3>
                <p>Untuk menambahkan baris data (record) baru ke dalam tabel, kita menggunakan perintah <code>INSERT INTO</code>.</p>
                <div class="code-block-wrapper">
                  <pre><code>INSERT INTO nama_tabel (kolom1, kolom2)
VALUES ('nilai1', 'nilai2');</code></pre>
                </div>
                <p>Contoh nyata di sistem registrasi pengguna:</p>
                <div class="code-block-wrapper">
                  <pre><code>INSERT INTO users (nama, umur, kota)
VALUES ('Budi', 25, 'Jakarta');</code></pre>
                </div>
              `,
              quiz: [
                { 
                  question: 'Kata kunci yang mengikuti perintah INSERT INTO untuk menentukan nilainya adalah?', 
                  options: ['DATA', 'INPUT', 'VALUES', 'SET'], 
                  answerIndex: 2 
                }
              ],
              practice: 'Tambahkan data pelanggan baru dengan nama "Siti" dan kota "Bandung" ke tabel "pelanggan".'
            },
            {
              id: 'dbl4',
              title: 'Mengubah & Menghapus Data',
              isCompleted: false,
              type: 'sql',
              isPremium: false,
              costCredit: 0,
              explanation: `
                <h3>UPDATE (Mengubah Data)</h3>
                <p>Digunakan untuk memodifikasi data yang sudah ada di tabel.</p>
                <div class="code-block-wrapper">
                  <pre><code>UPDATE users 
SET umur = 26, kota = 'Bandung'
WHERE nama = 'Budi';</code></pre>
                </div>
                <p><strong>⚠️ PERINGATAN KERAS:</strong> Selalu gunakan <code>WHERE</code> pada perintah UPDATE! Jika kamu lupa, seluruh baris tabel akan berubah.</p>
                <br>
                <h3>DELETE (Menghapus Data)</h3>
                <p>Digunakan untuk menghapus baris dari tabel.</p>
                <div class="code-block-wrapper">
                  <pre><code>DELETE FROM users 
WHERE id = 10;</code></pre>
                </div>
              `,
              quiz: [
                { 
                  question: 'Apa yang terjadi jika Anda menjalankan perintah UPDATE tanpa klausa WHERE?', 
                  options: ['Akan terjadi error syntax', 'Hanya baris pertama yang diubah', 'Semua baris di tabel akan ikut terubah', 'Perintah akan dibatalkan otomatis'], 
                  answerIndex: 2 
                }
              ],
              practice: 'Tuliskan query untuk menghapus data dari tabel "pesanan" yang memiliki status "Batal".'
            }
          ]
        },
        {
          id: 'db3',
          title: 'Relasi & Agregasi',
          completedSubMateri: 0,
          totalSubMateri: 2,
          lessons: [
            {
              id: 'dbl5',
              title: 'Menggabungkan Tabel (JOIN)',
              isCompleted: false,
              type: 'sql',
              isPremium: false,
              costCredit: 0,
              explanation: `
                <h3>Kekuatan Relasional (JOIN)</h3>
                <p>Dalam database relasional, data sering disebar di berbagai tabel (misalnya tabel <code>users</code> dan tabel <code>pesanan</code>). Kita menggunakan <code>JOIN</code> untuk menarik data dari dua tabel secara bersamaan.</p>
                <div class="code-block-wrapper">
                  <pre><code>SELECT users.nama, pesanan.total_harga
FROM users
JOIN pesanan ON users.id = pesanan.user_id;</code></pre>
                </div>
                <p>Kode di atas akan menampilkan nama pengguna beserta jumlah total pesanan yang mereka buat, dengan menyocokkan ID dari kedua tabel.</p>
              `,
              quiz: [
                { 
                  question: 'Perintah apa yang digunakan untuk menggabungkan baris dari dua tabel atau lebih berdasarkan kolom yang saling berhubungan?', 
                  options: ['CONNECT', 'LINK', 'MERGE', 'JOIN'], 
                  answerIndex: 3 
                }
              ],
              practice: 'Buat query untuk mengambil kolom "nama_karyawan" dari tabel "karyawan" dan "nama_departemen" dari tabel "departemen" menggunakan JOIN.'
            },
            {
              id: 'dbl6',
              title: 'Fungsi Agregasi (GROUP BY)',
              isCompleted: false,
              type: 'sql',
              isPremium: false,
              costCredit: 0,
              explanation: `
                <h3>Fungsi Agregasi (Kalkulasi Data)</h3>
                <p>Database sangat ahli dalam melakukan rekap data otomatis menggunakan fungsi bawaan.</p>
                <ul>
                  <li><code>COUNT()</code> : Menghitung jumlah baris</li>
                  <li><code>SUM()</code> : Menjumlahkan nilai angka</li>
                  <li><code>AVG()</code> : Mencari rata-rata</li>
                  <li><code>MAX()</code> & <code>MIN()</code> : Mencari nilai tertinggi/terendah</li>
                </ul>
                <div class="code-block-wrapper">
                  <pre><code>-- Mencari jumlah total penjualan di kota Jakarta
SELECT SUM(total_harga) 
FROM pesanan 
WHERE kota_pengiriman = 'Jakarta';</code></pre>
                </div>
              `,
              quiz: [
                { 
                  question: 'Fungsi agregasi apa yang tepat untuk menghitung BANYAKNYA pelanggan yang terdaftar di database?', 
                  options: ['SUM()', 'COUNT()', 'TOTAL()', 'MAX()'], 
                  answerIndex: 1 
                }
              ],
              practice: 'Tulis query untuk mencari rata-rata (average) dari kolom "nilai_ujian" pada tabel "siswa".'
            }
          ]
        }
      ]
    },
    {
      id: 'frontend',
      title: 'Frontend Mastery',
      description: 'Kuasai keterampilan merancang antarmuka web dengan HTML, CSS, JavaScript dan arsitektur modern yang responsif.',
      icon: 'fa-brands fa-vuejs',
      isPremium: false,
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
              isPremium: false,
              costCredit: 0,
              explanation: `
                <h3>Apa itu HTML?</h3>
                <p><strong>HyperText Markup Language (HTML)</strong> mendefinisikan struktur dan konten murni (teks, gambar, video, form, link).</p>
                <div class="code-block-wrapper">
                  <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="id"&gt;
  &lt;head&gt;
    &lt;title&gt;Halaman Web&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Halo, Dunia!&lt;/h1&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>
                </div>
                <ul>
                  <li><code>&lt;head&gt;</code>: Memuat metadata, judul, tidak terlihat di layar web.</li>
                  <li><code>&lt;body&gt;</code>: Berisi seluruh konten visual web yang akan dilihat pengguna.</li>
                </ul>
              `,
              quiz: [
                { 
                  question: 'Tag manakah yang membungkus konten visual yang dilihat pengguna?', 
                  options: ['<title>', '<head>', '<body>', '<html>'], 
                  answerIndex: 2 
                }
              ],
              practice: 'Tuliskan elemen HTML untuk membuat tautan yang mengarah ke google.com.'
            },
            {
              id: 'fel2',
              title: 'Styling dengan CSS',
              isCompleted: false,
              type: 'code',
              isPremium: true,
              costCredit: 1,
              explanation: `
                <h3>Apa itu CSS?</h3>
                <p><strong>Cascading Style Sheets (CSS)</strong> bertanggung jawab atas penampilan atau gaya dari struktur HTML.</p>
                <div class="code-block-wrapper">
                  <pre><code>selector {
  properti: nilai;
}</code></pre>
                </div>
                <div class="code-block-wrapper">
                  <pre><code>p {
  color: blue;
  font-size: 16px;
}</code></pre>
                </div>
                <ul>
                  <li><strong>Tag Selector:</strong> <code>p</code>, <code>h1</code></li>
                  <li><strong>Class Selector:</strong> <code>.tombol-merah</code></li>
                  <li><strong>ID Selector:</strong> <code>#header-utama</code></li>
                </ul>
              `,
              quiz: [
                { 
                  question: 'Bagaimana menargetkan elemen HTML dengan class "tombol-utama" di CSS?', 
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
          title: 'Tata Letak & Responsivitas',
          completedSubMateri: 0,
          totalSubMateri: 2,
          lessons: [
            {
              id: 'fel4',
              title: 'Flexbox Layout',
              isCompleted: false,
              type: 'code',
              isPremium: true,
              costCredit: 2,
              explanation: `
                <h3>Menyusun Komponen dengan Flexbox</h3>
                <p>Flexbox (Flexible Box) adalah metode tata letak CSS yang dirancang untuk menyusun elemen di dalam kontainer secara horizontal atau vertikal dengan mudah.</p>
                <div class="code-block-wrapper">
                  <pre><code>.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}</code></pre>
                </div>
                <p>Dengan kode di atas, semua elemen di dalam <code>.container</code> akan berjejer menyamping, diberi jarak yang sama (space-between), dan diratakan di tengah secara vertikal (align-items).</p>
              `,
              quiz: [
                { 
                  question: 'Properti CSS apa yang diperlukan untuk mengaktifkan Flexbox pada sebuah container?', 
                  options: ['layout: flexbox;', 'display: block;', 'display: flex;', 'position: flexible;'], 
                  answerIndex: 2 
                }
              ],
              practice: 'Berikan property css yang mengubah arah flexbox menjadi dari atas ke bawah (kolom).'
            },
            {
              id: 'fel5',
              title: 'Responsive Design (Media Query)',
              isCompleted: false,
              type: 'code',
              isPremium: true,
              costCredit: 2,
              explanation: `
                <h3>Tampil Sempurna di HP & Laptop</h3>
                <p>Responsive design memastikan web kamu terlihat bagus di layar berukuran berapapun. Senjata utama untuk ini adalah <strong>Media Queries</strong>.</p>
                <div class="code-block-wrapper">
                  <pre><code>/* Style default untuk layar besar (Desktop) */
.sidebar {
  width: 300px;
}

/* Jika lebar layar maksimal 768px (Mobile/Tablet) */
@media (max-width: 768px) {
  .sidebar {
    width: 100%; /* Lebar jadi penuh */
  }
}</code></pre>
                </div>
              `,
              quiz: [
                { 
                  question: 'Syntax apa yang digunakan CSS untuk menerapkan gaya khusus berdasarkan ukuran layar perangkat?', 
                  options: ['@responsive', '@media', '@screen', '@device'], 
                  answerIndex: 1 
                }
              ],
              practice: 'Tulis media query untuk layar yang ukurannya di bawah 500px, dengan mengubah ukuran font body menjadi 14px.'
            }
          ]
        },
        {
          id: 'fe3',
          title: 'Interaktivitas',
          completedSubMateri: 0,
          totalSubMateri: 1,
          lessons: [
            {
              id: 'fel3',
              title: 'Manipulasi DOM Javascript',
              isCompleted: false,
              type: 'code',
              isPremium: true,
              costCredit: 2,
              explanation: `
                <h3>Document Object Model (DOM)</h3>
                <p>Javascript dapat membuat halaman web menjadi hidup. DOM adalah representasi struktur HTML di memori browser. Dengan DOM, Javascript bisa menghapus HTML, mengganti CSS, dsb.</p>
                <div class="code-block-wrapper">
                  <pre><code>// 1. Pilih elemen berdasarkan ID
const judul = document.getElementById("judul");

// 2. Ubah isi teksnya
judul.textContent = "Selamat Datang!";

// 3. Tambahkan Event Listener (Aksi saat diklik)
judul.addEventListener('click', function() {
  alert('Judul diklik!');
});</code></pre>
                </div>
              `,
              quiz: [
                { 
                  question: 'Metode Javascript apa yang spesifik digunakan untuk memilih SATU elemen berdasarkan atribut ID?', 
                  options: ['querySelector', 'getElementsByClassName', 'getElementById', 'getElementsByTagName'], 
                  answerIndex: 2 
                }
              ],
              practice: 'Tuliskan perintah Javascript untuk mengubah text elemen ber-ID "btn-kirim" menjadi "Mengirim...".'
            }
          ]
        }
      ]
    },
    {
      id: 'backend',
      title: 'Backend Development',
      description: 'Bangun server yang kuat, buat REST API, dan integrasi dengan database relasional menggunakan ekosistem Node.js.',
      icon: 'fa-brands fa-node-js',
      isPremium: false,
      chapters: [
        {
          id: 'be1',
          title: 'Pengenalan Node.js & Server',
          completedSubMateri: 0,
          totalSubMateri: 2,
          lessons: [
            {
              id: 'bel1',
              title: 'Apa itu Node.js?',
              isCompleted: false,
              type: 'text',
              isPremium: false,
              costCredit: 0,
              explanation: `
                <h3>Javascript di Luar Browser</h3>
                <p>Node.js adalah sebuah "Runtime Environment" yang memungkinkan kita menjalankan kode Javascript di komputer lokal (sistem operasi) atau di Server (Backend).</p>
                <ul>
                  <li><strong>Fullstack:</strong> Tulis Frontend & Backend dalam bahasa Javascript.</li>
                  <li><strong>Non-Blocking I/O:</strong> Sangat cepat menangani ribuan koneksi.</li>
                </ul>
                <div class="code-block-wrapper">
                  <pre><code>const os = require('os');
console.log("Memory Tersedia:", os.freemem());</code></pre>
                </div>
              `,
              quiz: [
                { 
                  question: 'Apa fungsi utama dari Node.js?', 
                  options: ['Mempercantik tampilan website (CSS)', 'Menjalankan Javascript di luar browser (di server)', 'Membuat database relasional', 'Sebuah bahasa pemrograman baru'], 
                  answerIndex: 1 
                }
              ],
              practice: 'Jelaskan mengapa Node.js menguntungkan developer Javascript Frontend!'
            },
            {
              id: 'bel2',
              title: 'Membuat Server Express.js',
              isCompleted: false,
              type: 'code',
              isPremium: true,
              costCredit: 2,
              explanation: `
                <h3>Web Server itu apa?</h3>
                <p><strong>Server</strong> adalah program yang selalu "menunggu" permintaan (Request) dari klien, lalu mengirimkan balasan (Response).</p>
                <p>Developer Node.js biasanya menggunakan Framework <strong>Express.js</strong> untuk memudahkan pembuatan server.</p>
                <div class="code-block-wrapper">
                  <pre><code>const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Server Express menyala!');
});

app.listen(3000, () => {
  console.log('Berjalan di port 3000');
});</code></pre>
                </div>
              `,
              quiz: [
                { 
                  question: 'Apa peran Express.js dalam Node.js?', 
                  options: ['Sistem operasi khusus server', 'Framework Javascript Frontend', 'Framework minimalis untuk mempermudah pembuatan Server dan API', 'Bahasa query'], 
                  answerIndex: 2 
                }
              ],
              practice: 'Bagaimana cara mengubah port dari 3000 menjadi 8080 pada kode di atas?'
            }
          ]
        },
        {
          id: 'be2',
          title: 'RESTful API Fundamental',
          completedSubMateri: 0,
          totalSubMateri: 2,
          lessons: [
            {
              id: 'bel3',
              title: 'Routing dan Method HTTP',
              isCompleted: false,
              type: 'code',
              isPremium: true,
              costCredit: 3,
              explanation: `
                <h3>Apa itu API?</h3>
                <p><strong>API (Application Programming Interface)</strong> adalah jembatan yang menghubungkan Frontend dengan Backend.</p>
                <h3>HTTP Methods</h3>
                <ul>
                  <li><code>GET</code> : Meminta/membaca data (R).</li>
                  <li><code>POST</code> : Mengirim data baru (C).</li>
                  <li><code>PUT</code> : Mengubah/update data (U).</li>
                  <li><code>DELETE</code> : Menghapus data (D).</li>
                </ul>
                <div class="code-block-wrapper">
                  <pre><code>app.get('/api/users', (req, res) => {
  res.json({ pesan: "Daftar semua user" });
});

app.post('/api/users', (req, res) => {
  res.json({ pesan: "User baru terbuat!" });
});</code></pre>
                </div>
              `,
              quiz: [
                { 
                  question: 'Metode HTTP mana yang paling tepat ketika pengguna mengisi form registrasi ke server?', 
                  options: ['GET', 'POST', 'DELETE', 'UPDATE'], 
                  answerIndex: 1 
                }
              ],
              practice: 'Apa bedanya Method GET dengan POST secara singkat?'
            },
            {
              id: 'bel4',
              title: 'Menangkap Input (Body & Params)',
              isCompleted: false,
              type: 'code',
              isPremium: true,
              costCredit: 3,
              explanation: `
                <h3>Menangkap Data dari Frontend</h3>
                <p>Server harus tahu apa yang dikirim oleh Frontend. Data bisa dikirim melalui <strong>Params</strong> (URL) atau <strong>Body</strong> (form data).</p>
                <div class="code-block-wrapper">
                  <pre><code>// URL Params: /api/users/123
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id; // bernilai 123
  res.json({ id: userId });
});

// JSON Body Parser wajib agar bisa membaca body POST
app.use(express.json());

app.post('/api/users', (req, res) => {
  const email = req.body.email; // Dari body request
  res.send('Mendaftar dengan: ' + email);
});</code></pre>
                </div>
              `,
              quiz: [
                { 
                  question: 'Property apa yang digunakan di object Request (req) untuk mendapatkan parameter ID dari URL (/api/users/:id)?', 
                  options: ['req.body.id', 'req.params.id', 'req.query.id', 'req.url.id'], 
                  answerIndex: 1 
                }
              ],
              practice: 'Tuliskan baris kode Express agar server bisa membaca payload JSON dari HTTP POST!'
            }
          ]
        }
      ]
    }
  ])

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
