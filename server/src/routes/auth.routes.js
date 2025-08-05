const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public routes
router.post('/signup', authController.signup);
router.post('/register', authController.register); // Legacy compatibility
router.post('/login', authController.login);

// Protected routes
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);

module.exports = router; 