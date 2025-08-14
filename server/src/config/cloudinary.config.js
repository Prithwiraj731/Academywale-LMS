
// EMERGENCY FIX - DIRECT CLOUDINARY CONFIGURATION
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

console.log('🔥 LOADING CLOUDINARY CONFIG WITH DIRECT CREDENTIALS');

// HARD-CODED CREDENTIALS TO ENSURE IT WORKS
cloudinary.config({
  cloud_name: 'drlqhsjgm',
  api_key: '367882575567196',
  api_secret: 'RdSBwyzQRUb5ZD32kbqS3vhxh7I',
  secure: true
});

console.log('☁️ CLOUDINARY CONFIGURED:', cloudinary.config().cloud_name);

// SIMPLE WORKING STORAGE CONFIGURATION
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'academywale/faculty',
    resource_type: 'image',
    public_id: (req, file) => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      return `faculty_${timestamp}_${random}`;
    },
    // Remove format/quality auto to avoid extension errors
    transformation: [
      { width: 800, height: 800, crop: "limit" }
    ]
  }
});

console.log('📁 STORAGE CREATED FOR FOLDER: academywale/faculty');

module.exports = {
  cloudinary,
  storage,
};
