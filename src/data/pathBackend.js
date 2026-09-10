export const backendChapters = [
  {
    id: 'be1',
    title: 'Fundamental Server & Node.js',
    completedSubMateri: 0,
    totalSubMateri: 3,
    lessons: [
      {
        id: 'bel1',
        title: 'Arsitektur Client-Server & HTTP Protocol',
        isCompleted: false,
        type: 'text',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Bagaimana Internet Bekerja</h2>
          <p>Seluruh aplikasi modern berbasis arsitektur <strong>Client-Server</strong>.</p>
          <br/>
          <ul>
            <li><strong>Client:</strong> Pihak yang meminta data (Contoh: Browser Google Chrome Anda, atau Aplikasi Mobile di HP Anda).</li>
            <li><strong>Server:</strong> Komputer super yang online 24 jam nonstop untuk melayani permintaan data, memproses logika, dan menyimpan data di database.</li>
          </ul>
          <br/>
          <h3>Protokol HTTP (HyperText Transfer Protocol)</h3>
          <p>Saat Anda mengetik URL di browser dan menekan Enter, Anda sedang mengirimkan <strong>HTTP Request (Permintaan)</strong> ke Server. Server kemudian memprosesnya dan mengembalikan <strong>HTTP Response (Balasan)</strong>, yang dapat berupa file HTML, Gambar, atau teks JSON.</p>
        `,
        quiz: [
          {
            question: "Dalam arsitektur web modern, apa peran utama dari sebuah Server?",
            options: [
              "Menampilkan desain visual dan warna-warni langsung ke mata pengguna",
              "Mengklik tombol-tombol pada halaman web",
              "Menerima permintaan (Request), memproses logika sistem, dan mengembalikan respon data kepada Client",
              "Menyimpan cache riwayat pencarian pengguna di laptop mereka sendiri"
            ],
            answerIndex: 2,
            explanation: "Server bekerja di 'belakang layar' (Backend). Ia tidak peduli dengan bagaimana tampilan visual data, ia hanya memproses permintaan, mengecek izin, mengambil data di database, dan membalasnya dengan benar."
          }
        ],
        practice: ""
      },
      {
        id: 'bel2',
        title: 'Menjalankan Script via Node.js',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Membawa JavaScript Keluar dari Browser</h2>
          <p>Dahulu kala, bahasa JavaScript hanya bisa berjalan di dalam browser (untuk Frontend). Lalu datanglah <strong>Node.js</strong>.</p>
          <br/>
          <p>Node.js adalah sebuah Runtime Environment. Ia mencopot mesin pembaca JavaScript dari browser Google Chrome (bernama V8 Engine) dan menanamkannya langsung ke sistem operasi komputer/server Anda.</p>
          <br/>
          <p>Berkat Node.js, JavaScript kini bisa digunakan untuk membaca file komputer, mengontrol jaringan, berkomunikasi dengan database, dan membuat Backend Server berskala raksasa (seperti Netflix dan PayPal)!</p>
          <br/>
          <h3>Cara Menjalankan Script</h3>
          <pre><code>node aplikasi.js</code></pre>
          <p>Perintah di atas dijalankan melalui Terminal, yang akan mengeksekusi file <code>aplikasi.js</code> secara penuh.</p>
        `,
        quiz: [
          {
            question: "Apakah peran fundamental Node.js dalam dunia Backend Development?",
            options: [
              "Node.js adalah sebuah kerangka kerja (framework) frontend untuk membuat animasi DOM",
              "Node.js adalah lingkungan (Runtime) yang memungkinkan JavaScript dieksekusi langsung di sistem operasi (server), bukan hanya di browser",
              "Node.js adalah bahasa pemrograman baru penerus JavaScript",
              "Node.js adalah database NoSQL yang saingan dengan MongoDB"
            ],
            answerIndex: 1,
            explanation: "Node.js bukan framework dan bukan bahasa baru. Ia hanyalah sebuah 'wadah eksekusi' yang membuat JS bisa berfungsi seperti bahasa pemrograman backend sungguhan (seperti PHP, Java, atau Python)."
          }
        ],
        practice: "// Anggap Anda sedang menulis file 'app.js'. Cetaklah 'Hello dari Server' dengan console.log."
      },
      {
        id: 'bel3',
        title: 'Membuat HTTP Server Dasar',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Server Pertamamu</h2>
          <p>Node.js memiliki banyak modul bawaan, salah satunya adalah modul <code>http</code>. Modul ini memungkinkan kita 'membuka pintu' komputer kita agar bisa menerima Request HTTP dari komputer orang lain (Client).</p>
          <br/>
          <pre><code>// 1. Mengimpor modul http bawaan Node.js
const http = require('http');

// 2. Membuat server
const server = http.createServer((req, res) => {
  res.end('Halo! Ini balasan dari Server NodeJS pertama saya.');
});

// 3. Menghidupkan (Listen) server di port tertentu
server.listen(3000, () => {
  console.log('Server menyala dan menunggu request di port 3000');
});</code></pre>
        `,
        quiz: [
          {
            question: "Fungsi dari `server.listen(3000)` pada kode Node.js adalah?",
            options: [
              "Mematikan server setelah 3000 milidetik",
              "Membuka port 3000 pada komputer server dan menyiagakannya untuk terus mendengarkan/menunggu lalu lintas request dari client",
              "Mengambil 3000 baris data dari database",
              "Hanya sekedar aturan sintaks tanpa makna berarti"
            ],
            answerIndex: 1,
            explanation: "Proses 'listen' adalah yang membedakan skrip biasa (yang dijalankan lalu langsung selesai) dengan Program Server (yang dijalankan dan tetap hidup terus-menerus mendengarkan di 'pintu' nomor 3000)."
          }
        ],
        practice: "// Tulis deklarasi variabel standar untuk mengimpor modul http: const http = require('http');"
      }
    ]
  },
  {
    id: 'be2',
    title: 'Membangun Aplikasi dengan Express.js',
    completedSubMateri: 0,
    totalSubMateri: 2,
    lessons: [
      {
        id: 'bel4',
        title: 'Setup Express & Routing Dasar',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Framework Express.js</h2>
          <p>Menulis server dengan modul <code>http</code> mentah dari Node.js sangat melelahkan dan kodenya bisa menjadi ribet dengan cepat. Hampir seluruh industri beralih menggunakan framework <strong>Express.js</strong> untuk memudahkan hal tersebut.</p>
          <br/>
          <h3>Routing (Peta Jalan Server)</h3>
          <p>Routing menentukan bagaimana server membalas jika user mengakses URL/Path tertentu dengan metode tertentu.</p>
          <pre><code>const express = require('express');
const app = express();

// Rute: Metode GET pada alamat Utama '/'
app.get('/', (req, res) => {
  res.send('Halaman Beranda');
});

// Rute: Metode GET pada alamat '/about'
app.get('/about', (req, res) => {
  res.send('Ini adalah aplikasi buatan saya');
});

app.listen(8000);</code></pre>
        `,
        quiz: [
          {
            question: "Dalam Express, argumen `req` dan `res` di dalam callback function `app.get('/', (req, res))` mewakili apa?",
            options: [
              "require dan response",
              "request (Data yang diminta/dikirim Client) dan response (Alat untuk membalas ke Client)",
              "route dan result",
              "read dan readstream"
            ],
            answerIndex: 1,
            explanation: "Request (req) mewakili semua informasi masuk dari pengunjung. Response (res) berisi semua metode (seperti res.send atau res.json) untuk mengirim pesan keluar kembali ke pengunjung."
          }
        ],
        practice: "// Gunakan variabel app (Express) untuk membuat route method GET pada path '/users' yang melakukan callback res.send('List Users')"
      },
      {
        id: 'bel5',
        title: 'Menangkap Data dari Client (Params, Query, Body)',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Membaca Maksud Klien</h2>
          <p>Saat klien menghubungi server, klien seringkali mengirim data (seperti Form Login, Keyword Pencarian, atau ID Profil yang ingin dilihat). Server bisa menangkapnya lewat 3 jalur:</p>
          <br/>
          <h3>1. URL Params (req.params)</h3>
          <p>Digunakan untuk penanda unik di URL. Contoh URL: <code>/users/15</code></p>
          <pre><code>app.get('/users/:id', (req, res) => {
  res.send('Melihat profil pengguna ber-ID: ' + req.params.id); // Mencetak 15
});</code></pre>
          <br/>
          <h3>2. Query String (req.query)</h3>
          <p>Digunakan untuk parameter opsional seperti pencarian. Contoh URL: <code>/search?keyword=sepatu</code></p>
          <pre><code>console.log(req.query.keyword); // "sepatu"</code></pre>
          <br/>
          <h3>3. Request Body (req.body)</h3>
          <p>Digunakan untuk data yang berat dan sensitif (seperti formulir Register/Login) karena tidak terlihat di URL. Dikirim melalui metode POST.</p>
        `,
        quiz: [
          {
            question: "Jika user memanggil URL `/products/99`, dan server mendefinisikan route-nya sebagai `app.get('/products/:idBarang')`, objek manakah yang tepat untuk mendapatkan nilai '99' tersebut?",
            options: [
              "req.query.idBarang",
              "req.params.idBarang",
              "req.body.idBarang",
              "req.params.99"
            ],
            answerIndex: 1,
            explanation: "Karena ada titik dua ':' di URL rute definisi (/:idBarang), ia dideklarasikan sebagai parameter URL dinamis yang bisa diakses via req.params."
          }
        ],
        practice: "/* Buat endpoint app.get('/profil/:username', ...) dan di dalam callbacknya kembalikan/kirim tulisan req.params.username ke user (menggunakan res.send) */"
      }
    ]
  },
  {
    id: 'be3',
    title: 'Arsitektur REST API',
    completedSubMateri: 0,
    totalSubMateri: 3,
    lessons: [
      {
        id: 'bel6',
        title: 'Standarisasi RESTful API & Status Codes',
        isCompleted: false,
        type: 'text',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Komunikasi yang Standar (REST API)</h2>
          <p>REST API (Representational State Transfer) adalah gaya arsitektur yang disepakati secara global agar semua programmer menggunakan standar yang sama dalam menamai URL/Rute server mereka.</p>
          <br/>
          <p>Alih-alih membuat rute berantakan seperti <code>/ambil-buku-dong</code> atau <code>/hapusbuku-15</code>, REST API menyelaraskannya dengan kata kerja HTTP Method murni:</p>
          <ul>
            <li><strong>GET /books</strong>: Mengambil seluruh daftar buku</li>
            <li><strong>GET /books/:id</strong>: Mengambil detail satu buku tertentu</li>
            <li><strong>POST /books</strong>: Menyimpan data buku baru</li>
            <li><strong>PUT /books/:id</strong>: Memperbarui seluruh isi data satu buku</li>
            <li><strong>DELETE /books/:id</strong>: Menghapus satu buku</li>
          </ul>
          <br/>
          <h3>HTTP Status Codes</h3>
          <p>Server juga wajib memberi tahu status permintaan lewat kode angka 3 digit:</p>
          <ul>
            <li><strong>200 OK</strong>: Sukses</li>
            <li><strong>201 Created</strong>: Sukses Membuat Data Baru (setelah aksi POST)</li>
            <li><strong>400 Bad Request</strong>: Gagal, input user salah</li>
            <li><strong>401 Unauthorized</strong>: Gagal, belum Login</li>
            <li><strong>404 Not Found</strong>: Gagal, URL atau Data tidak ditemukan</li>
            <li><strong>500 Server Error</strong>: Gagal karena sistem backend crash</li>
          </ul>
        `,
        quiz: [
          {
            question: "Dalam konvensi standard REST API, HTTP Method apa yang harus digunakan jika Anda ingin membuat/menyisipkan data resource yang benar-benar baru ke dalam sistem?",
            options: [
              "GET",
              "POST",
              "PUT",
              "DELETE"
            ],
            answerIndex: 1,
            explanation: "POST adalah metode baku yang digunakan untuk memberitahu server untuk 'Menerima entitas baru yang ada dalam paket ini dan menyimpannya'."
          }
        ],
        practice: ""
      },
      {
        id: 'bel7',
        title: 'Membangun Endpoint CRUD (GET, POST, PUT, DELETE)',
        isCompleted: false,
        type: 'code',
        isPremium: true,
        costCredit: 5,
        explanation: `
          <h2>Membuat 4 Fungsi Esensial Semua Aplikasi</h2>
          <p>CRUD singkatan dari Create, Read, Update, Delete. Apapun aplikasinya, baik Tokopedia, Instagram, atau Gojek, 90% fitur aslinya hanyalah CRUD yang diolesi logika.</p>
          <br/>
          <h3>Contoh Membalas dengan JSON di Express</h3>
          <pre><code>// CREATE (POST)
app.post('/api/users', (req, res) => {
  const dataBaru = req.body;
  // ... simpan ke database ...
  
  res.status(201).json({
    pesan: "User sukses dibuat!",
    data: dataBaru
  });
});</code></pre>
          <p>Pada pengembangan Backend Modern (API-Driven), kita jarang menggunakan <code>res.send()</code> biasa. Kita menggunakan <strong><code>res.json()</code></strong> agar front-end menerima format JSON murni, dan merangkainya dengan <code>res.status()</code> untuk memberikan kode status HTTP yang benar.</p>
        `,
        quiz: [
          {
            question: "Perintah Express manakah yang mengirim respons berupa objek berformat JSON lengkap dengan Status HTTP Sukses (200)?",
            options: [
              "res.send(200, {status: 'ok'})",
              "res.status(200).json({status: 'ok'})",
              "req.json({status: 'ok'})",
              "res.formatJson(200)"
            ],
            answerIndex: 1,
            explanation: "Sintaks chaining pada Express adalah yang paling elegan. Kita mendefinisikan status (200) terlebih dahulu, baru mengirim objek/json di ekornya (.json())."
          }
        ],
        practice: "// Lengkapi sintaks ini: `res.status(404)._____({ error: 'Data tidak ditemukan' });` (Gunakan perintah json)"
      },
      {
        id: 'bel8',
        title: 'Implementasi Middleware Dasar',
        isCompleted: false,
        type: 'code',
        isPremium: true,
        costCredit: 5,
        explanation: `
          <h2>Gerbang Pengecekan Server (Middleware)</h2>
          <p><strong>Middleware</strong> adalah fungsi pengamanan yang mencegat setiap Request yang datang SEBELUM request tersebut mencapai fungsi Rute Utama.</p>
          <br/>
          <p>Bayangkan Middleware seperti Satpam Gedung. Saat Anda (Request) mau masuk menemui Bos (Route), Satpam akan mencegat Anda, mengecek KTP Anda (Autentikasi). Jika tidak punya KTP, Satpam menendang Anda keluar (401). Jika aman, Satpam membiarkan Anda lewat dengan memanggil perintah <strong><code>next()</code></strong>.</p>
          <br/>
          <h3>Contoh Middleware di Express</h3>
          <pre><code>// Definisi Middleware
const cekToken = (req, res, next) => {
  if (req.headers.token === 'rahasia123') {
    next(); // Lolos, silakan lanjut ke fungsi rute utama!
  } else {
    res.status(401).json({ pesan: 'Token salah, akses ditolak' }); // Ditendang!
  }
};

// Mengaplikasikan middleware ke rute secara spesifik
app.get('/data-rahasia', cekToken, (req, res) => {
  res.json({ pesan: "Ini adalah data bank rahasia." });
});</code></pre>
        `,
        quiz: [
          {
            question: "Bagaimana cara kerja dan apa parameter terpenting yang menandakan sebuah fungsi merupakan sebuah fungsi Middleware dalam Express?",
            options: [
              "Hanya menggunakan req dan res",
              "Menggunakan parameter ketiga bernama 'next' yang HARUS dipanggil jika ingin memberikan izin agar proses dilanjutkan",
              "Middleware adalah perintah untuk menghentikan server",
              "Menggunakan fungsi setTimeout"
            ],
            answerIndex: 1,
            explanation: "Parameter 'next' adalah kunci middleware. Jika next() tidak dieksekusi, Request akan menggantung (timeout) atau terhenti di middleware tersebut, dan Route Akhir tidak akan pernah terakses."
          }
        ],
        practice: "// Deklarasikan fungsi (req, res, next). Di dalamnya langsung panggil next();"
      }
    ]
  },
  {
    id: 'be4',
    title: 'Integrasi Database Relasional',
    completedSubMateri: 0,
    totalSubMateri: 3,
    lessons: [
      {
        id: 'bel9',
        title: 'Menghubungkan Node.js ke SQL Database',
        isCompleted: false,
        type: 'code',
        isPremium: true,
        costCredit: 5,
        explanation: `
          <h2>Backend Bertemu Database</h2>
          <p>Sebuah server Backend yang tidak bisa menyimpan data sifatnya percuma. Kita harus mengaitkan Backend kita dengan Aplikasi Database terpisah (seperti MySQL atau PostgreSQL).</p>
          <br/>
          <p>Di ekosistem Node.js, kita bisa mengunduh <em>Driver (Penghubung)</em> dari NPM, seperti <code>mysql2</code>.</p>
          <br/>
          <h3>Menjalin Koneksi (Connection String)</h3>
          <pre><code>const mysql = require('mysql2/promise');

// Membuat kolam koneksi (Connection Pool)
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'passwordrahasia',
  database: 'nama_aplikasi_db'
});</code></pre>
          <p>Koneksi ini ibarat "Kabel Telepon" dari aplikasi Express.js Anda, yang langsung tertancap ke Mesin Database. Anda akan menggunakan variabel <code>db</code> ini setiap kali ingin melakukan aktivitas ke database.</p>
        `,
        quiz: [
          {
            question: "Mengapa disarankan untuk menggunakan mekanisme 'Connection Pool' daripada sekadar membuat satu 'Connection' tunggal biasa ke database?",
            options: [
              "Agar tidak memakan memori CPU sama sekali",
              "Karena connection tunggal dilarang keras di Node.js",
              "Connection Pool menyiapkan beberapa koneksi aktif yang bisa dipakai dan dioper secara bergiliran untuk menangani lonjakan banyak user (Concurrency) secara efisien",
              "Hanya untuk memperpendek kode"
            ],
            answerIndex: 2,
            explanation: "Membuka dan menutup koneksi secara berulang untuk setiap pengunjung memakan waktu komputasi yang berat. Pool menyimpan beberapa koneksi yang selalu 'nyala' agar langsung bisa dipakai kapanpun secara instan."
          }
        ],
        practice: "// Tulis deklarasi variabel standar: const mysql = require('mysql2/promise');"
      },
      {
        id: 'bel10',
        title: 'Menulis Raw Query via Backend',
        isCompleted: false,
        type: 'code',
        isPremium: true,
        costCredit: 10,
        explanation: `
          <h2>Eksekusi Query dari Javascript</h2>
          <p>Begitu terkoneksi, kita bisa "menitipkan" kode bahasa SQL melalui perantara driver Node.js tersebut menggunakan metode <code>query()</code> secara asynchronous (membutuhkan await).</p>
          <br/>
          <h3>Bahaya SQL Injection (PENTING!)</h3>
          <p>Jangan <strong>PERNAH</strong> menempelkan data dari input user secara mentah ke dalam kalimat string SQL!</p>
          <pre><code>// ❌ CARA TERBURUK (RENTAN DIHACK!):
const hasil = await db.query("SELECT * FROM users WHERE nama = '" + req.body.nama + "'");</code></pre>
          <br/>
          <h3>Prepared Statements (Parameterized Query)</h3>
          <p>Selalu gunakan tanda tanya (<code>?</code>) sebagai pengganti aman. Driver database yang akan mensterilkannya (escaping).</p>
          <pre><code>// ✅ CARA AMAN & BENAR:
const [rows] = await db.query(
  "SELECT * FROM users WHERE nama = ?", 
  [req.body.nama]
);</code></pre>
        `,
        quiz: [
          {
            question: "Apa risiko utama jika Anda tidak menggunakan Parameterized Query (tanda ?) dan lebih memilih menyuntikkan (concatenate) data variabel langsung ke dalam kalimat string SQL?",
            options: [
              "Kode menjadi sangat kotor dan jelek",
              "Aplikasi rentan dibobol menggunakan teknik serangan SQL Injection yang dapat memusnahkan database secara fatal",
              "Menyebabkan server melambat",
              "Browser user akan menjadi hang"
            ],
            answerIndex: 1,
            explanation: "Seorang hacker bisa mengirimkan input yang sengaja disusun berisi string perintah SQL jahat (seperti 'OR 1=1; DROP TABLE users;'). Jika digabung ke perintah asli secara mentah, database akan menganggap itu instruksi legal dan mengeksekusinya."
          }
        ],
        practice: "// Buat eksekusi aman `db.query(\"SELECT * FROM id = ?\", [5]);` dan simpan hasilnya di variabel `const hasil = await ...`"
      },
      {
        id: 'bel11',
        title: 'Pengenalan ORM Dasar',
        isCompleted: false,
        type: 'text',
        isPremium: true,
        costCredit: 5,
        explanation: `
          <h2>Database Tanpa Repot Menulis SQL</h2>
          <p>Meski menulis Raw SQL (SQL Asli) via konektor bagus untuk performa dasar, hal tersebut sering memakan waktu, rawan salah tik (typo), dan susah dipelihara.</p>
          <br/>
          <p>Industri modern banyak memanfaatkan teknologi <strong>ORM (Object-Relational Mapping)</strong>. ORM adalah library sakti yang otomatis menerjemahkan sintaks Javascript/Objek Anda ke bahasa SQL yang rumit secara otomatis di balik layar!</p>
          <br/>
          <h3>Contoh Prisma ORM / Sequelize ORM</h3>
          <p>Tanpa ORM (Raw SQL):</p>
          <pre><code>const [user] = await db.query("SELECT * FROM users WHERE id = ? LIMIT 1", [5]);</code></pre>
          <br/>
          <p>Dengan ORM (Kode jauh lebih bernuansa Javascript!):</p>
          <pre><code>const user = await Prisma.User.findUnique({
  where: { id: 5 }
});</code></pre>
        `,
        quiz: [
          {
            question: "Kelebihan utama dari penggunaan teknologi ORM (Object Relational Mapping) di dalam aplikasi Node.js adalah?",
            options: [
              "Menjadikan database 1000x lebih cepat",
              "Menghapus perlunya sebuah database server sama sekali",
              "Memudahkan developer berinteraksi dengan database hanya dengan menggunakan manipulasi Objek dan Class bawaan bahasa pemrogramannya tanpa harus menulis perintah SQL mentah (Raw SQL)",
              "Otomatis memproteksi serangan virus Trojan"
            ],
            answerIndex: 2,
            explanation: "ORM seperti Sequelize atau Prisma membuat pemrograman database terasa sangat alami dan 'Javascript-banget', sambil membawa fitur ekstra seperti type-safety, migrasi otomatis, dan mencegah SQL Injection secara default."
          }
        ],
        practice: ""
      }
    ]
  },
  {
    id: 'be5',
    title: 'Keamanan & Autentikasi',
    completedSubMateri: 0,
    totalSubMateri: 2,
    lessons: [
      {
        id: 'bel12',
        title: 'Hashing Password dengan Bcrypt',
        isCompleted: false,
        type: 'code',
        isPremium: true,
        costCredit: 10,
        explanation: `
          <h2>Menyembunyikan Rahasia Pengguna</h2>
          <p>Saat membuat fitur Register Akun, jangan <strong>PERNAH</strong> menyimpan password asli (Clear Text) ke dalam database. Jika database bocor, nyawa jutaan password pengguna Anda terancam, dan ini berpotensi melanggar hukum perlindungan data.</p>
          <br/>
          <p>Password harus selalu <strong>di-Hashing</strong>. Hashing adalah teknik kriptografi searah untuk mengacak teks. Tidak seperti Enkripsi (yang bisa dikembalikan/Decrypt jika punya kunci), Hashing yang aman tidak dapat dikembalikan lagi menjadi teks asli.</p>
          <br/>
          <h3>Menggunakan Bcrypt.js</h3>
          <pre><code>const bcrypt = require('bcryptjs');

// Mengacak password sebelum disimpan ke database (Register)
const passwordAman = await bcrypt.hash('rahasia123', 10);
// Hasilnya akan seperti: $2a$10$wT8KzZ7n2...

// Mengecek password saat Login (Mencocokkan yg diketik user dgn yg di DB)
const isCocok = await bcrypt.compare('rahasia123', passwordAman);
// Jika cocok menghasilkan true</code></pre>
        `,
        quiz: [
          {
            question: "Mengapa algoritma Hashing (seperti Bcrypt) lebih disarankan untuk Password dibanding algoritma Enkripsi yang bisa di-decrypt bolak-balik?",
            options: [
              "Hashing jauh lebih ringan untuk server",
              "Enkripsi memerlukan lisensi berbayar",
              "Hashing bersifat Searah (One-way). Bahkan pembuat/admin server database tidak dapat melihat password asli dari hash yang tercatat. Ini meminimalisir penyalahgunaan akses oleh pihak internal maupun external apabila database bocor.",
              "Enkripsi tidak bisa dijalankan oleh Node.js"
            ],
            answerIndex: 2,
            explanation: "Keamanan terbaik adalah di mana Server bahkan tidak tahu secara pasti password Anda. Saat login, sistem hanya perlu mengubah password yang Anda ketik di layar menjadi Hash yang sama persis, dan membandingkannya (Comparing) secara membabi buta tanpa membongkarnya."
          }
        ],
        practice: "// Tuliskan kode untuk membuat hash dengan memanggil: await bcrypt.hash('pass123', 10);"
      },
      {
        id: 'bel13',
        title: 'Membuat dan Memvalidasi JSON Web Token (JWT)',
        isCompleted: false,
        type: 'code',
        isPremium: true,
        costCredit: 10,
        explanation: `
          <h2>Mengingat Siapa yang Telah Login</h2>
          <p>Protokol HTTP bersifat <strong>Stateless (Tidak Ingat)</strong>. Server tidak peduli apakah Anda sudah berhasil memasukkan username & password 1 detik yang lalu. Di request berikutnya, dia tetap menganggap Anda 'Orang Asing'.</p>
          <br/>
          <p>Untuk itu, setelah pengguna sukses Login, server harus memberikan sebuah "Kartu Akses Spesial". Klien harus selalu menyelipkan Kartu Akses ini setiap ia meminta data. Kartu Akses modern ini bernama <strong>JSON Web Token (JWT)</strong>.</p>
          <br/>
          <h3>1. Sign Token (Mencetak Kartu)</h3>
          <pre><code>const jwt = require('jsonwebtoken');

// Di-generate saat sukses Login.
const tokenAkses = jwt.sign(
  { id_user: 5, role: "admin" }, // Data publik yang disematkan (Payload)
  "KUNCI_RAHASIA_SERVER", // Segel rahasia (Signature Key)
  { expiresIn: '1h' } // Kadaluarsa
);</code></pre>
          <br/>
          <h3>2. Verify Token (Pemeriksaan di Middleware)</h3>
          <p>Saat user mengirim token kembali di request berikutnya, server memverifikasi 'Segel'-nya tidak dimanipulasi oleh hacker.</p>
          <pre><code>const valid = jwt.verify(token_dari_user, "KUNCI_RAHASIA_SERVER");</code></pre>
        `,
        quiz: [
          {
            question: "Karena Payload/Isi JWT (seperti {id_user: 5}) dapat dengan mudah dibaca dan di-decode secara publik (Base64), apa yang membuatnya tetap sangat aman digunakan untuk Autentikasi API?",
            options: [
              "Karena JWT bisa mengubah dirinya sendiri setiap 5 detik",
              "Karena data tersebut hanyalah ilusi optik",
              "Karena ada Signature di bagian akhir token yang dihasilkan dari enkripsi Payload dicampur KUNCI_RAHASIA_SERVER. Jika Hacker mencoba merubah {id_user: 5} menjadi {id_user: 1}, Signature-nya akan rusak dan Server (yang memegang Kunci asli) akan menolaknya",
              "Karena Frontend merahasiakan token tersebut"
            ],
            answerIndex: 2,
            explanation: "Kekuatan JWT ada pada Tanda Tangannya (Signature). Payload JWT boleh dibaca siapa saja, tapi JANGAN PERNAH meletakkan Password atau PIN di dalam Payload tersebut!"
          }
        ],
        practice: "// Lengkapi sintaks generate JWT berikut: `const token = jwt.sign({ id: 1 }, 'KUNCI');`"
      }
    ]
  }
];
