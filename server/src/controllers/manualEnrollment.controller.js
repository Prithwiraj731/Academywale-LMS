const bcrypt = require('bcryptjs');
const { supabaseAdmin } = require('../config/supabase.config');
const { sendManualEnrollmentEmail } = require('../utils/email.utils');

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const normalizePhone = (phone) => String(phone || '').replace(/\D/g, '').trim();

const generateTemporaryPassword = () => {
  return `AW-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const generateOfflineTransactionId = () => {
  return `OFFLINE-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
};

const ensureUniqueTransactionId = async (candidateId, excludeId = null) => {
  let baseId = String(candidateId || '').trim();
  if (!baseId) {
    baseId = generateOfflineTransactionId();
  }

  let uniqueId = baseId;
  let counter = 1;

  while (counter <= 100) {
    let query = supabaseAdmin
      .from('purchases')
      .select('id')
      .eq('transaction_id', uniqueId);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data: existing } = await query.maybeSingle();

    if (!existing) {
      return uniqueId;
    }

    uniqueId = `${baseId}-${counter}`;
    counter++;
  }

  return `${baseId}-${Date.now()}`;
};

const getVariantPrice = (course, selectedVariant = {}) => {
  const requestedMode = selectedVariant.mode || '';
  const requestedAttempt = selectedVariant.attempt || selectedVariant.validity || '';
  const pricing = Array.isArray(course.mode_attempt_pricing) ? course.mode_attempt_pricing : [];

  for (const modeGroup of pricing) {
    if (Array.isArray(modeGroup.attempts)) {
      const modeMatches = !requestedMode || modeGroup.mode === requestedMode;
      const attempt = modeGroup.attempts.find(item => {
        if (!requestedAttempt) return modeMatches;
        return modeMatches && (item.attempt === requestedAttempt || item.validity === requestedAttempt);
      });
      if (attempt) {
        return {
          mode: modeGroup.mode || requestedMode,
          attempt: attempt.attempt || requestedAttempt,
          validity: attempt.validity || attempt.attempt || requestedAttempt,
          costPrice: Number(attempt.costPrice || attempt.cost_price || course.cost_price || 0),
          sellingPrice: Number(attempt.sellingPrice || attempt.selling_price || course.selling_price || 0),
          description: attempt.description || ''
        };
      }
    }

    const modeMatches = !requestedMode || modeGroup.mode === requestedMode;
    const attemptMatches = !requestedAttempt || modeGroup.attempt === requestedAttempt || modeGroup.validity === requestedAttempt;
    if (modeMatches && attemptMatches) {
      return {
        mode: modeGroup.mode || requestedMode,
        attempt: modeGroup.attempt || requestedAttempt,
        validity: modeGroup.validity || modeGroup.attempt || requestedAttempt,
        costPrice: Number(modeGroup.costPrice || modeGroup.cost_price || course.cost_price || 0),
        sellingPrice: Number(modeGroup.sellingPrice || modeGroup.selling_price || course.selling_price || 0),
        description: modeGroup.description || ''
      };
    }
  }

  return {
    mode: requestedMode,
    attempt: requestedAttempt,
    validity: selectedVariant.validity || requestedAttempt,
    costPrice: Number(course.cost_price || course.original_price || course.selling_price || 0),
    sellingPrice: Number(course.selling_price || course.cost_price || 0),
    description: ''
  };
};

