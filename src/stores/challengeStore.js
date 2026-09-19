import { defineStore } from 'pinia'

// Dummy Data for Challenges
const challenges = [
    {
        id: 1,
        title: "1. Two Sum",
        diff: "Easy",
        diffClass: "diff-easy",
        prose: `
            <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
            <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
            <p>You can return the answer in any order.</p>
            <h3>Example 1:</h3>
            <div class="example-box"><strong>Input:</strong> nums = [2,7,11,15], target = 9<br><strong>Output:</strong> [0,1]</div>
        `,
        template: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Write your code here\n    \n};`,
        funcName: "twoSum",
        testCases: [
            { input: [[2,7,11,15], 9], expected: [0,1] },
            { input: [[3,2,4], 6], expected: [1,2] },
            { input: [[3,3], 6], expected: [0,1] }
        ]
    },
    {
        id: 2,
        title: "2. Reverse Array",
        diff: "Easy",
        diffClass: "diff-easy",
        prose: `
            <p>Write a function that reverses an array in place.</p>
            <h3>Example 1:</h3>
            <div class="example-box"><strong>Input:</strong> arr = [1, 2, 3]<br><strong>Output:</strong> [3, 2, 1]</div>
        `,
        template: `/**\n * @param {number[]} arr\n * @return {number[]}\n */\nvar reverseArray = function(arr) {\n    \n};`,
        funcName: "reverseArray",
        testCases: [
            { input: [[1, 2, 3]], expected: [3, 2, 1] },
            { input: [[5, 4, 1]], expected: [1, 4, 5] }
        ]
    },
    {
        id: 3,
        title: "3. Merge Intervals",
        diff: "Medium",
        diffClass: "diff-medium",
        prose: `
            <p>Given an array of <code>intervals</code> where <code>intervals[i] = [starti, endi]</code>, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.</p>
            <h3>Example 1:</h3>
            <div class="example-box"><strong>Input:</strong> intervals = [[1,3],[2,6],[8,10],[15,18]]<br><strong>Output:</strong> [[1,6],[8,10],[15,18]]</div>
        `,
        template: `/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nvar merge = function(intervals) {\n    \n};`,
        funcName: "merge",
        testCases: [
            { input: [[[1,3],[2,6],[8,10],[15,18]]], expected: [[1,6],[8,10],[15,18]] },
            { input: [[[1,4],[4,5]]], expected: [[1,5]] }
        ]
    },
    {
        id: 4,
        title: "4. Median Arrays",
        diff: "Hard",
        diffClass: "diff-hard",
        prose: `
            <p>Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return the median of the two sorted arrays.</p>
            <p>The overall run time complexity should be <code>O(log (m+n))</code>.</p>
        `,
        template: `/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number}\n */\nvar findMedianSortedArrays = function(nums1, nums2) {\n    \n};`,
        funcName: "findMedianSortedArrays",
        testCases: [
            { input: [[1,3], [2]], expected: 2 },
            { input: [[1,2], [3,4]], expected: 2.5 }
        ]
    },
    {
        id: 5,
        title: "5. Valid Parentheses",
        diff: "Easy",
        diffClass: "diff-easy",
        prose: `
            <p>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.</p>
        `,
        template: `/**\n * @param {string} s\n * @return {boolean}\n */\nvar isValid = function(s) {\n    \n};`,
        funcName: "isValid",
        testCases: [
            { input: ["()"], expected: true },
            { input: ["()[]{}"], expected: true },
            { input: ["(]"], expected: false }
        ]
    },
    {
        id: 6,
        title: "6. LRU Cache Simulator",
        diff: "Hard",
        diffClass: "diff-hard",
        prose: `
            <p>Write a function that simulates an LRU cache given a capacity and an array of operations. Return the result array.</p>
        `,
        template: `/**\n * @param {number} capacity\n * @param {number[][]} operations - e.g. [[1, 'put', 1, 1], [2, 'get', 1]]\n * @return {number[]} - array of get results\n */\nvar simulateLRU = function(capacity, ops) {\n    \n};`,
        funcName: "simulateLRU",
        testCases: [
            { input: [2, [[1, 'put', 1, 1], [2, 'put', 2, 2], [3, 'get', 1], [4, 'put', 3, 3], [5, 'get', 2]]], expected: [1, -1] }
        ]
    }
];

export const useChallengeStore = defineStore('challenge', {
  state: () => ({
    currentStage: 1,
    stageData: null,
    tokens: 10,
    submissions: [],
    codeContent: '',
    isRunning: false,
    isSubmitting: false,
    consoleOutputHtml: 'Run your code to see the test results here.',
    
    // Captured Challenge parameters
    mode: null,
    eventId: null,
    taskId: null,
    startTime: null,
    
    // Modal State
    modalActive: false,
    modalState: {},
    
    // UI State
    activeTab: 'Description',
    isSuccess: false
  }),
  actions: {
    async initChallenge(query) {
      let stage = parseInt(query.stage) || 1
      if (stage < 1 || stage > 6) stage = 1
      this.currentStage = stage
      
      this.mode = query.mode || null
      this.eventId = query.eventId || null
      this.taskId = query.taskId || null
      
      if (this.mode === 'speedrun') {
        try {
          const { default: api } = await import('../services/api')
          // Ambil data Event beserta relasi Tantangan & Lesson-nya
          const resEvent = await api.get('/events/daily/active')
          let beEvent = null;
          if (resEvent.data && resEvent.data.event) {
             beEvent = resEvent.data.event;
          }

          if (beEvent) {
             // Ambil data lesson/soal dari relasi di Database
             const lesson = (beEvent.challenges && beEvent.challenges.length > 0 && beEvent.challenges[0].lesson) 
                            ? beEvent.challenges[0].lesson 
                            : {};
             this.stageData = {
               id: beEvent.id,
               title: beEvent.title,
               diff: lesson.difficulty || 'Sedang',
               diffClass: 'diff-' + (lesson.difficulty ? lesson.difficulty.toLowerCase() : 'sedang'),
               
               // Ambil penjelasan/instruksi spesifik soal (lesson.explanation), jika kosong baru pakai deskripsi umum event
               prose: lesson.explanation || beEvent.description || beEvent.description_html || 'Tidak ada deskripsi',
               
               // Ambil kode awal, nama fungsi, dan testcase murni dari database lesson
               template: lesson.practice || '// Tulis kodemu di sini',
               funcName: lesson.function_name || 'solution',
               testCases: lesson.test_cases || []
             }
          } else {
             // Fallback jika tidak ada event aktif
             this.stageData = challenges.find(c => c.id === stage)
          }
        } catch (error) {
          console.error('Failed to load dynamic challenge', error)
          this.stageData = challenges.find(c => c.id === stage)
        }
      } else {
        this.stageData = challenges.find(c => c.id === stage)
      }

      this.codeContent = this.stageData.template
      this.consoleOutputHtml = 'Run your code to see the test results here.'
      
      const { useUserAccount } = await import('../composables/useUserAccount')
      const { userProfile } = useUserAccount()
      const userId = userProfile.value?.id || 'guest'
      
      const tokenKey = `ic_tokens_${userId}_stage_${stage}`
      const storedTokens = localStorage.getItem(tokenKey)
      if (storedTokens === null) {
          this.tokens = 5
          localStorage.setItem(tokenKey, 5)
      } else {
          this.tokens = Math.min(parseInt(storedTokens), 5)
          if (this.tokens < parseInt(storedTokens)) {
              localStorage.setItem(tokenKey, this.tokens)
          }
      }
      
      const subKey = `ic_submissions_${userId}_stage_${stage}`
      this.submissions = JSON.parse(localStorage.getItem(subKey)) || []

      if (this.mode === 'speedrun' && this.eventId) {
        const storedTime = localStorage.getItem(`speedrun_start_${this.eventId}`)
        if (storedTime) {
          this.startTime = parseInt(storedTime)
        } else {
          this.startTime = Date.now()
          localStorage.setItem(`speedrun_start_${this.eventId}`, this.startTime)
        }
      } else {
        this.startTime = Date.now()
      }

      this.activeTab = 'Description'
      this.isSuccess = false
    },

    evaluateCode() {
      // Basic Client-Side JS Evaluator
      const userCode = this.codeContent;
      const testCases = this.stageData.testCases;
      const funcName = this.stageData.funcName;
      
      let consoleLogs = [];
      let allPassed = true;
      let outputHtml = '';

      try {
        // Safe evaluation wrapping
        const evalFunc = new Function('args', `
          let console = { log: function() { } }; // Basic mock to prevent console spam
          ${userCode}
          if (typeof ${funcName} !== 'function') throw new Error("${funcName} is not defined or not a function");
          return ${funcName}(...args);
        `);

        testCases.forEach((tc, index) => {
          const result = evalFunc(tc.input);
          
          // Deep equality check for arrays/objects or simple check
          const isPassed = JSON.stringify(result) === JSON.stringify(tc.expected);
          
          if (!isPassed) allPassed = false;

          outputHtml += `
            <div style="margin-bottom: 10px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 6px; border-left: 3px solid ${isPassed ? '#10b981' : '#ef4444'};">
              <strong>Test Case ${index + 1}:</strong> <span style="color: ${isPassed ? '#10b981' : '#ef4444'}">${isPassed ? 'Passed' : 'Failed'}</span><br>
              <div style="font-family: monospace; font-size: 0.85rem; margin-top: 5px; color: #94a3b8;">
                Input: ${JSON.stringify(tc.input)}<br>
                Expected: ${JSON.stringify(tc.expected)}<br>
                Output: ${JSON.stringify(result)}
              </div>
            </div>
          `;
        });

      } catch (error) {
        allPassed = false;
        outputHtml = `
          <div style="padding: 10px; background: rgba(239, 68, 68, 0.1); border-radius: 6px; border-left: 3px solid #ef4444; color: #fca5a5;">
            <strong>Runtime Error:</strong><br>
            <span style="font-family: monospace;">${error.message}</span>
          </div>
        `;
      }

      return { success: allPassed, html: outputHtml };
    },

    runCode(router) {
      this.isRunning = true
      this.consoleOutputHtml = '<span style="color: var(--primary); font-weight: 600;"><i class="fa-solid fa-circle-notch fa-spin"></i> Running code...</span>'
      
      setTimeout(async () => {
          this.isRunning = false;
          const result = this.evaluateCode();
          
          this.consoleOutputHtml = `
            <div style="width:100%; text-align: left;">
              <strong style="color:var(--text-main);">Output:</strong><br>
              ${result.html}
              <div style="margin-top: 15px; font-weight: 600; color: ${result.success ? '#10b981' : '#ef4444'};">
                <i class="fa-solid ${result.success ? 'fa-check' : 'fa-xmark'}"></i> 
                ${result.success ? 'Accepted' : 'Wrong Answer'}
              </div>
            </div>
          `;
          
          // Anti-Cheat: If Run Code is wrong, we deduct token and call API
          if (!result.success && this.mode === 'speedrun' && this.eventId) {
              const { useUserAccount } = await import('../composables/useUserAccount');
              const { userProfile } = useUserAccount();
              const userId = userProfile.value?.id || 'guest';
              const tokenKey = `ic_tokens_${userId}_stage_${this.currentStage}`;
              
              // Animasi instan lokal
              this.tokens -= 1; 
              
              await this.handleFailedSpeedrunAttempt(router, userId, tokenKey);
          }
      }, 600)
    },
    
    openModal(type, title, desc, btnText, callback) {
      this.modalState = { type, title, desc, btnText, callback }
      this.modalActive = true
    },
    
    closeModal() {
      this.modalActive = false
      if (this.modalState.callback) {
          this.modalState.callback()
      }
    },
    
      submitCode(router) {
      if (this.tokens <= 0) {
          this.openModal('fail', 'Kesempatan Habis!', 'Coba lain kali ya.', 'Kembali ke Tantangan', () => {
              if (router) router.push('/challenges')
          })
          return
      }
      
      this.isSubmitting = true
      
      setTimeout(async () => {
          this.isSubmitting = false
          
          const { useUserAccount } = await import('../composables/useUserAccount')
          const { userProfile } = useUserAccount()
          const userId = userProfile.value?.id || 'guest'
          const tokenKey = `ic_tokens_${userId}_stage_${this.currentStage}`
          const subKey = `ic_submissions_${userId}_stage_${this.currentStage}`
          
          const result = this.evaluateCode();
          const isSuccess = result.success;
          
          // Show the result in console immediately
          this.consoleOutputHtml = `
            <div style="width:100%; text-align: left;">
              <strong style="color:var(--text-main);">Submission Output:</strong><br>
              ${result.html}
              <div style="margin-top: 15px; font-weight: 600; color: ${isSuccess ? '#10b981' : '#ef4444'};">
                <i class="fa-solid ${isSuccess ? 'fa-check' : 'fa-xmark'}"></i> 
                ${isSuccess ? 'Accepted' : 'Wrong Answer'}
              </div>
            </div>
          `;

          // Handle Failed Flow First
          if (!isSuccess) {
              this.tokens -= 1
              
              if (this.mode === 'speedrun' && this.eventId) {
                  // Redirect flow ke logika Run Code Gagal (Anti-Cheat)
                  await this.handleFailedSpeedrunAttempt(router, userId, tokenKey);
              } else {
                  // Fallback for non-speedrun modes
                  localStorage.setItem(tokenKey, this.tokens)
                  if (this.tokens <= 0) {
                      this.openModal('fail', 'Kesempatan Habis!', 'Coba lain kali ya.', 'Kembali ke Tantangan', () => {
                          if (router) router.push('/challenges')
                      })
                  } else {
                      this.openModal('fail', 'Jawaban Salah!', 'Kode Anda gagal pada beberapa testcase.', 'Lihat Submissions', () => {
                          this.activeTab = 'Submissions'
                      })
                  }
              }
              
              this.submissions.unshift({
                  attempt: 5 - this.tokens,
                  status: 'Wrong Answer',
                  date: new Date().toLocaleTimeString()
              })
              localStorage.setItem(subKey, JSON.stringify(this.submissions))
              return;
          }
          
          // Handle Success Flow
          this.submissions.unshift({
              attempt: 5 - this.tokens,
              status: 'Accepted',
              date: new Date().toLocaleTimeString()
          })
          localStorage.setItem(subKey, JSON.stringify(this.submissions))
          
          this.isSuccess = true
          let currentUnlocked = parseInt(localStorage.getItem('ic_unlocked_stage')) || 1
          if (currentUnlocked <= this.currentStage && this.currentStage < 6) {
              localStorage.setItem('ic_unlocked_stage', this.currentStage + 1)
          }
          
          if (this.mode === 'speedrun' && this.eventId) {
              const durationSec = Math.floor((Date.now() - this.startTime) / 1000)
              
              try {
                  const { EventService } = await import('../services/eventService')
                  await EventService.submitDaily(this.eventId, true, durationSec)
              } catch (e) {
                  console.warn('API submission failed', e)
              }
              
              localStorage.removeItem(`speedrun_start_${this.eventId}`)
              localStorage.setItem(`ic_daily_completed_${userId}_${this.eventId}`, new Date().toDateString())
              
              this.openModal('success', 'Speedrun Selesai!', `Anda menyelesaikan tantangan dalam ${durationSec} detik.`, 'Kembali ke Papan Peringkat', () => {
                  if (router) router.push('/challenges?tab=harian')
              })
              return;
          }

          if (this.mode === 'weekly' && this.eventId) {
              const completedTasks = JSON.parse(localStorage.getItem(`weekly_tasks_${this.eventId}`)) || []
              if (!completedTasks.includes(this.taskId)) {
                  completedTasks.push(this.taskId)
                  localStorage.setItem(`weekly_tasks_${this.eventId}`, JSON.stringify(completedTasks))
              }
              
              this.openModal('success', 'Soal Terselesaikan!', 'Tugas mingguan ini telah berhasil diselesaikan.', 'Lanjut Misi Lainnya', () => {
                  if (router) router.push('/challenges?tab=mingguan')
              })
              return
          }

          if (this.currentStage === 6) {
              this.openModal('success', 'Selamat!', 'Anda telah menyelesaikan seluruh stage IC Game-Z!', 'Lihat Submissions', () => {
                  this.activeTab = 'Submissions'
              })
          } else {
              this.openModal('success', 'Solusi Benar!', 'Kode Anda lulus semua testcase.', 'Lihat Submissions', () => {
                  this.activeTab = 'Submissions'
              })
          }
      }, 800)
    },
    
    async handleFailedSpeedrunAttempt(router, userId, tokenKey) {
        try {
            const { EventService } = await import('../services/eventService');
            
            // Call API with false (wrong answer) to deduct attempt on backend
            const res = await EventService.submitDaily(this.eventId, false, null);
            
            // Sync tokens from backend
            this.tokens = res.data.remaining_tokens;
            localStorage.setItem(tokenKey, this.tokens);
            
            if (this.tokens > 0) {
                this.openModal('fail', 'Run Code Gagal!', `Kode Anda masih salah. Nyawa berkurang (Sisa: ${this.tokens} kali)`, 'Coba Lagi', () => {
                    this.activeTab = 'Submissions';
                });
            } else {
                this.openModal('fail', 'Kesempatan Habis!', 'Anda telah gagal 5 kali.', 'Kembali ke Tantangan', () => {
                    if (router) router.push('/challenges');
                });
            }
        } catch (e) {
            // Server responds with 403 if attempts already exhausted
            if (e.response && e.response.status === 403) {
                this.tokens = 0;
                localStorage.setItem(tokenKey, 0);
                this.openModal('fail', 'Kesempatan Habis!', e.response.data.message || 'Coba lain kali ya.', 'Kembali ke Tantangan', () => {
                    if (router) router.push('/challenges');
                });
            } else {
                console.warn('API submission failed', e);
            }
        }
    },
    
    async failDailyChallenge() {
      if (this.mode === 'speedrun' && this.eventId) {
        localStorage.removeItem(`speedrun_start_${this.eventId}`)
        
        const { useUserAccount } = await import('../composables/useUserAccount')
        const { userProfile } = useUserAccount()
        const userId = userProfile.value?.id || 'guest'
        
        localStorage.setItem(`ic_daily_completed_${userId}_${this.eventId}`, new Date().toDateString())
        
        try {
          const { EventService } = await import('../services/eventService')
          // Beri tahu backend bahwa user gagal / quit early sehingga token tetap dikurangi
          await EventService.submitDaily(this.eventId, false, null) 
        } catch (e) {
          console.warn('API failure submission failed', e)
        }
      }
    }
  }
})
