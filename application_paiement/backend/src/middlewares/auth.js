const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      logger.warn('Tentative d\'accès sans token', {
        url: req.originalUrl,
        method: req.method,
        ip: req.ip
      });
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Token manquant'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      logger.warn('Token valide mais utilisateur non trouvé', {
        userId: decoded.id,
        url: req.originalUrl,
        ip: req.ip
      });
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    if (!req.user.isActive) {
      logger.warn('Tentative d\'accès avec compte désactivé', {
        userId: req.user._id,
        email: req.user.email,
        url: req.originalUrl,
        ip: req.ip
      });
      return res.status(403).json({
        success: false,
        message: 'Compte désactivé. Contactez l\'administrateur.'
      });
    }

    logger.debug('Authentification réussie', {
      userId: req.user._id,
      email: req.user.email,
      role: req.user.role,
      url: req.originalUrl
    });

    next();
  } catch (error) {
    logger.warn('Échec de vérification du token', {
      error: error.message,
      url: req.originalUrl,
      ip: req.ip,
      errorType: error.name
    });
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré',
      error: error.message
    });
  }
};