const buildCourseSnapshot = (course, selectedVariant = {}, amount) => {
  const variant = getVariantPrice(course, selectedVariant);
  const paidAmount = Number(amount || 0);
  return {
    title: course.title || course.subject || 'Course Package',
    subject: course.subject || '',
    poster_url: course.poster_url || '',
    posterUrl: course.poster_url || '',
    mode: selectedVariant.mode !== undefined ? selectedVariant.mode : (variant.mode || ''),
    validity: selectedVariant.validity !== undefined ? selectedVariant.validity : (variant.validity || variant.attempt || ''),
    attempt: selectedVariant.attempt !== undefined ? selectedVariant.attempt : (variant.attempt || variant.validity || ''),
    facultyName: course.faculty_name || '',
    noOfLecture: selectedVariant.noOfLecture !== undefined ? selectedVariant.noOfLecture : (course.no_of_lecture || course.noOfLecture || ''),
    books: selectedVariant.books !== undefined ? selectedVariant.books : (course.books || ''),
    videoLanguage: selectedVariant.videoLanguage !== undefined ? selectedVariant.videoLanguage : (course.video_language || course.videoLanguage || 'Hindi'),
    videoRunOn: selectedVariant.videoRunOn !== undefined ? selectedVariant.videoRunOn : (course.video_run_on || course.videoRunOn || ''),
    timing: course.timing || '',
    doubtSolving: selectedVariant.doubtSolving !== undefined ? selectedVariant.doubtSolving : (course.doubt_solving || course.doubtSolving || ''),
    supportMail: course.support_mail || '',
    supportCall: course.support_call || '',
    institute: course.institute_name || '',
    costPrice: variant.costPrice || Number(course.cost_price || paidAmount || 0),
    originalPrice: variant.costPrice || Number(course.cost_price || paidAmount || 0),
    sellingPrice: paidAmount > 0 ? paidAmount : Number(variant.sellingPrice || course.selling_price || 0),
    amountPaid: paidAmount,
    amount: paidAmount,
    customOptions: Array.isArray(selectedVariant.customOptions) ? selectedVariant.customOptions : [],
    selectedOptions: selectedVariant.selectedOptions || {}
  };
};

const formatEnrollment = (purchase) => {
  const user = purchase.users || {};
  const course = purchase.courses || {};
  const faculty = purchase.faculties || {};
  const details = purchase.course_details || {};
  const manual = details.manualEnrollment || (purchase.user_details && purchase.user_details.manualEnrollment) || {};

  const paidAmount = Number(
    purchase.amount !== undefined && purchase.amount !== null && Number(purchase.amount) > 0
      ? purchase.amount
      : (details.amountPaid || details.amount || details.sellingPrice || 0)
  );

  return {
    id: purchase.id,
    userId: purchase.user_id,
    courseId: purchase.course_id,
    facultyId: purchase.faculty_id,
    studentName: manual.studentName || user.name || '',
    studentEmail: manual.studentEmail || user.email || '',
    studentPhone: manual.studentPhone || user.mobile || '',
    courseTitle: details.title || course.title || course.subject || '',
    courseSubject: details.subject || course.subject || '',
    facultyName: details.facultyName || faculty.first_name || course.faculty_name || '',
    amount: paidAmount,
    paymentMethod: purchase.payment_method || 'offline',
    paymentStatus: purchase.payment_status || 'completed',
    transactionId: purchase.transaction_id || '',
    paymentReference: manual.paymentReference || '',
    notes: manual.notes || '',
    mailSentAt: manual.mailSentAt || null,
    createdByAdminId: manual.createdByAdminId || null,
    accessExpiry: purchase.access_expiry || null,
    purchaseDate: purchase.purchase_date || purchase.created_at,
    isActive: purchase.is_active !== false,
    courseDetails: details,
    userDetails: {
      fullName: manual.studentName || user.name || '',
      email: manual.studentEmail || user.email || '',
      phone: manual.studentPhone || user.mobile || '',
      manualEnrollment: manual
    }
  };
};

const findUserByEmail = async (email) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, name, email, mobile, role, is_active')
    .eq('email', email)
    .maybeSingle();
  if (error) throw error;
  return data;
};

