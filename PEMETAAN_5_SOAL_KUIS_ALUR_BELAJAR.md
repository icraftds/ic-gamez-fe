# Blueprint & Pemetaan Komprehensif 5 Soal Kuis per Modul
## Kurikulum Terintegrasi IC Game-Z (Edisi Standar Mutakhir 2026)

- **Dokumen:** Rencana Strategis & Pemetaan Soal Kuis Alur Belajar
- **Status:** Siap Audit Pengguna *(Ready for User Audit)*
- **Cakupan:** 12 Alur Belajar | 48 Bab | 1.307 Modul Pembelajaran | 6.535 Soal Kuis Unik
- **Target Eksekusi:** Menghapus 100% soal template/boilerplate dan menggantinya dengan soal kontekstual yang diekstrak langsung dari materi Markdown (`content_markdown`).

---

## 1. Ringkasan Eksekutif & Temuan Audit

Berdasarkan audit komparasi antara **database produksi (tabel `quizzes`)** dan **berkas kurikulum JSON (`database/Alur Belajar/`)**:

### A. Temuan Database
1. **Database & SQL:** Merupakan satu-satunya jalur yang telah memiliki 5 soal per modul di tabel `quizzes` (111 modul × 5 = 555 soal).
2. **Backend Developer (Node.js):** Baru saja diuji coba re-seed dan terbukti sukses memuat 5 soal per modul (111 modul × 5 = 555 soal).
3. **10 Jalur Belajar Lainnya:** Di database masih berstatus **1 soal per modul**. Hal ini terjadi karena seeder sebelumnya dijalankan sebelum berkas JSON diperluas, atau seeder belum di-run ulang dengan parser array `quizzes`.

### B. Temuan Konten JSON (Akar Masalah Pengguna)
1. **Dasar Pemrograman (116 Modul):** Menjadi **Gold Standard** kurikulum. Seluruh 116 modul sudah memiliki **5 soal pilihan ganda yang 100% unik**, kontekstual, dan diambil langsung dari materi (*What, Analogi, Why, How, dan Latihan Kode*).
2. **11 Jalur Belajar Lainnya (1.191 Modul):** 
   - **Soal 1:** Spesifik dan kontekstual.
   - **Soal 2, 3, 4, dan 5:** Ditemukan menggunakan **pola template/boilerplate yang berulang secara mekanis** di seluruh modul dengan kalimat pertanyaan dan opsi distractor yang identik:
     - Soal 2: *"Berdasarkan penjelasan materi, apa inti pembahasan dari [Title]?"*
     - Soal 3: *"Mengapa pemahaman mendalam mengenai [Title] sangat penting?"*
     - Soal 4: *"Langkah atau komponen apa yang ditekankan dalam materi [Title]?"*
     - Soal 5: *"Bagaimana cara memastikan hasil dari implementasi [Title] sudah sesuai harapan?"*
     - Opsi pilihan: *"Mengabaikan aturan sintaks..."*, *"Menghindari penggunaan variabel..."*, *"Menulis kode secara acak..."*, dsb.

> [!IMPORTANT]
> **Keputusan Strategis:** Seluruh 4.764 soal template pada 1.191 modul tersebut akan diganti 100% dengan soal kuis baru yang dirumuskan secara otentik dari materi (`content_markdown`), mengikuti standar pedagogis jalur `dasar-pemrograman`.

---

## 2. Pemetaan Lengkap 12 Alur Belajar

Tabel berikut memetakan seluruh alur belajar, seeder terkait, pembagian bab, jumlah modul, dan distribusi soal:

