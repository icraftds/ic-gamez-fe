# Panduan Code Execution Engine (API vs Self-Hosted)

Salah satu tantangan paling menarik sekaligus paling berbahaya dalam membangun aplikasi seperti Codewars adalah bagaimana menjalankan kode yang ditulis oleh *user*. 

Berikut adalah jabaran detail mengenai fitur eksekusi kode ini dan opsi pendekatannya.

---

## 1. Menjawab Pertanyaan Anda: "Apakah FE tetap bisa diubah?"

**Jawabannya: Tentu Saja Bisa! Seratus persen bisa.**

Arsitektur sistem modern menggunakan prinsip **Decoupling** (Pemisahan Tugas). Frontend Anda (`icgamez-workspace.html`) dan *Code Execution Engine* sama sekali tidak terikat satu sama lain secara langsung. 

**Alurnya seperti ini:**
1. User menekan tombol "Submit" di UI (Frontend).
2. Frontend mengirimkan *source code* ke **Backend Golang Anda**.
3. **Backend Golang Anda** yang akan berkomunikasi dengan *Code Execution API* (pihak ketiga).
4. API tersebut memproses kode dan mengembalikan hasilnya ke **Backend Golang Anda**.
5. Backend Golang mengembalikan format JSON yang rapi ke Frontend.
6. Frontend menampilkan centang hijau (Sukses) atau merah (Gagal).

Karena Frontend hanya berkomunikasi dengan Backend Golang Anda, Anda bebas merombak tampilan UI/UX, animasi, atau tombol di Frontend kapan saja tanpa perlu menyentuh logika *Code Execution*-nya.

---

## 2. Opsi 1: Menggunakan API Pihak Ketiga (Sangat Direkomendasikan untuk MVP)

Untuk tahap awal (MVP - Minimum Viable Product), menggunakan API eksekusi kode pihak ketiga sangat disarankan. 

**Contoh Layanan:**
- **Judge0** (Paling populer, *open-source*, memiliki versi API gratis yang bisa dicoba).
- **Piston API** (Sangat cepat dan mendukung banyak bahasa).
- **JDoodle API** atau **HackerEarth API**.

**Bagaimana Cara Kerjanya?**
Backend Golang Anda bertindak sebagai perantara (Proxy/Service).
```go
// Contoh logika sangat sederhana di Golang
func SubmitCodeHandler(c *gin.Context) {
    userCode := c.PostForm("code")
    language := c.PostForm("lang_id") // misal: 71 untuk Python 3
    
    // Golang mengirim request HTTP ke server Judge0 API
    result := sendToJudge0API(userCode, language)
    
    // Kembalikan hasil ke Frontend
    c.JSON(200, result)
}
```

**Kelebihan Menggunakan API:**
- **Sangat Aman:** Mereka yang menanggung risiko jika ada user yang mengirimkan *malware* atau *infinite loop*.
- **Cepat Selesai:** Anda tidak perlu pusing mempelajari infrastruktur *containerization* tingkat lanjut.
- **Support Banyak Bahasa:** Secara instan Anda bisa mendukung 50+ bahasa pemrograman tanpa repot menginstal *compiler* satu-satu di server Anda.

**Kekurangan:**
- Ada limitasi (Rate Limit) untuk versi gratis. Jika sistem Anda meledak dan punya ribuan user aktif bersamaan, Anda harus membayar layanan SaaS mereka.

---

## 3. Opsi 2: Membangun Code Execution Sendiri (Self-Hosted Sandbox)

Jika skala aplikasi sudah besar atau Anda ingin *100% in-house*, Anda bisa membangun "mesin eksekusi" sendiri di server Backend.

**Bagaimana Cara Kerjanya?**
Kita menggunakan **Docker**. 
Setiap kali ada *request* eksekusi, Backend Golang Anda akan "memerintahkan" Docker Engine untuk melakukan ini secara *on-the-fly*:
1. Buat Container Linux sementara.
2. Masukkan kode user ke dalam Container.
3. Jalankan kode dengan limitasi (Max RAM 128MB, Max CPU 50%, Max Time 2 detik, Matikan Koneksi Internet/Network None).
4. Ambil output-nya (Terminal logs/stdout).
5. Hancurkan (Destroy) Container tersebut.

**Kelebihan Membangun Sendiri:**
- **Gratis Sepenuhnya:** Anda tidak terikat biaya *subscription* API pihak ketiga. Anda hanya bayar sewa server (VPS) bulanan Anda sendiri.
- **Kontrol Penuh:** Anda bisa memodifikasi *environment* sesuka hati.

**Kekurangan:**
- **Kompleksitas Infrastruktur:** Membutuhkan pengetahuan mendalam tentang Docker CLI, Cgroups (Control Groups di Linux), dan keamanan server.
- **Server Resources:** Membutuhkan server dengan spesifikasi yang lebih besar (minimal RAM 4GB - 8GB) karena Docker Container membutuhkan sumber daya saat di-spawn terus-menerus.

---

## Kesimpulan & Saran Langkah

**Saran Profesional Saya:**
Mulai dengan **Opsi 1 (API Pihak Ketiga - seperti Piston API atau Judge0)**. Ini akan membuat Anda bisa fokus membangun fitur utama (UI/UX Frontend yang keren, sistem *Leaderboard*, *Token*, autentikasi, database soal) tanpa terhenti berminggu-minggu memikirkan keamanan *Sandboxing*.

Nanti, karena kita menggunakan arsitektur modular di Golang (seperti yang saya petakan di dokumen sebelumnya: `internal/executor/`), kita bisa **men-swap/mengganti** dari API pihak ketiga ke Docker Self-Hosted di kemudian hari **tanpa mengubah Frontend sama sekali**, dan hanya mengubah sedikit kode di Backend Golang!
