const Faculty = require('../model/Faculty.model');
const Institute = require('../model/Institute.model');

// Get all courses by faculty slug
exports.getCoursesByFaculty = async (req, res) => {
  try {
    const { facultySlug } = req.params;
    const faculty = await Faculty.findOne({ slug: facultySlug });
    
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    
    res.status(200).json({ courses: faculty.courses || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new structured course to faculty
exports.addNewCourseToFaculty = async (req, res) => {
  try {
    const {
      category, subcategory, paperId, paperName, subject, facultySlug,
      institute, description, noOfLecture, books, videoLanguage,
      videoRunOn, doubtSolving, supportMail, supportCall, timing,
      courseType, modeAttemptPricing
    } = req.body;

    const posterUrl = req.file ? req.file.path : '';

    if (!facultySlug || !category || !subcategory || !paperId || !subject) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const faculty = await Faculty.findOne({ slug: facultySlug });
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Parse mode and attempt pricing
    let parsedModeAttemptPricing = [];
    try {
      parsedModeAttemptPricing = JSON.parse(modeAttemptPricing);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid mode attempt pricing format' });
    }

    const newCourse = {
      facultyName: `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`,
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
      
      // New paper-based categorization
      category,
      subcategory,
      paperId: parseInt(paperId),
      paperName,
      
      // New mode and attempt pricing structure
      modeAttemptPricing: parsedModeAttemptPricing,
      
      // Backwards compatibility: use first mode/attempt for old fields
      costPrice: parsedModeAttemptPricing[0]?.attempts[0]?.costPrice || 0,
      sellingPrice: parsedModeAttemptPricing[0]?.attempts[0]?.sellingPrice || 0,
      mode: parsedModeAttemptPricing[0]?.mode || 'Live Watching',
      modes: parsedModeAttemptPricing.map(m => m.mode),
      durations: parsedModeAttemptPricing.flatMap(m => m.attempts.map(a => a.attempt))
    };

    faculty.courses.push(newCourse);
    await faculty.save();

    res.status(201).json({ success: true, message: 'Course added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get courses by category, subcategory, and paper
exports.getCoursesByPaper = async (req, res) => {
  try {
    const { category, subcategory, paperId } = req.params;
    
    const faculties = await Faculty.find({});
    const institutes = await Institute.find({});
    
    let allCourses = [];
    
    // Get courses from faculties
    faculties.forEach(faculty => {
      (faculty.courses || []).forEach(course => {
        allCourses.push({
          ...course.toObject(),
          facultyName: `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`
        });
      });
    });
    
    // Get courses from institutes
    institutes.forEach(institute => {
      (institute.courses || []).forEach(course => {
        allCourses.push({
          ...course.toObject(),
          facultyName: ''
        });
      });
    });
    
    // Filter by category, subcategory, and paper
    const filteredCourses = allCourses.filter(course => {
      return course.category === category.toUpperCase() &&
             course.subcategory === subcategory.charAt(0).toUpperCase() + subcategory.slice(1).toLowerCase() &&
             course.paperId === parseInt(paperId);
    });
    
    res.status(200).json({ courses: filteredCourses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add course to faculty
exports.addCourseToFaculty = async (req, res) => {
  try {
    const {
      facultySlug, subject, noOfLecture, books, videoLanguage,
      validityStartFrom, videoRunOn, doubtSolving, supportMail,
      supportCall, mode, timing, description, title, costPrice,
      sellingPrice, courseType, institute, modes, durations
    } = req.body;

    const posterUrl = req.file ? req.file.path : '';

    if (!facultySlug) {
      return res.status(400).json({ error: 'Faculty is required' });
    }

    const faculty = await Faculty.findOne({ slug: facultySlug });
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Parse modes and durations from comma-separated strings
    const modesArray = modes ? modes.split(',').map(m => m.trim()) : [];
    const durationsArray = durations ? durations.split(',').map(d => d.trim()) : [];

    const newCourse = {
      facultyName: `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`,
      subject: subject || title,
      noOfLecture,
      books,
      videoLanguage,
      validityStartFrom,
      videoRunOn,
      doubtSolving,
      supportMail,
      supportCall,
      posterUrl,
      mode,
      modes: modesArray,
      timing,
      description,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      courseType,
      institute,
      durations: durationsArray
    };

    faculty.courses.push(newCourse);
    await faculty.save();

    res.status(201).json({ success: true, message: 'Course added successfully' });
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
