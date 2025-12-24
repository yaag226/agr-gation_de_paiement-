const mongoose = require('mongoose');

// Modèle pour les paiements agrégés (plusieurs factures en une transaction)
const aggregatedPaymentSchema = new mongoose.Schema({
  aggregationId: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    phone: {
      type: String,
      required: true,
      index: true
    },
    email: String,
    name: String
  },
  payments: [{
    description: String,
    amount: Number,
    reference: String,
    category: {
      type: String,
      enum: ['facture_eau', 'facture_electricite', 'internet', 'telephone', 'achat', 'autre']
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  provider: {
    type: String,
    required: true,
    enum: ['orange_money', 'mtn_money']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'partial'],
    default: 'pending'
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  // Logs de traçage
  activityLog: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    action: String,
    details: String,
    status: String
  }],
  metadata: {
    ipAddress: String,
    userAgent: String,
    location: String
  },
  completedAt: Date,
  failedAt: Date
}, {
  timestamps: true
});

// Méthode pour ajouter un log d'activité
aggregatedPaymentSchema.methods.addLog = function(action, details, status) {
  this.activityLog.push({
    action,
    details,
    status,
    timestamp: new Date()
  });
  return this.save();
};

// Générer un ID d'agrégation
aggregatedPaymentSchema.statics.generateAggregationId = function() {
  return `AGG_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

module.exports = mongoose.model('AggregatedPayment', aggregatedPaymentSchema);
