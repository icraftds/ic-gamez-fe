<template>
  <main class="not-found">
    <p class="code" aria-hidden="true">404</p>
    <h1>Halaman tidak ditemukan</h1>
    <p class="lead">Alamat yang Anda buka tidak ada atau sudah dipindahkan. Lanjutkan belajar dari salah satu halaman berikut:</p>
    <nav class="links" aria-label="Halaman populer">
      <router-link to="/">Beranda</router-link>
      <router-link to="/learning">Learning Path</router-link>
      <router-link to="/encyclopedia">Ensiklopedia</router-link>
      <router-link to="/cheatsheet">Cheatsheet</router-link>
      <router-link to="/faq">FAQ</router-link>
    </nav>
  </main>
</template>

<style scoped>
.not-found {
  min-height: 70vh;
  max-width: 640px;
  margin: 0 auto;
  padding: 96px 16px 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 16px;
}
.code {
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(64px, 18vw, 120px);
  font-weight: 700;
  line-height: 1;
  color: var(--primary, #0062ff);
}
h1 {
  margin: 0;
  font-size: clamp(24px, 5vw, 32px);
  color: var(--text-main, inherit);
}
.lead {
  margin: 0;
  color: var(--text-muted, #8a94a6);
  line-height: 1.6;
}
.links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;
}
.links a {
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid var(--border-light, rgba(127, 127, 127, 0.3));
  color: var(--text-main, inherit);
  text-decoration: none;
  font-weight: 600;
}
.links a:hover,
.links a:focus-visible {
  border-color: var(--primary, #0062ff);
  color: var(--primary, #0062ff);
}
</style>
