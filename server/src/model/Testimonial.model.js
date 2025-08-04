const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: String },
  message: { type: String, required: true },
  image: { type: String }, // Cloudinary public_id
  imageUrl: { type: String }, // Full URL (computed from public_id)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Testimonial', TestimonialSchema); 