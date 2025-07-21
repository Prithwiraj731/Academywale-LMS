const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');

// Admin endpoints
router.post('/api/admin/coupons', couponController.createCoupon);
router.get('/api/admin/coupons', couponController.getCoupons);
router.delete('/api/admin/coupons/:code', couponController.deleteCoupon);

// Student endpoint
router.post('/api/coupons/validate', couponController.validateCoupon);

module.exports = router; 