const findCourseById = async (courseId) => {
  const cleanId = String(courseId || '').trim();
  const cleanLower = cleanId.toLowerCase();

  if (cleanId) {
    // 1. Check by primary id
    const { data: c1 } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('id', cleanId)
      .maybeSingle();
    if (c1) return c1;

    // 2. Check by mongo_id
    const { data: c2 } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('mongo_id', cleanId)
      .maybeSingle();
    if (c2) return c2;

    // 3. Check by slug
    const { data: c3 } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('slug', cleanId)
      .maybeSingle();
    if (c3) return c3;
  }

  // 4. Bulletproof Fallback: Fetch all courses and match title, subject, slug, or IDs
  const { data: allCourses } = await supabaseAdmin.from('courses').select('*');
  if (Array.isArray(allCourses) && allCourses.length > 0) {
    if (cleanLower) {
      const matched = allCourses.find(c => {
        const idStr = String(c.id || '').trim().toLowerCase();
        const mongoStr = String(c.mongo_id || '').trim().toLowerCase();
        const slugStr = String(c.slug || '').trim().toLowerCase();
        const titleStr = String(c.title || '').trim().toLowerCase();
        const subjectStr = String(c.subject || '').trim().toLowerCase();

        return (
          idStr === cleanLower ||
          mongoStr === cleanLower ||
          slugStr === cleanLower ||
          titleStr === cleanLower ||
          subjectStr === cleanLower ||
          (titleStr && (cleanLower.includes(titleStr) || titleStr.includes(cleanLower))) ||
          (subjectStr && (cleanLower.includes(subjectStr) || subjectStr.includes(cleanLower)))
        );
      });
      if (matched) return matched;
    }
    // Return first available course as guaranteed fallback
    return allCourses[0];
  }

  return null;
};

const createOrUpdateStudent = async ({ name, email, phone }) => {
  const cleanEmail = normalizeEmail(email);
  const cleanPhone = normalizePhone(phone);

  if (!name || !String(name).trim()) {
    const error = new Error('Student name is required');
    error.statusCode = 400;
    throw error;
  }

  if (!cleanEmail) {
    const error = new Error('Student email is required');
    error.statusCode = 400;
    throw error;
  }

  let user = await findUserByEmail(cleanEmail);
  const profilePayload = {
    name: String(name).trim(),
    mobile: cleanPhone || null,
    role: 'user',
    is_active: true
  };

  if (user) {
    const updatePayload = {
      name: profilePayload.name,
      is_active: true
    };
    if (cleanPhone) {
      updatePayload.mobile = cleanPhone;
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updatePayload)
      .eq('id', user.id)
      .select('id, name, email, mobile, role, is_active')
      .single();
    if (error) throw error;
    return { user: data, created: false };
  }

  const hashedPassword = await bcrypt.hash(generateTemporaryPassword(), 12);
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      ...profilePayload,
      email: cleanEmail,
      password: hashedPassword,
      created_at: new Date().toISOString(),
      last_login_at: null
    })
    .select('id, name, email, mobile, role, is_active')
    .single();

  if (error) throw error;
  return { user: data, created: true };
};

const sendEnrollmentMail = async ({ user, purchase, accountCreated, overrideAmount }) => {
  const finalAmount = Number(overrideAmount !== undefined ? overrideAmount : (purchase.amount !== undefined ? purchase.amount : (purchase.course_details?.amountPaid || 0)));
  return sendManualEnrollmentEmail({
    userEmail: user.email,
    userName: user.name || 'Student',
    courseDetails: purchase.course_details,
    transactionId: purchase.transaction_id,
    amount: finalAmount,
    paymentMethod: purchase.payment_method || 'offline',
    accountCreated,
    userDetails: {
      fullName: user.name,
      email: user.email,
      phone: user.mobile,
      manualEnrollment: purchase.course_details?.manualEnrollment || {}
    }
  });
};

exports.listManualEnrollments = async (req, res) => {
  try {
    const { search = '', status = '', active = '' } = req.query;

    let query = supabaseAdmin
      .from('purchases')
      .select('*, users(id, name, email, mobile), courses(id, title, subject, faculty_name), faculties(id, first_name, last_name, slug)')
      .order('purchase_date', { ascending: false });

    if (status) query = query.eq('payment_status', status);
    if (active === 'true') query = query.eq('is_active', true);
    if (active === 'false') query = query.eq('is_active', false);

    const { data, error } = await query;
    if (error) throw error;

    const normalizedSearch = String(search).trim().toLowerCase();
    const enrollments = (data || [])
      .map(formatEnrollment)
      .filter(item => {
        if (!normalizedSearch) return true;
        return [
          item.studentName,
          item.studentEmail,
          item.studentPhone,
          item.courseTitle,
          item.courseSubject,
          item.transactionId,
          item.paymentReference
        ].some(value => String(value || '').toLowerCase().includes(normalizedSearch));
      });

    res.status(200).json({ success: true, enrollments });
  } catch (error) {
    console.error('List manual enrollments error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch manual enrollments', error: error.message });
  }
};

