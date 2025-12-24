const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Route publique pour effectuer un paiement
router.post('/payer', paymentController.processPayment);

// Route pour récupérer l'historique des transactions d'un client
router.get('/historique', paymentController.getCustomerTransactions);

module.exports = router;
