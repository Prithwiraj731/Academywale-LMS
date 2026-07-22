const { supabaseAdmin } = require('../config/supabase.config');
const { sendPurchaseInvoiceEmail, sendAdminNotificationEmail } = require('../utils/email.utils');
const { recordCouponUsage } = require('../utils/couponMetadata');

// Generate unique transaction ID
const generateTransactionId = () => {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// @desc    Purchase a course
// @route   POST /api/purchase
// @access  Private
exports.purchaseCourse = async (req, res) => {
  try {
    const { userId, facultyName, courseIndex, paymentMethod = 'online', amount } = req.body;

    if (!userId || !facultyName || courseIndex === undefined || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, facultyName, courseIndex, amount'
      });
    }

    // Resolve user (matches UUID or mongo_id)
    const isUserUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    let userQuery = isUserUuid ? 'id' : 'mongo_id';
    
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq(userQuery, userId)
      .maybeSingle();

    if (userError || !user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Resolve faculty
    const { data: faculty, error: facError } = await supabaseAdmin
      .from('faculties')
      .select('*')
      .eq('slug', facultyName)
      .maybeSingle();

    if (facError || !faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    // Fetch courses for this faculty to resolve the course index
    const { data: courses, error: courseFetchError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('faculty_id', faculty.id)
      .order('created_at', { ascending: true });

    if (courseFetchError) throw courseFetchError;

    const idx = parseInt(courseIndex);
    if (!courses || idx < 0 || idx >= courses.length) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const targetCourse = courses[idx];

    // Check if user already purchased this course
    const { data: existingPurchase, error: checkError } = await supabaseAdmin
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', targetCourse.id)
      .eq('is_active', true)
      .maybeSingle();

    if (checkError) throw checkError;
    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: 'You have already purchased this course'
      });
    }

    const transactionId = generateTransactionId();

    // Create purchase record
    const { data: purchase, error: insertError } = await supabaseAdmin
      .from('purchases')
      .insert({
        user_id: user.id,
        course_id: targetCourse.id,
        faculty_id: faculty.id,
        course_details: {
          title: targetCourse.title,
          subject: targetCourse.subject,
          mode: targetCourse.mode_attempt_pricing?.[0]?.mode || '',
          validity: targetCourse.mode_attempt_pricing?.[0]?.attempt || '',
          facultyName: targetCourse.faculty_name
        },
        payment_method: paymentMethod,
        amount: Number(amount),
        transaction_id: transactionId,
        payment_status: 'completed', // Assume payment is successful
        access_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // Default 1 year expiry
      })
      .select('*')
      .single();

    if (insertError) throw insertError;

    // Send invoice email to student
    try {
      if (user && user.email) {
        await sendPurchaseInvoiceEmail(
          user.email,
          user.name,
          purchase.course_details,
          purchase.transaction_id,
          purchase.purchase_date,
          amount
        );
      }
    } catch (emailErr) {
      console.error('Failed to send invoice email:', emailErr);
    }

    res.status(201).json({
      success: true,
      message: 'Course purchased successfully!',
      purchase: {
        id: purchase.id,
        transactionId: purchase.transaction_id,
        courseDetails: purchase.course_details,
        purchaseDate: purchase.purchase_date,
        accessExpiry: purchase.access_expiry
      }
    });

  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to purchase course',
      error: error.message
    });
  }
};

