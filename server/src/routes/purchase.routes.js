const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchase.controller');
// Temporarily comment out the auth middleware
// const { isAuth } = require('../middleware/authMiddleware');

// Purchase a course (legacy route)
router.post('/purchase', purchaseController.purchaseCourse);

// UPI Purchase route - temporarily removed auth middleware
router.post('/upi-purchase', purchaseController.upiPurchase);

// Get user's purchased courses
router.get('/user/:userId', purchaseController.getUserPurchases);

// Check if user has purchased a specific course
router.get('/check/:userId/:facultyName/:courseIndex', purchaseController.checkCoursePurchase);

// Get purchase statistics (admin only)
router.get('/stats', purchaseController.getPurchaseStats);

module.exports = router; 