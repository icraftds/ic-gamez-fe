<template>
  <div class="practice-panel">
    <!-- Left: Instruction -->
    <section class="instruction-column">
      <div class="instruction-content">
        <header class="instruction-header">
          <span class="type-badge code">
            <i class="fa-solid fa-laptop-code"></i> Tantangan Koding
          </span>
          <h2 class="lesson-title">{{ lesson.title }}</h2>
        </header>

        <div class="instruction-body">
          <div class="practice-cards" v-if="practiceSections">
            
            <div class="p-card info-card" v-if="practiceSections.info">
              <p>{{ practiceSections.info }}</p>
            </div>
            
            <div class="p-card task-card" v-if="practiceSections.task">
              <h4><i class="fa-solid fa-list-check"></i> Tugas</h4>
              <p>{{ practiceSections.task }}</p>
            </div>
            
            <div class="p-card example-card" v-if="practiceSections.example">
              <h4><i class="fa-solid fa-lightbulb"></i> Contoh Format / Input</h4>
              <pre><code>{{ practiceSections.example }}</code></pre>
            </div>
            
            <div class="p-card output-card" v-if="practiceSections.output">
              <h4><i class="fa-solid fa-terminal"></i> Harapan Output</h4>
              <p>{{ practiceSections.output }}</p>
            </div>
            
          </div>
          <div class="markdown-body" v-html="parsedInstruction" v-else></div>
        </div>
      </div>

      <footer class="instruction-footer">
        <div class="footer-left">
          <button class="nav-btn prev-btn" @click="$emit('back')">
            <i class="fa-solid fa-arrow-left"></i> Kembali
          </button>
          
          <button 
            v-if="!hintText" 
            class="nav-btn hint-btn" 
            @click="openHint" 
            :disabled="isHintLoading"
          >
            <i v-if="isHintLoading" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-lightbulb"></i> Buka Hint (⚡1)
          </button>
        </div>

        <button class="nav-btn finish-btn" @click="$emit('finish')">
          <i class="fa-solid fa-check"></i>
          {{ isLastLesson ? 'Selesai' : 'Selesai & Lanjut' }}
        </button>
      </footer>
      
      <!-- Hint Display Section -->
      <div v-if="hintText" class="hint-display">
        <h4><i class="fa-solid fa-lightbulb"></i> Hint:</h4>
        <div class="hint-content" v-html="hintText"></div>
      </div>
    </section>

    <!-- Right: Code Editor + Console -->
    <section class="editor-column">
      <div class="editor-topbar">
        <div class="editor-tabs">
          <span class="editor-tab">{{ editorTabName }}</span>
        </div>
        <button class="run-btn" @click="$emit('run')">
          <i class="fa-solid fa-play"></i> Jalankan
        </button>
      </div>

      <div class="editor-body">
        <Codemirror
          :model-value="code"
          :extensions="editorExtensions"
          @update:model-value="$emit('update:code', $event)"
        />
      </div>

      <div class="console-section">
        
        <div v-if="runStatus === 'success'" class="feedback-banner success">
          <i class="fa-solid fa-circle-check"></i> Kode berhasil dijalankan! Hasil telah divalidasi.
        </div>
        
        <div v-else-if="runStatus === 'warning'" class="feedback-banner warning">
          <i class="fa-solid fa-triangle-exclamation"></i> Kode berjalan tanpa error, tapi output belum sesuai dengan yang diharapkan.
        </div>
        <div v-else-if="runStatus === 'error'" class="feedback-banner error">
          <i class="fa-solid fa-circle-xmark"></i> Terdapat error saat menjalankan kode. Perbaiki dan coba lagi!
        </div>

        <div class="console-header">
          <div class="output-tabs">
            <button
              class="output-tab-btn"
              :class="{ active: activeOutputTab === 'console' }"
              @click="activeOutputTab = 'console'"
            >
              <i class="fa-solid fa-terminal"></i> Console Output
            </button>
            <button
              v-if="isHtmlMode"
              class="output-tab-btn"
              :class="{ active: activeOutputTab === 'preview' }"
              @click="activeOutputTab = 'preview'"
            >
              <i class="fa-solid fa-eye"></i> Preview
            </button>
          </div>
          <button class="clear-btn" @click="$emit('clear-output')">
            <i class="fa-solid fa-trash"></i> Clear
          </button>
        </div>

        <div v-if="activeOutputTab === 'console'" class="console-output" role="log" aria-live="polite">
          <p v-if="output.length === 0" class="console-empty">
            Tekan <strong>Jalankan</strong> untuk melihat output…
          </p>
          <div
            v-for="(entry, index) in output"
            :key="index"
            class="console-entry"
            :class="entry.type"
          >
            <span class="console-prefix" aria-hidden="true">
              {{ entry.type === 'error' ? '✖' : '›' }}
            </span>
            {{ entry.text }}
          </div>
        </div>

        <div v-if="activeOutputTab === 'preview' && isHtmlMode" class="preview-output">
          <iframe :srcdoc="code" class="html-preview-iframe" sandbox="allow-scripts allow-same-origin"></iframe>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { sql } from '@codemirror/lang-sql'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { useUserAccount } from '../../../composables/useUserAccount'
import api from '../../../services/api'

