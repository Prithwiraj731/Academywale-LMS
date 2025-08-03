const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary.config');
const upload = multer({ storage });
const facultyController = require('../controllers/faculty.controller');

router.post('/api/faculties', upload.single('image'), facultyController.createFaculty);

// I am assuming your other faculty routes look something like this
router.get('/api/faculties', facultyController.getAllFaculties);
router.get('/api/faculties/:id', facultyController.getFacultyById);
router.put('/api/faculties/:id', upload.single('image'), facultyController.updateFaculty);
router.delete('/api/faculties/:id', facultyController.deleteFaculty);

module.exports = router;