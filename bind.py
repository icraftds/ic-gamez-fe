import re

with open('frontend/src/views/WorkspaceView.vue', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace static elements with Vue bindings
content = content.replace('<span id="topBarTitle">Loading...</span>', '<span>{{ stageData?.title.split(". ")[1] }}</span>')
content = content.replace('<h2 class="problem-title" id="problemTitle">Loading...</h2>', '<h2 class="problem-title">{{ stageData?.title }}</h2>')
content = content.replace('<div id="problemDiff"></div>', '<div><div :class="stageData?.diffClass">{{ stageData?.diff }}</div></div>')
content = content.replace('<div class="prose" id="problemProse">\n                        <!-- Loaded dynamically -->\n                    </div>', '<div class="prose" v-html="stageData?.prose"></div>')

content = content.replace('id="tabDescription"', ':class="{ active: activeTab === \'Description\' }" @click="activeTab = \'Description\'"')
content = content.replace('id="tabSubmissions"', ':class="{ active: activeTab === \'Submissions\' }" @click="activeTab = \'Submissions\'"')

content = content.replace('id="viewDescription"', 'v-show="activeTab === \'Description\'"')
content = content.replace('id="viewSubmissions" style="display: none;"', 'v-show="activeTab === \'Submissions\'"')

content = content.replace('<div class="prose" id="submissionsList">\n                        <!-- Submissions loaded dynamically -->\n                    </div>', '''<div class="prose">
                        <p v-if="submissions.length === 0">Belum ada submission. Jalankan kode Anda untuk mulai!</p>
                        <div v-else v-for="(sub, idx) in submissions" :key="idx" class="submission-card">
                            <div>
                                <div :class="sub.status === 'Accepted' ? 'sub-status-success' : 'sub-status-fail'">
                                    <i class="fa-solid fa-check" v-if="sub.status === 'Accepted'"></i>
                                    <i class="fa-solid fa-xmark" v-else></i> {{ sub.status }}
                                </div>
                                <div class="sub-time">Percobaan ke-{{ sub.attempt }} &bull; {{ sub.date }}</div>
                            </div>
                        </div>
                    </div>''')

content = content.replace('<textarea class="code-editor" id="codeEditor" spellcheck="false"></textarea>', '<textarea class="code-editor" v-model="codeContent" spellcheck="false"></textarea>')

content = content.replace('<span>10/10</span>', '<span>{{ tokens }}/10</span>')

content = content.replace('<button class="btn btn-outline" id="runBtn">', '<button class="btn btn-outline" @click="runCode" :disabled="isRunning">')
content = content.replace('<button class="btn btn-primary" id="submitBtn">', '<button class="btn btn-primary" @click="submitCode" :disabled="isSubmitting">')

content = content.replace('id="consoleOutput">\n                    Run your code to see the test results here.\n                </div>', 'v-html="consoleOutputHtml"></div>')

# Modal bindings
content = content.replace('id="resultModal"', ':class="{ active: modalActive }"')
content = content.replace('<div class="modal-icon" id="modalIcon"></div>', '<div class="modal-icon"><i v-if="modalState.type === \'success\'" class="fa-solid fa-circle-check modal-success-icon"></i><i v-else class="fa-solid fa-circle-xmark modal-fail-icon"></i></div>')
content = content.replace('<h2 id="modalTitle" style="margin-bottom: 10px;">Title</h2>', '<h2 style="margin-bottom: 10px;">{{ modalState.title }}</h2>')
content = content.replace('<p id="modalDesc" style="color: var(--text-sub); margin-bottom: 25px;">Description</p>', '<p style="color: var(--text-sub); margin-bottom: 25px;">{{ modalState.desc }}</p>')
content = content.replace('<button class="btn btn-primary" style="width: 100%;" id="modalBtn">Lanjut</button>', '<button class="btn btn-primary" style="width: 100%;" @click="closeModal">{{ modalState.btnText }}</button>')
content = content.replace('onclick="closeModal()"', '@click="closeModal"')

with open('frontend/src/views/WorkspaceView.vue', 'w', encoding='utf-8') as f:
    f.write(content)
