<template>
  <div class="db-schema-viewer" :class="{ 'is-modal': isModalOpen }">
    <!-- Modal Backdrop if modal open -->
    <div v-if="isModalOpen" class="schema-modal-backdrop" @click="isModalOpen = false"></div>

    <div class="schema-container">
      <!-- Top Bar: Title, Search, Actions -->
      <div class="schema-topbar">
        <div class="topbar-left">
          <div class="db-badge">
            <i class="fa-solid fa-database"></i>
            <span>icgamez_store</span>
          </div>
          <span class="db-tech-pill">SQLite 3</span>
        </div>

        <div class="topbar-actions">
          <button 
            type="button"
            class="topbar-btn" 
            :title="isModalOpen ? 'Perkecil tampilan' : 'Perbesar layar penuh'"
            @click="isModalOpen = !isModalOpen"
          >
            <i :class="isModalOpen ? 'fa-solid fa-compress' : 'fa-solid fa-up-right-and-down-left-from-center'"></i>
            <span class="btn-text">{{ isModalOpen ? 'Perkecil' : 'Layar Penuh' }}</span>
          </button>
        </div>
      </div>

      <!-- Quick Search Bar -->
      <div class="schema-search-bar">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari tabel atau kolom... (misal: price, category_id, name)"
          class="schema-search-input"
        />
        <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''" title="Hapus pencarian">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Table Selection Pills (Horizontal Scroll) -->
      <div class="tables-pills-wrapper">
        <div class="tables-pills-list">
          <button
            v-for="tbl in filteredTables"
            :key="tbl.name"
            class="table-pill"
            :class="{ active: activeTable?.name === tbl.name }"
            @click="selectTable(tbl)"
          >
            <i :class="tbl.icon || 'fa-solid fa-table'"></i>
            <span class="pill-name">{{ tbl.name }}</span>
            <span class="pill-count" :title="`${tbl.totalRows || tbl.sampleRows?.length || 0} baris data`">
              {{ tbl.totalRows || tbl.sampleRows?.length || 0 }}
            </span>
          </button>
        </div>
      </div>

      <!-- Selected Table Content -->
      <div v-if="activeTable" class="table-details-panel">
        <!-- Table Header Card -->
        <div class="table-header-card">
          <div class="table-title-row">
            <div class="table-title-meta">
              <div class="title-with-icon">
                <i :class="activeTable.icon || 'fa-solid fa-table'" class="table-main-icon"></i>
                <h3 class="table-name">{{ activeTable.name }}</h3>
                <span class="table-label-tag">{{ activeTable.label }}</span>
              </div>
              <p class="table-desc">{{ activeTable.description }}</p>
            </div>

            <div class="table-header-actions">
              <button 
                class="copy-table-btn" 
                @click="copyToClipboard(activeTable.name, 'Nama tabel')"
                title="Salin nama tabel untuk query"
              >
                <i :class="copiedItem === activeTable.name ? 'fa-solid fa-check text-green' : 'fa-regular fa-copy'"></i>
                <span>{{ copiedItem === activeTable.name ? 'Tersalin!' : 'Salin Tabel' }}</span>
              </button>
            </div>
          </div>

          <!-- Foreign Keys & Relations Summary -->
          <div v-if="activeTable.foreignKeys && activeTable.foreignKeys.length > 0" class="relations-bar">
            <span class="relations-label">
              <i class="fa-solid fa-diagram-project"></i> Relasi Kunci Tamu:
            </span>
            <div class="relations-tags">
              <button 
                v-for="fk in activeTable.foreignKeys" 
                :key="fk.from" 
                class="relation-tag"
                @click="jumpToTable(fk.toTable)"
                :title="`Klik untuk beralih ke tabel ${fk.toTable}`"
              >
                <code>{{ fk.from }}</code>
                <i class="fa-solid fa-arrow-right"></i>
                <span class="fk-target">{{ fk.toTable }}.{{ fk.toColumn || 'id' }}</span>
              </button>
            </div>
          </div>

          <!-- Incoming Reference Pills if this table is referenced by other tables -->
          <div v-if="incomingReferences.length > 0" class="relations-bar incoming">
            <span class="relations-label">
              <i class="fa-solid fa-link"></i> Dirujuk oleh:
            </span>
            <div class="relations-tags">
              <button 
                v-for="ref in incomingReferences" 
                :key="ref.table + ref.from" 
                class="relation-tag incoming"
                @click="jumpToTable(ref.table)"
                :title="`Klik untuk beralih ke tabel ${ref.table}`"
              >
                <span class="fk-target">{{ ref.table }}</span>
                <i class="fa-solid fa-arrow-left"></i>
                <code>{{ ref.from }}</code>
              </button>
            </div>
          </div>

          <!-- Sub-View Switcher: Columns vs Data Rows -->
          <div class="subview-tabs">
            <button 
              class="subview-tab" 
              :class="{ active: activeSubView === 'columns' }"
              @click="activeSubView = 'columns'"
            >
              <i class="fa-solid fa-table-columns"></i>
              <span>Atribut Kolom ({{ activeTable.columns.length }})</span>
            </button>
            <button 
              class="subview-tab" 
              :class="{ active: activeSubView === 'data' }"
              @click="switchToDataView"
            >
              <i class="fa-solid fa-table-cells"></i>
              <span>Pratinjau Data ({{ currentTableTotalRows }} baris)</span>
            </button>
          </div>
        </div>

        <!-- 1. VIEW ATRIBUT / KOLOM -->
        <div v-if="activeSubView === 'columns'" class="columns-view-section">
          <div class="table-responsive-wrapper">
            <table class="schema-attr-table">
              <thead>
                <tr>
                  <th style="width: 28%;">Nama Kolom</th>
                  <th style="width: 18%;">Tipe Data</th>
                  <th style="width: 14%;">Sifat</th>
                  <th style="width: 40%;">Keterangan & Penjelasan</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="col in activeTable.columns" 
                  :key="col.name"
                  class="attr-row"
                  :class="{ 'highlight-search': isColumnMatch(col.name) }"
                >
                  <td class="col-name-cell">
                    <div class="col-name-wrap">
                      <code class="col-code">{{ col.name }}</code>
                      <button 
                        class="quick-copy-col" 
                        @click="copyToClipboard(col.name, `Kolom ${col.name}`)"
                        title="Klik untuk salin nama kolom"
                      >
                        <i :class="copiedItem === col.name ? 'fa-solid fa-check text-green' : 'fa-regular fa-copy'"></i>
                      </button>
                    </div>

                    <div class="col-badges-row">
                      <span v-if="col.isPk" class="badge-pk" title="Primary Key (Kunci Utama)">
                        <i class="fa-solid fa-key"></i> PK
                      </span>
                      <span v-if="col.isFk" class="badge-fk" :title="`Foreign Key ke ${col.fkTarget}`">
                        <i class="fa-solid fa-link"></i> FK: {{ col.fkTarget }}
                      </span>
                      <span v-if="col.isUnique" class="badge-uq" title="Nilai Unik (UNIQUE)">
                        UQ
                      </span>
                    </div>
                  </td>

                  <td>
                    <span class="type-pill" :class="col.type?.toLowerCase()">
                      {{ col.type || 'TEXT' }}
                    </span>
                  </td>

                  <td>
                    <span v-if="col.notNull" class="not-null-badge">NOT NULL</span>
                    <span v-else class="nullable-badge">NULL</span>
                  </td>

                  <td class="desc-cell">
                    {{ col.description || '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="schema-tips-footer">
            <i class="fa-solid fa-lightbulb"></i>
            <span><strong>Tips:</strong> Klik ikon salin di samping nama kolom untuk langsung menempelkannya ke query SQL Anda.</span>
          </div>
        </div>

        <!-- 2. VIEW DATA SAMPEL / PREVIEW -->
        <div v-else-if="activeSubView === 'data'" class="data-view-section">
          <div class="data-controls">
            <span class="data-count-info">
              Menampilkan <strong>{{ tableRows.length }}</strong> dari <strong>{{ currentTableTotalRows }}</strong> baris
            </span>
            <div class="data-actions-right">
              <button 
                v-if="tableRows.length < currentTableTotalRows" 
                class="load-all-btn" 
                :disabled="isLoadingData"
                @click="loadFullTableData"
              >
                <i :class="isLoadingData ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-arrow-down-wide-short'"></i>
                <span>Muat Semua Baris</span>
              </button>
            </div>
          </div>

          <div class="data-table-wrapper">
            <table class="schema-data-table">
              <thead>
                <tr>
                  <th class="th-index">#</th>
                  <th v-for="col in activeTable.columns" :key="col.name">
                    <div class="th-col-header">
                      <span>{{ col.name }}</span>
                      <span class="th-type-sub">{{ col.type }}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in tableRows" :key="idx" class="data-row">
                  <td class="td-index">{{ idx + 1 }}</td>
                  <td v-for="col in activeTable.columns" :key="col.name" class="data-cell">
                    <span v-if="isStatusColumn(col.name)" class="status-cell-badge" :class="row[col.name]">
                      {{ row[col.name] }}
                    </span>
                    <span v-else-if="isMoneyColumn(col.name)" class="money-cell">
                      {{ formatCurrency(row[col.name]) }}
                    </span>
                    <span v-else class="text-cell">
                      {{ row[col.name] !== null && row[col.name] !== undefined ? row[col.name] : 'NULL' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- If no table matches search -->
      <div v-else class="empty-search-state">
        <i class="fa-solid fa-filter-circle-xmark"></i>
        <p>Tidak ada tabel atau kolom yang cocok dengan pencarian "<strong>{{ searchQuery }}</strong>"</p>
        <button class="reset-search-btn" @click="searchQuery = ''">
          Reset Pencarian
        </button>
      </div>

      <!-- Quick ERD Relational Guide Footer -->
      <div class="erd-summary-card">
        <div class="erd-header">
          <i class="fa-solid fa-diagram-project"></i>
          <span>Peta Hubungan Tabel (icgamez_store)</span>
        </div>
        <div class="erd-flow">
          <div class="erd-node" @click="jumpToTable('categories')">categories</div>
          <div class="erd-arrow">◄───</div>
          <div class="erd-node" @click="jumpToTable('products')">products</div>
          <div class="erd-arrow">◄───</div>
          <div class="erd-node" @click="jumpToTable('order_items')">order_items</div>
          <div class="erd-arrow">───►</div>
          <div class="erd-node" @click="jumpToTable('orders')">orders</div>
          <div class="erd-arrow">───►</div>
          <div class="erd-node" @click="jumpToTable('customers')">customers</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getDatabaseSchemaMetadata, fetchTableData } from '../../utils/sql/dbSchemaInspector'

const props = defineProps({
  customSetupSql: {
    type: String,
    default: null
  }
})

const isModalOpen = ref(false)
const searchQuery = ref('')
const activeSubView = ref('columns') // 'columns' | 'data'
const tablesList = ref([])
const activeTable = ref(null)

const tableRows = ref([])
const isLoadingData = ref(false)
const copiedItem = ref(null)

// Muat schema tabel
const loadSchema = async () => {
  const schema = await getDatabaseSchemaMetadata(props.customSetupSql)
  tablesList.value = schema
  if (schema.length > 0 && !activeTable.value) {
    activeTable.value = schema[0]
    tableRows.value = schema[0].sampleRows || []
  }
}

onMounted(() => {
  loadSchema()
})

watch(() => props.customSetupSql, () => {
  loadSchema()
})

// Filter tabel berdasarkan query pencarian (mencocokkan nama tabel atau nama kolom)
const filteredTables = computed(() => {
  if (!searchQuery.value.trim()) return tablesList.value
  const q = searchQuery.value.toLowerCase().trim()

  return tablesList.value.filter(tbl => {
    if (tbl.name.toLowerCase().includes(q)) return true
    if (tbl.label?.toLowerCase().includes(q)) return true
    return tbl.columns?.some(c => c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q))
  })
})

// Otomatis pilih tabel pertama jika tabel aktif terfilter keluar
watch(filteredTables, (newTables) => {
  if (newTables.length > 0 && (!activeTable.value || !newTables.some(t => t.name === activeTable.value.name))) {
    selectTable(newTables[0])
  }
})

const selectTable = async (tbl) => {
  activeTable.value = tbl
  tableRows.value = tbl.sampleRows || []
  
  if (activeSubView.value === 'data') {
    await fetchLiveRows(tbl.name, 10)
  }
}

const jumpToTable = (tableName) => {
  const target = tablesList.value.find(t => t.name === tableName)
  if (target) {
    selectTable(target)
  }
}

const switchToDataView = async () => {
  activeSubView.value = 'data'
  if (activeTable.value) {
    await fetchLiveRows(activeTable.value.name, 10)
  }
}

const fetchLiveRows = async (tableName, limit = 50) => {
  isLoadingData.value = true
  try {
    const res = await fetchTableData(tableName, limit, props.customSetupSql)
    if (res && res.rows && res.rows.length > 0) {
      tableRows.value = res.rows
    }
  } catch (e) {
    console.warn('Gagal memuat data live:', e)
  } finally {
    isLoadingData.value = false
  }
}

const loadFullTableData = async () => {
  if (!activeTable.value) return
  await fetchLiveRows(activeTable.value.name, 200)
}

const currentTableTotalRows = computed(() => {
  return activeTable.value?.totalRows || activeTable.value?.sampleRows?.length || tableRows.value.length || 0
})

// Cari tabel lain yang merujuk ke tabel ini sebagai FK
const incomingReferences = computed(() => {
  if (!activeTable.value) return []
  const currentName = activeTable.value.name
  const refs = []

  tablesList.value.forEach(tbl => {
    if (tbl.name === currentName) return
    tbl.foreignKeys?.forEach(fk => {
      if (fk.toTable === currentName) {
        refs.push({
          table: tbl.name,
          from: fk.from
        })
      }
    })
  })

  return refs
})

const isColumnMatch = (colName) => {
  if (!searchQuery.value.trim()) return false
  return colName.toLowerCase().includes(searchQuery.value.toLowerCase().trim())
}

const copyToClipboard = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedItem.value = text
    setTimeout(() => {
      if (copiedItem.value === text) copiedItem.value = null
    }, 2000)
  } catch (err) {
    console.warn('Gagal salin teks:', err)
  }
}

