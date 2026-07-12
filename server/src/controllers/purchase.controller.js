const { supabaseAdmin } = require('../config/supabase.config');
const { sendPurchaseInvoiceEmail } = require('../utils/email.utils');

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

    const { data: purchases, error } = await supabaseAdmin
      .from('purchases')
      .select('*, faculties(first_name, last_name)')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('purchase_date', { ascending: false });

    if (error) throw error;

    const formattedPurchases = (purchases || []).map(p => {
      const fName = p.faculties ? `${p.faculties.first_name} ${p.faculties.last_name || ''}`.trim() : p.course_details.facultyName;
      return {
        id: p.id,
        transactionId: p.transaction_id,
        courseDetails: p.course_details,
        purchaseDate: p.purchase_date,
        accessExpiry: p.access_expiry,
        paymentStatus: p.payment_status,
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
    const { userId, courseId, transactionId, amount, userDetails, courseDetails } = req.body;

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
          mode: courseDetails?.mode || '',
          validity: courseDetails?.validity || '',
          facultyName: course.faculty_name
        },
        access_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      })
      .select('*')
      .single();

    if (insertError) throw insertError;

    // Send notification email to admin
    try {
      const emailText = `
        New UPI payment received:
        Course: ${course.title || course.subject}
        User: ${user.name || userDetails?.name} (${user.email || userDetails?.email})
        Phone: ${userDetails?.phone || ''}
        Amount: ₹${amount}
        Transaction ID: ${transactionId}
        Mode: ${courseDetails?.mode || ''}
        Validity: ${courseDetails?.validity || ''}
        Status: Pending verification
      `;
      
      await sendPurchaseInvoiceEmail(
        'support@academywale.com',
        'Admin',
        { subject: 'New UPI Purchase - Verification Needed' },
        transactionId,
        new Date(),
        amount,
        emailText
      );
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
    const { userId, cartItems, transactionId, amount, userDetails } = req.body;

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

      // Create purchase record
      const { data: purchase, error: insertError } = await supabaseAdmin
        .from('purchases')
        .insert({
          user_id: user.id,
          course_id: course.id,
          faculty_id: course.faculty_id,
          payment_method: 'UPI',
          amount: Number(item.sellingPrice || item.price || 0),
          transaction_id: uniqueTxnId,
          payment_status: 'pending_verification',
          course_details: {
            title: course.title || course.subject,
            subject: course.subject,
            mode: item.mode || '',
            validity: item.attempt || item.validity || '',
            facultyName: course.faculty_name
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

    if (createdPurchases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No new courses could be purchased. They may already be active in your dashboard.',
        skipped: skippedPurchases
      });
    }

    // Send consolidated notification email to admin
    try {
      let emailText = `
        New UPI Multi-Course Cart Purchase received:
        User: ${user.name || userDetails?.name} (${user.email || userDetails?.email})
        Phone: ${userDetails?.phone || ''}
        Total Amount: ₹${amount}
        Base Transaction ID: ${transactionId}
        Status: Pending verification

        Purchased Items:
      `;

      createdPurchases.forEach((p, idx) => {
        emailText += `
        ${idx + 1}. Course: ${p.course_details.subject}
           Faculty: ${p.course_details.facultyName}
           Mode: ${p.course_details.mode}
           Validity: ${p.course_details.validity}
           Row Transaction ID: ${p.transaction_id}
           Amount: ₹${p.amount}
        `;
      });

      if (skippedPurchases.length > 0) {
        emailText += `\n\n        Skipped Items:\n`;
        skippedPurchases.forEach((s, idx) => {
          emailText += `        - ${s.title} (${s.reason})\n`;
        });
      }
      
      await sendPurchaseInvoiceEmail(
        'support@academywale.com',
        'Admin',
        { subject: 'New UPI Cart Purchase - Verification Needed' },
        transactionId,
        new Date(),
        amount,
        emailText
      );
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