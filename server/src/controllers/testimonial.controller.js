
const Testimonial = require('../model/Testimonial.model');

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { name, course, message } = req.body;
    // Save the public_id from Cloudinary (req.file.filename)
    const image = req.file ? req.file.filename : null;

    if (!image) {
        return res.status(400).json({ message: 'Image is required.' });
    }

    const newTestimonial = new Testimonial({
      name,
      course,
      message,
      image, // Storing public_id
    });

    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single testimonial by ID
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(200).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const { name, course, message } = req.body;
    const updateData = { name, course, message };

    // If a new file is uploaded, update the image public_id
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.status(200).json(updatedTestimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    // Note: This just deletes the DB record.
    // For a complete solution, you might want to delete the image from Cloudinary as well.
    const deletedTestimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deletedTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
