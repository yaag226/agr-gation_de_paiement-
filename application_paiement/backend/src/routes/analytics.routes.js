const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.use(protect);
router.use(authorize('merchant', 'admin'));

router.get('/dashboard', analyticsController.getDashboard);
router.get('/revenue', analyticsController.getRevenue);
router.get('/providers', analyticsController.getProviderStats);
router.get('/export', analyticsController.exportData);

module.exports = router;
