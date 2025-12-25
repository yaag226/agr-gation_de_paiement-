/**
 * Système de logging côté client
 * Enregistre les logs en console et dans localStorage pour débogage
 */

const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

const MAX_LOGS = 100; // Nombre maximum de logs à garder en localStorage

class Logger {
  constructor() {
    this.isDevelopment = import.meta.env.MODE === 'development';
    this.logsKey = 'app_logs';
  }

  /**
   * Formatte un message de log
   */
  formatMessage(level, message, data = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
  }

  /**
   * Stocke un log dans localStorage
   */
  storeLog(logEntry) {
    try {
      const logs = this.getLogs();
      logs.push(logEntry);

      // Garder seulement les MAX_LOGS derniers logs
      if (logs.length > MAX_LOGS) {
        logs.shift();
      }

      localStorage.setItem(this.logsKey, JSON.stringify(logs));
    } catch (error) {
      console.error('Erreur lors du stockage du log:', error);
    }
  }

  /**
   * Récupère tous les logs stockés
   */
  getLogs() {
    try {
      const logs = localStorage.getItem(this.logsKey);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des logs:', error);
      return [];
    }
  }

  /**
   * Efface tous les logs stockés
   */
  clearLogs() {
    localStorage.removeItem(this.logsKey);
  }

  /**
   * Log un message d'erreur
   */
  error(message, data = {}) {
    const logEntry = this.formatMessage(LOG_LEVELS.ERROR, message, data);
    console.error(`[ERROR] ${message}`, data);
    this.storeLog(logEntry);
  }

  /**
   * Log un avertissement
   */
  warn(message, data = {}) {
    const logEntry = this.formatMessage(LOG_LEVELS.WARN, message, data);
    console.warn(`[WARN] ${message}`, data);
    this.storeLog(logEntry);
  }

  /**
   * Log une information
   */
  info(message, data = {}) {
    const logEntry = this.formatMessage(LOG_LEVELS.INFO, message, data);
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, data);
    }
    this.storeLog(logEntry);
  }

  /**
   * Log de débogage (seulement en développement)
   */
  debug(message, data = {}) {
    if (this.isDevelopment) {
      const logEntry = this.formatMessage(LOG_LEVELS.DEBUG, message, data);
      console.log(`[DEBUG] ${message}`, data);
      this.storeLog(logEntry);
    }
  }

  /**
   * Log une erreur API
   */
  logAPIError(error, context = {}) {
    const errorData = {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message || error.message,
      endpoint: error.config?.url,
      method: error.config?.method,
      ...context
    };

    this.error('Erreur API', errorData);
  }

  /**
   * Log une requête API réussie
   */
  logAPISuccess(response, context = {}) {
    const successData = {
      status: response.status,
      endpoint: response.config?.url,
      method: response.config?.method,
      ...context
    };

    this.debug('Requête API réussie', successData);
  }

  /**
   * Log une action utilisateur
   */
  logUserAction(action, data = {}) {
    this.info(`Action utilisateur: ${action}`, data);
  }

  /**
   * Log une authentification
   */
  logAuth(action, success, data = {}) {
    const message = `Authentification: ${action}`;
    if (success) {
      this.info(message, { success, ...data });
    } else {
      this.warn(message, { success, ...data });
    }
  }

  /**
   * Log une erreur React (pour error boundaries)
   */
  logReactError(error, errorInfo) {
    this.error('Erreur React', {
      error: error.toString(),
      componentStack: errorInfo.componentStack
    });
  }

  /**
   * Exporte les logs en format JSON téléchargeable
   */
  exportLogs() {
    const logs = this.getLogs();
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

// Créer une instance singleton
const logger = new Logger();

// Capturer les erreurs globales non gérées
window.addEventListener('error', (event) => {
  logger.error('Erreur JavaScript non gérée', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error?.stack
  });
});

// Capturer les promesses rejetées non gérées
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Promise rejetée non gérée', {
    reason: event.reason,
    promise: event.promise
  });
});

export default logger;
