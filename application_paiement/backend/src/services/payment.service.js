const stripe = require('stripe');
const { PROVIDER_COMMISSION, PLATFORM_COMMISSION, TRANSACTION_STATUS } = require('../config/constants');

class PaymentService {
  async processPayment({ provider, providerConfig, amount, currency, customerEmail, customerName, description, transactionId }) {
    try {
      switch (provider) {
        case 'stripe':
          return await this.processStripePayment({ providerConfig, amount, currency, customerEmail, customerName, description, transactionId });
        case 'paypal':
          return await this.processPayPalPayment({ providerConfig, amount, currency, customerEmail, customerName, description, transactionId });
        case 'wave':
          return await this.processWavePayment({ providerConfig, amount, currency, customerEmail, customerName, description, transactionId });
        default:
          throw new Error(`Unsupported payment provider: ${provider}`);
      }
    } catch (error) {
      console.error(`Payment processing error (${provider}):`, error.message);
      throw error;
    }
  }

  async processStripePayment({ providerConfig, amount, currency, customerEmail, customerName, description, transactionId }) {
    try {
      const stripeClient = stripe(providerConfig.secretKey);

      const paymentIntent = await stripeClient.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        customer_email: customerEmail,
        description: description || `Payment for ${transactionId}`,
        metadata: {
          transactionId,
          customerName: customerName || ''
        }
      });

      const providerFee = amount * PROVIDER_COMMISSION.stripe;
      const platformFee = amount * PLATFORM_COMMISSION;

      return {
        providerTransactionId: paymentIntent.id,
        status: this.mapStripeStatus(paymentIntent.status),
        paymentUrl: paymentIntent.client_secret,
        paymentMethod: 'stripe',
        paymentDetails: {
          clientSecret: paymentIntent.client_secret,
          intentId: paymentIntent.id
        },
        commission: {
          providerFee,
          platformFee,
          totalFee: providerFee + platformFee
        }
      };
    } catch (error) {
      throw new Error(`Stripe payment failed: ${error.message}`);
    }
  }

  async processPayPalPayment({ providerConfig, amount, currency, customerEmail, customerName, description, transactionId }) {
    const providerFee = amount * PROVIDER_COMMISSION.paypal;
    const platformFee = amount * PLATFORM_COMMISSION;

    return {
      providerTransactionId: `PAYPAL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: TRANSACTION_STATUS.PENDING,
      paymentUrl: `https://www.sandbox.paypal.com/checkoutnow?token=MOCK_TOKEN`,
      paymentMethod: 'paypal',
      paymentDetails: {
        orderId: `ORDER_${Date.now()}`,
        approvalUrl: `https://www.sandbox.paypal.com/checkoutnow?token=MOCK_TOKEN`
      },
      commission: {
        providerFee,
        platformFee,
        totalFee: providerFee + platformFee
      }
    };
  }

  async processWavePayment({ providerConfig, amount, currency, customerEmail, customerName, description, transactionId }) {
    const providerFee = amount * PROVIDER_COMMISSION.wave;
    const platformFee = amount * PLATFORM_COMMISSION;

    return {
      providerTransactionId: `WAVE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: TRANSACTION_STATUS.PENDING,
      paymentUrl: `https://pay.wave.com/m/MOCK_PAYMENT_ID`,
      paymentMethod: 'wave',
      paymentDetails: {
        paymentId: `WAVE_PAY_${Date.now()}`,
        checkoutUrl: `https://pay.wave.com/m/MOCK_PAYMENT_ID`
      },
      commission: {
        providerFee,
        platformFee,
        totalFee: providerFee + platformFee
      }
    };
  }

  async processRefund({ provider, providerConfig, providerTransactionId, amount }) {
    try {
      switch (provider) {
        case 'stripe':
          return await this.processStripeRefund(providerConfig, providerTransactionId, amount);
        case 'paypal':
          return await this.processPayPalRefund(providerConfig, providerTransactionId, amount);
        case 'wave':
          return await this.processWaveRefund(providerConfig, providerTransactionId, amount);
        default:
          throw new Error(`Unsupported payment provider: ${provider}`);
      }
    } catch (error) {
      console.error(`Refund processing error (${provider}):`, error.message);
      throw error;
    }
  }

  async processStripeRefund(providerConfig, paymentIntentId, amount) {
    try {
      const stripeClient = stripe(providerConfig.secretKey);

      const refund = await stripeClient.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined
      });

      return {
        refundId: refund.id,
        status: 'refunded',
        amount: refund.amount / 100
      };
    } catch (error) {
      throw new Error(`Stripe refund failed: ${error.message}`);
    }
  }

  async processPayPalRefund(providerConfig, captureId, amount) {
    return {
      refundId: `PAYPAL_REFUND_${Date.now()}`,
      status: 'refunded',
      amount
    };
  }

  async processWaveRefund(providerConfig, transactionId, amount) {
    return {
      refundId: `WAVE_REFUND_${Date.now()}`,
      status: 'refunded',
      amount
    };
  }

  async handleWebhook(provider, payload, headers) {
    try {
      switch (provider) {
        case 'stripe':
          return await this.handleStripeWebhook(payload, headers);
        case 'paypal':
          return await this.handlePayPalWebhook(payload, headers);
        case 'wave':
          return await this.handleWaveWebhook(payload, headers);
        default:
          throw new Error(`Unsupported webhook provider: ${provider}`);
      }
    } catch (error) {
      console.error(`Webhook handling error (${provider}):`, error.message);
      throw error;
    }
  }

  async handleStripeWebhook(payload, headers) {
    const sig = headers['stripe-signature'];

    const event = payload;

    if (event.type === 'payment_intent.succeeded') {
      return {
        transactionId: event.data.object.id,
        status: TRANSACTION_STATUS.COMPLETED
      };
    } else if (event.type === 'payment_intent.payment_failed') {
      return {
        transactionId: event.data.object.id,
        status: TRANSACTION_STATUS.FAILED,
        failureReason: event.data.object.last_payment_error?.message
      };
    }

    return { received: true };
  }

  async handlePayPalWebhook(payload, headers) {
    if (payload.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      return {
        transactionId: payload.resource.id,
        status: TRANSACTION_STATUS.COMPLETED
      };
    } else if (payload.event_type === 'PAYMENT.CAPTURE.DENIED') {
      return {
        transactionId: payload.resource.id,
        status: TRANSACTION_STATUS.FAILED
      };
    }

    return { received: true };
  }

  async handleWaveWebhook(payload, headers) {
    if (payload.status === 'completed') {
      return {
        transactionId: payload.transaction_id,
        status: TRANSACTION_STATUS.COMPLETED
      };
    } else if (payload.status === 'failed') {
      return {
        transactionId: payload.transaction_id,
        status: TRANSACTION_STATUS.FAILED
      };
    }

    return { received: true };
  }

  mapStripeStatus(stripeStatus) {
    const statusMap = {
      'requires_payment_method': TRANSACTION_STATUS.PENDING,
      'requires_confirmation': TRANSACTION_STATUS.PENDING,
      'requires_action': TRANSACTION_STATUS.PENDING,
      'processing': TRANSACTION_STATUS.PROCESSING,
      'succeeded': TRANSACTION_STATUS.COMPLETED,
      'canceled': TRANSACTION_STATUS.CANCELLED
    };

    return statusMap[stripeStatus] || TRANSACTION_STATUS.PENDING;
  }
}

module.exports = new PaymentService();
