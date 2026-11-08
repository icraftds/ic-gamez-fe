<template>
  <div class="encyclopedia-view">
    <SimpleBackground />
    
    <div class="container" style="margin-top: 40px">
      <!-- Mode Switcher: Ensiklopedia vs Cheatsheet Vault -->
      <div class="encyclopedia-mode-switcher">
        <button class="mode-tab active">
          <i class="fa-solid fa-book-atlas"></i>
          <span>Ensiklopedia Teori</span>
        </button>
        <router-link to="/cheatsheet" class="mode-tab vault-tab">
          <i class="fa-solid fa-crown"></i>
          <span>Cheatsheet Vault (Expert)</span>
        </router-link>
      </div>

      <div class="encyclopedia-layout">
        <!-- Sidebar Navigation -->
        <aside class="encyclopedia-sidebar">
          <div class="search-box">
            <i class="fa-solid fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Cari teori, konsep, algoritma..." 
            />
            <button 
              v-if="searchQuery" 
              type="button"
              class="clear-search-btn" 
              @click="searchQuery = ''"
              title="Bersihkan pencarian"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <TerminalLoader v-if="isLoading" size="sm" label="topik" />
          
          <nav v-else class="topic-nav">
            <!-- Search Empty State -->
            <div v-if="filteredSections.length === 0" class="search-empty-state">
              <i class="fa-solid fa-magnifying-glass-arrow-right"></i>
              <p>Topik "<strong>{{ searchQuery }}</strong>" tidak ditemukan.</p>
              <button class="reset-search-btn" @click="searchQuery = ''">
                Tampilkan Semua Materi
              </button>
            </div>

            <!-- Sections List -->
            <div 
              class="nav-section" 
              v-for="section in filteredSections" 
              :key="section.id || section.title || section.section"
            >
              <h4 class="section-title">
                <span class="section-name">{{ section.title || section.section }}</span>
                <span class="topic-count-badge">{{ section.topics?.length || 0 }}</span>
              </h4>
              <ul>
                <li v-for="topic in section.topics" :key="topic.id || topic.slug">
                  <a 
                    href="#" 
                    :class="{ active: selectedTopicId === topic.slug }"
                    @click.prevent="selectedTopicId = topic.slug"
                  >
                    <i class="fa-regular fa-file-code topic-icon"></i>
                    <span class="topic-title">{{ topic.title }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="encyclopedia-content">
          <TerminalLoader v-if="isTopicLoading || isLoading" label="artikel" />
          <ArticleReader v-else-if="selectedTopic" :article="selectedTopic" />
          <div v-else class="empty-article-state">
            <i class="fa-solid fa-book-open-reader"></i>
            <h3>Pilih Topik Ensiklopedia</h3>
            <p>Silakan pilih salah satu topik di panel samping untuk mempelajari teori mendalam, best practices industri, dan tips kerja dunia nyata.</p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import SimpleBackground from '../components/common/SimpleBackground.vue'
import ArticleReader from '../components/encyclopedia/ArticleReader.vue'
import api from '../services/api'

const encyclopediaData = ref([])
const selectedTopicId = ref(null)
const selectedTopic = ref(null)
const isLoading = ref(true)
const isTopicLoading = ref(false)
const searchQuery = ref('')

const filteredSections = computed(() => {
  if (!searchQuery.value.trim()) return encyclopediaData.value
  const query = searchQuery.value.trim().toLowerCase()

  return encyclopediaData.value
    .map(section => {
      const sectionName = section.title || section.section || ''
      const sectionMatches = sectionName.toLowerCase().includes(query)

      const filteredTopics = (section.topics || []).filter(topic => {
        if (sectionMatches) return true
        const titleMatch = (topic.title || '').toLowerCase().includes(query)
        const subMatch = (topic.subtitle || '').toLowerCase().includes(query)
        const catMatch = (topic.category || '').toLowerCase().includes(query)
        return titleMatch || subMatch || catMatch
      })

      return {
        ...section,
        topics: filteredTopics
      }
    })
    .filter(section => section.topics && section.topics.length > 0)
})

const fetchEncyclopedia = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/encyclopedia')
    encyclopediaData.value = response.data.data || []
    
    // Set default selected topic if available
    if (encyclopediaData.value.length > 0 && encyclopediaData.value[0].topics?.length > 0) {
      selectedTopicId.value = encyclopediaData.value[0].topics[0].slug
    }
  } catch (error) {
    console.error('Failed to load encyclopedia data', error)
  } finally {
    isLoading.value = false
  }
}

const fetchTopicDetails = async (slug) => {
  if (!slug) return
  try {
    isTopicLoading.value = true
    const response = await api.get(`/encyclopedia/${slug}`)
    selectedTopic.value = response.data.data
  } catch (error) {
    console.error('Failed to load topic details', error)
  } finally {
    isTopicLoading.value = false
  }
}

watch(selectedTopicId, (newId) => {
  fetchTopicDetails(newId)
})

onMounted(() => {
  fetchEncyclopedia()
})
</script>

<style scoped src="../assets/css/views/EncyclopediaView.css"></style>
