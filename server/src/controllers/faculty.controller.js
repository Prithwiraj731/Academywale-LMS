
const Faculty = require('../model/Faculty.model');

// Create a new faculty
exports.createFaculty = async (req, res) => {
  try {
    const { firstName, lastName, bio } = req.body;
    const imageUrl = req.file ? req.file.path : '';
    const public_id = req.file ? req.file.filename : '';

    if (!imageUrl) {
        return res.status(400).json({ message: 'Image is required.' });
    }

    // Handle teaches array - it comes as req.body['teaches[]'] from FormData
    let parsedTeaches = [];
    if (req.body['teaches[]']) {
      // If single value, convert to array
      if (typeof req.body['teaches[]'] === 'string') {
        parsedTeaches = [req.body['teaches[]']];
      } else {
        // If already array, use as is
        parsedTeaches = req.body['teaches[]'];
      }
    }

    // Generate slug
    const slug = `${firstName.toLowerCase().replace(/ /g, '-')}-${lastName ? lastName.toLowerCase().replace(/ /g, '-') : ''}`.replace(/--/g, '-').replace(/^-|-$/g, '');

    const newFaculty = new Faculty({
      firstName,
      lastName,
      bio,
      teaches: parsedTeaches,
      imageUrl,
      image: public_id, // Store public_id for Cloudinary
      public_id, // Store public_id for potential deletion later
      slug,
    });

    await newFaculty.save();
    res.status(201).json({ success: true, faculty: newFaculty });
  } catch (error) {
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
    const { firstName, lastName, bio } = req.body;
    const { slug } = req.params; // Get slug from params

    const updateData = { firstName, lastName, bio };

    // Handle teaches array - it comes as req.body['teaches[]'] from FormData
    if (req.body['teaches[]']) {
      // If single value, convert to array
      if (typeof req.body['teaches[]'] === 'string') {
        updateData.teaches = [req.body['teaches[]']];
      } else {
        // If already array, use as is
        updateData.teaches = req.body['teaches[]'];
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
