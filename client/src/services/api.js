import axios from 'axios';

// Use Vite proxy in dev (/api → localhost:5000/api)
// In production set VITE_API_URL
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token; let browser set multipart boundary for FormData
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('peblo_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
}, (err) => Promise.reject(err));

// Handle auth errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('peblo_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
