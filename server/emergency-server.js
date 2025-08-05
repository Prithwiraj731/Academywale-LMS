// EMERGENCY CLOUDINARY TEST SERVER
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://academywale.com'],
  credentials: true
}));

app.use(express.json());

console.log('🔥 EMERGENCY SERVER - TESTING CLOUDINARY DIRECTLY');

// CONFIGURE CLOUDINARY WITH YOUR CREDENTIALS
cloudinary.config({
  cloud_name: 'drlqhsjgm',
  api_key: '367882575567196',
  api_secret: 'RdSBwyzQRUb5ZD32kbqS3vhxh7I',
  secure: true
});

console.log('☁️ CLOUDINARY CONFIGURED FOR:', cloudinary.config().cloud_name);

// SIMPLE CLOUDINARY STORAGE
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'academywale/faculty',
    resource_type: 'image',
    public_id: (req, file) => `faculty_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    format: 'auto'
  }
});

const upload = multer({ storage });

// TEST ROUTE
app.get('/test', (req, res) => {
  res.json({ 
    message: 'EMERGENCY CLOUDINARY SERVER RUNNING',
    cloudinary: cloudinary.config().cloud_name 
  });
});

// FACULTY UPLOAD ROUTE
app.post('/api/admin/faculty', upload.single('image'), async (req, res) => {
  try {
    console.log('🚀 FACULTY UPLOAD REQUEST RECEIVED');
    console.log('📸 File received:', !!req.file);
    
    if (req.file) {
      console.log('✅ CLOUDINARY UPLOAD SUCCESS:');
      console.log('📷 URL:', req.file.path);
      console.log('🆔 Public ID:', req.file.filename);
      
      // Simple faculty creation
      const faculty = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        imageUrl: req.file.path,
        public_id: req.file.filename,
        bio: req.body.bio
      };
      
      res.json({
        success: true,
        message: 'Faculty uploaded to Cloudinary successfully!',
        faculty: faculty,
        cloudinaryUrl: req.file.path
      });
    } else {
      res.status(400).json({ error: 'No file uploaded' });
    }
  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({ error: error.message });
  }
});

// START SERVER
app.listen(5000, () => {
  console.log('🚀 EMERGENCY CLOUDINARY SERVER RUNNING ON PORT 5000');
  console.log('☁️ Cloudinary configured for: drlqhsjgm');
});
