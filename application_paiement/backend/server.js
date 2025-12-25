const app = require('./src/app');
const connectDB = require('./src/config/db');
const logger = require('./src/config/logger');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  logger.info(`📍 API available at http://localhost:${PORT}/api`);
  logger.info('Server started successfully', {
    port: PORT,
    env: process.env.NODE_ENV || 'development',
    nodeVersion: process.version
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('❌ Unhandled Promise Rejection', {
    error: err.message,
    stack: err.stack,
    type: 'unhandledRejection'
  });
  server.close(() => {
    logger.warn('Server closed due to unhandled rejection');
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('❌ Uncaught Exception', {
    error: err.message,
    stack: err.stack,
    type: 'uncaughtException'
  });
  server.close(() => {
    logger.warn('Server closed due to uncaught exception');
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('💤 Process terminated');
  });
});
