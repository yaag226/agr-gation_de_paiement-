import axios from 'axios';
import logger from '../utils/logger';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Instance Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token et logger les requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Logger la requête
    logger.debug('Requête API', {
      method: config.method?.toUpperCase(),
      url: config.url,
      hasAuth: !!token
    });

    return config;
  },
  (error) => {
    logger.error('Erreur lors de la préparation de la requête', {
      error: error.message
    });
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs et logger les réponses
api.interceptors.response.use(
  (response) => {
    // Logger les réponses réussies
    logger.logAPISuccess(response);
    return response;
  },
  (error) => {
    // Logger l'erreur avec tous les détails
    logger.logAPIError(error);

    // Gestion spécifique des erreurs 401
    if (error.response?.status === 401) {
      logger.warn('Session expirée ou non autorisée', {
        url: error.config?.url,
        method: error.config?.method
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Gestion des erreurs réseau
    if (!error.response) {
      logger.error('Erreur réseau - serveur inaccessible', {
        message: error.message,
        code: error.code
      });
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