// @desc    Get user's purchased courses
// @route   GET /api/purchase/user/:userId
// @access  Private
exports.getUserPurchases = async (req, res) => {
  try {
    const { userId } = req.params;

    let targetUserId = userId;
    const isUserUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    let userQuery = isUserUuid ? 'id' : 'mongo_id';
    
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq(userQuery, userId)
      .maybeSingle();

    if (user && user.id) {
      targetUserId = user.id;
    }

    const { data: purchases, error } = await supabaseAdmin
      .from('purchases')
      .select('*, faculties(first_name, last_name)')
      .or(`user_id.eq.${targetUserId},user_id.eq.${userId}`)
      .eq('is_active', true)
      .order('purchase_date', { ascending: false });

    if (error) throw error;

    // Collect course_ids to look up poster_url from Supabase courses table
    const courseIds = (purchases || []).map(p => p.course_id).filter(Boolean);
    let courseMap = {};
    if (courseIds.length > 0) {
      const { data: matchedCourses } = await supabaseAdmin
        .from('courses')
        .select('id, poster_url, poster_public_id, title, subject, faculty_name')
        .in('id', courseIds);

      (matchedCourses || []).forEach(c => {
        courseMap[c.id] = c;
      });
    }

    // Also fetch all courses for fallback matching by subject/title
    const { data: allCourses } = await supabaseAdmin
      .from('courses')
      .select('id, poster_url, poster_public_id, title, subject, faculty_name');

    const formattedPurchases = (purchases || []).map(p => {
      const fName = p.faculties ? `${p.faculties.first_name} ${p.faculties.last_name || ''}`.trim() : (p.course_details?.facultyName || 'Faculty');
      const cDetails = p.course_details || {};
      let matchedCourse = courseMap[p.course_id];

      if (!matchedCourse && allCourses) {
        matchedCourse = allCourses.find(c => 
          (c.subject && cDetails.subject && c.subject.toLowerCase() === cDetails.subject.toLowerCase()) ||
          (c.title && cDetails.title && c.title.toLowerCase() === cDetails.title.toLowerCase())
        );
      }

      const posterUrl = cDetails.posterUrl || 
                        cDetails.poster_url || 
                        cDetails.poster || 
                        matchedCourse?.poster_url || 
                        matchedCourse?.posterUrl || 
                        matchedCourse?.poster_public_id || 
                        '';

      const enrichedCourseDetails = {
        ...cDetails,
        posterUrl,
        poster_url: posterUrl,
        poster: posterUrl,
        title: cDetails.title || matchedCourse?.title || matchedCourse?.subject || 'Course',
        subject: cDetails.subject || matchedCourse?.subject || matchedCourse?.title || 'Course',
        facultyName: fName || matchedCourse?.faculty_name || 'Faculty'
      };

      return {
        id: p.id,
        transactionId: p.transaction_id,
        courseDetails: enrichedCourseDetails,
        course_details: enrichedCourseDetails,
        purchaseDate: p.purchase_date,
        accessExpiry: p.access_expiry,
        paymentStatus: p.payment_status || 'completed',
        amount: p.amount,
        facultyName: fName,
        isExpired: new Date() > new Date(p.access_expiry)
      };
    });

    res.status(200).json({
      success: true,
      purchases: formattedPurchases
    });

  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchases',
      error: error.message
    });
  }
};