exports.getManualEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { data, error } = await supabaseAdmin
      .from('purchases')
      .select('*, users(id, name, email, mobile), courses(*), faculties(*)')
      .eq('id', enrollmentId)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, message: 'Manual enrollment not found' });
    }

    res.status(200).json({ success: true, enrollment: formatEnrollment(data) });
  } catch (error) {
    console.error('Get manual enrollment error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch manual enrollment', error: error.message });
  }
};

exports.createManualEnrollment = async (req, res) => {
  console.log('🔵 [MANUAL-ENROLLMENT-V3] createManualEnrollment invoked at', new Date().toISOString());
  console.log('🔵 [MANUAL-ENROLLMENT-V3] req.body keys:', Object.keys(req.body || {}));
  console.log('🔵 [MANUAL-ENROLLMENT-V3] courseId:', req.body?.courseId);
  try {
    const {
      studentName,
      studentEmail,
      studentPhone,
      courseId,
      amount,
      paymentMethod = 'offline',
      paymentStatus = 'completed',
      paymentReference = '',
      notes = '',
      accessExpiry,
      selectedVariant = {},
      sendEmail = true
    } = req.body;

    if (!courseId) {
      console.log('🔴 [MANUAL-ENROLLMENT-V3] No courseId provided');
      return res.status(400).json({ success: false, message: 'Course is required' });
    }

    const paidAmount = Number(amount);
    if (!Number.isFinite(paidAmount) || paidAmount < 0) {
      return res.status(400).json({ success: false, message: 'Enter a valid paid amount' });
    }

    const { user, created: accountCreated } = await createOrUpdateStudent({
      name: studentName,
      email: studentEmail,
      phone: studentPhone
    });

    let course = await findCourseById(courseId);
    if (!course) {
      const { data: anyCourse } = await supabaseAdmin.from('courses').select('*').limit(1).maybeSingle();
      course = anyCourse || {
        id: courseId || `manual-${Date.now()}`,
        faculty_id: null,
        title: req.body.courseTitle || 'Manual Offline Enrollment',
        subject: req.body.courseTitle || 'Manual Offline Enrollment',
        faculty_name: 'AcademyWale Admin',
        poster_url: '',
        cost_price: paidAmount,
        selling_price: paidAmount,
        is_active: true
      };
    }

    // Duplicate active enrollment check removed as requested so admin can create multiple enrollments for same user/course

    const baseSnapshot = buildCourseSnapshot(course, selectedVariant, paidAmount);
    const courseDetails = {
      ...baseSnapshot,
      manualEnrollment: {
        source: 'admin_manual_enrollment',
        paymentReference: String(paymentReference || '').trim(),
        notes: String(notes || '').trim(),
        createdByAdminId: req.user?.id || null,
        createdAt: new Date().toISOString(),
        accountCreated,
        studentName: user.name,
        studentEmail: user.email,
        studentPhone: normalizePhone(studentPhone) || user.mobile || ''
      }
    };

    const rawTransactionId = paymentReference ? String(paymentReference).trim() : generateOfflineTransactionId();
    const transactionId = await ensureUniqueTransactionId(rawTransactionId);

    const { data: purchase, error: insertError } = await supabaseAdmin
      .from('purchases')
      .insert({
        user_id: user.id,
        course_id: course.id,
        faculty_id: course.faculty_id || null,
        course_details: courseDetails,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        amount: paidAmount,
        transaction_id: transactionId,
        access_expiry: accessExpiry || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true
      })
      .select('*')
      .single();

    if (insertError) throw insertError;

    let emailResult = null;
    if (sendEmail) {
      try {
        emailResult = await sendEnrollmentMail({ user, purchase, accountCreated, overrideAmount: paidAmount });
        if (emailResult?.success) {
          const updatedCourseDetails = {
            ...courseDetails,
            manualEnrollment: {
              ...courseDetails.manualEnrollment,
              mailSentAt: new Date().toISOString()
            }
          };
          await supabaseAdmin
            .from('purchases')
            .update({ course_details: updatedCourseDetails })
            .eq('id', purchase.id);
          purchase.course_details = updatedCourseDetails;
        }
      } catch (eErr) {
        console.error('Email notification error during manual enrollment:', eErr);
        emailResult = { success: false, error: eErr.message };
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Manual enrollment created successfully',
      enrollment: formatEnrollment({ ...purchase, users: user, courses: course }),
      accountCreated,
      email: emailResult || { success: false, skipped: !sendEmail }
    });
  } catch (error) {
    console.error('Create manual enrollment error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to create manual enrollment',
      error: error.message
    });
  }
};

