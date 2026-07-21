const { supabaseAdmin } = require('../config/supabase.config');
const {
  setCouponMetadata,
  getCouponMetadata,
  deleteCouponMetadata,
  hasUsedCoupon,
  recordCouponUsage
} = require('../utils/couponMetadata');

// Admin: Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, courseId, courseIds, message, isVisible } = req.body;
    const normalizedCode = String(code || '').trim().toUpperCase();
    const parsedDiscount = Number.parseFloat(discountPercent);
    const customMessage = String(message || '').trim();
    const visibleFlag = isVisible !== undefined ? Boolean(isVisible) : true;

    if (!normalizedCode || Number.isNaN(parsedDiscount)) {
      return res.status(400).json({ error: 'Code and valid discountPercent are required.' });
    }

    if (parsedDiscount <= 0 || parsedDiscount > 100) {
      return res.status(400).json({ error: 'Discount percent must be between 0.01 and 100.' });
    }

    // Normalize courseIds array
    let targetCourseIds = null;
    if (Array.isArray(courseIds) && courseIds.length > 0) {
      targetCourseIds = courseIds.map(id => String(id).trim()).filter(Boolean);
    } else if (Array.isArray(courseId) && courseId.length > 0) {
      targetCourseIds = courseId.map(id => String(id).trim()).filter(Boolean);
    } else if (courseId && typeof courseId === 'string' && courseId.trim() !== '') {
      targetCourseIds = [courseId.trim()];
    }

    // Prepare integer discount for PostgreSQL INTEGER column in Supabase
    const intDiscount = Math.round(parsedDiscount);

    const insertPayload = {
      code: normalizedCode,
      discount_percent: intDiscount,
      is_active: true
    };

    // 1. Insert into Supabase coupons table
    const { data: couponData, error: dbError } = await supabaseAdmin
      .from('coupons')
      .insert(insertPayload)
      .select('*')
      .single();

    if (dbError) {
      console.error('Supabase coupon insert error:', dbError);
      return res.status(400).json({ error: dbError.message || 'Database failed to save coupon.' });
    }

    // 2. Save full metadata (exact decimal percentage e.g. 60.77, courseIds restriction, custom message, visibility flag)
    setCouponMetadata(normalizedCode, {
      exactDiscountPercent: parsedDiscount,
      courseIds: targetCourseIds,
      courseId: targetCourseIds ? targetCourseIds[0] : null,
      message: customMessage || null,
      isVisible: visibleFlag
    });

    const responseCoupon = {
      ...couponData,
      _id: couponData?.id,
      code: normalizedCode,
      discountPercent: parsedDiscount,
      courseIds: targetCourseIds,
      courseId: targetCourseIds ? targetCourseIds[0] : null,
      message: customMessage || null,
      isVisible: visibleFlag,
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
      const discountPercent = (meta.exactDiscountPercent !== undefined && meta.exactDiscountPercent !== null)
        ? Number(meta.exactDiscountPercent)
        : Number(c.discount_percent);
      const isVisible = meta.isVisible !== undefined ? Boolean(meta.isVisible) : true;
      const courseIds = meta.courseIds || (meta.courseId ? [meta.courseId] : null);

      return {
        _id: c.id,
        id: c.id,
        code: c.code,
        discountPercent,
        courseIds,
        courseId: meta.courseId || c.course_id || null,
        message: meta.message || c.message || c.description || null,
        isVisible,
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
    const { code, courseId, userId, userEmail } = req.body;
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

    // Check if user has already used this coupon code
    if (userId || userEmail) {
      if (hasUsedCoupon(normalizedCode, userId, userEmail)) {
        return res.status(400).json({ error: 'You have already used this coupon code.' });
      }

      if (userId) {
        const isUserUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
        let resolvedUserId = userId;
        if (!isUserUuid) {
          const { data: u } = await supabaseAdmin.from('users').select('id').eq('mongo_id', userId).maybeSingle();
          if (u) resolvedUserId = u.id;
        }
        const { data: userPurchases } = await supabaseAdmin
          .from('purchases')
          .select('course_details')
          .eq('user_id', resolvedUserId);

        if (userPurchases && userPurchases.some(p => p.course_details?.coupon?.toUpperCase() === normalizedCode)) {
          return res.status(400).json({ error: 'You have already used this coupon code.' });
        }
      }
    }

    const meta = getCouponMetadata(normalizedCode) || {};
    const allowedCourseIds = meta.courseIds || (meta.courseId ? [meta.courseId] : (coupon.course_id ? [coupon.course_id] : null));
    const discountPercent = (meta.exactDiscountPercent !== undefined && meta.exactDiscountPercent !== null)
      ? Number(meta.exactDiscountPercent)
      : Number(coupon.discount_percent);
    const message = meta.message || coupon.message || coupon.description || null;

    // Check course-specific restriction
    if (allowedCourseIds && allowedCourseIds.length > 0) {
      if (!courseId || !allowedCourseIds.some(id => String(id).trim() === String(courseId).trim())) {
        return res.status(400).json({ error: 'The coupon is not applicable for the selected products!' });
      }
    }

    res.json({ 
      success: true, 
      discountPercent,
      code: coupon.code,
      courseIds: allowedCourseIds,
      courseId: allowedCourseIds ? allowedCourseIds[0] : null,
      message
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Student: Get public visible coupons for course details page
exports.getPublicVisibleCoupons = async (req, res) => {
  try {
    const { data: coupons, error } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const visibleCoupons = (coupons || [])
      .map(c => {
        const meta = getCouponMetadata(c.code) || {};
        const discountPercent = (meta.exactDiscountPercent !== undefined && meta.exactDiscountPercent !== null)
          ? Number(meta.exactDiscountPercent)
          : Number(c.discount_percent);
        const isVisible = meta.isVisible !== undefined ? Boolean(meta.isVisible) : true;
        const allowedCourseIds = meta.courseIds || (meta.courseId ? [meta.courseId] : (c.course_id ? [c.course_id] : null));

        return {
          code: c.code,
          discountPercent,
          courseIds: allowedCourseIds,
          courseId: meta.courseId || c.course_id || null,
          message: meta.message || c.message || c.description || null,
          isVisible
        };
      })
      .filter(c => c.isVisible !== false);

    res.json({ success: true, coupons: visibleCoupons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Admin: Toggle coupon visibility
exports.toggleCouponVisibility = async (req, res) => {
  try {
    const { code } = req.params;
    const { isVisible } = req.body;
    const normalizedCode = String(code || '').trim().toUpperCase();

    const meta = getCouponMetadata(normalizedCode) || {};
    const newVisible = isVisible !== undefined ? Boolean(isVisible) : !meta.isVisible;

    setCouponMetadata(normalizedCode, {
      ...meta,
      isVisible: newVisible
    });

    res.json({ success: true, isVisible: newVisible });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

