const express = require('express');
const router = express.Router();
const multer = require('multer');
const { requireAdminCookie } = require('../middlewares/auth.middleware');
const upload = multer({ storage: multer.memoryStorage() });
const courseController = require('../controllers/course.controller');

// Admin course routes
router.post('/api/admin/courses', requireAdminCookie, upload.single('poster'), courseController.addCourseToFaculty);
router.post('/api/admin/courses/new', requireAdminCookie, upload.single('poster'), courseController.addNewCourseToFaculty);
router.put('/api/admin/courses/:facultySlug/:courseIndex', requireAdminCookie, upload.single('poster'), courseController.updateCourse);
router.delete('/api/admin/courses/:facultySlug/:courseIndex', requireAdminCookie, courseController.deleteCourse);
router.delete('/api/admin/courses/deleteAll/confirm', requireAdminCookie, courseController.deleteAllCourses);
router.post('/api/admin/courses/bulk-upload', requireAdminCookie, courseController.bulkUploadCourses);

// Public course routes - Order matters! More specific routes first
router.get('/api/courses/:category/:subcategory/:paperId', courseController.getCoursesByPaper);
router.get('/api/institutes/:instituteName/courses', courseController.getCoursesByInstitute);
router.get('/api/courses/:facultySlug', courseController.getCoursesByFaculty);

module.exports = router;