// @desc    Check if user has purchased a specific course
// @route   GET /api/purchase/check/:userId/:facultyName/:courseIndex
// @access  Private
exports.checkCoursePurchase = async (req, res) => {
  try {
    const { userId, facultyName, courseIndex } = req.params;

    // Resolve user UUID
    const isUserUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    let userQuery = isUserUuid ? 'id' : 'mongo_id';
    
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq(userQuery, userId)
      .maybeSingle();

    if (userError || !user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Resolve faculty
    const { data: faculty, error: facError } = await supabaseAdmin
      .from('faculties')
      .select('id')
      .eq('slug', facultyName)
      .maybeSingle();

    if (facError || !faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    // Fetch courses for this faculty
    const { data: courses, error: courseFetchError } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('faculty_id', faculty.id)
      .order('created_at', { ascending: true });

    if (courseFetchError) throw courseFetchError;

    const idx = parseInt(courseIndex);
    if (!courses || idx < 0 || idx >= courses.length) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const targetCourse = courses[idx];

    // Check purchase record
    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from('purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', targetCourse.id)
      .eq('is_active', true)
      .eq('payment_status', 'completed')
      .maybeSingle();

    if (purchaseError) throw purchaseError;

    if (!purchase) {
      return res.status(200).json({
        success: true,
        hasPurchased: false
      });
    }

    const isExpired = new Date() > new Date(purchase.access_expiry);

    res.status(200).json({
      success: true,
      hasPurchased: true,
      isExpired,
      purchase: {
        id: purchase.id,
        transactionId: purchase.transaction_id,
        purchaseDate: purchase.purchase_date,
        accessExpiry: purchase.access_expiry
      }
    });

  } catch (error) {
    console.error('Check purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check purchase status',
      error: error.message
    });
  }
};

// @desc    Purchase a course via UPI
// @route   POST /api/purchase/upi-purchase
// @access  Private
exports.upiPurchase = async (req, res) => {
  try {
    const { userId, courseId, transactionId, amount, userDetails, courseDetails, coupon, discountPercent } = req.body;

    if (!userId || !courseId || !transactionId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, courseId, transactionId, amount'
      });
    }

    // Resolve user UUID
    const isUserUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    let userQuery = isUserUuid ? 'id' : 'mongo_id';
    
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq(userQuery, userId)
      .maybeSingle();

    if (userError || !user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Resolve course UUID
    const isCourseUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId);
    let courseQuery = isCourseUuid ? 'id' : 'mongo_id';

    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq(courseQuery, courseId)
      .maybeSingle();

    if (courseError || !course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if user already purchased this course
    const { data: existingPurchase, error: checkError } = await supabaseAdmin
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .eq('is_active', true)
      .maybeSingle();

    if (checkError) throw checkError;
    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: 'You have already purchased this course'
      });
    }

    // Create purchase record for standalone course
    const { data: purchase, error: insertError } = await supabaseAdmin
      .from('purchases')
      .insert({
        user_id: user.id,
        course_id: course.id,
        faculty_id: course.faculty_id,
        payment_method: 'UPI',
        amount: Number(amount),
        transaction_id: transactionId,
        payment_status: 'pending_verification', // UPI payments need verification
        course_details: {
          title: course.title || course.subject,
          subject: course.subject,
          poster_url: course.poster_url || course.posterUrl || courseDetails?.posterUrl || '',
          posterUrl: course.poster_url || course.posterUrl || courseDetails?.posterUrl || '',
          mode: courseDetails?.mode || '',
          validity: courseDetails?.validity || '',
          attempt: courseDetails?.attempt || '',
          facultyName: course.faculty_name,
          coupon: coupon || courseDetails?.coupon || '',
          discountPercent: Number(discountPercent || courseDetails?.discountPercent || 0)
        },
        access_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      })
      .select('*')
      .single();

    if (insertError) throw insertError;

    if (coupon || courseDetails?.coupon) {
      recordCouponUsage(coupon || courseDetails?.coupon, user.id, user.email);
    }

    // Send notification email to admin
    try {
      await sendAdminNotificationEmail({
        type: 'purchase',
        userDetails: {
          fullName: userDetails?.name || user?.name || 'Student',
          email: userDetails?.email || user?.email,
          phone: userDetails?.phone || user?.mobile || '',
          address: userDetails?.address
        },
        courseDetails: {
          courseName: course.title || course.subject,
          mode: courseDetails?.mode || '',
          validity: courseDetails?.validity || '',
          attempt: courseDetails?.attempt || ''
        },
        transactionId,
        amount
      });
    } catch (emailErr) {
      console.error('Failed to send notification email:', emailErr);
    }

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully! Your course will be activated after payment verification.',
      purchase: {
        id: purchase.id,
        transactionId,
        status: 'pending_verification'
      }
    });

  } catch (error) {
    console.error('UPI Purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing UPI purchase'
    });
  }
};

