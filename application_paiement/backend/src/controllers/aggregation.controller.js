const AggregatedPayment = require('../models/AggregatedPayment.model');
const Transaction = require('../models/Transaction.model');
const Merchant = require('../models/Merchant.model');
const PaymentService = require('../services/payment.service');
const { TRANSACTION_STATUS } = require('../config/constants');

// Créer un paiement agrégé (plusieurs factures en une seule transaction)
exports.createAggregatedPayment = async (req, res) => {
  try {
    const {
      payments, // Array de {description, amount, reference, category}
      provider, // orange_money ou mtn_money
      customerPhone,
      customerEmail,
      customerName,
      merchantId
    } = req.body;

    // Validation
    if (!payments || payments.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Au moins un paiement est requis'
      });
    }

    if (!provider || !['orange_money', 'mtn_money'].includes(provider)) {
      return res.status(400).json({
        success: false,
        message: 'Provider invalide'
      });
    }

    if (!customerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Numéro de téléphone requis'
      });
    }

    // Calculer le montant total
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    // Créer l'agrégation
    const aggregationId = AggregatedPayment.generateAggregationId();

    const aggregatedPayment = await AggregatedPayment.create({
      aggregationId,
      customer: {
        phone: customerPhone,
        email: customerEmail || `${customerPhone}@mobile.bf`,
        name: customerName || 'Client'
      },
      payments,
      totalAmount,
      provider,
      status: 'pending',
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    // Log: Création de l'agrégation
    await aggregatedPayment.addLog(
      'CREATION',
      `Agrégation créée avec ${payments.length} paiement(s) pour un total de ${totalAmount} XOF`,
      'success'
    );

    // Récupérer le marchand
    let merchant;
    if (merchantId) {
      merchant = await Merchant.findById(merchantId);
    } else {
      merchant = await Merchant.findOne({ isActive: true, isVerified: true });
    }

    if (!merchant) {
      await aggregatedPayment.addLog(
        'ERROR',
        'Aucun marchand disponible',
        'error'
      );
      return res.status(404).json({
        success: false,
        message: 'Aucun marchand disponible'
      });
    }

    // Log: Marchand sélectionné
    await aggregatedPayment.addLog(
      'MERCHANT_SELECTED',
      `Marchand: ${merchant.businessName}`,
      'success'
    );

    // Traiter chaque paiement individuellement
    aggregatedPayment.status = 'processing';
    await aggregatedPayment.addLog(
      'PROCESSING',
      'Début du traitement des paiements',
      'info'
    );
    await aggregatedPayment.save();

    const providerConfig = merchant.getProviderConfig(provider) || { enabled: true };
    const transactionIds = [];
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < payments.length; i++) {
      const payment = payments[i];

      // Log: Début du traitement d'un paiement
      await aggregatedPayment.addLog(
        'PAYMENT_START',
        `Traitement du paiement ${i + 1}/${payments.length}: ${payment.description} - ${payment.amount} XOF`,
        'info'
      );

      try {
        const transactionId = Transaction.generateTransactionId();

        // Traiter le paiement
        const paymentResult = await PaymentService.processPayment({
          provider,
          providerConfig,
          amount: payment.amount,
          currency: 'XOF',
          customerEmail: customerEmail || `${customerPhone}@mobile.bf`,
          customerName: customerName || 'Client',
          customerPhone,
          description: `${payment.description} (Agrégation: ${aggregationId})`,
          transactionId
        });

        // Créer la transaction
        const transaction = await Transaction.create({
          merchant: merchant._id,
          transactionId,
          provider,
          providerTransactionId: paymentResult.providerTransactionId,
          amount: payment.amount,
          currency: 'XOF',
          status: paymentResult.status,
          customer: {
            email: customerEmail || `${customerPhone}@mobile.bf`,
            name: customerName || 'Client',
            phone: customerPhone
          },
          description: `${payment.description} (Agrégation: ${aggregationId})`,
          metadata: new Map([
            ['aggregationId', aggregationId],
            ['paymentIndex', String(i)],
            ['category', payment.category || 'autre'],
            ['reference', payment.reference || '']
          ]),
          commission: paymentResult.commission,
          netAmount: payment.amount - paymentResult.commission.totalFee,
          paymentMethod: paymentResult.paymentMethod,
          paymentDetails: paymentResult.paymentDetails,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        });

        transactionIds.push(transaction._id);

        if (paymentResult.status === TRANSACTION_STATUS.COMPLETED) {
          transaction.completedAt = new Date();
          await transaction.save();

          merchant.totalTransactions += 1;
          merchant.totalRevenue += transaction.netAmount;
          await merchant.save();

          successCount++;

          // Log: Paiement réussi
          await aggregatedPayment.addLog(
            'PAYMENT_SUCCESS',
            `✅ Paiement ${i + 1} réussi: ${payment.description} - Réf: ${paymentResult.paymentDetails.reference}`,
            'success'
          );
        } else {
          transaction.failedAt = new Date();
          transaction.failureReason = 'Paiement refusé par l\'opérateur';
          await transaction.save();

          failureCount++;

          // Log: Paiement échoué
          await aggregatedPayment.addLog(
            'PAYMENT_FAILED',
            `❌ Paiement ${i + 1} échoué: ${payment.description}`,
            'error'
          );
        }
      } catch (error) {
        failureCount++;
        await aggregatedPayment.addLog(
          'PAYMENT_ERROR',
          `❌ Erreur paiement ${i + 1}: ${error.message}`,
          'error'
        );
      }
    }

    // Mettre à jour l'agrégation
    aggregatedPayment.transactions = transactionIds;

    if (failureCount === 0) {
      aggregatedPayment.status = 'completed';
      aggregatedPayment.completedAt = new Date();
      await aggregatedPayment.addLog(
        'COMPLETED',
        `✅ Tous les paiements ont réussi (${successCount}/${payments.length})`,
        'success'
      );
    } else if (successCount === 0) {
      aggregatedPayment.status = 'failed';
      aggregatedPayment.failedAt = new Date();
      await aggregatedPayment.addLog(
        'FAILED',
        `❌ Tous les paiements ont échoué (0/${payments.length})`,
        'error'
      );
    } else {
      aggregatedPayment.status = 'partial';
      await aggregatedPayment.addLog(
        'PARTIAL',
        `⚠️ Paiements partiels: ${successCount} réussis, ${failureCount} échoués`,
        'warning'
      );
    }

    await aggregatedPayment.save();

    // Récupérer l'agrégation complète avec les transactions
    const fullAggregation = await AggregatedPayment.findById(aggregatedPayment._id)
      .populate('transactions');

    res.status(201).json({
      success: aggregatedPayment.status === 'completed',
      message: aggregatedPayment.status === 'completed'
        ? '✅ Agrégation de paiements réussie !'
        : aggregatedPayment.status === 'partial'
        ? '⚠️ Agrégation partielle'
        : '❌ Agrégation échouée',
      data: {
        aggregation: fullAggregation,
        summary: {
          total: payments.length,
          success: successCount,
          failed: failureCount,
          totalAmount,
          status: aggregatedPayment.status
        }
      }
    });
  } catch (error) {
    console.error('Erreur agrégation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'agrégation des paiements',
      error: error.message
    });
  }
};

