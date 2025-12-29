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

    // Trim and validate inputs
    const trimmedEmail = email?.toString().trim().toLowerCase();
    const trimmedPassword = password?.toString().trim();
    const trimmedFirstName = firstName?.toString().trim();
    const trimmedLastName = lastName?.toString().trim();
    const trimmedPhone = phone?.toString().trim();
    const trimmedBusinessName = businessName?.toString().trim();

    // Validate required fields
    if (!trimmedEmail || !trimmedPassword || !trimmedFirstName || !trimmedLastName || !trimmedPhone) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs requis doivent être remplis'
      });
    }

    logger.info('Tentative d\'inscription', {
      email: trimmedEmail,
      role: role || 'client',
      ip: req.ip,
      hasBusinessName: !!trimmedBusinessName
    });

    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      logger.warn('Tentative d\'inscription avec email existant', {
        email: trimmedEmail,
        ip: req.ip
      });
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    const userData = {
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      email: trimmedEmail,
      password: trimmedPassword,
      role: role || 'client',
      phone: trimmedPhone
    };

    if (role === 'merchant') {
      if (!trimmedBusinessName) {
        return res.status(400).json({
          success: false,
          message: 'Le nom de l\'entreprise est requis pour les marchands'
        });
      }
      userData.businessName = trimmedBusinessName;
      userData.businessCategory = businessCategory;
    }

    const user = await User.create(userData);
    const token = generateToken(user._id);

    logger.logAuth('register', trimmedEmail, true, req, {
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

    // Trim and validate inputs
    const trimmedEmail = email?.toString().trim().toLowerCase();
    const trimmedPassword = password?.toString().trim();

    logger.info('Tentative de connexion', {
      email: trimmedEmail,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    if (!trimmedEmail || !trimmedPassword) {
      logger.warn('Tentative de connexion sans identifiants complets', {
        email: !!trimmedEmail,
        password: !!trimmedPassword,
        ip: req.ip
      });
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    const user = await User.findOne({ email: trimmedEmail }).select('+password');

    if (!user || !(await user.comparePassword(trimmedPassword))) {
      logger.warn('Tentative de connexion avec identifiants invalides', {
        email: trimmedEmail,
        ip: req.ip,
        userExists: !!user
      });
      logger.logAuth('login', trimmedEmail, false, req, {
        reason: 'invalid_credentials'
      });
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    if (!user.isActive) {
      logger.warn('Tentative de connexion avec compte désactivé', {
        email: trimmedEmail,
        userId: user._id,
        ip: req.ip
      });
      logger.logAuth('login', trimmedEmail, false, req, {
        userId: user._id,
        reason: 'account_disabled'
      });
      return res.status(403).json({
        success: false,
        message: 'Votre compte a été désactivé'
      });
    }

    const token = generateToken(user._id);

    logger.logAuth('login', trimmedEmail, true, req, {
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