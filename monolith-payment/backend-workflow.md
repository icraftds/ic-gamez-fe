# Alur Kerja (Workflow) - Monolith Payment

## 1. Alur Pembuatan Tagihan (Checkout)
Dalam pendekatan monolith, komunikasi jauh lebih sederhana karena tidak ada perantara.

```mermaid
sequenceDiagram
    participant Frontend as Vue SPA
    participant Backend as IC Game Z Backend
    participant Pakasir as Pakasir API v2
    
    Frontend->>Backend: POST /api/v1/payments (item_type: premium_plan)
    Backend->>Backend: Simpan `transactions` (user_id, status: pending)
    Backend->>Pakasir: POST /api/v2/create-transaction
    Pakasir-->>Backend: Response (txn_id, qr_string)
    Backend->>Backend: Update `transactions`
    Backend-->>Frontend: Response (QR / VA)
    Frontend->>User: Tampilkan UI Pembayaran
```

## 2. Alur Pembayaran Berhasil (Webhook Langsung)
Tidak ada pesan internal antar server. Segera setelah webhook divalidasi, *benefit* langsung diberikan.

```mermaid
sequenceDiagram
    participant Pakasir as Pakasir API v2
    participant Backend as IC Game Z Backend
    
    Pakasir->>Backend: POST /api/v1/webhooks/pakasir (txn_id, status: completed)
    Backend->>Backend: Validasi X-Secret
    Backend->>Backend: Update `transactions` (status: completed)
    
    alt item_type == 'premium_plan'
        Backend->>Backend: UPDATE users SET plan = 'premium'
    end
    
    Backend-->>Pakasir: 200 OK
```

## 3. Alur Dummy Testing (Front-End Driven Simulation)
Untuk kebutuhan pengetesan UI/Animasi sebelum Pakasir aktif:

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Vue SPA
    participant Backend as IC Game Z Backend
    
    User->>Frontend: Klik "Beli Paket Premium"
    Frontend->>Frontend: Tampilkan Skeleton / Loading
    Frontend->>Backend: POST /api/v1/payments/dummy-create
    Backend-->>Frontend: Return QR Palsu & order_id
    Frontend->>User: Tampilkan QR Palsu + Tombol "Simulasi Sukses"
    
    User->>Frontend: Klik "Simulasi Sukses"
    Frontend->>Backend: POST /api/v1/payments/dummy-success (order_id)
    Backend->>Backend: Update transaksi -> completed + Set Premium
    Backend-->>Frontend: 200 OK
    Frontend->>User: Mainkan Animasi Sukses & Popup "Selamat!"
```
