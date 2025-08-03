
const Faculty = require('../model/Faculty.model');

// Create a new faculty
exports.createFaculty = async (req, res) => {
  try {
    const { name, subject, experience, bio } = req.body;
    // Save the public_id from Cloudinary (req.file.filename)
    const image = req.file ? req.file.filename : null;

    if (!image) {
        return res.status(400).json({ message: 'Image is required.' });
    }

    const newFaculty = new Faculty({
      name,
      subject,
      experience,
      bio,
      image, // Storing public_id
    });

    await newFaculty.save();
    res.status(201).json(newFaculty);
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
exports.getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
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
    const { name, subject, experience, bio } = req.body;
    const updateData = { name, subject, experience, bio };

    // If a new file is uploaded, update the image public_id
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedFaculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedFaculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.status(200).json(updatedFaculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a faculty
exports.deleteFaculty = async (req, res) => {
  try {
    // Note: This just deletes the DB record.
    // For a complete solution, you might want to delete the image from Cloudinary as well.
    // This requires using the Cloudinary Admin API.
    const deletedFaculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!deletedFaculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    res.status(200).json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
