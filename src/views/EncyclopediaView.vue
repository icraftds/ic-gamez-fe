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
          
          <nav class="topic-nav">
            <div class="nav-section">
              <h4>Struktur Data</h4>
              <ul>
                <li><a href="#" class="active">Hash Table</a></li>
                <li><a href="#">Linked List</a></li>
                <li><a href="#">Stack & Queue</a></li>
                <li><a href="#">Trees & Graphs</a></li>
              </ul>
            </div>
            
            <div class="nav-section">
              <h4>Algoritma Dasar</h4>
              <ul>
                <li><a href="#">Binary Search</a></li>
                <li><a href="#">Two Pointers</a></li>
                <li><a href="#">Sliding Window</a></li>
              </ul>
            </div>
            
            <div class="nav-section">
              <h4>Algoritma Lanjut</h4>
              <ul>
                <li><a href="#">Dynamic Programming</a></li>
                <li><a href="#">Backtracking</a></li>
                <li><a href="#">Greedy</a></li>
              </ul>
            </div>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="encyclopedia-content">
          <ArticleReader />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import BackgroundEffects from '../components/common/BackgroundEffects.vue'
import HomeNavbar from '../components/home/HomeNavbar.vue'
import ArticleReader from '../components/encyclopedia/ArticleReader.vue'
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
</style>
