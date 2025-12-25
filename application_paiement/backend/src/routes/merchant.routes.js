const express = require('express');
const router = express.Router();
const {
  getPayments,
  getDashboard,
  getStats
} = require('../controllers/merchantController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roleCheck');

// Toutes les routes nécessitent une authentification et le rôle merchant
router.use(protect);
router.use(authorize('merchant'));

// Routes pour les marchands
router.get('/payments', getPayments);
router.get('/dashboard', getDashboard);
router.get('/stats', getStats);

module.exports = router;
