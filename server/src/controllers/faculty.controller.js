const { supabaseAdmin } = require('../config/supabase.config');

// Helper to generate slug
const generateSlug = (firstName, lastName) => {
  const full = `${firstName} ${lastName || ''}`.trim().toLowerCase();
  return full.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

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

const deriveTeachesFromName = (name) => {
  const fullName = String(name || '').toUpperCase();
  const teaches = [];
  if (/\bCA\b/.test(fullName) || /CA\s*\/\s*/.test(fullName) || /CA\s*\+/.test(fullName)) {
    teaches.push('CA');
  }
  if (/\bCMA\b/.test(fullName) || /CMA\s*\/\s*/.test(fullName) || /CMA\s*\+/.test(fullName)) {
    teaches.push('CMA');
  }
  if (teaches.length === 0) {
    teaches.push('CA'); // Default fallback
  }
  return teaches;
};

const addPrefixToFacultyName = (name, teaches) => {
  return name ? name.trim() : '';
};

// @desc    Create a new faculty
// @route   POST /api/admin/faculties
// @access  Private/Admin
exports.createFaculty = async (req, res) => {
  try {
    console.log('📝 Faculty creation request received');
    console.log('📤 Request body:', req.body);
    
    const { firstName, lastName, bio, teaches } = req.body;
    
    // Upload image to Supabase Storage
    let imageUrl = '';
    let publicId = '';
    
    if (req.file) {
      const uploadResult = await uploadToSupabaseStorage(req.file, 'faculties');
      imageUrl = uploadResult.url;
      publicId = uploadResult.publicId;
    } else {
      return res.status(400).json({ message: 'Image is required.' });
    }

    // Auto-derive teaches from name since checkboxes are removed
    const parsedTeaches = deriveTeachesFromName(`${firstName} ${lastName || ''}`);
    const formattedFirstName = addPrefixToFacultyName(firstName, parsedTeaches);
    const slug = generateSlug(formattedFirstName, lastName);

    const { data: newFaculty, error } = await supabaseAdmin
      .from('faculties')
      .insert({
        first_name: formattedFirstName,
        last_name: lastName || null,
        bio: bio || '',
        teaches: parsedTeaches,
        image_url: imageUrl,
        public_id: publicId,
        slug,
        mongo_id: req.body.sequence ? String(req.body.sequence) : '999'
      })
      .select('*')
      .single();

    if (error) throw error;
    
    // Map response for Mongo compatibility
    const responseFaculty = {
      ...newFaculty,
      _id: newFaculty.id,
      firstName: newFaculty.first_name,
      lastName: newFaculty.last_name,
      imageUrl: newFaculty.image_url,
      image: newFaculty.public_id,
      courses: []
    };

    console.log('✅ Faculty created successfully in Supabase:', responseFaculty._id);
    res.status(201).json({ success: true, faculty: responseFaculty });

  } catch (error) {
    console.error('❌ Faculty creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all faculties
// @route   GET /api/faculties
// @access  Public
exports.getAllFaculties = async (req, res) => {
  try {
    const { data: faculties, error: facError } = await supabaseAdmin
      .from('faculties')
      .select('*');

    if (facError) throw facError;

    const { data: courses, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('is_active', true);

    if (courseError) throw courseError;

    // Group courses by faculty
    const coursesByFaculty = {};
    (courses || []).forEach(c => {
      if (c.faculty_id) {
        if (!coursesByFaculty[c.faculty_id]) {
          coursesByFaculty[c.faculty_id] = [];
        }
        coursesByFaculty[c.faculty_id].push({
          ...c,
          _id: c.id
        });
      }
    });

    const mapped = (faculties || []).map(f => ({
      ...f,
      _id: f.id,
      firstName: f.first_name,
      lastName: f.last_name,
      imageUrl: f.image_url,
      image: f.public_id,
      courses: coursesByFaculty[f.id] || []
    }));

    mapped.sort((a, b) => {
      const seqA = a.mongo_id !== undefined && a.mongo_id !== null && String(a.mongo_id).trim() !== '' ? Number(a.mongo_id) : 999;
      const seqB = b.mongo_id !== undefined && b.mongo_id !== null && String(b.mongo_id).trim() !== '' ? Number(b.mongo_id) : 999;
      return seqA - seqB;
    });

    res.status(200).json({ faculties: mapped });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single faculty by slug
// @route   GET /api/faculties/:slug
// @access  Public
exports.getFacultyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const { data: faculty, error: facError } = await supabaseAdmin
      .from('faculties')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (facError) throw facError;
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    const { data: courses, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('faculty_id', faculty.id)
      .eq('is_active', true);

    if (courseError) throw courseError;

    const mappedFaculty = {
      ...faculty,
      _id: faculty.id,
      firstName: faculty.first_name,
      lastName: faculty.last_name,
      imageUrl: faculty.image_url,
      image: faculty.public_id,
      courses: (courses || []).map(c => ({
        ...c,
        _id: c.id
      }))
    };

    res.status(200).json(mappedFaculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a faculty
// @route   PUT /api/admin/faculty/:slug
// @access  Private/Admin
exports.updateFaculty = async (req, res) => {
  try {
    const firstName = req.body.firstName || req.body.first_name;
    const lastName = req.body.lastName !== undefined ? req.body.lastName : req.body.last_name;
    const bio = req.body.bio;
    let teaches = req.body.teaches || req.body['teaches[]'];
    const { slug } = req.params;

    // Find current faculty to preserve image if not uploaded
    const { data: currentFaculty, error: getError } = await supabaseAdmin
      .from('faculties')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (getError) throw getError;
    if (!currentFaculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    const updateData = {
      bio: bio !== undefined ? bio : currentFaculty.bio,
      mongo_id: req.body.sequence !== undefined ? String(req.body.sequence) : currentFaculty.mongo_id,
      updated_at: new Date()
    };

    const activeFirstName = firstName !== undefined ? firstName : currentFaculty.first_name;
    const activeLastName = lastName !== undefined ? lastName : currentFaculty.last_name;
    const parsedTeaches = deriveTeachesFromName(`${activeFirstName} ${activeLastName || ''}`);
    updateData.teaches = parsedTeaches;

    const formattedFirstName = addPrefixToFacultyName(activeFirstName, parsedTeaches);
    updateData.first_name = formattedFirstName;
    updateData.last_name = activeLastName;

    if (req.file) {
      const uploadResult = await uploadToSupabaseStorage(req.file, 'faculties');
      updateData.image_url = uploadResult.url;
      updateData.public_id = uploadResult.publicId;
    }

    // Always regenerate slug if name changes or teaches changes (which changes prefix/name)
    if (formattedFirstName !== currentFaculty.first_name || (lastName !== undefined && lastName !== currentFaculty.last_name)) {
      updateData.slug = generateSlug(formattedFirstName, lastName !== undefined ? lastName : currentFaculty.last_name);
    }

    const { data: updatedFaculty, error: updateError } = await supabaseAdmin
      .from('faculties')
      .update(updateData)
      .eq('id', currentFaculty.id)
      .select('*')
      .single();

    if (updateError) throw updateError;

    const responseFaculty = {
      ...updatedFaculty,
      _id: updatedFaculty.id,
      firstName: updatedFaculty.first_name,
      lastName: updatedFaculty.last_name,
      imageUrl: updatedFaculty.image_url,
      image: updatedFaculty.public_id,
      courses: []
    };

    res.status(200).json({ success: true, faculty: responseFaculty });
  } catch (error) {
    console.error('Update faculty error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a faculty
// @route   DELETE /api/admin/faculty/:slug
// @access  Private/Admin
exports.deleteFaculty = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // 1. Fetch faculty ID
    const { data: faculty, error: fetchErr } = await supabaseAdmin
      .from('faculties')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (fetchErr) throw fetchErr;
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // 2. Nullify faculty references in purchases to avoid foreign key violations
    const { error: updatePurchasesErr } = await supabaseAdmin
      .from('purchases')
      .update({ faculty_id: null })
      .eq('faculty_id', faculty.id);

    if (updatePurchasesErr) {
      console.error('❌ Error nullifying faculty references in purchases:', updatePurchasesErr.message);
      throw updatePurchasesErr;
    }

    // 3. Delete the faculty
    const { error: deleteErr } = await supabaseAdmin
      .from('faculties')
      .delete()
      .eq('id', faculty.id);

    if (deleteErr) throw deleteErr;

    res.status(200).json({ success: true, message: 'Faculty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete all faculties
// @route   DELETE /api/admin/faculties/delete-all
// @access  Private/Admin
exports.deleteAllFaculty = async (req, res) => {
  try {
    console.log('🗑️ Admin requested to delete all faculty');

    // 1. Nullify all faculty references in purchases
    const { error: updatePurchasesErr } = await supabaseAdmin
      .from('purchases')
      .update({ faculty_id: null })
      .neq('faculty_id', '00000000-0000-0000-0000-000000000000');

    if (updatePurchasesErr) {
      console.error('❌ Error nullifying all faculty references in purchases:', updatePurchasesErr.message);
      throw updatePurchasesErr;
    }
    
    const { data, error } = await supabaseAdmin
      .from('faculties')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all rows

    if (error) throw error;
    
    res.status(200).json({ 
      success: true, 
      message: 'Successfully deleted all faculty members'
    });
  } catch (error) {
    console.error('❌ Error deleting all faculty:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete faculty',
      error: error.message 
    });
  }
};

// @desc    Get faculty info by firstName (legacy)
// @route   GET /api/faculty-info/:firstName
// @access  Public
exports.getFacultyInfo = async (req, res) => {
  try {
    const { firstName } = req.params;
    const { data: faculty, error } = await supabaseAdmin
      .from('faculties')
      .select('bio, teaches, last_name')
      .ilike('first_name', firstName.trim())
      .maybeSingle();

    if (error) throw error;

    if (faculty) {
      res.json({
        bio: faculty.bio,
        teaches: faculty.teaches,
        lastName: faculty.last_name || ''
      });
    } else {
      res.json({
        bio: '',
        teaches: [],
        lastName: ''
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update faculty info (legacy)
// @route   POST /api/admin/faculty-info
// @access  Private/Admin
exports.updateFacultyInfo = async (req, res) => {
  try {
    const { firstName, bio, teaches } = req.body;

    if (!firstName) {
      return res.status(400).json({ error: 'Faculty firstName is required' });
    }

    const { data: faculty, error: getErr } = await supabaseAdmin
      .from('faculties')
      .select('id')
      .ilike('first_name', firstName.trim())
      .maybeSingle();

    if (getErr) throw getErr;
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    const { data: updatedFaculty, error: updateErr } = await supabaseAdmin
      .from('faculties')
      .update({
        bio: bio || '',
        teaches: teaches || [],
        updated_at: new Date()
      })
      .eq('id', faculty.id)
      .select('*')
      .single();

    if (updateErr) throw updateErr;

    res.json({ success: true, faculty: updatedFaculty });
  } catch (error) {
    console.error('Faculty update error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Reorder faculties
// @route   PUT /api/admin/faculty/reorder
// @access  Private/Admin
exports.reorderFaculties = async (req, res) => {
  try {
    const { order } = req.body; // array of IDs in order
    if (!Array.isArray(order)) {
      return res.status(400).json({ error: 'Invalid order data. Must be an array of IDs.' });
    }

    console.log('🔄 Reordering faculties with new order:', order);

    for (let i = 0; i < order.length; i++) {
      const id = order[i];
      const { error } = await supabaseAdmin
        .from('faculties')
        .update({ mongo_id: String(i + 1), updated_at: new Date() })
        .eq('id', id);

      if (error) {
        console.error(`❌ Failed to update sequence for faculty ${id}:`, error.message);
        throw error;
      }
    }

    res.status(200).json({ success: true, message: 'Faculties reordered successfully' });
  } catch (error) {
    console.error('❌ Error reordering faculties:', error);
    res.status(500).json({ error: error.message });
  }
};
