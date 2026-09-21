# Product Requirements Document (PRD) - Dummy Frontend Payment UI

## 1. Ringkasan Eksekutif
Dokumen ini difokuskan pada pengembangan antarmuka (UI) sementara berbasis data palsu (*dummy*) untuk Frontend Vue SPA IC Game Z. Tujuannya adalah mempersiapkan alur UX yang memukau (animasi, *feedback* interaktif, pergantian paket langganan) sambil menunggu API Pakasir benar-benar dihubungkan.

## 2. Tujuan
- Menyelesaikan pembuatan komponen UI pembayaran secara mandiri (terlepas dari kesiapan *backend* sesungguhnya).
- Memastikan logika perubahan *State* (Pinia) berjalan lancar saat *user* naik level menjadi 'Premium'.
- Mengintegrasikan aset animasi (seperti Confetti atau transisi mikro) yang membuat platform terasa digamifikasi.

## 3. Ruang Lingkup Fitur (Dummy UI)
1. **Modal / Halaman Pemilihan Paket (Pricing Plan)**
   - Menampilkan perbandingan Paket Gratis (Free) dan Paket Premium (Pro).
   - Tombol "Upgrade Sekarang".
2. **Modal Checkout (Metode Pembayaran)**
   - Daftar metode pembayaran palsu (QRIS, VA Bank).
   - UI yang menampilkan QR Code palsu dan nomor VA beserta instruksi bayar.
3. **Simulasi Pembayaran (Trigger)**
   - Sebuah tombol khusus (*hanya di mode development/dummy*) bertuliskan **"Simulasikan Bayar Sukses"**.
   - Saat tombol ditekan, Frontend akan menembak *endpoint* backend `POST /api/v1/payments/dummy-success`.
4. **Popup "Selamat & Animasi" (Success State)**
   - Jika backend merespon `200 OK`, tutup modal QR Code.
   - Panggil pustaka animasi (misal: `canvas-confetti`).
   - Tampilkan Popup berdesain *game-like*: **"Selamat! Paket berhasil diubah menjadi Premium!"**.
   - Update Pinia User Store (Ubah tipe *plan* dari *free* ke *premium*).

## 4. Persyaratan Teknis UI/UX
- **Desain Modern**: Gunakan warna neon/gelap khas *game*, *glassmorphism* (efek tembus pandang) untuk modal.
- **Responsivitas**: Tampilan metode pembayaran harus ramah mobile (ukuran QR, tombol salin VA).
- **Smooth Transition**: Gunakan `<Transition>` dari Vue 3 saat modal berubah dari "Pilih Paket" -> "Menampilkan QR" -> "Popup Sukses".
- **State Management**: Pastikan setelah pembayaran sukses, *icon* premium langsung muncul di *Header* tanpa perlu *refresh* halaman.
