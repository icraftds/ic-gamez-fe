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

<style scoped src="../../assets/css/components/workspace/DatabaseSchemaViewer.css"></style>

