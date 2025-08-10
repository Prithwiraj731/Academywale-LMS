const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary.config');
const upload = multer({ storage });
const standaloneCourseController = require('../controllers/standaloneCourse.controller');

// Public routes
router.get('/api/courses/standalone', standaloneCourseController.getAllStandaloneCourses);
router.get('/api/courses/all', standaloneCourseController.getAllCourses);
router.get('/api/courses/:id', standaloneCourseController.getCourseById);

// Admin routes
router.post('/api/admin/courses/standalone', upload.single('poster'), standaloneCourseController.createStandaloneCourse);
router.put('/api/admin/courses/standalone/:id', upload.single('poster'), standaloneCourseController.updateStandaloneCourse);
router.delete('/api/admin/courses/standalone/:id', standaloneCourseController.deleteStandaloneCourse);

module.exports = router;