| No | Nama Alur Belajar | Slug Database | Direktori Sumber (`database/Alur Belajar/`) | Class Seeder | Bab | Modul | Soal Unik Saat Ini | Target Soal (5/Modul) |
|:--:|:---|:---|:---|:---|:---:|:---:|:---:|:---:|
| 1 | **Dasar Pemrograman** | `dasar-pemrograman` | `dasar-pemrograman` | `DasarPemrogramanSeeder` | 4 | 116 | **580** (Lengkap) | **580** |
| 2 | **Logika & Berpikir Komputasional** | `logika-dan-berpikir-komputasional` | `logika-dan-berpikir-komputasional` | `LogikaKomputasionalSeeder` | 4 | 103 | 103 (412 template) | **515** |
| 3 | **Dasar Python** | `dasar-python` | `dasar-python` | `DasarPythonSeeder` | 4 | 110 | 110 (440 template) | **550** |
| 4 | **HTML & CSS Dasar** | `html-css-dasar` | `HTML CSS` | `HtmlCssSeeder` | 4 | 112 | 112 (448 template) | **560** |
| 5 | **Layout & Desain Responsif** | `layout-dan-responsive-design` | `layout-dan-responsive-design` | `LayoutResponsiveDesignSeeder` | 4 | 105 | 105 (420 template) | **525** |
| 6 | **Frontend Web** | `frontend-web` | `frontend-web` | `FrontendWebSeeder` | 4 | 100 | 100 (400 template) | **500** |
| 7 | **JavaScript untuk Pemula** | `javascript-untuk-pemula` | `javascript-untuk-pemula` | `JavascriptPemulaSeeder` | 4 | 110 | 110 (440 template) | **550** |
| 8 | **Frontend Framework (React)** | `frontend-framework` | `Frontend Framework` | `FrontendFrameworkSeeder` | 4 | 112 | 112 (448 template) | **560** |
| 9 | **Database & SQL** | `database-sql` | `SQL & Basis Data` | `SqlBasisDataSeeder` | 4 | 111 | 111 (444 template) | **555** |
| 10 | **Backend Developer (Node.js)** | `backend-development` | `Backend Developer (Node.js & Express)` | `BackendDeveloperSeeder` | 4 | 111 | 111 (444 template) | **555** |
| 11 | **PHP & Laravel** | `php-laravel` | `PHP & Laravel` | `PhpLaravelSeeder` | 4 | 114 | 114 (456 template) | **570** |
| 12 | **Matematika untuk Informatika** | `matematika-informatika` | `Matematika Informatika` | `MatematikaInformatikaSeeder` | 4 | 103 | 103 (412 template) | **515** |
| **TOTAL** | **12 Alur Belajar** | - | - | - | **48** | **1.307** | **1.772** | **6.535** |

*(Catatan: Mode `Global Challenges` / 106 soal tantangan koding berfokus pada eksekusi kode mandiri di chapter tantangan dan sengaja tidak menggunakan pilihan ganda).*

---

## 3. Rincian Bab (Chapters) per Alur Belajar

Untuk memudahkan peninjauan (*audit*) per jalur belajar:

### 1. Dasar Pemrograman (116 Modul - Status: Selesai 100%)
- Bab 1: Pengenalan dan Variabel (28 modul)
- Bab 2: Percabangan dan Logika (29 modul)
- Bab 3: Perulangan dan Array (29 modul)
- Bab 4: Fungsi dan Mini Project (30 modul)

### 2. Logika & Berpikir Komputasional (103 Modul)
- Bab 1: Dekomposisi & Pengenalan Pola (25 modul)
- Bab 2: Abstraksi & Representasi Informasi (26 modul)
- Bab 3: Logika Algoritmik & Pembuatan Keputusan (26 modul)
- Bab 4: Optimasi & Pemecahan Masalah Kompleks (26 modul)

### 3. Dasar Python (110 Modul)
- Bab 1: Sintaksis Python, Variabel, & Tipe Data (27 modul)
- Bab 2: Kendali Alur: Kondisional & Loop Pythonic (28 modul)
- Bab 3: Struktur Data Python: List, Dict, Tuple, & Set (27 modul)
- Bab 4: Fungsi, Modul, Penanganan Error & File I/O (28 modul)

### 4. HTML & CSS Dasar (112 Modul)
- Bab 1: Kerangka & Semantik Dokumen HTML5 (28 modul)
- Bab 2: Penataan Dasar CSS, Selector, & Box Model (28 modul)
- Bab 3: Tipografi, Warna, Background, & Styling Komponen (28 modul)
- Bab 4: Form, Tabel Interaktif, & Integrasi Aset Media (28 modul)

### 5. Layout & Desain Responsif (105 Modul)
- Bab 1: CSS Flexbox Mendalam & Alignments (26 modul)
- Bab 2: CSS Grid Layout: Dua Dimensi & Area Template (26 modul)
- Bab 3: Responsive Design: Media Queries & Mobile-First Approach (26 modul)
- Bab 4: Modern Responsive Patterns: Container Queries & Clamp UI (27 modul)

### 6. Frontend Web (100 Modul)
- Bab 1: Manipulasi DOM & Event Listener Interaktif (25 modul)
- Bab 2: Form Handling, Validasi Input, & Penyimpanan Lokal (25 modul)
- Bab 3: Asynchronous JavaScript, Fetch API, & Integrasi REST (25 modul)
- Bab 4: Arsitektur UI Berbasis Komponen & Modern Tooling (25 modul)

