import axios from 'axios';
import router from '../router';
import { useWipModal } from '../composables/useWipModal';

// Konfigurasi instance Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  
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

// Request Interceptor untuk menyisipkan Bearer Token (Mode API Token)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor Response
api.interceptors.response.use(
  response => response,
  error => {
    // 1. Cek apakah ini fitur yang belum jadi / belum di-push (404 Not Found, 501 Not Implemented, atau Server Mati)
    const isNetworkError = !error.response;
    const isWipError = error.response && (error.response.status === 404 || error.response.status === 501);
    
    if (isNetworkError || isWipError) {
      // Jika ini error saat cek token di awal, logout, atau speedrun (karena 404 dari database), abaikan agar tidak muncul pop-up WIP
      if (error.config && (
        error.config.url === '/auth/me' || 
        error.config.url === '/auth/logout' ||
        error.config.url.includes('submit-speedrun') ||
        error.config.url.includes('/coupons/validate')
      )) {
        return Promise.reject(error);
      }
      
      const { openWipModal } = useWipModal();
      
      // Jika error terjadi saat memuat daftar/detail tantangan (Belum ada event)
      if (error.config && error.config.url.includes('/events')) {
        openWipModal({
          title: 'Tantangan Belum Tersedia',
          desc: 'Wah, sepertinya tantangan ini belum dimulai nih. Tunggu challenge selanjutnya yaa!',
          icon: 'fa-face-sad-tear'
        });
      } else {
        // Pop-up Fitur WIP biasa (Default)
        openWipModal();
      }
      
      // Return a pending promise so the app doesn't crash on unhandled rejection
      return new Promise(() => {});
    }

    // Tangani error 403 Forbidden secara global (misal: akses konten premium ditolak)
    if (error.response && error.response.status === 403) {
      const message = error.response.data?.message || '';
      if (message.toLowerCase().includes('berlangganan') || message.toLowerCase().includes('premium')) {
        window.location.href = '/dashboard?tab=langganan';
        return Promise.reject(error);
      }
    }

    // Tangani error 401 Unauthorized secara global
    if (error.response && error.response.status === 401) {
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
