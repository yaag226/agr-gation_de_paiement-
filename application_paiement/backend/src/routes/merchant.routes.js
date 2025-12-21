const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchant.controller');
const { protect, authorize, isMerchantOwner } = require('../middlewares/auth.middleware');
const { validate, schemas } = require('../middlewares/validation.middleware');

router.use(protect);

router.get('/', authorize('admin'), merchantController.getAllMerchants);

router.get('/stats', authorize('merchant'), merchantController.getMerchantStats);

router.get('/:id', merchantController.getMerchant);

router.put('/:id', isMerchantOwner, validate(schemas.updateMerchant), merchantController.updateMerchant);

router.post('/provider-config', authorize('merchant'), validate(schemas.providerConfig), merchantController.addProviderConfig);

router.put('/provider-config/:provider', authorize('merchant'), merchantController.updateProviderConfig);

router.delete('/provider-config/:provider', authorize('merchant'), merchantController.removeProviderConfig);

module.exports = router;
