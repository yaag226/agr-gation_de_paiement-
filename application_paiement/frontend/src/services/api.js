import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Instance Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs
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

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile')
};

// Client
export const clientAPI = {
  createPayment: (data) => api.post('/client/payments', data),
  getPayments: (params) => api.get('/client/payments', { params }),
  getStats: () => api.get('/client/stats'),
  getMerchants: () => api.get('/client/merchants')
};

// Merchant
export const merchantAPI = {
  getPayments: (params) => api.get('/merchant/payments', { params }),
  getDashboard: () => api.get('/merchant/dashboard'),
  getStats: (params) => api.get('/merchant/stats', { params })
};

// Admin
export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/toggle-status`),
  getAllPayments: (params) => api.get('/admin/payments', { params }),
  getDashboard: () => api.get('/admin/dashboard'),
  getGlobalStats: () => api.get('/admin/stats')
};

export default api;