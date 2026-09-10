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
          <p
            v-for="(line, index) in instructionLines"
            :key="index"
            class="instruction-line"
          >
            {{ line }}
          </p>
        </div>
      </div>

      <footer class="instruction-footer">
        <button class="nav-btn prev-btn" @click="$emit('back')">
          <i class="fa-solid fa-arrow-left"></i> Kembali
        </button>
        <button class="nav-btn finish-btn" @click="$emit('finish')">
          <i class="fa-solid fa-check"></i>
          {{ isLastLesson ? 'Selesai' : 'Selesai & Lanjut' }}
        </button>
      </footer>
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
          :style="{ height: '100%', fontSize: '14px' }"
          @update:model-value="$emit('update:code', $event)"
        />
      </div>

      <div class="console-section">
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
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { sql } from '@codemirror/lang-sql'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'
import { basicSetup } from 'codemirror'

const props = defineProps({
  lesson: { type: Object, required: true },
  language: { type: String, default: 'javascript' },
  code: { type: String, required: true },
  output: { type: Array, default: () => [] },
  isLastLesson: { type: Boolean, default: false },
})

const emit = defineEmits(['back', 'finish', 'run', 'clear-output', 'update:code'])

const activeOutputTab = ref('console')
const isHtmlMode = computed(() => props.language === 'html' || props.language === 'css')

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

/** Pecah instruksi multiline menjadi array per baris non-kosong. */
const instructionLines = computed(() =>
  (props.lesson.practice || '').split('\n').filter((l) => l.trim() !== '')
)

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
  else if (props.language === 'css') langExtension = html() // fallback to html for css
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

<style scoped>
.practice-panel {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ── Instruction column ── */
.instruction-column {
  width: 38%;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(147, 51, 234, 0.15);
  overflow: hidden;
}

.instruction-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px 36px;
}
.instruction-content::-webkit-scrollbar { width: 4px; }
.instruction-content::-webkit-scrollbar-thumb { background: rgba(147, 51, 234, 0.3); border-radius: 2px; }

.instruction-header { margin-bottom: 20px; }

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 12px;
}
.type-badge.code { background: rgba(147, 51, 234, 0.1); color: #c084fc; border: 1px solid rgba(147, 51, 234, 0.2); }

.lesson-title { font-size: 1.3rem; font-weight: 700; line-height: 1.3; }

.instruction-line {
  color: #cbd5e1;
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 10px;
  padding-left: 12px;
  border-left: 2px solid rgba(124, 58, 237, 0.4);
}

.instruction-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 36px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(10, 6, 18, 0.6);
  flex-shrink: 0;
}

/* ── Editor column ── */
.editor-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #060310;
}

.editor-topbar {
  height: 42px;
  background: rgba(15, 10, 30, 0.95);
  border-bottom: 1px solid rgba(147, 51, 234, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
}

.editor-tabs { display: flex; align-items: center; }
.editor-tab {
  background: rgba(147, 51, 234, 0.15);
  border: 1px solid rgba(147, 51, 234, 0.25);
  border-bottom: none;
  color: #c084fc;
  padding: 5px 16px;
  border-radius: 6px 6px 0 0;
  font-size: 0.78rem;
  font-family: 'JetBrains Mono', monospace;
}

.run-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  color: white;
  padding: 6px 16px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}
.run-btn:hover { opacity: 0.9; transform: scale(1.03); }

.editor-body { flex: 1; overflow: hidden; }
.editor-body :deep(.cm-editor) { height: 100%; }
.editor-body :deep(.cm-scroller) { overflow: auto; }

/* ── Console ── */
.console-section {
  height: 170px;
  min-height: 170px;
  background: rgba(4, 2, 10, 0.98);
  border-top: 1px solid rgba(147, 51, 234, 0.2);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.console-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 0.75rem;
  color: #475569;
  flex-shrink: 0;
}

.clear-btn {
  background: transparent;
  border: none;
  color: #475569;
  font-size: 0.72rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.2s;
}
.clear-btn:hover { color: #94a3b8; }

.console-output {
  flex: 1;
  overflow-y: auto;
  padding: 8px 16px;
}

.console-empty { color: #334155; font-size: 0.82rem; padding-top: 6px; }

.console-entry {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.82rem;
  padding: 2px 0;
  display: flex;
  gap: 8px;
  line-height: 1.5;
}
.console-entry.log { color: #94a3b8; }
.console-entry.error { color: #f87171; }
.console-entry.warn { color: #fbbf24; }
.console-prefix { color: #334155; flex-shrink: 0; }

/* ── Shared nav buttons ── */
.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.prev-btn { background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.12); color: #94a3b8; }
.prev-btn:hover { background: rgba(255, 255, 255, 0.12); color: white; }

.finish-btn { background: linear-gradient(135deg, #10b981, #059669); color: white; }
.finish-btn:hover { opacity: 0.9; transform: translateY(-1px); }

/* ── Output Tabs & Preview ── */
.output-tabs {
  display: flex;
  gap: 10px;
}
.output-tab-btn {
  background: transparent;
  border: none;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}
.output-tab-btn:hover { color: #94a3b8; background: rgba(255, 255, 255, 0.05); }
.output-tab-btn.active { color: #c084fc; background: rgba(147, 51, 234, 0.1); }

.preview-output {
  flex: 1;
  width: 100%;
  height: 100%;
  background: white; /* Preview harus punya background putih agar rendering HTML standar terlihat */
}
.html-preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}
</style>
