import axios from 'axios';

// Konfigurasi instance Axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true, // Wajib untuk Sanctum SPA authentication (menyertakan cookie CORS)
  withXSRFToken: true, // Wajib untuk Axios versi modern agar mengirim header X-XSRF-TOKEN pada request cross-origin
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Interceptor Response
api.interceptors.response.use(
  response => response,
  error => {
    // Tangani error 401 Unauthorized secara global
    if (error.response && error.response.status === 401) {
      // Jika user tidak terautentikasi (session expired atau belum login)
      // Kita bisa memicu event logout atau mengarahkan ke halaman home
      const currentPath = window.location.pathname;
      if (currentPath !== '/') {
        // Redirect ke home dan buka modal login via URL parameter (opsional)
        window.location.href = '/?auth=login';
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
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true
    });
  } catch (error) {
    console.error('Gagal mengambil CSRF cookie:', error);
  }
};

export default api;
