<template>
  <footer class="app-footer">
    <p>&copy; {{ new Date().getFullYear() }} Copyright by Icraft. All rights reserved.</p>
  </footer>
</template>

<style scoped>
.app-footer {
  text-align: center;
  padding: 40px 20px;
  margin-top: 60px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  color: #64748b;
  font-size: 0.95rem;
  background: rgba(15, 10, 30, 0.5);
  backdrop-filter: blur(5px);
  width: 100%;
}
</style>
