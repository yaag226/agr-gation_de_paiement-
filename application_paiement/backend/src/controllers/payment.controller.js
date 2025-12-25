const Transaction = require('../models/Transaction.model');
const Merchant = require('../models/Merchant.model');
const PaymentService = require('../services/payment.service');
const { TRANSACTION_STATUS } = require('../config/constants');

// Route publique pour effectuer un paiement (utilisée par les clients)
exports.processPayment = async (req, res) => {
  try {
    const {
      amount,
      paymentMethod, // 'orange_money' ou 'mtn_money'
      customerPhone,
      customerEmail,
      customerName,
      description,
      merchantId // ID du marchand qui reçoit le paiement
    } = req.body;

    // Validation des données
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Montant invalide'
      });
    }

    if (!paymentMethod || !['orange_money', 'mtn_money'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Moyen de paiement invalide. Choisissez Orange Money ou MTN Mobile Money'
      });
    }

    if (!customerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Numéro de téléphone requis'
      });
    }

    // Récupérer le marchand
    let merchant;
    if (merchantId) {
      merchant = await Merchant.findById(merchantId);
    } else {
      // Si pas de merchantId, prendre le premier marchand actif
      // En dev/test, on accepte les merchants non vérifiés
      const isProduction = process.env.NODE_ENV === 'production';
      if (isProduction) {
        merchant = await Merchant.findOne({ isActive: true, isVerified: true });
      } else {
        merchant = await Merchant.findOne({ isActive: true });
      }
    }

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Aucun marchand disponible'
      });
    }

    // Vérifier que le merchant est actif
    if (!merchant.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Le compte marchand n\'est pas actif'
      });
    }

    // En production, vérifier aussi la vérification
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction && !merchant.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Le compte marchand n\'est pas vérifié'
      });
    }

    // Sélection automatique du provider selon la disponibilité
    const selectedProvider = paymentMethod;
    const providerConfig = merchant.getProviderConfig(selectedProvider);

    // Si le provider n'est pas configuré, utiliser une config par défaut pour la démo
    const finalProviderConfig = providerConfig || { enabled: true };

    // Générer l'ID de transaction
    const transactionId = Transaction.generateTransactionId();

    // Traiter le paiement
    const paymentResult = await PaymentService.processPayment({
      provider: selectedProvider,
      providerConfig: finalProviderConfig,
      amount,
      currency: 'XOF', // Franc CFA pour le Burkina Faso
      customerEmail: customerEmail || `${customerPhone}@mobile.bf`,
      customerName: customerName || 'Client',
      customerPhone,
      description: description || 'Paiement mobile',
      transactionId
    });

    // Créer la transaction
    const transaction = await Transaction.create({
      merchant: merchant._id,
      transactionId,
      provider: selectedProvider,
      providerTransactionId: paymentResult.providerTransactionId,
      amount,
      currency: 'XOF',
      status: paymentResult.status,
      customer: {
        email: customerEmail || `${customerPhone}@mobile.bf`,
        name: customerName || 'Client',
        phone: customerPhone
      },
      description: description || 'Paiement mobile',
      commission: paymentResult.commission,
      netAmount: amount - paymentResult.commission.totalFee,
      paymentMethod: paymentResult.paymentMethod,
      paymentDetails: paymentResult.paymentDetails,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Si le paiement est réussi, mettre à jour les stats du marchand
    if (paymentResult.status === TRANSACTION_STATUS.COMPLETED) {
      transaction.completedAt = new Date();
      await transaction.save();

      merchant.totalTransactions += 1;
      merchant.totalRevenue += transaction.netAmount;
      await merchant.save();
    } else if (paymentResult.status === TRANSACTION_STATUS.FAILED) {
      transaction.failedAt = new Date();
      transaction.failureReason = 'Paiement refusé par l\'opérateur';
      await transaction.save();
    }

    // Retourner la réponse
    res.status(201).json({
      success: paymentResult.status === TRANSACTION_STATUS.COMPLETED,
      message: paymentResult.status === TRANSACTION_STATUS.COMPLETED
        ? '✅ Paiement réussi !'
        : '❌ Paiement échoué',
      data: {
        transactionId: transaction.transactionId,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        paymentMethod: transaction.paymentMethod,
        provider: transaction.provider,
        reference: paymentResult.paymentDetails.reference,
        timestamp: transaction.createdAt
      }
    });
  } catch (error) {
    console.error('Erreur de paiement:', error);
    res.status(500).json({
      success: false,
      message: '❌ Erreur lors du traitement du paiement',
      error: error.message
    });
  }
};

// Récupérer l'historique des transactions d'un client (par téléphone ou email)
exports.getCustomerTransactions = async (req, res) => {
  try {
    const { phone, email, limit = 20, page = 1 } = req.query;

    if (!phone && !email) {
      return res.status(400).json({
        success: false,
        message: 'Numéro de téléphone ou email requis'
      });
    }

    const query = {};
    if (phone) query['customer.phone'] = phone;
    if (email) query['customer.email'] = email;

    const transactions = await Transaction.find(query)
      .populate('merchant', 'businessName')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: {
        transactions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des transactions',
      error: error.message
    });
  }
};
