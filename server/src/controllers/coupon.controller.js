const { supabaseAdmin } = require('../config/supabase.config');
const {
  setCouponMetadata,
  getCouponMetadata,
  deleteCouponMetadata
} = require('../utils/couponMetadata');

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

    // 1. Prepare Supabase payload using integer rounding as fail-safe for integer DB schema
    const isFloat = !Number.isInteger(parsedDiscount);
    const intDiscount = isFloat ? Math.round(parsedDiscount) : parsedDiscount;

    const insertPayload = {
      code: normalizedCode,
      discount_percent: intDiscount,
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

    // First try inserting exact float in case DB column type is numeric
    try {
      const result = await supabaseAdmin
        .from('coupons')
        .insert({ ...insertPayload, discount_percent: parsedDiscount })
        .select('*')
        .single();
      if (!result.error) {
        couponData = result.data;
      } else {
        dbError = result.error;
      }
    } catch (err) {
      dbError = err;
    }

    // If integer syntax error or column missing, fallback to inserting integer payload
    if (dbError) {
      const fallbackResult = await supabaseAdmin
        .from('coupons')
        .insert(insertPayload)
        .select('*')
        .single();
      
      if (fallbackResult.error && (
        fallbackResult.error.message?.includes('course_id') || 
        fallbackResult.error.details?.includes('course_id') ||
        fallbackResult.error.message?.includes('message') || 
        fallbackResult.error.details?.includes('message')
      )) {
        delete insertPayload.course_id;
        delete insertPayload.message;
        const basicResult = await supabaseAdmin
          .from('coupons')
          .insert(insertPayload)
          .select('*')
          .single();
        couponData = basicResult.data;
        dbError = basicResult.error;
      } else {
        couponData = fallbackResult.data;
        dbError = fallbackResult.error;
      }
    }

    if (dbError) throw dbError;

    // 2. Persist full metadata (exact decimal discount, courseId, message)
    setCouponMetadata(normalizedCode, {
      exactDiscountPercent: parsedDiscount,
      courseId: courseId || null,
      message: customMessage || null
    });

    const responseCoupon = {
      ...couponData,
      _id: couponData.id,
      code: normalizedCode,
      discountPercent: parsedDiscount,
      courseId: courseId || null,
      message: customMessage || null,
      isActive: true
    };

    res.status(201).json({ success: true, coupon: responseCoupon });
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

    const formattedCoupons = (coupons || []).map(c => {
      const meta = getCouponMetadata(c.code) || {};
      const discountPercent = meta.exactDiscountPercent !== undefined && meta.exactDiscountPercent !== null
        ? Number(meta.exactDiscountPercent)
        : Number(c.discount_percent);

      return {
        _id: c.id,
        id: c.id,
        code: c.code,
        discountPercent,
        courseId: meta.courseId || c.course_id || null,
        message: meta.message || c.message || c.description || null,
        isActive: c.is_active,
        createdAt: c.created_at
      };
    });

    res.json({ success: true, coupons: formattedCoupons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Delete a coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const { code } = req.params;
    const normalizedCode = String(code || '').trim().toUpperCase();

    const { error } = await supabaseAdmin
      .from('coupons')
      .delete()
      .eq('code', normalizedCode);

    if (error) throw error;

    deleteCouponMetadata(normalizedCode);

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

    const meta = getCouponMetadata(normalizedCode) || {};
    const effectiveCourseId = meta.courseId || coupon.course_id || null;
    const discountPercent = meta.exactDiscountPercent !== undefined && meta.exactDiscountPercent !== null
      ? Number(meta.exactDiscountPercent)
      : Number(coupon.discount_percent);
    const message = meta.message || coupon.message || coupon.description || null;

    // Check course-specific restriction if coupon has a course_id set
    if (effectiveCourseId) {
      if (!courseId || String(effectiveCourseId).trim() !== String(courseId).trim()) {
        return res.status(400).json({ error: 'This coupon code is not valid for this course.' });
      }
    }

    res.json({ 
      success: true, 
      discountPercent,
      code: coupon.code,
      courseId: effectiveCourseId,
      message
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
