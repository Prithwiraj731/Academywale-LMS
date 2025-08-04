const mongoose = require('mongoose');

// Reuse the CourseSchema from Faculty.model.js
const CourseSchema = new mongoose.Schema({
  facultyName: { type: String, required: true },
  subject: { type: String, required: true },
  noOfLecture: { type: String, required: true },
  duration: { type: String, default: 'Not specified' },
  durations: [{ type: String }], // array of durations
  books: { type: String },
  videoLanguage: { type: String },
  validityStartFrom: { type: String },
  videoRunOn: { type: String },
  doubtSolving: { type: String },
  supportMail: { type: String },
  supportCall: { type: String },
  posterUrl: String, // URL or path to the poster image
  mode: { type: String, enum: ['Live Watching', 'Recorded Videos'] },
  modes: [{ type: String }], // array of modes
  timing: String,
  description: String,
  costPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  courseType: { type: String, required: true }, // can be 'CA Foundation', 'CMA Foundation', etc.
  institute: { type: String, required: true }, // associated institute name or ID
}, { _id: false });

const InstituteSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  image: { type: String, default: '' }, // Cloudinary public_id
  public_id: { type: String, default: '' }, // Cloudinary public_id (alternative field name)
  courses: [CourseSchema], // Add courses array like Faculty model
}, { timestamps: true });

module.exports = mongoose.model('Institute', InstituteSchema); 