// Emergency Cloudinary Config Fix 
const cloudinary = require('cloudinary').v2; 
 
// Hard-coded correct credentials 
cloudinary.config({ 
  cloud_name: 'drlqhsjgm', 
  api_key: '367882575567196', 
  api_secret: 'RdSBwyzQRUb5ZD32kbqS3vhxh7I', 
  secure: true 
}); 
 
console.log('☁️ EMERGENCY CLOUDINARY CONFIG APPLIED!'); 
 
module.exports = cloudinary; 
