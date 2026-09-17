import axios from 'axios';

// Konfigurasi instance Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true, 
  withXSRFToken: true, 
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Interceptor Response
api.interceptors.response.use(
  response => response,
  error => {
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
      // Jika error 401 berasal dari '/auth/me', abaikan redirect.
      // Ini wajar karena user guest (belum login) memang akan mendapat 401 saat dicek status login-nya di awal (App.vue).
      if (error.config && error.config.url === '/auth/me') {
        return Promise.reject(error);
      }

      // Jika user tidak terautentikasi pada request lain (misal mencoba ambil data private)
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register';
      if (currentPath !== '/' && !isAuthPage) {
        // Redirect ke halaman login yang baru
        window.location.href = '/login';
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
  try {
    // Gunakan VITE_BASE_URL, hilangkan trailing slash jika ada, lalu sambungkan dengan /sanctum/csrf-cookie
    const baseUrl = import.meta.env.VITE_BASE_URL.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
    await axios.get(`${baseUrl}/sanctum/csrf-cookie`, {
      withCredentials: true
    });
  } catch (error) {
    console.error('Gagal mengambil CSRF cookie:', error);
  }
};

export default api;
