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

// Create a new course (using the controller)
router.post('/api/admin/courses/controller', upload.single('poster'), courseController.addCourseToFaculty);

// Get all courses
router.get('/api/courses/all', async (req, res) => {
  try {
    const Course = require('../model/Course.model');
    const courses = await Course.find({ isActive: true });
    res.json({ success: true, courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
