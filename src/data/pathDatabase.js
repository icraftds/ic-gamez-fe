export const databaseChapters = [
  {
    id: 'db1',
    title: 'Pengenalan Database',
    completedSubMateri: 0,
    totalSubMateri: 2,
    lessons: [
      {
        id: 'dbl1',
        title: 'Konsep RDBMS & Tabel',
        isCompleted: false,
        type: 'text',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Selamat Datang di Dunia Database</h2>
          <p>Database (Basis Data) adalah sekumpulan data yang disimpan secara sistematis di dalam komputer sehingga dapat diolah atau dimanipulasi menggunakan perangkat lunak (software) untuk menghasilkan informasi.</p>
          <br/>
          <p>Sebagian besar sistem modern menggunakan <strong>RDBMS (Relational Database Management System)</strong>. Konsep utama dari relasional adalah menyimpan data dalam bentuk <strong>Tabel</strong> yang terdiri dari baris (Row/Record) dan kolom (Column/Field), yang mana setiap tabel bisa saling terhubung (berelasi).</p>
          <br/>
          <h3>Analogi Tabel</h3>
          <ul>
            <li><strong>Kolom (Column/Field):</strong> Mendefinisikan tipe data yang disimpan (contoh: Nama, Umur, Alamat). Kolom seperti judul kategori di Microsoft Excel.</li>
            <li><strong>Baris (Row/Record):</strong> Berisi satu entri data utuh (contoh: 'Budi', 25, 'Jakarta'). Baris seperti satu baris data pengguna di Excel.</li>
          </ul>
        `,
        quiz: [
          {
            question: "Dalam konsep RDBMS, sekumpulan data yang merepresentasikan satu entri tunggal (seperti data satu orang pengguna) disimpan dalam bentuk?",
            options: [
              "Kolom (Column)",
              "Baris (Row/Record)",
              "Database",
              "Relasi (Relation)"
            ],
            answerIndex: 1,
            explanation: "Baris (Row) atau Record menyimpan satu set data lengkap untuk satu entitas (misal: semua data tentang 'Budi'). Kolom hanya merepresentasikan satu jenis atribut (misal: 'Nama')."
          }
        ],
        practice: ""
      },
      {
        id: 'dbl2',
        title: 'Tipe Data SQL (INT, VARCHAR, DATE)',
        isCompleted: false,
        type: 'text',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Mengenal Tipe Data di SQL</h2>
          <p>Ketika membuat sebuah kolom dalam tabel database, kita harus menentukan tipe data apa yang boleh disimpan di dalam kolom tersebut. Hal ini berguna untuk validasi dan efisiensi penyimpanan.</p>
          <br/>
          <h3>Tipe Data yang Paling Sering Digunakan:</h3>
          <ul>
            <li><strong>INT / INTEGER:</strong> Untuk menyimpan angka bulat tanpa desimal (misal: 100, -50, 2024). Cocok untuk umur, jumlah stok, dll.</li>
            <li><strong>VARCHAR(n):</strong> Singkatan dari Variable Character. Untuk menyimpan teks dengan panjang maksimal <em>n</em> karakter. (misal: VARCHAR(50) untuk Nama).</li>
            <li><strong>TEXT:</strong> Untuk menyimpan teks yang sangat panjang (misal: deskripsi produk, artikel blog).</li>
            <li><strong>DATE:</strong> Untuk menyimpan tanggal dengan format YYYY-MM-DD (misal: '2024-12-31').</li>
            <li><strong>BOOLEAN / TINYINT(1):</strong> Untuk menyimpan nilai benar (1/TRUE) atau salah (0/FALSE).</li>
          </ul>
        `,
        quiz: [
          {
            question: "Tipe data apa yang paling efisien dan tepat untuk menyimpan nomor identitas atau nama lengkap seseorang?",
            options: [
              "INT",
              "DATE",
              "VARCHAR",
              "BOOLEAN"
            ],
            answerIndex: 2,
            explanation: "VARCHAR adalah tipe data yang paling tepat untuk teks dengan panjang terbatas seperti nama lengkap atau nomor identitas (KTP) yang mungkin mengandung huruf/karakter khusus atau angka awalan nol yang tidak boleh hilang."
          }
        ],
        practice: ""
      }
    ]
  },
  {
    id: 'db2',
    title: 'DDL (Data Definition Language)',
    completedSubMateri: 0,
    totalSubMateri: 2,
    lessons: [
      {
        id: 'dbl3',
        title: 'Membuat dan Menghapus Tabel (CREATE, DROP)',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>DDL: Mengatur Struktur Database</h2>
          <p>Data Definition Language (DDL) adalah perintah SQL yang berhubungan dengan struktur tabel, seperti membuat, merombak, dan menghapus tabel, bukan datanya.</p>
          <br/>
          <h3>Membuat Tabel Baru (CREATE TABLE)</h3>
          <p>Gunakan perintah <code>CREATE TABLE nama_tabel (kolom1 tipe_data, kolom2 tipe_data);</code></p>
          <pre><code>CREATE TABLE users (
  id INT,
  nama VARCHAR(100),
  umur INT
);</code></pre>
          <br/>
          <h3>Menghapus Tabel (DROP TABLE)</h3>
          <p><strong>HATI-HATI:</strong> Perintah ini akan menghapus tabel beserta seluruh data di dalamnya secara permanen.</p>
          <pre><code>DROP TABLE users;</code></pre>
        `,
        quiz: [
          {
            question: "Perintah apa yang digunakan untuk menghapus sebuah tabel secara keseluruhan beserta strukturnya?",
            options: [
              "DELETE TABLE nama_tabel",
              "REMOVE TABLE nama_tabel",
              "DROP TABLE nama_tabel",
              "CLEAR TABLE nama_tabel"
            ],
            answerIndex: 2,
            explanation: "DROP TABLE adalah perintah DDL yang digunakan untuk memusnahkan struktur tabel dan semua data di dalamnya dari database."
          }
        ],
        practice: "-- Tuliskan query SQL untuk membuat tabel bernama 'products' dengan 2 kolom: 'id' tipe INT dan 'name' tipe VARCHAR(50)"
      },
      {
        id: 'dbl4',
        title: 'Modifikasi Struktur Tabel (ALTER)',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Mengubah Struktur Tabel yang Sudah Ada</h2>
          <p>Bagaimana jika kita sudah terlanjur membuat tabel <code>users</code> tapi lupa menambahkan kolom <code>email</code>? Kita tidak perlu DROP tabelnya dan kehilangan data. Kita bisa memodifikasinya dengan <strong>ALTER TABLE</strong>.</p>
          <br/>
          <h3>Menambahkan Kolom Baru</h3>
          <pre><code>ALTER TABLE users ADD COLUMN email VARCHAR(150);</code></pre>
          <br/>
          <h3>Menghapus Kolom</h3>
          <pre><code>ALTER TABLE users DROP COLUMN umur;</code></pre>
        `,
        quiz: [
          {
            question: "Keyword apa yang dikombinasikan dengan ALTER TABLE untuk menyisipkan kolom baru ke dalam tabel?",
            options: [
              "INSERT COLUMN",
              "ADD COLUMN",
              "NEW COLUMN",
              "CREATE COLUMN"
            ],
            answerIndex: 1,
            explanation: "Sintaks yang benar adalah ALTER TABLE nama_tabel ADD COLUMN nama_kolom tipe_data."
          }
        ],
        practice: "-- Tabel 'students' telah ada. Tuliskan query untuk menambahkan kolom 'address' bertipe VARCHAR(200) ke tabel tersebut."
      }
    ]
  },
  {
    id: 'db3',
    title: 'DML (Data Manipulation Language)',
    completedSubMateri: 0,
    totalSubMateri: 3,
    lessons: [
      {
        id: 'dbl5',
        title: 'Menambahkan Data (INSERT)',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Mengisi Data ke dalam Tabel</h2>
          <p>DML berfokus pada isi atau <em>record</em> di dalam tabel. Untuk memasukkan data (baris baru), kita menggunakan perintah <strong>INSERT INTO</strong>.</p>
          <br/>
          <h3>Menyisipkan Baris Data</h3>
          <p>Anda harus menyebutkan nama tabel, lalu nama kolom dalam kurung, lalu <code>VALUES</code> beserta nilainya.</p>
          <pre><code>INSERT INTO users (id, nama, email)
VALUES (1, 'Andi', 'andi@mail.com');</code></pre>
          <p>Nilai string dan date harus diapit tanda kutip tunggal (<code>'...'</code>), sedangkan angka (INT) tidak perlu.</p>
        `,
        quiz: [
          {
            question: "Bagian manakah yang menghubungkan nama-nama kolom dengan data yang akan dimasukkan pada statement INSERT?",
            options: [
              "INTO",
              "DATA",
              "VALUES",
              "SET"
            ],
            answerIndex: 2,
            explanation: "Kata kunci VALUES digunakan untuk mendefinisikan nilai aktual yang akan disisipkan ke dalam kolom yang bersesuaian."
          }
        ],
        practice: "-- Tulis query untuk memasukkan data ke tabel 'products' (kolom: id, name, price) dengan nilai: 1, 'Laptop', 5000000."
      },
      {
        id: 'dbl6',
        title: 'Membaca Data Dasar (SELECT)',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Mengambil Data dari Database</h2>
          <p>Perintah <strong>SELECT</strong> adalah query yang paling sering dieksekusi di seluruh dunia SQL. Ia digunakan untuk membaca, melihat, atau menarik data dari tabel tanpa merubah datanya.</p>
          <br/>
          <h3>Membaca Seluruh Kolom</h3>
          <p>Gunakan simbol asterisk/bintang (<code>*</code>) untuk mengatakan "Pilih semua kolom".</p>
          <pre><code>SELECT * FROM users;</code></pre>
          <br/>
          <h3>Membaca Kolom Tertentu Saja</h3>
          <p>Jika tabel memiliki puluhan kolom dan Anda hanya butuh 'nama', panggil nama kolomnya (lebih efisien secara performa).</p>
          <pre><code>SELECT nama, email FROM users;</code></pre>
        `,
        quiz: [
          {
            question: "Apa arti simbol bintang (*) pada perintah SELECT * FROM tabel?",
            options: [
              "Menghapus semua data tabel",
              "Menampilkan semua baris/record",
              "Menampilkan semua kolom yang ada di dalam tabel tersebut",
              "Mengambil data penting saja"
            ],
            answerIndex: 2,
            explanation: "Simbol asterisk (*) adalah wildcard yang berarti 'Pilih seluruh kolom (fields)' yang ada dalam struktur tabel."
          }
        ],
        practice: "-- Tuliskan query untuk membaca hanya kolom 'name' dan 'price' dari tabel 'products'."
      },
      {
        id: 'dbl7',
        title: 'Memperbarui dan Menghapus Data (UPDATE, DELETE)',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Mengubah dan Membuang Data</h2>
          <p>Seringkali data yang tersimpan butuh diperbarui, seperti nama pengguna yang typo, atau menghapus akun lama.</p>
          <br/>
          <h3>Memperbarui Data (UPDATE)</h3>
          <p><strong>PENTING:</strong> Selalu gunakan <code>WHERE</code> agar Anda tidak ter-update seluruh baris di tabel!</p>
          <pre><code>UPDATE users 
SET nama = 'Andi Santoso' 
WHERE id = 1;</code></pre>
          <br/>
          <h3>Menghapus Baris Data (DELETE)</h3>
          <p>Seperti UPDATE, DELETE tanpa klausa WHERE akan menghapus <strong>seluruh isi data</strong> di tabel tersebut.</p>
          <pre><code>DELETE FROM users WHERE id = 1;</code></pre>
        `,
        quiz: [
          {
            question: "Apa yang akan terjadi jika kita menjalankan perintah: UPDATE users SET email = 'test@mail.com';",
            options: [
              "Akan terjadi Error Syntax",
              "Akan mengubah satu baris data paling atas menjadi test@mail.com",
              "Akan mengubah email seluruh user (seluruh baris) di dalam tabel menjadi test@mail.com",
              "Tidak ada yang berubah"
            ],
            answerIndex: 2,
            explanation: "Tanpa klausa WHERE untuk membatasi target spesifik, operasi UPDATE dan DELETE akan memengaruhi seluruh record (baris) yang ada di dalam tabel. Ini adalah bencana yang sering terjadi!"
          }
        ],
        practice: "-- Tuliskan query untuk merubah 'price' menjadi 6000000 pada tabel 'products' yang memiliki 'id' 1."
      }
    ]
  },
  {
    id: 'db4',
    title: 'Query Lanjutan & Filtering',
    completedSubMateri: 0,
    totalSubMateri: 3,
    lessons: [
      {
        id: 'dbl8',
        title: 'Kondisi Spesifik (WHERE, AND, OR)',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Menyaring Data Sesuai Kebutuhan</h2>
          <p>Jika kita memiliki jutaan data pengguna, kita tidak akan melakukan <code>SELECT *</code> karena akan membuat aplikasi mati (hang). Kita gunakan <strong>WHERE</strong> untuk filter.</p>
          <br/>
          <h3>Operator Kondisi</h3>
          <p>Anda bisa menggunakan operator perbandingan: <code>=</code>, <code>!=</code>, <code>></code>, <code><</code>, <code>>=</code>, <code><=</code>.</p>
          <br/>
          <h3>Menggabungkan Kondisi (AND & OR)</h3>
          <pre><code>-- Mengambil user berumur di atas 18 DAN tinggal di Jakarta
SELECT * FROM users WHERE umur > 18 AND kota = 'Jakarta';

-- Mengambil user berumur di atas 18 ATAU tinggal di Bandung
SELECT * FROM users WHERE umur > 18 OR kota = 'Bandung';</code></pre>
        `,
        quiz: [
          {
            question: "Klausa apa yang digunakan untuk mengatur kondisi (filtering) baris mana saja yang ingin ditarik dari database?",
            options: [
              "FILTER",
              "WHERE",
              "CONDITION",
              "IF"
            ],
            answerIndex: 1,
            explanation: "Klausa WHERE digunakan di dalam operasi SELECT, UPDATE, maupun DELETE untuk memfilter record mana saja yang memenuhi kondisi kriteria yang kita tentukan."
          }
        ],
        practice: "-- Tuliskan query untuk membaca semua data dari 'products' yang memiliki 'price' lebih besar dari 100000."
      },
      {
        id: 'dbl9',
        title: 'Pencarian Pola (LIKE, IN)',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Pencarian Lebih Fleksibel</h2>
          <p>Terkadang kita tidak tahu ejaan pasti atau ingin mencari kumpulan nilai sekaligus.</p>
          <br/>
          <h3>LIKE: Mencari kemiripan teks</h3>
          <p>Gunakan wildcard <code>%</code> (mewakili 0 atau banyak karakter sembarang).</p>
          <ul>
            <li><code>LIKE 'A%'</code> (Dimulai dengan A. Contoh: Andi, Anton)</li>
            <li><code>LIKE '%A'</code> (Diakhiri dengan A. Contoh: Bima, Cita)</li>
            <li><code>LIKE '%A%'</code> (Mengandung huruf A di manapun. Pencarian umum).</li>
          </ul>
          <pre><code>SELECT * FROM users WHERE nama LIKE '%Budi%';</code></pre>
          <br/>
          <h3>IN: Memilih dari Kumpulan Nilai</h3>
          <p>Gunakan IN untuk menghindari penulisan OR berulang-ulang.</p>
          <pre><code>-- Daripada WHERE kota='Bandung' OR kota='Jakarta' OR kota='Bali'
SELECT * FROM users WHERE kota IN ('Bandung', 'Jakarta', 'Bali');</code></pre>
        `,
        quiz: [
          {
            question: "Jika kita ingin mencari user yang email-nya berakhiran '@gmail.com', operator mana yang paling tepat digunakan?",
            options: [
              "email = '@gmail.com'",
              "email LIKE '%@gmail.com'",
              "email IN ('@gmail.com')",
              "email LIKE '@gmail.com%'"
            ],
            answerIndex: 1,
            explanation: "Pola '%@gmail.com' berarti bisa ada string apapun (%) di bagian depan, lalu harus diakhiri dengan secara spesifik '@gmail.com'."
          }
        ],
        practice: "-- Tuliskan query untuk membaca seluruh data dari 'products' yang nama-nya (name) mengandung kata 'Phone'."
      },
      {
        id: 'dbl10',
        title: 'Pengurutan & Pembatasan (ORDER BY, LIMIT)',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Mengurutkan dan Membatasi Hasil</h2>
          <p>Pernah melihat fitur urutkan "Harga Termahal ke Termurah" atau fitur halaman (Pagination)? Itu dibuat dengan SQL.</p>
          <br/>
          <h3>ORDER BY (Mengurutkan Data)</h3>
          <p>Bisa mengurutkan naik <strong>(ASC / Ascending)</strong> atau turun <strong>(DESC / Descending)</strong>.</p>
          <pre><code>-- Mengurutkan harga dari mahal ke murah (Turun)
SELECT * FROM products ORDER BY price DESC;</code></pre>
          <br/>
          <h3>LIMIT (Membatasi Data)</h3>
          <p>Biasanya dipakai untuk fitur 'Top 5' atau Pagination agar tidak meload jutaan data sekaligus.</p>
          <pre><code>-- Mengambil 3 produk termahal
SELECT * FROM products ORDER BY price DESC LIMIT 3;</code></pre>
        `,
        quiz: [
          {
            question: "Kata kunci apa yang digunakan pada ORDER BY untuk mengurutkan baris dari nilai Terkecil (A) ke Terbesar (Z)?",
            options: [
              "DESC",
              "ASC",
              "UP",
              "LOW"
            ],
            answerIndex: 1,
            explanation: "ASC (Ascending) adalah default dari ORDER BY. Ia mengurutkan dari kecil ke besar (1-100) atau abjad A ke Z."
          }
        ],
        practice: "-- Tuliskan query untuk membaca 5 'products' dengan 'price' termurah (diurutkan mengecil)."
      }
    ]
  },
  {
    id: 'db5',
    title: 'Agregasi & Relasi',
    completedSubMateri: 0,
    totalSubMateri: 5,
    lessons: [
      {
        id: 'dbl11',
        title: 'Fungsi Agregasi (COUNT, SUM, AVG)',
        isCompleted: false,
        type: 'code',
        isPremium: true,
        costCredit: 5,
        explanation: `
          <h2>Menghitung Statistik Data Secara Langsung</h2>
          <p>Database sangat cepat untuk melakukan kalkulasi matematis atas suatu kumpulan data, tanpa harus menarik datanya dulu ke dalam aplikasi backend.</p>
          <br/>
          <h3>Fungsi Agregasi Bawaan:</h3>
          <ul>
            <li><strong>COUNT(kolom):</strong> Menghitung jumlah total baris/record.</li>
            <li><strong>SUM(kolom):</strong> Menjumlahkan seluruh angka di sebuah kolom.</li>
            <li><strong>AVG(kolom):</strong> Mencari rata-rata angka di sebuah kolom.</li>
            <li><strong>MAX / MIN:</strong> Mencari angka terbesar atau terkecil.</li>
          </ul>
          <br/>
          <pre><code>-- Menghitung total pendaftar
SELECT COUNT(id) AS total_users FROM users;

-- Menghitung rata-rata gaji
SELECT AVG(salary) FROM employees;</code></pre>
          <p><em>(Catatan: Gunakan kata <code>AS nama_baru</code> untuk memberikan Alias pada nama kolom hasil query)</em></p>
        `,
        quiz: [
          {
            question: "Fungsi agregasi apa yang cocok digunakan untuk mengetahui total omset penjualan dalam satu bulan?",
            options: [
              "COUNT()",
              "MAX()",
              "SUM()",
              "AVG()"
            ],
            answerIndex: 2,
            explanation: "SUM() digunakan untuk menjumlahkan isi nilai angka secara total (misalnya jumlah pendapatan), sementara COUNT() hanya menghitung ada berapa jumlah transaksinya."
          }
        ],
        practice: "-- Tuliskan query untuk menghitung total jumlah stok seluruh barang. (Asumsi nama tabel: 'products', nama kolom: 'stock_quantity'). Gunakan fungsi SUM()."
      },
      {
        id: 'dbl12',
        title: 'Pengelompokan Data (GROUP BY, HAVING)',
        isCompleted: false,
        type: 'code',
        isPremium: true,
        costCredit: 5,
        explanation: `
          <h2>Menganalisis Data per Kategori</h2>
          <p>Bagaimana jika kita ingin tahu berapa banyak pendaftar <strong>DI SETIAP KOTA</strong>? Kita tidak mungkin query satu per satu per kota. Kita bisa menggunakan <strong>GROUP BY</strong> untuk mengelompokkannya bersama fungsi agregasi.</p>
          <br/>
          <pre><code>SELECT kota, COUNT(id) as total_penduduk 
FROM users 
GROUP BY kota;</code></pre>
          <p>Query di atas akan menumpuk baris yang nilai 'kota' nya sama menjadi satu, dan menjalankan COUNT untuk setiap kelompok kota tersebut.</p>
          <br/>
          <h3>Filtering Grup (HAVING)</h3>
          <p>Klausa WHERE tidak bisa digunakan untuk memfilter hasil Fungsi Agregasi. Kita harus menggunakan <strong>HAVING</strong>.</p>
          <pre><code>-- Cari kota yang memiliki LELBIH DARI 100 penduduk
SELECT kota, COUNT(id) FROM users 
GROUP BY kota 
HAVING COUNT(id) > 100;</code></pre>
        `,
        quiz: [
          {
            question: "Apa perbedaan paling mendasar antara WHERE dan HAVING?",
            options: [
              "WHERE digunakan sebelum data dikelompokkan, HAVING digunakan setelah data dikelompokkan oleh GROUP BY.",
              "WHERE digunakan untuk angka, HAVING untuk teks.",
              "WHERE hanya untuk operasi DELETE, HAVING untuk SELECT.",
              "Tidak ada perbedaan, keduanya memiliki fungsi dan performa yang sama."
            ],
            answerIndex: 0,
            explanation: "WHERE menyeleksi baris data mentah sebelum digabungkan. HAVING menyeleksi grup-grup data yang sudah terbentuk dari hasil GROUP BY dan Fungsi Agregasinya."
          }
        ],
        practice: "-- Tulis query untuk menghitung jumlah barang per 'category' dari tabel 'products'. (Tampilkan category dan COUNT(id))."
      },
      {
        id: 'dbl13',
        title: 'Pengenalan Primary Key & Foreign Key',
        isCompleted: false,
        type: 'text',
        isPremium: true,
        costCredit: 5,
        explanation: `
          <h2>Aturan Relasi: Menghubungkan Tabel</h2>
          <p>Database relasional yang sesungguhnya berarti kita bisa memecah data ke tabel berbeda dan saling menautkannya untuk menghindari redudansi (duplikasi) data.</p>
          <br/>
          <h3>1. Primary Key (Kunci Utama)</h3>
          <p>Setiap tabel <strong>harus memiliki satu kolom</strong> yang nilainya unik untuk setiap baris dan tidak boleh kosong (NULL). Ini bertindak sebagai identitas (seperti No. KTP bagi manusia). Biasanya dinamakan <code>id</code>.</p>
          <br/>
          <h3>2. Foreign Key (Kunci Tamu)</h3>
          <p>Kolom di suatu tabel yang isinya merujuk (meminjam) nilai dari Primary Key tabel lain. Ini menciptakan ikatan di antara keduanya.</p>
          <br/>
          <p>Contoh: Tabel <code>transactions</code> memiliki kolom <code>user_id</code>. Kolom <code>user_id</code> ini adalah Foreign Key yang merujuk pada kolom <code>id</code> di tabel <code>users</code>. Kita tahu transaksi X dilakukan oleh Budi dari ikatan ID ini.</p>
        `,
        quiz: [
          {
            question: "Apa syarat wajib agar sebuah kolom dapat dijadikan Primary Key?",
            options: [
              "Tipenya harus VARCHAR dan berisi nama",
              "Harus tersembunyi dari user",
              "Harus memiliki nilai yang Unik dan Tidak Boleh Kosong (Not Null)",
              "Boleh duplikat asalkan tipe datanya Integer"
            ],
            answerIndex: 2,
            explanation: "Primary Key memastikan integritas setiap baris data sehingga setiap baris dapat diidentifikasi secara presisi tanpa ambigu. Karenanya ia harus Unik dan wajib terisi."
          }
        ],
        practice: ""
      },
      {
        id: 'dbl14',
        title: 'Menggabungkan Tabel (INNER JOIN)',
        isCompleted: false,
        type: 'code',
        isPremium: true,
        costCredit: 5,
        explanation: `
          <h2>Membaca Data dari Multi-Tabel Sekaligus</h2>
          <p>Jika kita punya <code>user_id</code> di tabel <code>transactions</code>, melihat angka 1 atau 5 di laporan tidak berguna bagi manusia. Kita butuh melihat NAMA user-nya. Untuk itu kita menggunakan klausa <strong>JOIN</strong>.</p>
          <br/>
          <h3>INNER JOIN</h3>
          <p>INNER JOIN akan mengambil data dari kedua tabel <strong>hanya jika</strong> ada kecocokan di kunci relasinya. Jika transaksi A tidak punya user_id, ia tidak akan ditampilkan.</p>
          <br/>
          <pre><code>SELECT transactions.amount, users.nama 
FROM transactions
INNER JOIN users ON transactions.user_id = users.id;</code></pre>
          <p>Perhatikan sintaks <code>ON tabel1.kunci = tabel2.kunci</code>. Itulah cara kita memberi tahu SQL bagaimana kedua tabel tersebut terhubung!</p>
        `,
        quiz: [
          {
            question: "Di dalam statement JOIN, keyword apa yang digunakan untuk menentukan kolom mana yang menjadi titik temu (relasi) antar kedua tabel?",
            options: [
              "MATCH",
              "ON",
              "WHERE",
              "CONNECT"
            ],
            answerIndex: 1,
            explanation: "Klausa ON secara eksplisit mengkondisikan ikatan antar baris di tabel A dan tabel B (misal: ON A.user_id = B.id)."
          }
        ],
        practice: "-- Tuliskan query untuk melakukan SELECT * dari tabel 'orders', kemudian di INNER JOIN dengan tabel 'customers' ON orders.customer_id = customers.id."
      },
      {
        id: 'dbl15',
        title: 'Menggabungkan Tabel Lanjutan (LEFT JOIN)',
        isCompleted: false,
        type: 'code',
        isPremium: true,
        costCredit: 10,
        explanation: `
          <h2>LEFT JOIN: Menarik Semua Data Tabel Utama</h2>
          <p>Ada kasus di mana Anda ingin mencetak "Daftar Semua User dan Jumlah Transaksinya", termasuk user yang <strong>belum pernah melakukan transaksi sekalipun</strong>.</p>
          <br/>
          <p>Jika pakai INNER JOIN, user tanpa transaksi tidak akan muncul (karena tidak ada kecocokan). Solusinya adalah <strong>LEFT JOIN</strong>.</p>
          <br/>
          <pre><code>SELECT users.nama, transactions.amount 
FROM users
LEFT JOIN transactions ON users.id = transactions.user_id;</code></pre>
          <p><strong>LEFT JOIN</strong> akan menampilkan <strong>SEMUA</strong> baris dari tabel kiri (<code>users</code>). Jika tidak ada kecocokan di tabel kanan (<code>transactions</code>), SQL akan mengisinya dengan <code>NULL</code> (kosong).</p>
        `,
        quiz: [
          {
            question: "Tabel A (kiri) memiliki 5 baris. Tabel B (kanan) memiliki 2 baris yang cocok dengan A. Berapa baris hasil query dengan LEFT JOIN dari A ke B?",
            options: [
              "2 baris",
              "7 baris",
              "5 baris",
              "Bergantung pada WHERE"
            ],
            answerIndex: 2,
            explanation: "LEFT JOIN menjamin SETIDAKNYA seluruh baris dari Tabel Kiri (A) akan ditampilkan (sebanyak 5 baris). Baris yang tidak punya pasangan di tabel B akan diisi dengan NULL."
          }
        ],
        practice: "-- Tuliskan query untuk melakukan LEFT JOIN dari tabel 'users' ke tabel 'posts' dengan relasi users.id = posts.author_id. Tampilkan kolom users.username dan posts.title."
      }
    ]
  }
];
