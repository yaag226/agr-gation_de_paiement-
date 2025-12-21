const mongoose = require('mongoose');
const { TRANSACTION_STATUS, PROVIDERS, CURRENCIES } = require('../config/constants');

const transactionSchema = new mongoose.Schema({
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: true,
    index: true
  },
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  provider: {
    type: String,
    enum: Object.values(PROVIDERS),
    required: true
  },
  providerTransactionId: {
    type: String,
    index: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  currency: {
    type: String,
    enum: CURRENCIES,
    default: 'EUR'
  },
  status: {
    type: String,
    enum: Object.values(TRANSACTION_STATUS),
    default: TRANSACTION_STATUS.PENDING,
    index: true
  },
  customer: {
    email: {
      type: String,
      required: true
    },
    name: String,
    phone: String
  },
  description: {
    type: String,
    trim: true
  },
  metadata: {
    type: Map,
    of: String
  },
  commission: {
    providerFee: {
      type: Number,
      default: 0
    },
    platformFee: {
      type: Number,
      default: 0
    },
    totalFee: {
      type: Number,
      default: 0
    }
  },
  netAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String
  },
  paymentDetails: {
    type: mongoose.Schema.Types.Mixed
  },
  refund: {
    isRefunded: {
      type: Boolean,
      default: false
    },
    refundedAmount: {
      type: Number,
      default: 0
    },
    refundDate: Date,
    refundReason: String
  },
  failureReason: String,
  ipAddress: String,
  userAgent: String,
  webhookDelivered: {
    type: Boolean,
    default: false
  },
  webhookAttempts: {
    type: Number,
    default: 0
  },
  completedAt: Date,
  failedAt: Date
}, {
  timestamps: true
});

// Indexes for queries
transactionSchema.index({ merchant: 1, status: 1 });
transactionSchema.index({ merchant: 1, createdAt: -1 });
transactionSchema.index({ provider: 1, status: 1 });
transactionSchema.index({ 'customer.email': 1 });
transactionSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate net amount
transactionSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('commission')) {
    this.commission.totalFee = this.commission.providerFee + this.commission.platformFee;
    this.netAmount = this.amount - this.commission.totalFee;
  }
  next();
});

// Methods
transactionSchema.methods.markAsCompleted = async function() {
  this.status = TRANSACTION_STATUS.COMPLETED;
  this.completedAt = new Date();
  return await this.save();
};

transactionSchema.methods.markAsFailed = async function(reason) {
  this.status = TRANSACTION_STATUS.FAILED;
  this.failureReason = reason;
  this.failedAt = new Date();
  return await this.save();
};

transactionSchema.methods.processRefund = async function(amount, reason) {
  if (this.status !== TRANSACTION_STATUS.COMPLETED) {
    throw new Error('Only completed transactions can be refunded');
  }

  this.refund.isRefunded = true;
  this.refund.refundedAmount = amount || this.amount;
  this.refund.refundDate = new Date();
  this.refund.refundReason = reason;
  this.status = TRANSACTION_STATUS.REFUNDED;

  return await this.save();
};

// Statics
transactionSchema.statics.generateTransactionId = function() {
  return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

transactionSchema.statics.getRevenueByPeriod = async function(merchantId, startDate, endDate) {
  return await this.aggregate([
    {
      $match: {
        merchant: merchantId,
        status: TRANSACTION_STATUS.COMPLETED,
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$netAmount' },
        totalTransactions: { $sum: 1 },
        avgTransactionAmount: { $avg: '$amount' }
      }
    }
  ]);
};

module.exports = mongoose.model('Transaction', transactionSchema);