### 7. JavaScript untuk Pemula (110 Modul)
- Bab 1: Pengenalan JS, Sintaks, Lingkup Variabel, & Tipe Data (27 modul)
- Bab 2: Operator Logika, Kondisional Kompleks, & Perulangan (28 modul)
- Bab 3: Fungsi Modern, Callback, Arrow Functions, & Array Methods (27 modul)
- Bab 4: Objek, JSON, Destructuring, & ES6+ Essentials (28 modul)

### 8. Frontend Framework - React (112 Modul)
- Bab 1: Fundamental React: JSX, Komponen, & Props (28 modul)
- Bab 2: State Management & Hooks Inti: useState & useEffect (28 modul)
- Bab 3: Event Handling, Rendering Bersyarat, & List Keys (28 modul)
- Bab 4: Advanced Hooks, Custom Hooks, & Global Context (28 modul)

### 9. Database & SQL (111 Modul)
- Bab 1: Fundamental Database Relasional, Entitas, & DDL (26 modul)
- Bab 2: Manipulasi Data: DML, Filter WHERE, Operator, & Sorting (28 modul)
- Bab 3: Agregasi Data, GROUP BY, HAVING, & Fungsi Skalar (28 modul)
- Bab 4: Relasi Multitabel: INNER/LEFT/RIGHT JOIN & Subquery (29 modul)

### 10. Backend Developer - Node.js & Express (111 Modul)
- Bab 1: Fundamental Server, Node Runtime, & Event Loop (25 modul)
- Bab 2: Express.js Routing, Middleware Pipeline, & Request-Response (29 modul)
- Bab 3: RESTful API Design, Validasi Skema, & Error Handling (28 modul)
- Bab 4: Autentikasi JWT, Enkripsi, Keamanan Server, & Database Wiring (29 modul)

### 11. PHP & Laravel (114 Modul)
- Bab 1: Sintaks Inti PHP 8+, Struktur Kendali, & OOP Fundamentals (28 modul)
- Bab 2: Arsitektur MVC Laravel, Routing, Blade, & Controller (28 modul)
- Bab 3: Eloquent ORM, Database Migration, Seeder, & Relationships (29 modul)
- Bab 4: API Resource, Request Validation, Middleware, & Deployment (29 modul)

### 12. Matematika untuk Informatika (103 Modul)
- Bab 1: Logika Proposisi, Tabel Kebenaran, & Gerbang Logika (25 modul)
- Bab 2: Teori Himpunan, Relasi, Fungsi, & Pemetaan Data (26 modul)
- Bab 3: Sistem Bilangan (Biner, Heksadesimal) & Aritmatika Modular (26 modul)
- Bab 4: Teori Graf Dasar, Pohon (Trees), & Kombinatorika Algoritmik (26 modul)

---

## 4. Standar Pedagogis & Blueprint Soal (5 Dimensi)

Setiap modul diwajibkan memiliki **tepat 5 soal pilihan ganda** yang merefleksikan bagian-bagian dalam `content_markdown`:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   KONTEN MATERI (content_markdown)                     │
├─────────────┬──────────────────┬─────────────┬──────────────┬──────────┤
│    What     │     Analogi      │     Why     │     How      │  Praktik │
└──────┬──────┴────────┬─────────┴──────┬──────┴──────┬───────┴─────┬────┘
       │               │                │             │             │
       ▼               ▼                ▼             ▼             ▼
   [ Soal 1 ]      [ Soal 2 ]       [ Soal 3 ]    [ Soal 4 ]    [ Soal 5 ]
 Definisi/Inti   Intuisi/Konsep   Urgensi/Risiko  Aturan Sintaks  Hasil/Kasus
```

### Rincian Dimensi Soal:
1. **Soal 1 — Definisi & Konsep Inti (`What`)**
   - **Tujuan:** Menguji apakah pembelajar paham apa makna istilah, keyword, atau konsep yang diajarkan.
   - **Sumber:** Diambil dari paragraf `### What (apa ini?)`.
2. **Soal 2 — Analogi Dunia Nyata & Intuisi (`Analogi`)**
   - **Tujuan:** Menguji pemahaman konsep secara nalar tanpa sekadar hafalan sintaks.
   - **Sumber:** Diambil dari paragraf pembuka atau analogi metafora (misal: "dapur restoran", "kerangka gedung", "buku telepon").
3. **Soal 3 — Urgensi & Dampak Arsitektur (`Why`)**
   - **Tujuan:** Menguji pemahaman mengapa fitur/aturan ini ada dan apa dampak buruk jika diabaikan (misal: kebocoran memori, data korup, SQL injection).
   - **Sumber:** Diambil dari paragraf `### Why (mengapa penting?)`.
