import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s timeout
});

// ─── Request Interceptor: Tự động gắn JWT Token ───
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Xử lý lỗi tập trung ───
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi 401 Unauthorized → xoá token, redirect
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Chỉ redirect nếu đang ở trang cần auth
      if (window.location.pathname.startsWith('/dashboard')) {
        window.location.href = '/';
      }
    }

    // Trích xuất error message từ response
    const message =
      error.response?.data?.message ||
      error.message ||
      'Đã xảy ra lỗi không xác định';

    return Promise.reject(new Error(message));
  }
);

export default api;
export { API_URL };
