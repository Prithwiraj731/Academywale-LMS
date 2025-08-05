require('dotenv').config();
delete process.env.CLOUDINARY_URL;

console.log('🔍 Debug: Testing storage configuration...');

// Test the actual import
const { storage } = require('./src/config/cloudinary.config');
console.log('📦 Storage object:', typeof storage);
console.log('📦 Storage constructor:', storage.constructor.name);

// Test multer configuration
const multer = require('multer');
const upload = multer({ storage });
console.log('📦 Upload object:', typeof upload);

// Test if cloudinary is working
const cloudinary = require('cloudinary').v2;
console.log('☁️ Cloudinary config:', {
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key,
  api_secret: cloudinary.config().api_secret ? 'Set' : 'Not set'
});

console.log('✅ Debug complete');