// Récupérer une agrégation avec son traçage complet
exports.getAggregation = async (req, res) => {
  try {
    const { id } = req.params;

    const aggregation = await AggregatedPayment.findOne({
      $or: [
        { _id: id },
        { aggregationId: id }
      ]
    }).populate('transactions');

    if (!aggregation) {
      return res.status(404).json({
        success: false,
        message: 'Agrégation non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        aggregation
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération',
      error: error.message
    });
  }
};

// Récupérer l'historique des agrégations d'un client
exports.getCustomerAggregations = async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Numéro de téléphone requis'
      });
    }

    const aggregations = await AggregatedPayment.find({
      'customer.phone': phone
    })
      .populate('transactions')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: aggregations.length,
      data: {
        aggregations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération',
      error: error.message
    });
  }
};

// Obtenir les logs en temps réel d'une agrégation
exports.getAggregationLogs = async (req, res) => {
  try {
    const { id } = req.params;

    const aggregation = await AggregatedPayment.findOne({
      $or: [
        { _id: id },
        { aggregationId: id }
      ]
    }).select('aggregationId activityLog status');

    if (!aggregation) {
      return res.status(404).json({
        success: false,
        message: 'Agrégation non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        aggregationId: aggregation.aggregationId,
        status: aggregation.status,
        logs: aggregation.activityLog
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des logs',
      error: error.message
    });
  }
};
