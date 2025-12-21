import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const merchantAPI = {
  getAll: (params) => api.get('/merchants', { params }),
  getById: (id) => api.get(`/merchants/${id}`),
  update: (id, data) => api.put(`/merchants/${id}`, data),
  addProviderConfig: (data) => api.post('/merchants/provider-config', data),
  updateProviderConfig: (provider, data) => api.put(`/merchants/provider-config/${provider}`, data),
  removeProviderConfig: (provider) => api.delete(`/merchants/provider-config/${provider}`),
  getStats: () => api.get('/merchants/stats'),
};

export const transactionAPI = {
  initiate: (data) => api.post('/transactions/initiate', data),
  getAll: (params) => api.get('/transactions', { params }),
  getById: (id) => api.get(`/transactions/${id}`),
  refund: (id, data) => api.post(`/transactions/${id}/refund`, data),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getRevenue: (params) => api.get('/analytics/revenue', { params }),
  getProviders: () => api.get('/analytics/providers'),
  export: (params) => api.get('/analytics/export', { params }),
};

export default api;
