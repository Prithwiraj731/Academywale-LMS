const express = require('express');
const router = express.Router();
const { requireAdminCookie } = require('../middlewares/auth.middleware');
const { supabaseAdmin } = require('../config/supabase.config');

/**
 * GET /api/migration/missing-images
 */
router.get('/missing-images', async (req, res) => {
  res.json({
    success: true,
    data: {
      faculties: [],
      testimonials: [],
      totalCount: 0
    }
  });
});

/**
 * POST /api/migration/update-faculty-image/:id
 */
router.post('/update-faculty-image/:id', requireAdminCookie, async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl, public_id } = req.body;

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let queryField = isUuid ? 'id' : 'mongo_id';

    const { data: updated, error } = await supabaseAdmin
      .from('faculties')
      .update({
        image_url: imageUrl,
        public_id: public_id
      })
      .eq(queryField, id)
      .select('*')
      .maybeSingle();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Faculty image updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/migration/update-testimonial-image/:id
 */
router.post('/update-testimonial-image/:id', requireAdminCookie, async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl, public_id } = req.body;

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let queryField = isUuid ? 'id' : 'mongo_id';

    const { data: updated, error } = await supabaseAdmin
      .from('testimonials')
      .update({
        image_url: imageUrl,
        image: public_id
      })
      .eq(queryField, id)
      .select('*')
      .maybeSingle();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Testimonial image updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
