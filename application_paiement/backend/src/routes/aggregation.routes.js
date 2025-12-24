const express = require('express');
const router = express.Router();
const aggregationController = require('../controllers/aggregation.controller');

// Routes publiques pour l'agrégation de paiements

// Créer une agrégation de paiements
router.post('/create', aggregationController.createAggregatedPayment);

// Récupérer une agrégation spécifique
router.get('/:id', aggregationController.getAggregation);

// Récupérer les logs d'une agrégation
router.get('/:id/logs', aggregationController.getAggregationLogs);

// Récupérer l'historique des agrégations d'un client
router.get('/customer/history', aggregationController.getCustomerAggregations);

module.exports = router;
