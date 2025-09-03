const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary.config');
const courseController = require('../controllers/course.controller');

// Configure multer with Cloudinary storage
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Test route to check if controller routes are working
router.get('/api/courses/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Course controller routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Get all courses (both standalone and faculty-based)
router.get('/api/courses/all', async (req, res) => {
  try {
    const Course = require('../model/Course.model');
    const Faculty = require('../model/Faculty.model');
    
    let allCourses = [];
    
    // Get standalone courses
    try {
      const standaloneCourses = await Course.find({ isActive: true });
      allCourses = [...standaloneCourses];
      console.log(`Found ${standaloneCourses.length} standalone courses`);
    } catch (standaloneError) {
      console.log('No standalone courses found or error:', standaloneError.message);
    }
    
    // Get faculty-based courses
    try {
      const faculties = await Faculty.find({});
      faculties.forEach(faculty => {
        if (faculty.courses && faculty.courses.length > 0) {
          faculty.courses.forEach(course => {
            // Add faculty information to the course
            const courseWithFaculty = {
              ...course.toObject(),
              facultyName: `${faculty.firstName} ${faculty.lastName || ''}`.trim(),
              facultySlug: faculty.slug,
              facultyId: faculty._id,
              isStandalone: false
            };
            allCourses.push(courseWithFaculty);
          });
        }
      });
      console.log(`Total courses after adding faculty courses: ${allCourses.length}`);
    } catch (facultyError) {
      console.log('Error fetching faculty courses:', facultyError.message);
    }
    
    res.json({ success: true, courses: allCourses });
  } catch (error) {
    console.error('Error fetching all courses:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Debug endpoint to see all courses with their metadata
router.get('/api/courses/debug', async (req, res) => {
  try {
    const Course = require('../model/Course.model');
    const Faculty = require('../model/Faculty.model');
    
    let debugInfo = {
      standaloneCourses: [],
      facultyCourses: [],
      totalCourses: 0
    };
    
    // Get standalone courses
    try {
      const standaloneCourses = await Course.find({ isActive: true });
      debugInfo.standaloneCourses = standaloneCourses.map(course => ({
        _id: course._id,
        title: course.title,
        subject: course.subject,
        category: course.category,
        subcategory: course.subcategory,
        paperId: course.paperId,
        isStandalone: true
      }));
    } catch (standaloneError) {
      debugInfo.standaloneError = standaloneError.message;
    }
    
    // Get faculty-based courses
    try {
      const faculties = await Faculty.find({});
      faculties.forEach(faculty => {
        if (faculty.courses && faculty.courses.length > 0) {
          faculty.courses.forEach(course => {
            debugInfo.facultyCourses.push({
              _id: course._id,
              subject: course.subject,
              category: course.category,
              subcategory: course.subcategory,
              paperId: course.paperId,
              facultyName: `${faculty.firstName} ${faculty.lastName || ''}`.trim(),
              facultySlug: faculty.slug,
              isStandalone: false
            });
          });
        }
      });
    } catch (facultyError) {
      debugInfo.facultyError = facultyError.message;
    }
    
    debugInfo.totalCourses = debugInfo.standaloneCourses.length + debugInfo.facultyCourses.length;
    
    res.json({ success: true, debug: debugInfo });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test endpoint for specific paper filtering
router.get('/api/courses/test/:category/:subcategory/:paperId', async (req, res) => {
  try {
    const { category, subcategory, paperId } = req.params;
    const includeStandalone = req.query.includeStandalone === 'true';
    
    console.log(`🧪 TEST: Filtering for ${category}/${subcategory}/${paperId}, includeStandalone=${includeStandalone}`);
    
    const Course = require('../model/Course.model');
    const Faculty = require('../model/Faculty.model');
    
    let allCourses = [];
    
    // Get faculty courses
    const faculties = await Faculty.find({});
    faculties.forEach(faculty => {
      (faculty.courses || []).forEach(course => {
        if (course) {
          allCourses.push({
            ...course.toObject(),
            facultyName: `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`,
            facultySlug: faculty.slug,
            isStandalone: false,
            source: 'faculty'
          });
        }
      });
    });
    
    // Get standalone courses if requested
    if (includeStandalone) {
      const standaloneCourses = await Course.find({ isActive: true });
      standaloneCourses.forEach(course => {
        allCourses.push({
          ...course.toObject(),
          isStandalone: true,
          source: 'standalone'
        });
      });
    }
    
    console.log(`🧪 TEST: Found ${allCourses.length} total courses`);
    
    // Show all courses with their filtering data
    const courseDetails = allCourses.map(course => ({
      _id: course._id,
      subject: course.subject,
      category: course.category,
      subcategory: course.subcategory,
      paperId: course.paperId,
      facultyName: course.facultyName || 'N/A',
      source: course.source,
      isStandalone: course.isStandalone
    }));
    
    // Apply filtering
    const requestedCategory = String(category || '').toUpperCase().trim();
    const requestedSubcategory = String(subcategory || '').toLowerCase().trim();
    const requestedPaperId = String(paperId || '').replace(/\D/g, '');
    
    const filteredCourses = allCourses.filter(course => {
      const courseCategory = String(course.category || '').toUpperCase().trim();
      const courseSubcategory = String(course.subcategory || '').toLowerCase().trim();
      const coursePaperId = String(course.paperId || '').replace(/\D/g, '');
      
      const categoryMatch = courseCategory === requestedCategory;
      const subcategoryMatch = courseSubcategory === requestedSubcategory || 
                              (courseSubcategory === 'final' && requestedSubcategory === 'final') ||
                              (courseSubcategory === 'inter' && requestedSubcategory === 'inter') ||
                              (courseSubcategory === 'foundation' && requestedSubcategory === 'foundation');
      const paperIdMatch = coursePaperId === requestedPaperId;
      
      return categoryMatch && subcategoryMatch && paperIdMatch;
    });
    
    res.json({
      success: true,
      test: {
        requestedFilters: { category: requestedCategory, subcategory: requestedSubcategory, paperId: requestedPaperId },
        totalCourses: allCourses.length,
        allCourses: courseDetails,
        filteredCount: filteredCourses.length,
        filteredCourses: filteredCourses.map(c => ({
          _id: c._id,
          subject: c.subject,
          category: c.category,
          subcategory: c.subcategory,
          paperId: c.paperId,
          source: c.source
        }))
      }
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Simple endpoint to test if courses exist
router.get('/api/courses/simple-test', async (req, res) => {
  try {
    const Faculty = require('../model/Faculty.model');
    const Course = require('../model/Course.model');
    
    let summary = {
      facultyCount: 0,
      facultyCourseCount: 0,
      standaloneCourseCount: 0,
      sampleCourses: []
    };
    
    // Check faculties
    const faculties = await Faculty.find({});
    summary.facultyCount = faculties.length;
    
    faculties.forEach(faculty => {
      if (faculty.courses && faculty.courses.length > 0) {
        summary.facultyCourseCount += faculty.courses.length;
        
        // Add first few courses as samples
        faculty.courses.slice(0, 2).forEach(course => {
          summary.sampleCourses.push({
            type: 'faculty',
            subject: course.subject,
            category: course.category,
            subcategory: course.subcategory,
            paperId: course.paperId,
            facultyName: `${faculty.firstName} ${faculty.lastName || ''}`.trim()
          });
        });
      }
    });
    
    // Check standalone courses
    const standaloneCourses = await Course.find({ isActive: true });
    summary.standaloneCourseCount = standaloneCourses.length;
    
    standaloneCourses.slice(0, 2).forEach(course => {
      summary.sampleCourses.push({
        type: 'standalone',
        subject: course.subject,
        category: course.category,
        subcategory: course.subcategory,
        paperId: course.paperId
      });
    });
    
    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
