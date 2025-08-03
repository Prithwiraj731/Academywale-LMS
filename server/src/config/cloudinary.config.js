
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// The SDK will automatically use the CLOUDINARY_URL environment variable.
cloudinary.config({});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'academywale',
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => file.originalname,
  },
});

module.exports = {
  cloudinary,
  storage,
};
