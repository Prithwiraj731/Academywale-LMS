// ENHANCED CLOUDINARY CONFIGURATION WITH ERROR HANDLING
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

console.log('🔥 LOADING ENHANCED CLOUDINARY CONFIG');

// Configuration with error handling
try {
  // HARD-CODED CREDENTIALS TO ENSURE IT WORKS
  cloudinary.config({
    cloud_name: 'drlqhsjgm',
    api_key: '367882575567196',
    api_secret: 'RdSBwyzQRUb5ZD32kbqS3vhxh7I',
    secure: true
  });

  console.log('☁️ CLOUDINARY CONFIGURED SUCCESSFULLY:', cloudinary.config().cloud_name);
} catch (error) {
  console.error('❌ CLOUDINARY CONFIGURATION ERROR:', error);
  // Fallback to environment variables as a last resort
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'drlqhsjgm',
    api_key: process.env.CLOUDINARY_API_KEY || '367882575567196',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'RdSBwyzQRUb5ZD32kbqS3vhxh7I',
    secure: true
  });
  console.log('⚠️ USING FALLBACK CLOUDINARY CONFIGURATION');
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

// Export everything
module.exports = {
  cloudinary,
  storage,
  facultyStorage,
  instituteStorage,
  courseStorage
};
