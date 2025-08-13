const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Mount course routes
const courseRoutes = require('./src/routes/course.routes.js');
app.use('/', courseRoutes);

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dms3kqzb1',
  api_key: '959547171781827',
  api_secret: 'fMdWN8ZEh4vwMCj5wIx8pnz9Rdo'
});

// Multer configuration for course uploads
const courseStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'academy-wale/courses',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }]
  }
});

const courseUpload = multer({ storage: courseStorage });

// Multer configuration for faculty uploads
const facultyStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'academy-wale/faculty',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 400, height: 400, crop: 'fill', quality: 'auto' }]
  }
});

const facultyUpload = multer({ storage: facultyStorage });

// Middleware
app.use(cors({
  origin: ['https://academywale.com', 'https://www.academywale.com', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200,
  preflightContinue: false
}));

// Handle preflight requests explicitly
app.options('*', cors());

app.use(express.json());

// Middleware to ensure JSON responses for API routes
app.use('/api/*', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

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
const Faculty = require('./src/model/Faculty.model');
const Institute = require('./src/model/Institute.model');

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'AcademyWale Backend Running!' });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    version: '2024-01-15-15:30', // Deployment tracker
    endpoints: {
      testCourse: '/api/test/course',
      courses: '/api/courses',
      faculties: '/api/faculties',
      institutes: '/api/institutes'
    }
  });
});

// Simple GET test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Basic test endpoint working', timestamp: new Date().toISOString() });
});

