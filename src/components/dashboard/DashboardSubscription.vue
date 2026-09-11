<template>
  <div class="dash-subscription">
    <h2>Kelola Langganan</h2>
    <p class="subtitle">Kelola paket langganan dan lihat riwayat pembayaran.</p>

    <div class="plan-grid">
      <!-- Paket Aktif -->
      <div class="section-card">
        <h3>Paket Aktif</h3>
        <div class="current-plan">
          <p class="plan-name">{{ isPremiumUser ? 'Paket Premium' : 'Paket Gratis' }}</p>
          <p class="plan-desc">{{ isPremiumUser ? 'Akses penuh ke semua fitur' : 'Akses terbatas ke latihan dan kursus' }}</p>
          <button v-if="!isPremiumUser" class="btn-upgrade" @click="upgradeToPremium">Upgrade Ke Premium</button>
          <div v-else class="active-badge"><i class="fa-solid fa-check-circle"></i> Aktif</div>
        </div>
      </div>

      <!-- Keuntungan Premium -->
      <div class="section-card">
        <h3>Keuntungan Premium</h3>
        <ul class="benefits-list">
          <li><i class="fa-solid fa-check"></i> Semua tantangan & latihan premium</li>
          <li><i class="fa-solid fa-check"></i> Semua kursus interaktif (SQL, Frontend, Backend)</li>
          <li><i class="fa-solid fa-check"></i> Guided projects lengkap</li>
          <li><i class="fa-solid fa-check"></i> Sertifikat kelulusan</li>
          <li><i class="fa-solid fa-check"></i> Lihat solusi setiap tantangan</li>
          <li><i class="fa-solid fa-check"></i> Ide analisis & portfolio untuk semua dataset simulasi bisnis</li>
          <li><i class="fa-solid fa-check"></i> Komunitas WhatsApp eksklusif</li>
        </ul>
      </div>
    </div>

    <!-- Riwayat Langganan -->
    <div class="section-card">
      <h3>Riwayat Langganan</h3>
      <div class="history-empty">
        <p><strong>Belum ada riwayat langganan</strong></p>
        <p class="sub-text">Transaksi langganan kamu akan tercatat di sini.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserAccount } from '../../composables/useUserAccount'
const { isPremiumUser, upgradeToPremium } = useUserAccount()
</script>

<style scoped>
.dash-subscription h2 { font-size: 1.6rem; margin-bottom: 5px; }
.subtitle { color: #94a3b8; margin-bottom: 25px; }

.plan-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }

.section-card {
  background: rgba(15, 10, 30, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 25px;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
  transform-style: preserve-3d;
}

.section-card:hover {
  transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-5px);
  box-shadow: -10px 15px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.3);
}
.section-card h3 { font-size: 1.2rem; margin-bottom: 20px; }

.current-plan { text-align: center; padding: 30px 20px; }
.plan-name { font-size: 1.3rem; font-weight: 800; color: white; margin-bottom: 8px; }
.plan-desc { color: #64748b; font-size: 0.9rem; margin-bottom: 25px; }

.btn-upgrade {
  padding: 12px 30px;
  background: #f59e0b;
  color: #0f0a1e;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s;
}
.btn-upgrade:hover { transform: translateY(-2px); }

.active-badge { color: #10b981; font-weight: 700; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 8px; }

.benefits-list { list-style: none; padding: 0; margin: 0; }
.benefits-list li {
  padding: 10px 0;
  color: #cbd5e1;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.03);
}
.benefits-list li:last-child { border-bottom: none; }
.benefits-list li i { color: #10b981; font-size: 0.85rem; }

.history-empty { text-align: center; padding: 40px; color: #94a3b8; }
.sub-text { color: #64748b; font-size: 0.85rem; }

@media (max-width: 768px) {
  .plan-grid { grid-template-columns: 1fr; }
  .section-card:hover { transform: none; }
  .current-plan { padding: 20px 15px; }
}
</style>
