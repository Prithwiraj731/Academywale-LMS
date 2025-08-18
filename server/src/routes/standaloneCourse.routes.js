const express = require('express');
const router = express.Router();
const multer = require('multer');
const { courseStorage } = require('../config/cloudinary.config');
const upload = multer({ storage: courseStorage });
const standaloneCourseController = require('../controllers/standaloneCourse.controller');

// Explicitly handle OPTIONS requests for CORS preflight
router.options('/api/admin/courses/standalone', (req, res) => {
  // Set CORS headers for preflight requests
  const origin = req.headers.origin;
  const allowed = [
    'https://academywale.com',
    'https://www.academywale.com',
    'https://academywale-lms.onrender.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ];
  
  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.sendStatus(200);
});

// Public routes
router.get('/api/courses/standalone', standaloneCourseController.getAllStandaloneCourses);
router.get('/api/courses/all', standaloneCourseController.getAllCourses);
router.get('/api/courses/:id', standaloneCourseController.getCourseById);

// Admin routes with explicit CORS handling
router.post('/api/admin/courses/standalone', (req, res, next) => {
  // Set CORS headers explicitly for this route
  const origin = req.headers.origin;
  const allowed = [
    'https://academywale.com',
    'https://www.academywale.com',
    'https://academywale-lms.onrender.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ];
  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
}, upload.single('poster'), standaloneCourseController.createStandaloneCourse);

router.put('/api/admin/courses/standalone/:id', upload.single('poster'), standaloneCourseController.updateStandaloneCourse);
router.delete('/api/admin/courses/standalone/:id', standaloneCourseController.deleteStandaloneCourse);

module.exports = router;
