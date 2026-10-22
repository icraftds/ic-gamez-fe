/**
 * dbSchemaInspector.js
 * Visual Data Dictionary & Schema Inspector untuk Database IC Game-Z Store (SQLite).
 * Sesuai 100% dengan skema kanonikal 111 materi Alur 13 (SQL & Basis Data).
 */

import { ICGAMEZ_STORE_SCHEMA_SQL } from './icgamezStoreSchema'

export const ICGAMEZ_STORE_METADATA = [
  {
    "name": "customers",
    "label": "Pelanggan (Customers)",
    "icon": "fa-solid fa-users",
    "description": "Data akun pelanggan/pembeli terdaftar di IC Game-Z Store.",
    "columns": [
      {
        "name": "id",
        "type": "INTEGER",
        "isPk": true,
        "notNull": false,
        "isFk": false,
        "fkTarget": null,
        "description": "Kunci utama pelanggan"
      },
      {
        "name": "name",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Nama pelanggan"
      },
      {
        "name": "email",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Email unik pelanggan"
      },
      {
        "name": "city",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kota pelanggan"
      },
      {
        "name": "joined_at",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Tanggal bergabung"
      }
    ],
    "foreignKeys": [],
    "totalRows": 15,
    "sampleRows": [
      {
        "id": 1,
        "name": "Andi Pratama",
        "email": "andi@mail.test",
        "city": "Bandung",
        "joined_at": "2026-01-05"
      },
      {
        "id": 2,
        "name": "Budi Santoso",
        "email": "budi@mail.test",
        "city": "Jakarta",
        "joined_at": "2026-01-12"
      },
      {
        "id": 3,
        "name": "Citra Lestari",
        "email": "citra@mail.test",
        "city": "Surabaya",
        "joined_at": "2026-01-18"
      },
      {
        "id": 4,
        "name": "Dina Maharani",
        "email": "dina@mail.test",
        "city": "Semarang",
        "joined_at": "2026-02-02"
      },
      {
        "id": 5,
        "name": "Eko Saputra",
        "email": "eko@mail.test",
        "city": "Bandung",
        "joined_at": "2026-02-08"
      }
    ]
  },
  {
    "name": "categories",
    "label": "Kategori Produk",
    "icon": "fa-solid fa-tags",
    "description": "Kategori dan kelompok produk periferal gaming.",
    "columns": [
      {
        "name": "id",
        "type": "INTEGER",
        "isPk": true,
        "notNull": false,
        "isFk": false,
        "fkTarget": null,
        "description": "Kunci utama kategori"
      },
      {
        "name": "name",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Nama kategori unik"
      }
    ],
    "foreignKeys": [],
    "totalRows": 5,
    "sampleRows": [
      {
        "id": 1,
        "name": "Keyboard"
      },
      {
        "id": 2,
        "name": "Mouse"
      },
      {
        "id": 3,
        "name": "Monitor"
      },
      {
        "id": 4,
        "name": "Audio"
      },
      {
        "id": 5,
        "name": "Aksesori"
      }
    ]
  },
  {
    "name": "suppliers",
    "label": "Pemasok (Suppliers)",
    "icon": "fa-solid fa-truck-field",
    "description": "Distributor dan mitra pemasok perangkat gaming.",
    "columns": [
      {
        "name": "id",
        "type": "INTEGER",
        "isPk": true,
        "notNull": false,
        "isFk": false,
        "fkTarget": null,
        "description": "Kunci utama supplier"
      },
      {
        "name": "name",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Nama supplier"
      },
      {
        "name": "city",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kota supplier"
      }
    ],
    "foreignKeys": [],
    "totalRows": 6,
    "sampleRows": [
      {
        "id": 1,
        "name": "Nusantara Tech",
        "city": "Jakarta"
      },
      {
        "id": 2,
        "name": "Prima Digital",
        "city": "Bandung"
      },
      {
        "id": 3,
        "name": "Surya Komputer",
        "city": "Surabaya"
      },
      {
        "id": 4,
        "name": "Jogja Periferal",
        "city": "Yogyakarta"
      },
      {
        "id": 5,
        "name": "Semarang Elektronik",
        "city": "Semarang"
      }
    ]
  },
  {
    "name": "products",
    "label": "Produk & Hardware",
    "icon": "fa-solid fa-box-open",
    "description": "Katalog barang dan periferal gaming lengkap dengan harga dan stok.",
    "columns": [
      {
        "name": "id",
        "type": "INTEGER",
        "isPk": true,
        "notNull": false,
        "isFk": false,
        "fkTarget": null,
        "description": "Kunci utama produk"
      },
      {
        "name": "category_id",
        "type": "INTEGER",
        "isPk": false,
        "notNull": true,
        "isFk": true,
        "fkTarget": "categories.id",
        "description": "Referensi kategori"
      },
      {
        "name": "supplier_id",
        "type": "INTEGER",
        "isPk": false,
        "notNull": true,
        "isFk": true,
        "fkTarget": "suppliers.id",
        "description": "Referensi supplier"
      },
      {
        "name": "name",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Nama produk"
      },
      {
        "name": "price",
        "type": "INTEGER",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Harga produk rupiah"
      },
      {
        "name": "stock",
        "type": "INTEGER",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Stok saat ini"
      },
      {
        "name": "discontinued",
        "type": "INTEGER",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Penanda produk dihentikan"
      }
    ],
    "foreignKeys": [
      {
        "from": "supplier_id",
        "toTable": "suppliers",
        "toColumn": "id"
      },
      {
        "from": "category_id",
        "toTable": "categories",
        "toColumn": "id"
      }
    ],
    "totalRows": 24,
    "sampleRows": [
      {
        "id": 1,
        "category_id": 1,
        "supplier_id": 1,
        "name": "MechaKey K1",
        "price": 450000,
        "stock": 18,
        "discontinued": 0
      },
      {
        "id": 2,
        "category_id": 1,
        "supplier_id": 2,
        "name": "TypePro TKL",
        "price": 625000,
        "stock": 12,
        "discontinued": 0
      },
      {
        "id": 3,
        "category_id": 1,
        "supplier_id": 4,
        "name": "SilentBoard S2",
        "price": 325000,
        "stock": 25,
        "discontinued": 0
      },
      {
        "id": 4,
        "category_id": 1,
        "supplier_id": 5,
        "name": "RetroKeys R1",
        "price": 780000,
        "stock": 7,
        "discontinued": 0
      },
      {
        "id": 5,
        "category_id": 2,
        "supplier_id": 1,
        "name": "SwiftMouse M2",
        "price": 225000,
        "stock": 35,
        "discontinued": 0
      }
    ]
  },
  {
    "name": "employees",
    "label": "Pegawai (Employees)",
    "icon": "fa-solid fa-user-tie",
    "description": "Staf internal toko (Manager, Sales, Support, Warehouse).",
    "columns": [
      {
        "name": "id",
        "type": "INTEGER",
        "isPk": true,
        "notNull": false,
        "isFk": false,
        "fkTarget": null,
        "description": "Kunci utama pegawai"
      },
      {
        "name": "name",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Nama pegawai"
      },
      {
        "name": "role",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Peran pegawai"
      },
      {
        "name": "manager_id",
        "type": "INTEGER",
        "isPk": false,
        "notNull": false,
        "isFk": true,
        "fkTarget": "employees.id",
        "description": "Atasan pegawai"
      }
    ],
    "foreignKeys": [
      {
        "from": "manager_id",
        "toTable": "employees",
        "toColumn": "id"
      }
    ],
    "totalRows": 6,
    "sampleRows": [
      {
        "id": 1,
        "name": "Rina",
        "role": "Manager",
        "manager_id": null
      },
      {
        "id": 2,
        "name": "Seno",
        "role": "Sales",
        "manager_id": 1
      },
      {
        "id": 3,
        "name": "Tari",
        "role": "Sales",
        "manager_id": 1
      },
      {
        "id": 4,
        "name": "Umar",
        "role": "Support",
        "manager_id": 1
      },
      {
        "id": 5,
        "name": "Vina",
        "role": "Sales",
        "manager_id": 1
      }
    ]
  },
  {
    "name": "orders",
    "label": "Pesanan (Orders)",
    "icon": "fa-solid fa-receipt",
    "description": "Header transaksi belanja pelanggan dengan status pesanan.",
    "columns": [
      {
        "name": "id",
        "type": "INTEGER",
        "isPk": true,
        "notNull": false,
        "isFk": false,
        "fkTarget": null,
        "description": "Kunci utama pesanan"
      },
      {
        "name": "customer_id",
        "type": "INTEGER",
        "isPk": false,
        "notNull": true,
        "isFk": true,
        "fkTarget": "customers.id",
        "description": "Pelanggan pemilik pesanan"
      },
      {
        "name": "employee_id",
        "type": "INTEGER",
        "isPk": false,
        "notNull": true,
        "isFk": true,
        "fkTarget": "employees.id",
        "description": "Pegawai yang menangani pesanan"
      },
      {
        "name": "order_date",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Tanggal pesanan"
      },
      {
        "name": "status",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Status pesanan"
      },
      {
        "name": "shipping_city",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kota pengiriman"
      }
    ],
    "foreignKeys": [
      {
        "from": "employee_id",
        "toTable": "employees",
        "toColumn": "id"
      },
      {
        "from": "customer_id",
        "toTable": "customers",
        "toColumn": "id"
      }
    ],
    "totalRows": 30,
    "sampleRows": [
      {
        "id": 1,
        "customer_id": 1,
        "employee_id": 2,
        "order_date": "2026-04-01",
        "status": "paid",
        "shipping_city": "Bandung"
      },
      {
        "id": 2,
        "customer_id": 2,
        "employee_id": 3,
        "order_date": "2026-04-02",
        "status": "paid",
        "shipping_city": "Jakarta"
      },
      {
        "id": 3,
        "customer_id": 3,
        "employee_id": 2,
        "order_date": "2026-04-03",
        "status": "paid",
        "shipping_city": "Surabaya"
      },
      {
        "id": 4,
        "customer_id": 4,
        "employee_id": 5,
        "order_date": "2026-04-04",
        "status": "pending",
        "shipping_city": "Semarang"
      },
      {
        "id": 5,
        "customer_id": 5,
        "employee_id": 3,
        "order_date": "2026-04-05",
        "status": "paid",
        "shipping_city": "Bandung"
      }
    ]
  },
  {
    "name": "order_items",
    "label": "Detail Pesanan (Order Items)",
    "icon": "fa-solid fa-list-check",
    "description": "Rincian unit produk dan harga per item dalam setiap pesanan.",
    "columns": [
      {
        "name": "id",
        "type": "INTEGER",
        "isPk": true,
        "notNull": false,
        "isFk": false,
        "fkTarget": null,
        "description": "Kunci utama item pesanan"
      },
      {
        "name": "order_id",
        "type": "INTEGER",
        "isPk": false,
        "notNull": true,
        "isFk": true,
        "fkTarget": "orders.id",
        "description": "Referensi pesanan"
      },
      {
        "name": "product_id",
        "type": "INTEGER",
        "isPk": false,
        "notNull": true,
        "isFk": true,
        "fkTarget": "products.id",
        "description": "Referensi produk"
      },
      {
        "name": "quantity",
        "type": "INTEGER",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Jumlah unit"
      },
      {
        "name": "unit_price",
        "type": "INTEGER",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Harga saat transaksi"
      }
    ],
    "foreignKeys": [
      {
        "from": "product_id",
        "toTable": "products",
        "toColumn": "id"
      },
      {
        "from": "order_id",
        "toTable": "orders",
        "toColumn": "id"
      }
    ],
    "totalRows": 60,
    "sampleRows": [
      {
        "id": 1,
        "order_id": 1,
        "product_id": 1,
        "quantity": 1,
        "unit_price": 450000
      },
      {
        "id": 2,
        "order_id": 1,
        "product_id": 5,
        "quantity": 2,
        "unit_price": 225000
      },
      {
        "id": 3,
        "order_id": 2,
        "product_id": 9,
        "quantity": 1,
        "unit_price": 1850000
      },
      {
        "id": 4,
        "order_id": 2,
        "product_id": 17,
        "quantity": 1,
        "unit_price": 275000
      },
      {
        "id": 5,
        "order_id": 3,
        "product_id": 14,
        "quantity": 1,
        "unit_price": 890000
      }
    ]
  },
  {
    "name": "payments",
    "label": "Pembayaran (Payments)",
    "icon": "fa-solid fa-credit-card",
    "description": "Bukti dan status pelunasan transaksi pesanan pelanggan.",
    "columns": [
      {
        "name": "id",
        "type": "INTEGER",
        "isPk": true,
        "notNull": false,
        "isFk": false,
        "fkTarget": null,
        "description": "Kunci utama pembayaran"
      },
      {
        "name": "order_id",
        "type": "INTEGER",
        "isPk": false,
        "notNull": true,
        "isFk": true,
        "fkTarget": "orders.id",
        "description": "Referensi unik pesanan"
      },
      {
        "name": "payment_method",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Metode pembayaran"
      },
      {
        "name": "paid_amount",
        "type": "INTEGER",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Nominal pembayaran"
      },
      {
        "name": "paid_at",
        "type": "TEXT",
        "isPk": false,
        "notNull": false,
        "isFk": false,
        "fkTarget": null,
        "description": "Tanggal bayar, null jika belum lunas"
      }
    ],
    "foreignKeys": [
      {
        "from": "order_id",
        "toTable": "orders",
        "toColumn": "id"
      }
    ],
    "totalRows": 30,
    "sampleRows": [
      {
        "id": 1,
        "order_id": 1,
        "payment_method": "transfer",
        "paid_amount": 900000,
        "paid_at": "2026-04-01"
      },
      {
        "id": 2,
        "order_id": 2,
        "payment_method": "card",
        "paid_amount": 2125000,
        "paid_at": "2026-04-02"
      },
      {
        "id": 3,
        "order_id": 3,
        "payment_method": "ewallet",
        "paid_amount": 1080000,
        "paid_at": "2026-04-03"
      },
      {
        "id": 4,
        "order_id": 4,
        "payment_method": "transfer",
        "paid_amount": 695000,
        "paid_at": null
      },
      {
        "id": 5,
        "order_id": 5,
        "payment_method": "card",
        "paid_amount": 2595000,
        "paid_at": "2026-04-05"
      }
    ]
  },
  {
    "name": "sales_raw",
    "label": "Data Mentah Penjualan (Sales Raw)",
    "icon": "fa-solid fa-file-invoice-dollar",
    "description": "Tabel denormalisasi transaksi mentah untuk analisis normalisasi.",
    "columns": [
      {
        "name": "row_id",
        "type": "INTEGER",
        "isPk": true,
        "notNull": false,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom row_id pada tabel sales_raw"
      },
      {
        "name": "order_code",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom order_code pada tabel sales_raw"
      },
      {
        "name": "order_date",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom order_date pada tabel sales_raw"
      },
      {
        "name": "customer_name",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom customer_name pada tabel sales_raw"
      },
      {
        "name": "customer_email",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom customer_email pada tabel sales_raw"
      },
      {
        "name": "customer_city",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom customer_city pada tabel sales_raw"
      },
      {
        "name": "product_name",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom product_name pada tabel sales_raw"
      },
      {
        "name": "category_name",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom category_name pada tabel sales_raw"
      },
      {
        "name": "supplier_name",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom supplier_name pada tabel sales_raw"
      },
      {
        "name": "quantity",
        "type": "INTEGER",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom quantity pada tabel sales_raw"
      },
      {
        "name": "unit_price",
        "type": "INTEGER",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom unit_price pada tabel sales_raw"
      }
    ],
    "foreignKeys": [],
    "totalRows": 20,
    "sampleRows": [
      {
        "row_id": 1,
        "order_code": "ORD-001",
        "order_date": "2026-04-01",
        "customer_name": "Andi Pratama",
        "customer_email": "andi@mail.test",
        "customer_city": "Bandung",
        "product_name": "MechaKey K1",
        "category_name": "Keyboard",
        "supplier_name": "Nusantara Tech",
        "quantity": 1,
        "unit_price": 450000
      },
      {
        "row_id": 2,
        "order_code": "ORD-001",
        "order_date": "2026-04-01",
        "customer_name": "Andi Pratama",
        "customer_email": "andi@mail.test",
        "customer_city": "Bandung",
        "product_name": "SwiftMouse M2",
        "category_name": "Mouse",
        "supplier_name": "Nusantara Tech",
        "quantity": 2,
        "unit_price": 225000
      },
      {
        "row_id": 3,
        "order_code": "ORD-002",
        "order_date": "2026-04-02",
        "customer_name": "Budi Santoso",
        "customer_email": "budi@mail.test",
        "customer_city": "Jakarta",
        "product_name": "VisionPro 24",
        "category_name": "Monitor",
        "supplier_name": "Surya Komputer",
        "quantity": 1,
        "unit_price": 1850000
      },
      {
        "row_id": 4,
        "order_code": "ORD-002",
        "order_date": "2026-04-02",
        "customer_name": "Budi Santoso",
        "customer_email": "budi@mail.test",
        "customer_city": "Jakarta",
        "product_name": "USB Hub 7P",
        "category_name": "Aksesori",
        "supplier_name": "Prima Digital",
        "quantity": 1,
        "unit_price": 275000
      },
      {
        "row_id": 5,
        "order_code": "ORD-003",
        "order_date": "2026-04-03",
        "customer_name": "Citra Lestari",
        "customer_email": "citra@mail.test",
        "customer_city": "Surabaya",
        "product_name": "StudioHead H7",
        "category_name": "Audio",
        "supplier_name": "Surya Komputer",
        "quantity": 1,
        "unit_price": 890000
      }
    ]
  },
  {
    "name": "schema_dictionary",
    "label": "Kamus Skema (Schema Dictionary)",
    "icon": "fa-solid fa-book-bookmark",
    "description": "Kamus metadata kolom, tipe data, dan integritas skema.",
    "columns": [
      {
        "name": "table_name",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom table_name pada tabel schema_dictionary"
      },
      {
        "name": "column_name",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom column_name pada tabel schema_dictionary"
      },
      {
        "name": "data_type",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom data_type pada tabel schema_dictionary"
      },
      {
        "name": "is_primary_key",
        "type": "INTEGER",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom is_primary_key pada tabel schema_dictionary"
      },
      {
        "name": "is_foreign_key",
        "type": "INTEGER",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom is_foreign_key pada tabel schema_dictionary"
      },
      {
        "name": "allows_null",
        "type": "INTEGER",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom allows_null pada tabel schema_dictionary"
      },
      {
        "name": "description",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom description pada tabel schema_dictionary"
      }
    ],
    "foreignKeys": [],
    "totalRows": 37,
    "sampleRows": [
      {
        "table_name": "customers",
        "column_name": "id",
        "data_type": "INTEGER",
        "is_primary_key": 1,
        "is_foreign_key": 0,
        "allows_null": 0,
        "description": "Kunci utama pelanggan"
      },
      {
        "table_name": "customers",
        "column_name": "name",
        "data_type": "TEXT",
        "is_primary_key": 0,
        "is_foreign_key": 0,
        "allows_null": 0,
        "description": "Nama pelanggan"
      },
      {
        "table_name": "customers",
        "column_name": "email",
        "data_type": "TEXT",
        "is_primary_key": 0,
        "is_foreign_key": 0,
        "allows_null": 0,
        "description": "Email unik pelanggan"
      },
      {
        "table_name": "customers",
        "column_name": "city",
        "data_type": "TEXT",
        "is_primary_key": 0,
        "is_foreign_key": 0,
        "allows_null": 0,
        "description": "Kota pelanggan"
      },
      {
        "table_name": "customers",
        "column_name": "joined_at",
        "data_type": "TEXT",
        "is_primary_key": 0,
        "is_foreign_key": 0,
        "allows_null": 0,
        "description": "Tanggal bergabung"
      }
    ]
  },
  {
    "name": "relationships",
    "label": "Relasi Antar Tabel (Relationships)",
    "icon": "fa-solid fa-diagram-project",
    "description": "Katalog relasi foreign key dan kardinalitas antar entitas.",
    "columns": [
      {
        "name": "relation_name",
        "type": "TEXT",
        "isPk": true,
        "notNull": false,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom relation_name pada tabel relationships"
      },
      {
        "name": "parent_table",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom parent_table pada tabel relationships"
      },
      {
        "name": "child_table",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom child_table pada tabel relationships"
      },
      {
        "name": "parent_key",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom parent_key pada tabel relationships"
      },
      {
        "name": "child_key",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom child_key pada tabel relationships"
      },
      {
        "name": "cardinality",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom cardinality pada tabel relationships"
      }
    ],
    "foreignKeys": [],
    "totalRows": 7,
    "sampleRows": [
      {
        "relation_name": "customers_orders",
        "parent_table": "customers",
        "child_table": "orders",
        "parent_key": "id",
        "child_key": "customer_id",
        "cardinality": "1:N"
      },
      {
        "relation_name": "employees_orders",
        "parent_table": "employees",
        "child_table": "orders",
        "parent_key": "id",
        "child_key": "employee_id",
        "cardinality": "1:N"
      },
      {
        "relation_name": "orders_order_items",
        "parent_table": "orders",
        "child_table": "order_items",
        "parent_key": "id",
        "child_key": "order_id",
        "cardinality": "1:N"
      },
      {
        "relation_name": "products_order_items",
        "parent_table": "products",
        "child_table": "order_items",
        "parent_key": "id",
        "child_key": "product_id",
        "cardinality": "1:N"
      },
      {
        "relation_name": "categories_products",
        "parent_table": "categories",
        "child_table": "products",
        "parent_key": "id",
        "child_key": "category_id",
        "cardinality": "1:N"
      }
    ]
  },
  {
    "name": "index_catalog",
    "label": "Katalog Indeks (Index Catalog)",
    "icon": "fa-solid fa-bolt",
    "description": "Daftar indeks performa pencarian dan constraint keunikan.",
    "columns": [
      {
        "name": "index_name",
        "type": "TEXT",
        "isPk": true,
        "notNull": false,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom index_name pada tabel index_catalog"
      },
      {
        "name": "table_name",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom table_name pada tabel index_catalog"
      },
      {
        "name": "columns_name",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom columns_name pada tabel index_catalog"
      },
      {
        "name": "purpose",
        "type": "TEXT",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom purpose pada tabel index_catalog"
      },
      {
        "name": "is_unique",
        "type": "INTEGER",
        "isPk": false,
        "notNull": true,
        "isFk": false,
        "fkTarget": null,
        "description": "Kolom is_unique pada tabel index_catalog"
      }
    ],
    "foreignKeys": [],
    "totalRows": 6,
    "sampleRows": [
      {
        "index_name": "idx_customers_email",
        "table_name": "customers",
        "columns_name": "email",
        "purpose": "Mempercepat pencarian pelanggan berdasarkan email",
        "is_unique": 1
      },
      {
        "index_name": "idx_products_category",
        "table_name": "products",
        "columns_name": "category_id",
        "purpose": "Mempercepat filter dan join berdasarkan kategori",
        "is_unique": 0
      },
      {
        "index_name": "idx_orders_customer",
        "table_name": "orders",
        "columns_name": "customer_id",
        "purpose": "Mempercepat riwayat pesanan pelanggan",
        "is_unique": 0
      },
      {
        "index_name": "idx_orders_date",
        "table_name": "orders",
        "columns_name": "order_date",
        "purpose": "Mempercepat filter dan pengurutan berdasarkan tanggal",
        "is_unique": 0
      },
      {
        "index_name": "idx_order_items_order",
        "table_name": "order_items",
        "columns_name": "order_id",
        "purpose": "Mempercepat pengambilan detail item satu pesanan",
        "is_unique": 0
      }
    ]
  }
]

