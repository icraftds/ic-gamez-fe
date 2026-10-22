# SKILL.md — IC Game-Z Frontend Domain & Clean Code Guidelines

Panduan domain pengetahuan dan standar kualitas kode (*Clean Code*) untuk repository Frontend **IC Game-Z** (`ic-gameZ`).

---

## 1. Arsitektur & Teknologi Inti
- **Framework**: Vue 3 (Composition API dengan `<script setup>`).
- **Build Tool**: Vite.
- **State Management**: Pinia & Dedicated Composables (`src/composables/`).
- **Editor & Sandbox**: CodeMirror 6 (`vue-codemirror`) dengan tema custom One Dark Cyberpunk.
- **Database Engine (Client-side)**: SQLite WebAssembly (`sql.js`) in-memory database dengan master schema `icgamez_store`.
- **Styling**: Vanilla CSS terstruktur dengan Design System berbasis CSS Variables & Glassmorphism Gelap.

---

## 2. Prinsip & Standar Clean Code Frontend

Setiap pengembangan fitur, komponen baru, perbaikan bug, atau refactoring WAJIB mematuhi standar berikut:

### 1. Component Modularity & Single Responsibility (SRP)
- **Komponen Fokus & Ringkas**: Satu komponen `.vue` hanya bertanggung jawab untuk satu representasi antarmuka. Jika suatu komponen mulai menangani lebih dari 2 urusan besar, pecah menjadi sub-komponen (contoh: `DatabaseSchemaViewer.vue` dipisahkan dari `PracticePanel.vue`).
- **Hindari Logika Rumit di Template**: Template harus tetap bersih dan mudah dibaca. Semua transformasi data, manipulasi string, atau kalkulasi filter harus menggunakan `computed()` properties di `<script setup>`.
- **Props & Emits Eksplisit**: Selalu deklarasikan `defineProps` dengan tipe data dan nilai default yang jelas, serta deklarasikan `defineEmits` untuk setiap custom event yang dipancarkan.

### 2. Composable-First Business Logic
- **Pemisahan Antara UI dan Logika**: Logika bisnis platform yang kompleks (pemberian XP, manajemen antrean outbox, runner evaluasi kode, timer quiz, user state) WAJIB diekstrak ke dalam Composable di `src/composables/`:
  - `useScoring.js`: Pengelolaan XP reward, optimistic updates, dan network retry outbox.
  - `useQuiz.js`: State pengerjaan kuis, pemilihan opsi, dan evaluasi jawaban.
  - `useCodeRunner.js`: Eksekusi kode multi-bahasa (JS, Python, PHP, HTML, SQL).
  - `useUserAccount.js`: Profil user, saldo kredit harian, dan status langganan PRO.
- **Props Down, Events Up**: Jaga aliran data satu arah (*one-way data flow*). Jangan memutasi properti `props` secara langsung di dalam child component.

### 3. Ketahanan Dynamic Assets & WebAssembly (WASM Resilience)
- **Penyimpanan Aset Statis yang Tepat**: Seluruh aset biner seperti `.wasm` untuk client-side execution harus diletakkan di direktori `public/` dengan path absolut yang pasti (contoh: `/sql/sql-wasm-browser.wasm` dan `/sql/sql-wasm.wasm`).
- **Pencegahan SPA Fallback Error**: Pastikan file yang diminta oleh library loader (seperti Emscripten `locateFile`) benar-benar ada secara fisik di server, sehingga tidak terkena fallback `index.html` yang memicu `CompileError: expected magic word 00 61 73 6d`.
- **Fallback Berjenjang**: Selalu sediakan *fallback path* (misalnya fallback ke CDN resmi) jika aset lokal gagal dimuat karena masalah jaringan atau konfigurasi server.

### 4. Konsistensi Design System & Styling
- **Cyberpunk Dark Theme**: Pertahankan palet warna neon cyberpunk yang elegan (ungu neon `#a855f7`, cyan `#38bdf8`, emerald `#10b981`, dan latar `#060310`).
- **Gunakan CSS Custom Properties**: Hindari menuliskan nilai hex/rgba secara berulang (*magic colors*). Gunakan token sistem yang telah terdefinisi di `src/assets/css/variables.css` atau global CSS.
- **Scoped & Terpisah**: Pisahkan CSS besar ke file eksternal yang diimpor via `<style scoped src="...">` agar komponen Vue tetap ramping dan mudah dirawat.

### 5. Defensive Programming & User-Centric Error Messages
- **Validasi Input Seawal Mungkin (*Fail Fast*)**: Berikan peringatan yang jelas jika pengguna mengirim input kosong sebelum memicu eksekusi engine.
- **Pesan Error yang Solutif**: Ubah pesan error teknis mentah menjadi petunjuk yang mudah dipahami peserta belajar.
  - *Contoh*: Jika pengguna SQL mengetik `SELECT * FROM icgamez_store`, jangan biarkan hanya muncul `no such table: icgamez_store`, melainkan jelaskan bahwa `icgamez_store` adalah nama database, dan sarankan tabel yang sebenarnya (seperti `categories`, `products`, `orders`).

### 6. Kebersihan Kode & Higienitas (Code Hygiene)
- **Tanpa Dead Code**: Hapus kode lama yang dikomentari, import yang tidak dipakai, dan variabel tak bertuan.
- **Bersihkan Log Debug**: Hapus `console.log()` sementara setelah proses debugging selesai. Pertahankan hanya `console.warn` atau `console.error` untuk penanganan error kritis.
- **Komentar Efektif**: Tulis komentar yang menjelaskan "*mengapa*" suatu keputusan arsitektur diambil, bukan menduplikasi apa yang sudah jelas dari baris kode.
