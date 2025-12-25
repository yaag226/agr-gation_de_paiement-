const User = require('../models/User');
const Payment = require('../models/Payment');
const logger = require('../config/logger');

// @desc    Obtenir tous les utilisateurs
// @route   GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      users
    });
  } catch (error) {
    logger.logError(error, req, {
      operation: 'getUsers',
      adminId: req.user.id
    });
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message
    });
  }
};

// @desc    Activer/Désactiver un utilisateur
// @route   PATCH /api/admin/users/:id/toggle-status
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      logger.warn('Tentative de modification de statut d\'utilisateur inexistant', {
        adminId: req.user.id,
        targetUserId: req.params.id
      });
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    if (user.role === 'admin') {
      logger.warn('Tentative de modification de statut d\'un admin', {
        adminId: req.user.id,
        targetUserId: user._id,
        targetUserEmail: user.email
      });
      return res.status(403).json({
        success: false,
        message: 'Impossible de modifier un administrateur'
      });
    }

    const previousStatus = user.isActive;
    user.isActive = !user.isActive;
    await user.save();

    logger.info('Statut utilisateur modifié', {
      adminId: req.user.id,
      targetUserId: user._id,
      targetUserEmail: user.email,
      previousStatus,
      newStatus: user.isActive,
      action: user.isActive ? 'activated' : 'deactivated'
    });

    res.status(200).json({
      success: true,
      message: `Utilisateur ${user.isActive ? 'activé' : 'désactivé'}`,
      user
    });
  } catch (error) {
    logger.logError(error, req, {
      operation: 'toggleUserStatus',
      adminId: req.user.id,
      targetUserId: req.params.id
    });
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification',
      error: error.message
    });
  }
};

// @desc    Obtenir toutes les transactions
// @route   GET /api/admin/payments
exports.getAllPayments = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('client', 'firstName lastName email')
      .populate('merchant', 'businessName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: payments.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      payments
    });
  } catch (error) {
    logger.logError(error, req, {
      operation: 'getAllPayments',
      adminId: req.user.id
    });
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des paiements',
      error: error.message
    });
  }
};

// @desc    Obtenir le tableau de bord admin
// @route   GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    // Statistiques utilisateurs
    const totalUsers = await User.countDocuments();
    const totalClients = await User.countDocuments({ role: 'client' });
    const totalMerchants = await User.countDocuments({ role: 'merchant' });
    const activeUsers = await User.countDocuments({ isActive: true });

    // Statistiques paiements
    const totalPayments = await Payment.countDocuments();
    const successPayments = await Payment.countDocuments({ status: 'SUCCESS' });
    const failedPayments = await Payment.countDocuments({ status: 'FAILED' });
    const pendingPayments = await Payment.countDocuments({ status: 'PENDING' });

    // Montant total traité
    const totalAmountProcessed = await Payment.aggregate([
      { $match: { status: 'SUCCESS' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Frais totaux collectés
    const totalFeesCollected = await Payment.aggregate([
      { $match: { status: 'SUCCESS' } },
      { $group: { _id: null, total: { $sum: '$fees' } } }
    ]);

    // Transactions par méthode de paiement
    const paymentsByMethod = await Payment.aggregate([
      { $match: { status: 'SUCCESS' } },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Transactions des 30 derniers jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top 5 marchands
    const topMerchants = await User.find({ role: 'merchant' })
      .sort({ totalReceived: -1 })
      .limit(5)
      .select('businessName totalReceived transactionCount');

    // Dernières transactions
    const recentTransactions = await Payment.find()
      .populate('client', 'firstName lastName')
      .populate('merchant', 'businessName')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      dashboard: {
        users: {
          total: totalUsers,
          clients: totalClients,
          merchants: totalMerchants,
          active: activeUsers
        },
        payments: {
          total: totalPayments,
          success: successPayments,
          failed: failedPayments,
          pending: pendingPayments,
          successRate: totalPayments > 0 ? ((successPayments / totalPayments) * 100).toFixed(1) : 0
        },
        financial: {
          totalProcessed: totalAmountProcessed[0]?.total || 0,
          totalFees: totalFeesCollected[0]?.total || 0
        },
        charts: {
          paymentsByMethod,
          recentActivity
        },
        topMerchants,
        recentTransactions
      }
    });
  } catch (error) {
    logger.logError(error, req, {
      operation: 'getDashboard',
      adminId: req.user.id
    });
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du tableau de bord',
      error: error.message
    });
  }
};

// @desc    Obtenir les statistiques globales
// @route   GET /api/admin/stats
exports.getGlobalStats = async (req, res) => {
  try {
    const stats = await Payment.aggregate([
      {
        $facet: {
          byStatus: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
                total: { $sum: '$amount' }
              }
            }
          ],
          byMethod: [
            {
              $group: {
                _id: '$paymentMethod',
                count: { $sum: 1 },
                total: { $sum: '$amount' }
              }
            }
          ],
          byCurrency: [
            {
              $group: {
                _id: '$currency',
                count: { $sum: 1 },
                total: { $sum: '$amount' }
              }
            }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0]
    });
  } catch (error) {
    logger.logError(error, req, {
      operation: 'getGlobalStats',
      adminId: req.user.id
    });
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};