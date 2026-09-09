export const dasarPemrogramanChapters = [
  {
    id: 'c1',
    title: 'Pengenalan & Variabel',
    completedSubMateri: 0,
    totalSubMateri: 4,
    lessons: [
      {
        id: 'l1',
        title: 'Apa itu Pemrograman?',
        isCompleted: false,
        type: 'text',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Selamat Datang di Dunia Pemrograman!</h2>
          <p>Pemrograman pada dasarnya adalah cara kita <strong>berkomunikasi dengan komputer</strong>. Komputer adalah mesin yang sangat patuh, namun ia tidak memiliki inisiatif. Ia hanya akan melakukan apa yang diperintahkan kepadanya.</p>
          <br/>
          <p>Instruksi yang kita berikan kepada komputer disebut <strong>kode (code)</strong> atau sintaks. Layaknya manusia memiliki berbagai bahasa (Indonesia, Inggris, Mandarin), komputer juga memiliki berbagai "bahasa pemrograman" seperti Python, JavaScript, C++, dan Java.</p>
          <br/>
          <h3>Mengapa Kita Harus Belajar Pemrograman?</h3>
          <ul>
            <li><strong>Membangun Solusi:</strong> Anda dapat menciptakan aplikasi, website, dan game yang memecahkan masalah atau memberikan hiburan.</li>
            <li><strong>Otomatisasi:</strong> Biarkan komputer melakukan tugas-tugas berulang yang membosankan secara otomatis dan akurat.</li>
            <li><strong>Pola Pikir Logis:</strong> Pemrograman melatih Anda untuk berpikir terstruktur, memecah masalah besar menjadi bagian-bagian kecil yang dapat diselesaikan langkah demi langkah (Algoritma).</li>
          </ul>
        `,
        quiz: [
          {
            question: "Apa tujuan utama dari sebuah bahasa pemrograman?",
            options: [
              "Untuk merusak sistem operasi komputer",
              "Memberikan instruksi kepada komputer untuk melakukan tugas tertentu",
              "Menghias antarmuka pengguna agar lebih menarik",
              "Meningkatkan kecepatan jaringan internet"
            ],
            answerIndex: 1,
            explanation: "Bahasa pemrograman adalah perantara yang menerjemahkan instruksi logis manusia menjadi tindakan nyata yang dapat dijalankan oleh komputer."
          }
        ],
        practice: "Tantangan: \n1. Tuliskan kode untuk mencetak 'Halo Dunia Pemrograman!' menggunakan console.log(). \n2. Jalankan kode untuk melihat hasilnya di Console Output."
      },
      {
        id: 'l2',
        title: 'Mencetak Output (Console/Print)',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Mencetak Teks ke Layar</h2>
          <p>Langkah pertama dalam belajar pemrograman apa pun selalu sama: membuat komputer menampilkan pesan ke layar. Tradisi ini dikenal dengan sebutan <strong>"Hello, World!"</strong>.</p>
          <br/>
          <p>Untuk mencetak sesuatu ke layar, kita menggunakan perintah bawaan bahasa pemrograman tersebut. Di JavaScript, perintah yang digunakan adalah <code>console.log()</code>. Di Python, Anda akan menggunakan <code>print()</code>.</p>
          <br/>
          <h3>Contoh dalam JavaScript:</h3>
          <pre><code>console.log("Halo Dunia!");</code></pre>
          <p>Perhatikan bahwa teks yang ingin kita cetak harus diapit oleh <strong>tanda kutip</strong> (baik tunggal <code>'...'</code> maupun ganda <code>"..."</code>). Ini memberi tahu komputer bahwa yang di dalamnya adalah teks biasa, bukan sebuah perintah.</p>
        `,
        quiz: [
          {
            question: "Apa fungsi dari `console.log()` dalam JavaScript?",
            options: [
              "Untuk menghapus data di komputer",
              "Untuk mencetak output atau teks ke dalam console/layar",
              "Untuk membaca input dari pengguna",
              "Untuk menghentikan program yang sedang berjalan"
            ],
            answerIndex: 1,
            explanation: "console.log() adalah fungsi built-in JavaScript yang bertugas mencetak informasi ke terminal atau console developer."
          }
        ],
        practice: "Gunakan perintah `console.log()` untuk mencetak namamu sendiri ke dalam console. Contoh: `console.log('Budi');`"
      },
      {
        id: 'l3',
        title: 'Variabel dan Tipe Data Dasar (Integer, String)',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Variabel: Wadah Penyimpanan Data</h2>
          <p>Variabel ibarat sebuah <strong>kotak penyimpanan</strong> yang diberi label nama, di mana Anda bisa memasukkan suatu nilai ke dalamnya, dan membacanya kembali di kemudian hari.</p>
          <br/>
          <p>Dalam pemrograman, kita sering kali perlu menyimpan nilai seperti skor pemain, nama pengguna, atau status login. Di JavaScript, kita mendeklarasikan variabel dengan kata kunci <code>let</code> atau <code>const</code>.</p>
          <br/>
          <h3>Mengenal Tipe Data Dasar</h3>
          <p>Nilai yang disimpan di dalam variabel memiliki <strong>Tipe Data</strong>. Tiga tipe data yang paling sering digunakan adalah:</p>
          <ul>
            <li><strong>String (Teks)</strong>: Kumpulan karakter yang diapit tanda kutip. Contoh: <code>"Budi"</code>, <code>"Halo"</code></li>
            <li><strong>Number (Angka)</strong>: Bilangan bulat (Integer) atau desimal (Float). Tidak perlu tanda kutip. Contoh: <code>42</code>, <code>3.14</code></li>
            <li><strong>Boolean</strong>: Hanya memiliki dua nilai kebenaran, yaitu <code>true</code> (benar) atau <code>false</code> (salah).</li>
          </ul>
          <br/>
          <h3>Contoh Penggunaan:</h3>
          <pre><code>let namaPemain = "Alex";
let skor = 150;
let sudahLogin = true;

console.log(namaPemain); // Akan mencetak: Alex</code></pre>
        `,
        quiz: [
          {
            question: "Manakah penulisan variabel bertipe String (teks) yang benar?",
            options: [
              "let kota = Jakarta;",
              "let kota = 'Jakarta';",
              "let kota = 100;",
              "let kota = true;"
            ],
            answerIndex: 1,
            explanation: "String selalu diapit oleh tanda kutip, baik kutip tunggal ('') maupun kutip ganda (\"\"). Tanpa kutip, komputer akan mengira Jakarta adalah nama variabel lain."
          }
        ],
        practice: "1. Buatlah variabel bernama `kota` dan isi dengan string (teks) nama kotamu.\n2. Buatlah variabel bernama `umur` dan isi dengan number (angka) umurmu.\n3. Cetak kedua variabel tersebut menggunakan `console.log()`."
      },
      {
        id: 'l4',
        title: 'Operasi Matematika Dasar',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Komputer sebagai Kalkulator Raksasa</h2>
          <p>Komputer sangat hebat dalam menghitung. Kita dapat melakukan operasi matematika dasar menggunakan simbol-simbol operator aritmatika.</p>
          <br/>
          <h3>Operator Aritmatika Umum:</h3>
          <ul>
            <li><strong>+</strong> (Penjumlahan)</li>
            <li><strong>-</strong> (Pengurangan)</li>
            <li><strong>*</strong> (Perkalian)</li>
            <li><strong>/</strong> (Pembagian)</li>
            <li><strong>%</strong> (Modulus / Sisa Bagi): Menghitung sisa pembagian. Misalnya <code>10 % 3</code> bernilai 1.</li>
          </ul>
          <br/>
          <h3>Contoh Penggunaan:</h3>
          <pre><code>let hargaBarang = 50000;
let diskon = 10000;
let hargaAkhir = hargaBarang - diskon;

console.log(hargaAkhir); // Akan mencetak: 40000</code></pre>
          <p>Kita tidak hanya dapat menghitung angka mentah secara langsung, tetapi juga menghitung nilai yang ada di dalam variabel, seperti contoh di atas.</p>
        `,
        quiz: [
          {
            question: "Berapakah hasil dari 15 % 4 (15 modulus 4)?",
            options: [
              "3",
              "4",
              "1",
              "0"
            ],
            answerIndex: 0,
            explanation: "15 dibagi 4 adalah 3 dengan sisa 3. Modulus mengembalikan sisa baginya, yaitu 3."
          }
        ],
        practice: "Terdapat variabel `uang` bernilai 100000 dan variabel `harga` bernilai 25000. Buatlah variabel `kembalian` yang menghitung hasil pengurangan uang dengan harga. Lalu cetak `kembalian` tersebut."
      }
    ]
  },
  {
    id: 'c2',
    title: 'Logika & Perulangan',
    completedSubMateri: 0,
    totalSubMateri: 5,
    lessons: [
      {
        id: 'l5',
        title: 'Operator Relasional & Logika (AND, OR)',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Membandingkan Nilai</h2>
          <p>Dalam membuat program, kita sering harus mengambil keputusan berdasarkan kondisi. Untuk mengevaluasi kondisi, kita membandingkan nilai menggunakan <strong>Operator Relasional</strong>. Hasil perbandingannya selalu berupa nilai Boolean (<code>true</code> atau <code>false</code>).</p>
          <br/>
          <h3>Operator Relasional:</h3>
          <ul>
            <li><code>===</code> (Sama dengan, nilainya persis sama)</li>
            <li><code>!==</code> (Tidak sama dengan)</li>
            <li><code>&gt;</code> (Lebih besar dari)</li>
            <li><code>&lt;</code> (Lebih kecil dari)</li>
            <li><code>&gt;=</code> (Lebih besar sama dengan)</li>
            <li><code>&lt;=</code> (Lebih kecil sama dengan)</li>
          </ul>
          <br/>
          <h3>Operator Logika (AND / OR)</h3>
          <p>Digunakan untuk menggabungkan dua kondisi atau lebih:</p>
          <ul>
            <li><strong>AND ( <code>&&</code> )</strong>: Bernilai <code>true</code> HANYA JIKA kedua sisi bernilai <code>true</code>.</li>
            <li><strong>OR ( <code>||</code> )</strong>: Bernilai <code>true</code> JIKA SALAH SATU sisi bernilai <code>true</code>.</li>
          </ul>
          <br/>
          <pre><code>let nilai = 85;
let lulus = (nilai >= 75); // true

let tampan = true;
let kaya = false;
let pacarIdaman = tampan && kaya; // false, karena dia tidak kaya :(</code></pre>
        `,
        quiz: [
          {
            question: "Manakah dari ekspresi berikut yang menghasilkan nilai true?",
            options: [
              "(5 > 10) && (10 === 10)",
              "(8 >= 8) || (2 < 1)",
              "(4 !== 4)",
              "true && false"
            ],
            answerIndex: 1,
            explanation: "Operator OR (||) hanya butuh salah satu bernilai true. Karena 8 >= 8 bernilai true, maka keseluruhan ekspresi bernilai true, meskipun 2 < 1 bernilai false."
          }
        ],
        practice: "Disediakan variabel `skor = 90`. Buatlah variabel boolean `isLulus` yang bernilai `true` jika skor lebih dari atau sama dengan 80, dan cetak `isLulus`."
      },
      {
        id: 'l6',
        title: 'Percabangan If-Else',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Membuat Program yang Bisa Memilih</h2>
          <p>Pernyataan <code>if...else</code> memungkinkan program untuk mengeksekusi blok kode yang berbeda berdasarkan suatu kondisi.</p>
          <br/>
          <p>Ini adalah inti dari bagaimana kecerdasan buatan dan logika program bekerja: jika kondisi A terpenuhi, maka lakukan tindakan X. Jika tidak terpenuhi, lakukan tindakan Y.</p>
          <br/>
          <h3>Sintaks Dasar JavaScript:</h3>
          <pre><code>let poin = 100;

if (poin >= 100) {
  console.log("Selamat, Anda mendapatkan Badge Emas!");
} else {
  console.log("Kumpulkan poin lebih banyak lagi.");
}</code></pre>
          <p>Kode di dalam kurung kurawal <code>{ }</code> setelah <code>if</code> hanya akan berjalan jika kondisinya bernilai <code>true</code>.</p>
        `,
        quiz: [
          {
            question: "Jika variabel `umur = 15`, teks apa yang akan dicetak pada blok `if (umur >= 17) { console.log('Boleh Menyetir') } else { console.log('Belum Cukup Umur') }`?",
            options: [
              "Boleh Menyetir",
              "Belum Cukup Umur",
              "Akan terjadi error",
              "Tidak mencetak apapun"
            ],
            answerIndex: 1,
            explanation: "Karena 15 tidak lebih besar sama dengan 17, kondisi if bernilai false, sehingga blok else yang akan dieksekusi."
          }
        ],
        practice: "Buatlah logika if-else. Jika variabel `stok` lebih besar dari 0, cetak 'Barang Tersedia'. Jika tidak, cetak 'Barang Habis'. Gunakan asumsi nilai `stok` yang bebas."
      },
      {
        id: 'l7',
        title: 'Percabangan Kompleks (Else-If / Switch Case)',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Bagaimana Jika Ada Lebih dari Dua Pilihan?</h2>
          <p>Kita dapat merangkai banyak kondisi menggunakan <code>else if</code>. Program akan mengevaluasinya dari atas ke bawah secara berurutan, dan akan berhenti mengevaluasi begitu ia menemukan kondisi pertama yang bernilai <code>true</code>.</p>
          <br/>
          <h3>Contoh Else-If:</h3>
          <pre><code>let nilaiUjian = 75;

if (nilaiUjian >= 90) {
  console.log("Nilai A");
} else if (nilaiUjian >= 80) {
  console.log("Nilai B");
} else if (nilaiUjian >= 70) {
  console.log("Nilai C");
} else {
  console.log("Harus mengulang");
}</code></pre>
          <p>Pada contoh di atas, karena 75 tidak lebih dari 90 (F), ia turun ke kondisi kedua. Tidak lebih dari 80 (F), turun lagi ke ketiga. Karena 75 >= 70 adalah True, maka ia mencetak "Nilai C" dan keluar dari rantai pengecekan.</p>
        `,
        quiz: [
          {
            question: "Dari contoh kode di atas, jika `nilaiUjian = 85`, apa yang akan dicetak?",
            options: [
              "Nilai A",
              "Nilai B",
              "Nilai C",
              "Harus mengulang"
            ],
            answerIndex: 1,
            explanation: "85 tidak memicu kondisi >= 90, tetapi memicu kondisi >= 80, sehingga mencetak 'Nilai B'."
          }
        ],
        practice: "Buatlah pengecekan status umur: jika umur < 12 cetak 'Anak', jika umur < 20 cetak 'Remaja', selain itu cetak 'Dewasa'. Tentukan variabel umurmu sendiri."
      },
      {
        id: 'l8',
        title: 'Perulangan (For Loops)',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Melakukan Hal Berulang Secara Instan</h2>
          <p>Komputer sangat cepat dalam melakukan pekerjaan berulang tanpa merasa bosan. <strong>Perulangan (Looping)</strong> memungkinkan kita untuk menjalankan sebuah blok kode berkali-kali.</p>
          <br/>
          <p>Perulangan yang paling umum digunakan adalah <code>for</code> loop. Sintaksnya membutuhkan tiga bagian: inisialisasi, kondisi batas, dan iterasi (penambahan).</p>
          <br/>
          <h3>Contoh Menghitung 1 sampai 5:</h3>
          <pre><code>for (let i = 1; i <= 5; i++) {
  console.log("Menghitung: " + i);
}</code></pre>
          <ul>
            <li><code>let i = 1</code>: Mulai penghitungan dari angka 1.</li>
            <li><code>i &lt;= 5</code>: Perulangan terus berjalan selama <code>i</code> bernilai kurang dari atau sama dengan 5.</li>
            <li><code>i++</code>: Tambahkan nilai <code>i</code> sebanyak 1 setiap kali selesai satu putaran.</li>
          </ul>
        `,
        quiz: [
          {
            question: "Berapa kali teks akan dicetak pada loop `for (let i = 0; i < 3; i++)`?",
            options: [
              "0 kali",
              "2 kali",
              "3 kali",
              "4 kali"
            ],
            answerIndex: 2,
            explanation: "Loop akan berjalan untuk nilai i = 0, i = 1, dan i = 2. Ketika i = 3, kondisi `3 < 3` bernilai false sehingga loop berhenti. Totalnya adalah 3 putaran."
          }
        ],
        practice: "Gunakan for loop untuk mencetak kata 'Belajar Coding' sebanyak 5 kali."
      },
      {
        id: 'l9',
        title: 'Perulangan (While Loops) & Break/Continue',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Perulangan Tanpa Batas Iterasi yang Jelas</h2>
          <p>Berbeda dengan <code>for</code> yang biasanya memiliki jumlah putaran yang pasti, <code>while</code> loop sangat cocok jika Anda ingin mengulang selama kondisi tertentu bernilai benar, dan Anda mungkin tidak tahu berapa persis jumlah putarannya (misalnya: menunggu player game mati).</p>
          <br/>
          <h3>Contoh While Loop:</h3>
          <pre><code>let hpMonster = 30;

while (hpMonster > 0) {
  console.log("Pukul monster!");
  hpMonster -= 10; // Mengurangi HP sebanyak 10 per pukulan
}
console.log("Monster kalah!");</code></pre>
          <br/>
          <h3>Break & Continue</h3>
          <ul>
            <li><strong>break</strong>: Berfungsi untuk menghentikan perulangan secara paksa kapan saja, meskipun kondisinya masih true.</li>
            <li><strong>continue</strong>: Melewati putaran saat ini secara paksa dan langsung meloncat ke putaran berikutnya.</li>
          </ul>
        `,
        quiz: [
          {
            question: "Apa yang terjadi jika variabel pengubah di dalam while loop lupa ditambahkan (misal HP monster tidak pernah dikurangi)?",
            options: [
              "Program akan langsung berhenti",
              "Akan terjadi Infinite Loop (Perulangan tak berujung yang bisa membuat program crash)",
              "Loop hanya berjalan satu kali",
              "Komputer akan merestart otomatis"
            ],
            answerIndex: 1,
            explanation: "Jika kondisi dalam while selalu bernilai true selamanya, program akan terus berputar di tempat yang sama tanpa henti, atau dikenal sebagai Infinite Loop."
          }
        ],
        practice: "Buatlah while loop dengan inisialisasi `let x = 0`. Putar selama `x < 3`, dan di dalam loop cetak nilai x, kemudian jangan lupa lakukan `x++`."
      }
    ]
  },
  {
    id: 'c3',
    title: 'Fungsi & Array',
    completedSubMateri: 0,
    totalSubMateri: 4,
    lessons: [
      {
        id: 'l10',
        title: 'Mengenal Fungsi (Function)',
        isCompleted: false,
        type: 'text',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Membungkus Kode agar Bisa Digunakan Kembali</h2>
          <p>Seiring bertambah besarnya program, Anda tidak ingin menulis kode yang sama berulang kali. <strong>Fungsi (Function)</strong> adalah sebuah blok kode mandiri yang dirancang untuk menjalankan tugas khusus.</p>
          <br/>
          <p>Fungsi bertindak seperti cetakan: Anda mendefinisikannya sekali, lalu memanggilnya sebanyak yang Anda butuhkan di mana pun di dalam program.</p>
          <br/>
          <h3>Sintaks Pembuatan Fungsi:</h3>
          <pre><code>function sapaPengguna() {
  console.log("Halo, selamat datang di aplikasi kami!");
}

// Memanggil fungsi
sapaPengguna();
sapaPengguna();</code></pre>
          <p>Dengan menulis kode di dalam fungsi, kode menjadi jauh lebih rapi, terstruktur, dan mudah dirawat.</p>
        `,
        quiz: [
          {
            question: "Bagaimana cara mengeksekusi / memanggil fungsi bernama `hitungSkor` yang telah dibuat?",
            options: [
              "function hitungSkor()",
              "hitungSkor;",
              "hitungSkor();",
              "call hitungSkor"
            ],
            answerIndex: 2,
            explanation: "Untuk mengeksekusi (memanggil) sebuah fungsi dalam JavaScript, kita harus menambahkan sepasang kurung () setelah nama fungsinya."
          }
        ],
        practice: ""
      },
      {
        id: 'l11',
        title: 'Parameter dan Return Value',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Memasukkan Bahan dan Menerima Hasil (Input & Output)</h2>
          <p>Fungsi akan jauh lebih hebat jika mereka bisa menerima masukan dari luar yang bersifat dinamis. Input ini disebut sebagai <strong>Parameter</strong> atau Argumen.</p>
          <br/>
          <p>Selain menerima input, fungsi dapat menghitung sesuatu dan mengembalikan nilainya kembali kepada program yang memanggilnya menggunakan kata kunci <strong>return</strong>.</p>
          <br/>
          <h3>Contoh Kalkulator Luas Persegi:</h3>
          <pre><code>function hitungLuas(panjang, lebar) {
  let luas = panjang * lebar;
  return luas;
}

let luasKamar = hitungLuas(4, 3);
console.log(luasKamar); // Mencetak 12</code></pre>
          <p>Begitu program membaca kata <code>return</code>, eksekusi di dalam fungsi tersebut langsung berhenti, dan nilai dikeluarkan.</p>
        `,
        quiz: [
          {
            question: "Dalam kode `function kali(a, b) { return a * b; }`, manakah yang merupakan parameter?",
            options: [
              "kali",
              "a dan b",
              "return",
              "function"
            ],
            answerIndex: 1,
            explanation: "a dan b adalah variabel khusus (parameter) yang disiapkan di dalam kurung fungsi untuk menampung data masukan saat fungsi dipanggil."
          }
        ],
        practice: "Buat sebuah fungsi `tambah(a, b)` yang me-return hasil penjumlahan a dan b. Kemudian cetak hasilnya dengan `console.log(tambah(5, 10))`."
      },
      {
        id: 'l12',
        title: 'Struktur Data: Array / List',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Menyimpan Daftar Data dalam Satu Variabel</h2>
          <p>Jika Anda memiliki 100 nama siswa, akan sangat melelahkan membuat 100 variabel (nama1, nama2, nama3...). <strong>Array</strong> (atau List di Python) memecahkan masalah ini dengan memungkinkan kita menyimpan daftar nilai berjejeran dalam satu wadah kotak.</p>
          <br/>
          <h3>Sintaks Dasar:</h3>
          <p>Array dideklarasikan dengan menggunakan kurung siku <code>[ ]</code>.</p>
          <pre><code>let buah = ["Apel", "Jeruk", "Mangga", "Pisang"];</code></pre>
          <br/>
          <h3>Mengakses Elemen Array (Indexing)</h3>
          <p>Untuk mengambil nilai di dalam array, kita menggunakan urutan indeksnya. <strong>SANGAT PENTING: Index dalam pemrograman selalu dimulai dari angka 0, bukan 1!</strong></p>
          <pre><code>console.log(buah[0]); // Mencetak "Apel"
console.log(buah[2]); // Mencetak "Mangga"</code></pre>
        `,
        quiz: [
          {
            question: "Jika `let hero = ['Gatotkaca', 'Lancelot', 'Nana']`, bagaimana cara mengakses nilai 'Lancelot'?",
            options: [
              "hero[2]",
              "hero[1]",
              "hero[0]",
              "hero['Lancelot']"
            ],
            answerIndex: 1,
            explanation: "Karena array dimulai dari indeks 0, maka Gatotkaca adalah 0, Lancelot adalah 1, dan Nana adalah 2."
          }
        ],
        practice: "Buatlah array `warna = ['Merah', 'Kuning', 'Hijau']`. Cetak elemen kedua dari array tersebut ('Kuning') menggunakan indeksnya."
      },
      {
        id: 'l13',
        title: 'Manipulasi Array Dasar (Push, Pop, Length)',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Menambah, Menghapus, dan Mengukur Array</h2>
          <p>Data di dalam Array bersifat dinamis. Anda bisa menyisipkan elemen baru, membuang elemen lama, dan menghitung total keseluruhan datanya.</p>
          <br/>
          <h3>Method Bawaan Array JavaScript:</h3>
          <ul>
            <li><strong>.push(nilai)</strong>: Menambahkan elemen baru ke posisi paling <strong>akhir</strong> array.</li>
            <li><strong>.pop()</strong>: Menghapus elemen paling <strong>akhir</strong> dari array.</li>
            <li><strong>.length</strong>: Properti yang menghitung jumlah total elemen (panjang) dari array.</li>
          </ul>
          <br/>
          <pre><code>let keranjang = ["Buku", "Pulpen"];

keranjang.push("Penghapus");
console.log(keranjang); // ["Buku", "Pulpen", "Penghapus"]
console.log(keranjang.length); // 3

keranjang.pop();
console.log(keranjang); // ["Buku", "Pulpen"]</code></pre>
        `,
        quiz: [
          {
            question: "Method array manakah yang digunakan untuk menghapus item paling belakang di dalam array JavaScript?",
            options: [
              ".push()",
              ".shift()",
              ".pop()",
              ".delete()"
            ],
            answerIndex: 2,
            explanation: ".pop() akan selalu mencopot elemen dengan indeks paling besar (terakhir) dari array dan mengubah array aslinya."
          }
        ],
        practice: "Disediakan `let hewan = ['Kucing', 'Anjing']`. Gunakan perintah `.push()` untuk menambahkan 'Burung' ke dalam array hewan tersebut, lalu cetak nilai hewan."
      }
    ]
  },
  {
    id: 'c4',
    title: 'Struktur Data & Algoritma Ringan (Ekspansi Wajib)',
    completedSubMateri: 0,
    totalSubMateri: 3,
    lessons: [
      {
        id: 'l14',
        title: 'Struktur Data: Object / Dictionary',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Membentuk Struktur Data yang Memiliki Atribut</h2>
          <p>Jika Array menyimpan data dalam bentuk urutan (urutan ke-0, urutan ke-1), <strong>Object</strong> (atau Dictionary di Python) menyimpan data dalam pasangan <strong>Kunci-Nilai (Key-Value)</strong>.</p>
          <br/>
          <p>Ini sangat cocok digunakan untuk merepresentasikan benda dunia nyata yang memiliki banyak sifat atau atribut.</p>
          <br/>
          <pre><code>let mobil = {
  merk: "Toyota",
  tahun: 2022,
  warna: "Hitam",
  sedangMenyala: false
};

// Mengakses data (Dot Notation)
console.log(mobil.merk); // Toyota
console.log(mobil.tahun); // 2022

// Mengubah data
mobil.sedangMenyala = true;</code></pre>
        `,
        quiz: [
          {
            question: "Pasangan elemen di dalam sebuah Object JavaScript disebut sebagai?",
            options: [
              "Index dan Item",
              "Key dan Value",
              "Parameter dan Argument",
              "Property dan Method"
            ],
            answerIndex: 1,
            explanation: "Setiap data dalam object selalu dipetakan antara 'Key' (nama atributnya) dan 'Value' (nilai datanya)."
          }
        ],
        practice: "Buatlah object `siswa` dengan properti `nama` (berisi string namamu) dan `nilai` (berisi angka). Kemudian cetak properti `nama` menggunakan dot notation."
      },
      {
        id: 'l15',
        title: 'Iterasi Data Kompleks (Looping di Array/Object)',
        isCompleted: false,
        type: 'code',
        isPremium: false,
        costCredit: 0,
        explanation: `
          <h2>Menggabungkan Kekuatan Loop dan Array/Object</h2>
          <p>Sinergi terbaik dalam pemrograman adalah memadukan struktur data (Array) dan struktur kontrol (Loop). Ini memungkinkan kita memproses ribuan data dengan hanya menggunakan 3 baris kode!</p>
          <br/>
          <h3>Membaca Isi Array dengan Loop</h3>
          <p>Kita dapat memanfaatkan properti <code>.length</code> sebagai batas perulangan.</p>
          <pre><code>let absensi = ["Andi", "Budi", "Citra", "Doni"];

for (let i = 0; i < absensi.length; i++) {
  console.log("Siswa hadir: " + absensi[i]);
}</code></pre>
          <p>Pada putaran pertama, <code>i</code> adalah 0, sehingga <code>absensi[i]</code> berarti <code>absensi[0]</code> ("Andi"). Putaran kedua <code>absensi[1]</code>, begitu seterusnya sampai panjang maksimal array.</p>
        `,
        quiz: [
          {
            question: "Mengapa kita menggunakan `i < array.length` alih-alih `i <= array.length` dalam for loop?",
            options: [
              "Karena JavaScript tidak mendukung simbol <=",
              "Karena indeks array terakhir bernilai panjang array dikurangi 1 (0-indexed)",
              "Agar tidak perlu menghitung angka terakhir",
              "Hanya sekadar kesepakatan umum developer"
            ],
            answerIndex: 1,
            explanation: "Panjang array berjumlah 4 item memiliki indeks akhir 3. Jika kita gunakan `<= 4`, loop akan mencoba mengakses array[4] yang bernilai undefined."
          }
        ],
        practice: "Buat sebuah loop yang mengelilingi elemen dalam array `data = [10, 20, 30]`. Di dalam loop, cetak elemen array tersebut."
      },
      {
        id: 'l16',
        title: 'Tantangan Akhir: Algoritma FizzBuzz atau Palindrome',
        isCompleted: false,
        type: 'code',
        isPremium: true,
        costCredit: 10,
        explanation: `
          <h2>Menguji Pemahaman Logika Penuh (Test Premium)</h2>
          <p>Selamat! Anda telah mempelajari seluruh komponen vital dalam dasar pemrograman: Variabel, If-Else, For Loop, Function, dan Array/Object. Saatnya menyatukan semuanya menjadi satu Algoritma Utuh.</p>
          <br/>
          <h3>Tantangan Paling Klasik di Dunia IT: FizzBuzz</h3>
          <p>Banyak wawancara kerja level Junior Programmer yang menguji pelamar dengan algoritma sederhana bernama <strong>FizzBuzz</strong>.</p>
          <br/>
          <p><strong>Aturan Main:</strong></p>
          <p>Buat program yang menghitung dari angka 1 sampai 15, dengan kondisi:</p>
          <ul>
            <li>Jika angka habis dibagi 3, cetak "Fizz"</li>
            <li>Jika angka habis dibagi 5, cetak "Buzz"</li>
            <li>Jika angka habis dibagi 3 DAN 5 (misal 15), cetak "FizzBuzz"</li>
            <li>Jika tidak memenuhi ketiganya, cetak angkanya secara langsung.</li>
          </ul>
        `,
        quiz: [
          {
            question: "Dalam tantangan FizzBuzz, bagaimana susunan if-else yang paling logis agar logika berjalan dengan benar?",
            options: [
              "Pengecekan (habis dibagi 3) harus diletakkan paling awal (pertama)",
              "Pengecekan (habis dibagi 5) harus diletakkan paling awal (pertama)",
              "Pengecekan (habis dibagi 3 dan 5) harus diletakkan paling awal (pertama)",
              "Urutan tidak masalah sama sekali"
            ],
            answerIndex: 2,
            explanation: "Jika kita meletakkan pengecekan habis dibagi 3 pertama kali, maka angka 15 akan langsung terdeteksi sebagai 'habis dibagi 3', mencetak 'Fizz' dan mengabaikan pengecekan 'FizzBuzz' yang berada di bawahnya. Logika paling spesifik/ketat harus dicek pertama kali."
          }
        ],
        practice: "Tuliskan kode for loop untuk angka 1 hingga 15. Di dalamnya letakkan if-else if statement untuk menuntaskan game FizzBuzz. Ingat gunakan operator Modulus (%)!"
      }
    ]
  }
];
