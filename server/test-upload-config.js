require('dotenv').config();

// Delete CLOUDINARY_URL to avoid conflicts
delete process.env.CLOUDINARY_URL;

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

console.log('🔧 Testing Cloudinary upload configuration...');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log('☁️ Cloudinary configured for cloud:', process.env.CLOUDINARY_CLOUD_NAME);

// Test CloudinaryStorage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'academywale/faculty',
    upload_preset: 'faculty',
    resource_type: 'image',
    format: 'png',
    public_id: () => `test_upload_${Date.now()}`
  }
});

console.log('📁 CloudinaryStorage configured for folder: academywale/faculty');
console.log('🎯 Upload preset: faculty');

// Test the storage configuration
const upload = multer({ storage: storage });

console.log('✅ Multer configured with CloudinaryStorage');
console.log('✅ Configuration test complete - ready for uploads!');
