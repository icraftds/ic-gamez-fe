/**
 * dbSchemaInspector.js
 * Visual Data Dictionary & Schema Inspector untuk Database IC Game-Z Store (SQLite).
 * Menyediakan definisi atribut, tipe data, foreign key, keterangan, serta sampel data nyata.
 */

import { ICGAMEZ_STORE_SCHEMA_SQL } from './icgamezStoreSchema'

export const ICGAMEZ_STORE_METADATA = [
  {
    name: 'categories',
    label: 'Kategori Produk',
    icon: 'fa-solid fa-tags',
    description: 'Menyimpan pengelompokan jenis produk dan periferal gaming.',
    columns: [
      { name: 'id', type: 'INTEGER', isPk: true, notNull: true, description: 'ID unik kategori (Primary Key)' },
      { name: 'name', type: 'TEXT', isPk: false, notNull: true, description: 'Nama kategori produk (Keyboard, Mouse, Monitor, dll.)' },
      { name: 'description', type: 'TEXT', isPk: false, notNull: false, description: 'Keterangan lengkap cakupan produk dalam kategori' }
    ],
    foreignKeys: [],
    totalRows: 5,
    sampleRows: [
      { id: 1, name: 'Keyboard', description: 'Keyboard mekanikal, gaming, dan produktivitas harian' },
      { id: 2, name: 'Mouse', description: 'Mouse gaming presisi tinggi, nirkabel, dan ergonomis' },
      { id: 3, name: 'Monitor', description: 'Monitor resolusi tinggi untuk gaming dan desain grafis' },
      { id: 4, name: 'Audio', description: 'Headset, headphone studio, mikrofon, dan soundbar gaming' },
      { id: 5, name: 'Aksesoris', description: 'Mousepad, deskmat, kabel braided, dan headphone stand' }
    ]
  },
  {
    name: 'products',
    label: 'Produk & Hardware',
    icon: 'fa-solid fa-box-open',
    description: 'Katalog barang/produk yang dijual, beserta harga dan stok fisik.',
    columns: [
      { name: 'id', type: 'INTEGER', isPk: true, notNull: true, description: 'ID unik produk (Primary Key)' },
      { name: 'category_id', type: 'INTEGER', isPk: false, isFk: true, fkTarget: 'categories.id', notNull: false, description: 'ID kategori rujukan (Foreign Key ke categories)' },
      { name: 'supplier_id', type: 'INTEGER', isPk: false, isFk: true, fkTarget: 'suppliers.id', notNull: false, description: 'ID pemasok penyedia barang (Foreign Key ke suppliers)' },
      { name: 'name', type: 'TEXT', isPk: false, notNull: true, description: 'Nama resmi produk dan spesifikasinya' },
      { name: 'price', type: 'INTEGER', isPk: false, notNull: true, description: 'Harga satuan produk dalam satuan Rupiah (IDR)' },
      { name: 'stock', type: 'INTEGER', isPk: false, notNull: true, description: 'Jumlah sisa unit produk yang tersedia di gudang' }
    ],
    foreignKeys: [
      { from: 'category_id', toTable: 'categories', toColumn: 'id' },
      { from: 'supplier_id', toTable: 'suppliers', toColumn: 'id' }
    ],
    totalRows: 22,
    sampleRows: [
      { id: 1, category_id: 1, supplier_id: 1, name: 'MechaKey K1 Blue Switch', price: 450000, stock: 25 },
      { id: 2, category_id: 1, supplier_id: 1, name: 'MechaKey K2 Red Switch Wireless', price: 650000, stock: 18 },
      { id: 3, category_id: 1, supplier_id: 2, name: 'ProTypist Ergonomic Keyboard', price: 850000, stock: 12 },
      { id: 5, category_id: 2, supplier_id: 1, name: 'SwiftMouse M1 Optical', price: 125000, stock: 45 },
      { id: 9, category_id: 3, supplier_id: 2, name: 'VisionPro 24 FHD 75Hz', price: 1450000, stock: 14 }
    ]
  },
  {
    name: 'customers',
    label: 'Pelanggan (Customers)',
    icon: 'fa-solid fa-users',
    description: 'Data pengguna/pembeli terdaftar yang melakukan transaksi di toko.',
    columns: [
      { name: 'id', type: 'INTEGER', isPk: true, notNull: true, description: 'ID unik pelanggan (Primary Key)' },
      { name: 'name', type: 'TEXT', isPk: false, notNull: true, description: 'Nama lengkap pelanggan' },
      { name: 'email', type: 'TEXT', isPk: false, notNull: false, isUnique: true, description: 'Alamat surel unik pelanggan' },
      { name: 'phone', type: 'TEXT', isPk: false, notNull: false, description: 'Nomor telepon/kontak aktif' },
      { name: 'city', type: 'TEXT', isPk: false, notNull: false, description: 'Kota domisili tempat tinggal' },
      { name: 'created_at', type: 'TEXT', isPk: false, notNull: false, description: 'Tanggal akun didaftarkan (YYYY-MM-DD)' }
    ],
    foreignKeys: [],
    totalRows: 15,
    sampleRows: [
      { id: 1, name: 'Andi Pratama', email: 'andi.pratama@gmail.com', phone: '081211112222', city: 'Bandung', created_at: '2024-01-05' },
      { id: 2, name: 'Budi Santoso', email: 'budi.santoso@gmail.com', phone: '081233334444', city: 'Jakarta', created_at: '2024-01-08' },
      { id: 3, name: 'Citra Lestari', email: 'citra.lestari@yahoo.com', phone: '081355556666', city: 'Surabaya', created_at: '2024-01-12' },
      { id: 4, name: 'Dina Maharani', email: 'dina.m@gmail.com', phone: '081377778888', city: 'Semarang', created_at: '2024-01-15' },
      { id: 5, name: 'Eko Prasetyo', email: 'eko.prasetyo@gmail.com', phone: '082199990000', city: 'Yogyakarta', created_at: '2024-01-20' }
    ]
  },
  {
    name: 'orders',
    label: 'Pesanan (Orders)',
    icon: 'fa-solid fa-receipt',
    description: 'Header transaksi pesanan, mencatat pembeli, kasir/sales, tanggal, status, dan total bayar.',
    columns: [
      { name: 'id', type: 'INTEGER', isPk: true, notNull: true, description: 'Nomor nota / ID pesanan (Primary Key)' },
      { name: 'customer_id', type: 'INTEGER', isPk: false, isFk: true, fkTarget: 'customers.id', notNull: false, description: 'ID pelanggan yang membeli (Foreign Key ke customers)' },
      { name: 'employee_id', type: 'INTEGER', isPk: false, isFk: true, fkTarget: 'employees.id', notNull: false, description: 'ID staf/kasir yang melayani (Foreign Key ke employees)' },
      { name: 'order_date', type: 'TEXT', isPk: false, notNull: true, description: 'Tanggal pesanan dibuat (YYYY-MM-DD)' },
      { name: 'status', type: 'TEXT', isPk: false, notNull: true, description: 'Status order: completed, pending, atau cancelled' },
      { name: 'total_amount', type: 'INTEGER', isPk: false, notNull: true, description: 'Total nilai transaksi belanja (IDR)' }
    ],
    foreignKeys: [
      { from: 'customer_id', toTable: 'customers', toColumn: 'id' },
      { from: 'employee_id', toTable: 'employees', toColumn: 'id' }
    ],
    totalRows: 28,
    sampleRows: [
      { id: 1, customer_id: 1, employee_id: 2, order_date: '2024-01-10', status: 'completed', total_amount: 575000 },
      { id: 2, customer_id: 2, employee_id: 2, order_date: '2024-01-12', status: 'completed', total_amount: 3475000 },
      { id: 3, customer_id: 3, employee_id: 4, order_date: '2024-01-15', status: 'completed', total_amount: 650000 },
      { id: 4, customer_id: 4, employee_id: 2, order_date: '2024-01-18', status: 'completed', total_amount: 220000 },
      { id: 5, customer_id: 5, employee_id: 4, order_date: '2024-01-22', status: 'completed', total_amount: 1450000 }
    ]
  },
  {
    name: 'order_items',
    label: 'Rincian Item (Order Items)',
    icon: 'fa-solid fa-list-ol',
    description: 'Daftar barang detail yang dibeli dalam setiap order transaksi.',
    columns: [
      { name: 'id', type: 'INTEGER', isPk: true, notNull: true, description: 'ID baris detail (Primary Key)' },
      { name: 'order_id', type: 'INTEGER', isPk: false, isFk: true, fkTarget: 'orders.id', notNull: false, description: 'Nomor pesanan rujukan (Foreign Key ke orders)' },
      { name: 'product_id', type: 'INTEGER', isPk: false, isFk: true, fkTarget: 'products.id', notNull: false, description: 'Produk yang dibeli (Foreign Key ke products)' },
      { name: 'quantity', type: 'INTEGER', isPk: false, notNull: true, description: 'Jumlah kuantitas unit yang dibeli' },
      { name: 'unit_price', type: 'INTEGER', isPk: false, notNull: true, description: 'Harga per unit saat transaksi berlangsung (IDR)' },
      { name: 'subtotal', type: 'INTEGER', isPk: false, notNull: true, description: 'Total harga item (quantity * unit_price)' }
    ],
    foreignKeys: [
      { from: 'order_id', toTable: 'orders', toColumn: 'id' },
      { from: 'product_id', toTable: 'products', toColumn: 'id' }
    ],
    totalRows: 42,
    sampleRows: [
      { id: 1, order_id: 1, product_id: 1, quantity: 1, unit_price: 450000, subtotal: 450000 },
      { id: 2, order_id: 1, product_id: 5, quantity: 1, unit_price: 125000, subtotal: 125000 },
      { id: 3, order_id: 2, product_id: 6, quantity: 1, unit_price: 275000, subtotal: 275000 },
      { id: 4, order_id: 2, product_id: 10, quantity: 1, unit_price: 3200000, subtotal: 3200000 },
      { id: 5, order_id: 3, product_id: 2, quantity: 1, unit_price: 650000, subtotal: 650000 }
    ]
  },
  {
    name: 'employees',
    label: 'Pegawai (Employees)',
    icon: 'fa-solid fa-id-badge',
    description: 'Data karyawan toko yang bertugas melayani transaksi dan operasional.',
    columns: [
      { name: 'id', type: 'INTEGER', isPk: true, notNull: true, description: 'ID unik pegawai (Primary Key)' },
      { name: 'name', type: 'TEXT', isPk: false, notNull: true, description: 'Nama lengkap karyawan' },
      { name: 'role', type: 'TEXT', isPk: false, notNull: true, description: 'Posisi/Jabatan (Admin, Kasir, Warehouse, Sales, Manager, CS)' },
      { name: 'salary', type: 'INTEGER', isPk: false, notNull: true, description: 'Gaji pokok bulanan karyawan (IDR)' },
      { name: 'hire_date', type: 'TEXT', isPk: false, notNull: false, description: 'Tanggal mulai bekerja (YYYY-MM-DD)' }
    ],
    foreignKeys: [],
    totalRows: 6,
    sampleRows: [
      { id: 1, name: 'Rian Ardianto', role: 'Admin', salary: 5500000, hire_date: '2023-01-15' },
      { id: 2, name: 'Siti Nurhaliza', role: 'Kasir', salary: 4200000, hire_date: '2023-03-10' },
      { id: 3, name: 'Doni Setiawan', role: 'Warehouse', salary: 4500000, hire_date: '2023-05-01' },
      { id: 4, name: 'Maya Agustina', role: 'Sales', salary: 4800000, hire_date: '2023-06-20' },
      { id: 5, name: 'Eko Wahyudi', role: 'Manager', salary: 8500000, hire_date: '2022-10-01' },
      { id: 6, name: 'Tari Melati', role: 'CS', salary: 4000000, hire_date: '2023-08-15' }
    ]
  },
  {
    name: 'suppliers',
    label: 'Pemasok (Suppliers)',
    icon: 'fa-solid fa-truck',
    description: 'Data distributor dan vendor resmi penyedia stok produk periferal.',
    columns: [
      { name: 'id', type: 'INTEGER', isPk: true, notNull: true, description: 'ID unik pemasok (Primary Key)' },
      { name: 'name', type: 'TEXT', isPk: false, notNull: true, description: 'Nama perusahaan/badan usaha supplier' },
      { name: 'contact_name', type: 'TEXT', isPk: false, notNull: false, description: 'Nama kontak penanggung jawab (PIC)' },
      { name: 'phone', type: 'TEXT', isPk: false, notNull: false, description: 'Nomor telepon kantor/supplier' },
      { name: 'city', type: 'TEXT', isPk: false, notNull: false, description: 'Kota domisili kantor pusat supplier' }
    ],
    foreignKeys: [],
    totalRows: 6,
    sampleRows: [
      { id: 1, name: 'PT Tech Mandiri', contact_name: 'Hendra Wijaya', phone: '081234567890', city: 'Bandung' },
      { id: 2, name: 'CV Elektronika Jaya', contact_name: 'Ratna Sari', phone: '081398765432', city: 'Jakarta' },
      { id: 3, name: 'PT Global Sukses', contact_name: 'Bambang Irawan', phone: '082155443322', city: 'Surabaya' },
      { id: 4, name: 'Digital Nusantara', contact_name: 'Dewi Anggraini', phone: '085277889900', city: 'Semarang' },
      { id: 5, name: 'PT Sinar Komputer', contact_name: 'Agus Prasetyo', phone: '087811223344', city: 'Yogyakarta' }
    ]
  },
  {
    name: 'payments',
    label: 'Pembayaran (Payments)',
    icon: 'fa-solid fa-credit-card',
    description: 'Catatan bukti dan status pembayaran dari setiap pesanan pelanggan.',
    columns: [
      { name: 'id', type: 'INTEGER', isPk: true, notNull: true, description: 'ID unik pembayaran (Primary Key)' },
      { name: 'order_id', type: 'INTEGER', isPk: false, isFk: true, fkTarget: 'orders.id', notNull: false, description: 'ID pesanan yang dibayar (Foreign Key ke orders)' },
      { name: 'payment_method', type: 'TEXT', isPk: false, notNull: true, description: 'Metode bayar: QRIS, Transfer Bank, Kartu Kredit, atau E-Wallet' },
      { name: 'amount', type: 'INTEGER', isPk: false, notNull: true, description: 'Nominal dana yang dibayarkan (IDR)' },
      { name: 'payment_date', type: 'TEXT', isPk: false, notNull: false, description: 'Waktu tanggal pembayaran tercatat (YYYY-MM-DD)' },
      { name: 'status', type: 'TEXT', isPk: false, notNull: true, description: 'Status bayar: success, pending, atau failed' }
    ],
    foreignKeys: [
      { from: 'order_id', toTable: 'orders', toColumn: 'id' }
    ],
    totalRows: 28,
    sampleRows: [
      { id: 1, order_id: 1, payment_method: 'QRIS', amount: 575000, payment_date: '2024-01-10', status: 'success' },
      { id: 2, order_id: 2, payment_method: 'Transfer Bank', amount: 3475000, payment_date: '2024-01-12', status: 'success' },
      { id: 3, order_id: 3, payment_method: 'E-Wallet', amount: 650000, payment_date: '2024-01-15', status: 'success' },
      { id: 4, order_id: 4, payment_method: 'QRIS', amount: 220000, payment_date: '2024-01-18', status: 'success' },
      { id: 5, order_id: 5, payment_method: 'Transfer Bank', amount: 1450000, payment_date: '2024-01-22', status: 'success' }
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

    for (const tableName of tableNames) {
      // 1. Cek info tabel
      const infoRes = db.exec(`PRAGMA table_info("${tableName}")`)
      const columns = []
      if (infoRes && infoRes.length > 0) {
        infoRes[0].values.forEach(row => {
          columns.push({
            name: row[1],
            type: row[2] || 'TEXT',
            notNull: Boolean(row[3]),
            defaultValue: row[4],
            isPk: Boolean(row[5]),
            description: `Kolom ${row[1]} pada tabel ${tableName}`
          })
        })
      }

      // 2. Cek foreign keys
      const fkRes = db.exec(`PRAGMA foreign_key_list("${tableName}")`)
      const foreignKeys = []
      if (fkRes && fkRes.length > 0) {
        fkRes[0].values.forEach(row => {
          foreignKeys.push({
            from: row[3],
            toTable: row[2],
            toColumn: row[4]
          })
        })
      }

      columns.forEach(col => {
        const fk = foreignKeys.find(f => f.from === col.name)
        if (fk) {
          col.isFk = true
          col.fkTarget = `${fk.toTable}.${fk.toColumn || 'id'}`
        }
      })

      // 3. Ambil sample rows
      let sampleRows = []
      try {
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

      // Cari metadata statis jika ada untuk memperkaya deskripsi
      const existingMeta = ICGAMEZ_STORE_METADATA.find(m => m.name === tableName)

      dynamicTables.push({
        name: tableName,
        label: existingMeta?.label || `Tabel ${tableName}`,
        icon: existingMeta?.icon || 'fa-solid fa-table',
        description: existingMeta?.description || `Struktur data tabel ${tableName} pada database latihan.`,
        columns: columns.map(c => {
          const existCol = existingMeta?.columns.find(ec => ec.name === c.name)
          if (existCol?.description) c.description = existCol.description
          return c
        }),
        foreignKeys,
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