const props = defineProps({
  lesson: { type: Object, required: true },
  language: { type: String, default: 'javascript' },
  code: { type: String, required: true },
  output: { type: Array, default: () => [] },
  isLastLesson: { type: Boolean, default: false },
  runStatus: { type: String, default: 'idle' },
})

const emit = defineEmits(['back', 'finish', 'run', 'clear-output', 'update:code'])

const activeOutputTab = ref('console')
const isHtmlMode = computed(() => props.language === 'html' || props.language === 'css')

const hintText = ref(null)
const isHintLoading = ref(false)
const { credits } = useUserAccount()

const openHint = async () => {
  if (!props.lesson || !props.lesson.id) return
  isHintLoading.value = true
  try {
    const res = await api.post(`/hints/lesson/${props.lesson.id}`)
    
    // Perbaikan struktur dari res.data.data.hint_text menjadi res.data.hint
    if (res.data && res.data.hint) {
      hintText.value = marked.parse(res.data.hint || 'Tidak ada hint tersedia.')
      if (res.data.remaining_credits !== undefined) {
        credits.value = res.data.remaining_credits
      }
    } else {
      hintText.value = marked.parse('Tidak ada hint tersedia.')
    }
  } catch (error) {
    if (error.response?.status === 403) {
      alert(error.response?.data?.message || 'Energi Anda habis. Silakan top-up atau upgrade ke PRO.')
    } else if (error.response?.status === 400) {
      alert(error.response?.data?.message || 'Gagal membuka hint.')
    } else {
      alert('Gagal mengambil hint.')
    }
  } finally {
    isHintLoading.value = false
  }
}

watch(() => props.output, (newOutput) => {
  // Pindah ke tab preview secara otomatis jika HTML dirender sukses
  if (isHtmlMode.value && newOutput.length > 0 && newOutput[0].text.includes('Render HTML berhasil')) {
    activeOutputTab.value = 'preview'
  } else {
    activeOutputTab.value = 'console'
  }
})

const editorTabName = computed(() => {
  if (props.language === 'html') return 'index.html'
  if (props.language === 'css') return 'style.css'
  if (props.language === 'sql') return 'query.sql'
  return 'solution.js'
})

const practiceSections = computed(() => {
  const text = props.lesson.practice
  
  if (!text) {
    return {
      title: 'Latihan Bebas',
      info: 'Tidak ada tugas spesifik untuk materi ini. Silakan bereksperimen menggunakan editor di samping!',
      task: 'Tulis dan jalankan kode JavaScript apa saja untuk menguji pemahaman Anda.',
      example: '',
      output: ''
    }
  }

  const lines = text.split('\n')
  let commentLines = []
  
  for (let line of lines) {
    let t = line.trim()
    // Match //, <!--, /*, or #
    if (t.startsWith('//') || t.startsWith('<' + '!--') || t.startsWith('/*') || t.startsWith('#')) {
      let cleaned = t.replace(/^(?:\/\/|<\!--|\/\*|#)\s*/, '')
                     .replace(/(?:--\>|\*\/)\s*$/, '')
      commentLines.push(cleaned.trim())
    } else if (t !== '') {
      break
    }
  }

  let result = {
    title: 'Tantangan Praktik',
    info: '',
    task: '',
    example: '',
    output: ''
  }

  let currentSection = 'info'

  for (let line of commentLines) {
    if (line.includes('🎯 TANTANGAN:')) {
      result.title = line.replace('🎯 TANTANGAN:', '').trim()
      continue
    }

    let lowerLine = line.toLowerCase()
    
    if (lowerLine.startsWith('tugas:')) {
      currentSection = 'task'
      result.task += line.substring(6).trim() + ' '
      continue
    } else if (lowerLine.startsWith('contoh:') || lowerLine.startsWith('contoh format:')) {
      currentSection = 'example'
      result.example += line.replace(/contoh(?: format)?:/i, '').trim() + '\n'
      continue
    } else if (lowerLine.startsWith('harapan:') || lowerLine.startsWith('output:')) {
      currentSection = 'output'
      result.output += line.replace(/(?:harapan|output):/i, '').trim() + ' '
      continue
    }

    if (line.trim() !== '') {
      if (currentSection === 'example') {
         result[currentSection] += line + '\n'
      } else {
         result[currentSection] += line + ' '
      }
    }
  }

  return result
})

const parsedInstruction = computed(() => {
  const text = props.lesson.explanation || ''
  return marked.parse(text)
})

const customTheme = EditorView.theme({
  "&": {
    backgroundColor: "#060310 !important"
  },
  ".cm-gutters": {
    backgroundColor: "#060310 !important",
    color: "#475569",
    borderRight: "1px solid rgba(147, 51, 234, 0.15)"
  },
  ".cm-activeLineGutter": {
    backgroundColor: "rgba(147, 51, 234, 0.1) !important",
    color: "#c084fc"
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(147, 51, 234, 0.05) !important"
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "#c084fc !important"
  },
  "&.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "rgba(124, 58, 237, 0.3) !important"
  }
}, { dark: true })

const editorExtensions = computed(() => {
  let langExtension = javascript()
  if (props.language === 'html') langExtension = html()
  else if (props.language === 'css') langExtension = html()
  else if (props.language === 'sql') langExtension = sql()

  return [
    basicSetup,
    langExtension,
    oneDark,
    customTheme,
    EditorView.lineWrapping
  ]
})
</script>

<style scoped src="../../../assets/css/components/workspace/PracticePanel/PracticePanel.css"></style>
