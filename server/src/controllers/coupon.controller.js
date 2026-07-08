const { supabaseAdmin } = require('../config/supabase.config');

// Admin: Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const { code, discountPercent } = req.body;
    if (!code || !discountPercent) return res.status(400).json({ error: 'Code and discountPercent are required.' });
    
    const { data: coupon, error } = await supabaseAdmin
      .from('coupons')
      .insert({
        code: code.toUpperCase().trim(),
        discount_percent: parseInt(discountPercent),
        is_active: true
      })
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, coupon });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin: Get all coupons
exports.getCoupons = async (req, res) => {
  try {
    const { data: coupons, error } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map database fields to front-end camelCase expectations if needed
    const formattedCoupons = coupons.map(c => ({
      _id: c.id,
      id: c.id,
      code: c.code,
      discountPercent: c.discount_percent,
      isActive: c.is_active,
      createdAt: c.created_at
    }));

    res.json({ success: true, coupons: formattedCoupons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Delete a coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const { code } = req.params;
    const { error } = await supabaseAdmin
      .from('coupons')
      .delete()
      .eq('code', code.toUpperCase());

    if (error) throw error;
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
    
    const { data: coupon, error } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    if (!coupon) return res.status(404).json({ error: 'Invalid or expired coupon.' });
    
    res.json({ success: true, discountPercent: coupon.discount_percent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};