/**
 * Mendapatkan skema tabel lengkap beserta atributnya.
 * Jika customSetupSql diberikan (misal tantangan khusus), sistem mengekstrak secara dinamis dari SQLite.
 */
export async function getDatabaseSchemaMetadata(customSetupSql = null) {
  if (!customSetupSql || !customSetupSql.trim()) {
    return ICGAMEZ_STORE_METADATA
  }

  try {
    const { createFreshDatabase } = await import('./sqlEngine')
    const db = await createFreshDatabase(customSetupSql)

    const tablesRes = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    if (!tablesRes || tablesRes.length === 0) {
      return ICGAMEZ_STORE_METADATA
    }

    const tableNames = tablesRes[0].values.map(r => r[0])
    const dynamicTables = []

    // Ambil data schema_dictionary jika tersedia di database aktif
    const dictMap = {}
    try {
      const dictRes = db.exec("SELECT table_name, column_name, data_type, is_primary_key, is_foreign_key, allows_null, description FROM schema_dictionary")
      if (dictRes.length > 0) {
        dictRes[0].values.forEach(r => {
          dictMap[`${r[0]}.${r[1]}`] = {
            type: r[2],
            isPk: Boolean(r[3]),
            isFk: Boolean(r[4]),
            allowsNull: Boolean(r[5]),
            description: r[6]
          }
        })
      }
    } catch (e) {
      // Abaikan jika tabel schema_dictionary tidak ada pada custom setup
    }

    for (const tableName of tableNames) {
      // 1. Cek info tabel
      const infoRes = db.exec(`PRAGMA table_info("${tableName}")`)
      const columns = []

      // 2. Cek foreign keys
      const fkRes = db.exec(`PRAGMA foreign_key_list("${tableName}")`)
      const foreignKeys = []
      if (fkRes && fkRes.length > 0) {
        fkRes[0].values.forEach(row => {
          foreignKeys.push({
            from: row[3],
            toTable: row[2],
            toColumn: row[4] || 'id'
          })
        })
      }

      if (infoRes && infoRes.length > 0) {
        infoRes[0].values.forEach(row => {
          const colName = row[1]
          const fk = foreignKeys.find(f => f.from === colName)
          const metaDict = dictMap[`${tableName}.${colName}`]
          const existingMeta = ICGAMEZ_STORE_METADATA.find(m => m.name === tableName)
          const existingCol = existingMeta?.columns.find(c => c.name === colName)

          columns.push({
            name: colName,
            type: row[2] || 'TEXT',
            notNull: Boolean(row[3]),
            defaultValue: row[4],
            isPk: Boolean(row[5]),
            isFk: Boolean(fk),
            fkTarget: fk ? `${fk.toTable}.${fk.toColumn}` : null,
            description: metaDict?.description || existingCol?.description || `Kolom ${colName} pada tabel ${tableName}`
          })
        })
      }

      // 3. Ambil sample rows & total rows
      let sampleRows = []
      let totalRows = 0
      try {
        const countRes = db.exec(`SELECT COUNT(*) FROM "${tableName}"`)
        if (countRes && countRes[0] && countRes[0].values) {
          totalRows = countRes[0].values[0][0]
        }
        const sampleRes = db.exec(`SELECT * FROM "${tableName}" LIMIT 5`)
        if (sampleRes && sampleRes.length > 0) {
          const cols = sampleRes[0].columns
          sampleRows = sampleRes[0].values.map(r => {
            const obj = {}
            cols.forEach((c, idx) => { obj[c] = r[idx] })
            return obj
          })
        }
      } catch (e) {
        console.warn('Gagal load sample rows:', e)
      }

      const existingMeta = ICGAMEZ_STORE_METADATA.find(m => m.name === tableName)

      dynamicTables.push({
        name: tableName,
        label: existingMeta?.label || `Tabel ${tableName}`,
        icon: existingMeta?.icon || 'fa-solid fa-table',
        description: existingMeta?.description || `Struktur data tabel ${tableName} pada database latihan.`,
        columns,
        foreignKeys,
        totalRows: totalRows || sampleRows.length,
        sampleRows
      })
    }

    return dynamicTables.length > 0 ? dynamicTables : ICGAMEZ_STORE_METADATA
  } catch (err) {
    console.warn('[dbSchemaInspector] Fallback ke static schema:', err)
    return ICGAMEZ_STORE_METADATA
  }
}

