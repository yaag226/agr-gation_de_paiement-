const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Inscription
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone, businessName, businessCategory } = req.body;

    logger.info('Tentative d\'inscription', {
      email,
      role: role || 'client',
      ip: req.ip,
      hasBusinessName: !!businessName
    });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn('Tentative d\'inscription avec email existant', {
        email,
        ip: req.ip
      });
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
      role: role || 'client',
      phone
    };

    if (role === 'merchant') {
      userData.businessName = businessName;
      userData.businessCategory = businessCategory;
    }

    const user = await User.create(userData);
    const token = generateToken(user._id);

    logger.logAuth('register', email, true, req, {
      userId: user._id,
      role: user.role,
      businessName: user.businessName
    });

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        businessName: user.businessName
      }
    });
  } catch (error) {
    logger.logError(error, req, {
      operation: 'register',
      email: req.body.email
    });
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
};

// @desc    Connexion
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    logger.info('Tentative de connexion', {
      email,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    if (!email || !password) {
      logger.warn('Tentative de connexion sans identifiants complets', {
        email: !!email,
        password: !!password,
        ip: req.ip
      });
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      logger.warn('Tentative de connexion avec identifiants invalides', {
        email,
        ip: req.ip,
        userExists: !!user
      });
      logger.logAuth('login', email, false, req, {
        reason: 'invalid_credentials'
      });
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    if (!user.isActive) {
      logger.warn('Tentative de connexion avec compte désactivé', {
        email,
        userId: user._id,
        ip: req.ip
      });
      logger.logAuth('login', email, false, req, {
        userId: user._id,
        reason: 'account_disabled'
      });
      return res.status(403).json({
        success: false,
        message: 'Votre compte a été désactivé'
      });
    }

    const token = generateToken(user._id);

    logger.logAuth('login', email, true, req, {
      userId: user._id,
      role: user.role
    });

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        businessName: user.businessName
      }
    });
  } catch (error) {
    logger.logError(error, req, {
      operation: 'login',
      email: req.body.email
    });
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// @desc    Obtenir le profil
// @route   GET /api/auth/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      logger.warn('Tentative d\'accès au profil d\'un utilisateur inexistant', {
        userId: req.user.id,
        ip: req.ip
      });
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    logger.info('Récupération du profil', {
      userId: user._id,
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    logger.logError(error, req, {
      operation: 'getProfile',
      userId: req.user.id
    });
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};