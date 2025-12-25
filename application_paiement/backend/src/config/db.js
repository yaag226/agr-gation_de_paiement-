const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📊 Database: ${conn.connection.name}`);
    logger.logDatabase('connect', conn.connection.name, true, {
      host: conn.connection.host,
      readyState: conn.connection.readyState
    });

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB connection error', {
        error: err.message,
        stack: err.stack
      });
      logger.logDatabase('error', mongoose.connection.name, false, {
        error: err.message
      });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  MongoDB disconnected');
      logger.logDatabase('disconnect', mongoose.connection.name, true);
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('✅ MongoDB reconnected');
      logger.logDatabase('reconnect', mongoose.connection.name, true);
    });

  } catch (error) {
    logger.error('❌ Error connecting to MongoDB', {
      error: error.message,
      stack: error.stack,
      mongoURI: process.env.MONGODB_URI ? 'Set' : 'Not Set'
    });
    logger.logDatabase('connect', 'unknown', false, {
      error: error.message
    });
    process.exit(1);
  }
};

module.exports = connectDB;
