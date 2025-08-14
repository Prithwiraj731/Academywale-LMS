const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Delete any existing CLOUDINARY_URL
delete process.env.CLOUDINARY_URL;

console.log('🆕 Creating FRESH Cloudinary configuration...');

// Configure Cloudinary with explicit credentials
cloudinary.config({
  cloud_name: 'drlqhsjgm',
  api_key: '367882575567196',
  api_secret: 'RdSBwyzQRUb5ZD32kbqS3vhxh7I',
  secure: true
});

console.log('☁️ Cloudinary configured for cloud: drlqhsjgm');

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
