const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Le montant est requis'],
    min: [100, 'Le montant minimum est 100 FCFA']
  },
  currency: {
    type: String,
    default: 'FCFA',
    enum: ['FCFA', 'EUR', 'USD']
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Orange Money', 'Moov Money', 'Wave', 'Coris Money', 'Carte Bancaire']
  },
  status: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  description: {
    type: String,
    trim: true,
    default: 'Paiement'
  },
  // Détails de simulation
  simulationDetails: {
    processingTime: Number,
    failureReason: String,
    processedAt: Date
  },
  // Frais de transaction (1.5%)
  fees: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number
  }
}, {
  timestamps: true
});

// Génération automatique du transactionId
paymentSchema.pre('save', function(next) {
  if (!this.transactionId) {
    const prefix = 'BF' + new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    this.transactionId = `${prefix}${Date.now()}${random}`;
  }
  
  // Calculer les frais (1.5%)
  if (!this.fees) {
    this.fees = Math.round(this.amount * 0.015);
    this.netAmount = this.amount - this.fees;
  }
  
  next();
});

// Index pour améliorer les performances
paymentSchema.index({ client: 1, createdAt: -1 });
paymentSchema.index({ merchant: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ transactionId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);