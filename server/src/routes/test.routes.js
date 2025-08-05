const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary.config');
const upload = multer({ storage });

// Test endpoint to verify Cloudinary response
router.post('/api/test-upload', upload.single('image'), (req, res) => {
  try {
    console.log('=== CLOUDINARY TEST UPLOAD ===');
    console.log('req.file:', JSON.stringify(req.file, null, 2));
    console.log('=== END TEST ===');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({
      success: true,
      file: req.file,
      path: req.file.path,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    console.error('Test upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
