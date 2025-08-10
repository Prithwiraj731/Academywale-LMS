const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://academywale.com', 'https://www.academywale.com', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = 'mongodb+srv://prithwi1016:4xtVi1z1uzyAdA7v@courses.znwo0tt.mongodb.net/?retryWrites=true&w=majority&appName=courses';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Error:', error.message);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String }, // mobile is now optional
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

// Import and setup Course model for standalone courses
const Course = require('./src/model/Course.model');
const Institute = require('./src/model/Institute.model');

// Setup Cloudinary for file uploads
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dwjfgvbgg',
  api_key: '431532398896464',
  api_secret: 'dPfpGKKlIxZhJXC_8aDt2hVk2nY'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'academywale/courses',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }]
  }
});

const upload = multer({ storage });

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'AcademyWale Backend Running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth routes working' });
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    
    if (!name || !email || !password) { // mobile is no longer required
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and password are required'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists'
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      mobile // will be undefined if not provided
    });

    const token = jwt.sign({ id: newUser._id }, 'your-secret-key', { expiresIn: '90d' });
    
    res.status(201).json({
      status: 'success',
      token,
      data: { user: { name: newUser.name, email: newUser.email, role: newUser.role } }
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password required'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign({ id: user._id }, 'your-secret-key', { expiresIn: '90d' });
    
    res.status(200).json({
      status: 'success',
      token,
      data: { user: { name: user.name, email: user.email, role: user.role } }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed'
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Logged out' });
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, 'your-secret-key');
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user: { name: user.name, email: user.email, role: user.role } }
    });
    
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
});

// ==================== INSTITUTES ROUTES ====================

// Get all institutes
app.get('/api/institutes', async (req, res) => {
  try {
    const institutes = await Institute.find();
    res.status(200).json({ institutes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== STANDALONE COURSES ROUTES ====================

// Get all standalone courses
app.get('/api/courses/standalone', async (req, res) => {
  try {
    const courses = await Course.find({ 
      isStandalone: true,
      isActive: true 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all courses (both standalone and faculty-based)
app.get('/api/courses/all', async (req, res) => {
  try {
    const courses = await Course.find({ 
      isStandalone: true,
      isActive: true 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new standalone course
app.post('/api/admin/courses/standalone', upload.single('poster'), async (req, res) => {
  try {
    const {
      title, subject, description, category, subcategory, paperId, paperName,
      courseType, noOfLecture, books, videoLanguage, videoRunOn, timing,
      doubtSolving, supportMail, supportCall, validityStartFrom,
      facultySlug, facultyName, institute, modeAttemptPricing,
      costPrice, sellingPrice
    } = req.body;

    const posterUrl = req.file ? req.file.path : '';
    const posterPublicId = req.file ? req.file.filename : '';

    if (!title || !subject) {
      return res.status(400).json({ error: 'Title and subject are required' });
    }

    // Parse mode and attempt pricing if provided
    let parsedModeAttemptPricing = [];
    if (modeAttemptPricing) {
      try {
        parsedModeAttemptPricing = JSON.parse(modeAttemptPricing);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid mode attempt pricing format' });
      }
    }

    const newCourse = new Course({
      title,
      subject,
      description: description || '',
      category: category || '',
      subcategory: subcategory || '',
      paperId: paperId || '',
      paperName: paperName || '',
      courseType: courseType || 'General Course',
      noOfLecture: noOfLecture || '',
      books: books || '',
      videoLanguage: videoLanguage || 'Hindi',
      videoRunOn: videoRunOn || '',
      timing: timing || '',
      doubtSolving: doubtSolving || '',
      supportMail: supportMail || '',
      supportCall: supportCall || '',
      validityStartFrom: validityStartFrom || '',
      facultySlug: facultySlug || '',
      facultyName: facultyName || '',
      institute: institute || '',
      posterUrl,
      posterPublicId,
      modeAttemptPricing: parsedModeAttemptPricing,
      costPrice: costPrice ? Number(costPrice) : 0,
      sellingPrice: sellingPrice ? Number(sellingPrice) : 0,
      isStandalone: true,
      isActive: true
    });

    await newCourse.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Standalone course created successfully',
      course: newCourse 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a standalone course
app.put('/api/admin/courses/standalone/:id', upload.single('poster'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.posterUrl = req.file.path;
      updateData.posterPublicId = req.file.filename;
    }

    // Parse mode and attempt pricing if provided
    if (updateData.modeAttemptPricing) {
      try {
        updateData.modeAttemptPricing = JSON.parse(updateData.modeAttemptPricing);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid mode attempt pricing format' });
      }
    }

    const course = await Course.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Course updated successfully',
      course 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a standalone course
app.delete('/api/admin/courses/standalone/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findByIdAndDelete(id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Course deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== END STANDALONE COURSES ROUTES ====================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Health: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth test: http://localhost:${PORT}/api/auth/test`);
  });
}).catch((err) => {
  console.error('Failed to start:', err);
});