// @desc    Purchase multiple courses via Cart with UPI
// @route   POST /api/purchase/cart-purchase
// @access  Private
exports.cartPurchase = async (req, res) => {
  try {
    const { userId, cartItems, transactionId, amount, userDetails, coupon, discountPercent } = req.body;

    if (!userId || !Array.isArray(cartItems) || cartItems.length === 0 || !transactionId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, cartItems, transactionId, amount'
      });
    }

    // Resolve user UUID
    const isUserUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    let userQuery = isUserUuid ? 'id' : 'mongo_id';
    
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq(userQuery, userId)
      .maybeSingle();

    if (userError || !user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const createdPurchases = [];
    const skippedPurchases = [];
    const couponDiscount = Math.max(0, Math.min(100, Number(discountPercent || 0)));

    // Process each item in the cart
    for (let idx = 0; idx < cartItems.length; idx++) {
      const item = cartItems[idx];
      const courseId = item.id;

      // Resolve course UUID
      const isCourseUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId);
      let courseQuery = isCourseUuid ? 'id' : 'mongo_id';

      const { data: course, error: courseError } = await supabaseAdmin
        .from('courses')
        .select('*')
        .eq(courseQuery, courseId)
        .maybeSingle();

      if (courseError || !course) {
        skippedPurchases.push({ title: item.subject || 'Unknown', reason: 'Course not found' });
        continue;
      }

      // Check if user already purchased this course
      const { data: existingPurchase, error: checkError } = await supabaseAdmin
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .eq('is_active', true)
        .maybeSingle();

      if (!checkError && existingPurchase) {
        skippedPurchases.push({ title: course.subject, reason: 'Already purchased' });
        continue;
      }

      // Unique transaction ID per row to bypass unique constraint
      const uniqueTxnId = `${transactionId}_${idx + 1}`;

      const itemBaseAmount = Number(item.sellingPrice || item.price || 0);
      const itemPayableAmount = Math.max(0, Math.round(itemBaseAmount * (1 - couponDiscount / 100)));

      // Create purchase record
      const { data: purchase, error: insertError } = await supabaseAdmin
        .from('purchases')
        .insert({
          user_id: user.id,
          course_id: course.id,
          faculty_id: course.faculty_id,
          payment_method: 'UPI',
          amount: itemPayableAmount,
          transaction_id: uniqueTxnId,
          payment_status: 'pending_verification',
          course_details: {
            title: course.title || course.subject,
            subject: course.subject,
            poster_url: course.poster_url || course.posterUrl || item.posterUrl || '',
            posterUrl: course.poster_url || course.posterUrl || item.posterUrl || '',
            mode: item.mode || '',
            validity: item.attempt || item.validity || '',
            facultyName: course.faculty_name,
            coupon: coupon || '',
            discountPercent: couponDiscount
          },
          access_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        })
        .select('*')
        .single();

      if (!insertError && purchase) {
        createdPurchases.push(purchase);
      } else {
        console.error('Error inserting cart purchase item:', insertError);
        skippedPurchases.push({ title: course.subject, reason: insertError?.message || 'Failed to save' });
      }
    }

    if (createdPurchases.length > 0 && coupon) {
      recordCouponUsage(coupon, user.id, user.email);
    }


    if (createdPurchases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No new courses could be purchased. They may already be active in your dashboard.',
        skipped: skippedPurchases
      });
    }

    // Send consolidated notification email to admin
    try {
      await sendAdminNotificationEmail({
        type: 'purchase',
        userDetails: {
          fullName: userDetails?.name || user?.name || 'Student',
          email: userDetails?.email || user?.email,
          phone: userDetails?.phone || user?.mobile || '',
          address: userDetails?.address
        },
        cartItems: createdPurchases.map(p => ({
          title: p.course_details.title || p.course_details.subject,
          subject: p.course_details.subject,
          mode: p.course_details.mode,
          validity: p.course_details.validity,
          facultyName: p.course_details.facultyName,
          price: p.amount
        })),
        transactionId,
        amount
      });
    } catch (emailErr) {
      console.error('Failed to send notification email:', emailErr);
    }

    res.status(201).json({
      success: true,
      message: `Purchase recorded successfully! ${createdPurchases.length} courses will be activated after verification.`,
      purchases: createdPurchases.map(p => ({ id: p.id, transactionId: p.transaction_id })),
      skipped: skippedPurchases
    });

  } catch (error) {
    console.error('Cart Purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing cart purchase'
    });
  }
};

