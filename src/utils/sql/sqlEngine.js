import initSqlJs from 'sql.js'
import { ICGAMEZ_STORE_SCHEMA_SQL } from './icgamezStoreSchema.js'

let SQL = null
let sqlInitPromise = null

/**
 * Mendapatkan instance singleton sql.js (WebAssembly SQLite).
 */
export async function getSqlInstance() {
  if (SQL) return SQL
  if (sqlInitPromise) return await sqlInitPromise

  sqlInitPromise = (async () => {
    try {
      // 1. Coba load dari asset lokal public/sql/
      const instance = await initSqlJs({
        locateFile: (file) => {
          if (file.endsWith('.wasm')) {
            return `/sql/sql-wasm-browser.wasm`
          }
          return `/sql/${file}`
        }
      })
      SQL = instance
      return SQL
    } catch (localErr) {
      console.warn('[sqlEngine] Gagal memuat wasm lokal, mencoba CDN...', localErr)
      // 2. Fallback ke CDN resmi (versi 1.14.2 sesuai package.json)
      try {
        const instance = await initSqlJs({
          locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.14.2/${file}`
        })
        SQL = instance
        return SQL
      } catch (cdnErr) {
        console.error('[sqlEngine] Gagal memuat SQLite WASM dari semua sumber:', cdnErr)
        throw new Error('Gagal memuat mesin SQLite WebAssembly. Periksa koneksi internet atau asset lokal.')
      }
    }
  })()

  return await sqlInitPromise
}

/**
 * Membuat in-memory SQLite database baru yang di-reset dengan schema & seed data icgamez_store.
 * @param {string|null} customInitSql - SQL kustom jika ingin dataset khusus
 */
export async function createFreshDatabase(customInitSql = null) {
  const sqlInstance = await getSqlInstance()
  const db = new sqlInstance.Database()
  db.run(customInitSql || ICGAMEZ_STORE_SCHEMA_SQL)
  return db
}

/**
 * Mengeksekusi query SQL pengguna di dalam in-memory database yang bersih.
 * @param {string} sqlQuery - Query SQL pengguna
 * @param {Object} options - Opsi eksekusi
 * @returns {Promise<{ success: boolean, tables: Array, rowsModified: number, error?: string }>}
 */
export async function executeSqlQuery(sqlQuery, options = {}) {
  const { customInitSql = null, reuseDb = null } = options

  if (!sqlQuery || !sqlQuery.trim()) {
    return {
      success: false,
      tables: [],
      rowsModified: 0,
      error: 'Query SQL tidak boleh kosong. Tuliskan query Anda terlebih dahulu.'
    }
  }

  let db = reuseDb
  try {
    if (!db) {
      db = await createFreshDatabase(customInitSql)
    }

    const rawResults = db.exec(sqlQuery)
    const tables = []

    for (const res of rawResults) {
      const rows = res.values.map(row => {
        const obj = {}
        res.columns.forEach((col, idx) => {
          obj[col] = row[idx]
        })
        return obj
      })
      tables.push({
        columns: res.columns,
        data: rows
      })
    }

    const rowsModified = typeof db.getRowsModified === 'function' ? db.getRowsModified() : 0

    return {
      success: true,
      tables,
      rowsModified,
      db,
    }
  } catch (error) {
    let errorMsg = error.message || 'Terjadi kesalahan sintaks SQL.'

    // Berikan petunjuk ramah jika user mencoba query nama database bukan nama tabel
    if (errorMsg.includes('no such table: icgamez_store')) {
      errorMsg = "Tabel 'icgamez_store' tidak ditemukan. 'icgamez_store' adalah nama database, bukan nama tabel. Silakan gunakan tabel yang tersedia seperti: categories, products, orders, dll. (Cek tab Atribut Database)."
    }

    return {
      success: false,
      tables: [],
      rowsModified: 0,
      error: errorMsg,
      db,
    }
  }
}
