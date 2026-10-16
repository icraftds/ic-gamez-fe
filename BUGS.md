# 🐛 Bug Report — IC Game-Z Frontend

> Ditemukan via audit kode pada 13 Oktober 2026  
> Terakhir diperbarui pada 16 Oktober 2026 (Audit & Perbaikan Arsitektur CSS)

---

## 🟢 BUG-F001 — `LessonView.css` hampir kosong (270 bytes)

**File:** `src/assets/css/views/LessonView.css`

**Deskripsi Awal:**
File CSS untuk halaman lesson hanya berisi 270 bytes — hampir tidak ada styling.

**Hasil Audit & Perbaikan:**
* Ditemukan bahwa styling layout utama (workspace, body, panel, fallback not-found, loading-state, dan responsivitas mobile) berada di file legacy `src/assets/css/pages/LessonView.css`, sementara versi di `views/` hanya berisi transisi `fade-slide`.
* Seluruh styling telah digabungkan ke dalam [src/assets/css/views/LessonView.css](src/assets/css/views/LessonView.css).
* [src/views/LessonView.vue](src/views/LessonView.vue) telah diperbarui untuk hanya mengimpor satu file standar `views/LessonView.css`.
* File legacy `src/assets/css/pages/LessonView.css` sudah dihapus karena tidak dipakai lagi.

**Status:** ✅ Selesai (Resolved).

---

## 🟢 BUG-F002 — `LeaderboardView.css` hampir kosong (71 bytes)

**File:** `src/assets/css/views/LeaderboardView.css`

**Deskripsi Awal:**
File CSS untuk halaman leaderboard hanya berisi 71 bytes — hampir kosong. Halaman leaderboard standalone (`/leaderboard`) kemungkinan tidak memiliki styling layout.

**Hasil Audit & Perbaikan:**
* File [src/assets/css/views/LeaderboardView.css](src/assets/css/views/LeaderboardView.css) telah dilengkapi dengan:
  * Layout semantik `.leaderboard-view` dan `.leaderboard-container`.
  * Top clearance yang aman dari sticky navbar.
  * Media queries responsive untuk tablet (`<= 1024px`), mobile (`<= 768px`), dan small mobile (`<= 480px`).
* Inline style `style="margin-top: 40px"` pada [src/views/LeaderboardView.vue](src/views/LeaderboardView.vue) telah diganti dengan class semantik `.leaderboard-container`.
* Kode `.reveal` (CSS + script `onMounted`) dihapus karena tidak terpakai: `LeaderboardTable` hanya memberi class `reveal` saat `isFullView` bernilai false, sedangkan halaman ini selalu mengirim `is-full-view="true"`.

**Status:** ✅ Selesai (Resolved).

---

## 🟢 BUG-F003 — CSS untuk Shop views tidak ada

**File yang dibuat:**
- `src/assets/css/views/ShopView.css`
- `src/assets/css/views/ShopCheckoutView.css`

**Hasil Audit & Perbaikan:**
* Sebanyak 450 baris scoped CSS dari [src/views/ShopView.vue](src/views/ShopView.vue) telah diekstraksi ke [src/assets/css/views/ShopView.css](src/assets/css/views/ShopView.css).
* Sebanyak 324 baris scoped CSS dari [src/views/ShopCheckoutView.vue](src/views/ShopCheckoutView.vue) telah diekstraksi ke [src/assets/css/views/ShopCheckoutView.css](src/assets/css/views/ShopCheckoutView.css).
* Kedua komponen Vue telah diperbarui untuk mengimpor file CSS masing-masing via `<style scoped src="...">`.

**Status:** ✅ Selesai (Resolved).

---

## 🟢 BUG-F004 — CSS untuk Profile views tidak ada

**File yang dibuat:**
- `src/assets/css/views/ProfileEditView.css`
- `src/assets/css/views/VisitProfileView.css`

**Hasil Audit & Perbaikan:**
* Sebanyak 318 baris scoped CSS dari [src/views/ProfileEditView.vue](src/views/ProfileEditView.vue) telah diekstraksi ke [src/assets/css/views/ProfileEditView.css](src/assets/css/views/ProfileEditView.css).
* Sebanyak 226 baris scoped CSS dari [src/views/VisitProfileView.vue](src/views/VisitProfileView.vue) telah diekstraksi ke [src/assets/css/views/VisitProfileView.css](src/assets/css/views/VisitProfileView.css).
* Kedua komponen Vue telah diperbarui untuk mengimpor file CSS masing-masing via `<style scoped src="...">`.

**Status:** ✅ Selesai (Resolved).

---

## 🔒 BUG-F005 — CSS untuk Login & Register views (Catatan Khusus Auth)

**File Terkait:**
- `src/views/LoginView.vue`
- `src/views/RegisterView.vue`
- `src/assets/css/pages/AuthView.css`

**Status & Aturan Khusus Branch:**
* ⚠️ **PENTING (Standing Constraint):** Segala hal yang berhubungan dengan autentikasi (Auth) — baik views, komponen, logic, maupun stylings — **menggunakan implementasi yang ada di branch `master`**.
* Kode Auth yang ada di branch lokal saat ini hanya diperuntukkan untuk **pengetesan lokal (*local testing only*)** dan **TIDAK BOLEH IKUT DI-PUSH** ke remote/master.
* Oleh karena itu, file-file auth lokal dipertahankan sebagaimana mestinya untuk lingkungan dev lokal tanpa diubah/di-push.

**Status:** 🔒 Managed in `master` branch (Local testing only — Excluded from push).

---

## 📋 Summary

| ID | Severity | Status | File | Tindakan |
|---|---|---|---|---|
| BUG-F001 | 🟡 Medium | ✅ Closed | `views/LessonView.css` | Menggabungkan styling layout workspace & responsivitas ke `views/LessonView.css` |
| BUG-F002 | 🟡 Medium | ✅ Closed | `views/LeaderboardView.css` | Melengkapi layout standalone, navbar clearance, responsive container, hapus inline style |
| BUG-F003 | 🟡 Medium | ✅ Closed | `views/ShopView.css`, `views/ShopCheckoutView.css` | Ekstraksi CSS inline ke file eksternal di folder `views/` |
| BUG-F004 | 🟡 Medium | ✅ Closed | `views/ProfileEditView.css`, `views/VisitProfileView.css` | Ekstraksi CSS inline ke file eksternal di folder `views/` |
| BUG-F005 | 🟡 Medium | 🔒 Master | `LoginView`, `RegisterView` | Source of truth di branch `master`. Versi lokal hanya untuk testing, jangan di-push |
