const mongoose = require('mongoose');
const { PROVIDERS } = require('../config/constants');

const providerConfigSchema = new mongoose.Schema({
  provider: {
    type: String,
    enum: Object.values(PROVIDERS),
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  apiKey: {
    type: String,
    required: true
  },
  secretKey: {
    type: String,
    required: true
  },
  webhookSecret: String,
  priority: {
    type: Number,
    default: 1
  },
  commission: {
    type: Number,
    default: 0
  }
}, { _id: false });

const merchantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true
  },
  businessType: {
    type: String,
    enum: ['individual', 'company', 'association'],
    default: 'individual'
  },
  description: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  taxId: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  providers: [providerConfigSchema],
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  totalTransactions: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  routingRules: {
    preferredProvider: {
      type: String,
      enum: [...Object.values(PROVIDERS), null],
      default: null
    },
    fallbackEnabled: {
      type: Boolean,
      default: true
    },
    minAmountByProvider: {
      type: Map,
      of: Number
    }
  },
  settings: {
    webhookUrl: String,
    notificationEmail: String,
    currency: {
      type: String,
      default: 'EUR'
    },
    autoRefund: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Indexes
merchantSchema.index({ user: 1 });
merchantSchema.index({ businessName: 1 });
merchantSchema.index({ isActive: 1, isVerified: 1 });

// Methods
merchantSchema.methods.getActiveProviders = function() {
  return this.providers.filter(p => p.isActive);
};

merchantSchema.methods.getProviderConfig = function(providerName) {
  return this.providers.find(p => p.provider === providerName && p.isActive);
};

merchantSchema.methods.updateBalance = async function(amount) {
  this.balance += amount;
  return await this.save();
};

module.exports = mongoose.model('Merchant', merchantSchema);
