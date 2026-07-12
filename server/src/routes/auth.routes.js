const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

// Test route
router.get('/test', (req, res) => {
  console.log('🧪 Test route hit');
  res.json({ message: 'Auth routes working' });
});

// Public routes
router.post('/signup', authController.signup);
router.post('/register', authController.register); // Legacy compatibility
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);

// Protected routes
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);

module.exports = router; 