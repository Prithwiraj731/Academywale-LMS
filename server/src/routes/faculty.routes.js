const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary.config');
const upload = multer({ storage });
const facultyController = require('../controllers/faculty.controller');

// Test endpoint to verify routes are working
router.get('/api/admin/faculty/test', (req, res) => {
    res.json({ message: 'Faculty routes are working!', timestamp: new Date() });
});

// Simple POST test without file upload
router.post('/api/admin/faculty/test-simple', (req, res) => {
    console.log('📝 Simple test endpoint hit');
    console.log('Body:', req.body);
    res.json({ message: 'Simple POST test successful', body: req.body });
});

// Test multer without Cloudinary
router.post('/api/admin/faculty/test-multer', upload.single('image'), (req, res) => {
    console.log('📝 Multer test endpoint hit');
    console.log('Body:', req.body);
    console.log('File:', req.file ? 'File received' : 'No file');
    if (req.file) {
        console.log('File details:', JSON.stringify(req.file, null, 2));
    }
    res.json({ message: 'Multer test successful', body: req.body, file: req.file ? 'File received' : 'No file' });
});

router.post('/api/admin/faculty', upload.single('image'), facultyController.createFaculty);

// I am assuming your other faculty routes look something like this
router.get('/api/faculties', facultyController.getAllFaculties);
router.get('/api/faculties/:slug', facultyController.getFacultyBySlug);
router.put('/api/admin/faculty/:slug', upload.single('image'), facultyController.updateFaculty);
router.delete('/api/admin/faculty/:slug', facultyController.deleteFaculty);

module.exports = router;