// @desc    Get purchase statistics for admin
// @route   GET /api/purchase/stats
// @access  Private/Admin
exports.getPurchaseStats = async (req, res) => {
  try {
    // Total purchases count
    const { count: totalPurchases, error: countErr } = await supabaseAdmin
      .from('purchases')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (countErr) throw countErr;

    // Completed purchases count
    const { count: completedPurchases, error: completedErr } = await supabaseAdmin
      .from('purchases')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('payment_status', 'completed');

    if (completedErr) throw completedErr;

    // Total revenue sum
    const { data: revenueData, error: revenueErr } = await supabaseAdmin
      .from('purchases')
      .select('amount')
      .eq('is_active', true)
      .eq('payment_status', 'completed');

    if (revenueErr) throw revenueErr;

    const totalRevenue = (revenueData || []).reduce((sum, row) => sum + Number(row.amount), 0);

    res.status(200).json({
      success: true,
      stats: {
        totalPurchases: totalPurchases || 0,
        completedPurchases: completedPurchases || 0,
        totalRevenue
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

// @desc    Get all purchases (admin only)
// @route   GET /api/purchase/admin/all
// @access  Private/Admin
exports.getAllPurchases = async (req, res) => {
  try {
    const { data: purchases, error } = await supabaseAdmin
      .from('purchases')
      .select('*, users(name, email, mobile)')
      .order('purchase_date', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      purchases
    });
  } catch (error) {
    console.error('Get all purchases error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchases',
      error: error.message
    });
  }
};

// @desc    Verify/Update payment status (admin only)
// @route   PUT /api/purchase/verify/:purchaseId
// @access  Private/Admin
exports.verifyPurchase = async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const { status } = req.body; // 'completed' or 'rejected'

    if (!status || !['completed', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be completed or rejected'
      });
    }

    // Update purchase record
    const { data: purchase, error: updateError } = await supabaseAdmin
      .from('purchases')
      .update({ payment_status: status })
      .eq('id', purchaseId)
      .select('*, users(name, email)')
      .single();

    if (updateError) throw updateError;

    // Send enrollment confirmation email if approved
    const { sendEnrollmentEmail } = require('../utils/email.utils');
    if (status === 'completed' && purchase.users) {
      try {
        await sendEnrollmentEmail(
          purchase.users.email,
          purchase.users.name,
          purchase.course_details?.title || purchase.course_details?.subject
        );
      } catch (emailErr) {
        console.error('Failed to send enrollment email:', emailErr);
      }
    }

    res.status(200).json({
      success: true,
      message: `Purchase status updated to ${status}`,
      purchase
    });
  } catch (error) {
    console.error('Verify purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update purchase status',
      error: error.message
    });
  }
};

