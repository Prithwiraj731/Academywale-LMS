const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase.config');

// Import unified course controllers
const courseController = require('../controllers/course.controller');
const courseDetailController = require('../controllers/courseDetail.controller');
const { requireAdminCookie } = require('../middlewares/auth.middleware');

/*
 * IMPORTANT: This file contains redirects for all legacy standalone course routes.
 * All standalone courses are now handled through the unified faculty system using "N/A" faculty.
 * These redirects ensure backward compatibility for any clients still using the old APIs.
 */

// Explicitly handle OPTIONS requests for CORS preflight
router.options('/api/admin/courses/standalone', (req, res) => {
  // Set CORS headers for preflight requests
  const origin = req.headers.origin;
  const allowed = [
    'https://academywale.com',
    'https://www.academywale.com',
    'https://academywale-lms-backend.onrender.com',
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

// Public routes redirects
router.get('/api/courses/standalone', (req, res) => {
  // Standalone courses are no longer supported
  console.log('⚠️ Legacy route /api/courses/standalone called - standalone courses no longer supported');

  // Instead of error, return empty array to prevent frontend from displaying anything
  res.status(200).json({
    courses: [],
    notice: 'Standalone courses are no longer supported. All courses must be associated with a specific faculty.'
  });
});

// Route for all courses - now redirects to get all courses from all faculties
router.get('/api/courses/all', async (req, res) => {
  console.log('⚠️ Legacy route /api/courses/all called - retrieving courses from all faculties');

  try {
    const { data: courses, error } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;

    const mappedCourses = (courses || []).map(c => ({
      ...c,
      _id: c.id,
      facultyName: c.faculty_name,
      facultySlug: c.faculty_slug,
      institute: c.institute_name,
      posterUrl: c.poster_url,
      posterPublicId: c.poster_public_id,
      modeAttemptPricing: c.mode_attempt_pricing,
      costPrice: c.cost_price,
      sellingPrice: c.selling_price
    }));

    res.status(200).json({
      courses: mappedCourses,
      notice: 'Using faculty-based course system'
    });
  } catch (err) {
    console.error('Error in all courses redirect:', err);
    res.status(500).json({
      error: 'Error fetching all courses',
      message: err.message
    });
  }
});

// Individual course route - now redirects to courseDetail controller
router.get('/api/courses/:id', (req, res) => {
  console.log(`⚠️ Legacy route /api/courses/${req.params.id} called - redirecting to unified course system`);
  // Use the unified course detail controller
  courseDetailController.getCourseDetails(req, res);
});

// Admin routes with explicit CORS handling
router.post('/api/admin/courses/standalone', requireAdminCookie, (req, res) => {
  // Set CORS headers explicitly for this route
  const origin = req.headers.origin;
  const allowed = [
    'https://academywale.com',
    'https://www.academywale.com',
    'https://academywale-lms-backend.onrender.com',
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

  // Reject the request - standalone courses are no longer supported
  res.status(400).json({
    success: false,
    error: 'Standalone courses are no longer supported',
    message: 'All courses must be associated with a specific faculty. Please use the faculty-based course endpoints.'
  });
});

// Admin PUT route - reject standalone course updates
router.put('/api/admin/courses/standalone/:id', requireAdminCookie, (req, res) => {
  console.log(`⚠️ Legacy route PUT /api/admin/courses/standalone/${req.params.id} called - standalone courses no longer supported`);

  // Reject the request
  res.status(400).json({
    success: false,
    error: 'Standalone courses are no longer supported',
    message: 'All courses must be associated with a specific faculty. Please use the faculty-based course endpoints.'
  });
});

// Admin DELETE route - reject standalone course deletion
router.delete('/api/admin/courses/standalone/:id', requireAdminCookie, (req, res) => {
  console.log(`⚠️ Legacy route DELETE /api/admin/courses/standalone/${req.params.id} called - standalone courses no longer supported`);

  // Reject the request
  res.status(400).json({
    success: false,
    error: 'Standalone courses are no longer supported',
    message: 'All courses must be associated with a specific faculty. Please use the faculty-based course endpoints.'
  });
});

module.exports = router;
