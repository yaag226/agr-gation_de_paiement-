module.exports = {
  // User roles
  ROLES: {
    ADMIN: 'admin',
    MERCHANT: 'merchant',
    CUSTOMER: 'customer'
  },

  // Transaction status
  TRANSACTION_STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    CANCELLED: 'cancelled'
  },

  // Payment providers
  PROVIDERS: {
    STRIPE: 'stripe',
    PAYPAL: 'paypal',
    WAVE: 'wave',
    ORANGE_MONEY: 'orange_money',
    MTN_MONEY: 'mtn_money',
    MOOV_MONEY: 'moov_money',
    CORIS_BANK: 'coris_bank',
    ECOBANK: 'ecobank'
  },

  // Currencies
  CURRENCIES: ['EUR', 'USD', 'XOF', 'GBP'],

  // Commission rates by provider
  PROVIDER_COMMISSION: {
    stripe: 0.029, // 2.9%
    paypal: 0.034, // 3.4%
    wave: 0.01,    // 1%
    orange_money: 0.015, // 1.5%
    mtn_money: 0.015,    // 1.5%
    moov_money: 0.015,   // 1.5%
    coris_bank: 0.02,    // 2%
    ecobank: 0.02        // 2%
  },

  // Default commission for platform
  PLATFORM_COMMISSION: 0.005, // 0.5%

  // Transaction limits
  LIMITS: {
    MIN_AMOUNT: 1,
    MAX_AMOUNT: process.env.MAX_TRANSACTION_AMOUNT || 1000000,
    DAILY_LIMIT: 100000
  }
};
