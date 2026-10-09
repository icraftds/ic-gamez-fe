<template>
  <div class="badge-collection-wrapper">
    <div class="section-card">
      <div class="card-header-with-tabs" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px;">
        <h2 class="section-title" style="margin: 0;">Pencapaian</h2>
        
        <div class="showcase-tabs" style="display: flex; gap: 4px; background: rgba(0,0,0,0.2); padding: 4px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
          <button :class="{ active: activeTab === 'medali' }" @click="activeTab = 'medali'" class="tab-btn">Medali</button>
          <button :class="{ active: activeTab === 'piala' }" @click="activeTab = 'piala'" class="tab-btn">Piala</button>
          <button :class="{ active: activeTab === 'sertifikat' }" @click="activeTab = 'sertifikat'" class="tab-btn">Sertifikat</button>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <span style="font-size: 0.85rem; color: #94a3b8;">Menampilkan maksimal 4 pencapaian terpilih</span>
        <button class="btn-outline-small" @click="openModal" style="background: transparent; border: 1px solid #475569; color: #cbd5e1; padding: 4px 12px; border-radius: 6px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s;">
          <i class="fa-solid fa-pen" style="margin-right: 4px;"></i> Ubah
        </button>
      </div>

      <div class="badges-empty" v-if="displayItems.length === 0">
        <i class="fa-solid fa-medal" style="font-size: 2rem; color: #475569; margin-bottom: 10px;"></i>
        <p><strong>Belum Ada Pencapaian</strong></p>
      </div>
      
      <div class="badges-grid" v-else style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
        <div class="badge-item" v-for="item in displayItems" :key="item.id" style="display: flex; flex-direction: column; align-items: center; background: rgba(255,255,255,0.03); padding: 15px 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
          <div style="width: 60px; height: 60px; margin-bottom: 10px; display: flex; justify-content: center; align-items: center;">
            <CyberMedal v-if="activeTab !== 'sertifikat'" :tierId="item.tierId" :isLocked="false" :iconType="item.iconType" style="width: 100%; height: 100%;" />
            <i v-else :class="item.iconType" style="font-size: 2.5rem; color: #f59e0b;"></i>
          </div>
          <span style="font-size: 0.8rem; text-align: center; color: #e2e8f0; font-weight: 500;">{{ item.name }}</span>
        </div>
      </div>

      <router-link to="/dashboard?tab=pencapaian" class="btn-accent" style="display: flex; justify-content: center; align-items: center;">Capaian Lainnya </router-link>


    </div>

    <!-- Modal Pilih Pencapaian -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="showcase-modal-overlay" @click.self="closeModal">
        <div class="showcase-modal-content">
          <div class="modal-header">
            <h3>Pilih Pencapaian untuk Dipajang</h3>
            <button class="close-btn" @click="closeModal"><i class="fa-solid fa-xmark"></i></button>
          </div>
          
          <div class="modal-tabs">
            <button :class="{ active: modalTab === 'medali' }" @click="modalTab = 'medali'" class="tab-btn">Medali ({{ tempSelections.medali.length }}/4)</button>
            <button :class="{ active: modalTab === 'piala' }" @click="modalTab = 'piala'" class="tab-btn">Piala ({{ tempSelections.piala.length }}/4)</button>
            <button :class="{ active: modalTab === 'sertifikat' }" @click="modalTab = 'sertifikat'" class="tab-btn">Sertifikat ({{ tempSelections.sertifikat.length }}/4)</button>
          </div>

          <div class="modal-body">
            <div class="select-grid">
              <div 
                v-for="item in currentModalItems" 
                :key="item.id" 
                class="select-item"
                :class="{ selected: isSelected(item) }"
                @click="toggleSelection(item)"
              >
                <div class="select-icon">
                  <CyberMedal v-if="modalTab !== 'sertifikat'" :tierId="item.tierId" :isLocked="false" :iconType="item.iconType" style="width: 50px; height: 50px;" />
                  <i v-else :class="item.iconType" style="font-size: 2rem; color: #f59e0b;"></i>
                </div>
                <span class="select-name">{{ item.name }}</span>
                <div class="check-mark" v-if="isSelected(item)"><i class="fa-solid fa-check"></i></div>
              </div>
            </div>
            <div v-if="currentModalItems.length === 0" style="text-align: center; color: #94a3b8; padding: 20px;">
              Belum ada pencapaian yang kamu raih di kategori ini.
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeModal">Batal</button>
            <button class="btn-save" @click="saveSelection">Simpan</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAchievements } from '../../../composables/useAchievements'
import { useToast } from '../../../composables/useToast'
import CyberMedal from '../../ui/CyberMedal.vue'
import api from '../../../services/api'

const {
  userProfile,
  userStats,
  fetchUserStats,
  earnedMedals,
  earnedPiala,
  earnedSertifikat
} = useAchievements()
const { showToast } = useToast()

