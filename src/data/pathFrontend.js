export const frontendChapters = [
  {
    id: 'fe1',
    title: 'Struktur Web Fundamental',
    completedSubMateri: 0,
    totalSubMateri: 3,
    lessons: [
      {
        id: 'fel1',
        title: 'Anatomi HTML Semantik',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Kerangka Dasar Sebuah Website</h2>
          <p>HTML (HyperText Markup Language) adalah kerangka tulang dari seluruh website di dunia internet. Tanpa HTML, browser tidak tahu bagaimana merender konten halaman web.</p>
          <br/>
          <h3>Struktur Semantik (Bermakna)</h3>
          <p>Di era web modern, kita tidak hanya menumpuk tag <code>&lt;div&gt;</code> secara acak. Kita menggunakan <strong>Semantic HTML</strong> agar mesin pencari (SEO Google) dan alat bantu baca (Screen Reader) paham bagian-bagian website.</p>
          <ul>
            <li><code>&lt;header&gt;</code>: Untuk menu navigasi atas.</li>
            <li><code>&lt;main&gt;</code>: Membungkus seluruh konten utama website.</li>
            <li><code>&lt;section&gt;</code>: Untuk membagi bab/bagian besar konten.</li>
            <li><code>&lt;article&gt;</code>: Untuk konten yang bisa berdiri sendiri (berita, post blog).</li>
            <li><code>&lt;footer&gt;</code>: Bagian paling bawah (hak cipta, link tambahan).</li>
          </ul>
        `,
        quiz: [
          {
            question: "Tag HTML mana yang paling semantik untuk digunakan membungkus menu navigasi utama sebuah situs web?",
            options: [
              "<nav>",
              "<div>",
              "<span>",
              "<menu>"
            ],
            answerIndex: 0,
            explanation: "Tag <nav> secara eksplisit memberitahu browser dan mesin pencari bahwa blok tersebut merupakan kumpulan tautan navigasi utama website."
          }
        ],
        practice: "<!-- Tulis tag <header> yang di dalamnya berisi sebuah tag <h1> dengan teks 'Website Saya' -->"
      },
      {
        id: 'fel2',
        title: 'Hyperlink dan Media',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Menautkan Dunia (Hyperlink)</h2>
          <p>Kata "HyperText" pada HTML merujuk pada kemampuannya untuk mengaitkan dokumen satu dengan yang lainnya menggunakan <strong>Tautan (Link)</strong>. Ini adalah inti dari "Web".</p>
          <br/>
          <h3>Tag Anchor &lt;a&gt;</h3>
          <p>Digunakan untuk membuat hyperlink. Wajib memiliki atribut <code>href</code> (Hypertext Reference) yang berisi URL tujuan.</p>
          <pre><code>&lt;a href="https://google.com" target="_blank"&gt;Pergi ke Google&lt;/a&gt;</code></pre>
          <p><em>(Catatan: <code>target="_blank"</code> membuat link terbuka di tab baru)</em></p>
          <br/>
          <h3>Tag Gambar &lt;img&gt;</h3>
          <p>Digunakan untuk menampilkan gambar. Tag ini tidak memiliki penutup (self-closing). Wajib memiliki <code>src</code> (Source) dan <code>alt</code> (Alternative Text).</p>
          <pre><code>&lt;img src="logo.png" alt="Logo Perusahaan" /&gt;</code></pre>
        `,
        quiz: [
          {
            question: "Apa fungsi utama dari atribut 'alt' pada tag <img>?",
            options: [
              "Mengatur ukuran gambar alternatif",
              "Menampilkan teks jika gambar gagal dimuat dan membantu mesin pencari (SEO)",
              "Memberikan efek animasi pada gambar",
              "Mengubah warna gambar"
            ],
            answerIndex: 1,
            explanation: "Teks 'alt' sangat krusial untuk aksesibilitas (Screen Reader akan membacanya untuk tunanetra) dan SEO."
          }
        ],
        practice: "<!-- Buat sebuah link (tag a) ke 'https://contoh.com' dengan teks tautan 'Klik Disini' -->"
      },
      {
        id: 'fel3',
        title: 'Form, Input, dan Validasi HTML',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Berinteraksi dengan Pengguna</h2>
          <p>Jika website ingin menerima data dari pengguna (seperti fitur Login, Register, atau Pencarian), website harus menyediakan <strong>Form</strong>.</p>
          <br/>
          <h3>Komponen Form Utama:</h3>
          <ul>
            <li><code>&lt;form&gt;</code>: Wadah penampung seluruh input data.</li>
            <li><code>&lt;input type="text"&gt;</code>: Kolom isian teks pendek.</li>
            <li><code>&lt;input type="password"&gt;</code>: Isian teks rahasia (disamarkan dengan bintang).</li>
            <li><code>&lt;input type="checkbox"&gt;</code>: Pilihan centang.</li>
            <li><code>&lt;button type="submit"&gt;</code>: Tombol untuk mengirim data ke server.</li>
          </ul>
          <br/>
          <h3>Validasi Bawaan HTML5</h3>
          <p>Anda bisa menambahkan atribut <code>required</code> agar form tidak bisa disubmit jika kosong, atau <code>type="email"</code> agar memaksa format penulisan ber-@.</p>
        `,
        quiz: [
          {
            question: "Tag mana yang digunakan bersama dengan tag <input> untuk memberikan label teks yang bisa diklik oleh pengguna?",
            options: [
              "<text>",
              "<title>",
              "<label>",
              "<desc>"
            ],
            answerIndex: 2,
            explanation: "Tag <label> digunakan untuk memberi judul pada sebuah <input>. Mengklik teks pada label akan otomatis menempatkan kursor pada kotak isian yang ditautkannya."
          }
        ],
        practice: "<!-- Buat tag <form> yang berisi sebuah <input type='text' placeholder='Nama' required> dan sebuah <button type='submit'>Kirim</button> -->"
      }
    ]
  },
  {
    id: 'fe2',
    title: 'Styling Modern (CSS)',
    completedSubMateri: 0,
    totalSubMateri: 4,
    lessons: [
      {
        id: 'fel4',
        title: 'Box Model & CSS Selectors',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Mengenal Aturan Kotak (Box Model)</h2>
          <p>Di CSS, <strong>SETIAP ELEMEN HTML ADALAH KOTAK (BOX)</strong>. Memahami Box Model adalah kunci utama untuk mengatur tata letak yang akurat.</p>
          <br/>
          <h3>4 Lapisan Box Model:</h3>
          <ol>
            <li><strong>Content:</strong> Isi asli dari kotak tersebut (gambar atau teks). Diatur oleh <code>width</code> dan <code>height</code>.</li>
            <li><strong>Padding:</strong> Jarak/Ruang bernapas di bagian <strong>DALAM</strong> antara konten dan batas (border).</li>
            <li><strong>Border:</strong> Garis batas kotak.</li>
            <li><strong>Margin:</strong> Jarak tolak-menolak di bagian <strong>LUAR</strong> batas dengan elemen lain.</li>
          </ol>
          <br/>
          <h3>CSS Selectors</h3>
          <p>Cara memilih kotak HTML mana yang mau dihias:</p>
          <ul>
            <li><strong>Class Selector (<code>.nama</code>)</strong>: Pemilih paling umum dan bisa digunakan berkali-kali. (contoh: <code>.btn</code>)</li>
            <li><strong>ID Selector (<code>#nama</code>)</strong>: Digunakan HANYA untuk satu elemen spesifik. (contoh: <code>#header</code>)</li>
            <li><strong>Tag Selector (<code>h1</code>)</strong>: Memilih semua tag h1 yang ada di halaman.</li>
          </ul>
        `,
        quiz: [
          {
            question: "Properti CSS mana yang digunakan untuk memperlebar jarak antara teks/konten dengan tepi garis (border) elemen tersebut?",
            options: [
              "margin",
              "padding",
              "spacing",
              "width"
            ],
            answerIndex: 1,
            explanation: "Padding mengatur ruang di dalam batas elemen, sehingga isi menjauh dari garis tepi. Margin mengatur jarak elemen tersebut dengan elemen tetangganya di luar."
          }
        ],
        practice: "/* Tulis class CSS bernama '.kotak' yang memiliki padding sebesar 20px dan margin sebesar 10px */"
      },
      {
        id: 'fel5',
        title: 'Tipografi & Warna',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Mempercantik Tampilan</h2>
          <p>Mengubah warna dan teks adalah hal pertama yang membuat website terlihat 'hidup'.</p>
          <br/>
          <h3>Tipografi:</h3>
          <ul>
            <li><code>font-family</code>: Mengatur jenis font (contoh: 'Arial', sans-serif).</li>
            <li><code>font-size</code>: Mengatur ukuran teks (contoh: 16px, 1.2rem).</li>
            <li><code>font-weight</code>: Mengatur ketebalan (contoh: bold, 700).</li>
            <li><code>line-height</code>: Mengatur jarak antar baris teks atas-bawah (spasi baris).</li>
          </ul>
          <br/>
          <h3>Warna:</h3>
          <ul>
            <li><code>color</code>: Mengatur warna teks.</li>
            <li><code>background-color</code>: Mengatur warna latar belakang kotak.</li>
          </ul>
          <p>Warna bisa ditulis dalam bentuk nama (<code>red</code>), kode Hex (<code>#FF0000</code>), atau RGB (<code>rgb(255,0,0)</code>).</p>
        `,
        quiz: [
          {
            question: "Properti mana yang benar untuk mengubah warna teks menjadi biru muda?",
            options: [
              "text-color: lightblue;",
              "color: lightblue;",
              "font-color: lightblue;",
              "bg-color: lightblue;"
            ],
            answerIndex: 1,
            explanation: "Di CSS, properti untuk mengubah warna isi teks hanya disebut dengan 'color'."
          }
        ],
        practice: "/* Buatlah sebuah selector untuk tag 'p' (paragraf) yang mengubah warnanya (color) menjadi '#333' dan font-size menjadi 18px */"
      },
      {
        id: 'fel6',
        title: 'Sistem Layout Modern: Flexbox',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Mengatur Penempatan Elemen dengan Mudah</h2>
          <p>Sebelum Flexbox lahir, programmer memposisikan elemen menggunakan Float yang sangat menyulitkan. <strong>Flexible Box (Flexbox)</strong> dirancang khusus untuk memposisikan barisan elemen secara sejajar (satu dimensi).</p>
          <br/>
          <h3>Sintaks Utama Flex Container:</h3>
          <p>Cukup pasang <code>display: flex;</code> pada wadah/parent, dan elemen anak-anaknya otomatis berjejer secara horizontal!</p>
          <br/>
          <ul>
            <li><code>justify-content</code>: Merapikan elemen di sumbu utama (kiri/tengah/kanan/menyebar secara horizontal).
              <br/><em>Contoh: <code>center</code>, <code>space-between</code></em></li>
            <li><code>align-items</code>: Merapikan elemen di sumbu silang (atas/tengah/bawah secara vertikal).
              <br/><em>Contoh: <code>center</code>, <code>flex-start</code></em></li>
            <li><code>flex-direction</code>: Bisa mengubah jejeran ke bawah (kolom) dengan <code>column</code>.</li>
          </ul>
        `,
        quiz: [
          {
            question: "Anda memiliki div container display flex. Bagaimana cara meletakkan semua isi anaknya tepat berada di tengah secara horizontal?",
            options: [
              "align-items: center;",
              "text-align: center;",
              "justify-content: center;",
              "margin: auto;"
            ],
            answerIndex: 2,
            explanation: "Pada Flexbox (dengan direction default yaitu baris/row), justify-content bekerja mengatur perataan horizontal."
          }
        ],
        practice: "/* Buatlah class '.nav-bar'. Set display-nya menjadi flex, lalu beri nilai justify-content menjadi 'space-between' */"
      },
      {
        id: 'fel7',
        title: 'Sistem Layout Modern: CSS Grid',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Sistem Papan Catur untuk Website</h2>
          <p>Jika Flexbox bagus untuk 1 dimensi (satu baris atau satu kolom sejajar), <strong>CSS Grid</strong> sangat sempurna untuk layout 2 Dimensi (baris dan kolom sekaligus, seperti struktur galeri atau dashboard).</p>
          <br/>
          <h3>Membuat Kotak-Kotak Grid</h3>
          <p>Berikan <code>display: grid;</code> pada wadah utama. Kemudian definisikan jumlah kolomnya.</p>
          <br/>
          <pre><code>.container {
  display: grid;
  /* Membuat 3 kolom dengan ukuran merata (1 Fraction) */
  grid-template-columns: 1fr 1fr 1fr;
  /* Jarak gap antar elemen grid */
  gap: 20px; 
}</code></pre>
          <p>Satuan khusus <code>fr</code> (fraction/pecahan) sangat dinamis. <code>1fr 2fr</code> berarti kolom kedua berukuran 2 kali lebih besar dari kolom pertama.</p>
        `,
        quiz: [
          {
            question: "Fungsi apakah 'gap' di dalam CSS Grid atau Flexbox?",
            options: [
              "Mengatur padding dalam elemen anak",
              "Membuat batas margin otomatis antar item saudara sehingga tidak menempel",
              "Menambahkan margin ke bagian luar parent container",
              "Menambahkan jeda baris HTML"
            ],
            answerIndex: 1,
            explanation: "Properti gap adalah cara paling modern dan efisien untuk memberikan jarak (spacing) di antara elemen-elemen grid/flex tanpa mempengaruhi elemen tepi terluarnya."
          }
        ],
        practice: "/* Buat class '.gallery'. Atur display sebagai grid, dan beri grid-template-columns sebanyak dua kolom merata (1fr 1fr) */"
      }
    ]
  },
  {
    id: 'fe3',
    title: 'Responsivitas Web',
    completedSubMateri: 0,
    totalSubMateri: 2,
    lessons: [
      {
        id: 'fel8',
        title: 'Konsep Mobile-First & Media Queries',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Membuat Website yang Bisa Menyesuaikan Diri</h2>
          <p>Website harus terlihat bagus, baik saat dibuka di Monitor Lebar maupun layar HP mungil. Kita menggunakan <strong>Media Queries</strong> untuk memicu kode CSS yang berbeda berdasarkan ukuran layar pengguna.</p>
          <br/>
          <h3>Sintaks Media Query</h3>
          <pre><code>/* Kode default untuk Mobile (Mobile-First) */
.kotak { width: 100%; }

/* Jika layar minimal selebar 768px (Tablet ke atas) */
@media (min-width: 768px) {
  .kotak {
    width: 50%;
  }
}</code></pre>
          <p>Paradigma <strong>Mobile-First</strong> sangat dianjurkan. Artinya, Anda menulis CSS dasar untuk HP terlebih dahulu, lalu menggunakan <code>@media (min-width: ...)</code> untuk menyesuaikan layout di layar yang lebih besar.</p>
        `,
        quiz: [
          {
            question: "Apa makna dari `@media (min-width: 1024px)` pada CSS?",
            options: [
              "Kode di dalamnya hanya berjalan jika layar kurang dari 1024px",
              "Kode di dalamnya akan berjalan pada layar berukuran 1024px atau LEBIH BESAR (seperti laptop monitor)",
              "Akan mengatur lebar elemen body ke 1024px mutlak",
              "Hanya berjalan di perangkat Apple"
            ],
            answerIndex: 1,
            explanation: "min-width bertindak sebagai 'pintu gerbang bawah'. Artinya, aturan CSS berlaku sejak lebar 1024px, 1025px, hingga lebar tak terhingga."
          }
        ],
        practice: "/* Tulis sebuah @media query untuk (min-width: 768px) dan di dalamnya ubah class '.menu' menjadi display: flex; */"
      },
      {
        id: 'fel9',
        title: 'Relative Units (REM, EM, VH, VW)',
        isCompleted: false,
        type: 'code',
        isPremium: true,
        costCredit: 5,
        explanation: `
          <h2>Tinggalkan Pixel (px), Beralih ke Skala Relatif</h2>
          <p>Satuan tetap seperti <code>px</code> (pixel) seringkali kurang fleksibel dan tidak ramah aksesibilitas. Programmer profesional lebih suka menggunakan satuan Relatif yang menyesuaikan skala layar otomatis.</p>
          <br/>
          <h3>Satuan Modern yang Populer:</h3>
          <ul>
            <li><strong>rem (Root Em):</strong> Skalanya bergantung pada font-size elemen paling akar (<code>&lt;html&gt;</code>). Jika default 16px, maka 2rem = 32px. Ini adalah best practice untuk ukuran teks!</li>
            <li><strong>% (Persen):</strong> Bergantung pada ukuran wadah parentnya.</li>
            <li><strong>vh (Viewport Height):</strong> Bergantung pada TINGGI Lensa/Layar browser. <code>100vh</code> = Selebar 100% tinggi layar saat ini.</li>
            <li><strong>vw (Viewport Width):</strong> Bergantung pada LEBAR Lensa/Layar browser.</li>
          </ul>
        `,
        quiz: [
          {
            question: "Jika ukuran default font browser adalah 16px, berapakah ukuran dari teks dengan font-size: 1.5rem?",
            options: [
              "15px",
              "24px",
              "32px",
              "1.5px"
            ],
            answerIndex: 1,
            explanation: "1.5 dikalikan 16px sama dengan 24px. Satuan REM dikalikan secara konstan dengan base html, sangat stabil untuk tata letak jarak dan ukuran huruf."
          }
        ],
        practice: "/* Atur tinggi .hero-banner menjadi '100vh' agar selalu sepenuh layar, berapa pun resolusi layar penggunanya! */"
      }
    ]
  },
  {
    id: 'fe4',
    title: 'DOM Manipulation (JavaScript)',
    completedSubMateri: 0,
    totalSubMateri: 3,
    lessons: [
      {
        id: 'fel10',
        title: 'Memilih Elemen (DOM Selection)',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Mengendalikan HTML Menggunakan JavaScript</h2>
          <p>JavaScript memungkinkan kita mengambil kendali atas struktur HTML di browser. Keseluruhan HTML di representasikan sebagai sebuah objek pohon raksasa bernama <strong>DOM (Document Object Model)</strong>.</p>
          <br/>
          <h3>querySelector</h3>
          <p>Ini adalah fungsi sakti. Ia mengambil pemilih CSS (CSS Selectors) persis seperti yang Anda gunakan di file CSS, dan mengembalikan elemen HTML ke dalam JavaScript.</p>
          <pre><code>// Mengambil elemen dengan ID "judul"
let teksH1 = document.querySelector("#judul");

// Mengubah isi tulisan di dalamnya
teksH1.innerText = "Teks Ini Diubah JS!";</code></pre>
          <p>Jika ada banyak elemen yang cocok (misalnya punya Class yang sama), <code>querySelector</code> hanya mengambil yang pertama. Jika butuh mengambil semuanya, gunakan <code>querySelectorAll</code>.</p>
        `,
        quiz: [
          {
            question: "Bagaimana perintah yang benar untuk mengambil sebuah elemen Button yang memiliki class bernama 'btn-login'?",
            options: [
              "document.querySelector('btn-login')",
              "document.querySelector('.btn-login')",
              "document.getElementById('btn-login')",
              "document.select('.btn-login')"
            ],
            answerIndex: 1,
            explanation: "Sama seperti di CSS, sebuah nama CLASS wajib diawali dengan titik (.). Jika ID diawali hash (#)."
          }
        ],
        practice: "// Gunakan document.querySelector() untuk memilih elemen ber-id 'message' dan ubah teks di dalamnya (innerText) menjadi 'Halo DOM!'"
      },
      {
        id: 'fel11',
        title: 'Event Listeners (Click, Input, Submit)',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Mendeteksi Aktivitas Pengguna</h2>
          <p>Website yang baik harus reaktif saat ditekan, digeser, diketik, atau disubmit. <strong>Event Listeners</strong> seperti "telinga" JavaScript yang selalu mendengarkan aksi yang terjadi di sebuah elemen HTML.</p>
          <br/>
          <h3>addEventListener()</h3>
          <p>Membutuhkan 2 hal: Jenis event ('click', 'submit', dll) dan Fungsi yang akan berjalan saat event terjadi.</p>
          <br/>
          <pre><code>let tombol = document.querySelector(".btn-simpan");

tombol.addEventListener("click", function() {
  alert("Data telah disimpan!");
});</code></pre>
          <p>Ini adalah fondasi bagaimana semua aplikasi web interaktif dibuat!</p>
        `,
        quiz: [
          {
            question: "Jenis Event apa yang cocok didengarkan jika Anda ingin merespon ketika seorang pengguna menekan tombol Enter pada sebuah elemen form utuh?",
            options: [
              "click",
              "hover",
              "submit",
              "enter"
            ],
            answerIndex: 2,
            explanation: "Event 'submit' dipicu saat form dikirim (baik dari menekan tombol bertipe submit, maupun dari enter keyboard di input area)."
          }
        ],
        practice: "// Tambahkan event listener 'click' pada sebuah variabel tombol (asumsikan variabel sudah ada bernama 'btnToggle'). Saat diklik cetak console.log('Toggled')"
      },
      {
        id: 'fel12',
        title: 'Memanipulasi Class & Styling secara Dinamis',
        isCompleted: false,
        type: 'code',
        isPremium: true,
        costCredit: 5,
        explanation: `
          <h2>Mengubah Tampilan dalam Sekejap Mata</h2>
          <p>Alih-alih menulis styling berulang-ulang dengan JS (seperti <code>elemen.style.backgroundColor = "red"</code>), best-practice industri adalah <strong>hanya memanipulasi Class Name</strong> dengan JavaScript, dan biarkan file CSS menangani animasinya.</p>
          <br/>
          <h3>ClassList API</h3>
          <ul>
            <li><code>elemen.classList.add("aktif")</code>: Menambahkan nama class baru.</li>
            <li><code>elemen.classList.remove("hilang")</code>: Menghapus nama class.</li>
            <li><code>elemen.classList.toggle("dark-mode")</code>: Fungsi ajaib! Jika classnya ada akan dihapus, jika classnya belum ada akan ditambahkan (Seperti saklar lampu).</li>
          </ul>
        `,
        quiz: [
          {
            question: "Jika kita memanggil `menu.classList.toggle('open')` secara berulang-ulang, apa efeknya pada elemen menu tersebut?",
            options: [
              "Class 'open' akan ditambahkan bertumpuk berkali-kali",
              "Class 'open' akan muncul dan hilang secara bergantian",
              "Menimbulkan error di JavaScript",
              "Mereset seluruh class pada elemen tersebut menjadi 'open' saja"
            ],
            answerIndex: 1,
            explanation: "Metode toggle() dirancang untuk bertindak sebagai tombol saklar on/off untuk satu kelas spesifik."
          }
        ],
        practice: "// Gunakan classList.add() pada sebuah variabel elemen bernama 'modal' untuk menambahkan class bernama 'show'"
      }
    ]
  },
  {
    id: 'fe5',
    title: 'Asynchronous Frontend',
    completedSubMateri: 0,
    totalSubMateri: 3,
    lessons: [
      {
        id: 'fel13',
        title: 'Pengenalan JSON & Konsep API',
        isCompleted: false,
        type: 'text',
        isPremium: true,
        costCredit: 5,
        explanation: `
          <h2>Bagaimana Aplikasi Modern Saling Berkomunikasi</h2>
          <p>Frontend (Web) dan Backend (Server/Database) adalah dua dunia yang terpisah. Untuk bisa mengirim dan menerima data, mereka bertukar pesan lewat <strong>API (Application Programming Interface)</strong>.</p>
          <br/>
          <h3>JSON (JavaScript Object Notation)</h3>
          <p>Jika API adalah kurir pos, maka surat di dalamnya harus ditulis menggunakan bahasa universal. Format JSON adalah standar industri untuk hal tersebut.</p>
          <p>JSON memiliki struktur identik dengan JavaScript Object, namun secara esensial adalah TEKS MURNI. Semua nama variabel (key) dalam JSON <strong>wajib</strong> diapit kutip ganda.</p>
          <pre><code>{
  "user": "Randi",
  "level": 99,
  "isPremium": true
}</code></pre>
        `,
        quiz: [
          {
            question: "Manakah pernyataan yang BENAR mengenai perbedaan JSON dengan Object JavaScript?",
            options: [
              "JSON hanya bisa menyimpan tipe data angka",
              "Key (kunci properti) pada JSON selalu harus dibungkus dengan tanda kutip ganda (Double Quotes)",
              "JSON bisa menyimpan fungsi (function/method) di dalamnya",
              "JSON tidak bisa melingkupi array"
            ],
            answerIndex: 1,
            explanation: "Aturan JSON sangat kaku (Strict). Key harus berupa string tanda kutip ganda, dan JSON hanya bisa menyimpan data murni, bukan fungsional (tidak bisa menampung fungsi)."
          }
        ],
        practice: ""
      },
      {
        id: 'fel14',
        title: 'Melakukan HTTP Request dengan Fetch API',
        isCompleted: false,
        type: 'code',
        isPremium: true,
        costCredit: 10,
        explanation: `
          <h2>Mengambil Data dari Internet via Kode</h2>
          <p>Saatnya mengambil data secara nyata dari server API. Browser modern menyediakan antarmuka <strong>fetch()</strong> secara native.</p>
          <br/>
          <h3>Asynchronous dengan async/await</h3>
          <p>Mengambil data dari internet membutuhkan waktu (beberapa milidetik atau detik). Program kita tidak boleh berhenti/membeku (hang) saat menunggunya.</p>
          <p>Kita menambahkan keyword <strong>async</strong> pada fungsi, dan memakai <strong>await</strong> saat memanggil Fetch API untuk "berhenti sejenak hingga data sampai, lalu lanjut ke baris berikutnya".</p>
          <br/>
          <pre><code>async function ambilDataCuaca() {
  // 1. Meminta data ke URL API server
  const response = await fetch("https://api.cuaca.com/jakarta");
  
  // 2. Mengubah teks respon server menjadi format JSON yg bisa dibaca
  const data = await response.json();
  
  console.log("Cuaca saat ini: ", data.suhu);
}</code></pre>
        `,
        quiz: [
          {
            question: "Mengapa kita membutuhkan fungsi `await response.json()` setelah melakukan fetching URL?",
            options: [
              "Untuk mengubah warna teks menjadi JSON",
              "Response fetch() hanyalah wadah amplop jaringan (HTTP Stream). json() berfungsi merobek dan mem-parsing isinya menjadi Objek Javascript yang bisa dipanggil propertinya",
              "Menyimpan data secara permanen di database lokal",
              "Karena nama variabelnya harus JSON"
            ],
            answerIndex: 1,
            explanation: "response dari fetch adalah objek Response mentah yang berisi header jaringan. Fungsi json() diperlukan untuk mengekstrak isi teks di body request menjadi objek sesungguhnya."
          }
        ],
        practice: "// Tuliskan sebaris kode: const response = await fetch('https://dummyjson.com/products');"
      },
      {
        id: 'fel15',
        title: 'Menampilkan Data API ke Antarmuka Web',
        isCompleted: false,
        type: 'code',
        isPremium: true,
        costCredit: 10,
        explanation: `
          <h2>Mewujudkan Aplikasi Data Dinamis</h2>
          <p>Setelah kita mendapatkan data Array of Object JSON dari API dengan <code>fetch()</code>, langkah selanjutnya adalah me-looping (iterasi) data tersebut dan menempelkannya ke DOM layar user.</p>
          <br/>
          <h3>Membangun HTML Dinamis</h3>
          <p>Anda bisa menggabungkan perulangan dengan <strong>Template Literals</strong> (menggunakan backtick <code>\`...\`</code>).</p>
          <pre><code>let outputHTML = "";
const listSiswa = [ {nama: "Andi"}, {nama: "Budi"} ]; // contoh data API

// Loop array datanya
for (let i = 0; i < listSiswa.length; i++) {
  outputHTML += \`&lt;li&gt;\${listSiswa[i].nama}&lt;/li&gt;\`;
}

// Render ke dalam DOM
document.querySelector("#ul-daftar").innerHTML = outputHTML;</code></pre>
          <p>Ini adalah prinsip yang sama yang dipakai kerangka kerja raksasa modern seperti Vue.js dan React, namun dieksekusi secara native murni!</p>
        `,
        quiz: [
          {
            question: "Properti apakah yang digunakan untuk mengganti atau menyisipkan HTML mentah ke dalam sebuah elemen target yang dipilih DOM?",
            options: [
              "innerText",
              "innerHTML",
              "insertAdjacentHTML",
              "textContent"
            ],
            answerIndex: 1,
            explanation: "innerHTML membaca string biasa (seperti '<li>Andi</li>') lalu merendernya secara harfiah menjadi struktur Tag Elemen HTML sungguhan di dalam browser, berbeda dengan innerText yang hanya menjadikannya teks pelan."
          }
        ],
        practice: "// Jika kamu punya data `const txt = 'Budi'`, susun sebuah string literal (backtick) dengan format: `<div>Halo ${txt}</div>`. Asign ke variabel let res."
      }
    ]
  }
];
