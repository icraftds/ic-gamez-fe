<template>
  <nav class="navbar">
    <div class="nav-left">
      <div class="logo">
        <i class="fa-solid fa-cube text-primary"></i>
        <span>Icraft<span class="text-secondary">DS</span></span>
      </div>
    </div>

    <!-- Hamburger Button (mobile only) -->
    <button class="hamburger" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Toggle menu">
      <i :class="mobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
    </button>

    <!-- Mobile Overlay -->
    <div class="mobile-overlay" :class="{ open: mobileMenuOpen }" @click="mobileMenuOpen = false"></div>

    <!-- Nav Center + Right wrapped for mobile drawer -->
    <div class="nav-drawer" :class="{ open: mobileMenuOpen }">
      <div class="nav-center">
        <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }" @click="mobileMenuOpen = false">Beranda</router-link>
        <router-link to="/learning" class="nav-link" :class="{ active: $route.path.startsWith('/learning') }" @click="mobileMenuOpen = false">Learning Path</router-link>
        <router-link to="/challenges" class="nav-link" :class="{ active: $route.path.startsWith('/challenges') }" @click="mobileMenuOpen = false">Tantangan</router-link>
        <router-link to="/encyclopedia" class="nav-link" :class="{ active: $route.path === '/encyclopedia' }" @click="mobileMenuOpen = false">Ensiklopedia</router-link>
        <router-link to="/leaderboard" class="nav-link" :class="{ active: $route.path === '/leaderboard' }" @click="mobileMenuOpen = false">Leaderboard</router-link>
      </div>

      <div class="nav-right">
        <div class="credits-indicator" v-if="!isPremiumUser">
          <i class="fa-solid fa-bolt text-warning"></i>
          <span>{{ credits }}/{{ maxCredits }}</span>
        </div>
        <div class="premium-badge" v-else>
          <i class="fa-solid fa-crown"></i> PRO
        </div>

        <template v-if="isLoggedIn">
          <router-link to="/dashboard" class="user-profile-btn" @click="mobileMenuOpen = false">
            <img :src="userProfile.avatar" alt="User Avatar" class="avatar-sm">
            <span class="user-name">{{ userProfile.name }}</span>
          </router-link>
          <button class="btn-logout" @click="handleLogoutClick" title="Logout"><i class="fa-solid fa-right-from-bracket"></i></button>
        </template>
        <template v-else>
          <button class="btn-login" @click="login">Masuk</button>
          <button class="btn-register" @click="login">Daftar</button>
        </template>
      </div>
    </div>

    <ConfirmModal
      v-model="showLogoutConfirm"
      title="Konfirmasi Keluar"
      message="Apakah Anda yakin ingin keluar dari akun Anda?"
      confirmText="Ya, Keluar"
      type="warning"
      @confirm="performLogout"
    />
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAccount } from '../../composables/useUserAccount'
import ConfirmModal from '../common/ConfirmModal.vue'

const { credits, maxCredits, isPremiumUser, isLoggedIn, userProfile, login, logout } = useUserAccount()
const router = useRouter()

const showLogoutConfirm = ref(false)
const mobileMenuOpen = ref(false)

const handleLogoutClick = () => {
  showLogoutConfirm.value = true
  mobileMenuOpen.value = false
}

const performLogout = () => {
  logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  background: rgba(15, 10, 30, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.text-primary { color: var(--primary); }
.text-secondary { color: var(--secondary); }
.text-warning { color: #f59e0b; }

/* Hamburger - hidden on desktop */
.hamburger {
  display: none;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  z-index: 201;
}

/* Mobile Overlay */
.mobile-overlay {
  display: none;
}

/* Nav Drawer wrapper */
.nav-drawer {
  display: contents; /* On desktop, behaves as if it doesn't exist */
}

.nav-center {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: #94a3b8;
  text-decoration: none;
  font-weight: 500;
  padding: 5px 0;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link:hover, .nav-link.active {
  color: white;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  border-radius: 2px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.credits-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 600;
  color: #fcd34d;
}

.premium-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #d97706, #f59e0b);
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  color: white;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
}

.icon-btn, .btn-logout {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.icon-btn:hover, .btn-logout:hover {
  color: white;
}

.user-profile-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: white;
  background: rgba(255, 255, 255, 0.05);
  padding: 5px 15px 5px 5px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.user-profile-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #333;
}

.btn-login {
  background: transparent;
  border: none;
  color: white;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 15px;
}

.btn-register {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.3);
  transition: transform 0.2s ease;
}

.btn-register:hover {
  transform: translateY(-2px);
}

/* ═══════════════════════════════════════════
   RESPONSIVE: Tablet ≤1024px
   ═══════════════════════════════════════════ */
@media (max-width: 1024px) {
  .navbar {
    padding: 12px 24px;
  }
  .nav-center {
    gap: 18px;
  }
  .nav-link {
    font-size: 0.9rem;
  }
  .user-name {
    display: none;
  }
  .user-profile-btn {
    padding: 4px;
  }
}

/* ═══════════════════════════════════════════
   RESPONSIVE: Mobile ≤768px — Hamburger Menu
   ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  .hamburger {
    display: block;
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 199;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .mobile-overlay.open {
    opacity: 1;
    pointer-events: auto;
  }

  .nav-drawer {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: -300px;
    width: 280px;
    height: 100vh;
    background: rgba(15, 10, 30, 0.98);
    backdrop-filter: blur(20px);
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 200;
    padding: 80px 24px 24px;
    gap: 30px;
    overflow-y: auto;
    transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .nav-drawer.open {
    right: 0;
  }

  .nav-center {
    flex-direction: column;
    gap: 0;
  }

  .nav-link {
    padding: 14px 16px;
    font-size: 1.05rem;
    border-radius: 10px;
    transition: background 0.2s, color 0.2s;
  }
  .nav-link:hover, .nav-link.active {
    background: rgba(255, 255, 255, 0.05);
  }
  .nav-link.active::after {
    display: none;
  }

  .nav-right {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .user-profile-btn {
    justify-content: flex-start;
  }
  .user-name {
    display: inline;
  }

  .btn-login, .btn-register {
    width: 100%;
    text-align: center;
    padding: 12px;
  }
}
</style>

