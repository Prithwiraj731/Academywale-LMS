const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary.config');
const upload = multer({ storage });
const facultyController = require('../controllers/faculty.controller');

router.post('/api/admin/faculty', upload.single('image'), facultyController.createFaculty);

// I am assuming your other faculty routes look something like this
router.get('/api/faculties', facultyController.getAllFaculties);
router.get('/api/faculties/:slug', facultyController.getFacultyBySlug);
router.put('/api/admin/faculty/:slug', upload.single('image'), facultyController.updateFaculty);
router.delete('/api/admin/faculty/:slug', facultyController.deleteFaculty);

module.exports = router;