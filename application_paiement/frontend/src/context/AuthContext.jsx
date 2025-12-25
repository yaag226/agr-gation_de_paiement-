import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import logger from '../utils/logger';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        logger.info('Session restaurée depuis le stockage local', {
          userId: parsedUser.id,
          role: parsedUser.role
        });
      } catch (error) {
        logger.error('Erreur lors de la restauration de la session', {
          error: error.message
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      logger.info('Tentative de connexion', {
        email: credentials.email
      });

      const response = await authAPI.login(credentials);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      logger.logAuth('login', true, {
        userId: user.id,
        email: user.email,
        role: user.role
      });

      return { success: true };
    } catch (error) {
      logger.logAuth('login', false, {
        email: credentials.email,
        error: error.response?.data?.message || error.message
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de connexion'
      };
    }
  };

  const register = async (data) => {
    try {
      logger.info('Tentative d\'inscription', {
        email: data.email,
        role: data.role || 'client'
      });

      const response = await authAPI.register(data);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      logger.logAuth('register', true, {
        userId: user.id,
        email: user.email,
        role: user.role
      });

      return { success: true };
    } catch (error) {
      logger.logAuth('register', false, {
        email: data.email,
        error: error.response?.data?.message || error.message
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur d\'inscription'
      };
    }
  };

  const logout = () => {
    logger.logUserAction('logout', {
      userId: user?.id,
      email: user?.email
    });

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
};