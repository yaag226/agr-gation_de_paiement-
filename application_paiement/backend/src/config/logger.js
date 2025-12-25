const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Définir les niveaux de log personnalisés
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Définir les couleurs pour chaque niveau
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// Format pour les logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Format pour la console (plus lisible)
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}${info.stack ? '\n' + info.stack : ''}`
  )
);

// Créer le dossier logs s'il n'existe pas
const logsDir = path.join(__dirname, '../../logs');

// Transports pour les fichiers avec rotation
const transports = [
  // Console transport
  new winston.transports.Console({
    format: consoleFormat,
  }),

  // Transport pour tous les logs (rotation quotidienne)
  new DailyRotateFile({
    filename: path.join(logsDir, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d', // Garder les logs pendant 14 jours
    format: format,
  }),

  // Transport pour les erreurs uniquement
  new DailyRotateFile({
    level: 'error',
    filename: path.join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d', // Garder les erreurs pendant 30 jours
    format: format,
  }),
];

// Créer le logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'debug' : 'info'),
  levels,
  format,
  transports,
  exitOnError: false,
});

// Méthodes d'aide pour logger avec contexte
logger.logRequest = (req, message, meta = {}) => {
  logger.info(message, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.user?.id,
    userRole: req.user?.role,
    ...meta,
  });
};

logger.logError = (error, req = null, meta = {}) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    ...meta,
  };

  if (req) {
    errorInfo.method = req.method;
    errorInfo.url = req.originalUrl;
    errorInfo.ip = req.ip;
    errorInfo.userId = req.user?.id;
    errorInfo.body = req.body;
    errorInfo.params = req.params;
    errorInfo.query = req.query;
  }

  logger.error(error.message, errorInfo);
};

logger.logAuth = (type, email, success, req, meta = {}) => {
  logger.info(`Auth: ${type}`, {
    type,
    email,
    success,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    ...meta,
  });
};

logger.logPayment = (action, paymentId, amount, status, meta = {}) => {
  logger.info(`Payment: ${action}`, {
    action,
    paymentId,
    amount,
    status,
    ...meta,
  });
};

logger.logDatabase = (operation, collection, success, meta = {}) => {
  logger.info(`DB: ${operation}`, {
    operation,
    collection,
    success,
    ...meta,
  });
};

module.exports = logger;
