
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
    folder: 'academywale/permanent', // Use a specific permanent folder
    resource_type: 'image', // Explicitly set as image resource
    format: async (req, file) => {
      // Allow multiple formats based on file type
      const validFormats = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
      const fileFormat = file.mimetype.split('/')[1];
      return validFormats.includes(fileFormat) ? fileFormat : 'png';
    },
    public_id: (req, file) => {
      // Create unique filename with timestamp and random string
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const originalName = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '');
      return `${originalName}_${timestamp}_${randomString}`;
    },
    transformation: [
      { width: 1200, height: 1200, crop: "limit" }, // Increased size limits
      { quality: "auto:good" },
      { fetch_format: "auto" }
    ],
    // Add these important options to ensure permanent storage
    overwrite: false, // Don't overwrite existing files
    unique_filename: true, // Ensure unique filenames
    use_filename: false, // Don't use original filename
  },
});

module.exports = {
  cloudinary,
  storage,
};