/**
 * Mengambil data baris nyata dari SQLite in-memory untuk sebuah tabel.
 * @param {string} tableName - Nama tabel
 * @param {number} limit - Batas baris yang diambil (default 50)
 * @param {string|null} customInitSql - SQL kustom jika ada
 */
export async function fetchTableData(tableName, limit = 50, customInitSql = null) {
  try {
    const { createFreshDatabase } = await import('./sqlEngine')
    const db = await createFreshDatabase(customInitSql)

    // Hitung total baris
    let totalCount = 0
    try {
      const countRes = db.exec(`SELECT COUNT(*) as total FROM "${tableName}"`)
      if (countRes && countRes[0] && countRes[0].values) {
        totalCount = countRes[0].values[0][0]
      }
    } catch (e) {
      // ignore
    }

    // Ambil baris
    const res = db.exec(`SELECT * FROM "${tableName}" LIMIT ${limit}`)
    if (!res || res.length === 0) {
      return { columns: [], rows: [], totalCount }
    }

    const columns = res[0].columns
    const rows = res[0].values.map(val => {
      const row = {}
      columns.forEach((col, idx) => {
        row[col] = val[idx]
      })
      return row
    })

    return { columns, rows, totalCount: totalCount || rows.length }
  } catch (err) {
    console.warn(`[dbSchemaInspector] Fallback sampleRows untuk tabel ${tableName}:`, err)
    const fallback = ICGAMEZ_STORE_METADATA.find(t => t.name === tableName)
    return {
      columns: fallback?.columns.map(c => c.name) || [],
      rows: fallback?.sampleRows || [],
      totalCount: fallback?.totalRows || fallback?.sampleRows.length || 0
    }
  }
}