const MAX_SHOWCASE = 4

const activeTab = ref('medali')
const isModalOpen = ref(false)
const modalTab = ref('medali')

onMounted(async () => {
  if (!userStats.value?.completed_exercises) {
    await fetchUserStats()
  }
})

// Hanya pencapaian yang SUDAH diraih user (sumber data sama dengan halaman Pencapaian)
const earnedByTab = computed(() => ({
  medali: earnedMedals.value,
  piala: earnedPiala.value,
  sertifikat: earnedSertifikat.value
}))

// --- Persisted showcase selection (disimpan di DB: users.showcase_medals) ---
const savedIds = computed(() => userProfile.value?.showcase_medals || null)
const isSaving = ref(false)

// Resolve saved IDs into earned items; fallback = 4 pencapaian dengan tier tertinggi
const resolveShowcase = (tab) => {
  const earned = earnedByTab.value[tab] || []
  const ids = savedIds.value?.[tab]
  if (Array.isArray(ids)) {
    return ids
      .map(id => earned.find(item => item.id === id))
      .filter(Boolean)
      .slice(0, MAX_SHOWCASE)
  }
  return [...earned]
    .sort((a, b) => (b.tierId || 0) - (a.tierId || 0))
    .slice(0, MAX_SHOWCASE)
}

const displayItems = computed(() => resolveShowcase(activeTab.value))

// --- Modal ---
const tempSelections = ref({ medali: [], piala: [], sertifikat: [] })

const currentModalItems = computed(() => earnedByTab.value[modalTab.value] || [])

const isSelected = (item) => tempSelections.value[modalTab.value].includes(item.id)

const toggleSelection = (item) => {
  const selectedList = tempSelections.value[modalTab.value]
  const idx = selectedList.indexOf(item.id)

  if (idx !== -1) {
    selectedList.splice(idx, 1)
  } else {
    if (selectedList.length >= MAX_SHOWCASE) {
      showToast(`Maksimal ${MAX_SHOWCASE} pencapaian per kategori!`, 'warning')
      return
    }
    selectedList.push(item.id)
  }
}

const openModal = () => {
  modalTab.value = activeTab.value
  tempSelections.value = {
    medali: resolveShowcase('medali').map(i => i.id),
    piala: resolveShowcase('piala').map(i => i.id),
    sertifikat: resolveShowcase('sertifikat').map(i => i.id)
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveSelection = async () => {
  if (isSaving.value) return
  const payload = {
    medali: [...tempSelections.value.medali],
    piala: [...tempSelections.value.piala],
    sertifikat: [...tempSelections.value.sertifikat]
  }
  isSaving.value = true
  try {
    const res = await api.put('/user/showcase', payload)
    const saved = res.data?.data?.showcase_medals || payload
    userProfile.value = { ...userProfile.value, showcase_medals: saved }
    isModalOpen.value = false
    showToast('Tampilan pencapaian berhasil diperbarui!', 'success')
  } catch (error) {
    showToast('Gagal menyimpan tampilan pencapaian.', 'error')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped src="../../../assets/css/components/dashboard/home/BadgeCollection.css"></style>
<style scoped>
.tab-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn:hover {
  color: #e2e8f0;
}
.tab-btn.active {
  background: var(--primary, #8b5cf6);
  color: var(--bg-card, #1e293b) !important;
  box-shadow: 0 2px 10px rgba(139, 92, 246, 0.3);
}
.btn-outline-small:hover {
  background: rgba(255,255,255,0.1) !important;
  color: white !important;
}

/* Modal Styles */
.showcase-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.showcase-modal-content {
  background: var(--bg-card, #1e293b);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  animation: modalIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: white;
}
.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
}
.close-btn:hover { color: white; }
.modal-tabs {
  display: flex;
  gap: 5px;
  background: rgba(0,0,0,0.2);
  padding: 5px;
  border-radius: 10px;
  margin-bottom: 20px;
}
.modal-tabs .tab-btn {
  flex: 1;
  text-align: center;
}
.modal-body {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 5px;
}
.select-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.select-item {
  background: rgba(255,255,255,0.03);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 15px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}
.select-item:hover {
  background: rgba(255,255,255,0.06);
}
.select-item.selected {
  border-color: var(--primary, #8b5cf6);
  background: rgba(139, 92, 246, 0.1);
}
.select-icon {
  margin-bottom: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.select-name {
  font-size: 0.85rem;
  color: #e2e8f0;
  text-align: center;
  font-weight: 500;
}
.check-mark {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--primary, #8b5cf6);
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.6rem;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.btn-cancel {
  background: transparent;
  border: 1px solid #475569;
  color: #cbd5e1;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}
.btn-cancel:hover { background: rgba(255,255,255,0.05); }
.btn-save {
  background: var(--primary, #8b5cf6);
  border: none;
  color: white;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}
@media (max-width: 600px) {
  .badges-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
</style>
