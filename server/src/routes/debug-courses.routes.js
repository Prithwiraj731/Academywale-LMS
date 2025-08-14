// Emergency course creation debug endpoint
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Use local disk storage for debugging
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Create upload middleware with disk storage
const upload = multer({ storage: diskStorage });

// Debug test endpoint - no file upload
router.post('/api/debug/courses/test', (req, res) => {
  try {
    console.log('🎯 DEBUG TEST HIT - NO FILE UPLOAD');
    console.log('📋 Headers:', req.headers);
    console.log('📋 Body:', req.body);
    
    res.json({
      success: true,
      message: 'Debug test endpoint hit successfully',
      receivedData: req.body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Debug test error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Debug course creation endpoint - with local file storage
router.post('/api/debug/courses', upload.single('poster'), async (req, res) => {
  try {
    console.log('🔍 DEBUG COURSE CREATION REQUEST');
    console.log('📋 Headers:', req.headers);
    console.log('📋 Body:', req.body);
    console.log('📎 File:', req.file ? 'Received' : 'None');
    
    if (req.file) {
      console.log('📄 File details:', {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        encoding: req.file.encoding,
        mimetype: req.file.mimetype,
        destination: req.file.destination,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      });
    }
    
    // Simplified response - just echo back what we received
    res.status(201).json({
      success: true,
      message: 'Debug course creation processed',
      receivedData: {
        body: req.body,
        file: req.file ? {
          originalname: req.file.originalname,
          filename: req.file.filename,
          mimetype: req.file.mimetype,
          size: req.file.size
        } : 'No file received'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Debug course creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
