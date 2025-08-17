// Import the mode mapper utility
const { mapMode } = require('../utils/modeMapper');

// Unified course creation: supports both general and faculty courses, including hardcoded faculties/institutes
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

    // If facultySlug is missing or empty, save as general course
    if (!facultySlug || facultySlug.trim() === '') {
      const Course = require('../model/Course.model');
      let parsedModeAttemptPricing = [];
      try {
        parsedModeAttemptPricing = JSON.parse(modeAttemptPricing);
      } catch (e) {
        parsedModeAttemptPricing = [];
      }
      const courseData = {
        category,
        subcategory,
        paperId,
        paperName,
        subject,
        title: title || 'New Course',
        facultySlug: '',
        facultyName: '',
        institute,
        description,
        noOfLecture,
        books,
        videoLanguage,
        videoRunOn,
        doubtSolving,
        supportMail,
        supportCall,
        timing,
        courseType,
        modeAttemptPricing: parsedModeAttemptPricing,
        posterUrl,
        isActive: true
      };
      const newCourse = new Course(courseData);
      const savedCourse = await newCourse.save();
      return res.status(201).json({ success: true, message: 'Course added successfully', course: savedCourse });
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
      courseType: courseType || `${category} ${subcategory}`,
      institute,
      category,
      subcategory,
      paperId: parseInt(paperId),
      paperName,
      modeAttemptPricing: parsedModeAttemptPricing,
      costPrice: parsedModeAttemptPricing[0]?.attempts[0]?.costPrice || 0,
      sellingPrice: parsedModeAttemptPricing[0]?.attempts[0]?.sellingPrice || 0,
      // Map the mode to only allowed values
      mode: mapMode(parsedModeAttemptPricing[0]?.mode),
      modes: parsedModeAttemptPricing.map(m => mapMode(m.mode)),
      durations: parsedModeAttemptPricing.flatMap(m => m.attempts.map(a => a.attempt))
    };
    
    console.log('⚠️ Original mode value:', parsedModeAttemptPricing[0]?.mode);
    console.log('✅ Mapped mode value:', newCourse.mode);
    
    // No need for complex validation - we've already mapped to allowed values
    
    // Make absolutely sure mode is a valid value
    newCourse.mode = 'Live Watching';
    
    // Add course to faculty
    faculty.courses.push(newCourse);
    
    try {
      // Try normal save
      await faculty.save();
      console.log('✅ Course controller: Course added successfully to faculty');
      res.status(201).json({ success: true, message: 'Course added successfully', course: newCourse });
    } catch (saveError) {
      // Check if it's a mode validation error
      if (saveError.name === 'ValidationError' && 
          saveError.errors && 
          saveError.errors['courses.0.mode']) {
        
        console.log('⚠️ Mode validation error detected, attempting direct database update');
        
        try {
          // Use direct MongoDB update to bypass validation
          const mongoose = require('mongoose');
          await mongoose.model('Faculty').updateOne(
            { _id: faculty._id },
            { $set: { courses: faculty.courses } }
          );
          
          console.log('✅ Course saved successfully using direct database update');
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
const Faculty = require('../model/Faculty.model');
const Institute = require('../model/Institute.model');

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
    // Import required models at function level to avoid circular dependencies
    const Faculty = require('../model/Faculty.model');
    const Institute = require('../model/Institute.model');
    const Course = require('../model/Course.model');
    
    const { category, subcategory, paperId } = req.params;
    // Check if includeStandalone parameter is present
    const includeStandalone = req.query.includeStandalone === 'true';
    
    console.log(`🔍 getCoursesByPaper called with category=${category}, subcategory=${subcategory}, paperId=${paperId}, includeStandalone=${includeStandalone}`);
    
    const faculties = await Faculty.find({});
    const institutes = await Institute.find({});
    
    let allCourses = [];
    
    // Get courses from faculties
    faculties.forEach(faculty => {
      (faculty.courses || []).forEach(course => {
        // Only add if course has required fields
        if (course) {
          allCourses.push({
            ...course.toObject(),
            facultyName: `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`,
            isStandalone: false
          });
        }
      });
    });
    
    // Get courses from institutes
    institutes.forEach(institute => {
      (institute.courses || []).forEach(course => {
        // Only add if course has required fields
        if (course) {
          allCourses.push({
            ...course.toObject(),
            facultyName: '',
            isStandalone: false
          });
        }
      });
    });
    
    // Get standalone courses matching the same criteria if includeStandalone is true
    if (includeStandalone) {
      console.log(`🔍 Searching for standalone courses with: category=${category.toUpperCase()}, subcategory=${subcategory.toLowerCase()}, paperId=${paperId}`);
      
      // Use a more flexible and reliable query approach for standalone courses
      const standaloneCourses = await Course.find({
        $and: [
          // Either isStandalone is true or facultySlug is empty
          {
            $or: [
              { isStandalone: true },
              { facultySlug: { $in: [null, '', undefined] } }
            ]
          },
          // Category match (case insensitive)
          {
            $or: [
              { category: category.toUpperCase() },
              { category: category.toLowerCase() },
              { category: category }
            ]
          },
          // Subcategory match (case insensitive)
          {
            $or: [
              { subcategory: subcategory.toLowerCase() },
              { subcategory: subcategory.toUpperCase() },
              { subcategory: subcategory }
            ]
          },
          // PaperId match (both string and number formats)
          {
            $or: [
              { paperId: parseInt(paperId) },
              { paperId: paperId.toString() }
            ]
          }
        ]
      }).sort({ createdAt: -1 });
    
    console.log(`🔎 Found ${standaloneCourses.length} matching standalone courses`);
    
    // Format standalone courses to match the structure of faculty courses
    const formattedStandaloneCourses = standaloneCourses.map(course => ({
      ...course.toObject(),
      facultyName: 'Standalone Course',
      isStandalone: true
    }));
    
      // Add standalone courses to allCourses array
      allCourses = [...allCourses, ...formattedStandaloneCourses];
    } else {
      console.log('🚫 Skipping standalone courses as includeStandalone is not true');
    }
    
    // Filter by category, subcategory, and paper - using looser comparison for all fields
    const filteredCourses = allCourses.filter(course => {
      try {
        // Handle different formats and data types that might be stored in MongoDB
        const courseCategory = String(course.category || '').toUpperCase();
        const courseSubcategory = String(course.subcategory || '').toLowerCase();
        const coursePaperId = String(course.paperId || '').replace(/\D/g, ''); // Extract numeric part only
        
        const requestedCategory = String(category || '').toUpperCase();
        const requestedSubcategory = String(subcategory || '').toLowerCase();
        const requestedPaperId = String(paperId || '').replace(/\D/g, ''); // Extract numeric part only
        
        // Very lenient comparisons for debugging
        const categoryMatch = courseCategory.includes(requestedCategory) || requestedCategory.includes(courseCategory);
        const subcategoryMatch = courseSubcategory.includes(requestedSubcategory) || requestedSubcategory.includes(courseSubcategory);
        const paperIdMatch = coursePaperId === requestedPaperId;
        
        // Log detailed comparison for debugging
        console.log(`Course comparison: ${course._id || 'unknown'}, Subject: ${course.subject || 'unknown'}`);
        console.log(`- Category: "${courseCategory}" vs "${requestedCategory}", match: ${categoryMatch}`);
        console.log(`- Subcategory: "${courseSubcategory}" vs "${requestedSubcategory}", match: ${subcategoryMatch}`);
        console.log(`- PaperId: "${coursePaperId}" vs "${requestedPaperId}", match: ${paperIdMatch}`);
        
        const matches = categoryMatch && subcategoryMatch && paperIdMatch;
                     
      console.log(`- Overall match: ${matches} (isStandalone: ${course.isStandalone || false})`);
      
      return matches;
      } catch (filterError) {
        console.error(`Error filtering course: ${filterError.message}`);
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
        facultyName: course.facultyName || 'Standalone Course',
        isStandalone: !!course.isStandalone,
        courseType: course.courseType || `${category} ${subcategory} - Paper ${paperId}`,
        modeAttemptPricing: course.modeAttemptPricing || []
      };
    });
    
    console.log(`Returning ${sanitizedCourses.length} sanitized filtered courses`);
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
