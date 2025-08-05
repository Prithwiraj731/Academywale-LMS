
const Faculty = require('../model/Faculty.model');

// Create a new faculty
exports.createFaculty = async (req, res) => {
  try {
    console.log('📝 Faculty creation request received');
    console.log('📤 Request body:', req.body);
    console.log('📸 File received:', req.file ? 'Yes' : 'No');
    
    if (req.file) {
      console.log('📂 File details:');
      console.log('- originalname:', req.file.originalname);
      console.log('- mimetype:', req.file.mimetype);
      console.log('- size:', req.file.size);
      console.log('- path (Cloudinary URL):', req.file.path);
      console.log('- filename (public_id):', req.file.filename);
    }
    
    const { firstName, lastName, bio, teaches } = req.body;
    
    // Get the proper Cloudinary URL from the uploaded file
    const imageUrl = req.file ? req.file.path : ''; 
    const public_id = req.file ? req.file.filename : ''; 

    if (!imageUrl) {
        console.log('❌ Image is missing - no file uploaded');
        return res.status(400).json({ message: 'Image is required.' });
    }

    // 🚨 CRITICAL CHECK: Ensure it's a Cloudinary URL
    if (!imageUrl.includes('cloudinary.com')) {
        console.log('🚨 CRITICAL ERROR: Image not uploaded to Cloudinary!');
        console.log('🚨 Current imageUrl:', imageUrl);
        console.log('🚨 This suggests multer is using local storage instead of Cloudinary');
        return res.status(500).json({ 
            error: 'Image upload failed - not using Cloudinary storage',
            imageUrl: imageUrl,
            message: 'Server configuration error'
        });
    }

    console.log('✅ Image uploaded successfully to Cloudinary:', imageUrl);
    console.log('🔑 Public ID:', public_id);

    // Handle teaches array
    let parsedTeaches = [];
    
    if (teaches) {
      try {
        // Try to parse as JSON first
        parsedTeaches = JSON.parse(teaches);
        console.log('Parsed teaches from JSON:', parsedTeaches);
      } catch (e) {
        console.log('Failed to parse teaches as JSON, treating as string/array');
        // If JSON parsing fails, handle as string or array
        if (typeof teaches === 'string') {
          // If it's a string like "CMA,CA", split it
          parsedTeaches = teaches.split(',').map(t => t.trim());
        } else if (Array.isArray(teaches)) {
          parsedTeaches = teaches;
        } else {
          parsedTeaches = [teaches]; // Single value
        }
      }
    }
    
    console.log('Final parsed teaches:', parsedTeaches);

    // Generate slug
    const slug = `${firstName.toLowerCase().replace(/ /g, '-')}-${lastName ? lastName.toLowerCase().replace(/ /g, '-') : ''}`.replace(/--/g, '-').replace(/^-|-$/g, '');

    const newFaculty = new Faculty({
      firstName,
      lastName,
      bio,
      teaches: parsedTeaches,
      imageUrl, // This should be the full Cloudinary secure_url
      image: public_id, // Store public_id for Cloudinary transformations
      public_id, // Store public_id for potential deletion later
      slug,
    });

    console.log('💾 Saving faculty to database...');
    await newFaculty.save();
    console.log('✅ Faculty saved successfully:', newFaculty._id);
    
    res.status(201).json({ success: true, faculty: newFaculty });
  } catch (error) {
    console.error('❌ Faculty creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all faculties
exports.getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.status(200).json({ faculties }); // Match the original structure
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single faculty by ID
exports.getFacultyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const faculty = await Faculty.findOne({ slug });
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a faculty
exports.updateFaculty = async (req, res) => {
  try {
    const { firstName, lastName, bio, teaches } = req.body;
    const { slug } = req.params; // Get slug from params

    const updateData = { firstName, lastName, bio };

    // Handle teaches array
    if (teaches) {
      try {
        // Try to parse as JSON first
        updateData.teaches = JSON.parse(teaches);
      } catch (e) {
        // If JSON parsing fails, handle as string or array
        if (typeof teaches === 'string') {
          // If it's a string like "CMA,CA", split it
          updateData.teaches = teaches.split(',').map(t => t.trim());
        } else if (Array.isArray(teaches)) {
          updateData.teaches = teaches;
        } else {
          updateData.teaches = [teaches]; // Single value
        }
      }
    }

    // If a new file is uploaded, update the image public_id and imageUrl
    if (req.file) {
      updateData.imageUrl = req.file.path;
      updateData.image = req.file.filename; // Store public_id for Cloudinary
      updateData.public_id = req.file.filename;
    }

    const updatedFaculty = await Faculty.findOneAndUpdate(
      { slug: slug }, // Find by slug
      updateData,
      { new: true }
    );

    if (!updatedFaculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.status(200).json({ success: true, faculty: updatedFaculty });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a faculty
exports.deleteFaculty = async (req, res) => {
  try {
    const { slug } = req.params;
    const deletedFaculty = await Faculty.findOneAndDelete({ slug });
    if (!deletedFaculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    res.status(200).json({ success: true, message: 'Faculty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
