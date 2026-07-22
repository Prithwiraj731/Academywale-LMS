const express = require('express');
const cors = require('cors');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');
const { requireAdminCookie } = require('../middlewares/auth.middleware');

// Preflight options handler
router.options('/api/admin/coupons/:code/visibility', cors());

// Admin endpoints
router.post('/api/admin/coupons', requireAdminCookie, couponController.createCoupon);
router.get('/api/admin/coupons', requireAdminCookie, couponController.getCoupons);
router.put('/api/admin/coupons/:code/visibility', requireAdminCookie, couponController.toggleCouponVisibility);
router.post('/api/admin/coupons/:code/visibility', requireAdminCookie, couponController.toggleCouponVisibility);
router.patch('/api/admin/coupons/:code/visibility', requireAdminCookie, couponController.toggleCouponVisibility);
router.delete('/api/admin/coupons/:code', requireAdminCookie, couponController.deleteCoupon);

// Student endpoints
router.post('/api/coupons/validate', couponController.validateCoupon);
router.get('/api/coupons/public', couponController.getPublicVisibleCoupons);

module.exports = router;