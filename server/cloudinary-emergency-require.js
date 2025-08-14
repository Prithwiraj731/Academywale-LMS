// ☁️ CLOUDINARY EMERGENCY FIX - INCLUDE THIS AT THE TOP OF APP.JS
// Simply require this file at the very top of app.js before any other imports
const cloudinaryEmergency = require('./cloudinary-emergency-fix');

// Use this instance instead of any other cloudinary in the app:
// Example usage in app.js:
//
// const cloudinary = cloudinaryEmergency; 
// 
// OR replace existing imports:
//
// const { cloudinary, storage: cloudinaryFacultyStorage } = require('./src/config/cloudinary.config');
// WITH:
// const cloudinary = cloudinaryEmergency;
// const { storage: cloudinaryFacultyStorage } = require('./src/config/cloudinary.config');