const isStatusColumn = (colName) => {
  return ['status'].includes(colName.toLowerCase())
}

const isMoneyColumn = (colName) => {
  return ['price', 'salary', 'total_amount', 'unit_price', 'subtotal', 'amount'].includes(colName.toLowerCase())
}

const formatCurrency = (val) => {
  if (val === null || val === undefined) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val)
}
</script>

<style scoped>
.db-schema-viewer {
  display: flex;
  flex-direction: column;
  background: transparent;
  color: #f1f5f9;
  font-family: inherit;
}

.schema-container {
  display: flex;
  flex-direction: column;
  padding: 4px 0 20px;
}

.schema-container::-webkit-scrollbar {
  width: 5px;
}
.schema-container::-webkit-scrollbar-thumb {
  background: rgba(147, 51, 234, 0.35);
  border-radius: 4px;
}

/* Modal View */
.db-schema-viewer.is-modal {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.schema-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 2, 10, 0.85);
  backdrop-filter: blur(8px);
}

.is-modal .schema-container {
  position: relative;
  z-index: 10;
  width: 95vw;
  max-width: 1280px;
  max-height: 90vh;
  background: #090514;
  border: 1px solid rgba(168, 85, 247, 0.4);
  border-radius: 16px;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(147, 51, 234, 0.25);
  padding: 24px 28px;
}

