-- ==============================================================================
-- DATABASE LATIHAN KONSISTEN: icgamez_store
-- Alur 13: SQL & Basis Data (BAB 1 - BAB 4)
-- ==============================================================================

-- 1. Tabel Kategori Produk
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

-- 2. Tabel Pemasok (Suppliers)
CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    contact_name TEXT,
    phone TEXT,
    city TEXT
);

-- 3. Tabel Pelanggan (Customers)
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    city TEXT,
    created_at TEXT
);

-- 4. Tabel Pegawai (Employees)
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    salary INTEGER NOT NULL,
    hire_date TEXT
);

-- 5. Tabel Produk (Products)
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    category_id INTEGER,
    supplier_id INTEGER,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    stock INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- 6. Tabel Header Pesanan (Orders)
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    employee_id INTEGER,
    order_date TEXT NOT NULL,
    status TEXT NOT NULL, -- 'completed', 'pending', 'cancelled'
    total_amount INTEGER NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- 7. Tabel Detail Pesanan (Order Items)
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    unit_price INTEGER NOT NULL,
    subtotal INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 8. Tabel Pembayaran (Payments)
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY,
    order_id INTEGER,
    payment_method TEXT NOT NULL, -- 'QRIS', 'Transfer Bank', 'Kartu Kredit', 'E-Wallet'
    amount INTEGER NOT NULL,
    payment_date TEXT NOT NULL,
    status TEXT NOT NULL, -- 'success', 'pending', 'failed'
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- ==============================================================================
-- SEED DATA: icgamez_store
-- ==============================================================================

-- 1. Kategori (5 kategori)
INSERT INTO categories (id, name, description) VALUES
(1, 'Keyboard', 'Keyboard mekanikal, gaming, dan produktivitas harian'),
(2, 'Mouse', 'Mouse gaming presisi tinggi, nirkabel, dan ergonomis'),
(3, 'Monitor', 'Monitor resolusi tinggi untuk gaming dan desain grafis'),
(4, 'Audio', 'Headset, headphone studio, mikrofon, dan soundbar gaming'),
(5, 'Aksesoris', 'Mousepad, deskmat, kabel braided, dan headphone stand');

-- 2. Pemasok (6 supplier)
INSERT INTO suppliers (id, name, contact_name, phone, city) VALUES
(1, 'PT Tech Mandiri', 'Hendra Wijaya', '081234567890', 'Bandung'),
(2, 'CV Elektronika Jaya', 'Ratna Sari', '081398765432', 'Jakarta'),
(3, 'PT Global Sukses', 'Bambang Irawan', '082155443322', 'Surabaya'),
(4, 'Digital Nusantara', 'Dewi Anggraini', '085277889900', 'Semarang'),
(5, 'PT Sinar Komputer', 'Agus Prasetyo', '087811223344', 'Yogyakarta'),
(6, 'Mega Peripheral', 'Fajar Ramadhan', '089633445566', 'Medan');

-- 3. Pelanggan (15 pelanggan)
INSERT INTO customers (id, name, email, phone, city, created_at) VALUES
(1, 'Andi Pratama', 'andi.pratama@gmail.com', '081211112222', 'Bandung', '2024-01-05'),
(2, 'Budi Santoso', 'budi.santoso@gmail.com', '081233334444', 'Jakarta', '2024-01-08'),
(3, 'Citra Lestari', 'citra.lestari@yahoo.com', '081355556666', 'Surabaya', '2024-01-12'),
(4, 'Dina Maharani', 'dina.m@gmail.com', '081377778888', 'Semarang', '2024-01-15'),
(5, 'Eko Prasetyo', 'eko.prasetyo@gmail.com', '082199990000', 'Yogyakarta', '2024-01-20'),
(6, 'Fani Rahmawati', 'fani.rahma@gmail.com', '082112345678', 'Bandung', '2024-01-22'),
(7, 'Gilang Perdana', 'gilang.p@hotmail.com', '085223456789', 'Jakarta', '2024-01-25'),
(8, 'Hani Wulandari', 'hani.wulan@gmail.com', '085234567890', 'Medan', '2024-02-01'),
(9, 'Indra Gunawan', 'indra.gunawan@gmail.com', '087845678901', 'Surabaya', '2024-02-05'),
(10, 'Jessica Tan', 'jessica.tan@gmail.com', '087856789012', 'Jakarta', '2024-02-10'),
(11, 'Kevin Sanjaya', 'kevin.s@gmail.com', '089667890123', 'Bandung', '2024-02-14'),
(12, 'Lina Marlina', 'lina.marlina@gmail.com', '089678901234', 'Semarang', '2024-02-18'),
(13, 'Muhammad Rizky', 'm.rizky@gmail.com', '081289012345', 'Yogyakarta', '2024-02-22'),
(14, 'Nadia Safitri', 'nadia.safitri@gmail.com', '081290123456', 'Malang', '2024-03-01'),
(15, 'Oscar Pratama', 'oscar.p@gmail.com', '081301234567', 'Denpasar', '2024-03-05');

