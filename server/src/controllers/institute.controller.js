const Institute = require('../model/Institute.model');
const Faculty = require('../model/Faculty.model');

// Get all institutes
exports.getAllInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.find();
    res.status(200).json({ institutes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get institute by name/slug with courses
exports.getInstituteByName = async (req, res) => {
  try {
    const { name } = req.params;
    const institute = await Institute.findOne({ 
      name: { $regex: new RegExp(name, 'i') } 
    });
    
    if (!institute) {
      return res.status(404).json({ message: 'Institute not found' });
    }

    // Get all courses from faculties that are associated with this institute
    const faculties = await Faculty.find({
      'courses.institute': { $regex: new RegExp(institute.name, 'i') }
    });

    // Collect all courses that mention this institute
    const courses = [];
    faculties.forEach(faculty => {
      faculty.courses.forEach(course => {
        if (course.institute && course.institute.toLowerCase().includes(institute.name.toLowerCase())) {
          courses.push({
            ...course.toObject(),
            facultySlug: faculty.slug,
            facultyName: course.facultyName || `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`
          });
        }
      });
    });

    const instituteWithCourses = {
      ...institute.toObject(),
      courses
    };
    
    res.status(200).json({ institute: instituteWithCourses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create institute
exports.createInstitute = async (req, res) => {
  try {
    const { name } = req.body;
    const imageUrl = req.file ? req.file.path : '';
    const public_id = req.file ? req.file.filename : '';

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image is required.' });
    }

    const newInstitute = new Institute({
      name,
      imageUrl,
      image: public_id, // Store public_id for Cloudinary
      public_id
    });

    await newInstitute.save();
    res.status(201).json({ success: true, institute: newInstitute });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update institute
exports.updateInstitute = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const updateData = { name };

    if (req.file) {
      updateData.imageUrl = req.file.path;
      updateData.image = req.file.filename; // Store public_id for Cloudinary
      updateData.public_id = req.file.filename;
    }

    const updatedInstitute = await Institute.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedInstitute) {
      return res.status(404).json({ message: 'Institute not found' });
    }

    res.status(200).json({ success: true, institute: updatedInstitute });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete institute
exports.deleteInstitute = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInstitute = await Institute.findByIdAndDelete(id);
    
    if (!deletedInstitute) {
      return res.status(404).json({ message: 'Institute not found' });
    }
    
    res.status(200).json({ success: true, message: 'Institute deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
