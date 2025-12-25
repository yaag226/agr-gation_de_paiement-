const Payment = require('../models/Payment');
const User = require('../models/User');

// @desc    Obtenir les paiements reçus
// @route   GET /api/merchant/payments
exports.getPayments = async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = { merchant: req.user.id };
    
    if (status) query.status = status;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query)
      .populate('client', 'firstName lastName email phone')
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
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des paiements',
      error: error.message
    });
  }
};

// @desc    Obtenir le tableau de bord
// @route   GET /api/merchant/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Statistiques globales
    const totalPayments = await Payment.countDocuments({ 
      merchant: req.user.id 
    });

    const successPayments = await Payment.countDocuments({ 
      merchant: req.user.id,
      status: 'SUCCESS'
    });

    const pendingPayments = await Payment.countDocuments({ 
      merchant: req.user.id,
      status: 'PENDING'
    });

    const failedPayments = await Payment.countDocuments({ 
      merchant: req.user.id,
      status: 'FAILED'
    });

    // Revenus par méthode de paiement
    const paymentMethodsStats = await Payment.aggregate([
      { 
        $match: { 
          merchant: req.user._id,
          status: 'SUCCESS'
        } 
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          total: { $sum: '$netAmount' }
        }
      }
    ]);

    // Revenus des 7 derniers jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentRevenue = await Payment.aggregate([
      {
        $match: {
          merchant: req.user._id,
          status: 'SUCCESS',
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$netAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Dernières transactions
    const recentTransactions = await Payment.find({ 
      merchant: req.user.id 
    })
      .populate('client', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      dashboard: {
        overview: {
          totalReceived: user.totalReceived,
          totalTransactions: user.transactionCount,
          successRate: totalPayments > 0 ? ((successPayments / totalPayments) * 100).toFixed(1) : 0
        },
        statistics: {
          total: totalPayments,
          success: successPayments,
          pending: pendingPayments,
          failed: failedPayments
        },
        paymentMethods: paymentMethodsStats,
        recentRevenue,
        recentTransactions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du tableau de bord',
      error: error.message
    });
  }
};

// @desc    Obtenir les statistiques détaillées
// @route   GET /api/merchant/stats
exports.getStats = async (req, res) => {
  try {
    const { period = '30' } = req.query; // 7, 30, 90 jours

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    const stats = await Payment.aggregate([
      {
        $match: {
          merchant: req.user._id,
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalFees: { $sum: '$fees' },
          netAmount: { $sum: '$netAmount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      period: `${period} derniers jours`,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};