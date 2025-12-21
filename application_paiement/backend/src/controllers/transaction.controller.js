const Transaction = require('../models/Transaction.model');
const Merchant = require('../models/Merchant.model');
const PaymentService = require('../services/payment.service');
const { TRANSACTION_STATUS } = require('../config/constants');

exports.initiateTransaction = async (req, res) => {
  try {
    const { amount, currency, provider, customerEmail, customerName, description, metadata } = req.body;

    const merchant = await Merchant.findById(req.user.merchant._id);

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }

    if (!merchant.isActive || !merchant.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Merchant account is not active or verified'
      });
    }

    let selectedProvider = provider;
    if (!selectedProvider) {
      const activeProviders = merchant.getActiveProviders();
      if (activeProviders.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No active payment providers configured'
        });
      }
      selectedProvider = activeProviders[0].provider;
    }

    const providerConfig = merchant.getProviderConfig(selectedProvider);
    if (!providerConfig) {
      return res.status(400).json({
        success: false,
        message: `Provider ${selectedProvider} is not configured or active`
      });
    }

    const transactionId = Transaction.generateTransactionId();

    const paymentResult = await PaymentService.processPayment({
      provider: selectedProvider,
      providerConfig,
      amount,
      currency: currency || 'EUR',
      customerEmail,
      customerName,
      description,
      transactionId
    });

    const transaction = await Transaction.create({
      merchant: merchant._id,
      transactionId,
      provider: selectedProvider,
      providerTransactionId: paymentResult.providerTransactionId,
      amount,
      currency: currency || 'EUR',
      status: paymentResult.status,
      customer: {
        email: customerEmail,
        name: customerName
      },
      description,
      metadata,
      commission: paymentResult.commission,
      netAmount: amount - paymentResult.commission.totalFee,
      paymentMethod: paymentResult.paymentMethod,
      paymentDetails: paymentResult.paymentDetails,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    if (paymentResult.status === TRANSACTION_STATUS.COMPLETED) {
      merchant.totalTransactions += 1;
      merchant.totalRevenue += transaction.netAmount;
      await merchant.save();
    }

    res.status(201).json({
      success: true,
      data: {
        transaction,
        paymentUrl: paymentResult.paymentUrl
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Transaction initiation failed',
      error: error.message
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, provider, startDate, endDate } = req.query;

    const query = {};

    if (req.user.role === 'merchant') {
      query.merchant = req.user.merchant._id;
    }

    if (status) query.status = status;
    if (provider) query.provider = provider;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

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
      message: 'Error fetching transactions',
      error: error.message
    });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('merchant', 'businessName user');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (req.user.role === 'merchant' &&
        transaction.merchant._id.toString() !== req.user.merchant._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this transaction'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        transaction
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction',
      error: error.message
    });
  }
};

exports.refundTransaction = async (req, res) => {
  try {
    const { amount, reason } = req.body;

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (req.user.role === 'merchant' &&
        transaction.merchant.toString() !== req.user.merchant._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to refund this transaction'
      });
    }

    if (transaction.status !== TRANSACTION_STATUS.COMPLETED) {
      return res.status(400).json({
        success: false,
        message: 'Only completed transactions can be refunded'
      });
    }

    if (transaction.refund.isRefunded) {
      return res.status(400).json({
        success: false,
        message: 'Transaction already refunded'
      });
    }

    const refundAmount = amount || transaction.amount;

    const merchant = await Merchant.findById(transaction.merchant);
    const providerConfig = merchant.getProviderConfig(transaction.provider);

    const refundResult = await PaymentService.processRefund({
      provider: transaction.provider,
      providerConfig,
      providerTransactionId: transaction.providerTransactionId,
      amount: refundAmount
    });

    await transaction.processRefund(refundAmount, reason);

    merchant.totalRevenue -= transaction.netAmount;
    await merchant.save();

    res.status(200).json({
      success: true,
      message: 'Transaction refunded successfully',
      data: {
        transaction
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Refund failed',
      error: error.message
    });
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const { provider } = req.params;

    const result = await PaymentService.handleWebhook(provider, req.body, req.headers);

    if (result.transactionId) {
      const transaction = await Transaction.findOne({
        providerTransactionId: result.transactionId
      });

      if (transaction) {
        transaction.status = result.status;
        if (result.status === TRANSACTION_STATUS.COMPLETED) {
          transaction.completedAt = new Date();
        } else if (result.status === TRANSACTION_STATUS.FAILED) {
          transaction.failedAt = new Date();
          transaction.failureReason = result.failureReason;
        }
        transaction.webhookDelivered = true;
        transaction.webhookAttempts += 1;
        await transaction.save();
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message
    });
  }
};
