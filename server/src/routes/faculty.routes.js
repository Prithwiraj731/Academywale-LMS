const express = require('express');
const router = express.Router();
const multer = require('multer');

// EMERGENCY CLOUDINARY FIX
// Create direct cloudinary config without relying on imported modules
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Force correct credentials
cloudinary.config({
  cloud_name: 'drlqhsjgm',
  api_key: '367882575567196',
  api_secret: 'RdSBwyzQRUb5ZD32kbqS3vhxh7I',
  secure: true
});

console.log('☁️ EMERGENCY FACULTY ROUTES - CLOUDINARY CONFIG:', {
  cloud_name: cloudinary.config().cloud_name,
  api_key_last_5: cloudinary.config().api_key.slice(-5)
});

// Create storage directly in this file
const emergencyStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'academywale/faculty',
    resource_type: 'image',
    public_id: (req, file) => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      return `faculty_${timestamp}_${random}`;
    },
    format: 'auto',
    transformation: [
      { width: 800, height: 800, crop: "limit" },
      { quality: "auto" }
    ]
  }
});

// Use the emergency storage
const upload = multer({ storage: emergencyStorage });

// Import controller normally
const facultyController = require('../controllers/faculty.controller');

// Test endpoint to verify routes are working
router.get('/api/admin/faculty/test', (req, res) => {
    res.json({ 
        message: 'Faculty routes are working with FRESH Cloudinary config!', 
        timestamp: new Date(),
        cloudinaryConfigured: true,
        storageType: 'CloudinaryStorage'
    });
});

// Simple POST test without file upload
router.post('/api/admin/faculty/test-simple', (req, res) => {
    console.log('📝 Simple test endpoint hit');
    console.log('Body:', req.body);
    res.json({ message: 'Simple POST test successful', body: req.body });
});

// Test multer without Cloudinary
router.post('/api/admin/faculty/test-multer', upload.single('image'), (req, res) => {
    console.log('📝 FRESH CONFIG - Multer test endpoint hit');
    console.log('Body:', req.body);
    console.log('File:', req.file ? 'File received' : 'No file');
    if (req.file) {
        console.log('🔥 FRESH CONFIG - File details:', JSON.stringify(req.file, null, 2));
        console.log('🔥 Path (should be Cloudinary URL):', req.file.path);
        console.log('🔥 Filename (should be public_id):', req.file.filename);
    }
    res.json({ 
        message: 'FRESH CONFIG - Multer test successful', 
        body: req.body, 
        file: req.file ? {
            path: req.file.path,
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size
        } : 'No file',
        configType: 'FRESH_CLOUDINARY'
    });
});

router.post('/api/admin/faculty', upload.single('image'), facultyController.createFaculty);

// I am assuming your other faculty routes look something like this
router.get('/api/faculties', facultyController.getAllFaculties);
router.get('/api/faculties/:slug', facultyController.getFacultyBySlug);
router.put('/api/admin/faculty/:slug', upload.single('image'), facultyController.updateFaculty);
router.delete('/api/admin/faculty/:slug', facultyController.deleteFaculty);

module.exports = router;