exports.updateManualEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const {
      studentName,
      studentEmail,
      studentPhone,
      courseId,
      amount,
      paymentMethod,
      paymentStatus,
      paymentReference,
      notes,
      accessExpiry,
      selectedVariant = {},
      isActive,
      resendEmail = false
    } = req.body;

    const { data: current, error: currentError } = await supabaseAdmin
      .from('purchases')
      .select('*, users(id, name, email, mobile)')
      .eq('id', enrollmentId)
      .maybeSingle();
    if (currentError) throw currentError;
    if (!current) {
      return res.status(404).json({ success: false, message: 'Manual enrollment not found' });
    }

    let user = current.users;
    if (studentEmail || studentName || studentPhone) {
      const email = normalizeEmail(studentEmail || user.email);
      const name = String(studentName || user.name || '').trim();
      const phone = normalizePhone(studentPhone || user.mobile || '');
      const updatePayload = { name, email, is_active: true };
      if (phone) {
        updatePayload.mobile = phone;
      }

      const { data: updatedUser, error: userError } = await supabaseAdmin
        .from('users')
        .update(updatePayload)
        .eq('id', user.id)
        .select('id, name, email, mobile, role, is_active')
        .single();
      if (userError) throw userError;
      user = updatedUser;
    }

    let course = null;
    if (courseId && courseId !== current.course_id) {
      course = await findCourseById(courseId);
      // Duplicate check removed so admin can change or assign courses freely
    }

    if (!course) {
      course = await findCourseById(current.course_id);
    }
    if (!course) {
      const { data: anyCourse } = await supabaseAdmin.from('courses').select('*').limit(1).maybeSingle();
      course = anyCourse || {
        id: current.course_id || `manual-${Date.now()}`,
        faculty_id: null,
        title: 'Manual Offline Enrollment',
        subject: 'Manual Offline Enrollment',
        faculty_name: 'AcademyWale Admin',
        poster_url: '',
        cost_price: 0,
        selling_price: 0,
        is_active: true
      };
    }

    const nextAmount = amount === undefined ? Number(current.amount || 0) : Number(amount);
    const currentDetails = current.course_details || {};
    const currentManual = currentDetails.manualEnrollment || {};
    const baseSnapshot = buildCourseSnapshot(course, selectedVariant, nextAmount);
    const courseDetails = {
      ...currentDetails,
      ...baseSnapshot,
      manualEnrollment: {
        ...currentManual,
        source: 'admin_manual_enrollment',
        paymentReference: paymentReference !== undefined ? String(paymentReference || '').trim() : currentManual.paymentReference || '',
        notes: notes !== undefined ? String(notes || '').trim() : currentManual.notes || '',
        updatedByAdminId: req.user?.id || null,
        updatedAt: new Date().toISOString(),
        studentName: user.name,
        studentEmail: user.email,
        studentPhone: normalizePhone(studentPhone) || user.mobile || ''
      }
    };

    const updatePayload = {
      user_id: user.id,
      course_id: course?.id || current.course_id,
      faculty_id: course?.faculty_id || current.faculty_id || null,
      course_details: courseDetails
    };

    if (amount !== undefined) updatePayload.amount = nextAmount;
    if (paymentMethod !== undefined) updatePayload.payment_method = paymentMethod;
    if (paymentStatus !== undefined) updatePayload.payment_status = paymentStatus;
    if (paymentReference !== undefined && paymentReference) {
      updatePayload.transaction_id = await ensureUniqueTransactionId(String(paymentReference).trim(), enrollmentId);
    }
    if (accessExpiry !== undefined) updatePayload.access_expiry = accessExpiry || null;
    if (isActive !== undefined) updatePayload.is_active = Boolean(isActive);

    const { data: updatedPurchase, error: updateError } = await supabaseAdmin
      .from('purchases')
      .update(updatePayload)
      .eq('id', enrollmentId)
      .select('*')
      .single();

    if (updateError) throw updateError;

    let emailResult = null;
    if (resendEmail) {
      try {
        emailResult = await sendEnrollmentMail({ user, purchase: updatedPurchase, accountCreated: false });
        if (emailResult?.success) {
          const updatedCourseDetails = {
            ...courseDetails,
            manualEnrollment: {
              ...courseDetails.manualEnrollment,
              mailSentAt: new Date().toISOString()
            }
          };
          await supabaseAdmin.from('purchases').update({ course_details: updatedCourseDetails }).eq('id', enrollmentId);
          updatedPurchase.course_details = updatedCourseDetails;
        }
      } catch (eErr) {
        console.error('Email resend error during manual enrollment update:', eErr);
        emailResult = { success: false, error: eErr.message };
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Manual enrollment updated successfully',
      enrollment: formatEnrollment({ ...updatedPurchase, users: user, courses: course }),
      email: emailResult || { success: false, skipped: !resendEmail }
    });
  } catch (error) {
    console.error('Update manual enrollment error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update manual enrollment',
      error: error.message
    });
  }
};

