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
      courseType, modeAttemptPricing, title, validityStartFrom
    } = req.body;

    // Faculty slug is required
    if (!facultySlug || facultySlug.trim() === '' || facultySlug.toLowerCase() === 'n-a') {
      return res.status(400).json({ 
        success: false, 
        message: 'Faculty selection is required. Please select a valid faculty.' 
      });
    }

    if (!category || !subcategory || !paperId || !subject) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // 1. Resolve Faculty in Supabase
    let { data: faculty, error: facultyError } = await supabaseAdmin
      .from('faculties')
      .select('*')
      .eq('slug', facultySlug)
      .maybeSingle();

    if (facultyError) throw facultyError;

    // If not found in DB, check hardcoded faculties list
    if (!faculty) {
      const hardcodedFaculty = hardcodedFaculties.find(f => f.slug === facultySlug);
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
      } else {
        return res.status(404).json({ error: 'Faculty not found' });
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
        if (modeGroup.attempts && Array.isArray(modeGroup.attempts)) {
          modeGroup.attempts.forEach(attemptData => {
            flatPricing.push({
              mode: modeVal,
              attempt: attemptData.attempt || '',
              validity: attemptData.validity || '',
              costPrice: Number(attemptData.costPrice) || 0,
              sellingPrice: Number(attemptData.sellingPrice) || 0
            });
          });
        } else if (modeGroup.attempt) {
          flatPricing.push({
            mode: modeVal,
            attempt: modeGroup.attempt,
            validity: modeGroup.validity || '',
            costPrice: Number(modeGroup.costPrice) || 0,
            sellingPrice: Number(modeGroup.sellingPrice) || 0
          });
        }
      });
    }

    // Upload poster image if present
    let posterUrl = '';
    let posterPath = '';
    if (req.file) {
      const uploadResult = await uploadToSupabaseStorage(req.file, 'courses');
      posterUrl = uploadResult.url;
      posterPath = uploadResult.publicId;
    }

    // 3. Resolve Institute ID if present
    let instituteId = null;
    if (institute) {
      const { data: inst } = await supabaseAdmin
        .from('institutes')
        .select('id')
        .eq('name', institute)
        .maybeSingle();
      if (inst) {
        instituteId = inst.id;
      }
    }

    const facultyFullName = faculty.first_name + (faculty.last_name ? ' ' + faculty.last_name : '');
    const normalizedCategory = category.toUpperCase();
    const normalizedSubcategory = subcategory.charAt(0).toUpperCase() + subcategory.slice(1).toLowerCase();

    // 4. Save Course to Supabase
    const { data: savedCourse, error: insertError } = await supabaseAdmin
      .from('courses')
      .insert({
        title: title || subject || 'Untitled Course',
        subject,
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
        faculty_id: faculty.id,
        faculty_name: facultyFullName,
        faculty_slug: faculty.slug,
        institute_id: instituteId,
        institute_name: institute || '',
        poster_url: posterUrl,
        poster_public_id: posterPath,
        mode_attempt_pricing: flatPricing,
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

    // Direct database query with filters - no full-collection scans needed!
    const { data: courses, error } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('category', requestedCategory)
      .ilike('subcategory', `%${subquery}%`)
      .eq('paper_id', requestedPaperId)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const mapped = mapCoursesToFrontend(courses);

    console.log(`✅ Supabase query complete: Found ${mapped.length} matching courses`);
    res.status(200).json({ courses: mapped });

  } catch (error) {
    console.error('❌ Error fetching courses by paper:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update course (relies on legacy array index routing - resolved to UUID internally)
// @route   PUT /api/courses/:facultySlug/:courseIndex
// @access  Private/Admin
exports.updateCourse = async (req, res) => {
  try {
    const { facultySlug, courseIndex } = req.params;
    const updateData = req.body;
    const idx = parseInt(courseIndex);

    // Get courses for faculty, sorted by created_at
    const { data: courses, error: fetchErr } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('faculty_slug', facultySlug)
      .order('created_at', { ascending: true });

    if (fetchErr) throw fetchErr;

    if (!courses || idx < 0 || idx >= courses.length) {
      return res.status(404).json({ error: 'Course not found at this index' });
    }

    const targetCourse = courses[idx];

    // Handle poster file upload if present
    let posterUrl = targetCourse.poster_url;
    let posterPath = targetCourse.poster_public_id;
    if (req.file) {
      const uploadResult = await uploadToSupabaseStorage(req.file, 'courses');
      posterUrl = uploadResult.url;
      posterPath = uploadResult.publicId;
    }

    // Map properties from body
    const sqlData = {
      title: updateData.title || targetCourse.title,
      subject: updateData.subject || targetCourse.subject,
      description: updateData.description !== undefined ? updateData.description : targetCourse.description,
      category: updateData.category ? updateData.category.toUpperCase() : targetCourse.category,
      subcategory: updateData.subcategory ? updateData.subcategory.charAt(0).toUpperCase() + updateData.subcategory.slice(1).toLowerCase() : targetCourse.subcategory,
      paper_id: updateData.paperId !== undefined ? String(updateData.paperId) : targetCourse.paper_id,
      paper_name: updateData.paperName || targetCourse.paper_name,
      course_type: updateData.courseType || targetCourse.course_type,
      no_of_lecture: updateData.noOfLecture || targetCourse.no_of_lecture,
      books: updateData.books || targetCourse.books,
      video_language: updateData.videoLanguage || targetCourse.video_language,
      video_run_on: updateData.videoRunOn || targetCourse.video_run_on,
      timing: updateData.timing || targetCourse.timing,
      doubt_solving: updateData.doubtSolving || targetCourse.doubt_solving,
      support_mail: updateData.supportMail || targetCourse.support_mail,
      support_call: updateData.supportCall || targetCourse.support_call,
      validity_start_from: updateData.validityStartFrom || targetCourse.validity_start_from,
      institute_name: updateData.institute || targetCourse.institute_name,
      poster_url: posterUrl,
      poster_public_id: posterPath,
      is_active: updateData.isActive !== undefined ? updateData.isActive : targetCourse.is_active,
      updated_at: new Date()
    };

    if (updateData.modeAttemptPricing) {
      try {
        const pricing = JSON.parse(updateData.modeAttemptPricing);
        const flatPricing = [];
        if (Array.isArray(pricing)) {
          pricing.forEach(modeGroup => {
            const modeVal = modeGroup.mode || '';
            if (modeGroup.attempts && Array.isArray(modeGroup.attempts)) {
              modeGroup.attempts.forEach(att => {
                flatPricing.push({
                  mode: modeVal,
                  attempt: att.attempt || '',
                  validity: att.validity || '',
                  costPrice: Number(att.costPrice) || 0,
                  sellingPrice: Number(att.sellingPrice) || 0
                });
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

    const { error: updateErr } = await supabaseAdmin
      .from('courses')
      .update(sqlData)
      .eq('id', targetCourse.id);

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

    // Get courses for faculty, sorted by created_at
    const { data: courses, error: fetchErr } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('faculty_slug', facultySlug)
      .order('created_at', { ascending: true });

    if (fetchErr) throw fetchErr;

    if (!courses || idx < 0 || idx >= courses.length) {
      return res.status(404).json({ error: 'Course not found at this index' });
    }

    const targetCourse = courses[idx];

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
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all rows

    if (error) throw error;
    
    res.status(200).json({ 
      success: true, 
      message: `Successfully removed all courses from database`
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

    // Process each course sequentially to resolve faculty and format data correctly
    for (let i = 0; i < courses.length; i++) {
      const rowNum = i + 1;
      const c = courses[i];
      
      // Basic validation
      const title = c.title || c.subject;
      const subject = c.subject;
      const category = c.category ? c.category.toUpperCase().trim() : '';
      const courseType = c.course_type || '';
      const facultyName = c.faculty_name || '';
      const sellingPrice = Number(c.selling_price);

      if (!title) {
        failedRows.push({ row: rowNum, error: 'Missing title/subject' });
        continue;
      }
      if (!subject) {
        failedRows.push({ row: rowNum, error: 'Missing subject' });
        continue;
      }
      if (category !== 'CA' && category !== 'CMA') {
        failedRows.push({ row: rowNum, error: 'Invalid or missing category. Must be CA or CMA.' });
        continue;
      }
      if (isNaN(sellingPrice) || sellingPrice < 0) {
        failedRows.push({ row: rowNum, error: 'Invalid or missing selling_price' });
        continue;
      }
      if (!facultyName) {
        failedRows.push({ row: rowNum, error: 'Missing faculty_name' });
        continue;
      }

      try {
        // Resolve Faculty
        const facultySlug = getSlugFromName(facultyName);
        
        let { data: faculty, error: facultyError } = await supabaseAdmin
          .from('faculties')
          .select('*')
          .eq('slug', facultySlug)
          .maybeSingle();

        if (facultyError) throw facultyError;

        // Auto-provision faculty if missing
        if (!faculty) {
          const hardcodedFaculty = hardcodedFaculties.find(f => f.slug === facultySlug);
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
              slug: facultySlug,
              bio,
              teaches: [category]
            })
            .select('*')
            .single();

          if (createFacError) throw createFacError;
          faculty = newFac;
        }

        const facultyFullName = faculty.first_name + (faculty.last_name ? ' ' + faculty.last_name : '');

        // Determine subcategory from courseType
        let subcategory = 'Inter'; // Default
        const lowerType = courseType.toLowerCase();
        if (lowerType.includes('foundation')) {
          subcategory = 'Foundation';
        } else if (lowerType.includes('final')) {
          subcategory = 'Final';
        } else if (lowerType.includes('inter') || lowerType.includes('intermediate')) {
          subcategory = 'Inter';
        }

        // Parse paper ID from title
        let paperId = '1';
        const paperMatch = title.match(/paper\s*(\d+)/i) || subject.match(/paper\s*(\d+)/i);
        if (paperMatch && paperMatch[1]) {
          paperId = paperMatch[1];
        }

        // Construct pricing JSONB
        const costPrice = Number(c.cost_price) || sellingPrice;
        const mode = c.mode || 'Recorded Video';
        const attempt = c.attempt || '1.5 Views & 6 Months Validity';
        
        const flatPricing = [{
          mode,
          attempt,
          costPrice,
          sellingPrice
        }];

        // Build course record
        const courseRecord = {
          title,
          subject,
          description: c.description || '',
          category,
          subcategory,
          paper_id: String(paperId),
          paper_name: c.paper_name || '',
          course_type: courseType || `${category} ${subcategory}`,
          no_of_lecture: c.duration || '',
          books: c.books || 'Study Material Included',
          video_language: c.language || 'Hindi',
          video_run_on: c.video_run_on || 'Windows / Android',
          timing: c.duration || '',
          doubt_solving: 'WhatsApp Support',
          support_mail: 'support@academywale.com',
          support_call: '+91 9693320108',
          validity_start_from: c.validity || 'From Date of Activation',
          faculty_id: faculty.id,
          faculty_name: facultyFullName,
          faculty_slug: faculty.slug,
          institute_name: c.institute || '',
          poster_url: c.image_url || '',
          mode_attempt_pricing: flatPricing,
          cost_price: costPrice,
          selling_price: sellingPrice,
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

exports.addNewCourseToFaculty = exports.addCourseToFaculty;

module.exports = exports;
