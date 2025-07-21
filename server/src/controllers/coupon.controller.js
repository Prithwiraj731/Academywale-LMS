const Coupon = require('../model/Coupon.model');

// Admin: Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const { code, discountPercent } = req.body;
    if (!code || !discountPercent) return res.status(400).json({ error: 'Code and discountPercent are required.' });
    const coupon = new Coupon({ code, discountPercent });
    await coupon.save();
    res.status(201).json({ success: true, coupon });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin: Get all coupons
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Delete a coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const { code } = req.params;
    await Coupon.deleteOne({ code: code.toUpperCase() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Student: Validate a coupon code
exports.validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Coupon code required.' });
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ error: 'Invalid or expired coupon.' });
    res.json({ success: true, discountPercent: coupon.discountPercent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 