/* Topbar */
.schema-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.db-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(147, 51, 234, 0.18);
  border: 1px solid rgba(168, 85, 247, 0.35);
  padding: 5px 12px;
  border-radius: 8px;
  color: #d8b4fe;
  font-weight: 700;
  font-size: 0.88rem;
  letter-spacing: 0.3px;
}

.db-tech-pill {
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: #38bdf8;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  text-transform: uppercase;
}

.topbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.topbar-btn:hover {
  background: rgba(168, 85, 247, 0.2);
  border-color: rgba(168, 85, 247, 0.4);
  color: #f8fafc;
}

/* Search Bar */
.schema-search-bar {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 14px;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #64748b;
  font-size: 0.85rem;
  pointer-events: none;
}

.schema-search-input {
  width: 100%;
  background: rgba(15, 10, 28, 0.8);
  border: 1px solid rgba(147, 51, 234, 0.2);
  border-radius: 9px;
  padding: 8px 34px 8px 34px;
  color: #f1f5f9;
  font-size: 0.83rem;
  outline: none;
  transition: all 0.2s ease;
}

.schema-search-input:focus {
  border-color: rgba(168, 85, 247, 0.6);
  background: rgba(15, 10, 28, 0.98);
  box-shadow: 0 0 14px rgba(147, 51, 234, 0.2);
}

