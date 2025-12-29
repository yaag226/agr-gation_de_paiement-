const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { simulatePayment } = require('../utils/paymentSimulator');
const logger = require('../config/logger');

// @desc    Créer un paiement
// @route   POST /api/client/payments
exports.createPayment = async (req, res) => {
  try {
    const { merchantId, amount, paymentMethod, description } = req.body;

    logger.info('Tentative de création de paiement', {
      clientId: req.user.id,
      merchantId,
      amount,
      paymentMethod
    });

    // Validation
    if (!merchantId || !amount || !paymentMethod) {
      logger.warn('Tentative de paiement avec données manquantes', {
        clientId: req.user.id,
        hasAmount: !!amount,
        hasMerchant: !!merchantId,
        hasMethod: !!paymentMethod
      });
      return res.status(400).json({
        success: false,
        message: 'Données manquantes'
      });
    }

    // Vérifier que le marchand existe
    const merchant = await User.findById(merchantId);
    if (!merchant || merchant.role !== 'merchant') {
      logger.warn('Tentative de paiement vers marchand invalide', {
        clientId: req.user.id,
        merchantId,
        merchantExists: !!merchant,
        merchantRole: merchant?.role
      });
      return res.status(404).json({
        success: false,
        message: 'Marchand non trouvé'
      });
    }

    // Créer le paiement
    const payment = await Payment.create({
      client: req.user.id,
      merchant: merchantId,
      amount,
      paymentMethod,
      description: description || `Paiement à ${merchant.businessName}`,
      status: 'PENDING'
    });

    logger.logPayment('create', payment._id, amount, 'PENDING', {
      clientId: req.user.id,
      merchantId,
      paymentMethod
    });

    // Simuler le traitement du paiement
    const simulationResult = await simulatePayment({
      amount,
      paymentMethod,
      clientId: req.user.id,
      merchantId
    });

    // Mettre à jour le statut
    payment.status = simulationResult.success ? 'SUCCESS' : 'FAILED';
    payment.simulationDetails = {
      processingTime: simulationResult.processingTime,
      failureReason: simulationResult.failureReason,
      processedAt: simulationResult.processedAt
    };

    await payment.save();

    logger.logPayment(
      'process',
      payment._id,
      amount,
      payment.status,
      {
        clientId: req.user.id,
        merchantId,
        paymentMethod,
        processingTime: simulationResult.processingTime,
        failureReason: simulationResult.failureReason
      }
    );

    // Si succès, mettre à jour les statistiques
    if (simulationResult.success) {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { totalSpent: amount, transactionCount: 1 }
      });
      await User.findByIdAndUpdate(merchantId, {
        $inc: { totalReceived: payment.netAmount, transactionCount: 1 }
      });
      logger.info('Statistiques utilisateurs mises à jour', {
        clientId: req.user.id,
        merchantId,
        paymentId: payment._id
      });
    } else {
      logger.warn('Paiement échoué', {
        paymentId: payment._id,
        clientId: req.user.id,
        merchantId,
        amount,
        failureReason: simulationResult.failureReason
      });
    }

    // Populer les données
    await payment.populate('merchant', 'businessName email phone');

    res.status(201).json({
      success: true,
      message: simulationResult.success ? 'Paiement effectué avec succès' : 'Paiement échoué',
      payment
    });
  } catch (error) {
    logger.logError(error, req, {
      operation: 'createPayment',
      clientId: req.user.id,
      amount: req.body.amount,
      merchantId: req.body.merchantId
    });
    res.status(500).json({
      success: false,
      message: 'Erreur lors du paiement',
      error: error.message
    });
  }
};

// @desc    Obtenir l'historique des paiements
// @route   GET /api/client/payments
exports.getPayments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { client: req.user.id };
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('merchant', 'businessName email phone businessCategory')
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
      operation: 'getPayments',
      clientId: req.user.id
    });
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des paiements',
      error: error.message
    });
  }
};

// @desc    Obtenir les statistiques du client
// @route   GET /api/client/stats
exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const paymentsStats = await Payment.aggregate([
      { $match: { client: mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalSpent: user.totalSpent,
        transactionCount: user.transactionCount,
        byStatus: paymentsStats
      }
    });
  } catch (error) {
    logger.logError(error, req, {
      operation: 'getStats',
      clientId: req.user.id
    });
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

// @desc    Obtenir la liste des marchands
// @route   GET /api/client/merchants
exports.getMerchants = async (req, res) => {
  try {
    logger.info('Récupération de la liste des marchands', {
      clientId: req.user.id
    });

    // Compter tous les marchands (actifs et inactifs)
    const totalMerchants = await User.countDocuments({ role: 'merchant' });
    const activeMerchants = await User.countDocuments({
      role: 'merchant',
      isActive: true
    });

    logger.info('Statistiques des marchands', {
      total: totalMerchants,
      actifs: activeMerchants,
      inactifs: totalMerchants - activeMerchants
    });

    const merchants = await User.find({
      role: 'merchant',
      isActive: true
    }).select('businessName email phone businessCategory businessAddress');

    logger.info('Marchands récupérés avec succès', {
      count: merchants.length,
      clientId: req.user.id
    });

    res.status(200).json({
      success: true,
      count: merchants.length,
      merchants
    });
  } catch (error) {
    logger.logError(error, req, {
      operation: 'getMerchants',
      clientId: req.user.id
    });
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des marchands',
      error: error.message
    });
  }
};