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
        template: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Write your code here\n    \n};`
    },
    {
        id: 2,
        title: "2. Add Two Numbers",
        diff: "Medium",
        diffClass: "diff-medium",
        prose: `
            <p>You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit.</p>
            <p>Add the two numbers and return the sum as a linked list.</p>
            <h3>Example 1:</h3>
            <div class="example-box"><strong>Input:</strong> l1 = [2,4,3], l2 = [5,6,4]<br><strong>Output:</strong> [7,0,8]</div>
        `,
        template: `/**\n * @param {ListNode} l1\n * @param {ListNode} l2\n * @return {ListNode}\n */\nvar addTwoNumbers = function(l1, l2) {\n    \n};`
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
        template: `/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nvar merge = function(intervals) {\n    \n};`
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
        template: `/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number}\n */\nvar findMedianSortedArrays = function(nums1, nums2) {\n    \n};`
    },
    {
        id: 5,
        title: "5. Valid Parentheses",
        diff: "Easy",
        diffClass: "diff-easy",
        prose: `
            <p>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.</p>
        `,
        template: `/**\n * @param {string} s\n * @return {boolean}\n */\nvar isValid = function(s) {\n    \n};`
    },
    {
        id: 6,
        title: "6. LRU Cache",
        diff: "Hard",
        diffClass: "diff-hard",
        prose: `
            <p>Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.</p>
            <p>Implement the <code>LRUCache</code> class.</p>
        `,
        template: `/**\n * @param {number} capacity\n */\nvar LRUCache = function(capacity) {\n    \n};`
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
    
    // Modal State
    modalActive: false,
    modalState: {
      type: 'success',
      title: '',
      desc: '',
      btnText: '',
      callback: null
    },
    
    // UI State
    activeTab: 'Description'
  }),
  actions: {
    initStage(stageId) {
      let stage = parseInt(stageId) || 1
      if (stage < 1 || stage > 6) stage = 1
      this.currentStage = stage
      this.stageData = challenges.find(c => c.id === stage)
      this.codeContent = this.stageData.template
      this.consoleOutputHtml = 'Run your code to see the test results here.'
      
      const tokenKey = `ic_tokens_stage_${stage}`
      const storedTokens = localStorage.getItem(tokenKey)
      if (storedTokens === null) {
          this.tokens = 10
          localStorage.setItem(tokenKey, 10)
      } else {
          this.tokens = parseInt(storedTokens)
      }
      
      const subKey = `ic_submissions_stage_${stage}`
      this.submissions = JSON.parse(localStorage.getItem(subKey)) || []
    },
    
    runCode() {
      this.isRunning = true
      this.consoleOutputHtml = '<span style="color: var(--primary); font-weight: 600;"><i class="fa-solid fa-circle-notch fa-spin"></i> Running code...</span>'
      
      setTimeout(() => {
          this.isRunning = false
          this.consoleOutputHtml = `<div style="width:100%; text-align: left;"><strong style="color:var(--text-main);">Output:</strong><br><div style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 4px; margin: 8px 0; font-family: 'JetBrains Mono'; color: #cbd5e1; border-left: 2px solid #10b981;">Execution finished.</div><span style="color: #10b981; font-weight: 600;"><i class="fa-solid fa-check"></i> Accepted</span></div>`
      }, 800)
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
    
    submitCode() {
      if (this.tokens <= 0) {
          this.openModal('fail', 'Token Habis!', 'Anda telah menggunakan seluruh 10 kesempatan untuk stage ini.', 'Tutup')
          return
      }
      
      this.isSubmitting = true
      
      setTimeout(() => {
          this.isSubmitting = false
          
          this.tokens -= 1
          localStorage.setItem(`ic_tokens_stage_${this.currentStage}`, this.tokens)
          
          const isSuccess = Math.random() > 0.3
          
          this.submissions.unshift({
              attempt: 10 - this.tokens,
              status: isSuccess ? 'Accepted' : 'Wrong Answer',
              date: new Date().toLocaleTimeString()
          })
          localStorage.setItem(`ic_submissions_stage_${this.currentStage}`, JSON.stringify(this.submissions))
          
          if (isSuccess) {
              let currentUnlocked = parseInt(localStorage.getItem('ic_unlocked_stage')) || 1
              if (currentUnlocked <= this.currentStage && this.currentStage < 6) {
                  localStorage.setItem('ic_unlocked_stage', this.currentStage + 1)
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
          } else {
              this.openModal('fail', 'Jawaban Salah!', 'Kode Anda gagal pada beberapa testcase.', 'Lihat Submissions', () => {
                  this.activeTab = 'Submissions'
              })
          }
      }, 1000)
    }
  }
})
