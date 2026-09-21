# Product Requirements Document (PRD) - IC Game Z Backend (Monolith Payment)

## 1. Ringkasan Eksekutif
Dalam pendekatan **Monolith**, fitur *Payment Gateway* (integrasi Pakasir v2) akan dilebur secara langsung ke dalam sistem *Backend IC Game Z*. Tidak ada server atau repositori microservice yang terpisah. 

## 2. Tujuan
- Mempercepat fase rilis (*Go-to-Market*) karena tidak perlu menyiapkan komunikasi antar server dan infrastruktur terpisah.
- Semua logika pembayaran, pengecekan *rate-limit*, dan penyimpanan *webhook* ditangani dalam satu basis kode Laravel IC Game Z.

## 3. Ruang Lingkup Fitur (Backend)
1. **Pusat Pembayaran (Pakasir Service)**
   - Sebuah class `PakasirService` di `app/Services/` yang bertugas memanggil API v2 Pakasir secara langsung (`create-transaction`, `transaction-status`, `payment-fee`).
2. **Penyimpanan Transaksi Lokal**
   - Penambahan tabel `transactions` di *database* utama IC Game Z. 
   - Transaksi terhubung langsung dengan relasi tabel `users` (sehingga tidak butuh *app_source* seperti di microservice).
3. **Penerima Webhook Langsung**
   - Endpoint `POST /api/v1/webhooks/pakasir` yang memvalidasi *X-Secret*.
   - Saat transaksi `completed`, *backend* langsung mengubah status langganan (*Subscription Plan*) atau menambah koin *user* di satu fungsi yang sama, tanpa perlu meneruskan *event* HTTP ke tempat lain.

## 4. Persiapan Data (Skema Tabel)
Tabel `transactions`:
- `id` (bigIncrements)
- `user_id` (foreign key -> users)
- `order_id` (string, unique)
- `pakasir_txn_id` (string, nullable)
- `amount` & `fee` (integer)
- `payment_method` (string)
- `status` (enum: 'pending', 'completed', 'canceled')
- `item_type` (enum: 'premium_plan', 'credit_topup') -> Mengidentifikasi apa yang dibeli.
- `payment_details` (json, nullable) -> qr_string, va_number, link

## 5. Kebutuhan API (Untuk Testing Dummy Frontend)
Sambil menunggu API asli Pakasir, *backend* perlu menyediakan endpoint *dummy*:
1. `POST /api/v1/payments/dummy-create` -> Return QR/VA palsu.
2. `POST /api/v1/payments/dummy-success` -> Endpoint bagi frontend untuk menyimulasikan Webhook (mengubah status transaksi jadi `completed` dan memberikan hak Premium).
