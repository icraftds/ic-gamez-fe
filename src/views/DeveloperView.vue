<template>
  <div class="developer-page">
    <SimpleBackground />
    <TopBar />
    
    <main class="developer-content">
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar-container">
            <div class="avatar">
              <img :src="profilePhoto" alt="Randi Zakaria Putra, S.Kom., CWDev" class="avatar-img" />
            </div>
            <div class="status-badge">
              <i class="fa-solid fa-code"></i>
            </div>
          </div>
          <h1 class="dev-name">Randi Zakaria Putra, S.Kom., CWDev</h1>
          <p class="dev-title">Fullstack Developer & Backend Developer</p>
        </div>
        
        <div class="social-links">
          <a href="https://github.com/rzranz" target="_blank" class="social-btn github">
            <i class="fa-brands fa-github"></i>
            <span>rzranz</span>
          </a>
          <a href="https://www.linkedin.com/in/randizakariaputra" target="_blank" class="social-btn linkedin">
            <i class="fa-brands fa-linkedin-in"></i>
            <span>LinkedIn</span>
          </a>
          <a href="https://instagram.com/rdzaputra_" target="_blank" class="social-btn instagram">
            <i class="fa-brands fa-instagram"></i>
            <span>@rdzaputra_</span>
          </a>
          <a href="https://randizp.my.id" target="_blank" class="social-btn website">
            <i class="fa-solid fa-globe"></i>
            <span>randizp.my.id</span>
          </a>
        </div>
        
        <div class="about-section">
          <p>
            Architect of ICraft Digital Service. Dedicated to writing elegant, clean code 
            and designing highly efficient, scalable backend system architectures that 
            power seamless digital experiences.
          </p>
        </div>
      </div>
    </main>

    <footer class="dev-footer">
      <p>&copy; {{ new Date().getFullYear() }} Randi Zakaria Putra. All rights reserved.</p>
      <p class="supported-by">Supported by <strong>ICraft Digital Service</strong></p>
    </footer>
  </div>
</template>

<script setup>
import SimpleBackground from '../components/common/SimpleBackground.vue'
import TopBar from '../components/TopBar.vue'
import profilePhoto from '../assets/profile/profile.jpg'
</script>

<style scoped>
.developer-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.developer-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  z-index: 10;
}

.profile-card {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 3rem 4rem;
  text-align: center;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  animation: slideUpFade 0.6s ease-out forwards;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.4);
  border: 4px solid rgba(15, 23, 42, 0.8);
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  background: var(--bg-dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(15, 23, 42, 0.8);
  color: var(--primary);
  font-size: 0.9rem;
}

.dev-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #fff, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dev-title {
  color: var(--primary);
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 2.5rem;
  letter-spacing: 1px;
}

.social-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.social-btn i {
  font-size: 1.2rem;
}

.social-btn:hover {
  transform: translateY(-3px);
  color: white;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}

.social-btn.github:hover { box-shadow: 0 10px 20px -10px rgba(255, 255, 255, 0.3); }
.social-btn.linkedin:hover { box-shadow: 0 10px 20px -10px rgba(10, 102, 194, 0.5); color: #0a66c2; border-color: rgba(10, 102, 194, 0.3); }
.social-btn.instagram:hover { box-shadow: 0 10px 20px -10px rgba(225, 48, 108, 0.5); color: #e1306c; border-color: rgba(225, 48, 108, 0.3); }
.social-btn.website:hover { box-shadow: 0 10px 20px -10px rgba(56, 189, 248, 0.4); color: var(--primary); border-color: rgba(56, 189, 248, 0.3); }

.about-section {
  color: #94a3b8;
  line-height: 1.7;
  font-size: 0.95rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.dev-footer {
  text-align: center;
  padding: 2rem;
  z-index: 10;
  color: var(--text-muted);
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.supported-by {
  margin-top: 0.5rem;
  color: #94a3b8;
}

.supported-by strong {
  color: var(--primary);
  font-weight: 600;
}

@media (max-width: 640px) {
  .profile-card {
    padding: 2rem;
  }
  .social-links {
    grid-template-columns: 1fr;
  }
  .dev-name {
    font-size: 1.5rem;
  }
}
</style>