4. **Soal 4 — Prosedur & Aturan Sintaks (`How`)**
   - **Tujuan:** Menguji urutan eksekusi, penulisan sintaks, atau fungsi bawaan yang tepat.
   - **Sumber:** Diambil dari paragraf `### How (bagaimana caranya?)`.
5. **Soal 5 — Analisis Kasus & Perilaku Kode (`Coba Pahami / Praktik`)**
   - **Tujuan:** Menguji kemampuan membaca snippet kode, memprediksi keluaran *(expected output)*, atau mendeteksi letak galat *(debugging)*.
   - **Sumber:** Diambil dari blok kode `### Coba Pahami` dan objektif `practice`.

---

## 5. Pedoman Anti-Duplikasi & Kualitas Opsi Jawaban

Untuk mencegah pengulangan soal seperti kondisi saat ini:
1. **Dilarang Keras Menggunakan Pertanyaan Berpola Seragam:**
   - ❌ *Tidak boleh:* "Berdasarkan materi di atas, apa inti dari..."
   - ❌ *Tidak boleh:* "Mengapa pemahaman mendalam mengenai X sangat penting?"
   - ✔️ *Wajib:* Kalimat pertanyaan langsung berfokus pada objek bahasan (Contoh: *"Manakah fungsi middleware Express yang tepat untuk menangkap body JSON pada request POST?"*).
2. **Dilarang Keras Menggunakan Opsi Distractor Generik:**
   - ❌ *Dilarang memakai:* "Mengabaikan aturan sintaks...", "Menghindari penggunaan variabel...", "Menulis kode secara acak...", "Menjalankan tanpa mengecek data...".
   - ✔️ *Wajib:* Semua 4 pilihan jawaban harus berupa opsi teknik yang masuk akal (*plausible*), namun hanya 1 yang tepat sesuai kaidah materi.
3. **Struktur Data Kuis Valid:**
   - 4 opsi jawaban dalam array `options`.
   - `answer_index` berupa integer 0, 1, 2, atau 3.
   - `explanation` edukatif yang menjelaskan mengapa opsi tersebut benar.
   - `hint` konstruktif yang merujuk bagian materi untuk membantu siswa yang kesulitan.

---

## 6. Contoh Nyata: Sebelum vs Sesudah Perbaikan

### Modul: `Backend Developer / BAB_1 / 01_apa-itu-backend.json`

#### ❌ Sebelum (Kondisi Template Saat Ini):
- **Soal 1:** Spesifik.
- **Soal 2:** *"Berdasarkan penjelasan materi, apa inti pembahasan dari 'Apa Itu Backend'?"*
  - Opsi: *Mengabaikan aturan sintaks...*, *Konsep dasar dan aturan...*, *Menghindari penggunaan variabel...*, *Menjalankan tanpa pengecekan...*
- **Soal 3:** *"Mengapa pemahaman mendalam mengenai 'Apa Itu Backend' sangat penting?"*
  - Opsi: *Agar bisa menulis kode tanpa logika...*, *Supaya program tidak butuh eksekusi...*, *Memastikan kode bekerja terstruktur...*, *Karena bahasa melarang cara alternatif...*
- **Soal 4:** *"Langkah atau komponen apa yang ditekankan dalam materi 'Apa Itu Backend'?"*
- **Soal 5:** *"Bagaimana cara memastikan hasil dari implementasi 'Apa Itu Backend' sudah sesuai harapan?"*

#### ✅ Sesudah (Standar Baru - Kontekstual Penuh dari Materi):
- **Soal 1 (What):** *"Berdasarkan materi, apa tanggung jawab utama dari sisi backend dalam sebuah arsitektur web?"*
  - Opsi:
    - [A] Mengatur styling CSS dan tata letak animasi di browser pengguna.
    - [B] Menerima request, mengeksekusi logika bisnis, mengakses database, dan mengembalikan response terstruktur. *(Benar)*
    - [C] Menyimpan file aset gambar statis tanpa memerlukan server aktif.
    - [D] Menjalankan kode JavaScript secara langsung di mesin client pengguna.
- **Soal 2 (Analogi):** *"Dalam analogi sebuah restoran, bagian mana yang mewakili peran backend?"*
  - Opsi:
    - [A] Meja dan buku menu yang dilihat langsung oleh pelanggan.
    - [B] Pelayan yang mengantarkan makanan ke meja makan.
    - [C] Dapur restoran yang tidak terlihat pelanggan namun mengolah seluruh pesanan secara tepat. *(Benar)*
    - [D] Pintu masuk restoran yang menyambut kedatangan pengunjung.
