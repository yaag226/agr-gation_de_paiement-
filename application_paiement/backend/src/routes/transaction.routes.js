const express = require('express');
const router = express.Router();
const {
  createPayment,
  getPayments,
  getStats,
  getMerchants
} = require('../controllers/clientController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roleCheck');

// Toutes les routes nécessitent une authentification et le rôle client
router.use(protect);
router.use(authorize('client'));

// Routes pour les clients
router.post('/payments', createPayment);
router.get('/payments', getPayments);
router.get('/stats', getStats);
router.get('/merchants', getMerchants);

module.exports = router;