// @desc    Create Razorpay Order
// @route   POST /api/purchase/razorpay-order
// @access  Private
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { userId, amount, courseId, cartItems } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing amount'
      });
    }

    // Check if user already owns any of the target courses
    if (userId) {
      let targetUserId = userId;
      const isUserUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
      let userQuery = isUserUuid ? 'id' : 'mongo_id';

      const { data: userObj } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq(userQuery, userId)
        .maybeSingle();

      if (userObj && userObj.id) {
        targetUserId = userObj.id;
      }

      const isCart = Array.isArray(cartItems) && cartItems.length > 0;
      const coursesToCheck = isCart 
        ? cartItems.map(i => i.id).filter(Boolean) 
        : (courseId ? [courseId] : []);

      if (coursesToCheck.length > 0) {
        const { data: existingActive } = await supabaseAdmin
          .from('purchases')
          .select('course_id')
          .or(`user_id.eq.${targetUserId},user_id.eq.${userId}`)
          .eq('is_active', true);

        if (existingActive && existingActive.length > 0) {
          const activeCourseIds = existingActive.map(p => p.course_id);
          
          const { data: matchedDbCourses } = await supabaseAdmin
            .from('courses')
            .select('id, mongo_id')
            .or(`id.in.(${coursesToCheck.join(',')}),mongo_id.in.(${coursesToCheck.join(',')})`);

          const targetDbIds = (matchedDbCourses || []).map(c => c.id);
          const hasAlreadyPurchased = targetDbIds.some(id => activeCourseIds.includes(id));

          if (hasAlreadyPurchased) {
            return res.status(400).json({
              success: false,
              alreadyPurchased: true,
              message: 'You have already purchased this course! You can access it from your Student Dashboard.'
            });
          }
        }
      }
    }

    const { getRazorpayInstance, getKeyId } = require('../config/razorpay.config');
    const razorpay = getRazorpayInstance();
    const amountInPaise = Math.round(Number(amount) * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      keyId: getKeyId(),
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      }
    });

  } catch (error) {
    console.error('Create Razorpay Order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment order',
      error: error.message
    });
  }
};