.clear-search-btn {
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  font-size: 0.8rem;
}

.clear-search-btn:hover {
  color: #f8fafc;
}

/* Tables Pills Carousel */
.tables-pills-wrapper {
  margin-bottom: 16px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.tables-pills-wrapper::-webkit-scrollbar {
  height: 4px;
}
.tables-pills-wrapper::-webkit-scrollbar-thumb {
  background: rgba(147, 51, 234, 0.25);
  border-radius: 4px;
}

.tables-pills-list {
  display: flex;
  gap: 8px;
  min-width: max-content;
}

.table-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(15, 10, 28, 0.7);
  border: 1px solid rgba(147, 51, 234, 0.2);
  color: #94a3b8;
  padding: 6px 13px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.table-pill:hover {
  background: rgba(147, 51, 234, 0.12);
  color: #e2e8f0;
  border-color: rgba(147, 51, 234, 0.35);
}

.table-pill.active {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(79, 70, 229, 0.25));
  border-color: #a855f7;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.35);
}

.pill-count {
  font-size: 0.72rem;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 12px;
  padding: 1px 7px;
  color: #cbd5e1;
}

.table-pill.active .pill-count {
  background: rgba(168, 85, 247, 0.4);
  color: #ffffff;
}

/* Selected Table Detail Card */
.table-details-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.table-header-card {
  background: rgba(15, 10, 28, 0.85);
  border: 1px solid rgba(147, 51, 234, 0.25);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.table-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.title-with-icon {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.table-main-icon {
  font-size: 1.25rem;
  color: #a855f7;
}

.table-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.table-label-tag {
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: #c084fc;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
}

.table-desc {
  font-size: 0.84rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.45;
}

.copy-table-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(147, 51, 234, 0.15);
  border: 1px solid rgba(147, 51, 234, 0.3);
  color: #e2e8f0;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.copy-table-btn:hover {
  background: rgba(147, 51, 234, 0.3);
  border-color: #c084fc;
}

/* Relations Bar */
.relations-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 7px 10px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  font-size: 0.78rem;
}

