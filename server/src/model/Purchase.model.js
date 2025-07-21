const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  courseIndex: {
    type: Number,
    required: true
  },
  courseDetails: {
    facultyName: { type: String, required: true },
    subject: { type: String, required: true },
    noOfLecture: { type: String, required: true },
    duration: { type: String, default: 'Not specified' },
    books: { type: String },
    videoLanguage: { type: String },
    validityStartFrom: { type: String },
    videoRunOn: { type: String },
    doubtSolving: { type: String },
    supportMail: { type: String },
    supportCall: { type: String },
    posterUrl: String,
    mode: { type: String },
    timing: String,
    description: String
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'offline', 'upi', 'card', 'razorpay'],
    default: 'online'
  },
  amount: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  accessExpiry: {
    type: Date,
    default: function() {
      // Default expiry is 1 year from purchase
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);
      return expiry;
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Index for efficient queries
PurchaseSchema.index({ userId: 1, isActive: 1 });
PurchaseSchema.index({ facultyId: 1, courseIndex: 1 });

module.exports = mongoose.model('Purchase', PurchaseSchema); 