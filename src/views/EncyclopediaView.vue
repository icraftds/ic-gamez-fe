<template>
  <div class="encyclopedia-view">
    <SimpleBackground />
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
import SimpleBackground from '../components/common/SimpleBackground.vue'
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

<style scoped src="../assets/css/views/EncyclopediaView.css"></style>
