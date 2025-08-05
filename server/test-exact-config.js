// Test EXACTLY what storage configuration is being used
require('dotenv').config();
delete process.env.CLOUDINARY_URL;

console.log('🔍 TESTING EXACT STORAGE CONFIGURATION...');

try {
  // Import our cloudinary config
  const { storage } = require('./src/config/cloudinary.config');
  console.log('✅ Storage imported successfully');
  console.log('📦 Storage type:', storage.constructor.name);
  
  // Test the internal cloudinary object
  if (storage.cloudinary) {
    console.log('☁️ Cloudinary config found');
    console.log('☁️ Cloud name:', storage.cloudinary.config().cloud_name);
  } else {
    console.log('❌ No cloudinary config in storage');
  }
  
  // Test the params
  if (storage.params) {
    console.log('⚙️ Storage params:', storage.params);
  }
  
  // Import multer and create upload instance
  const multer = require('multer');
  const upload = multer({ storage });
  console.log('📦 Multer configured with storage');
  
  // Test if this matches what faculty route uses
  const facultyRoutes = require('./src/routes/faculty.routes');
  console.log('✅ Faculty routes loaded successfully');
  
} catch (error) {
  console.error('❌ Error in configuration:', error);
}
