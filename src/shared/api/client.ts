import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const APP_KEY = import.meta.env.VITE_APP_KEY || 'SP_APP_KEY_2026_xM99qP2!'

// Phòng vệ lỗi Mixed Content: Nếu chạy trên trang HTTPS (như Vercel),
// trình duyệt sẽ chặn toàn bộ request gọi trực tiếp tới http:// không có SSL.
// Tự động chuyển về '/api' để sử dụng reverse proxy an toàn (như vercel.json rewrites).
if (typeof window !== 'undefined' && window.location.protocol === 'https:' && API_BASE_URL.startsWith('http://')) {
  console.warn('[API Client] Phát hiện API_BASE_URL dùng http:// trên trang HTTPS. Tự động chuyển về /api để tránh lỗi Mixed Content.')
  API_BASE_URL = '/api'
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Key': APP_KEY,
  },
})

// Request interceptor: Gắn JWT bearer token và X-App-Key
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Feature clients use versioned absolute paths. Keep the gateway origin only
    // when an older environment value already includes /api or /api/v1.
    if (config.url?.startsWith('/api/v1/')) {
      config.baseURL = (config.baseURL || '').replace(/\/api(?:\/v1)?\/?$/, '')
    }
    if (config.headers) {
      config.headers['X-App-Key'] = APP_KEY
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor: Chuẩn hóa error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      // Xử lý token hết hạn hoặc chưa đăng nhập
      console.warn('[API Client] Unauthorized access (401)')
    } else if (status === 403) {
      console.warn('[API Client] Forbidden access (403) - Kiểm tra X-App-Key hoặc quyền hạn')
    }
    return Promise.reject(error)
  },
)
