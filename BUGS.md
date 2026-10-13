# 🐛 Bug Report — IC Game-Z Frontend

> Ditemukan via audit kode pada 13 Oktober 2026

---

## 🟡 BUG-F001 — `LessonView.css` hampir kosong (270 bytes)

**File:** `src/assets/css/views/LessonView.css`

**Deskripsi:**
File CSS untuk halaman lesson hanya berisi 270 bytes — hampir tidak ada styling.
Halaman LessonView kemungkinan mengambil style dari file CSS lain atau masih belum
diimplementasikan secara lengkap.

**Dampak:** Tampilan halaman belajar (lesson) mungkin tidak sesuai desain.

**Status:** ⏳ Perlu dicek & dilengkapi.

---

## 🟡 BUG-F002 — `LeaderboardView.css` hampir kosong (71 bytes)

**File:** `src/assets/css/views/LeaderboardView.css`

**Deskripsi:**
File CSS untuk halaman leaderboard hanya berisi 71 bytes — hampir kosong.
Halaman leaderboard standalone (`/leaderboard`) kemungkinan tidak memiliki styling layout.

**Dampak:** Halaman `/leaderboard` tampil tanpa padding/layout yang benar.

**Status:** ⏳ Perlu dilengkapi.

---

## 🟡 BUG-F003 — CSS untuk Shop views tidak ada

**File yang hilang:**
- `src/assets/css/views/ShopView.css`
- `src/assets/css/views/ShopCheckoutView.css`

**Deskripsi:**
`ShopView.vue` (823 baris) dan `ShopCheckoutView.vue` (18KB) adalah halaman besar,
tapi tidak ada file CSS terpisah di folder `views/`. Kemungkinan:
- Styling ditulis inline / scoped di dalam `.vue` file
- Atau menggunakan CSS dari file lain (misal `components.css`)

**Dampak:** Sulit di-maintain jika styling tersebar. Perlu audit apakah style sudah ada inline.

**Status:** ⏳ Perlu dicek apakah styling sudah ada inline di .vue file.

---

## 🟡 BUG-F004 — CSS untuk Profile views tidak ada

**File yang hilang:**
- `src/assets/css/views/ProfileEditView.css`
- `src/assets/css/views/VisitProfileView.css`

**Deskripsi:**
`ProfileEditView.vue` (13.5KB) dan `VisitProfileView.vue` (19.4KB) adalah halaman besar
yang tidak memiliki file CSS terpisah di folder `views/`.

**Status:** ⏳ Perlu dicek apakah styling sudah inline atau memang belum ada.

---

## 🟡 BUG-F005 — CSS untuk Login & Register views tidak ada

**File yang hilang:**
- `src/assets/css/views/LoginView.css`
- `src/assets/css/views/RegisterView.css`

**Deskripsi:**
`LoginView.vue` (10.7KB) dan `RegisterView.vue` (12.4KB) tidak memiliki file CSS eksternal.

**Status:** ⏳ Perlu dicek apakah styling sudah inline.

---

## 📋 Summary

| ID | Severity | Status | File |
|---|---|---|---|
| BUG-F001 | 🟡 Medium | Open | LessonView.css |
| BUG-F002 | 🟡 Medium | Open | LeaderboardView.css |
| BUG-F003 | 🟡 Medium | Open | ShopView.css (missing) |
| BUG-F004 | 🟡 Medium | Open | ProfileEditView.css (missing) |
| BUG-F005 | 🟡 Medium | Open | LoginView.css (missing) |
