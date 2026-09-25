<template>
  <div class="language-switcher">
    <select v-model="currentLocale" @change="changeLanguage" class="lang-select">
      <option value="id">ID</option>
      <option value="en">EN</option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLocale = ref(locale.value)

const changeLanguage = () => {
  locale.value = currentLocale.value
  localStorage.setItem('user_locale', currentLocale.value)
  // Optional: you can reload page here if you want to force re-fetch of API data
  // window.location.reload()
}
</script>

<style scoped>
.language-switcher {
  display: inline-flex;
  align-items: center;
  margin-left: 1rem;
}

.lang-select {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
}

.lang-select:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lang-select option {
  background: #1e293b;
  color: white;
}
</style>
