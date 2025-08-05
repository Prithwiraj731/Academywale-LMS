console.log('🚀 Starting server...');

// Load environment first
require('dotenv').config();

// Delete CLOUDINARY_URL to avoid conflicts
delete process.env.CLOUDINARY_URL;

console.log('✅ Environment loaded');
console.log('☁️ Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

// Test Cloudinary connection first
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log('🔧 Testing Cloudinary connection...');
cloudinary.api.ping()
  .then((result) => {
    console.log('✅ Cloudinary connected:', result.status);
    // Start the main app
    require('./app.js');
  })
  .catch((error) => {
    console.error('❌ Cloudinary connection failed:', error);
    process.exit(1);
  });
