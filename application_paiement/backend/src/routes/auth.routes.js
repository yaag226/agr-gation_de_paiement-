const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate, schemas } = require('../middlewares/validation.middleware');

router.post('/register', validate(schemas.register), authController.register);
router.post('/login', validate(schemas.login), authController.login);

router.use(protect);

router.get('/me', authController.getMe);
router.put('/update-profile', validate(schemas.updateProfile), authController.updateProfile);
router.put('/change-password', authController.changePassword);

module.exports = router;
