const { supabaseAdmin, isServiceKeyAvailable } = require('../config/supabase.config');
const { mapMode } = require('../utils/modeMapper');
const { mapCourseToFrontend, mapCoursesToFrontend } = require('../utils/courseMapper');

// Standardized error handler with deep RLS diagnostics
const handleControllerError = (error, operation, res) => {
  console.error(`❌ ${operation} error:`, error);

  const errMsg = error.message || '';
  if (errMsg.includes('row-level security') || errMsg.includes('RLS') || (error.code === '42501')) {
    const diagnostic = !isServiceKeyAvailable
      ? 'The SUPABASE_SERVICE_ROLE_KEY is missing or invalid in the server environment configuration, forcing the admin client to fall back to anonymous public permissions.'
      : 'A row-level security policy restriction was violated on the database table. Please check your Supabase schema settings and permissions.';

    return res.status(500).json({
      success: false,
      error: 'Database Security Violation (RLS)',
      message: `${operation} failed: ${error.message || 'Row-level security policy violation.'}`,
      diagnostic
    });
  }

  return res.status(500).json({
    success: false,
    error: `${operation} failed`,
    message: error.message || 'An unexpected database error occurred.'
  });
};

const isMissingColumnError = (error, columnName) => {
  const message = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`;
  return (error?.code === 'PGRST204' || error?.code === '42703') && message.includes(columnName);
};

// Hardcoded faculties database fallback
const hardcodedFaculties = [
  { id: 1, name: "CA Ranjan Periwal", specialization: "Corporate & Allied Laws", slug: "ca-ranjan-periwal" },
  { id: 2, name: "CA Satish Jalan", specialization: "Advanced Accounting & Audit", slug: "ca-satish-jalan" },
  { id: 3, name: "CA Aaditya Jain", specialization: "Direct Tax & Corporate Law", slug: "ca-aaditya-jain" },
  { id: 4, name: "CA Avinash Lala", specialization: "Audit & Assurance", slug: "ca-avinash-lala" },
  { id: 5, name: "CA Bishnu Kedia", specialization: "Indirect Tax & GST", slug: "ca-bishnu-kedia" },
  { id: 6, name: "CA Nitin Guru", specialization: "Information Technology & Strategic Management", slug: "ca-nitin-guru" },
  { id: 7, name: "CA Shivangi Agarwal", specialization: "Financial Reporting & Analysis", slug: "ca-shivangi-agarwal" },
  { id: 8, name: "CA Siddharth Agarwal", specialization: "Business Valuation & Risk Management", slug: "ca-siddharth-agarwal" },
  { id: 9, name: "CA Yashvant Mangal", specialization: "International Taxation", slug: "ca-yashvant-mangal" },
  { id: 10, name: "CA Amit Mahajan", specialization: "Cost Accounting & Management", slug: "ca-amit-mahajan" },
  { id: 11, name: "CA Avinash Sancheti", specialization: "Strategic Financial Management", slug: "ca-avinash-sancheti" },
  { id: 12, name: "CA Darshan Khare", specialization: "Costing & Operations Management", slug: "ca-darshan-khare" },
  { id: 13, name: "CA Divya Agarwal", specialization: "Business Economics & Commercial Laws", slug: "ca-divya-agarwal" },
  { id: 14, name: "CA Mayank Saraf", specialization: "Advanced Financial Management", slug: "ca-mayank-saraf" },
  { id: 15, name: "CA Parveen Sharma", specialization: "Tax Planning & Corporate Restructuring", slug: "ca-parveen-sharma" },
  { id: 16, name: "CA Raghav Goel", specialization: "Banking & Insurance", slug: "ca-raghav-goel" },
  { id: 17, name: "CA Rishabh Jain", specialization: "Forensic Accounting & Investigation", slug: "ca-rishabh-jain" },
  { id: 18, name: "CA Santosh Kumar", specialization: "Corporate Finance & Treasury", slug: "ca-santosh-kumar" },
  { id: 19, name: "CA Shiris Vyas", specialization: "Financial Services & Capital Markets", slug: "ca-shiris-vyas" },
  { id: 20, name: "CA Shubham Singhal", specialization: "Governance, Risk & Ethics", slug: "ca-shubham-singhal" },
  { id: 21, name: "CA Vijay Sarda", specialization: "Enterprise Performance Management", slug: "ca-vijay-sarda" },
  { id: 22, name: "CA Vishal Bhattad", specialization: "Strategic Cost Management", slug: "ca-vishal-bhattad" },
  { id: 23, name: "CMA Sumit Rastogi", specialization: "Cost & Management Accounting", slug: "cma-sumit-rastogi" },
  { id: 24, name: "CS Arjun Chhabra", specialization: "Company Secretarial Practice", slug: "cs-arjun-chhabra" },
];

/**
 * Upload Image Helper to Supabase Storage
 */
async function uploadToSupabaseStorage(file, folder) {
  if (!file) return { url: '', publicId: '' };

  const fileName = `${folder}/${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const { data, error } = await supabaseAdmin.storage
    .from('academywale-media')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });

  if (error) {
    console.error('❌ Supabase storage upload error:', error.message);
    throw error;
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('academywale-media')
    .getPublicUrl(fileName);

  return { url: publicUrl, publicId: fileName };
}

