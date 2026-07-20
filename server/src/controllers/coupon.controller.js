const { supabaseAdmin } = require('../config/supabase.config');

// Admin: Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, courseId, message } = req.body;
    const normalizedCode = String(code || '').trim().toUpperCase();
    const parsedDiscount = Number.parseFloat(discountPercent);
    const customMessage = String(message || '').trim();

    if (!normalizedCode || Number.isNaN(parsedDiscount)) {
      return res.status(400).json({ error: 'Code and valid discountPercent are required.' });
    }

    if (parsedDiscount <= 0 || parsedDiscount > 100) {
      return res.status(400).json({ error: 'Discount percent must be between 0.01 and 100.' });
    }
    
    const insertPayload = {
      code: normalizedCode,
      discount_percent: parsedDiscount,
      is_active: true
    };

    if (customMessage) {
      insertPayload.message = customMessage;
    }

    if (courseId && String(courseId).trim() !== '') {
      insertPayload.course_id = String(courseId).trim();
    }

    let couponData = null;
    let dbError = null;

    try {
      const result = await supabaseAdmin
        .from('coupons')
        .insert(insertPayload)
        .select('*')
        .single();
      couponData = result.data;
      dbError = result.error;
    } catch (err) {
      dbError = err;
    }

    // Fallback if course_id or message column doesn't exist yet in Supabase schema
    if (dbError && (
      dbError.message?.includes('course_id') || 
      dbError.details?.includes('course_id') ||
      dbError.message?.includes('message') || 
      dbError.details?.includes('message')
    )) {
      delete insertPayload.course_id;
      delete insertPayload.message;
      const fallbackResult = await supabaseAdmin
        .from('coupons')
        .insert(insertPayload)
        .select('*')
        .single();
      couponData = fallbackResult.data;
      dbError = fallbackResult.error;
    }

    if (dbError) throw dbError;

    res.status(201).json({ success: true, coupon: couponData });
  } catch (err) {
    console.error('Error creating coupon:', err);
    res.status(400).json({ error: err.message || 'Failed to create coupon' });
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

    const formattedCoupons = (coupons || []).map(c => ({
      _id: c.id,
      id: c.id,
      code: c.code,
      discountPercent: Number(c.discount_percent),
      courseId: c.course_id || null,
      message: c.message || c.description || null,
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
    const { code, courseId } = req.body;
    const normalizedCode = String(code || '').trim().toUpperCase();
    if (!normalizedCode) return res.status(400).json({ error: 'Coupon code required.' });
    
    const { data: coupon, error } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .eq('code', normalizedCode)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    if (!coupon) return res.status(404).json({ error: 'Invalid or expired coupon code.' });

    // Check course-specific restriction if coupon has a course_id set
    if (coupon.course_id) {
      if (!courseId || String(coupon.course_id).trim() !== String(courseId).trim()) {
        return res.status(400).json({ error: 'This coupon code is not valid for this course.' });
      }
    }
    
    res.json({ 
      success: true, 
      discountPercent: Number(coupon.discount_percent),
      code: coupon.code,
      courseId: coupon.course_id || null,
      message: coupon.message || coupon.description || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
