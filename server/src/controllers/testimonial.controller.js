const { supabaseAdmin } = require('../config/supabase.config');

// Helper to upload image to Supabase Storage
async function uploadToSupabaseStorage(file, folder) {
  if (!file) return { url: '', publicId: '' };
  
  const fileName = `${folder}/${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const { data, error } = await supabaseAdmin.storage
    .from('academywale-media')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });
    
  if (error) {
    console.error('❌ Supabase storage upload error:', error.message);
    throw error;
  }
  
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('academywale-media')
    .getPublicUrl(fileName);
    
  return { url: publicUrl, publicId: fileName };
}

// Helper to format testimonial for client-side compatibility
const formatTestimonial = (t) => {
  if (!t) return null;
  const roleVal = t.course || '';
  const msgVal = t.message || '';
  const imgUrlVal = t.image_url || (t.image && t.image.startsWith('http') ? t.image : '');
  return {
    _id: t.id,
    id: t.id,
    name: t.name,
    course: roleVal,
    role: roleVal, // alias for role
    designation: roleVal, // alias for designation
    message: msgVal,
    text: msgVal, // alias for text
    review: msgVal, // alias for review
    image: t.image || '',
    imageUrl: imgUrlVal,
    avatar: imgUrlVal,
    createdAt: t.created_at
  };
};

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const name = (req.body.name || '').trim();
    const course = (req.body.course || req.body.role || req.body.designation || '').trim(); 
    const message = (req.body.message || req.body.text || req.body.review || '').trim(); 
    
    let image = null;
    let imageUrl = '';

    if (req.file) {
      const uploadResult = await uploadToSupabaseStorage(req.file, 'testimonials');
      image = uploadResult.publicId;
      imageUrl = uploadResult.url;
    } else if (req.body.imageUrl || req.body.image) {
      imageUrl = req.body.imageUrl || req.body.image;
    }

    if (!name || !message) {
      return res.status(400).json({ success: false, message: 'Name and message are required.' });
    }

    const { data: newTestimonial, error } = await supabaseAdmin
      .from('testimonials')
      .insert({
        name,
        course,
        message,
        image,
        image_url: imageUrl
      })
      .select('*')
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, testimonial: formatTestimonial(newTestimonial) });
  } catch (error) {
    console.error('Testimonial creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const { data: testimonials, error } = await supabaseAdmin
      .from('testimonials')
      .select('*')
      .neq('name', '__COUPON_METADATA__')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ success: true, testimonials: (testimonials || []).map(formatTestimonial) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single testimonial by ID
exports.getTestimonialById = async (req, res) => {
  try {
    const { data: testimonial, error } = await supabaseAdmin
      .from('testimonials')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.status(200).json({ success: true, testimonial: formatTestimonial(testimonial) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const { name, course, role, designation, message, text, review } = req.body;
    const { id } = req.params;

    const { data: currentTestimonial, error: getErr } = await supabaseAdmin
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (getErr) throw getErr;
    if (!currentTestimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    const updatedRole = designation !== undefined ? designation : (role !== undefined ? role : (course !== undefined ? course : currentTestimonial.course));
    const updatedMsg = message !== undefined ? message : (text !== undefined ? text : (review !== undefined ? review : currentTestimonial.message));

    const updateData = {
      name: name ? String(name).trim() : currentTestimonial.name,
      course: updatedRole ? String(updatedRole).trim() : currentTestimonial.course,
      message: updatedMsg ? String(updatedMsg).trim() : currentTestimonial.message
    };

    if (req.file) {
      const uploadResult = await uploadToSupabaseStorage(req.file, 'testimonials');
      updateData.image_url = uploadResult.url;
      updateData.image = uploadResult.publicId;
    }

    const { data: updatedTestimonial, error: updateError } = await supabaseAdmin
      .from('testimonials')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) throw updateError;

    res.status(200).json({ success: true, testimonial: formatTestimonial(updatedTestimonial) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
