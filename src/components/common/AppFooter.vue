<template>
  <footer class="gamez-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <!-- Column 1: Brand & Description -->
        <div class="footer-col brand-col">
          <div class="footer-logo">
            <img src="/images/Logo iC GameZ darkmode.png" alt="iC Game-Z" class="footer-logo-img logo-dark" />
            <img src="/images/Logo iC GameZ Lightmode.png" alt="iC Game-Z" class="footer-logo-img logo-light" />
          </div>
          <p class="footer-desc">
            Platform gamifikasi edukasi coding dan pemrograman. iC Game-Z Level up Your Skill !!
          </p>
          <div class="social-links">
            <a href="https://instagram.com/icraft.ds" target="_blank" title="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://tiktok.com/@icraft.ds" target="_blank" title="TikTok"><i class="fa-brands fa-tiktok"></i></a>
            <a href="https://threads.net/@icraft.ds" target="_blank" title="Threads"><i class="fa-brands fa-threads"></i></a>
          </div>
        </div>

        <!-- Column 2: Belajar -->
        <div class="footer-col">
          <h4 class="footer-heading">Belajar</h4>
          <ul class="footer-links">
            <li><router-link to="/learning">Alur Belajar</router-link></li>
            <li><router-link to="/encyclopedia">Ensiklopedia</router-link></li>
            <li><router-link to="/challenges">Tantangan</router-link></li>
            <li><router-link to="/leaderboard">Leaderboard</router-link></li>
          </ul>
        </div>

        <!-- Column 3: Dukungan -->
        <div class="footer-col">
          <h4 class="footer-heading">Dukungan</h4>
          <ul class="footer-links">
            <li><router-link to="/shop">GameZ Shop</router-link></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Panduan Pengguna</a></li>
            <li><a href="#">Hubungi Kami</a></li>
          </ul>
        </div>

        <!-- Column 4: Lainnya -->
        <div class="footer-col">
          <h4 class="footer-heading">Lainnya</h4>
          <ul class="footer-links">
            <li><a href="https://www.icraftds.id/">iCraft Digital Service</a></li>
            <li><a href="https://instagram.com/icraft.ds">Tentang Kami</a></li>
            <li><a href="#">Kebijakan Privasi</a></li>
            <li><a href="#">Syarat & Ketentuan</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="copyright">
          &copy; {{ new Date().getFullYear() }} iC Game-Z &middot; iCraft Studio. All rights reserved.
        </div>
        <div class="made-with">
          Made with <i class="fa-solid fa-heart text-danger"></i> in Indonesia
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped src="../../assets/css/components/common/AppFooter.css"></style>
