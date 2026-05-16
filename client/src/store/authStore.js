import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('peblo_token') || null,
  isAuthenticated: false,
  isLoading: true,

  init: async () => {
    const token = localStorage.getItem('peblo_token');
    if (!token) { set({ isLoading: false }); return; }
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.user, isAuthenticated: true, token, isLoading: false });
    } catch {
      localStorage.removeItem('peblo_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('peblo_token', token);
    set({ user, token, isAuthenticated: true });
    return res.data;
  },

  signup: async (name, email, password) => {
    const res = await api.post('/auth/signup', { name, email, password });
    const { token, user } = res.data;
    localStorage.setItem('peblo_token', token);
    set({ user, token, isAuthenticated: true });
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('peblo_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
