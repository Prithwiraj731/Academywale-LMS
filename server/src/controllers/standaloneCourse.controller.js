const Course = require('../model/Course.model');
const Faculty = require('../model/Faculty.model');

// Get all standalone courses (without faculty/institute requirement)
exports.getAllStandaloneCourses = async (req, res) => {
  try {
    const courses = await Course.find({ 
      isStandalone: true,
      isActive: true 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all courses (both standalone and faculty-based)
exports.getAllCourses = async (req, res) => {
  try {
    // Get standalone courses
    const standaloneCourses = await Course.find({ 
      isStandalone: true,
      isActive: true 
    }).sort({ createdAt: -1 });

    // Get faculty-based courses
    const faculties = await Faculty.find({}).populate('courses');
    const facultyCourses = [];
    
    faculties.forEach(faculty => {
      if (faculty.courses && faculty.courses.length > 0) {
        faculty.courses.forEach(course => {
          facultyCourses.push({
            ...course.toObject(),
            facultySlug: faculty.slug,
            facultyName: course.facultyName || `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`,
            isStandalone: false
          });
        });
      }
    });

    const allCourses = [...standaloneCourses, ...facultyCourses];
    
    res.status(200).json({ courses: allCourses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new standalone course
exports.createStandaloneCourse = async (req, res) => {
  try {
    const {
      title, subject, description, category, subcategory, paperId, paperName,
      courseType, noOfLecture, books, videoLanguage, videoRunOn, timing,
      doubtSolving, supportMail, supportCall, validityStartFrom,
      facultySlug, facultyName, institute, modeAttemptPricing,
      costPrice, sellingPrice
    } = req.body;

    const posterUrl = req.file ? req.file.path : '';
    const posterPublicId = req.file ? req.file.filename : '';

    if (!title || !subject) {
      return res.status(400).json({ error: 'Title and subject are required' });
    }

    // Parse mode and attempt pricing if provided
    let parsedModeAttemptPricing = [];
    if (modeAttemptPricing) {
      try {
        parsedModeAttemptPricing = JSON.parse(modeAttemptPricing);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid mode attempt pricing format' });
      }
    }

    const newCourse = new Course({
      title,
      subject,
      description: description || '',
      category: category || '',
      subcategory: subcategory || '',
      paperId: paperId || '',
      paperName: paperName || '',
      courseType: courseType || 'General Course',
      noOfLecture: noOfLecture || '',
      books: books || '',
      videoLanguage: videoLanguage || 'Hindi',
      videoRunOn: videoRunOn || '',
      timing: timing || '',
      doubtSolving: doubtSolving || '',
      supportMail: supportMail || '',
      supportCall: supportCall || '',
      validityStartFrom: validityStartFrom || '',
      facultySlug: facultySlug || '',
      facultyName: facultyName || '',
      institute: institute || '',
      posterUrl,
      posterPublicId,
      modeAttemptPricing: parsedModeAttemptPricing,
      costPrice: costPrice ? Number(costPrice) : 0,
      sellingPrice: sellingPrice ? Number(sellingPrice) : 0,
      isStandalone: true,
      isActive: true
    });

    await newCourse.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Standalone course created successfully',
      course: newCourse 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a standalone course
exports.updateStandaloneCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.posterUrl = req.file.path;
      updateData.posterPublicId = req.file.filename;
    }

    // Parse mode and attempt pricing if provided
    if (updateData.modeAttemptPricing) {
      try {
        updateData.modeAttemptPricing = JSON.parse(updateData.modeAttemptPricing);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid mode attempt pricing format' });
      }
    }

    const course = await Course.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Course updated successfully',
      course 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a standalone course
exports.deleteStandaloneCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findByIdAndDelete(id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Course deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