.relations-label {
  color: #94a3b8;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.relations-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.relation-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.25);
  color: #38bdf8;
  padding: 2px 8px;
  border-radius: 5px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.relation-tag:hover {
  background: rgba(56, 189, 248, 0.25);
  border-color: #38bdf8;
}

.relation-tag code {
  color: #bae6fd;
  font-weight: 700;
}

.relation-tag.incoming {
  background: rgba(168, 85, 247, 0.1);
  border-color: rgba(168, 85, 247, 0.25);
  color: #d8b4fe;
}

.relation-tag.incoming:hover {
  background: rgba(168, 85, 247, 0.25);
  border-color: #d8b4fe;
}

/* Subview Tabs */
.subview-tabs {
  display: flex;
  gap: 6px;
  border-top: 1px solid rgba(147, 51, 234, 0.15);
  padding-top: 10px;
}

.subview-tab {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: transparent;
  border: 1px solid transparent;
  color: #94a3b8;
  padding: 6px 14px;
  border-radius: 7px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.subview-tab:hover {
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.04);
}

.subview-tab.active {
  background: rgba(147, 51, 234, 0.2);
  border-color: rgba(147, 51, 234, 0.35);
  color: #c084fc;
  font-weight: 700;
}

/* 1. Columns View Table */
.table-responsive-wrapper {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid rgba(147, 51, 234, 0.2);
  background: rgba(10, 6, 20, 0.7);
}

.schema-attr-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  text-align: left;
}

.schema-attr-table th {
  background: rgba(19, 13, 36, 0.95);
  color: #cbd5e1;
  font-weight: 700;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(147, 51, 234, 0.25);
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.schema-attr-table td {
  padding: 10px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  vertical-align: middle;
}

.attr-row:hover {
  background: rgba(147, 51, 234, 0.08);
}

.attr-row.highlight-search {
  background: rgba(147, 51, 234, 0.25);
}

.col-name-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 3px;
}

.col-code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-weight: 700;
  color: #f8fafc;
  font-size: 0.86rem;
}

.quick-copy-col {
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 2px 4px;
  font-size: 0.75rem;
  transition: color 0.15s ease;
}

.quick-copy-col:hover {
  color: #a855f7;
}

