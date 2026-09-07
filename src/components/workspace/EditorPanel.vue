<template>
    <div class="panel-editor">
        <div class="panel-header">
            <div class="panel-title">
                <i class="fa-solid fa-code"></i> Code Editor
            </div>
        </div>
        <div class="editor-container">
            <div class="editor-toolbar">
                <select class="lang-select">
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                </select>
                <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.75rem;"><i class="fa-solid fa-rotate-right"></i> Reset</button>
            </div>
            <textarea class="code-editor" v-model="store.codeContent" spellcheck="false"></textarea>
        </div>
    </div>
</template>

<script setup>
import { useChallengeStore } from '../../stores/challengeStore'
const store = useChallengeStore()
</script>
