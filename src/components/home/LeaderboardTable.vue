<template>
  <section class="reveal" id="leaderboard" style="scroll-margin-top: 100px; padding: 60px 0; overflow: hidden; width: 100%; position: relative;">
    <div class="leaderboard-container iso-leaderboard" style="max-width: 1000px; margin: 0 auto; padding: 30px; margin-bottom: 50px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="font-size: 2.5rem;">Top <span class="gradient-text">CoderZ</span></h2>
        <p style="color: var(--text-muted); font-size: 1.1rem;">Peringkat talenta koding terbaik dari berbagai sekolah binaan iCraft.</p>
      </div>
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Nama Siswa</th>
            <th>Asal Sekolah</th>
            <th>Poin Total</th>
            <th>Tantangan Diselesaikan</th>
          </tr>
        </thead>
        <tbody>
          <tr class="leaderboard-row">
            <td class="rank-1"><i class="fa-solid fa-trophy"></i> 1</td>
            <td style="font-weight: 700; font-size: 1.1rem;">Randi Zakaria Putra</td>
            <td><span class="school-badge">MAN 2 Kota Bandung</span></td>
            <td style="color: var(--primary); font-family: 'JetBrains Mono', monospace;">14,500 XP</td>
            <td>42 Tantangan</td>
          </tr>
          <tr class="leaderboard-row">
            <td class="rank-2"><i class="fa-solid fa-medal"></i> 2</td>
            <td style="font-weight: 700; font-size: 1.1rem;">Kanzler</td>
            <td><span class="school-badge">Kenzia Frozen Food</span></td>
            <td style="color: var(--primary); font-family: 'JetBrains Mono', monospace;">13,200 XP</td>
            <td>38 Tantangan</td>
          </tr>
          <tr class="leaderboard-row">
            <td class="rank-3"><i class="fa-solid fa-medal"></i> 3</td>
            <td style="font-weight: 700; font-size: 1.1rem;">Blak</td>
            <td><span class="school-badge">Ciwastra Boys</span></td>
            <td style="color: var(--primary); font-family: 'JetBrains Mono', monospace;">12,850 XP</td>
            <td>36 Tantangan</td>
          </tr>
          <tr class="leaderboard-row">
            <td>4</td>
            <td style="font-weight: 700; font-size: 1.1rem;">Nanda Kusuma</td>
            <td><span class="school-badge">SMK Telkom Purwokerto</span></td>
            <td style="color: var(--primary); font-family: 'JetBrains Mono', monospace;">11,400 XP</td>
            <td>31 Tantangan</td>
          </tr>
          <tr class="leaderboard-row">
            <td>5</td>
            <td style="font-weight: 700; font-size: 1.1rem;">Dika Prayoga</td>
            <td><span class="school-badge">SMKN 1 Tasikmalaya</span></td>
            <td style="color: var(--primary); font-family: 'JetBrains Mono', monospace;">10,900 XP</td>
            <td>29 Tantangan</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
// LeaderboardTable Component
</script>
