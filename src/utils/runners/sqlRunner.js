/**
 * Runner untuk SQL menggunakan in-memory SQLite WebAssembly (Client-side)
 */
export async function runSql(code) {
  try {
    const { executeSqlQuery } = await import('../sql/sqlEngine')
    const result = await executeSqlQuery(code)

    if (!result.success) {
      return [{ type: 'error', text: result.error }]
    }

    if (result.tables && result.tables.length > 0) {
      const lastTable = result.tables[result.tables.length - 1]
      return [{
        type: 'table',
        data: lastTable.data,
        columns: lastTable.columns
      }]
    }

    return [{
      type: 'log',
      text: `Query berhasil dieksekusi (${result.rowsModified} baris terpengaruh).`
    }]
  } catch (sqlErr) {
    return [{ type: 'error', text: `SQL Error: ${sqlErr.message}` }]
  }
}
