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
      const field = isUuid(targetId) ? 'id' : 'mongo_id';

      // Fetch existing custom_details
      const { data: dbCourse } = await supabaseAdmin
        .from('courses')
        .select('custom_details')
        .eq(field, targetId)
        .maybeSingle();

      let updatedCustom;
      if (dbCourse && Array.isArray(dbCourse.custom_details)) {
        updatedCustom = dbCourse.custom_details.filter(i => i && i.fieldType !== '__DISPLAY_ORDER__' && i.label !== '__DISPLAY_ORDER__');
        updatedCustom.push({ fieldType: '__DISPLAY_ORDER__', label: '__DISPLAY_ORDER__', value: Number(order) });
      } else if (dbCourse && typeof dbCourse.custom_details === 'object' && dbCourse.custom_details !== null) {
        updatedCustom = { ...dbCourse.custom_details, display_order: Number(order), displayOrder: Number(order) };
      } else {
        updatedCustom = [{ fieldType: '__DISPLAY_ORDER__', label: '__DISPLAY_ORDER__', value: Number(order) }];
      }

      const { error } = await supabaseAdmin
        .from('courses')
        .update({
          custom_details: updatedCustom,
          updated_at: new Date().toISOString()
        })
        .eq(field, targetId);

      if (error) {
        console.warn(`Failed to update display_order for course ${targetId}:`, error.message);
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

