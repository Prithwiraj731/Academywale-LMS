const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/faculty.controller');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Add a new course to a faculty (admin) with poster upload
router.post('/api/admin/courses', upload.single('poster'), facultyController.addCourse);
// Update a course
router.put('/api/admin/courses/:facultySlug/:courseIndex', upload.single('poster'), facultyController.updateCourse);
// Delete a course
router.delete('/api/admin/courses/:facultySlug/:courseIndex', facultyController.deleteCourse);

// Get all courses for a faculty
router.get('/api/courses/:slug', facultyController.getCourses);

// (Optional) Create a new faculty
router.post('/api/admin/faculty', upload.single('image'), facultyController.createFaculty);
// Update a faculty
router.put('/api/admin/faculty/:slug', upload.single('image'), facultyController.updateFaculty);
// Delete a faculty
router.delete('/api/admin/faculty/:slug', facultyController.deleteFaculty);

// Update faculty bio and teaches
router.post('/api/admin/faculty-info', facultyController.updateFacultyInfo);

// Get faculty bio and teaches
router.get('/api/faculty-info/:slug', facultyController.getFacultyInfo);

// Get all faculties
router.get('/api/faculties', facultyController.getAllFaculties);

// Delete all faculties (admin only)
router.delete('/api/admin/faculties/delete-all', facultyController.deleteAllFaculties);

// Add a new institute (admin) with image upload
router.post('/api/admin/institutes', upload.single('image'), facultyController.addInstitute);
// Update an institute
router.put('/api/admin/institutes/:id', upload.single('image'), facultyController.updateInstitute);
// Delete an institute
router.delete('/api/admin/institutes/:id', facultyController.deleteInstitute);
// Get all institutes
router.get('/api/institutes', facultyController.getAllInstitutes);

module.exports = router; 