-- 4. Pegawai (6 pegawai)
INSERT INTO employees (id, name, role, salary, hire_date) VALUES
(1, 'Rian Ardianto', 'Admin', 5500000, '2023-01-15'),
(2, 'Siti Nurhaliza', 'Kasir', 4200000, '2023-03-10'),
(3, 'Doni Setiawan', 'Warehouse', 4500000, '2023-05-01'),
(4, 'Maya Agustina', 'Sales', 4800000, '2023-06-20'),
(5, 'Eko Wahyudi', 'Manager', 8500000, '2022-10-01'),
(6, 'Tari Melati', 'CS', 4000000, '2023-08-15');

-- 5. Produk (22 produk)
INSERT INTO products (id, category_id, supplier_id, name, price, stock) VALUES
(1, 1, 1, 'MechaKey K1 Blue Switch', 450000, 25),
(2, 1, 1, 'MechaKey K2 Red Switch Wireless', 650000, 18),
(3, 1, 2, 'ProTypist Ergonomic Keyboard', 850000, 12),
(4, 1, 4, 'CyberBoard RGB TKL', 550000, 30),
(5, 2, 1, 'SwiftMouse M1 Optical', 125000, 45),
(6, 2, 2, 'SwiftMouse M2 Wireless Gaming', 275000, 32),
(7, 2, 3, 'AeroGrip Ultralight 58g', 450000, 20),
(8, 2, 6, 'ErgoMaster Vertical Wireless', 350000, 15),
(9, 3, 2, 'VisionPro 24 FHD 75Hz', 1450000, 14),
(10, 3, 3, 'VisionPro 27 QHD 165Hz IPS', 3200000, 8),
(11, 3, 3, 'UltraWide 34 Curved 144Hz', 5500000, 5),
(12, 3, 5, 'CompactScreen 22 Office FHD', 1100000, 22),
(13, 4, 4, 'SoundPod X Wireless Earbuds', 375000, 40),
(14, 4, 5, 'StudioPro Over-Ear Headset', 750000, 16),
(15, 4, 5, 'GamerStrike 7.1 Surround Sound', 490000, 25),
(16, 4, 6, 'VoiceClear Condenser USB Mic', 520000, 19),
(17, 5, 1, 'GlideMat XL Speed Surface', 95000, 50),
(18, 5, 2, 'DeskMat Aurora 900x400 RGB', 185000, 35),
(19, 5, 4, 'AluStand Headphone Holder', 120000, 28),
(20, 5, 6, 'Coiled Cable Aviator USB-C', 145000, 40),
(21, 1, 3, 'Phantom 65 Hot-swappable', 980000, 10),
(22, 2, 5, 'ViperSpeed 8K Polling Rate', 890000, 12);

-- 6. Header Pesanan (28 transaksi)
INSERT INTO orders (id, customer_id, employee_id, order_date, status, total_amount) VALUES
(1, 1, 2, '2024-01-10', 'completed', 575000),
(2, 2, 2, '2024-01-12', 'completed', 3475000),
(3, 3, 4, '2024-01-15', 'completed', 650000),
(4, 4, 2, '2024-01-18', 'completed', 220000),
(5, 5, 4, '2024-01-22', 'completed', 1450000),
(6, 6, 2, '2024-01-25', 'completed', 925000),
(7, 7, 4, '2024-01-28', 'completed', 450000),
(8, 8, 2, '2024-02-02', 'completed', 1240000),
(9, 9, 4, '2024-02-05', 'cancelled', 3200000),
(10, 10, 2, '2024-02-08', 'completed', 1530000),
(11, 1, 4, '2024-02-12', 'completed', 275000),
(12, 11, 2, '2024-02-15', 'completed', 1125000),
(13, 12, 4, '2024-02-19', 'completed', 645000),
(14, 13, 2, '2024-02-23', 'completed', 450000),
(15, 2, 4, '2024-02-26', 'completed', 890000),
(16, 14, 2, '2024-03-02', 'completed', 1450000),
(17, 15, 4, '2024-03-05', 'completed', 735000),
(18, 3, 2, '2024-03-08', 'completed', 185000),
(19, 4, 4, '2024-03-10', 'completed', 5500000),
(20, 5, 2, '2024-03-12', 'completed', 570000),
(21, 6, 4, '2024-03-15', 'pending', 980000),
(22, 7, 2, '2024-03-16', 'completed', 490000),
(23, 8, 4, '2024-03-18', 'completed', 350000),
(24, 10, 2, '2024-03-20', 'completed', 850000),
(25, 11, 4, '2024-03-22', 'completed', 615000),
(26, 12, 2, '2024-03-23', 'completed', 125000),
(27, 13, 4, '2024-03-24', 'completed', 120000),
(28, 1, 2, '2024-03-25', 'pending', 3200000);

