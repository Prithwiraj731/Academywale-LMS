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
  return {
    _id: t.id,
    id: t.id,
    name: t.name,
    course: t.course,
    role: t.course, // alias for role
    message: t.message,
    text: t.message, // alias for text
    image: t.image,
    imageUrl: t.image_url,
    createdAt: t.created_at
  };
};

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const name = req.body.name;
    const course = req.body.course || req.body.role; 
    const message = req.body.message || req.body.text; 
    
    let image = null;
    let imageUrl = '';

    if (req.file) {
      const uploadResult = await uploadToSupabaseStorage(req.file, 'testimonials');
      image = uploadResult.publicId;
      imageUrl = uploadResult.url;
    }

    if (!name || !message) {
      return res.status(400).json({ message: 'Name and message are required.' });
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

    res.status(201).json({ testimonial: formatTestimonial(newTestimonial) });
  } catch (error) {
    console.error('Testimonial creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const { data: testimonials, error } = await supabaseAdmin
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ testimonials: (testimonials || []).map(formatTestimonial) });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(200).json(formatTestimonial(testimonial));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const { name, course, message } = req.body;
    const { id } = req.params;

    const { data: currentTestimonial, error: getErr } = await supabaseAdmin
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (getErr) throw getErr;
    if (!currentTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    const updateData = {
      name: name || currentTestimonial.name,
      course: course !== undefined ? course : currentTestimonial.course,
      message: message || currentTestimonial.message
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

    res.status(200).json({ testimonial: formatTestimonial(updatedTestimonial) });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
