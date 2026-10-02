<template>
  <div class="active-users-widget card">
    <div class="widget-header">
      <div class="header-icon">
        <i class="fa-solid fa-users"></i>
      </div>
      <h3>Monitoring User</h3>
    </div>
    <div class="widget-content" v-if="!isLoading">
      <div class="stats-row">
        <div class="stat-number active">
          {{ activeCount }}
        </div>
        <div class="stat-separator">/</div>
        <div class="stat-number total">
          {{ totalCount }}
        </div>
      </div>
      <p class="stat-label">User Online Saat Ini</p>
      
      <div class="users-list" v-if="activeUsers.length > 0">
        <div v-for="user in activeUsers" :key="user.id" class="user-item">
          <img :src="user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'User') + '&background=random'" alt="avatar" class="user-avatar" />
          <div class="user-info">
            <span class="user-name">{{ user.name }}</span>
            <span class="user-status">Online</span>
          </div>
        </div>
      </div>
    </div>
    <div class="widget-content loading" v-else>
      <i class="fa-solid fa-circle-notch fa-spin"></i> Memuat data...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../../services/api';

const isLoading = ref(true);
const activeCount = ref(0);
const totalCount = ref(0);
const activeUsers = ref([]);

const fetchActiveUsers = async () => {
  try {
    const response = await api.get('/admin/active-users');
    if (response.data && response.data.data) {
      activeCount.value = response.data.data.active_count;
      totalCount.value = response.data.data.total_users;
      activeUsers.value = response.data.data.active_users;
    }
  } catch (error) {
    console.error('Failed to fetch active users:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchActiveUsers();
  // Optional: Auto refresh every minute
  setInterval(fetchActiveUsers, 60000);
});
</script>

<style scoped>
.active-users-widget {
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

:global(body.dark-mode) .active-users-widget {
  background: #1e293b;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
}

.widget-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.header-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.widget-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
}

:global(body.dark-mode) .widget-header h3 {
  color: #f8fafc;
}

.widget-content {
  display: flex;
  flex-direction: column;
}

.widget-content.loading {
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  color: #64748b;
  gap: 10px;
}

.stats-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
}

.stat-number.active {
  color: #10b981;
}

.stat-separator {
  font-size: 1.5rem;
  font-weight: 400;
  color: #94a3b8;
}

.stat-number.total {
  color: #64748b;
  font-size: 1.8rem;
}

.stat-label {
  margin-top: 4px;
  margin-bottom: 20px;
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 600;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 8px;
}

.users-list::-webkit-scrollbar {
  width: 4px;
}

.users-list::-webkit-scrollbar-track {
  background: transparent;
}

.users-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  background: #f8fafc;
}

:global(body.dark-mode) .user-item {
  background: #0f172a;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
}

:global(body.dark-mode) .user-name {
  color: #e2e8f0;
}

.user-status {
  font-size: 0.75rem;
  color: #10b981;
  font-weight: 600;
}
</style>
