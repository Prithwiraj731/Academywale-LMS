// Emergency Cloudinary Config Fix
const cloudinary = require('cloudinary').v2;

// Delete any existing environment variable to ensure our config is used
delete process.env.CLOUDINARY_URL;
delete process.env.CLOUDINARY_API_KEY;
delete process.env.CLOUDINARY_CLOUD_NAME;
delete process.env.CLOUDINARY_API_SECRET;

console.log('🚨 APPLYING EMERGENCY CLOUDINARY CONFIG 🚨');

// Hard-coded correct credentials
cloudinary.config({
  cloud_name: 'drlqhsjgm',
  api_key: '367882575567196',
  api_secret: 'RdSBwyzQRUb5ZD32kbqS3vhxh7I',
  secure: true
});

console.log('☁️ EMERGENCY CLOUDINARY CONFIG APPLIED!');
console.log('☁️ CLOUD NAME:', cloudinary.config().cloud_name);
console.log('☁️ API KEY:', cloudinary.config().api_key);

// Export the emergency-configured cloudinary instance
module.exports = cloudinary;