.col-badges-row {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.badge-pk {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #fbbf24;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
}

.badge-fk {
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.35);
  color: #38bdf8;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
}

.badge-uq {
  background: rgba(217, 70, 239, 0.15);
  border: 1px solid rgba(217, 70, 239, 0.35);
  color: #e879f9;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
}

.type-pill {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.74rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
}

.type-pill.integer {
  background: rgba(59, 130, 246, 0.12);
  border-color: rgba(59, 130, 246, 0.3);
  color: #60a5fa;
}

.type-pill.text {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.3);
  color: #34d399;
}

.type-pill.real {
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.3);
  color: #fbbf24;
}

.not-null-badge {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #f87171;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.nullable-badge {
  color: #64748b;
  font-size: 0.72rem;
}

.desc-cell {
  color: #cbd5e1;
  line-height: 1.4;
  font-size: 0.8rem;
}

.schema-tips-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 0.78rem;
  color: #94a3b8;
  padding: 8px 12px;
  background: rgba(147, 51, 234, 0.08);
  border: 1px solid rgba(147, 51, 234, 0.18);
  border-radius: 8px;
}

.schema-tips-footer i {
  color: #fbbf24;
}

/* 2. Data View Section */
.data-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.8rem;
  color: #94a3b8;
}

.load-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(147, 51, 234, 0.18);
  border: 1px solid rgba(147, 51, 234, 0.35);
  color: #c084fc;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-all-btn:hover {
  background: rgba(147, 51, 234, 0.3);
  border-color: #a855f7;
  color: #f8fafc;
}

.data-table-wrapper {
  overflow-x: auto;
  border: 1px solid rgba(147, 51, 234, 0.2);
  border-radius: 10px;
  background: rgba(10, 6, 20, 0.8);
  max-height: 400px;
}

.is-modal .data-table-wrapper {
  max-height: 520px;
}

.schema-data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  text-align: left;
}

.schema-data-table th {
  background: rgba(19, 13, 36, 0.98);
  color: #e2e8f0;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(147, 51, 234, 0.25);
  position: sticky;
  top: 0;
  z-index: 2;
  white-space: nowrap;
}

.th-index {
  width: 38px;
  text-align: center;
  color: #64748b;
}

.th-col-header {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.th-type-sub {
  font-size: 0.66rem;
  color: #a855f7;
  font-weight: 500;
  font-family: monospace;
}

.schema-data-table td {
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  white-space: nowrap;
}

.td-index {
  text-align: center;
  color: #64748b;
  font-size: 0.74rem;
}

.data-row:hover {
  background: rgba(147, 51, 234, 0.08);
}

.money-cell {
  color: #38bdf8;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
}

.status-cell-badge {
  display: inline-block;
  padding: 1px 7px;
  border-radius: 10px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: capitalize;
}

.status-cell-badge.completed,
.status-cell-badge.success {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-cell-badge.pending {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-cell-badge.cancelled,
.status-cell-badge.failed {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* Empty Search */
.empty-search-state {
  text-align: center;
  padding: 36px 20px;
  color: #64748b;
}

.empty-search-state i {
  font-size: 2.5rem;
  color: #a855f7;
  margin-bottom: 12px;
}

.reset-search-btn {
  margin-top: 10px;
  background: rgba(147, 51, 234, 0.2);
  border: 1px solid rgba(147, 51, 234, 0.35);
  color: #d8b4fe;
  padding: 6px 14px;
  border-radius: 7px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
}

/* ERD Summary Card */
.erd-summary-card {
  margin-top: 20px;
  background: rgba(15, 10, 28, 0.6);
  border: 1px solid rgba(147, 51, 234, 0.18);
  border-radius: 10px;
  padding: 12px 14px;
}

.erd-header {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #94a3b8;
  margin-bottom: 10px;
}

.erd-flow {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 0.75rem;
}

.erd-node {
  background: rgba(147, 51, 234, 0.15);
  border: 1px solid rgba(147, 51, 234, 0.3);
  color: #e2e8f0;
  padding: 3px 8px;
  border-radius: 6px;
  font-family: monospace;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.erd-node:hover {
  background: rgba(168, 85, 247, 0.3);
  border-color: #c084fc;
  color: #ffffff;
}

.erd-arrow {
  color: #64748b;
  font-size: 0.72rem;
}

.text-green {
  color: #34d399 !important;
}
</style>
