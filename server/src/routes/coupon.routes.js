const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');
const { requireAdminCookie } = require('../middlewares/auth.middleware');

// Admin endpoints
router.post('/api/admin/coupons', requireAdminCookie, couponController.createCoupon);
router.get('/api/admin/coupons', requireAdminCookie, couponController.getCoupons);
router.delete('/api/admin/coupons/:code', requireAdminCookie, couponController.deleteCoupon);

// Student endpoint
router.post('/api/coupons/validate', couponController.validateCoupon);

module.exports = router; 