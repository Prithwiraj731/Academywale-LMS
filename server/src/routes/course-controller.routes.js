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

// Import validation bypass middleware
const { removeValidationMiddleware, directSaveMiddleware } = require('../middleware/forceValidationBypass');

// Create a new course (using the controller)
router.post('/api/admin/courses/controller', [
  removeValidationMiddleware, 
  directSaveMiddleware,
  upload.single('poster')
], courseController.addCourseToFaculty);

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

module.exports = router;
