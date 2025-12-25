const express = require('express');
const router = express.Router();
const {
  getUsers,
  toggleUserStatus,
  getAllPayments,
  getDashboard,
  getGlobalStats
} = require('../controllers/adminController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roleCheck');

// Toutes les routes nécessitent une authentification et le rôle admin
router.use(protect);
router.use(authorize('admin'));

// Routes pour les administrateurs
router.get('/users', getUsers);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.get('/payments', getAllPayments);
router.get('/dashboard', getDashboard);
router.get('/stats', getGlobalStats);

module.exports = router;
