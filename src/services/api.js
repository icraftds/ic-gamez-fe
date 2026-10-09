import axios from 'axios';
import { ref } from 'vue';
export const rateLimitUntil = ref(0);
import router from '../router';
import { useWipModal } from '../composables/useWipModal';
import { ssoEnabled, ssoState, loadSsoSession, clearSsoSession } from './sso';

// Konfigurasi instance Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'https://icgamez.unikom.my.id/api',
  
  // -- KODE UNTUK MODE SANCTUM SPA (COOKIE) --
  // Jika Anda menggunakan domain yang sama (misal app.unikom.my.id dan api.unikom.my.id), 
  // hilangkan komentar pada dua baris di bawah ini:
  // withCredentials: true, 
  // withXSRFToken: true, 
  // ------------------------------------------

  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

const cooldowns = new Map();

export const retrySeconds = (value) => {
  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : Math.max(1, Math.ceil((Date.parse(value) - Date.now()) / 1000) || 60);
};

// Request Interceptor untuk menyisipkan Bearer Token (Mode API Token)
api.interceptors.request.use(async config => {
  const until = cooldowns.get(config.url) || 0;
  if (until > Date.now()) {
    const retryAfter = Math.ceil((until - Date.now()) / 1000);
    return Promise.reject({ retryAfter, response: { status: 429, data: { message: `Tunggu ${retryAfter} detik sebelum mencoba kembali.` } }, config });
  }
  if (ssoEnabled) {
    config.ssoGeneration = ssoState.generation;
    const path = config.url || '';
    if (!path.startsWith('/') || path.startsWith('//') || path.includes('://')) return Promise.reject(new Error('Invalid product path'));
    config.headers.delete('Authorization');
    const method = (config.method || 'get').toUpperCase();
    const privatePath = /^\/(?:auth\/me|user|payments|subscription|coupons)(?:\/|$)/.test(path);
    if (ssoState.user.value || privatePath || !['GET', 'HEAD'].includes(method)) {
      config.baseURL = '/api/bff';
      config.withCredentials = true;
      if (!['GET', 'HEAD'].includes(method)) {
        if (!ssoState.csrf.value) await loadSsoSession();
        config.headers['X-CSRF-Token'] = ssoState.csrf.value || '';
      }
    }
  } else {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  
  const locale = localStorage.getItem('user_locale') || 'id';
  config.headers['Accept-Language'] = locale;

  // Upload file: jangan paksa JSON, biarkan browser set multipart/form-data + boundary
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    config.headers.setContentType ? config.headers.setContentType(false) : delete config.headers['Content-Type'];
  }
  
  return config;
});

// Interceptor Response
api.interceptors.response.use(
  response => {
    if (ssoEnabled && response.config.baseURL === '/api/bff' && response.config.ssoGeneration !== ssoState.generation) return Promise.reject({ response: { status: 409, data: { message: 'Sesi pengguna telah berubah.' } } });
    return response;
  },
  error => {
    if (error.response?.status === 429) {
      error.retryAfter = retrySeconds(error.response.headers?.['retry-after']);
      cooldowns.set(error.config?.url, Date.now() + error.retryAfter * 1000);
      rateLimitUntil.value = Date.now() + error.retryAfter * 1000;
      error.response.data.message = `Terlalu banyak permintaan. Tunggu ${error.retryAfter} detik.`;
    }
    // 1. Cek apakah ini fitur yang belum jadi / belum di-push (404 Not Found, 501 Not Implemented, atau Server Mati)
    const isNetworkError = !error.response;
    const isWipError = error.response && (error.response.status === 404 || error.response.status === 501);
    
    if (isNetworkError || isWipError) {
      // Jika ini error saat cek token di awal, logout, atau speedrun (karena 404 dari database), abaikan agar tidak muncul pop-up WIP
      if (error.config && (
        error.config.url === '/auth/me' || 
        error.config.url === '/auth/logout' ||
        error.config.url.includes('submit-speedrun') ||
        error.config.url.includes('/coupons/validate') ||
        error.config.url.includes('/hints') ||
        error.config.url.includes('/events/') ||
        error.config.url.includes('/events/daily/active')
      )) {
        return Promise.reject(error);
      }
      
      const { openWipModal } = useWipModal();
      
      // Jika error terjadi saat memuat daftar/detail tantangan (Belum ada event)
      if (error.config && error.config.url.includes('/events')) {
        // Do not hang the promise here, just reject it so the component can handle it
        return Promise.reject(error);
      } else {
        // Pop-up Fitur WIP biasa (Default)
        const { openWipModal } = useWipModal();
        openWipModal();
      }
      
      // Return a pending promise so the app doesn't crash on unhandled rejection
      return Promise.reject(error);
    }

    // Tangani error 403 Forbidden secara global (misal: akses konten premium ditolak)
    if (error.response && error.response.status === 403) {
      const message = error.response.data?.message || '';
      if (message.toLowerCase().includes('berlangganan') || message.toLowerCase().includes('premium')) {
        window.location.href = '/pricing';
        return Promise.reject(error);
      }
    }

    // Tangani error 401 Unauthorized secara global
    if (error.response && error.response.status === 401 && !['/auth/login', '/auth/register', '/auth/verify-otp', '/auth/resend-otp'].includes(error.config?.url)) {
      if (ssoEnabled) clearSsoSession();
      // Jika error 401 berasal dari '/auth/me', abaikan redirect karena wajar saat init App.vue
      if (error.config && error.config.url === '/auth/me') {
        return Promise.reject(error);
      }

      // Bersihkan token yang tidak valid
      localStorage.removeItem('auth_token');
      
      // Hanya redirect ke login jika halaman saat ini memang wajib login
      if (router.currentRoute.value.meta && router.currentRoute.value.meta.requiresAuth) {
        router.push('/login');
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Helper untuk memastikan CSRF cookie dari Sanctum sudah didapat
 * sebelum melakukan request POST/PUT/DELETE.
 */
export const initCsrf = async () => {
  // Untuk mode API Token (Bearer), fungsi ini tidak perlu melakukan apa-apa.
  return Promise.resolve();
};

export default api;
