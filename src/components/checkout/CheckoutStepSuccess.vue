<template>
  <div key="step4">
    <div class="success-state">
      <div class="success-icon-wrap">
        <div class="success-icon-circle">
          <i class="fa-solid fa-circle-check"></i>
        </div>
      </div>

      <h2 class="success-glow-text">Pembayaran Berhasil!</h2>
      <p class="success-message">
        Selamat! Paket <strong>{{ planName }}</strong> telah berhasil diterapkan ke akun Anda.
        Berikut fitur-fitur yang bisa kamu nikmati sekarang:
      </p>

      <!-- Benefit Cards -->
      <div class="benefit-cards">
        <div v-for="(benefit, i) in activatedBenefits" :key="i" class="benefit-card">
          <div class="benefit-icon" :class="benefit.iconClass">
            <i :class="benefit.icon"></i>
          </div>
          <div class="benefit-text">
            <strong>{{ benefit.title }}</strong>
            <span>{{ benefit.desc }}</span>
          </div>
        </div>
      </div>

      <button class="btn-success" @click="$emit('dashboard')">
        <i class="fa-solid fa-columns"></i> Lanjut ke Dashboard
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  planName: String,
  planSlug: String
})

defineEmits(['dashboard'])

const activatedBenefits = computed(() => {
  const base = [
    { icon: 'fa-solid fa-bolt', iconClass: 'energy', title: 'Unlimited Energy', desc: 'Tidak ada lagi batas harian. Belajar sepuasnya!' },
    { icon: 'fa-solid fa-book-open', iconClass: 'modules', title: 'Akses Semua Modul Premium', desc: 'Buka seluruh konten eksklusif yang terkunci.' },
    { icon: 'fa-solid fa-certificate', iconClass: 'cert', title: 'Sertifikat Kelulusan', desc: 'Dapatkan sertifikat resmi setiap menyelesaikan learning path.' },
  ]

  if (props.planSlug === 'expert') {
    base.push(
      { icon: 'fa-solid fa-user-graduate', iconClass: 'mentor', title: '1-on-1 Mentoring Bulanan', desc: 'Sesi pribadi dengan mentor berpengalaman.' },
      { icon: 'fa-solid fa-code-compare', iconClass: 'review', title: 'Code Review Prioritas', desc: 'Kode Anda di-review langsung oleh profesional.' }
    )
  }

  return base
})
</script>

<style scoped src="../../assets/css/components/checkout/CheckoutStepSuccess.css"></style>
