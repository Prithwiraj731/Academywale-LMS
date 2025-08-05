// DIRECT CLOUDINARY UPLOAD TEST
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

console.log('🔥 TESTING DIRECT CLOUDINARY UPLOAD');

// Configure with your credentials
cloudinary.config({
  cloud_name: 'drlqhsjgm',
  api_key: '367882575567196',
  api_secret: 'RdSBwyzQRUb5ZD32kbqS3vhxh7I',
  secure: true
});

console.log('☁️ Cloudinary configured for:', cloudinary.config().cloud_name);

// Test ping first
cloudinary.api.ping()
  .then(result => {
    console.log('✅ Cloudinary connection successful:', result);
    
    // Try to upload a test image (create a simple test file)
    const testImagePath = path.join(__dirname, 'test-image.png');
    
    // Create a simple 1x1 PNG for testing
    const pngData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync(testImagePath, pngData);
    
    console.log('📁 Test image created');
    
    // Upload to Cloudinary
    return cloudinary.uploader.upload(testImagePath, {
      folder: 'academywale/faculty',
      public_id: `test_faculty_${Date.now()}`,
      resource_type: 'image'
    });
  })
  .then(result => {
    console.log('🎉 CLOUDINARY UPLOAD SUCCESS!');
    console.log('📷 URL:', result.secure_url);
    console.log('🆔 Public ID:', result.public_id);
    console.log('📁 Folder:', result.folder);
    
    // Cleanup test file
    const testImagePath = path.join(__dirname, 'test-image.png');
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
      console.log('🗑️ Test file cleaned up');
    }
  })
  .catch(error => {
    console.error('❌ Cloudinary test failed:', error);
  });