// Simple test endpoint for course creation
app.post('/api/test/course', async (req, res) => {
  try {
    console.log('🧪 Test course endpoint hit');
    console.log('📋 Request body:', req.body);
    
    res.json({
      success: true,
      message: 'Test endpoint working',
      receivedData: req.body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// SIMPLE FALLBACK COURSE CREATION ENDPOINT (bulletproof)
app.post('/api/admin/courses/simple', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  try {
    console.log('🎯 Simple course creation request received');
    console.log('📋 Request body:', req.body);
    
    // Create a minimal course object
    const courseData = {
      title: req.body.title || 'New Course',
      subject: req.body.subject || 'General Subject',
      description: req.body.description || '',
      isStandalone: true,
      isActive: true,
      createdAt: new Date()
    };
    
    console.log('📝 Creating simple course:', courseData);
    
    // Try to save to Course model
    try {
      const newCourse = new Course(courseData);
      const savedCourse = await newCourse.save();
      
      console.log('✅ Simple course saved successfully:', savedCourse._id);
      
      return res.status(201).json({
        success: true,
        message: 'Simple course created successfully',
        course: savedCourse
      });
    } catch (saveError) {
      console.error('❌ Course save error:', saveError);
      
      // If Course model fails, return success anyway for testing
      return res.status(201).json({
        success: true,
        message: 'Course creation simulated successfully (save failed but endpoint working)',
        course: courseData,
        note: 'This is a test response - actual database save failed'
      });
    }
    
  } catch (error) {
    console.error('❌ Simple course creation error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Simple course creation failed',
      message: error.message || 'Internal Server Error',
      details: error.name || 'UnknownError'
    });
  }
});

app.get('/api/health/db', async (req, res) => {
  try {
    // Test database connection by counting documents
    const courseCount = await Course.countDocuments();
    const facultyCount = await Faculty.countDocuments();
    const userCount = await User.countDocuments();
    
    res.json({
      status: 'OK',
      database: 'connected',
      collections: {
        courses: courseCount,
        faculties: facultyCount,
        users: userCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
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

// ==================== COURSE CREATION - IMMEDIATE FIX ====================

// DEBUG ENDPOINT - Minimal course creation to isolate issue
app.post('/api/admin/courses/debug', async (req, res) => {
  try {
    console.log('🔍 DEBUG: Minimal course creation test');
    console.log('📋 DEBUG: Request body:', JSON.stringify(req.body));
    
    const { title, subject } = req.body;
    
    if (!subject) {
      return res.status(400).json({ 
        error: 'Subject is required',
        debug: true,
        received: req.body
      });
    }
    
    // Create absolute minimal course
    const testCourse = new Course({
      title: title || 'Debug Test Course',
      subject: subject,
      description: 'Debug test',
      isStandalone: true,
      isActive: true
    });
    
    const saved = await testCourse.save();
    console.log('✅ DEBUG: Course saved:', saved._id);
    
    res.status(201).json({ 
      success: true,
      debug: true,
      message: 'Debug course created',
      courseId: saved._id
    });
    
  } catch (error) {
    console.error('❌ DEBUG ERROR:', error.message);
    res.status(500).json({ 
      error: 'Debug failed',
      message: error.message,
      debug: true
    });
  }
});

// WORKING COURSE CREATION ENDPOINT (handles both standalone and faculty courses)
app.post('/api/admin/courses/standalone', courseUpload.single('poster'), async (req, res) => {
  // Ensure we always return JSON
  res.setHeader('Content-Type', 'application/json');
  
  try {
    console.log('🎯 Course creation request received');
    console.log('📋 Request body:', req.body);
    console.log('📎 File:', req.file);

    // Check if this is a faculty-based course or standalone
    const isStandalone = req.body.isStandalone === 'true' || req.body.isStandalone === true;
    const hasFaculty = req.body.facultySlug && req.body.facultySlug.trim() !== '';
    
    console.log('🔍 Course type detection:', { 
      isStandalone: req.body.isStandalone, 
      facultySlug: req.body.facultySlug,
      hasFaculty: hasFaculty,
      finalDecision: isStandalone ? 'STANDALONE' : 'FACULTY'
    });

    // Extract basic fields with safe defaults
    const title = req.body.title || req.body.paperName || req.body.subject || 'New Course';
    const subject = req.body.subject || 'General Subject';
    const description = req.body.description || '';
    const category = req.body.category || '';
    const subcategory = req.body.subcategory || '';
    const posterUrl = req.file ? req.file.path : '';
    const posterPublicId = req.file ? req.file.filename : '';
    
    // Handle pricing data safely
    let modeAttemptPricing = [];
    if (req.body.modeAttemptPricing) {
      try {
        const rawPricing = JSON.parse(req.body.modeAttemptPricing);
        if (Array.isArray(rawPricing)) {
          rawPricing.forEach(modeGroup => {
            if (modeGroup && modeGroup.attempts && Array.isArray(modeGroup.attempts)) {
              modeGroup.attempts.forEach(attemptData => {
                if (attemptData) {
                  modeAttemptPricing.push({
                    mode: modeGroup.mode || '',
                    attempt: attemptData.attempt || '',
                    costPrice: attemptData.costPrice || 0,
                    sellingPrice: attemptData.sellingPrice || 0
                  });
                }
              });
            }
          });
        }
      } catch (e) {
        console.log('⚠️ Pricing parse error, using defaults');
        modeAttemptPricing = [];
      }
    }

    // Create course data structure
    const courseData = {
      title,
      subject,
      description,
      category,
      subcategory,
      paperId: req.body.paperId || '',
      paperName: req.body.paperName || '',
      courseType: req.body.courseType || 'General Course',
      noOfLecture: req.body.noOfLecture || '',
      books: req.body.books || '',
      videoLanguage: req.body.videoLanguage || 'Hindi',
      videoRunOn: req.body.videoRunOn || '',
      timing: req.body.timing || '',
      doubtSolving: req.body.doubtSolving || '',
      supportMail: req.body.supportMail || '',
      supportCall: req.body.supportCall || '',
      validityStartFrom: req.body.validityStartFrom || '',
      facultySlug: req.body.facultySlug || '',
      facultyName: req.body.facultyName || '',
      institute: req.body.institute || '',
      posterUrl,
      posterPublicId,
      modeAttemptPricing,
      costPrice: req.body.costPrice ? Number(req.body.costPrice) : 0,
      sellingPrice: req.body.sellingPrice ? Number(req.body.sellingPrice) : 0,
      isStandalone: isStandalone,
      isActive: true
    };

    if (isStandalone) {
      // Handle standalone course - save to Course collection
      console.log('📍 Processing as standalone course');
      
      const newCourse = new Course(courseData);
      
      // Validate before saving
      const validationError = newCourse.validateSync();
      if (validationError) {
        console.error('❌ Validation error:', validationError);
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Course data validation failed',
          details: Object.keys(validationError.errors || {})
        });
      }
      
      const savedCourse = await newCourse.save();
      console.log('✅ Standalone course saved successfully:', savedCourse._id);
      
      return res.status(201).json({ 
        success: true, 
        message: 'Standalone course created successfully',
        course: savedCourse 
      });
      
    } else {
      // Handle faculty-based course - save to Faculty's courses array
      console.log('📍 Processing as faculty-based course');
      
      const Faculty = require('./src/model/Faculty.model');
      
      if (!req.body.facultySlug) {
        return res.status(400).json({
          success: false,
          error: 'Faculty slug is required for faculty-based courses'
        });
      }

      const faculty = await Faculty.findOne({ slug: req.body.facultySlug });
      if (!faculty) {
        console.log('❌ Faculty not found:', req.body.facultySlug);
        return res.status(404).json({
          success: false,
          error: 'Faculty not found'
        });
      }

      // Update faculty name for faculty courses
      courseData.facultyName = courseData.facultyName || `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`;
      courseData.isStandalone = false;

      // Add course to faculty's courses array
      faculty.courses.push(courseData);
      await faculty.save();
      
      console.log('✅ Faculty course saved successfully');
      
      return res.status(201).json({ 
        success: true, 
        message: 'Faculty course created successfully',
        course: courseData,
        faculty: {
          slug: faculty.slug,
          name: courseData.facultyName
        }
      });
    }

  } catch (error) {
    console.error('❌ Course creation error:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Ensure we always return JSON
    return res.status(500).json({
      success: false,
      error: 'Course creation failed',
      message: error.message || 'Internal Server Error',
      details: error.name || 'UnknownError'
    });
  }
});

// NEW FACULTY COURSE CREATION ENDPOINT (as suggested by Google)
app.post('/api/admin/courses/new', courseUpload.single('poster'), async (req, res) => {
  try {
    console.log('🎯 NEW Faculty course creation request received');
    console.log('📋 Request body:', req.body);
    console.log('📎 File:', req.file);

    const Faculty = require('./src/model/Faculty.model');
    
    // Extract and validate faculty slug
    const facultySlug = req.body.facultySlug;
    if (!facultySlug) {
      console.log('❌ Faculty slug required');
      return res.status(400).json({
        success: false,
        error: 'Faculty slug is required for faculty-based courses'
      });
    }

    // Find the faculty
    const faculty = await Faculty.findOne({ slug: facultySlug });
    if (!faculty) {
      console.log('❌ Faculty not found:', facultySlug);
      return res.status(404).json({
        success: false,
        error: 'Faculty not found'
      });
    }

    // Extract basic fields with safe defaults
    const title = req.body.title || req.body.paperName || req.body.subject || 'New Faculty Course';
    const subject = req.body.subject || 'General Subject';
    const description = req.body.description || '';
    const category = req.body.category || '';
    const subcategory = req.body.subcategory || '';
    const posterUrl = req.file ? req.file.path : '';
    const posterPublicId = req.file ? req.file.filename : '';
    
    // Handle pricing data safely
    let modeAttemptPricing = [];
    if (req.body.modeAttemptPricing) {
      try {
        const rawPricing = JSON.parse(req.body.modeAttemptPricing);
        rawPricing.forEach(modeGroup => {
          if (modeGroup.attempts && Array.isArray(modeGroup.attempts)) {
            modeGroup.attempts.forEach(attemptData => {
              modeAttemptPricing.push({
                mode: modeGroup.mode || '',
                attempt: attemptData.attempt || '',
                costPrice: attemptData.costPrice || 0,
                sellingPrice: attemptData.sellingPrice || 0
              });
            });
          }
        });
      } catch (e) {
        console.log('⚠️ Pricing parse error, using defaults');
        modeAttemptPricing = [];
      }
    }

    // Create course data for faculty
    const courseData = {
      title,
      subject,
      description,
      category,
      subcategory,
      paperId: req.body.paperId || '',
      paperName: req.body.paperName || '',
      courseType: req.body.courseType || 'General Course',
      noOfLecture: req.body.noOfLecture || '',
      books: req.body.books || '',
      videoLanguage: req.body.videoLanguage || 'Hindi',
      videoRunOn: req.body.videoRunOn || '',
      timing: req.body.timing || '',
      doubtSolving: req.body.doubtSolving || '',
      supportMail: req.body.supportMail || '',
      supportCall: req.body.supportCall || '',
      validityStartFrom: req.body.validityStartFrom || '',
      facultySlug: facultySlug,
      facultyName: req.body.facultyName || `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`,
      institute: req.body.institute || '',
      posterUrl,
      posterPublicId,
      modeAttemptPricing,
      costPrice: req.body.costPrice ? Number(req.body.costPrice) : 0,
      sellingPrice: req.body.sellingPrice ? Number(req.body.sellingPrice) : 0,
      isStandalone: false,
      isActive: true
    };

    console.log('📝 Adding course to faculty via NEW endpoint:', facultySlug);
    console.log('📝 Course data:', courseData);
    
    // Add course to faculty's courses array
    faculty.courses.push(courseData);
    
    // Save faculty with new course
    const savedFaculty = await faculty.save();
    
    console.log('✅ Faculty course saved successfully via NEW endpoint');
    
    return res.status(201).json({ 
      success: true, 
      message: 'Faculty course created successfully',
      course: courseData,
      faculty: {
        slug: faculty.slug,
        name: `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`
      }
    });

  } catch (error) {
    console.error('❌ NEW Faculty course creation error:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Ensure we always return JSON
    return res.status(500).json({
      success: false,
      error: 'Faculty course creation failed',
      message: error.message || 'Internal Server Error',
      details: error.name || 'UnknownError'
    });
  }
});

// FACULTY-BASED COURSE CREATION ENDPOINT
app.post('/api/admin/courses/faculty', courseUpload.single('poster'), async (req, res) => {
  try {
    console.log('🎯 Faculty course creation request received');
    console.log('📋 Request body:', req.body);
    console.log('📎 File:', req.file);

    const Faculty = require('./src/model/Faculty.model');
    
    // Extract and validate faculty slug
    const facultySlug = req.body.facultySlug;
    if (!facultySlug) {
      console.log('❌ Faculty slug required');
      return res.status(400).json({
        success: false,
        error: 'Faculty slug is required'
      });
    }

    // Find the faculty
    const faculty = await Faculty.findOne({ slug: facultySlug });
    if (!faculty) {
      console.log('❌ Faculty not found:', facultySlug);
      return res.status(404).json({
        success: false,
        error: 'Faculty not found'
      });
    }

    // Extract basic fields with safe defaults
    const title = req.body.title || req.body.paperName || req.body.subject || 'New Faculty Course';
    const subject = req.body.subject || 'General Subject';
    const description = req.body.description || '';
    const category = req.body.category || '';
    const subcategory = req.body.subcategory || '';
    const posterUrl = req.file ? req.file.path : '';
    const posterPublicId = req.file ? req.file.filename : '';
    
    // Handle pricing data safely
    let modeAttemptPricing = [];
    if (req.body.modeAttemptPricing) {
      try {
        const rawPricing = JSON.parse(req.body.modeAttemptPricing);
        rawPricing.forEach(modeGroup => {
          if (modeGroup.attempts && Array.isArray(modeGroup.attempts)) {
            modeGroup.attempts.forEach(attemptData => {
              modeAttemptPricing.push({
                mode: modeGroup.mode || '',
                attempt: attemptData.attempt || '',
                costPrice: attemptData.costPrice || 0,
                sellingPrice: attemptData.sellingPrice || 0
              });
            });
          }
        });
      } catch (e) {
        console.log('⚠️ Pricing parse error, using defaults');
        modeAttemptPricing = [];
      }
    }

    // Create course data for faculty
    const courseData = {
      title,
      subject,
      description,
      category,
      subcategory,
      paperId: req.body.paperId || '',
      paperName: req.body.paperName || '',
      courseType: req.body.courseType || 'General Course',
      noOfLecture: req.body.noOfLecture || '',
      books: req.body.books || '',
      videoLanguage: req.body.videoLanguage || 'Hindi',
      videoRunOn: req.body.videoRunOn || '',
      timing: req.body.timing || '',
      doubtSolving: req.body.doubtSolving || '',
      supportMail: req.body.supportMail || '',
      supportCall: req.body.supportCall || '',
      validityStartFrom: req.body.validityStartFrom || '',
      facultySlug: facultySlug,
      facultyName: req.body.facultyName || `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`,
      institute: req.body.institute || '',
      posterUrl,
      posterPublicId,
      modeAttemptPricing,
      costPrice: req.body.costPrice ? Number(req.body.costPrice) : 0,
      sellingPrice: req.body.sellingPrice ? Number(req.body.sellingPrice) : 0,
      isStandalone: false,
      isActive: true
    };

    console.log('📝 Adding course to faculty:', facultySlug);
    console.log('📝 Course data:', courseData);
    
    // Add course to faculty's courses array
    faculty.courses.push(courseData);
    
    // Save faculty with new course
    const savedFaculty = await faculty.save();
    
    console.log('✅ Faculty course saved successfully');
    
    return res.status(201).json({ 
      success: true, 
      message: 'Faculty course created successfully',
      course: courseData,
      faculty: {
        slug: faculty.slug,
        name: `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`
      }
    });

  } catch (error) {
    console.error('❌ Faculty course creation error:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Ensure we always return JSON
    return res.status(500).json({
      success: false,
      error: 'Faculty course creation failed',
      message: error.message || 'Internal Server Error',
      details: error.name || 'UnknownError'
    });
  }
});

// UNIFIED COURSE CREATION ENDPOINT (for backward compatibility)
app.post('/api/admin/courses', courseUpload.single('poster'), async (req, res) => {
  try {
    console.log('🎯 Unified course creation request received');
    console.log('📋 Request body:', req.body);
    
    // Unified logic: if facultySlug is missing or empty, treat as general course
    const facultySlug = req.body.facultySlug;
    const hasFaculty = facultySlug && facultySlug.trim() !== '';

    if (!hasFaculty) {
      // General course (no faculty)
      console.log('📍 Creating general course (no faculty)');
      const Course = require('./src/model/Course.model');
      const title = req.body.title || 'New Course';
      const subject = req.body.subject || 'General Subject';
      const description = req.body.description || '';
      const category = req.body.category || '';
      const subcategory = req.body.subcategory || '';
      const posterUrl = req.file ? req.file.path : '';
      const posterPublicId = req.file ? req.file.filename : '';

      let modeAttemptPricing = [];
      if (req.body.modeAttemptPricing) {
        try {
          const rawPricing = JSON.parse(req.body.modeAttemptPricing);
          rawPricing.forEach(modeGroup => {
            if (modeGroup.attempts && Array.isArray(modeGroup.attempts)) {
              modeGroup.attempts.forEach(attemptData => {
                modeAttemptPricing.push({
                  mode: modeGroup.mode || '',
                  attempt: attemptData.attempt || '',
                  costPrice: attemptData.costPrice || 0,
                  sellingPrice: attemptData.sellingPrice || 0
                });
              });
            }
          });
        } catch (e) {
          console.log('⚠️ Pricing parse error, using defaults');
          modeAttemptPricing = [];
        }
      }

      const courseData = {
        title,
        subject,
        description,
        category,
        subcategory,
        paperId: req.body.paperId || '',
        paperName: req.body.paperName || '',
        courseType: req.body.courseType || 'General Course',
        noOfLecture: req.body.noOfLecture || '',
        books: req.body.books || '',
        videoLanguage: req.body.videoLanguage || 'Hindi',
        videoRunOn: req.body.videoRunOn || '',
        timing: req.body.timing || '',
        doubtSolving: req.body.doubtSolving || '',
        supportMail: req.body.supportMail || '',
        supportCall: req.body.supportCall || '',
        validityStartFrom: req.body.validityStartFrom || '',
        facultySlug: '',
        facultyName: '',
        institute: req.body.institute || '',
        posterUrl,
        posterPublicId,
        modeAttemptPricing,
        costPrice: req.body.costPrice ? Number(req.body.costPrice) : 0,
        sellingPrice: req.body.sellingPrice ? Number(req.body.sellingPrice) : 0,
        isActive: true
      };

      const newCourse = new Course(courseData);
      const savedCourse = await newCourse.save();
      return res.status(201).json({ 
        success: true, 
        message: 'Course created successfully',
        course: savedCourse 
      });
    } else {
      // Faculty course logic
      console.log('📍 Creating faculty course');
      
      const Faculty = require('./src/model/Faculty.model');
      
      const facultySlug = req.body.facultySlug;
      if (!facultySlug) {
        return res.status(400).json({
          success: false,
          error: 'Faculty slug is required for faculty-based courses'
        });
      }

      const faculty = await Faculty.findOne({ slug: facultySlug });
      if (!faculty) {
        return res.status(404).json({
          success: false,
          error: 'Faculty not found'
        });
      }

      const title = req.body.title || req.body.paperName || req.body.subject || 'New Faculty Course';
      const subject = req.body.subject || 'General Subject';
      const description = req.body.description || '';
      const category = req.body.category || '';
      const subcategory = req.body.subcategory || '';
      const posterUrl = req.file ? req.file.path : '';
      const posterPublicId = req.file ? req.file.filename : '';
      
      let modeAttemptPricing = [];
      if (req.body.modeAttemptPricing) {
        try {
          const rawPricing = JSON.parse(req.body.modeAttemptPricing);
          rawPricing.forEach(modeGroup => {
            if (modeGroup.attempts && Array.isArray(modeGroup.attempts)) {
              modeGroup.attempts.forEach(attemptData => {
                modeAttemptPricing.push({
                  mode: modeGroup.mode || '',
                  attempt: attemptData.attempt || '',
                  costPrice: attemptData.costPrice || 0,
                  sellingPrice: attemptData.sellingPrice || 0
                });
              });
            }
          });
        } catch (e) {
          console.log('⚠️ Pricing parse error, using defaults');
          modeAttemptPricing = [];
        }
      }

      const courseData = {
        title,
        subject,
        description,
        category,
        subcategory,
        paperId: req.body.paperId || '',
        paperName: req.body.paperName || '',
        courseType: req.body.courseType || 'General Course',
        noOfLecture: req.body.noOfLecture || '',
        books: req.body.books || '',
        videoLanguage: req.body.videoLanguage || 'Hindi',
        videoRunOn: req.body.videoRunOn || '',
        timing: req.body.timing || '',
        doubtSolving: req.body.doubtSolving || '',
        supportMail: req.body.supportMail || '',
        supportCall: req.body.supportCall || '',
        validityStartFrom: req.body.validityStartFrom || '',
        facultySlug: facultySlug,
        facultyName: req.body.facultyName || `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`,
        institute: req.body.institute || '',
        posterUrl,
        posterPublicId,
        modeAttemptPricing,
        costPrice: req.body.costPrice ? Number(req.body.costPrice) : 0,
        sellingPrice: req.body.sellingPrice ? Number(req.body.sellingPrice) : 0,
        isStandalone: false,
        isActive: true
      };

      faculty.courses.push(courseData);
      await faculty.save();
      
      return res.status(201).json({ 
        success: true, 
        message: 'Faculty course created successfully',
        course: courseData,
        faculty: {
          slug: faculty.slug,
          name: `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`
        }
      });
    }

  } catch (error) {
    console.error('❌ Unified course creation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Course creation failed',
      message: error.message || 'Internal Server Error',
      details: error.name || 'UnknownError'
    });
  }
});

// Get all courses (both standalone and faculty-based)
app.get('/api/courses/all', async (req, res) => {
  try {
    console.log('📊 Fetching all courses');
    
    // Get standalone courses
    const standaloneCourses = await Course.find({ 
      isStandalone: true,
      isActive: true 
    }).sort({ createdAt: -1 });

    // Get faculty-based courses
    const faculties = await Faculty.find({});
    const facultyCourses = [];
    
    faculties.forEach(faculty => {
      if (faculty.courses && faculty.courses.length > 0) {
        faculty.courses.forEach(course => {
          facultyCourses.push({
            ...course.toObject(),
            facultySlug: faculty.slug,
            facultyName: course.facultyName || `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`,
            isStandalone: false
          });
        });
      }
    });

    const allCourses = [...standaloneCourses, ...facultyCourses];
    console.log(`✅ Found ${allCourses.length} total courses (${standaloneCourses.length} standalone, ${facultyCourses.length} faculty)`);
    
    res.status(200).json({ courses: allCourses });
  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== INSTITUTES ROUTES ====================

// Get all institutes
app.get('/api/institutes', async (req, res) => {
  try {
    console.log('🏫 Fetching institutes from database...');
    const institutes = await Institute.find();
    console.log('🏫 Found institutes:', institutes.length);
    res.status(200).json({ institutes });
  } catch (error) {
    console.error('❌ Error fetching institutes:', error);
    res.status(500).json({ message: error.message });
  }
});

// Bulk insert institutes with images (for initial setup)
app.post('/api/admin/institutes/bulk-insert', async (req, res) => {
  try {
    const institutesData = [
      {
        name: "Aaditya Jain Classes",
        imageUrl: "/institutes/aaditya_jain_classes.png",
        image: "aaditya_jain_classes",
        public_id: "aaditya_jain_classes"
      },
      {
        name: "Arjun Chhabra Tutorial", 
        imageUrl: "/institutes/arjun_chhabra_tutorial.png",
        image: "arjun_chhabra_tutorial",
        public_id: "arjun_chhabra_tutorial"
      },
      {
        name: "Avinash Lala Classes",
        imageUrl: "/institutes/avinash_lala_classes.jpg", 
        image: "avinash_lala_classes",
        public_id: "avinash_lala_classes"
      },
      {
        name: "BB Virtuals",
        imageUrl: "/institutes/bb_virtuals.png",
        image: "bb_virtuals", 
        public_id: "bb_virtuals"
      },
      {
        name: "Bishnu Kedia Classes",
        imageUrl: "/institutes/bishnu_kedia_classes.png",
        image: "bishnu_kedia_classes",
        public_id: "bishnu_kedia_classes"
      },
      {
        name: "CA Buddy",
        imageUrl: "/institutes/ca_buddy.png",
        image: "ca_buddy",
        public_id: "ca_buddy"
      },
      {
        name: "CA Praveen Jindal",
        imageUrl: "/institutes/ca_praveen_jindal.png", 
        image: "ca_praveen_jindal",
        public_id: "ca_praveen_jindal"
      },
      {
        name: "COC Education",
        imageUrl: "/institutes/coc_education.png",
        image: "coc_education",
        public_id: "coc_education"
      },
      {
        name: "Ekatvam",
        imageUrl: "/institutes/ekatvam.png",
        image: "ekatvam",
        public_id: "ekatvam"
      },
      {
        name: "Gopal Bhoot Classes",
        imageUrl: "/institutes/gopal_bhoot_classes.gif",
        image: "gopal_bhoot_classes",
        public_id: "gopal_bhoot_classes"
      },
      {
        name: "Harshad Jaju Classes",
        imageUrl: "/institutes/harshad_jaju_classes.png",
        image: "harshad_jaju_classes", 
        public_id: "harshad_jaju_classes"
      },
      {
        name: "Navin Classes",
        imageUrl: "/institutes/navin_classes.jpg",
        image: "navin_classes",
        public_id: "navin_classes"
      },
      {
        name: "Nitin Guru Classes", 
        imageUrl: "/institutes/nitin_guru_classes.png",
        image: "nitin_guru_classes",
        public_id: "nitin_guru_classes"
      },
      {
        name: "Ranjan Periwal Classes",
        imageUrl: "/institutes/ranjan_periwal_classes.jpg",
        image: "ranjan_periwal_classes",
        public_id: "ranjan_periwal_classes"
      },
      {
        name: "Shivangi Agarwal",
        imageUrl: "/institutes/shivangi_agarwal.png",
        image: "shivangi_agarwal",
        public_id: "shivangi_agarwal"
      },
      {
        name: "Siddharth Agarrwal Classes", 
        imageUrl: "/institutes/siddharth_agarrwal_classes.jpg",
        image: "siddharth_agarrwal_classes",
        public_id: "siddharth_agarrwal_classes"
      },
      {
        name: "SJC Institute",
        imageUrl: "/institutes/sjc_institute.jpg",
        image: "sjc_institute",
        public_id: "sjc_institute"
      },
      {
        name: "Yashwant Mangal Classes",
        imageUrl: "/institutes/yashwant_mangal_classes.avif",
        image: "yashwant_mangal_classes",
        public_id: "yashwant_mangal_classes"
      }
    ];

    // Clear existing institutes and insert new ones
    await Institute.deleteMany({});
    const insertedInstitutes = await Institute.insertMany(institutesData);
    
    res.status(201).json({ 
      success: true, 
      message: `${insertedInstitutes.length} institutes inserted successfully`,
      institutes: insertedInstitutes 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      isActive: true 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a standalone course
app.put('/api/admin/courses/standalone/:id', courseUpload.single('poster'), async (req, res) => {
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

// ==================== FACULTY ROUTES ====================

// Get all faculties
app.get('/api/faculties', async (req, res) => {
  try {
    console.log('🎓 Fetching faculties from database...');
    const Faculty = require('./src/model/Faculty.model');
    const faculties = await Faculty.find();
    console.log('🎓 Found faculties:', faculties.length);
    console.log('🎓 Faculty details:', faculties.map(f => ({ slug: f.slug, firstName: f.firstName, lastName: f.lastName })));
    res.status(200).json({ faculties });
  } catch (error) {
    console.error('❌ Error fetching faculties:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add new faculty
app.post('/api/admin/faculty', facultyUpload.single('image'), async (req, res) => {
  try {
    console.log('📝 Faculty creation request received');
    console.log('📤 Request body:', req.body);
    console.log('📸 File received:', req.file ? 'Yes' : 'No');
    
    const Faculty = require('./src/model/Faculty.model');
    const { firstName, lastName, bio, teaches } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }
    
    // Get the Cloudinary URL from the uploaded file
    const imageUrl = req.file.path;
    const public_id = req.file.filename;

    // Handle teaches array
    let parsedTeaches = [];
    if (teaches) {
      try {
        parsedTeaches = JSON.parse(teaches);
      } catch (e) {
        if (typeof teaches === 'string') {
          parsedTeaches = teaches.split(',').map(t => t.trim());
        } else if (Array.isArray(teaches)) {
          parsedTeaches = teaches;
        } else {
          parsedTeaches = [teaches];
        }
      }
    }

    // Generate slug
    const slug = `${firstName.toLowerCase().replace(/ /g, '-')}-${lastName ? lastName.toLowerCase().replace(/ /g, '-') : ''}`.replace(/--/g, '-').replace(/^-|-$/g, '');

    const newFaculty = new Faculty({
      firstName,
      lastName: lastName || '',
      bio,
      teaches: parsedTeaches,
      imageUrl,
      image: public_id,
      public_id,
      slug,
    });

    await newFaculty.save();
    console.log('✅ Faculty saved successfully:', newFaculty._id);
    
    res.status(201).json({ success: true, faculty: newFaculty });
  } catch (error) {
    console.error('❌ Faculty creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get faculty info by firstName
app.get('/api/faculty-info/:firstName', async (req, res) => {
  try {
    const Faculty = require('./src/model/Faculty.model');
    const { firstName } = req.params;
    
    const faculty = await Faculty.findOne({ 
      firstName: { $regex: new RegExp('^' + firstName + '$', 'i') } 
    });
    
    if (faculty) {
      res.json({
        bio: faculty.bio,
        teaches: faculty.teaches,
        lastName: faculty.lastName
      });
    } else {
      res.json({
        bio: '',
        teaches: [],
        lastName: ''
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update faculty info
app.post('/api/admin/faculty-info', async (req, res) => {
  try {
    const Faculty = require('./src/model/Faculty.model');
    const { firstName, bio, teaches } = req.body;
    
    if (!firstName) {
      return res.status(400).json({ error: 'Faculty firstName is required' });
    }

    const updateData = {
      bio: bio || '',
      teaches: teaches || []
    };

    const faculty = await Faculty.findOneAndUpdate(
      { firstName: { $regex: new RegExp('^' + firstName + '$', 'i') } },
      updateData,
      { new: true, upsert: false }
    );

    if (faculty) {
      res.json({ success: true, faculty });
    } else {
      res.status(404).json({ error: 'Faculty not found' });
    }
  } catch (error) {
    console.error('Faculty update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete all faculty (emergency endpoint)
app.delete('/emergency-delete-faculty', async (req, res) => {
  try {
    const Faculty = require('./src/model/Faculty.model');
    const result = await Faculty.deleteMany({});
    res.json({ 
      success: true, 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get courses for a specific faculty
app.get('/api/faculty/:slug/courses', async (req, res) => {
  try {
    const { slug } = req.params;
    console.log(`🔍 Getting courses for faculty: ${slug}`);
    
    const Faculty = require('./src/model/Faculty.model');
    const Course = require('./src/model/Course.model');
    
    // Get faculty with courses
    const faculty = await Faculty.findOne({ slug });
    if (!faculty) {
      return res.status(404).json({ 
        success: false, 
        message: 'Faculty not found' 
      });
    }
    
    // Get standalone courses by this faculty
    const standaloneCourses = await Course.find({ 
      facultySlug: slug,
      isStandalone: true 
    });
    
    // Combine faculty-embedded courses and standalone courses
    const facultyCourses = faculty.courses || [];
    const allCourses = [...facultyCourses, ...standaloneCourses];
    
    console.log(`✅ Found ${allCourses.length} courses for faculty ${slug}`);
    
    res.status(200).json({
      success: true,
      faculty: {
        slug: faculty.slug,
        firstName: faculty.firstName,
        lastName: faculty.lastName,
        imageUrl: faculty.imageUrl
      },
      courses: allCourses,
      total: allCourses.length
    });
    
  } catch (error) {
    console.error('❌ Error getting faculty courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get faculty courses',
      error: error.message
    });
  }
});

// ==================== END FACULTY ROUTES ====================

// ==================== SERVE REACT BUILD FILES ====================
// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ status: 'error', message: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// 404 handler for API routes only
app.use('/api/*', (req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Global error handler - MUST return JSON for API routes
app.use((error, req, res, next) => {
  console.error('🚨 Global error handler caught:', error);
  
  // For API routes, always return JSON
  if (req.path.startsWith('/api/')) {
    const statusCode = error.status || error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: 'Server Error',
      message: error.message || 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
  
  // For non-API routes, use default Express error handling
  next(error);
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
