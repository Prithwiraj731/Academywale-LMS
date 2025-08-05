
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'drlqhsjgm',
  api_key: process.env.CLOUDINARY_API_KEY || '367882575567196',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'RdSBwyzQRUb5ZD32kbqS3vhxh7I',
  secure: true
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'academywale/faculty', // Use faculty-specific folder
    upload_preset: 'faculty', // Use your upload preset
    resource_type: 'image',
    format: async (req, file) => {
      // Allow multiple formats based on file type
      const validFormats = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
      const fileFormat = file.mimetype.split('/')[1];
      return validFormats.includes(fileFormat) ? fileFormat : 'png';
    },
    public_id: (req, file) => {
      // Create unique filename with timestamp
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const sanitizedName = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
      return `faculty_${sanitizedName}_${timestamp}_${randomString}`;
    },
    transformation: [
      { width: 800, height: 800, crop: "limit" },
      { quality: "auto:good" },
      { fetch_format: "auto" }
    ]
  },
});

module.exports = {
  cloudinary,
  storage,
};
