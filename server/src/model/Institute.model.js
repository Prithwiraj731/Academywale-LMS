const mongoose = require('mongoose');

const InstituteSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Institute', InstituteSchema); 