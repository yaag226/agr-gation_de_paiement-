const express = require('express');
const router = express.Router();
const { createPayment } = require('../controllers/clientController');
const { protect } = require('../middlewares/auth');

// Route générique pour créer un paiement (accessible par les clients)
router.post('/', protect, createPayment);

module.exports = router;
