const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Delete any existing CLOUDINARY_URL
delete process.env.CLOUDINARY_URL;

console.log('🆕 Creating FRESH Cloudinary configuration...');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});


// Create FRESH storage instance
const freshStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'academywale/faculty',
    upload_preset: 'faculty',
    resource_type: 'image',
    public_id: (req, file) => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const sanitizedName = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
      return `faculty_${sanitizedName}_${timestamp}_${randomString}`;
    },
    transformation: [
      { width: 800, height: 800, crop: "limit" }
    ]
  },
});

console.log('✅ Fresh CloudinaryStorage created');

module.exports = {
  cloudinary,
  storage: freshStorage,
};
