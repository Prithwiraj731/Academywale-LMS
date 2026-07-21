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

    res.json({ success: true, courses: mapped });
  } catch (error) {
    console.error('Error in direct CA Foundation Paper 1 endpoint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reorder courses sequence endpoint

router.put('/api/courses/reorder', async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, error: 'Items array is required' });
    }

    for (const item of items) {
      if (!item.id) continue;
      const order = Number(item.displayOrder !== undefined ? item.displayOrder : (item.sequence || 0));

      const { error } = await supabaseAdmin
        .from('courses')
        .update({ 
          display_order: order,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id);

      if (error) {
        console.warn(`Reorder update notice for course ${item.id}:`, error.message);
      }
    }

    res.json({ success: true, message: 'Courses sequence updated successfully' });
  } catch (err) {
    console.error('Error reordering courses:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

