const mongoose = require('mongoose');

const modeAttemptPricingSchema = new mongoose.Schema({
  mode: {
    type: String,
    required: false,
    enum: ['Live Watching', 'Recorded Videos', ''],
    default: ''
  },
  attempt: {
    type: String,
    required: false,
    default: ''
  },
  costPrice: {
    type: Number,
    required: false,
    default: 0
  },
  sellingPrice: {
    type: Number,
    required: false,
    default: 0
  }
}, { _id: false });

const courseSchema = new mongoose.Schema({
  // Course identification
  title: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  
  // Course hierarchy (optional for standalone courses)
  category: {
    type: String,
    enum: ['CA', 'CMA', ''],
    default: ''
  },
  subcategory: {
    type: String,
    enum: ['Foundation', 'Inter', 'Final', ''],
    default: ''
  },
  paperId: {
    type: String,
    default: ''
  },
  paperName: {
    type: String,
    default: ''
  },
  
  // Course details
  courseType: {
    type: String,
    default: 'General Course'
  },
  noOfLecture: {
    type: String,
    default: ''
  },
  books: {
    type: String,
    default: ''
  },
  videoLanguage: {
    type: String,
    default: 'Hindi'
  },
  videoRunOn: {
    type: String,
    default: ''
  },
  timing: {
    type: String,
    default: ''
  },
  
  // Support details
  doubtSolving: {
    type: String,
    default: ''
  },
  supportMail: {
    type: String,
    default: ''
  },
  supportCall: {
    type: String,
    default: ''
  },
  
  // Validity
  validityStartFrom: {
    type: String,
    default: ''
  },
  
  // Faculty and Institute (optional)
  facultySlug: {
    type: String,
    default: ''
  },
  facultyName: {
    type: String,
    default: ''
  },
  institute: {
    type: String,
    default: ''
  },
  
  // Images
  posterUrl: {
    type: String,
    default: ''
  },
  posterPublicId: {
    type: String,
    default: ''
  },
  
  // Pricing
  modeAttemptPricing: [modeAttemptPricingSchema],
  
  // Legacy pricing fields (for backward compatibility)
  costPrice: {
    type: Number,
    default: 0
  },
  sellingPrice: {
    type: Number,
    default: 0
  },
  
  // Course status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Standalone course flag
  isStandalone: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient searching
courseSchema.index({ title: 'text', subject: 'text', description: 'text' });
courseSchema.index({ category: 1, subcategory: 1, paperId: 1 });
courseSchema.index({ facultySlug: 1 });
courseSchema.index({ institute: 1 });
courseSchema.index({ isStandalone: 1 });

module.exports = mongoose.model('Course', courseSchema);
