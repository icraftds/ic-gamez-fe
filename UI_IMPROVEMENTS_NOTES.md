# Ringkasan Perbaikan UI & Layout (Oktober 2026)

Dokumen ini merangkum semua perubahan signifikan pada antarmuka pengguna (UI), *layouting*, dan *bug fixes* di panel admin (Filament) untuk mempermudah *maintenance* di masa mendatang.

## 1. GameZ Shop (`ShopView.vue`)
- **Perubahan Konsep Layout:** Sebelumnya menggunakan `max-width: 900px` yang terlihat mengambang di tengah, kini diubah menjadi **Full Page Layout** yang modern.
- **Hero Header:** Menambahkan bagian *header* yang lebih premium dengan *glowing background* (`.hero-bg-glow`) menggunakan `radial-gradient`.
- **Card Paket Energi:** Mengubah desain kotak biasa menjadi *Grid Card* (`.packages-grid`) modern dengan efek *hover* yang interaktif (terangkat dan bercahaya pinggirannya).
- **Integrasi iCoinZ SVG:** 
  - Mengganti seluruh *font-awesome* koin (`fa-coins`) dengan logo kustom `/images/icoinz.svg`.
  - Membuat *class* `.icoinz-icon` dan `.icoinz-icon-small` untuk mengatur ukuran dan proporsi SVG (`object-fit: contain`).
- **Animasi Memuat (Loading):** Mengganti *spinner* bawaan dengan logo *iCoinZ* SVG yang berputar dan melayang (*floatSpin* animation).
- **Animasi Sukses:** Mengganti centang hijau statis dengan logo *iCoinZ* raksasa (120px) yang berdenyut (*scalePulse* animation) dan memiliki bayangan keemasan ketika pembelian sukses.

## 2. Navbar & Avatar (`HomeNavbar.vue` & `HomeNavbar.css`)
- **Pembersihan Kode:** Menghapus seluruh *inline style* (`style="..."`) pada elemen profil dan tombol *Shop*, lalu memindahkannya ke dalam *class* CSS.
- **Penggabungan File CSS:** Menghapus import CSS ganda yang memanggil dua *file* identik, kini seluruhnya disatukan ke `src/assets/css/components/home/HomeNavbar.css`.
- **Perbaikan Margin & Proporsi:**
  - Menghapus `margin-right: 15px` yang membuat jarak antara tombol *Shop* dan avatar terlihat jauh dan terputus.
  - Membuat tombol *GameZ Shop* (`.nav-shop-btn`) dan *Dropdown Profil* (`.dropdown-trigger`) memiliki latar belakang transparan keabuan berbentuk pil (lingkaran utuh) untuk konsistensi desain UI premium.

## 3. Timeline Alur Belajar (`PathDetailView.vue` & CSS)
- **Perubahan Konsep Branching:** Mengubah *layout* yang sebelumnya zig-zag/bergantian kiri dan kanan menjadi **Single-Column Vertical Stepper**.
- **Spine (Garis Tulang Punggung):** Membuat garis vertikal lurus yang bercahaya di sisi kiri *card* dengan animasi `growSpine` saat halaman dimuat.
- **Chapter Node & Lesson Card:** *Node* kini tidak lagi mengambang di tengah-tengah garis, melainkan diatur rata kiri dengan titik koneksi (`.spine-dot`) yang langsung menempel presisi di jalur utama tanpa *connector line* horizontal yang kaku. Hal ini membuat tata letak jauh lebih *clean* dan elegan seperti aplikasi *roadmap* kelas atas.

## 4. Admin Panel / Filament (`EnergyPackageResource.php`)
- **Perbaikan Bug Type Hinting:** Sebelumnya *Energy Packages* tidak muncul di *sidebar* admin karena konflik tipe data `UnitEnum|string|null` pada *property* `$navigationGroup` di PHP 8.1+.
- **Solusi:** Menghapus penulisan tipe data pada properti statis dan menggantinya dengan menggunakan *Method* bawaan Filament:
  ```php
  public static function getNavigationGroup(): ?string {
      return 'Pengguna & Monetisasi';
  }
  public static function getNavigationIcon(): string|\BackedEnum|null {
      return 'heroicon-o-bolt';
  }
  ```
- **Reposisi Menu:** Memindahkan grup navigasi "Paket Energi" ke dalam grup **"Pengguna & Monetisasi"** agar lebih rapi dan relevan dengan fungsinya.

---
*Dokumen ini dibuat secara otomatis pada proses perombakan UI GameZ Shop, Navbar, dan Alur Belajar.*
