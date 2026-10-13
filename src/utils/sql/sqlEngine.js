import initSqlJs from 'sql.js'
import { ICGAMEZ_STORE_SCHEMA_SQL } from './icgamezStoreSchema'

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
        locateFile: file => `/sql/${file}`
      })
      SQL = instance
      return SQL
    } catch (localErr) {
      console.warn('[sqlEngine] Gagal memuat wasm lokal, mencoba CDN...', localErr)
      // 2. Fallback ke CDN resmi
      const instance = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`
      })
      SQL = instance
      return SQL
    } finally {
      sqlInitPromise = null
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
      error: 'Query SQL tidak boleh kosong.'
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
    return {
      success: false,
      tables: [],
      rowsModified: 0,
      error: error.message || 'Terjadi kesalahan sintaks SQL.',
      db,
    }
  }
}