// @desc    Verify Razorpay Payment Signature and finalize purchase
// @route   POST /api/purchase/razorpay-verify
// @access  Private
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      cartItems,
      amount,
      coupon,
      discountPercent,
      userDetails
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required validation fields'
      });
    }

    const { getKeySecret } = require('../config/razorpay.config');
    const keySecret = getKeySecret();
    const crypto = require('crypto');

    // Verify cryptographic signature
    const text = razorpay_order_id + '|' + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid signature'
      });
    }

    // Resolve user UUID by id, mongo_id, or email
    let user = null;
    if (userId) {
      const isUserUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
      if (isUserUuid) {
        const { data } = await supabaseAdmin.from('users').select('id, name, email').eq('id', userId).maybeSingle();
        user = data;
      }
      if (!user) {
        const { data } = await supabaseAdmin.from('users').select('id, name, email').eq('mongo_id', userId).maybeSingle();
        user = data;
      }
    }
    if (!user && userDetails?.email) {
      const { data } = await supabaseAdmin.from('users').select('id, name, email').eq('email', userDetails.email).maybeSingle();
      user = data;
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    const createdPurchases = [];
    const skippedPurchases = [];
    const isCart = Array.isArray(cartItems) && cartItems.length > 0;
    const coursesToProcess = isCart ? cartItems : [{ id: courseId }];
    const couponDiscount = Math.max(0, Math.min(100, Number(discountPercent || 0)));

    const { sendEnrollmentEmail } = require('../utils/email.utils');

    for (let idx = 0; idx < coursesToProcess.length; idx++) {
      const item = coursesToProcess[idx];
      const targetCourseId = item.id;

      // Resolve course UUID
      const isCourseUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetCourseId);
      let courseQuery = isCourseUuid ? 'id' : 'mongo_id';

      const { data: course, error: courseError } = await supabaseAdmin
        .from('courses')
        .select('*')
        .eq(courseQuery, targetCourseId)
        .maybeSingle();

      if (courseError || !course) {
        skippedPurchases.push({ id: targetCourseId, reason: 'Course not found' });
        continue;
      }

      // Check if user already purchased this course
      const { data: existingPurchase, error: checkError } = await supabaseAdmin
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .eq('is_active', true)
        .maybeSingle();

      if (!checkError && existingPurchase) {
        skippedPurchases.push({ title: course.subject, reason: 'Already active' });
        continue;
      }

      // Handle amount calculations
      const itemBaseAmount = isCart 
        ? Number(item.sellingPrice || item.price || 0)
        : Number(amount);
      const itemPayableAmount = isCart 
        ? Math.max(0, Math.round(itemBaseAmount * (1 - couponDiscount / 100)))
        : Number(amount);

      // Create purchase record marked as completed instantly
      const { data: purchase, error: insertError } = await supabaseAdmin
        .from('purchases')
        .insert({
          user_id: user.id,
          course_id: course.id,
          faculty_id: course.faculty_id,
          payment_method: 'Razorpay',
          amount: itemPayableAmount,
          transaction_id: `${razorpay_payment_id}${isCart ? `_${idx + 1}` : ''}`,
          payment_status: 'completed',
          course_details: {
            title: course.title || course.subject,
            subject: course.subject,
            poster_url: course.poster_url || course.posterUrl || item.posterUrl || '',
            posterUrl: course.poster_url || course.posterUrl || item.posterUrl || '',
            mode: item.mode || req.body.courseDetails?.mode || '',
            validity: item.attempt || item.validity || req.body.courseDetails?.validity || '',
            facultyName: course.faculty_name,
            coupon: coupon || '',
            discountPercent: couponDiscount
          },
          access_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        })
        .select('*')
        .single();

      if (!insertError && purchase) {
        createdPurchases.push(purchase);
        
        // Trigger enrollment confirmation email
        try {
          await sendEnrollmentEmail(
            user.email,
            user.name,
            course.title || course.subject
          );
        } catch (emailErr) {
          console.error('Failed to send enrollment email:', emailErr);
        }
      } else {
        console.error('Error inserting payment record:', insertError);
        skippedPurchases.push({ title: course.subject, reason: insertError?.message || 'Failed to insert' });
      }
    }

    if (createdPurchases.length > 0 && coupon) {
      recordCouponUsage(coupon, user?.id, userDetails?.email || user?.email);
    }

    if (createdPurchases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No courses could be activated. They might be already active.',
        skipped: skippedPurchases
      });
    }

    // 1. Send Professional HTML Receipt Email to Student
    try {
      const { sendPurchaseInvoiceEmail } = require('../utils/email.utils');
      const studentPhone = user?.phone || user?.mobile || userDetails?.phone || '';
      await sendPurchaseInvoiceEmail({
        userEmail: user?.email || userDetails?.email,
        userName: user?.name || userDetails?.name || 'Student',
        purchases: createdPurchases,
        transactionId: razorpay_payment_id,
        amount: amount,
        paymentMethod: 'Razorpay Online',
        couponCode: coupon || '',
        discountPercent: couponDiscount,
        userDetails: {
          phone: studentPhone,
          address: userDetails?.address
        }
      });
      console.log('✅ Student purchase receipt email sent to:', user?.email || userDetails?.email);
    } catch (studentEmailErr) {
      console.error('Failed to send student receipt email:', studentEmailErr);
    }

    // 2. Send Admin Purchase Confirmation Email
    try {
      const { sendAdminNotificationEmail } = require('../utils/email.utils');
      await sendAdminNotificationEmail({
        type: 'purchase',
        userDetails: {
          fullName: userDetails?.name || user?.name || 'Student',
          email: userDetails?.email || user?.email,
          phone: userDetails?.phone || '',
          address: userDetails?.address
        },
        cartItems: createdPurchases.map(p => ({
          title: p.course_details.title || p.course_details.subject,
          subject: p.course_details.subject,
          mode: p.course_details.mode,
          validity: p.course_details.validity,
          facultyName: p.course_details.facultyName,
          price: p.amount
        })),
        transactionId: razorpay_payment_id,
        amount
      });
      console.log('✅ Admin purchase notification email sent to support@academywale.com');
    } catch (adminEmailErr) {
      console.error('Failed to send admin notification email:', adminEmailErr);
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified and courses activated successfully.',
      purchases: createdPurchases.map(p => ({ id: p.id, transactionId: p.transaction_id })),
      skipped: skippedPurchases
    });

  } catch (error) {
    console.error('Verify Razorpay Payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during payment verification',
      error: error.message
    });
  }
};