- **Soal 3 (Why):** *"Mengapa logika bisnis dan validasi data krusial tidak boleh hanya diletakkan di sisi frontend/browser?"*
  - Opsi:
    - [A] Karena browser tidak mendukung eksekusi logika percabangan if-else.
    - [B] Karena kode frontend dapat dimodifikasi atau dibypass oleh pengguna sehingga server harus menjadi sumber kebenaran (source of truth). *(Benar)*
    - [C] Agar ukuran bundle file HTML dan CSS menjadi lebih besar.
    - [D] Karena database SQL hanya dapat diakses melalui browser client.
- **Soal 4 (How):** *"Bagaimanakah urutan alur pemrosesan data backend yang ideal saat menangani permintaan pengguna?"*
  - Opsi:
    - [A] Request → Kirim response → Simpan ke database → Validasi data.
    - [B] Request → Validasi input → Pemrosesan logika/data → Pembentukan response. *(Benar)*
    - [C] Database query → Request → Response → Parsing URL.
    - [D] Validasi frontend → Simpan file statis → Matikan koneksi server.
- **Soal 5 (Output/Analisis Kasus):** *"Jika sebuah endpoint backend berhasil memproses data pendaftaran akun baru, kode status HTTP dan format respons apa yang paling tepat dikembalikan?"*
  - Opsi:
    - [A] Status 404 dengan pesan string kosong.
    - [B] Status 500 dengan dump file database internal.
    - [C] Status 201 (Created) atau 200 (OK) dengan format data JSON berisi status pendaftaran. *(Benar)*
    - [D] Status 301 untuk mengarahkan pengguna mengunduh file biner server.

---

## 7. Rencana Eksekusi Teknis (Siap Dilanjut Besok)

1. **Tahap 1: Ekstraksi & Regenerasi JSON Otomatis**
   - Menjalankan pipeline generator konten yang memindai setiap file JSON di 11 jalur alur belajar.
   - Mengekstrak heading Markdown (`### What`, `### Why`, `### How`, contoh kode, dan kata kunci latihan).
   - Menulis ulang kunci `"quizzes"` dan `"quiz"` dengan 5 butir soal kontekstual bermutu tinggi.
2. **Tahap 2: Validasi Integritas & Anti-Duplikasi**
   - Menjalankan skrip audit otomatis yang memverifikasi:
     - 0 soal yang memuat teks template lama.
     - Setiap soal memiliki 4 opsi unik.
     - `answer_index` berada di rentang 0..3.
     - Penjelasan (*explanation*) dan petunjuk (*hint*) terisi lengkap.
3. **Tahap 3: Database Seeder Execution**
   - Menjalankan seeder untuk seluruh 12 Alur Belajar:
     ```bash
     php artisan db:seed --class=DasarPemrogramanSeeder
     php artisan db:seed --class=LogikaKomputasionalSeeder
     php artisan db:seed --class=DasarPythonSeeder
     php artisan db:seed --class=HtmlCssSeeder
     php artisan db:seed --class=LayoutResponsiveDesignSeeder
     php artisan db:seed --class=FrontendWebSeeder
     php artisan db:seed --class=JavascriptPemulaSeeder
     php artisan db:seed --class=FrontendFrameworkSeeder
     php artisan db:seed --class=SqlBasisDataSeeder
     php artisan db:seed --class=BackendDeveloperSeeder
     php artisan db:seed --class=PhpLaravelSeeder
     php artisan db:seed --class=MatematikaInformatikaSeeder
     ```
4. **Tahap 4: Verifikasi Akhir (Audit Acceptance)**
   - Menjalankan query validasi SQL:
     ```sql
     SELECT COUNT(*) as lessons_without_5_quizzes 
     FROM lessons 
     WHERE (SELECT COUNT(*) FROM quizzes WHERE quizzes.lesson_id = lessons.id) < 5
     AND type != 'code';
     ```
   - Target hasil query: **0 lessons** (Semua modul kurikulum telah memiliki minimal 5 kuis unik di database).

---

## 8. Lembar Persetujuan Audit

Dokumen ini disimpan untuk ditinjau oleh pengguna. Seluruh arsitektur kurikulum, rincian bab, pemetaan butir soal, dan strategi eksekusi telah diselaraskan dengan PRD Alur Belajar IC Game-Z 2026.
