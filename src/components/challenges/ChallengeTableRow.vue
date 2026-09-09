<template>
  <tr
    @click="$emit('click', challenge)"
    :class="{ 'is-premium-row': challenge.isPremium && !isPremiumUser }"
  >
    <td>
      {{ challenge.title }}
      <span v-if="challenge.isPremium" class="badge-sm premium">
        <i class="fa-solid fa-lock" v-if="!isPremiumUser"></i> Premium
      </span>
    </td>
    <td>{{ challenge.category }}</td>
    <td>
      <span class="diff-badge" :class="challenge.difficulty.toLowerCase()">
        {{ challenge.difficulty }}
      </span>
    </td>
    <td class="status-cell">
      <i v-if="challenge.isCompleted" class="fa-solid fa-circle-check completed"></i>
      <i v-else class="fa-regular fa-circle pending"></i>
    </td>
  </tr>
</template>

<script setup>
defineProps({
  challenge: { type: Object, required: true },
  isPremiumUser: { type: Boolean, required: true },
})
defineEmits(['click'])
</script>

<style scoped>
tr {
  cursor: pointer;
  transition: background 0.2s ease;
}

tr:hover {
  background: rgba(255, 255, 255, 0.05);
}

tr.is-premium-row {
  opacity: 0.8;
}

td {
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
}

.status-cell {
  text-align: center;
}

.status-cell .completed {
  color: #10b981;
  font-size: 1.2rem;
}

.status-cell .pending {
  color: #475569;
  font-size: 1.2rem;
}

.badge-sm {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: 10px;
  vertical-align: middle;
}

.badge-sm.premium {
  background: rgba(245, 158, 11, 0.2);
  color: #fcd34d;
  border: 1px solid rgba(245, 158, 11, 0.5);
}

.diff-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid transparent;
}
.diff-badge.mudah {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.3);
}
.diff-badge.sedang {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.3);
}
.diff-badge.sulit {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}
</style>
