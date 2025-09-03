// Import the mode mapper utility
const { mapMode } = require('../utils/modeMapper');
const Faculty = require('../model/Faculty.model');
const mongoose = require('mongoose');

// Data normalization function to fix existing course data
const normalizeCourseData = (course) => {
  // Normalize paperId to string
  if (course.paperId && typeof course.paperId === 'number') {
    course.paperId = String(course.paperId);
  }
  // Normalize subcategory to lowercase
  if (course.subcategory) {
    course.subcategory = course.subcategory.toLowerCase();
  }
  // Normalize category to uppercase
  if (course.category) {
    course.category = course.category.toUpperCase();
  }
  return course;
};

// Faculty-only course creation: all courses must belong to a specific faculty
exports.addCourseToFaculty = async (req, res) => {
  try {
    console.log('🎯 Course controller: addCourseToFaculty called');
    console.log('📋 Request body:', req.body);
    console.log('📎 File received:', req.file ? 'Yes' : 'No');
    
    if (req.file) {
      console.log('📄 File details:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      });
    }
    
    const {
      category, subcategory, paperId, paperName, subject, facultySlug,
      institute, description, noOfLecture, books, videoLanguage,
      videoRunOn, doubtSolving, supportMail, supportCall, timing,
      courseType, modeAttemptPricing, title
    } = req.body;

    const posterUrl = req.file ? req.file.path : '';

    // Faculty slug is now required
    if (!facultySlug || facultySlug.trim() === '' || facultySlug.toLowerCase() === 'n-a') {
      return res.status(400).json({ 
        success: false, 
        message: 'Faculty selection is required. Please select a valid faculty.' 
      });
    }

    // Otherwise, add to faculty (supports hardcoded)
    if (!category || !subcategory || !paperId || !subject) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    let faculty = await Faculty.findOne({ slug: facultySlug });
    if (!faculty) {
      const hardcodedFaculty = hardcodedFaculties.find(f => f.slug === facultySlug);
      if (hardcodedFaculty) {
        faculty = new Faculty({
          firstName: hardcodedFaculty.name.replace(/^(CA|CMA|CS)\s+/, ''),
          lastName: '',
          slug: hardcodedFaculty.slug,
          specialization: hardcodedFaculty.specialization,
          bio: `Expert ${hardcodedFaculty.specialization} faculty with years of professional experience.`,
          courses: []
        });
        await faculty.save();
      } else {
        return res.status(404).json({ error: 'Faculty not found' });
      }
    }

    let parsedModeAttemptPricing = [];
    try {
      parsedModeAttemptPricing = JSON.parse(modeAttemptPricing);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid mode attempt pricing format' });
    }

    const facultyName = faculty.firstName + (faculty.lastName ? ' ' + faculty.lastName : '');
    // Normalize category and subcategory for consistent filtering
    const normalizedCategory = category ? category.toUpperCase() : '';
    const normalizedSubcategory = subcategory ? subcategory.toLowerCase() : '';
    
    let newCourse = {
      facultyName,
      subject,
      noOfLecture,
      books,
      videoLanguage,
      videoRunOn,
      doubtSolving,
      supportMail,
      supportCall,
      posterUrl,
      timing,
      description,
      courseType: courseType || `${normalizedCategory} ${normalizedSubcategory}`,
      institute,
      category: normalizedCategory,
      subcategory: normalizedSubcategory,
      paperId: String(paperId), // Store as string for consistent filtering
      paperName,
      modeAttemptPricing: parsedModeAttemptPricing,
      costPrice: parsedModeAttemptPricing[0]?.attempts[0]?.costPrice || 0,
      sellingPrice: parsedModeAttemptPricing[0]?.attempts[0]?.sellingPrice || 0,
      // Map the mode to only allowed values
      mode: mapMode(parsedModeAttemptPricing[0]?.mode),
      modes: parsedModeAttemptPricing.map(m => mapMode(m.mode)),
      durations: parsedModeAttemptPricing.flatMap(m => m.attempts.map(a => a.attempt))
    };
    
    console.log(`📝 Normalized course data: category="${normalizedCategory}", subcategory="${normalizedSubcategory}", paperId=${paperId}`);
    
    console.log('⚠️ Original mode value:', parsedModeAttemptPricing[0]?.mode);
    console.log('✅ Mapped mode value:', newCourse.mode);
    
    // No need for complex validation - we've already mapped to allowed values
    
    // Make absolutely sure mode is a valid value from allowed list
    const VALID_MODES = ['Live Watching', 'Recorded Video', 'Live Class', 'Hybrid'];
    newCourse.mode = VALID_MODES.includes(parsedModeAttemptPricing[0]?.mode) 
      ? parsedModeAttemptPricing[0]?.mode 
      : 'Live Watching';
    
    // Ensure isActive flag is set to true for the course
    newCourse.isActive = true;

    // Make sure the course has all required fields for proper display
    if (!newCourse.title) newCourse.title = newCourse.subject;
    if (!newCourse.sellingPrice) newCourse.sellingPrice = 0;
    if (!newCourse.costPrice) newCourse.costPrice = 0;
    
    // Add course to faculty
    faculty.courses.push(newCourse);
    
    try {
      // Try normal save
      await faculty.save();
      console.log('✅ Course controller: Course added successfully to faculty');
      
      // Also create a standalone course for better visibility
      try {
        const Course = require('../model/Course.model');
        const standaloneCourse = new Course({
          ...newCourse,
          facultyId: faculty._id,
          facultySlug: faculty.slug,
          isActive: true
        });
        await standaloneCourse.save();
        console.log('✅ Course also saved as standalone course for better visibility');
      } catch (standaloneError) {
        console.error('⚠️ Could not save as standalone course:', standaloneError.message);
        // Continue even if standalone save fails
      }
      
      res.status(201).json({ success: true, message: 'Course added successfully', course: newCourse });
    } catch (saveError) {
      // Check if it's a mode validation error
      if (saveError.name === 'ValidationError') {
        
        console.log('⚠️ Validation error detected, attempting direct database update');
        
        try {
          // Use direct MongoDB update to bypass validation
          const mongoose = require('mongoose');
          await mongoose.model('Faculty').updateOne(
            { _id: faculty._id },
            { $push: { courses: newCourse } }
          );
          
          console.log('✅ Course saved successfully using direct database update');
          
          // Also create a standalone course for better visibility
          try {
            const Course = require('../model/Course.model');
            const standaloneCourse = new Course({
              ...newCourse,
              facultyId: faculty._id,
              facultySlug: faculty.slug,
              isActive: true
            });
            await standaloneCourse.save();
            console.log('✅ Course also saved as standalone course for better visibility');
          } catch (standaloneError) {
            console.error('⚠️ Could not save as standalone course:', standaloneError.message);
            // Continue even if standalone save fails
          }
          
          res.status(201).json({
            success: true,
            message: 'Course added successfully (using direct database update)',
            course: newCourse
          });
        } catch (directUpdateError) {
          console.error('❌ Direct database update failed:', directUpdateError);
          throw directUpdateError;
        }
      } else {
        // Not a mode validation error, rethrow
        throw saveError;
      }
    }
  } catch (error) {
    console.error('❌ Course controller error:', error);
    console.error('❌ Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      console.error('❌ Mongoose validation error:', error.errors);
      
      // Check if it's a mode validation error
      const modeError = error.errors?.['courses.0.mode'];
      if (modeError && modeError.kind === 'enum') {
        const invalidMode = modeError.value;
        console.error(`❌ Invalid mode value: "${invalidMode}"`);
        
        // Try to fix the mode value
        try {
          // If we can find the faculty
          if (faculty && faculty.courses && faculty.courses.length > 0) {
            // Get the last course (the one that failed validation)
            const lastCourseIndex = faculty.courses.length - 1;
            
            // Update the mode to a valid enum value
            faculty.courses[lastCourseIndex].mode = 'Live Watching';
            
            // Save again
            await faculty.save();
            
            console.log('✅ Course saved successfully after fixing mode value');
            return res.status(201).json({ 
              success: true, 
              message: 'Course added successfully (mode fixed automatically)', 
              course: faculty.courses[lastCourseIndex],
              warning: `Mode "${invalidMode}" was changed to "Live Watching"` 
            });
          }
        } catch (retryError) {
          console.error('❌ Failed to retry saving with fixed mode:', retryError);
        }
      }
      
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
        message: error.message,
        suggestion: 'This may be due to an invalid mode value. Try using "Live Watching" or "Recorded Videos".'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Course creation failed', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Import hardcoded faculties
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

// Get all courses by faculty slug (supports both database and hardcoded faculties)
exports.getCoursesByFaculty = async (req, res) => {
  try {
    const { facultySlug } = req.params;
    
    // First, try to find in database
    let faculty = await Faculty.findOne({ slug: facultySlug });
    
    // If not found in database, check hardcoded faculties
    if (!faculty) {
      const hardcodedFaculty = hardcodedFaculties.find(f => f.slug === facultySlug);
      if (hardcodedFaculty) {
        // For hardcoded faculties, we need to create a database entry if courses are added
        // For now, return empty courses array
        return res.status(200).json({ courses: [] });
      }
      return res.status(404).json({ error: 'Faculty not found' });
    }
    
    res.status(200).json({ courses: faculty.courses || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new structured course to faculty (supports both database and hardcoded faculties)

// Get courses by category, subcategory, and paper
exports.getCoursesByPaper = async (req, res) => {
  try {
    // Set response headers for CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight request
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    
    // Import required models at function level to avoid circular dependencies
    const Faculty = require('../model/Faculty.model');
    const Institute = require('../model/Institute.model');
    const Course = require('../model/Course.model');
    const mongoose = require('mongoose');
    
    const { category, subcategory, paperId } = req.params;
    const includeStandalone = req.query.includeStandalone !== 'false'; // Default to true now
    
    console.log(`🔍 getCoursesByPaper called with category=${category}, subcategory=${subcategory}, paperId=${paperId}, includeStandalone=${includeStandalone}`);
    console.log(`🔍 Request URL: ${req.originalUrl}`);
    console.log(`🔍 Query params:`, req.query);
    console.log(`🔍 Expected filtering criteria:`);
    console.log(`   • Category: "${category}" -> normalized: "${category.toUpperCase()}"`);
    console.log(`   • Subcategory: "${subcategory}" -> normalized: "${subcategory.toLowerCase()}"`);
    console.log(`   • PaperId: "${paperId}" -> numeric: "${String(paperId).replace(/\D/g, '')}"`);
    console.log(`🔍 Starting course retrieval from database...`);
    console.log(`📚 Include standalone courses: ${includeStandalone}`);
    
    const faculties = await Faculty.find({});
    const institutes = await Institute.find({});
    
    console.log(`👨‍🏫 Found ${faculties.length} faculties in database`);
    console.log(`🏫 Found ${institutes.length} institutes in database`);
    
    let allCourses = [];
    let facultyCoursesCount = 0;
    let instituteCoursesCount = 0;
    let standaloneCoursesCount = 0;
    
    // Get courses from faculties
    faculties.forEach(faculty => {
      if (faculty.courses && faculty.courses.length > 0) {
        console.log(`👨‍🏫 Faculty "${faculty.firstName} ${faculty.lastName || ''}" has ${faculty.courses.length} courses`);
        facultyCoursesCount += faculty.courses.length;
        
        (faculty.courses || []).forEach(course => {
          // Only add if course has required fields
          if (course) {
            // Normalize course data before adding to results
            const normalizedCourse = normalizeCourseData({ ...course.toObject() });
            allCourses.push({
              ...normalizedCourse,
              facultyName: `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`,
              facultySlug: faculty.slug,
              isStandalone: false
            });
          }
        });
      } else {
        console.log(`👨‍🏫 Faculty "${faculty.firstName} ${faculty.lastName || ''}" has no courses`);
      }
    });
    
    console.log(`📚 Added ${facultyCoursesCount} courses from faculties`);
    
    // Get courses from institutes
    institutes.forEach(institute => {
      if (institute.courses && institute.courses.length > 0) {
        console.log(`🏫 Institute "${institute.name}" has ${institute.courses.length} courses`);
        instituteCoursesCount += institute.courses.length;
        
        (institute.courses || []).forEach(course => {
          // Only add if course has required fields
          if (course) {
            // Normalize institute course data
            const normalizedCourse = normalizeCourseData({ ...course.toObject() });
            allCourses.push({
              ...normalizedCourse,
              facultyName: '',
              isStandalone: false
            });
          }
        });
      } else {
        console.log(`🏫 Institute "${institute.name}" has no courses`);
      }
    });
    
    console.log(`🏫 Added ${instituteCoursesCount} courses from institutes`);
    
    // Get standalone courses if requested
    if (includeStandalone) {
      console.log(`📚 Fetching standalone courses...`);
      try {
        const standaloneCourses = await Course.find({ isActive: true });
        standaloneCoursesCount = standaloneCourses.length;
        console.log(`📚 Found ${standaloneCoursesCount} standalone courses in database`);
        
        standaloneCourses.forEach(course => {
          // Normalize standalone course data
          const normalizedCourse = normalizeCourseData({ ...course.toObject() });
          allCourses.push({
            ...normalizedCourse,
            isStandalone: true
          });
        });
        console.log(`📚 Added ${standaloneCourses.length} standalone courses`);
      } catch (standaloneError) {
        console.log('⚠️ Error fetching standalone courses:', standaloneError.message);
      }
    } else {
      console.log(`📚 Skipping standalone courses (includeStandalone=false)`);
    }
    
    console.log(`🔍 Searching for courses with: category=${category.toUpperCase()}, subcategory=${subcategory.toLowerCase()}, paperId=${paperId}`);
    console.log(`💼 Total courses retrieved: ${allCourses.length} (${facultyCoursesCount} faculty + ${instituteCoursesCount} institute + ${standaloneCoursesCount} standalone)`);
    
    // Debug: Log all courses with their category/subcategory/paperId
    if (allCourses.length > 0) {
      console.log('📋 All courses in database:');
      allCourses.forEach((course, index) => {
        console.log(`  ${index + 1}. Subject: "${course.subject || 'N/A'}", Category: "${course.category || 'N/A'}", Subcategory: "${course.subcategory || 'N/A'}", PaperId: "${course.paperId || 'N/A'}", Faculty: "${course.facultyName || 'N/A'}", Standalone: ${course.isStandalone}`);
      });
    } else {
      console.log('⚠️ No courses found in database at all!');
      return res.status(200).json({ courses: [], message: 'No courses found in database' });
    }
    
    // N/A faculty has been removed - we only work with actual faculty courses now
    
    // Filter by category, subcategory, and paper - using looser comparison for all fields
    const filteredCourses = allCourses.filter(course => {
      try {
        if (!course) return false;
        
        // Handle different formats and data types that might be stored in MongoDB
        const courseCategory = String(course.category || '').toUpperCase().trim();
        const courseSubcategory = String(course.subcategory || '').toLowerCase().trim();
        // Handle paperId as both string and number - be more flexible
        let coursePaperId = '';
        if (course.paperId !== null && course.paperId !== undefined) {
          coursePaperId = String(course.paperId).replace(/\D/g, ''); // Extract numeric part only
        }
        
        const requestedCategory = String(category || '').toUpperCase().trim();
        const requestedSubcategory = String(subcategory || '').toLowerCase().trim();
        const requestedPaperId = String(paperId || '').replace(/\D/g, ''); // Extract numeric part only
        
        console.log(`🔍 Course "${course.subject || course.title || 'unknown'}" filtering:`);
        console.log(`  - Saved: cat="${course.category}", sub="${course.subcategory}", paper="${course.paperId}" (${typeof course.paperId})`);
        console.log(`  - Normalized: cat="${courseCategory}", sub="${courseSubcategory}", paper="${coursePaperId}"`);
        console.log(`  - Requested: cat="${requestedCategory}", sub="${requestedSubcategory}", paper="${requestedPaperId}"`);
        
        // More flexible matching with comprehensive case handling
        let categoryMatch = false;
        let subcategoryMatch = false;
        let paperIdMatch = false;
        
        // Category matching - handle common variations
        categoryMatch = courseCategory === requestedCategory;
        
        // Subcategory matching - be more flexible with normalization
        const normalizeSubcategory = (sub) => {
          const normalized = sub.toLowerCase().trim();
          if (normalized === 'inter' || normalized === 'intermediate') return 'inter';
          if (normalized === 'final') return 'final';
          if (normalized === 'foundation') return 'foundation';
          return normalized;
        };
        
        const normalizedCourseSubcategory = normalizeSubcategory(courseSubcategory);
        const normalizedRequestedSubcategory = normalizeSubcategory(requestedSubcategory);
        
        subcategoryMatch = normalizedCourseSubcategory === normalizedRequestedSubcategory;
        
        // Paper ID matching - exact numeric match, but handle empty/null cases
        paperIdMatch = coursePaperId === requestedPaperId && coursePaperId !== '';
        
        // Log detailed comparison for debugging
        console.log(`🔍 Course comparison: ${course._id || 'unknown'}, Subject: ${course.subject || 'unknown'}`);
        console.log(`  - Category: "${courseCategory}" vs "${requestedCategory}", match: ${categoryMatch}`);
        console.log(`  - Subcategory: "${courseSubcategory}" vs "${requestedSubcategory}", match: ${subcategoryMatch}`);
        console.log(`  - PaperId: "${coursePaperId}" vs "${requestedPaperId}", match: ${paperIdMatch}`);
        
        const matches = categoryMatch && subcategoryMatch && paperIdMatch;
        console.log(`  - Overall match: ${matches}`);
        
        return matches;
      } catch (filterError) {
        console.error(`❌ Error filtering course: ${filterError.message}`);
        // Skip this course if there was an error
        return false;
      }
    });
    
    console.log(`Returning ${filteredCourses.length} total filtered courses`);
    
    // Make sure we're returning valid data by checking each course
    const sanitizedCourses = filteredCourses.filter(course => {
      // Filter out any null or undefined courses
      if (!course) return false;
      
      // Ensure all courses have required fields
      return course._id && (course.subject || course.title);
    }).map(course => {
      // Make sure all courses have these minimum fields
      return {
        ...course,
        _id: course._id || new mongoose.Types.ObjectId(),
        subject: course.subject || course.title || 'Untitled Course',
        facultyName: course.facultyName || '',
        facultySlug: course.facultySlug || '',
        courseType: course.courseType || `${category} ${subcategory} - Paper ${paperId}`,
        modeAttemptPricing: course.modeAttemptPricing || []
      };
    });
    
    console.log(`Returning ${sanitizedCourses.length} sanitized filtered courses`);
    
    // If no courses found, try multiple fallback searches
    if (sanitizedCourses.length === 0) {
      console.log('🔄 No courses found with strict filtering, trying fallback searches...');
      
      // Try 1: Lenient category/subcategory matching with exact paperId
      let fallbackCourses = allCourses.filter(course => {
        const courseCategory = String(course.category || '').toUpperCase().trim();
        const courseSubcategory = String(course.subcategory || '').toLowerCase().trim();
        const coursePaperId = String(course.paperId || '').replace(/\D/g, '');
        
        const requestedCategory = String(category || '').toUpperCase().trim();
        const requestedSubcategory = String(subcategory || '').toLowerCase().trim();
        const requestedPaperId = String(paperId || '').replace(/\D/g, '');
        
        // Flexible category matching
        const categoryMatch = courseCategory.includes(requestedCategory) || requestedCategory.includes(courseCategory);
        // Flexible subcategory matching
        const subcategoryMatch = courseSubcategory.includes(requestedSubcategory) || requestedSubcategory.includes(courseSubcategory);
        // Exact paperId match
        const paperIdMatch = coursePaperId === requestedPaperId;
        
        return categoryMatch && subcategoryMatch && paperIdMatch;
      });
      
      console.log(`🔄 Fallback 1 (lenient cat/sub, exact paper): ${fallbackCourses.length} courses`);
      
      // Try 2: If still no matches, try with any paperId normalization issues
      if (fallbackCourses.length === 0) {
        fallbackCourses = allCourses.filter(course => {
          const courseCategory = String(course.category || '').toUpperCase().trim();
          const courseSubcategory = String(course.subcategory || '').toLowerCase().trim();
          let coursePaperId = String(course.paperId || '').trim();
          
          const requestedCategory = String(category || '').toUpperCase().trim();
          const requestedSubcategory = String(subcategory || '').toLowerCase().trim();
          let requestedPaperId = String(paperId || '').trim();
          
          // Try different paperId formats
          const paperIdMatches = (
            coursePaperId === requestedPaperId ||
            coursePaperId.replace(/\D/g, '') === requestedPaperId.replace(/\D/g, '') ||
            parseInt(coursePaperId) === parseInt(requestedPaperId)
          );
          
          const categoryMatch = courseCategory === requestedCategory;
          const subcategoryMatch = courseSubcategory === requestedSubcategory;
          
          return categoryMatch && subcategoryMatch && paperIdMatches;
        });
        console.log(`🔄 Fallback 2 (flexible paperId): ${fallbackCourses.length} courses`);
      }
      
      // Try 3: If still no matches, try broader search (might catch data inconsistencies)
      if (fallbackCourses.length === 0) {
        fallbackCourses = allCourses.filter(course => {
          const courseCategory = String(course.category || '').toUpperCase().trim();
          const courseSubcategory = String(course.subcategory || '').toLowerCase().trim();
          
          const requestedCategory = String(category || '').toUpperCase().trim();
          const requestedSubcategory = String(subcategory || '').toLowerCase().trim();
          
          // Just match category and subcategory, log paperId issues
          const categoryMatch = courseCategory === requestedCategory;
          const subcategoryMatch = courseSubcategory === requestedSubcategory;
          
          if (categoryMatch && subcategoryMatch) {
            console.log(`🔍 Found course with matching cat/sub but different paperId: "${course.subject}" (stored paperId: "${course.paperId}" [${typeof course.paperId}], requested: "${paperId}")`);
            
            // Log more details for Paper 20 specifically
            if (String(paperId) === '20' || String(course.paperId) === '20') {
              console.log(`🎯 PAPER 20 DEBUG:`);
              console.log(`   Course paperId: "${course.paperId}" (type: ${typeof course.paperId})`);
              console.log(`   Requested paperId: "${paperId}" (type: ${typeof paperId})`);
              console.log(`   String comparison: "${String(course.paperId)}" === "${String(paperId)}" = ${String(course.paperId) === String(paperId)}`);
              console.log(`   Loose comparison: ${course.paperId} == ${paperId} = ${course.paperId == paperId}`);
              console.log(`   Numeric comparison: ${parseInt(course.paperId)} === ${parseInt(paperId)} = ${parseInt(course.paperId) === parseInt(paperId)}`);
            }
          }
          
          return categoryMatch && subcategoryMatch;
        });
        console.log(`🔄 Fallback 3 (cat/sub only): ${fallbackCourses.length} courses`);
      }
      
      // Sanitize fallback results
      const sanitizedFallbackCourses = fallbackCourses.filter(course => {
        return course && course._id && (course.subject || course.title);
      }).map(course => {
        return {
          ...course,
          _id: course._id || new mongoose.Types.ObjectId(),
          subject: course.subject || course.title || 'Untitled Course',
          facultyName: course.facultyName || '',
          facultySlug: course.facultySlug || '',
          courseType: course.courseType || `${category} ${subcategory} - Paper ${paperId}`,
          modeAttemptPricing: course.modeAttemptPricing || []
        };
      });
      
      console.log(`🔄 Final fallback results: ${sanitizedFallbackCourses.length} courses`);
      
      if (sanitizedFallbackCourses.length > 0) {
        return res.status(200).json({ courses: sanitizedFallbackCourses });
      }
    }
    
    res.status(200).json({ courses: sanitizedCourses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update course
exports.updateCourse = async (req, res) => {
  try {
    const { facultySlug, courseIndex } = req.params;
    const updateData = req.body;

    const faculty = await Faculty.findOne({ slug: facultySlug });
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    const idx = parseInt(courseIndex);
    if (idx < 0 || idx >= faculty.courses.length) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Update course with new data
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && key !== 'posterUrl') {
        faculty.courses[idx][key] = updateData[key];
      }
    });

    // Update poster if provided
    if (req.file) {
      faculty.courses[idx].posterUrl = req.file.path;
    }

    await faculty.save();
    res.status(200).json({ success: true, message: 'Course updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const { facultySlug, courseIndex } = req.params;

    const faculty = await Faculty.findOne({ slug: facultySlug });
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    const idx = parseInt(courseIndex);
    if (idx < 0 || idx >= faculty.courses.length) {
      return res.status(404).json({ error: 'Course not found' });
    }

    faculty.courses.splice(idx, 1);
    await faculty.save();

    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete ALL courses from all faculties
exports.deleteAllCourses = async (req, res) => {
  try {
    console.log('🧨 DELETING ALL COURSES FROM ALL FACULTIES');
    
    // Find all faculties
    const faculties = await Faculty.find({});
    const totalFaculties = faculties.length;
    let totalCoursesRemoved = 0;
    
    // For each faculty, empty their courses array
    for (const faculty of faculties) {
      totalCoursesRemoved += faculty.courses ? faculty.courses.length : 0;
      faculty.courses = []; // Remove all courses
      await faculty.save();
    }
    
    console.log(`✅ Successfully removed all courses from ${totalFaculties} faculties (${totalCoursesRemoved} courses total)`);
    
    res.status(200).json({ 
      success: true, 
      message: `Successfully removed all courses from all faculties`,
      details: {
        facultiesAffected: totalFaculties,
        coursesRemoved: totalCoursesRemoved
      }
    });
  } catch (error) {
    console.error('❌ Error deleting all courses:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get courses by institute
exports.getCoursesByInstitute = async (req, res) => {
  try {
    const { instituteName } = req.params;
    const institute = await Institute.findOne({ name: instituteName });
    
    if (!institute) {
      return res.status(404).json({ error: 'Institute not found' });
    }
    
    res.status(200).json({ courses: institute.courses || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addNewCourseToFaculty = exports.addCourseToFaculty;

module.exports = exports;
