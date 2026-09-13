<template>
  <div class="encyclopedia-view">
    <BackgroundEffects :show-orb3="true" />
    <HomeNavbar />

    <div class="container" style="margin-top: 40px">
      <div class="encyclopedia-layout">
        <!-- Sidebar Navigation -->
        <aside class="encyclopedia-sidebar">
          <div class="search-box">
            <i class="fa-solid fa-search"></i>
            <input type="text" placeholder="Cari algoritma, teori..." />
          </div>
          
          <div v-if="isLoading" class="sidebar-loading">
            <div class="spinner-small"></div>
            <span>Memuat data...</span>
          </div>
          <nav v-else class="topic-nav">
            <div class="nav-section" v-for="section in encyclopediaData" :key="section.section">
              <h4>{{ section.section }}</h4>
              <ul>
                <li v-for="topic in section.topics" :key="topic.id">
                  <a href="#" 
                     :class="{ active: selectedTopicId === topic.slug }"
                     @click.prevent="selectedTopicId = topic.slug">
                    {{ topic.title }}
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="encyclopedia-content">
          <div v-if="isTopicLoading || isLoading" class="article-loading">
            <div class="spinner"></div>
            <p>Memuat artikel...</p>
          </div>
          <ArticleReader v-else-if="selectedTopic" :article="selectedTopic" />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import BackgroundEffects from '../components/common/BackgroundEffects.vue'
import HomeNavbar from '../components/home/HomeNavbar.vue'
import ArticleReader from '../components/encyclopedia/ArticleReader.vue'
import api from '../services/api'

const encyclopediaData = ref([])
const selectedTopicId = ref(null)
const selectedTopic = ref(null)
const isLoading = ref(true)
const isTopicLoading = ref(false)

const fetchEncyclopedia = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/encyclopedia')
    encyclopediaData.value = response.data.data
    
    // Set default selected topic if available
    if (encyclopediaData.value.length > 0 && encyclopediaData.value[0].topics.length > 0) {
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

<style scoped>
.encyclopedia-view {
  min-height: 100vh;
  padding-bottom: 50px;
}

.encyclopedia-layout {
  display: flex;
  gap: 30px;
  margin-top: 20px;
}

/* Sidebar Styling */
.encyclopedia-sidebar {
  width: 300px;
  flex-shrink: 0;
  background: rgba(10, 5, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  position: sticky;
  top: 100px;
  height: calc(100vh - 120px);
  overflow-y: auto;
}

/* Custom Scrollbar for Sidebar */
.encyclopedia-sidebar::-webkit-scrollbar {
  width: 5px;
}
.encyclopedia-sidebar::-webkit-scrollbar-thumb {
  background: rgba(147, 51, 234, 0.5);
  border-radius: 10px;
}

.search-box {
  position: relative;
  margin-bottom: 25px;
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-box input {
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 99px;
  padding: 10px 15px 10px 40px;
  color: #fff;
  font-family: 'Fredoka', sans-serif;
  outline: none;
  transition: all 0.3s;
}

.search-box input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
}

.nav-section {
  margin-bottom: 25px;
}

.nav-section h4 {
  color: #94a3b8;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.topic-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.topic-nav li {
  margin-bottom: 5px;
}

.topic-nav a {
  display: block;
  padding: 8px 12px;
  color: #cbd5e1;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.topic-nav a:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.topic-nav a.active {
  background: rgba(147, 51, 234, 0.2);
  color: #c084fc;
  font-weight: 500;
}

/* Main Content */
.encyclopedia-content {
  flex: 1;
  min-width: 0; /* Prevents flex item from overflowing */
}

@media (max-width: 992px) {
  .encyclopedia-layout {
    flex-direction: column;
  }
  
  .encyclopedia-sidebar {
    width: 100%;
    position: static;
    height: auto;
    max-height: 400px;
  }
}

/* Loading Animations */
.sidebar-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #94a3b8;
  padding: 30px 0;
}
.article-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: rgba(15, 10, 30, 0.8);
  border: 1px solid rgba(147, 51, 234, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  color: #cbd5e1;
}
.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(192, 132, 252, 0.2);
  border-top-color: #c084fc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}
.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(192, 132, 252, 0.2);
  border-top-color: #c084fc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
