<template>
  <div class="dashboard-inventory">
    <div class="header">
      <h2>Inventory</h2>
      <p>Kelola barang-barang yang Anda miliki.</p>
    </div>

    <div class="inventory-tabs">
      <button :class="{ active: activeTab === 'items' }" @click="activeTab = 'items'" class="tab-btn"><i class="fa-solid fa-box-open"></i> Items</button>
      <button :class="{ active: activeTab === 'borders' }" @click="activeTab = 'borders'" class="tab-btn"><i class="fa-solid fa-shield-halved"></i> Border</button>
    </div>

    <div v-if="activeTab === 'items'" class="tab-content">
      <div v-if="loading" class="loading-state">
        <div class="loader-ring"></div>
        <p>Memuat inventory...</p>
      </div>
    <div v-else-if="activeInventory.length === 0" class="empty-state">
      <i class="fa-solid fa-box-open"></i>
      <p>Inventory Anda kosong. Beli barang di Shop!</p>
      <router-link to="/shop" class="btn-shop">Pergi ke Shop</router-link>
    </div>
    <div v-else class="inventory-grid">
      <div v-for="userItem in activeInventory" :key="userItem.id" class="inventory-item">
        <div class="item-icon">
          <img v-if="userItem.item.image_url" :src="userItem.item.image_url" alt="Icon" />
          <img v-else-if="userItem.item.slug === 'changename-usn'" src="/favicon.png" alt="Icon" />
          <i v-else class="fa-solid fa-gift"></i>
        </div>
        <div class="item-details">
          <h3>{{ userItem.item.name }}</h3>
          <p>{{ userItem.item.description }}</p>
          <span class="quantity">Jumlah: {{ userItem.quantity }}</span>
        </div>
      </div>
    </div>
    </div>

    <div v-else-if="activeTab === 'borders'" class="tab-content border-tab-wrapper">
      <DashboardBorders />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../../services/api'
import DashboardBorders from './DashboardBorders.vue'

const activeTab = ref('items')
const inventory = ref([])
const loading = ref(true)

const activeInventory = computed(() => {
  return inventory.value.filter(item => item.quantity > 0)
})

onMounted(async () => {
  try {
    const res = await api.get('/user/inventory')
    inventory.value = res.data.data
  } catch (err) {
    console.error('Failed to load inventory', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.dashboard-inventory {
  background: var(--glass-bg, rgba(30, 41, 59, 0.4));
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(10px);
}
.header {
  margin-bottom: 30px;
}
.header h2 {
  font-size: 1.8rem;
  color: var(--text-light, white);
  margin-bottom: 5px;
}
.header p {
  color: var(--text-muted, #94a3b8);
}
.inventory-tabs {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.tab-btn {
  background: transparent;
  border: none;
  color: var(--text-muted, #94a3b8);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 15px 5px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 3px solid transparent;
  position: relative;
}
.tab-btn:hover {
  color: var(--text-light, white);
}
.tab-btn.active {
  color: var(--primary, #818cf8);
  border-bottom: 3px solid var(--primary, #818cf8);
  background: linear-gradient(to top, rgba(129, 140, 248, 0.15) 0%, transparent 100%);
}
.tab-content {
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
.border-tab-wrapper {
  /* Override padding if DashboardBorders has its own */
  margin: -10px;
}
.loading-state, .empty-state {
  text-align: center;
  padding: 50px 0;
  color: var(--text-muted, #94a3b8);
}
.empty-state i {
  font-size: 3rem;
  margin-bottom: 15px;
}
.btn-shop {
  display: inline-block;
  margin-top: 15px;
  background: var(--primary, #818cf8);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-shop:hover {
  background: var(--primary-hover, #6366f1);
  transform: translateY(-2px);
}
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
.inventory-item {
  background: var(--glass-bg-card-0_6, rgba(30, 41, 59, 0.6));
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.05));
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease;
}
.inventory-item:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.15);
}
.item-icon {
  width: 80px;
  height: 80px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}
.item-icon img {
  width: 50px;
  height: 50px;
  object-fit: contain;
}
.item-icon i {
  font-size: 2.5rem;
  color: var(--primary, #818cf8);
}
.item-details h3 {
  color: var(--text-light, white);
  font-size: 1.2rem;
  margin-bottom: 5px;
}
.item-details p {
  color: var(--text-muted, #94a3b8);
  font-size: 0.9rem;
  margin-bottom: 10px;
}
.quantity {
  display: inline-block;
  background: rgba(129, 140, 248, 0.2);
  color: var(--primary, #818cf8);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>
