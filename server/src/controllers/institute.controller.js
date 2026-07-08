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

// @desc    Get all institutes
// @route   GET /api/institutes
// @access  Public
exports.getAllInstitutes = async (req, res) => {
  try {
    const { data: institutes, error } = await supabaseAdmin
      .from('institutes')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    const mapped = (institutes || []).map(inst => ({
      ...inst,
      _id: inst.id, // compatibility
      image: inst.public_id
    }));

    res.status(200).json({ institutes: mapped });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get institute by name/slug with courses
// @route   GET /api/institutes/:name
// @access  Public
exports.getInstituteByName = async (req, res) => {
  try {
    const { name } = req.params;

    // Fetch the institute
    const { data: institute, error: instError } = await supabaseAdmin
      .from('institutes')
      .select('*')
      .ilike('name', `%${name}%`)
      .maybeSingle();

    if (instError) throw instError;
    if (!institute) {
      return res.status(404).json({ message: 'Institute not found' });
    }

    // Fetch courses linked to this institute
    const { data: courses, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('institute_name', institute.name)
      .eq('is_active', true);

    if (courseError) throw courseError;

    const mappedCourses = (courses || []).map(c => ({
      ...c,
      _id: c.id
    }));

    const instituteWithCourses = {
      ...institute,
      _id: institute.id,
      image: institute.public_id,
      courses: mappedCourses
    };

    res.status(200).json({ institute: instituteWithCourses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create institute
// @route   POST /api/admin/institutes
// @access  Private/Admin
exports.createInstitute = async (req, res) => {
  try {
    const { name } = req.body;
    
    let imageUrl = '';
    let publicId = '';

    if (req.file) {
      const uploadResult = await uploadToSupabaseStorage(req.file, 'institutes');
      imageUrl = uploadResult.url;
      publicId = uploadResult.publicId;
    } else {
      return res.status(400).json({ message: 'Image is required.' });
    }

    const { data: newInst, error } = await supabaseAdmin
      .from('institutes')
      .insert({
        name,
        image_url: imageUrl,
        public_id: publicId
      })
      .select('*')
      .single();

    if (error) throw error;

    const responseInst = {
      ...newInst,
      _id: newInst.id,
      image: newInst.public_id
    };

    res.status(201).json({ success: true, institute: responseInst });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update institute
// @route   PUT /api/admin/institutes/:id
// @access  Private/Admin
exports.updateInstitute = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    // Verify ID format (UUID vs Mongo ID)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let queryField = isUuid ? 'id' : 'mongo_id';

    const { data: currentInst, error: getErr } = await supabaseAdmin
      .from('institutes')
      .select('*')
      .eq(queryField, id)
      .maybeSingle();

    if (getErr) throw getErr;
    if (!currentInst) {
      return res.status(404).json({ message: 'Institute not found' });
    }

    const updateData = {
      name: name || currentInst.name,
      updated_at: new Date()
    };

    if (req.file) {
      const uploadResult = await uploadToSupabaseStorage(req.file, 'institutes');
      updateData.image_url = uploadResult.url;
      updateData.public_id = uploadResult.publicId;
    }

    const { data: updatedInst, error: updateErr } = await supabaseAdmin
      .from('institutes')
      .update(updateData)
      .eq('id', currentInst.id)
      .select('*')
      .single();

    if (updateErr) throw updateErr;

    const responseInst = {
      ...updatedInst,
      _id: updatedInst.id,
      image: updatedInst.public_id
    };

    res.status(200).json({ success: true, institute: responseInst });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete institute
// @route   DELETE /api/admin/institutes/:id
// @access  Private/Admin
exports.deleteInstitute = async (req, res) => {
  try {
    const { id } = req.params;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let queryField = isUuid ? 'id' : 'mongo_id';

    const { data: deletedInst, error } = await supabaseAdmin
      .from('institutes')
      .delete()
      .eq(queryField, id)
      .select('id')
      .maybeSingle();

    if (error) throw error;
    
    if (!deletedInst) {
      return res.status(404).json({ message: 'Institute not found' });
    }
    
    res.status(200).json({ success: true, message: 'Institute deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