// @desc    Add course to faculty
// @route   POST /api/admin/courses
// @access  Private/Admin
exports.addCourseToFaculty = async (req, res) => {
  try {
    console.log('🎯 Course controller: addCourseToFaculty called');
    console.log('📋 Request body:', req.body);

    const {
      category, subcategory, paperId, paperName, subject, facultySlug,
      institute, description, noOfLecture, books, videoLanguage,
      videoRunOn, doubtSolving, supportMail, supportCall, timing,
      courseType, modeAttemptPricing, customDetails, title, validityStartFrom
    } = req.body;

    if (!category || !subcategory || !paperId) {
      return res.status(400).json({ error: 'Required Course Information fields (Category, Subcategory, Paper) are missing' });
    }

    // Parse custom details
    let parsedCustomDetails = [];
    if (customDetails) {
      try {
        parsedCustomDetails = JSON.parse(customDetails);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid custom details format' });
      }
    }

    // Extract faculty from custom details if present, fallback to facultySlug
    const facultyField = parsedCustomDetails.find(d => d.fieldType === 'faculty');
    let resolvedFacultySlug = facultySlug;
    if (facultyField && facultyField.value) {
      resolvedFacultySlug = facultyField.value;
    }

    // 1. Resolve Faculty in Supabase
    let faculty = null;
    let facultyFullName = null;
    let resolvedFacultyId = null;

    if (resolvedFacultySlug && resolvedFacultySlug.trim() !== '' && resolvedFacultySlug.toLowerCase() !== 'n-a') {
      let { data: fac, error: facultyError } = await supabaseAdmin
        .from('faculties')
        .select('*')
        .eq('slug', resolvedFacultySlug)
        .maybeSingle();

      if (facultyError) throw facultyError;

      // If not found in DB, check hardcoded faculties list
      if (!fac) {
        const hardcodedFaculty = hardcodedFaculties.find(f => f.slug === resolvedFacultySlug);
        if (hardcodedFaculty) {
          // Auto-provision faculty in PostgreSQL
          const facultyNameParts = hardcodedFaculty.name.replace(/^(CA|CMA|CS)\s+/, '').split(' ');
          const firstName = facultyNameParts[0];
          const lastName = facultyNameParts.slice(1).join(' ') || '';

          const { data: newFac, error: createFacError } = await supabaseAdmin
            .from('faculties')
            .insert({
              first_name: firstName,
              last_name: lastName,
              slug: hardcodedFaculty.slug,
              bio: `Expert faculty in ${hardcodedFaculty.specialization}`,
              teaches: [category.toUpperCase()]
            })
            .select('*')
            .single();

          if (createFacError) throw createFacError;
          faculty = newFac;
        }
      } else {
        faculty = fac;
      }

      if (faculty) {
        resolvedFacultyId = faculty.id;
        facultyFullName = faculty.first_name + (faculty.last_name ? ' ' + faculty.last_name : '');
        resolvedFacultySlug = faculty.slug;
      }
    }

    // 2. Parse pricing
    let parsedPricing = [];
    try {
      parsedPricing = JSON.parse(modeAttemptPricing);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid mode attempt pricing format' });
    }

    // Flat pricing conversion helper (nested attempts structure mapped to JSONB array)
    const flatPricing = [];
    if (Array.isArray(parsedPricing)) {
      parsedPricing.forEach(modeGroup => {
        const modeVal = modeGroup.mode || '';
        const modeLabelVal = modeGroup.modeLabel || 'Mode';
        if (modeGroup.attempts && Array.isArray(modeGroup.attempts)) {
          modeGroup.attempts.forEach(attemptData => {
            flatPricing.push({
              mode: modeVal,
              modeLabel: modeLabelVal,
              attempt: attemptData.attempt || '',
              attemptLabel: attemptData.attemptLabel || 'Exam Term / Attempt',
              validity: attemptData.validity || '',
              validityLabel: attemptData.validityLabel || 'Validity',
              costPrice: Number(attemptData.costPrice) || 0,
              sellingPrice: Number(attemptData.sellingPrice) || 0,
              description: attemptData.description || ''
            });
          });
        } else if (modeGroup.attempt) {
          flatPricing.push({
            mode: modeVal,
            modeLabel: modeLabelVal,
            attempt: modeGroup.attempt,
            attemptLabel: modeGroup.attemptLabel || 'Exam Term / Attempt',
            validity: modeGroup.validity || '',
            validityLabel: modeGroup.validityLabel || 'Validity',
            costPrice: Number(modeGroup.costPrice) || 0,
            sellingPrice: Number(modeGroup.sellingPrice) || 0,
            description: modeGroup.description || ''
          });
        }
      });
    }

    // Upload poster image if present, or use posterUrl from body (for cloned courses)
    let posterUrl = req.body.posterUrl || req.body.poster_url || req.body.poster || '';
    let posterPath = req.body.posterPublicId || req.body.poster_public_id || '';
    if (req.file) {
      const uploadResult = await uploadToSupabaseStorage(req.file, 'courses');
      posterUrl = uploadResult.url;
      posterPath = uploadResult.publicId;
    }

    // Extract institute from custom details if present, fallback to institute
    const instituteField = parsedCustomDetails.find(d => d.fieldType === 'institute');
    let resolvedInstitute = institute;
    if (instituteField && instituteField.value) {
      resolvedInstitute = instituteField.value;
    }

    // 3. Resolve Institute ID if present
    let resolvedInstituteId = null;
    if (resolvedInstitute && resolvedInstitute.trim() !== '' && resolvedInstitute.toLowerCase() !== 'n-a') {
      const { data: inst } = await supabaseAdmin
        .from('institutes')
        .select('id')
        .eq('name', resolvedInstitute)
        .maybeSingle();
      if (inst) {
        resolvedInstituteId = inst.id;
      }
    }

    // Extract subject from custom details if present
    const subjectField = parsedCustomDetails.find(d => d.label && d.label.toLowerCase() === 'subject');
    let resolvedSubject = subject || title || 'General Subject';
    if (subjectField && subjectField.value) {
      resolvedSubject = subjectField.value;
    }

    const normalizedCategory = category.toUpperCase();
    const normalizedSubcategory = subcategory.charAt(0).toUpperCase() + subcategory.slice(1).toLowerCase();

    // 4. Save Course to Supabase
    const { data: savedCourse, error: insertError } = await supabaseAdmin
      .from('courses')
      .insert({
        title: title || resolvedSubject || 'Untitled Course',
        subject: resolvedSubject,
        description: description || '',
        category: normalizedCategory,
        subcategory: normalizedSubcategory,
        paper_id: String(paperId),
        paper_name: paperName || '',
        course_type: courseType || `${normalizedCategory} ${normalizedSubcategory}`,
        no_of_lecture: noOfLecture || '',
        books: books || '',
        video_language: videoLanguage || 'Hindi',
        video_run_on: videoRunOn || '',
        timing: timing || '',
        doubt_solving: doubtSolving || '',
        support_mail: supportMail || '',
        support_call: supportCall || '',
        validity_start_from: validityStartFrom || '',
        faculty_id: resolvedFacultyId,
        faculty_name: facultyFullName,
        faculty_slug: resolvedFacultySlug,
        institute_id: resolvedInstituteId,
        institute_name: resolvedInstitute || '',
        poster_url: posterUrl,
        poster_public_id: posterPath,
        mode_attempt_pricing: flatPricing,
        custom_details: parsedCustomDetails,
        cost_price: flatPricing[0]?.costPrice || 0,
        selling_price: flatPricing[0]?.sellingPrice || 0,
        is_active: true
      })
      .select('*')
      .single();

    if (insertError) throw insertError;

    console.log('✅ Course added successfully in Supabase!');

    // Map response model keys to mimic Mongo course schema for client compatibility
    const responseCourse = mapCourseToFrontend(savedCourse);

    res.status(201).json({
      success: true,
      message: 'Course added successfully',
      course: responseCourse
    });

  } catch (error) {
    return handleControllerError(error, 'Course creation', res);
  }
};

