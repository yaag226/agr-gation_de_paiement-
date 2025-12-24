const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    next();
  };
};

const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'merchant', 'customer'),
    phone: Joi.string(),
    businessName: Joi.string().when('role', {
      is: 'merchant',
      then: Joi.required()
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100),
    phone: Joi.string(),
    email: Joi.string().email()
  }),

  createTransaction: Joi.object({
    amount: Joi.number().positive().required(),
    currency: Joi.string().valid('EUR', 'USD', 'XOF', 'GBP').default('EUR'),
    provider: Joi.string().valid('stripe', 'paypal', 'wave', 'orange_money', 'mtn_money'),
    customerEmail: Joi.string().email().required(),
    customerName: Joi.string(),
    customerPhone: Joi.string(),
    description: Joi.string(),
    metadata: Joi.object()
  }),

  providerConfig: Joi.object({
    provider: Joi.string().valid('stripe', 'paypal', 'wave', 'orange_money', 'mtn_money').required(),
    apiKey: Joi.string().required(),
    secretKey: Joi.string().required(),
    webhookSecret: Joi.string(),
    isActive: Joi.boolean().default(true),
    priority: Joi.number().min(1).max(10).default(1)
  }),

  updateMerchant: Joi.object({
    businessName: Joi.string(),
    businessType: Joi.string().valid('individual', 'company', 'association'),
    description: Joi.string(),
    website: Joi.string().uri(),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string(),
      postalCode: Joi.string()
    }),
    settings: Joi.object({
      webhookUrl: Joi.string().uri(),
      notificationEmail: Joi.string().email(),
      currency: Joi.string().valid('EUR', 'USD', 'XOF', 'GBP'),
      autoRefund: Joi.boolean()
    })
  }),

  refund: Joi.object({
    amount: Joi.number().positive(),
    reason: Joi.string().required()
  })
};

module.exports = { validate, schemas };
