const Testimonial = require('../model/Testimonial.model');
const path = require('path');
const fs = require('fs');

// Get all testimonials
exports.getAll = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, testimonials });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Add testimonial
exports.add = async (req, res) => {
  try {
    let imageUrl = '';
    if (req.file) {
      imageUrl = '/uploads/' + req.file.filename;
    }
    const { name, role, text } = req.body;
    if (!name || !role || !text) return res.status(400).json({ success: false, error: 'All fields required' });
    const testimonial = new Testimonial({ name, role, text, imageUrl });
    await testimonial.save();
    res.json({ success: true, testimonial });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Update testimonial
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, text } = req.body;
    let update = { name, role, text };
    if (req.file) {
      update.imageUrl = '/uploads/' + req.file.filename;
    }
    const testimonial = await Testimonial.findByIdAndUpdate(id, update, { new: true });
    if (!testimonial) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, testimonial });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Delete testimonial
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) return res.status(404).json({ success: false, error: 'Not found' });
    // Optionally delete image file
    if (testimonial.imageUrl) {
      const imgPath = path.join(__dirname, '../../', testimonial.imageUrl);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
}; 