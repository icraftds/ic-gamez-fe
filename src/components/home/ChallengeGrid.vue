<template>
  <section class="reveal" id="challenges" style="scroll-margin-top: 100px">
    <div class="section-header">
      <h2>Tantangan <span class="gradient-text">Algoritma</span></h2>
      
      <!-- Filter Bar -->
      <div class="filter-tabs">
        <button 
          v-for="level in levels" 
          :key="level.id"
          :class="['filter-btn', { active: activeLevel === level.id }]"
          @click="activeLevel = level.id"
        >
          {{ level.name }}
        </button>
      </div>
    </div>

    <div class="perspective-grid">
      <component
        v-for="(challenge, index) in filteredChallenges"
        :key="challenge.id"
        :is="getCardTag(challenge.stage)"
        :to="getCardRoute(challenge.stage)"
        :href="getCardHref(challenge.stage)"
        class="persp-card"
        @click="handleCardClick($event, challenge.stage)"
        @mouseenter="handleCardHover($event, index)"
      >
        <div class="card-content" :ref="el => cardContentRefs[index] = el">
          <div class="card-content-normal">
            <div class="card-header">
              <div :class="['diff-badge', challenge.diffClass]">{{ challenge.diffLabel }}</div>
              <div class="tags">
                <span v-for="tag in challenge.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
            <h3>{{ challenge.title }}</h3>
            <p>{{ challenge.description }}</p>
            <div :class="getButtonClass(challenge.stage)" v-html="getButtonContent(challenge.stage)"></div>
          </div>
          <div class="card-code-preview">
            <pre><code>{{ challenge.codePreview }}</code></pre>
          </div>
        </div>
      </component>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const emit = defineEmits(['open-coffee-modal'])

const levels = [
  { id: 'all', name: 'Semua Level' },
  { id: 'junior', name: 'Junior (Easy)' },
  { id: 'mid', name: 'Mid (Medium)' },
  { id: 'senior', name: 'Senior (Hard)' }
]

const activeLevel = ref('all')

const challenges = [
  {
    id: 1,
    stage: 1,
    levelId: 'junior',
    tags: ['Array', 'Hash Table'],
    title: 'Two Sum',
    description: 'Temukan dua angka dalam struktur data array yang jika dijumlahkan akan menghasilkan nilai target secara optimal.',
    diffClass: 'diff-easy',
    diffLabel: 'O(N) - EASY',
    codePreview: `def twoSum(nums, target):\n    map = {}\n    for i, n in enumerate(nums):\n        if target - n in map:\n            return [map[target-n], i]\n        map[n] = i`
  },
  {
    id: 2,
    stage: 2,
    levelId: 'mid',
    tags: ['Linked List', 'Math'],
    title: 'Add Two Numbers',
    description: 'Jumlahkan dua angka dari linked list di mana setiap node mengandung satu digit terbalik.',
    diffClass: 'diff-medium',
    diffLabel: 'MEDIUM',
    codePreview: `function addTwoNumbers(l1, l2) {\n  let dummy = new ListNode();\n  let curr = dummy;\n  let carry = 0;\n  // ...\n}`
  },
  {
    id: 3,
    stage: 3,
    levelId: 'mid',
    tags: ['Array', 'Sorting'],
    title: 'Merge Intervals',
    description: 'Gabungkan semua interval yang tumpang tindih sehingga menjadi interval yang bersih dan berurutan.',
    diffClass: 'diff-medium',
    diffLabel: 'MEDIUM',
    codePreview: `def merge(intervals):\n    intervals.sort()\n    res = [intervals[0]]\n    for i in intervals[1:]:\n        # check overlap\n        pass`
  },
  {
    id: 4,
    stage: 4,
    levelId: 'senior',
    tags: ['Array', 'Binary Search'],
    title: 'Median Arrays',
    description: 'Temukan nilai median dari dua array yang sudah diurutkan dengan kompleksitas waktu O(log(m+n)).',
    diffClass: 'diff-hard',
    diffLabel: 'HARD',
    codePreview: `class Solution {\npublic:\n    double findMedianSortedArrays(\n        vector<int>& nums1) {\n        // O(log(m+n)) approach\n    }\n};`
  },
  {
    id: 5,
    stage: 5,
    levelId: 'junior',
    tags: ['String', 'Stack'],
    title: 'Valid Parentheses',
    description: 'Tentukan apakah string masukan memiliki urutan kurung buka dan tutup yang valid menggunakan struktur data stack.',
    diffClass: 'diff-easy',
    diffLabel: 'EASY',
    codePreview: `public boolean isValid(String s) {\n    Stack<Character> stack = \n        new Stack<>();\n    for (char c : s.toCharArray()) {\n        // push and pop\n    }\n}`
  },
  {
    id: 6,
    stage: 6,
    levelId: 'senior',
    tags: ['Design', 'Linked List'],
    title: 'LRU Cache',
    description: 'Rancang dan implementasikan struktur data untuk Least Recently Used (LRU) cache dengan kapasitas terbatas.',
    diffClass: 'diff-hard',
    diffLabel: 'HARD',
    codePreview: `class LRUCache {\n    private int capacity;\n    private Map<Int, Node> cache;\n    // implement doubly linked list\n}`
  }
]

const filteredChallenges = computed(() => {
  if (activeLevel.value === 'all') return challenges;
  return challenges.filter(c => c.levelId === activeLevel.value);
})

const unlockedStage = ref(1)
const cardContentRefs = ref({})

onMounted(() => {
  unlockedStage.value = parseInt(localStorage.getItem('ic_unlocked_stage')) || 1
})

function getCardTag(stage) {
  return stage <= unlockedStage.value ? 'router-link' : 'a'
}

function getCardRoute(stage) {
  return stage <= unlockedStage.value ? `/workspace?stage=${stage}` : undefined
}

function getCardHref(stage) {
  return stage <= unlockedStage.value ? undefined : '#'
}

function getButtonClass(stage) {
  if (stage < unlockedStage.value) {
    return 'btn-start btn-completed'
  } else if (stage === unlockedStage.value) {
    return 'btn-start'
  }
  return 'btn-start btn-disabled'
}

function getButtonContent(stage) {
  if (stage < unlockedStage.value) {
    return 'Selesai <i class="fa-solid fa-check"></i>'
  } else if (stage === unlockedStage.value) {
    return 'Mulai Kode <i class="fa-solid fa-bolt"></i>'
  }
  return '<i class="fa-solid fa-lock"></i> Terkunci'
}

function handleCardClick(event, stage) {
  if (stage > unlockedStage.value) {
    event.preventDefault()
    emit('open-coffee-modal')
  }
}

function handleCardHover(event, index) {
  const content = cardContentRefs.value[index]
  if (content && !content.classList.contains('is-flipping')) {
    content.classList.add('is-flipping')
    setTimeout(() => {
      content.classList.remove('is-flipping')
    }, 5000)
  }
}
</script>

<style scoped src="../../assets/css/components/home/ChallengeGrid.css"></style>