-- 7. Detail Pesanan (Order Items) (~42 items)
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal) VALUES
(1, 1, 1, 1, 450000, 450000),
(2, 1, 5, 1, 125000, 125000),
(3, 2, 6, 1, 275000, 275000),
(4, 2, 10, 1, 3200000, 3200000),
(5, 3, 2, 1, 650000, 650000),
(6, 4, 17, 1, 95000, 95000),
(7, 4, 5, 1, 125000, 125000),
(8, 5, 9, 1, 1450000, 1450000),
(9, 6, 2, 1, 650000, 650000),
(10, 6, 6, 1, 275000, 275000),
(11, 7, 7, 1, 450000, 450000),
(12, 8, 14, 1, 750000, 750000),
(13, 8, 15, 1, 490000, 490000),
(14, 9, 10, 1, 3200000, 3200000),
(15, 10, 3, 1, 850000, 850000),
(16, 10, 13, 1, 375000, 375000),
(17, 10, 18, 1, 185000, 185000),
(18, 10, 19, 1, 120000, 120000),
(19, 11, 6, 1, 275000, 275000),
(20, 12, 4, 1, 550000, 550000),
(21, 12, 16, 1, 520000, 520000),
(22, 12, 17, 1, 95000, 95000),
(23, 13, 15, 1, 490000, 490000),
(24, 13, 20, 1, 145000, 145000),
(25, 14, 1, 1, 450000, 450000),
(26, 15, 22, 1, 890000, 890000),
(27, 16, 9, 1, 1450000, 1450000),
(28, 17, 13, 1, 375000, 375000),
(29, 17, 8, 1, 350000, 350000),
(30, 18, 18, 1, 185000, 185000),
(31, 19, 11, 1, 5500000, 5500000),
(32, 20, 7, 1, 450000, 450000),
(33, 20, 19, 1, 120000, 120000),
(34, 21, 21, 1, 980000, 980000),
(35, 22, 15, 1, 490000, 490000),
(36, 23, 8, 1, 350000, 350000),
(37, 24, 3, 1, 850000, 850000),
(38, 25, 1, 1, 450000, 450000),
(39, 25, 14, 1, 165000, 165000),
(40, 26, 5, 1, 125000, 125000),
(41, 27, 19, 1, 120000, 120000),
(42, 28, 10, 1, 3200000, 3200000);

-- 8. Pembayaran (28 transaksi)
INSERT INTO payments (id, order_id, payment_method, amount, payment_date, status) VALUES
(1, 1, 'QRIS', 575000, '2024-01-10', 'success'),
(2, 2, 'Transfer Bank', 3475000, '2024-01-12', 'success'),
(3, 3, 'E-Wallet', 650000, '2024-01-15', 'success'),
(4, 4, 'QRIS', 220000, '2024-01-18', 'success'),
(5, 5, 'Transfer Bank', 1450000, '2024-01-22', 'success'),
(6, 6, 'Kartu Kredit', 925000, '2024-01-25', 'success'),
(7, 7, 'QRIS', 450000, '2024-01-28', 'success'),
(8, 8, 'E-Wallet', 1240000, '2024-02-02', 'success'),
(9, 9, 'Transfer Bank', 3200000, '2024-02-05', 'failed'),
(10, 10, 'Kartu Kredit', 1530000, '2024-02-08', 'success'),
(11, 11, 'QRIS', 275000, '2024-02-12', 'success'),
(12, 12, 'Transfer Bank', 1125000, '2024-02-15', 'success'),
(13, 13, 'E-Wallet', 645000, '2024-02-19', 'success'),
(14, 14, 'QRIS', 450000, '2024-02-23', 'success'),
(15, 15, 'Kartu Kredit', 890000, '2024-02-26', 'success'),
(16, 16, 'Transfer Bank', 1450000, '2024-03-02', 'success'),
(17, 17, 'QRIS', 735000, '2024-03-05', 'success'),
(18, 18, 'E-Wallet', 185000, '2024-03-08', 'success'),
(19, 19, 'Transfer Bank', 5500000, '2024-03-10', 'success'),
(20, 20, 'QRIS', 570000, '2024-03-12', 'success'),
(21, 21, 'Transfer Bank', 980000, '2024-03-15', 'pending'),
(22, 22, 'QRIS', 490000, '2024-03-16', 'success'),
(23, 23, 'E-Wallet', 350000, '2024-03-18', 'success'),
(24, 24, 'Kartu Kredit', 850000, '2024-03-20', 'success'),
(25, 25, 'Transfer Bank', 615000, '2024-03-22', 'success'),
(26, 26, 'QRIS', 125000, '2024-03-23', 'success'),
(27, 27, 'QRIS', 120000, '2024-03-24', 'success'),
(28, 28, 'Transfer Bank', 3200000, '2024-03-25', 'pending');
