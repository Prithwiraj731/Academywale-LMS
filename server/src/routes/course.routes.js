const express = require('express');
const router = express.Router();
const multer = require('multer');
const { courseStorage } = require('../config/cloudinary.config');
const upload = multer({ storage: courseStorage });
const courseController = require('../controllers/course.controller');

// Admin course routes
router.post('/api/admin/courses', upload.single('poster'), courseController.addCourseToFaculty);
router.post('/api/admin/courses/new', upload.single('poster'), courseController.addNewCourseToFaculty);
router.put('/api/admin/courses/:facultySlug/:courseIndex', upload.single('poster'), courseController.updateCourse);
router.delete('/api/admin/courses/:facultySlug/:courseIndex', courseController.deleteCourse);
router.delete('/api/admin/courses/deleteAll/confirm', courseController.deleteAllCourses);

// Public course routes - Order matters! More specific routes first
router.get('/api/courses/:category/:subcategory/:paperId', courseController.getCoursesByPaper);
router.get('/api/institutes/:instituteName/courses', courseController.getCoursesByInstitute);
router.get('/api/courses/:facultySlug', courseController.getCoursesByFaculty);

module.exports = router;
