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
      .eq('is_active', true)
      .order('display_order', { ascending: true, nullsFirst: false });

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

// Reorder courses sequence endpoint
const handleCourseReorder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, error: 'Items array is required' });
    }

    const isUuid = (val) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(val));

    for (const item of items) {
      if (!item.id) continue;
      const order = Number(item.displayOrder !== undefined ? item.displayOrder : (item.sequence || 0));

      const targetId = String(item.id);
      let query = supabaseAdmin.from('courses').update({
        display_order: order,
        sequence: order,
        updated_at: new Date().toISOString()
      });

      if (isUuid(targetId)) {
        query = query.eq('id', targetId);
      } else {
        query = query.eq('mongo_id', targetId);
      }

      const { error } = await query;

      if (error) {
        // Fallback: try update display_order without sequence if sequence column does not exist
        let fallbackQuery = supabaseAdmin.from('courses').update({
          display_order: order,
          updated_at: new Date().toISOString()
        });
        if (isUuid(targetId)) {
          fallbackQuery = fallbackQuery.eq('id', targetId);
        } else {
          fallbackQuery = fallbackQuery.eq('mongo_id', targetId);
        }
        await fallbackQuery;
      }
    }

    res.json({ success: true, message: 'Courses sequence updated successfully' });
  } catch (err) {
    console.error('Error reordering courses:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

router.put('/api/courses/reorder', handleCourseReorder);
router.put('/api/admin/courses/reorder', handleCourseReorder);


module.exports = router;

