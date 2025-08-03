
const Faculty = require('../model/Faculty.model');

// Create a new faculty
exports.createFaculty = async (req, res) => {
  try {
    const { firstName, lastName, bio, teaches } = req.body;
    const imageUrl = req.file ? req.file.path : '';
    const public_id = req.file ? req.file.filename : '';

    if (!imageUrl) {
        return res.status(400).json({ message: 'Image is required.' });
    }

    // Parse teaches from JSON string
    let parsedTeaches = [];
    try {
      parsedTeaches = JSON.parse(teaches);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid teaches format.' });
    }

    // Generate slug
    const slug = `${firstName.toLowerCase().replace(/ /g, '-')}-${lastName ? lastName.toLowerCase().replace(/ /g, '-') : ''}`.replace(/--/g, '-').replace(/^-|-$/g, '');

    const newFaculty = new Faculty({
      firstName,
      lastName,
      bio,
      teaches: parsedTeaches,
      imageUrl,
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
    const { firstName, lastName, bio, teaches } = req.body;
    const { slug } = req.params; // Get slug from params

    const updateData = { firstName, lastName, bio };

    // Parse teaches from JSON string if it exists
    if (teaches) {
      try {
        updateData.teaches = JSON.parse(teaches);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid teaches format.' });
      }
    }

    // If a new file is uploaded, update the image public_id and imageUrl
    if (req.file) {
      updateData.imageUrl = req.file.path;
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