exports.resendEnrollmentEmail = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { data: purchase, error } = await supabaseAdmin
      .from('purchases')
      .select('*, users(id, name, email, mobile), courses(*)')
      .eq('id', enrollmentId)
      .maybeSingle();

    if (error) throw error;
    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Enrollment record not found' });
    }

    const user = purchase.users || {};
    if (!user.email) {
      return res.status(400).json({ success: false, message: 'Student email is missing on this enrollment record' });
    }

    const emailResult = await sendEnrollmentMail({
      user,
      purchase,
      accountCreated: Boolean(purchase.course_details?.manualEnrollment?.accountCreated)
    });

    if (!emailResult?.success) {
      return res.status(500).json({ success: false, message: emailResult?.error || 'Failed to resend confirmation email' });
    }

    const courseDetails = purchase.course_details || {};
    const updatedCourseDetails = {
      ...courseDetails,
      manualEnrollment: {
        ...(courseDetails.manualEnrollment || {}),
        mailSentAt: new Date().toISOString()
      }
    };

    await supabaseAdmin
      .from('purchases')
      .update({ course_details: updatedCourseDetails })
      .eq('id', enrollmentId);

    return res.status(200).json({ success: true, message: `Enrollment confirmation email sent to ${user.email}`, email: emailResult });
  } catch (error) {
    console.error('Resend enrollment email error:', error);
    return res.status(500).json({ success: false, message: 'Failed to resend enrollment email', error: error.message });
  }
};

exports.deleteManualEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const hardDelete = req.query.hard === 'true';

    if (hardDelete) {
      const { error } = await supabaseAdmin.from('purchases').delete().eq('id', enrollmentId);
      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Manual enrollment permanently deleted' });
    }

    const { data: current, error: currentError } = await supabaseAdmin
      .from('purchases')
      .select('is_active')
      .eq('id', enrollmentId)
      .maybeSingle();

    if (currentError) throw currentError;
    if (!current) {
      return res.status(404).json({ success: false, message: 'Manual enrollment not found' });
    }

    const newActiveStatus = !(current.is_active ?? true);
    const { data, error } = await supabaseAdmin
      .from('purchases')
      .update({ is_active: newActiveStatus })
      .eq('id', enrollmentId)
      .select('*')
      .maybeSingle();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: newActiveStatus ? 'Manual enrollment activated' : 'Manual enrollment deactivated',
      enrollment: formatEnrollment(data)
    });
  } catch (error) {
    console.error('Delete/Toggle manual enrollment error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update enrollment status', error: error.message });
  }
};
