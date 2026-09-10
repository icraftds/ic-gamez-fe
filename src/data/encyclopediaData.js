export const encyclopediaData = [
  {
    section: "Struktur Data",
    topics: [
      {
        id: "hash-table",
        title: "Pengenalan Hash Table",
        category: "Data Structures",
        readTime: "5 min read",
        subtitle: "Struktur data dengan kompleksitas waktu pencarian O(1).",
        content: `
          <h2>Apa itu Hash Table?</h2>
          <p>
            Hash table (atau hash map) adalah struktur data yang mengimplementasikan tipe data abstrak array asosiatif, 
            struktur yang dapat memetakan kunci (keys) ke nilai (values).
          </p>
          <h2>Cara Kerja</h2>
          <p>
            Hash table menggunakan fungsi hash untuk menghitung indeks ke dalam array (disebut juga 
            buckets atau slots), dari mana nilai yang diinginkan dapat ditemukan. Idealnya, fungsi hash 
            akan menetapkan setiap kunci ke bucket yang unik, tetapi sebagian besar desain hash table 
            menggunakan fungsi hash yang tidak sempurna, yang dapat menyebabkan hash collision 
            (tabrakan hash).
          </p>
          <h3>Contoh Kode (Python)</h3>
          <div class="code-block">
            <div class="code-header">python</div>
            <pre><code># Inisialisasi hash map (dictionary di Python)
my_map = {}

# Menyisipkan nilai
my_map["apple"] = 100
my_map["banana"] = 200

# Mengakses nilai (O(1))
print(my_map["apple"]) # Output: 100</code></pre>
          </div>
          <div class="article-tip">
            <strong><i class="fa-solid fa-lightbulb"></i> Tip Interview:</strong> 
            Dalam wawancara coding (seperti soal Two Sum), menggunakan Hash Table/Map seringkali 
            menjadi solusi optimal untuk menurunkan Time Complexity dari O(N²) menjadi O(N).
          </div>
        `
      },
      {
        id: "linked-list",
        title: "Linked List Dasar",
        category: "Data Structures",
        readTime: "7 min read",
        subtitle: "Struktur data dinamis yang menyimpan elemen secara sekuensial melalui pointer.",
        content: `
          <h2>Apa itu Linked List?</h2>
          <p>Linked List adalah kumpulan elemen data (node) yang urutannya tidak ditentukan oleh penempatan fisiknya di memori. Sebaliknya, setiap elemen menunjuk ke elemen berikutnya secara eksplisit menggunakan pointer/referensi.</p>
          <h2>Kelebihan dan Kekurangan</h2>
          <p>Kelebihan utamanya adalah penambahan dan penghapusan elemen yang efisien (O(1) jika posisi diketahui), karena tidak perlu menggeser memori seperti pada Array. Kekurangannya adalah waktu pencarian elemen membutuhkan O(N) karena akses memori tidak acak (harus traversing dari head).</p>
          <h3>Struktur Node (JavaScript)</h3>
          <div class="code-block">
            <div class="code-header">javascript</div>
            <pre><code>class Node {
  constructor(data) {
    this.data = data;
    this.next = null; // Menunjuk ke node berikutnya
  }
}</code></pre>
          </div>
        `
      },
      {
        id: "stack-queue",
        title: "Memahami Stack & Queue",
        category: "Data Structures",
        readTime: "4 min read",
        subtitle: "Dua struktur data linier populer dengan prinsip LIFO dan FIFO.",
        content: `
          <h2>Stack (Tumpukan)</h2>
          <p>Stack beroperasi dengan prinsip <strong>LIFO (Last In First Out)</strong>. Elemen yang terakhir dimasukkan ke dalam stack akan menjadi yang pertama kali dikeluarkan. Analogi di dunia nyata adalah tumpukan piring; Anda mengambil piring dari atas tumpukan.</p>
          <p>Operasi utama: <code>push()</code> (memasukkan data) dan <code>pop()</code> (mengambil data).</p>
          
          <h2>Queue (Antrean)</h2>
          <p>Queue beroperasi dengan prinsip <strong>FIFO (First In First Out)</strong>. Elemen yang pertama kali masuk akan menjadi yang pertama kali keluar. Analogi dunia nyatanya adalah antrean di kasir supermarket.</p>
          <p>Operasi utama: <code>enqueue()</code> (memasukkan ke antrean) dan <code>dequeue()</code> (mengeluarkan dari antrean).</p>
        `
      },
      {
        id: "trees-graphs",
        title: "Trees & Graphs",
        category: "Data Structures",
        readTime: "8 min read",
        subtitle: "Struktur data hierarkis non-linier.",
        content: `
          <h2>Trees (Pohon)</h2>
          <p>Tree adalah struktur data hierarkis yang terdiri dari node-node yang dihubungkan oleh edge. Tree selalu memiliki tepat satu akar (root). Binary Search Tree (BST) adalah varian tree yang sangat efisien untuk pencarian.</p>
          <h2>Graphs (Graf)</h2>
          <p>Graph lebih umum daripada tree. Ini terdiri dari kumpulan titik (vertices/nodes) yang saling terhubung (edges). Graph bisa berarah (directed) atau tidak berarah (undirected), dan bisa memiliki siklus (cycles) yang tidak diperbolehkan dalam tree standar.</p>
        `
      }
    ]
  },
  {
    section: "Algoritma Dasar",
    topics: [
      {
        id: "binary-search",
        title: "Pencarian Biner (Binary Search)",
        category: "Algorithms",
        readTime: "6 min read",
        subtitle: "Mencari elemen dalam array terurut dengan kompleksitas sangat cepat O(log N).",
        content: `
          <h2>Konsep Dasar</h2>
          <p>Binary search mencari elemen dengan cara terus-menerus membagi dua rentang pencarian. Mulai dari seluruh array, kemudian separuhnya, dan seterusnya sampai nilai yang dicari ditemukan. Syarat mutlaknya adalah: <strong>data harus sudah dalam keadaan terurut</strong>.</p>
          <h3>Implementasi Iteratif (C++)</h3>
          <div class="code-block">
            <div class="code-header">cpp</div>
            <pre><code>int binarySearch(int arr[], int l, int r, int x) {
  while (l <= r) {
    int m = l + (r - l) / 2;
    // Cek apakah x ada di tengah
    if (arr[m] == x) return m;
    // Jika x lebih besar, abaikan belahan kiri
    if (arr[m] < x) l = m + 1;
    // Jika x lebih kecil, abaikan belahan kanan
    else r = m - 1;
  }
  return -1; // Tidak ditemukan
}</code></pre>
          </div>
        `
      },
      {
        id: "two-pointers",
        title: "Two Pointers Technique",
        category: "Algorithms",
        readTime: "5 min read",
        subtitle: "Teknik iterasi array menggunakan dua pointer secara bersamaan.",
        content: `
          <h2>Kegunaan</h2>
          <p>Two pointers digunakan untuk mengoptimasi pencarian yang biasanya membutuhkan loop bersarang O(N²), menjadi iterasi linear tunggal O(N). Teknik ini umumnya menggunakan satu pointer di awal array (kiri) dan satu pointer di akhir array (kanan), yang saling bergerak mendekati satu sama lain berdasar sebuah kondisi.</p>
          <div class="article-tip">
            <strong><i class="fa-solid fa-lightbulb"></i> Kapan digunakan?</strong> 
            Cocok untuk soal yang meminta pencarian sepasang bilangan pada array terurut yang jika dijumlahkan menghasilkan target tertentu (misal: soal Two Sum pada sorted array).
          </div>
        `
      },
      {
        id: "sliding-window",
        title: "Sliding Window",
        category: "Algorithms",
        readTime: "7 min read",
        subtitle: "Optimalisasi perhitungan subset rentang (subarray/substring).",
        content: `
          <h2>Apa itu Sliding Window?</h2>
          <p>Bayangkan sebuah "jendela" yang meluncur di atas array atau string dari kiri ke kanan. Jendela ini menyimpan ukuran tertentu atau kondisi tertentu. Teknik ini digunakan secara efektif untuk memecahkan soal array/string contiguous (bersebelahan).</p>
          <p>Ini mengubah dua loop bersarang (O(N²)) menjadi iterasi linier tunggal (O(N)).</p>
        `
      }
    ]
  },
  {
    section: "Algoritma Lanjut",
    topics: [
      {
        id: "dynamic-programming",
        title: "Dynamic Programming (DP)",
        category: "Advanced Algorithms",
        readTime: "10 min read",
        subtitle: "Menyelesaikan masalah besar dengan memecahnya menjadi sub-masalah dan menyimpan hasilnya.",
        content: `
          <h2>Konsep DP</h2>
          <p>Dynamic programming memecahkan masalah dengan menyimpan hasil dari sub-masalah yang saling tumpang tindih (overlapping subproblems) agar kita tidak perlu menghitung ulang hal yang sama (memoization/tabulation).</p>
          <h2>Karakteristik Utama</h2>
          <ul>
            <li><strong>Optimal Substructure:</strong> Solusi optimal dari masalah keseluruhan bisa dibentuk dari solusi optimal sub-masalahnya.</li>
            <li><strong>Overlapping Subproblems:</strong> Sub-masalah dievaluasi berkali-kali. DP menyimpannya ke dalam memori.</li>
          </ul>
        `
      },
      {
        id: "backtracking",
        title: "Backtracking",
        category: "Advanced Algorithms",
        readTime: "8 min read",
        subtitle: "Eksplorasi semua kemungkinan secara rekursif.",
        content: `
          <h2>Pendekatan Brute Force Cerdas</h2>
          <p>Backtracking mencoba membangun solusi secara inkremental, selangkah demi selangkah. Jika pada langkah tertentu kita menyadari bahwa kondisi yang terbentuk tidak mungkin mengarah pada solusi valid, algoritma akan "mundur" (backtrack) ke langkah sebelumnya dan mencoba jalur yang berbeda.</p>
        `
      },
      {
        id: "greedy",
        title: "Greedy Algorithms",
        category: "Advanced Algorithms",
        readTime: "5 min read",
        subtitle: "Memilih opsi optimal lokal dengan harapan mencapai optimal global.",
        content: `
          <h2>Prinsip Greedy</h2>
          <p>Algoritma greedy membangun solusi langkah demi langkah, selalu membuat pilihan yang terlihat paling menguntungkan (optimal) saat ini, tanpa mempedulikan konsekuensi di masa depan. Meskipun tidak selalu menghasilkan solusi terbaik untuk semua tipe masalah, namun sering memberikan solusi optimal pada kasus spesifik dengan sangat cepat.</p>
        `
      }
    ]
  }
]
