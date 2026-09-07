<template>
  <div class="article-reader">
    <div class="article-header">
      <div class="article-meta">
        <span class="category"><i class="fa-solid fa-folder"></i> Data Structures</span>
        <span class="read-time"><i class="fa-regular fa-clock"></i> 5 min read</span>
      </div>
      <h1>Pengenalan Hash Table</h1>
      <p class="subtitle">Struktur data dengan kompleksitas waktu pencarian O(1).</p>
    </div>

    <div class="article-body markdown-body">
      <h2>Apa itu Hash Table?</h2>
      <p>
        Hash table (atau hash map) adalah struktur data yang mengimplementasikan tipe data abstrak array asosiatif, 
        struktur yang dapat memetakan kunci (keys) ke nilai (values).
      </p>

      <h2>Cara Kerja</h2>
      <p>
        Hash table menggunakan fungsi hash untuk menghitung indeks ke dalam array array (disebut juga 
        buckets atau slots), dari mana nilai yang diinginkan dapat ditemukan. Idealnya, fungsi hash 
        akan menetapkan setiap kunci ke bucket yang unik, tetapi sebagian besar desain hash table 
        menggunakan fungsi hash yang tidak sempurna, yang dapat menyebabkan hash collision 
        (tabrakan hash) di mana fungsi hash menghasilkan indeks yang sama untuk lebih dari satu kunci.
      </p>

      <h3>Contoh Kode (Python)</h3>
      <div class="code-block">
        <div class="code-header">python</div>
        <pre><code># Inisialisasi hash map (dictionary di Python)
my_map = {}

# Menyisipkan nilai
my_map["apple"] = 100
my_map["banana"] = 200

# Mengakses nilai (O(1))
print(my_map["apple"]) # Output: 100

# Memeriksa apakah kunci ada
if "orange" in my_map:
    print("Ada")
else:
    print("Tidak ada")
</code></pre>
      </div>

      <div class="article-tip">
        <strong><i class="fa-solid fa-lightbulb"></i> Tip Interview:</strong> 
        Dalam wawancara coding (seperti soal Two Sum), menggunakan Hash Table/Map seringkali 
        menjadi solusi optimal untuk menurunkan Time Complexity dari O(N²) menjadi O(N).
      </div>
    </div>
  </div>
</template>

<script setup>
// This is a mockup for the article reader.
// In a real application, this would fetch markdown content and render it using a library like markdown-it.
</script>

<style scoped>
.article-reader {
  background: rgba(15, 10, 30, 0.8);
  border: 1px solid rgba(147, 51, 234, 0.3);
  border-radius: 16px;
  padding: 40px;
  backdrop-filter: blur(20px);
}

.article-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.article-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  color: #94a3b8;
  font-size: 0.9rem;
}

.category {
  color: var(--primary);
}

.article-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  background: linear-gradient(90deg, #fff, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.2rem;
  color: #cbd5e1;
}

/* Mockup Markdown Styling */
.markdown-body {
  color: #e2e8f0;
  line-height: 1.7;
}

.markdown-body h2 {
  font-size: 1.8rem;
  margin: 30px 0 15px 0;
  color: #fff;
}

.markdown-body h3 {
  font-size: 1.4rem;
  margin: 25px 0 15px 0;
  color: #fff;
}

.markdown-body p {
  margin-bottom: 20px;
  font-size: 1.05rem;
}

.code-block {
  background: #0d0914;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  margin: 20px 0;
  overflow: hidden;
}

.code-header {
  background: rgba(255,255,255,0.05);
  padding: 5px 15px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: #94a3b8;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.code-block pre {
  padding: 15px;
  margin: 0;
  overflow-x: auto;
}

.code-block code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.95rem;
  color: #a5b4fc;
}

.article-tip {
  background: rgba(147, 51, 234, 0.1);
  border-left: 4px solid var(--primary-dark);
  padding: 15px 20px;
  border-radius: 0 8px 8px 0;
  margin: 30px 0;
  color: #f8fafc;
}

.article-tip strong {
  color: #c084fc;
}

@media (max-width: 768px) {
  .article-reader {
    padding: 20px;
  }
  
  .article-header h1 {
    font-size: 2rem;
  }
}
</style>