// @desc    Get all courses by faculty slug
// @route   GET /api/courses/faculty/:facultySlug
// @access  Public
exports.getCoursesByFaculty = async (req, res) => {
  try {
    const { facultySlug } = req.params;

    const { data: courses, error } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('faculty_slug', facultySlug)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Map snake_case DB fields to camelCase for frontend compatibility
    const mappedCourses = mapCoursesToFrontend(courses);

    res.status(200).json({ courses: mappedCourses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get courses by category, subcategory, and paper
// @route   GET /api/courses/:category/:subcategory/:paperId
// @access  Public
exports.getCoursesByPaper = async (req, res) => {
  try {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    const { category, subcategory, paperId } = req.params;
    console.log(`🔍 Querying Supabase courses for Category=${category}, Subcategory=${subcategory}, Paper=${paperId}`);

    const requestedCategory = category.toUpperCase().trim();
    const requestedSubcategory = subcategory.toLowerCase().trim();
    const requestedPaperId = paperId.replace(/\D/g, ''); // Numeric part only

    // PostgreSQL subcategory normalization mapping
    let subquery = requestedSubcategory;
    if (subquery === 'inter' || subquery === 'intermediate') {
      subquery = 'Inter';
    } else if (subquery === 'final') {
      subquery = 'Final';
    } else if (subquery === 'foundation') {
      subquery = 'Foundation';
    }

    // Direct database query with filters
    const { data: courses, error } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('category', requestedCategory)
      .ilike('subcategory', `%${subquery}%`)
      .eq('paper_id', requestedPaperId)
      .eq('is_active', true);


    if (error) throw error;

    const mapped = mapCoursesToFrontend(courses);

    console.log(`✅ Supabase query complete: Found ${mapped.length} matching courses`);
    res.status(200).json({ courses: mapped });

  } catch (error) {
    console.error('❌ Error fetching courses by paper:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { facultySlug, courseIndex } = req.params;
    const updateData = req.body;
    const idx = parseInt(courseIndex);

    let targetCourse = null;
    const isCourseUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseIndex);
    const isMongoId = /^[0-9a-f]{24}$/i.test(courseIndex);

    if (facultySlug === 'by-id' || isCourseUuid || isMongoId) {
      const idColumn = isCourseUuid ? 'id' : 'mongo_id';
      const { data: course, error: fetchErr } = await supabaseAdmin
        .from('courses')
        .select('*')
        .eq(idColumn, courseIndex)
        .maybeSingle();

      if (fetchErr) throw fetchErr;
      targetCourse = course;
    } else {
      // Legacy route support: get courses for faculty, sorted by created_at
      const { data: courses, error: fetchErr } = await supabaseAdmin
        .from('courses')
        .select('*')
        .eq('faculty_slug', facultySlug)
        .order('created_at', { ascending: true });

      if (fetchErr) throw fetchErr;

      if (courses && idx >= 0 && idx < courses.length) {
        targetCourse = courses[idx];
      }
    }

    if (!targetCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Handle poster file upload if present
    let posterUrl = targetCourse.poster_url;
    let posterPath = targetCourse.poster_public_id;
    if (req.file) {
      const uploadResult = await uploadToSupabaseStorage(req.file, 'courses');
      posterUrl = uploadResult.url;
      posterPath = uploadResult.publicId;
    }

    // Parse custom details
    let parsedCustomDetails = targetCourse.custom_details || [];
    if (updateData.customDetails) {
      try {
        parsedCustomDetails = JSON.parse(updateData.customDetails);
      } catch (e) {
        console.error('⚠️ Failed to parse customDetails on update');
      }
    }

    // Extract faculty from custom details if present
    const facultyField = parsedCustomDetails.find(d => d.fieldType === 'faculty');
    let resolvedFacultySlug = updateData.facultySlug !== undefined ? updateData.facultySlug : targetCourse.faculty_slug;
    if (facultyField && facultyField.value) {
      resolvedFacultySlug = facultyField.value;
    }

    let resolvedFacultyId = targetCourse.faculty_id;
    let facultyFullName = targetCourse.faculty_name;

    if (resolvedFacultySlug !== targetCourse.faculty_slug) {
      if (resolvedFacultySlug && resolvedFacultySlug.trim() !== '' && resolvedFacultySlug.toLowerCase() !== 'n-a') {
        const { data: fac } = await supabaseAdmin
          .from('faculties')
          .select('*')
          .eq('slug', resolvedFacultySlug)
          .maybeSingle();
        if (fac) {
          resolvedFacultyId = fac.id;
          facultyFullName = fac.first_name + (fac.last_name ? ' ' + fac.last_name : '');
        } else {
          resolvedFacultyId = null;
          facultyFullName = null;
        }
      } else {
        resolvedFacultyId = null;
        facultyFullName = null;
        resolvedFacultySlug = null;
      }
    }

    // Extract institute from custom details if present
    const instituteField = parsedCustomDetails.find(d => d.fieldType === 'institute');
    let resolvedInstitute = updateData.institute !== undefined ? updateData.institute : targetCourse.institute_name;
    if (instituteField && instituteField.value) {
      resolvedInstitute = instituteField.value;
    }

    let resolvedInstituteId = targetCourse.institute_id;
    if (resolvedInstitute !== targetCourse.institute_name) {
      if (resolvedInstitute && resolvedInstitute.trim() !== '' && resolvedInstitute.toLowerCase() !== 'n-a') {
        const { data: inst } = await supabaseAdmin
          .from('institutes')
          .select('id')
          .eq('name', resolvedInstitute)
          .maybeSingle();
        if (inst) {
          resolvedInstituteId = inst.id;
        } else {
          resolvedInstituteId = null;
        }
      } else {
        resolvedInstituteId = null;
        resolvedInstitute = null;
      }
    }

    // Extract subject from custom details if present
    const subjectField = parsedCustomDetails.find(d => d.label && d.label.toLowerCase() === 'subject');
    let resolvedSubject = updateData.subject !== undefined ? updateData.subject : targetCourse.subject;
    if (subjectField && subjectField.value) {
      resolvedSubject = subjectField.value;
    }

    const normalizeString = (value, fallback = '') => {
      if (value === undefined || value === null) return fallback;
      return String(value).trim();
    };

    const normalizedCategory = updateData.category
      ? normalizeString(updateData.category).toUpperCase()
      : targetCourse.category;
    const rawSubcategory = updateData.subcategory
      ? normalizeString(updateData.subcategory)
      : targetCourse.subcategory;
    const normalizedSubcategory = rawSubcategory
      ? rawSubcategory.charAt(0).toUpperCase() + rawSubcategory.slice(1).toLowerCase()
      : '';
    const resolvedCourseType = normalizeString(updateData.courseType, targetCourse.course_type)
      || `${normalizedCategory || ''} ${normalizedSubcategory || ''}`.trim()
      || targetCourse.course_type
      || 'Course';

    // Map properties from body
    const sqlData = {
      title: normalizeString(updateData.title, targetCourse.title) || 'Untitled Course',
      subject: resolvedSubject || '',
      description: updateData.description !== undefined ? updateData.description : targetCourse.description,
      category: normalizedCategory,
      subcategory: normalizedSubcategory,
      paper_id: updateData.paperId !== undefined ? String(updateData.paperId) : targetCourse.paper_id,
      paper_name: updateData.paperName || targetCourse.paper_name,
      course_type: resolvedCourseType,
      // Dynamic details
      custom_details: parsedCustomDetails,
      faculty_id: resolvedFacultyId,
      faculty_name: facultyFullName,
      faculty_slug: resolvedFacultySlug,
      institute_id: resolvedInstituteId,
      institute_name: resolvedInstitute || '',
      // Maintain old properties just in case
      no_of_lecture: updateData.noOfLecture || targetCourse.no_of_lecture,
      books: updateData.books || targetCourse.books,
      video_language: updateData.videoLanguage || targetCourse.video_language,
      video_run_on: updateData.videoRunOn || targetCourse.video_run_on,
      timing: updateData.timing || targetCourse.timing,
      doubt_solving: updateData.doubtSolving || targetCourse.doubt_solving,
      support_mail: updateData.supportMail || targetCourse.support_mail,
      support_call: updateData.supportCall || targetCourse.support_call,
      validity_start_from: updateData.validityStartFrom || targetCourse.validity_start_from,
      poster_url: posterUrl,
      poster_public_id: posterPath,
      is_active: updateData.isActive !== undefined ? updateData.isActive : targetCourse.is_active,
      updated_at: new Date().toISOString()
    };

    if (updateData.modeAttemptPricing) {
      try {
        const pricing = JSON.parse(updateData.modeAttemptPricing);
        const flatPricing = [];
        if (Array.isArray(pricing)) {
          pricing.forEach(modeGroup => {
            const modeVal = modeGroup.mode || '';
            const modeLabelVal = modeGroup.modeLabel || 'Mode';
            if (modeGroup.attempts && Array.isArray(modeGroup.attempts)) {
              modeGroup.attempts.forEach(att => {
                flatPricing.push({
                  mode: modeVal,
                  modeLabel: modeLabelVal,
                  attempt: att.attempt || '',
                  attemptLabel: att.attemptLabel || 'Exam Term / Attempt',
                  validity: att.validity || '',
                  validityLabel: att.validityLabel || 'Validity',
                  costPrice: Number(att.costPrice) || 0,
                  sellingPrice: Number(att.sellingPrice) || 0,
                  description: att.description || ''
                });
              });
            } else if (modeGroup.attempt) {
              flatPricing.push({
                mode: modeVal,
                modeLabel: modeLabelVal,
                attempt: modeGroup.attempt,
                attemptLabel: modeGroup.attemptLabel || 'Exam Term / Attempt',
                validity: modeGroup.validity || '',
                validityLabel: modeGroup.validityLabel || 'Validity',
                costPrice: Number(modeGroup.costPrice) || 0,
                sellingPrice: Number(modeGroup.sellingPrice) || 0,
                description: modeGroup.description || ''
              });
            }
          });
        }
        sqlData.mode_attempt_pricing = flatPricing;
        sqlData.cost_price = flatPricing[0]?.costPrice || 0;
        sqlData.selling_price = flatPricing[0]?.sellingPrice || 0;
      } catch (err) {
        console.log('⚠️ Failed to parse modeAttemptPricing on update');
      }
    }

    let { error: updateErr } = await supabaseAdmin
      .from('courses')
      .update(sqlData)
      .eq('id', targetCourse.id);

    if (isMissingColumnError(updateErr, 'updated_at')) {
      console.warn('âš ï¸ courses.updated_at column is missing; retrying course update without updated_at');
      const retryData = { ...sqlData };
      delete retryData.updated_at;
      const retry = await supabaseAdmin
        .from('courses')
        .update(retryData)
        .eq('id', targetCourse.id);
      updateErr = retry.error;
    }

    if (updateErr) throw updateErr;

    res.status(200).json({ success: true, message: 'Course updated successfully' });
  } catch (error) {
    return handleControllerError(error, 'Course update', res);
  }
};

// @desc    Delete course (relies on legacy array index routing - resolved to UUID internally)
// @route   DELETE /api/courses/:facultySlug/:courseIndex
// @access  Private/Admin
exports.deleteCourse = async (req, res) => {
  try {
    const { facultySlug, courseIndex } = req.params;
    const idx = parseInt(courseIndex);

    let targetCourse = null;
    const isCourseUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseIndex);
    const isMongoId = /^[0-9a-f]{24}$/i.test(courseIndex);

    if (facultySlug === 'by-id' || isCourseUuid || isMongoId) {
      const idColumn = isCourseUuid ? 'id' : 'mongo_id';
      const { data: course, error: fetchErr } = await supabaseAdmin
        .from('courses')
        .select('id')
        .eq(idColumn, courseIndex)
        .maybeSingle();

      if (fetchErr) throw fetchErr;
      targetCourse = course;
    } else {
      // Legacy route support: get courses for faculty, sorted by created_at
      const { data: courses, error: fetchErr } = await supabaseAdmin
        .from('courses')
        .select('id')
        .eq('faculty_slug', facultySlug)
        .order('created_at', { ascending: true });

      if (fetchErr) throw fetchErr;

      if (courses && idx >= 0 && idx < courses.length) {
        targetCourse = courses[idx];
      }
    }

    if (!targetCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const { error: deleteErr } = await supabaseAdmin
      .from('courses')
      .delete()
      .eq('id', targetCourse.id);

    if (deleteErr) throw deleteErr;

    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    return handleControllerError(error, 'Course deletion', res);
  }
};

// @desc    Delete ALL courses (emergency endpoint)
// @route   DELETE /api/admin/courses/delete-all
// @access  Private/Admin
exports.deleteAllCourses = async (req, res) => {
  try {
    console.log('🧨 DELETING ALL COURSES FROM SUPABASE');

    const { data, error } = await supabaseAdmin
      .from('courses')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
      .select('id');

    if (error) throw error;

    const deletedCount = Array.isArray(data) ? data.length : 0;

    res.status(200).json({
      success: true,
      deletedCount,
      message: `Successfully deleted ${deletedCount} courses`
    });
  } catch (error) {
    return handleControllerError(error, 'All courses deletion', res);
  }
};

// @desc    Get courses by institute
// @route   GET /api/courses/institute/:instituteName
// @access  Public
exports.getCoursesByInstitute = async (req, res) => {
  try {
    const { instituteName } = req.params;

    const { data: courses, error } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('institute_name', instituteName)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const mapped = mapCoursesToFrontend(courses);

    res.status(200).json({ courses: mapped });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Bulk upload courses via CSV data JSON
// @route   POST /api/admin/courses/bulk-upload
// @access  Private/Admin
exports.bulkUploadCourses = async (req, res) => {
  try {
    console.log('🎯 Course controller: bulkUploadCourses called');
    const { courses } = req.body;

    if (!courses || !Array.isArray(courses)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input. An array of courses is required.'
      });
    }

    if (courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No courses provided.'
      });
    }

    console.log(`📋 Received ${courses.length} courses for bulk upload.`);

    const successfulRows = [];
    const failedRows = [];

    // Helper to get slug from faculty name
    const getSlugFromName = (name) => {
      if (!name) return 'n-a';
      return name.trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
        .replace(/^(ca|cma|cs)-/, '');
    };

    // Helper to format custom detail labels
    const getLabelFromKey = (key) => {
      const mappings = {
        faculty_name: 'Faculty',
        institute: 'Institute',
        duration: 'Duration',
        timing: 'Duration',
        no_of_lecture: 'Lectures',
        no_of_lectures: 'Lectures',
        lectures: 'Lectures',
        books: 'Study Materials',
        video_language: 'Language',
        language: 'Language',
        video_run_on: 'Video Run On',
        doubt_solving: 'Doubt Solving',
        support_mail: 'Support Mail',
        support_call: 'Support Call',
        validity: 'Validity',
        validity_start_from: 'Validity'
      };
      if (mappings[key]) return mappings[key];
      return key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    // Process each course sequentially to resolve faculty and format data correctly
    for (let i = 0; i < courses.length; i++) {
      const rowNum = i + 1;
      const c = courses[i];

      // Basic validation
      const title = c.title || c.subject || 'Untitled Course';
      const category = c.category ? c.category.toUpperCase().trim() : '';
      const courseType = c.course_type || '';

      if (category !== 'CA' && category !== 'CMA') {
        failedRows.push({ row: rowNum, error: 'Invalid or missing category. Must be CA or CMA.' });
        continue;
      }

      try {
        // Parse subcategory
        let subcategory = 'Inter'; // Default
        const lowerType = courseType.toLowerCase();
        const lowerSub = (c.subcategory || '').toLowerCase();
        if (lowerType.includes('foundation') || lowerSub.includes('foundation')) {
          subcategory = 'Foundation';
        } else if (lowerType.includes('final') || lowerSub.includes('final')) {
          subcategory = 'Final';
        } else if (lowerType.includes('inter') || lowerType.includes('intermediate') || lowerSub.includes('inter') || lowerSub.includes('intermediate')) {
          subcategory = 'Inter';
        }

        // Parse paper ID from title
        let paperId = '1';
        const paperMatch = title.match(/paper\s*(\d+)/i) || (c.subject && c.subject.match(/paper\s*(\d+)/i)) || (c.paper_id && String(c.paper_id).match(/(\d+)/));
        if (paperMatch && paperMatch[1]) {
          paperId = paperMatch[1];
        }

        // Initialize custom details list
        let customDetails = [];

        // Parse custom_details column if provided explicitly as JSON
        if (c.custom_details) {
          try {
            customDetails = typeof c.custom_details === 'string' ? JSON.parse(c.custom_details) : c.custom_details;
          } catch (e) {
            console.error(`Row ${rowNum}: failed to parse custom_details JSON`);
          }
        }

        // Merge standard CSV columns into customDetails if they aren't already represented
        const ignoredKeys = [
          'category', 'subcategory', 'paper_id', 'paper_name', 'title', 'course_type',
          'custom_details', 'mode_attempt_pricing', 'cost_price', 'selling_price',
          'status', 'rownum', 'isvalid', 'validationerror', 'mode', 'attempt', 'validity'
        ];

        Object.entries(c).forEach(([key, val]) => {
          const normKey = key.toLowerCase().trim();
          if (ignoredKeys.includes(normKey) || val === undefined || val === '') return;

          const label = getLabelFromKey(normKey);

          // Check if already in customDetails
          const exists = customDetails.some(d => d.label === label);
          if (!exists) {
            let fieldType = 'text';
            if (normKey === 'faculty_name') fieldType = 'faculty';
            else if (normKey === 'institute') fieldType = 'institute';
            else if (normKey === 'description') fieldType = 'textarea';

            customDetails.push({
              label,
              value: val,
              fieldType,
              displayOrder: customDetails.length + 1,
              visible: true
            });
          }
        });

        // Resolve faculty from details or columns
        const facultyField = customDetails.find(d => d.fieldType === 'faculty');
        let facultyName = c.faculty_name || (facultyField ? facultyField.value : '');
        let resolvedFacultySlug = c.faculty_slug || '';

        let faculty = null;
        let facultyFullName = null;
        let resolvedFacultyId = null;

        if (facultyName && facultyName.toLowerCase() !== 'n-a' && facultyName.trim() !== '') {
          resolvedFacultySlug = getSlugFromName(facultyName);
          let { data: fac, error: facultyError } = await supabaseAdmin
            .from('faculties')
            .select('*')
            .eq('slug', resolvedFacultySlug)
            .maybeSingle();

          if (facultyError) throw facultyError;

          // Auto-provision faculty if missing
          if (!fac) {
            const hardcodedFaculty = hardcodedFaculties.find(f => f.slug === resolvedFacultySlug);
            let firstName = '';
            let lastName = '';
            let bio = '';

            if (hardcodedFaculty) {
              const parts = hardcodedFaculty.name.replace(/^(CA|CMA|CS)\s+/, '').split(' ');
              firstName = parts[0];
              lastName = parts.slice(1).join(' ') || '';
              bio = `Expert faculty in ${hardcodedFaculty.specialization}`;
            } else {
              const parts = facultyName.replace(/^(CA|CMA|CS)\s+/, '').split(' ');
              firstName = parts[0];
              lastName = parts.slice(1).join(' ') || '';
              bio = `Expert faculty at AcademyWale`;
            }

            const { data: newFac, error: createFacError } = await supabaseAdmin
              .from('faculties')
              .insert({
                first_name: firstName,
                last_name: lastName,
                slug: resolvedFacultySlug,
                bio,
                teaches: [category]
              })
              .select('*')
              .single();

            if (createFacError) throw createFacError;
            faculty = newFac;
          } else {
            faculty = fac;
          }

          if (faculty) {
            resolvedFacultyId = faculty.id;
            facultyFullName = faculty.first_name + (faculty.last_name ? ' ' + faculty.last_name : '');
            resolvedFacultySlug = faculty.slug;

            // Sync value back to dynamic detail
            if (facultyField) {
              facultyField.value = resolvedFacultySlug;
            } else {
              customDetails.push({
                label: 'Faculty',
                value: resolvedFacultySlug,
                fieldType: 'faculty',
                displayOrder: customDetails.length + 1,
                visible: true
              });
            }
          }
        }

        // Resolve institute
        const instituteField = customDetails.find(d => d.fieldType === 'institute');
        let instituteName = c.institute || (instituteField ? instituteField.value : '');
        let resolvedInstituteId = null;

        if (instituteName && instituteName.toLowerCase() !== 'n-a' && instituteName.trim() !== '') {
          const { data: inst } = await supabaseAdmin
            .from('institutes')
            .select('id')
            .eq('name', instituteName)
            .maybeSingle();
          if (inst) {
            resolvedInstituteId = inst.id;
          }

          // Sync value back to dynamic detail
          if (instituteField) {
            instituteField.value = instituteName;
          } else {
            customDetails.push({
              label: 'Institute',
              value: instituteName,
              fieldType: 'institute',
              displayOrder: customDetails.length + 1,
              visible: true
            });
          }
        }

        // Resolve subject
        const subjectField = customDetails.find(d => d.label && d.label.toLowerCase() === 'subject');
        let resolvedSubject = c.subject || (subjectField ? subjectField.value : '') || title;
        if (resolvedSubject) {
          if (!subjectField) {
            customDetails.push({
              label: 'Subject',
              value: resolvedSubject,
              fieldType: 'text',
              displayOrder: customDetails.length + 1,
              visible: true
            });
          }
        }

        // Resolve pricing
        let flatPricing = [];
        if (c.mode_attempt_pricing) {
          try {
            const parsedPricing = typeof c.mode_attempt_pricing === 'string' ? JSON.parse(c.mode_attempt_pricing) : c.mode_attempt_pricing;
            if (Array.isArray(parsedPricing)) {
              parsedPricing.forEach(modeGroup => {
                const modeVal = modeGroup.mode || '';
                const modeLabelVal = modeGroup.modeLabel || 'Mode';
                if (modeGroup.attempts && Array.isArray(modeGroup.attempts)) {
                  modeGroup.attempts.forEach(attemptData => {
                    flatPricing.push({
                      mode: modeVal,
                      modeLabel: modeLabelVal,
                      attempt: attemptData.attempt || '',
                      attemptLabel: attemptData.attemptLabel || 'Exam Term / Attempt',
                      validity: attemptData.validity || '',
                      validityLabel: attemptData.validityLabel || 'Validity',
                      costPrice: Number(attemptData.costPrice) || 0,
                      sellingPrice: Number(attemptData.sellingPrice) || 0,
                      description: attemptData.description || ''
                    });
                  });
                } else if (modeGroup.attempt) {
                  flatPricing.push({
                    mode: modeVal,
                    modeLabel: modeLabelVal,
                    attempt: modeGroup.attempt,
                    attemptLabel: modeGroup.attemptLabel || 'Exam Term / Attempt',
                    validity: modeGroup.validity || '',
                    validityLabel: modeGroup.validityLabel || 'Validity',
                    costPrice: Number(modeGroup.costPrice) || 0,
                    sellingPrice: Number(modeGroup.sellingPrice) || 0,
                    description: modeGroup.description || ''
                  });
                }
              });
            }
          } catch (e) {
            console.error(`Row ${rowNum}: failed to parse mode_attempt_pricing JSON`);
          }
        }

        // Fallback to mode/attempt columns if no explicit pricing JSON is provided
        if (flatPricing.length === 0) {
          const sellingPrice = Number(c.selling_price) || 0;
          const costPrice = Number(c.cost_price) || sellingPrice;
          const mode = c.mode || 'Recorded Video';
          const attempt = c.attempt || '1.5 Views & 6 Months Validity';

          flatPricing = [{
            mode,
            modeLabel: 'Mode',
            attempt,
            attemptLabel: 'Exam Term / Attempt',
            validity: c.validity || '6 Months',
            validityLabel: 'Validity',
            costPrice,
            sellingPrice,
            description: ''
          }];
        }

        // Build course record
        const courseRecord = {
          title,
          subject: resolvedSubject,
          description: c.description || '',
          category,
          subcategory,
          paper_id: String(paperId),
          paper_name: c.paper_name || '',
          course_type: courseType || `${category} ${subcategory}`,
          no_of_lecture: c.duration || c.no_of_lecture || '',
          books: c.books || 'Study Material Included',
          video_language: c.language || c.video_language || 'Hindi',
          video_run_on: c.video_run_on || 'Windows / Android',
          timing: c.duration || c.timing || '',
          doubt_solving: c.doubt_solving || 'WhatsApp Support',
          support_mail: c.support_mail || 'support@academywale.com',
          support_call: c.support_call || '+91 9693320108',
          validity_start_from: c.validity || c.validity_start_from || 'From Date of Activation',
          faculty_id: resolvedFacultyId,
          faculty_name: facultyFullName,
          faculty_slug: resolvedFacultySlug,
          institute_id: resolvedInstituteId,
          institute_name: instituteName || '',
          poster_url: c.image_url || c.poster_url || '',
          mode_attempt_pricing: flatPricing,
          custom_details: customDetails,
          cost_price: flatPricing[0]?.costPrice || 0,
          selling_price: flatPricing[0]?.sellingPrice || 0,
          is_active: c.status !== 'inactive'
        };

        successfulRows.push(courseRecord);
      } catch (err) {
        failedRows.push({ row: rowNum, error: `Failed mapping details: ${err.message}` });
      }
    }

    if (successfulRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid courses could be prepared for insertion.',
        errors: failedRows
      });
    }

    // Bulk insert into courses
    console.log(`📤 Inserting ${successfulRows.length} mapped courses into Supabase.`);
    const { data: insertedData, error: insertError } = await supabaseAdmin
      .from('courses')
      .insert(successfulRows)
      .select();

    if (insertError) {
      throw insertError;
    }

    console.log(`✅ Bulk insertion complete: inserted ${insertedData.length} records.`);

    res.status(201).json({
      success: true,
      message: `Successfully uploaded ${insertedData.length} courses!`,
      successCount: insertedData.length,
      failedCount: failedRows.length,
      errors: failedRows
    });

  } catch (error) {
    return handleControllerError(error, 'Bulk course upload', res);
  }
};

exports.reorderCourses = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, error: 'Items array is required' });
    }

    const isUuid = (val) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(val));

    for (const item of items) {
      if (!item.id) continue;
      const order = Number(item.displayOrder !== undefined ? item.displayOrder : (item.sequence || 0));
      const targetId = String(item.id);
      const field = isUuid(targetId) ? 'id' : 'mongo_id';

      // Fetch existing custom_details
      const { data: dbCourse } = await supabaseAdmin
        .from('courses')
        .select('custom_details')
        .eq(field, targetId)
        .maybeSingle();

      let updatedCustom;
      if (dbCourse && Array.isArray(dbCourse.custom_details)) {
        updatedCustom = dbCourse.custom_details.filter(i => i && i.fieldType !== '__DISPLAY_ORDER__' && i.label !== '__DISPLAY_ORDER__');
        updatedCustom.push({ fieldType: '__DISPLAY_ORDER__', label: '__DISPLAY_ORDER__', value: Number(order) });
      } else if (dbCourse && typeof dbCourse.custom_details === 'object' && dbCourse.custom_details !== null) {
        updatedCustom = { ...dbCourse.custom_details, display_order: Number(order), displayOrder: Number(order) };
      } else {
        updatedCustom = [{ fieldType: '__DISPLAY_ORDER__', label: '__DISPLAY_ORDER__', value: Number(order) }];
      }

      const { error } = await supabaseAdmin
        .from('courses')
        .update({ 
          custom_details: updatedCustom,
          updated_at: new Date().toISOString()
        })
        .eq(field, targetId);

      if (error) {
        console.warn(`Failed to update display_order for course ${targetId}:`, error.message);
      }
    }

    res.json({ success: true, message: 'Courses sequence updated successfully' });
  } catch (err) {
    console.error('Error reordering courses:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addNewCourseToFaculty = exports.addCourseToFaculty;

module.exports = exports;

