
// ENHANCED CLOUDINARY CONFIGURATION WITH ERROR HANDLING
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

console.log('🔥 LOADING ENHANCED CLOUDINARY CONFIG');

// Configuration with error handling
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  console.log('☁️ CLOUDINARY CONFIGURED SUCCESSFULLY:', cloudinary.config().cloud_name);
} catch (error) {
  console.error('❌ CLOUDINARY CONFIGURATION ERROR:', error);
}

// Faculty storage configuration
const facultyStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'academywale/faculty',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
      return `faculty_${sanitizedName}_${timestamp}_${random}`;
    },
    transformation: [{ width: 800, height: 800, crop: "limit" }]
  }
});

// Institute storage configuration
const instituteStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'academywale/institute',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
      return `institute_${sanitizedName}_${timestamp}_${random}`;
    },
    transformation: [{ width: 800, height: 800, crop: "limit" }]
  }
});

// Course poster storage configuration
const courseStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'academywale/courses',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
      return `course_${sanitizedName}_${timestamp}_${random}`;
    },
    transformation: [{ width: 800, height: 600, crop: "limit" }]
  }
});

// Alias for backward compatibility
const storage = facultyStorage;

console.log('📁 STORAGE CREATED FOR FOLDERS: academywale/faculty, academywale/institute, academywale/courses');

// Export everything
module.exports = {
  cloudinary,
  storage,
  facultyStorage,
  instituteStorage,
  courseStorage
};
