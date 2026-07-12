const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase.config');
const { mapCoursesToFrontend } = require('../utils/courseMapper');

// Test route to check if controller routes are working
router.get('/api/courses/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Course controller routes are working with Supabase!',
    timestamp: new Date().toISOString()
  });
});

// Get all courses (compatibility endpoint)
router.get('/api/courses/all', async (req, res) => {
  try {
    const { data: courses, error } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;

    const mapped = mapCoursesToFrontend(courses);

    res.json({ success: true, courses: mapped });
  } catch (error) {
    console.error('Error fetching all courses from Supabase:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Direct endpoint for CA Foundation Paper 1 (bypass complex filtering)
router.get('/api/courses/CA/foundation/1/direct', async (req, res) => {
  try {
    const { data: courses, error } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('category', 'CA')
      .ilike('subcategory', '%foundation%')
      .eq('paper_id', '1')
      .eq('is_active', true);

    if (error) throw error;

    const mapped = mapCoursesToFrontend(courses);

    res.json({ success: true, courses: mapped });
  } catch (error) {
    console.error('Error in direct CA Foundation Paper 1 endpoint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
