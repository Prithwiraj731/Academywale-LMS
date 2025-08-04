
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with environment variables or default values
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'drlqhsjgm',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'academywale',
    format: async (req, file) => {
      // Allow multiple formats based on file type
      const validFormats = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
      const fileFormat = file.mimetype.split('/')[1];
      return validFormats.includes(fileFormat) ? fileFormat : 'png';
    },
    public_id: (req, file) => {
      // Create unique filename with timestamp
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      return `${originalName}_${timestamp}`;
    },
    transformation: [
      { width: 800, height: 600, crop: "limit" },
      { quality: "auto:good" },
      { fetch_format: "auto" }
    ]
  },
});

module.exports = {
  cloudinary,
  storage,
};
