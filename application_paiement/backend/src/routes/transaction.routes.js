const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { validate, schemas } = require('../middlewares/validation.middleware');

router.post('/webhooks/:provider', transactionController.handleWebhook);

router.use(protect);

router.post('/initiate', authorize('merchant', 'admin'), validate(schemas.createTransaction), transactionController.initiateTransaction);

router.get('/', authorize('merchant', 'admin'), transactionController.getTransactions);

router.get('/:id', transactionController.getTransaction);

router.post('/:id/refund', authorize('merchant', 'admin'), validate(schemas.refund), transactionController.refundTransaction);

module.exports = router;
