const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  facultyName: { type: String, required: true },
  subject: { type: String, required: true },
  noOfLecture: { type: String, required: true },
  duration: { type: String, default: 'Not specified' },
  durations: [{ type: String }], // OLD: array of durations (for backwards compatibility)
  books: { type: String },
  videoLanguage: { type: String },
  validityStartFrom: { type: String },
  videoRunOn: { type: String },
  doubtSolving: { type: String },
  supportMail: { type: String },
  supportCall: { type: String },
  posterUrl: String, // URL or path to the poster image
  mode: { type: String, enum: ['Live Watching', 'Recorded Videos'] },
  modes: [{ type: String }], // OLD: array of modes (for backwards compatibility)
  timing: String,
  description: String,
  costPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  courseType: { type: String, required: true }, // NEW: can be 'CA Foundation', 'CMA Foundation', etc.
  institute: { type: String, required: true }, // NEW: associated institute name or ID
  
  // NEW: Paper-based categorization
  category: { type: String }, // CA or CMA
  subcategory: { type: String }, // Foundation, Inter, Final
  paperId: { type: Number }, // Paper 1, 2, 3, etc.
  paperName: { type: String }, // Full paper name
  
  // NEW: Mode and Attempt pricing structure
  modeAttemptPricing: [{
    mode: { type: String, required: true }, // e.g., "Live at Home With Hard Copy"
    attempts: [{
      attempt: { type: String, required: true }, // e.g., "1.5 Views & 12 Months Validity"
      costPrice: { type: Number, required: true },
      sellingPrice: { type: Number, required: true }
    }]
  }]
}, { _id: false });

const FacultySchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  bio: { type: String, default: '' }, // NEW: faculty bio
  teaches: [{ type: String, enum: ['CA', 'CMA'] }], // NEW: what they teach
  imageUrl: { type: String, default: '' }, // NEW: faculty image URL
  image: { type: String, default: '' }, // NEW: Cloudinary public_id
  public_id: { type: String, default: '' }, // NEW: Cloudinary public_id (alternative field name)
  slug: { type: String, required: true, unique: true, index: true }, // NEW: unique slug for lookup
  courses: [CourseSchema],
}, { timestamps: true });

module.exports = mongoose.model('Faculty', FacultySchema); 