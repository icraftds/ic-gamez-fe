<template>
  <div 
    class="path-card" 
    :class="{ premium: path.isPremium }"
    @click="$emit('click')"
  >
    <div class="path-icon">
      <i :class="path.icon"></i>
    </div>
    <div class="path-content">
      <h3>{{ path.title }}</h3>
      <p>{{ path.description }}</p>
    </div>
    <div class="path-action">
      <span v-if="path.isPremium" class="badge premium-badge">
        <i class="fa-solid fa-crown"></i> Premium
      </span>
      <span v-else class="badge free-badge">Mulai Belajar</span>
      <i class="fa-solid fa-arrow-right arrow-icon"></i>
    </div>
  </div>
</template>

<script setup>
defineProps({
  path: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])
</script>

<style scoped>
.path-card {
  background: rgba(20, 15, 40, 0.7);
  border: 1px solid rgba(147, 51, 234, 0.4);
  border-radius: 16px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.path-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(147, 51, 234, 0.2);
  border-color: rgba(147, 51, 234, 0.8);
}

.path-card.premium {
  border-color: rgba(245, 158, 11, 0.4);
}

.path-card.premium:hover {
  box-shadow: 0 10px 25px rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.8);
}

.path-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-dark), var(--secondary));
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
  color: white;
  margin-bottom: 20px;
}

.premium .path-icon {
  background: linear-gradient(135deg, #b45309, #f59e0b);
}

.path-content {
  flex: 1;
}

.path-content h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #fff;
}

.path-content p {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 20px;
}

.path-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
}

.badge {
  padding: 6px 12px;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
}

.free-badge {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.premium-badge {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.arrow-icon {
  color: #94a3b8;
  transition: transform 0.3s ease;
}

.path-card:hover .arrow-icon {
  transform: translateX(5px);
  color: white;
}
</style>
