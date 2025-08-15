const mongoose = require('mongoose');
// Import mode mapper
const { mapMode, ALLOWED_MODES } = require('../utils/modeMapper');

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
  // IMPORTANT: Set and get hooks ensure any value is mapped to an allowed value
  mode: { 
    type: String, 
    enum: ALLOWED_MODES, // Only these values are allowed
    set: mapMode, // Auto-convert any value to allowed values
    default: 'Live Watching'
  },
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
    attempt: { type: String }, // Legacy field (for backward compatibility)
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

// Add pre-validate hook to ensure all mode values are valid
FacultySchema.pre('validate', function(next) {
  // Ensure we have courses
  if (this.courses && this.courses.length > 0) {
    // Go through all courses
    this.courses.forEach(course => {
      // Map mode to valid value if it exists
      if (course.mode) {
        const originalMode = course.mode;
        course.mode = mapMode(course.mode);
        
        // Log if we changed something
        if (originalMode !== course.mode) {
          console.log(`🔄 Mapped mode from "${originalMode}" to "${course.mode}" during validation`);
        }
      }
    });
  }
  next();
});

// Export the model
module.exports = mongoose.model('Faculty', FacultySchema); 