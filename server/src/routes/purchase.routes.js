const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchase.controller');

// Purchase a course
router.post('/purchase', purchaseController.purchaseCourse);

// Get user's purchased courses
router.get('/user/:userId', purchaseController.getUserPurchases);

// Check if user has purchased a specific course
router.get('/check/:userId/:facultyName/:courseIndex', purchaseController.checkCoursePurchase);

// Get purchase statistics (admin only)
router.get('/stats', purchaseController.getPurchaseStats);

module.exports = router; 