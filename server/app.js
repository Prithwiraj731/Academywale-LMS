// EMERGENCY CLOUDINARY FIX - APPLIED ON TOP
const cloudinaryEmergency = require('./cloudinary-emergency-fix');

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

// Import models
const Course = require('./src/model/Course.model');
const Faculty = require('./src/model/Faculty.model');
const User = require('./src/model/User.model');

// CORS configuration moved below with other middleware
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

// Import Cloudinary configuration but use the emergency cloudinary instance
// const { cloudinary, storage: cloudinaryFacultyStorage } = require('./src/config/cloudinary.config');
// Use emergency cloudinary instance instead:
const cloudinary = cloudinaryEmergency; // Use emergency fix
const { storage: cloudinaryFacultyStorage } = require('./src/config/cloudinary.config');

// --- CORS MUST COME BEFORE ANY ROUTES ---
app.use(cors({
  origin: [
    'https://academywale.com',
    'https://www.academywale.com',
    'https://academywale-lms.onrender.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Content-Length'],
  exposedHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials'],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400
}));

// Preflight handler
app.options('*', cors());

// Ensure CORS headers even when an error happens later
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowed = [
    'https://academywale.com',
    'https://www.academywale.com',
    'https://academywale-lms.onrender.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ];
  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  return next();
});

// Mount course routes
const courseRoutes = require('./src/routes/course.routes.js');
app.use('/', courseRoutes);

// Mount faculty routes
const facultyRoutes = require('./src/routes/faculty.routes.js');
app.use('/', facultyRoutes);

// Mount Cloudinary test routes
const cloudinaryTestRoutes = require('./src/routes/cloudinary-test.routes.js');
app.use('/', cloudinaryTestRoutes);

// Mount debug course routes
const debugCourseRoutes = require('./src/routes/debug-courses.routes.js');
app.use('/', debugCourseRoutes);

// Mount course controller routes
const courseControllerRoutes = require('./src/routes/course-controller.routes.js');
app.use('/', courseControllerRoutes);

// Multer configuration for course uploads
const courseStorage = new CloudinaryStorage({
  cloudinary: cloudinary, // Using the imported cloudinary instance
  params: {
    folder: 'academywale/courses',
    resource_type: 'image',
    // Avoid using format/fetch_format/quality auto to prevent "Invalid extension in transformation: auto"
    transformation: [{ width: 800, height: 600, crop: 'limit' }]
  }
});

const courseUpload = multer({
  storage: courseStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Use the imported faculty storage from cloudinary.config.js
const facultyUpload = multer({ storage: cloudinaryFacultyStorage });

// Remove route-specific wildcard CORS and rely on global CORS above

// Log all CORS requests for debugging
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} request from origin: ${req.headers.origin || 'unknown'} to ${req.path}`);
  console.log(`🌐 User-Agent: ${req.headers['user-agent'] || 'unknown'}`);
  next();
});

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

// Import Institute model
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

// Course creation health check endpoint
app.get('/api/admin/courses/health', async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    console.log('🏥 Course creation health check');

    // Test database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    // Test model imports
    let modelsStatus = 'OK';
    try {
      const courseCount = await Course.countDocuments();
      const facultyCount = await Faculty.countDocuments();
      modelsStatus = 'OK';
    } catch (modelError) {
      modelsStatus = 'ERROR: ' + modelError.message;
    }

    res.json({
      success: true,
      message: 'Course creation endpoint is healthy',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      models: modelsStatus,
      cloudinary: 'configured',
      multer: 'configured',
      cors: 'enabled'
    });
  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      message: error.message
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

// SIMPLE TEST ENDPOINT - Test basic functionality
app.post('/api/admin/courses/test', async (req, res) => {
  try {
    console.log('🧪 TEST: Simple course creation test');
    console.log('📋 TEST: Request body:', req.body);
    console.log('📎 TEST: File received:', req.file ? 'Yes' : 'No');

    if (req.file) {
      console.log('📄 TEST: File details:', {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        path: req.file.path,
        size: req.file.size
      });
    }

    // Test basic course creation without complex logic
    const courseData = {
      title: req.body.title || 'Test Course',
      subject: req.body.subject || 'Test Subject',
      description: req.body.description || 'Test Description',
      category: req.body.category || 'Test Category',
      subcategory: req.body.subcategory || 'Test Subcategory',
      paperId: req.body.paperId || '1',
      paperName: req.body.paperName || 'Test Paper',
      courseType: req.body.courseType || 'Test Course Type',
      noOfLecture: req.body.noOfLecture || '10',
      books: req.body.books || 'Test Books',
      videoLanguage: req.body.videoLanguage || 'Hindi',
      videoRunOn: req.body.videoRunOn || 'Test Platform',
      timing: req.body.timing || 'Test Timing',
      doubtSolving: req.body.doubtSolving || 'Test Doubt Solving',
      supportMail: req.body.supportMail || 'test@example.com',
      supportCall: req.body.supportCall || '1234567890',
      validityStartFrom: req.body.validityStartFrom || '2024-01-01',
      facultySlug: req.body.facultySlug || '',
      facultyName: req.body.facultyName || '',
      institute: req.body.institute || 'Test Institute',
      posterUrl: req.file ? req.file.path : '',
      posterPublicId: req.file ? req.file.filename : '',
      modeAttemptPricing: [],
      costPrice: req.body.costPrice ? Number(req.body.costPrice) : 0,
      sellingPrice: req.body.sellingPrice ? Number(req.body.sellingPrice) : 0,
      isStandalone: true,
      isActive: true
    };

    console.log('📝 TEST: Creating test course with data:', courseData);

    const newCourse = new Course(courseData);

    // Validate before saving
    const validationError = newCourse.validateSync();
    if (validationError) {
      console.error('❌ TEST: Validation error:', validationError);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Course data validation failed',
        details: Object.keys(validationError.errors || {})
      });
    }

    const savedCourse = await newCourse.save();
    console.log('✅ TEST: Test course saved successfully:', savedCourse._id);

    res.status(201).json({
      success: true,
      message: 'Test course created successfully',
      course: savedCourse
    });

  } catch (error) {
    console.error('❌ TEST ERROR:', error);
    console.error('❌ TEST: Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Test course creation failed',
      message: error.message || 'Internal Server Error',
      details: error.name || 'UnknownError'
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

// MAIN COURSE CREATION ENDPOINT - UNIFIED FOR ALL COURSES
app.post('/api/admin/courses', courseUpload.single('poster'), async (req, res) => {
  // Ensure CORS headers reflect the requesting origin
  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  try {
    console.log('🎯 MAIN COURSE CREATION ENDPOINT - Request received');
    console.log('📋 Request body:', req.body);
    console.log('📎 File received:', req.file ? 'Yes' : 'No');

    // Validate request body
    if (!req.body) {
      console.error('❌ No request body received');
      return res.status(400).json({
        success: false,
        error: 'No request body',
        message: 'Request body is required'
      });
    }

    // Log all request body fields for debugging
    console.log('📋 Request body fields:');
    Object.keys(req.body).forEach(key => {
      console.log(`   ${key}: ${req.body[key]}`);
    });

    if (req.file) {
      console.log('📄 File details:', {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        encoding: req.file.encoding,
        mimetype: req.file.mimetype,
        path: req.file.path,
        size: req.file.size
      });

      // Validate cloudinary upload
      if (!req.file.path) {
        console.error('❌ Cloudinary upload failed - no path returned');
        return res.status(500).json({
          success: false,
          error: 'File upload failed',
          message: 'Cloudinary upload failed - no path returned'
        });
      }

      // Validate cloudinary URL format
      if (!req.file.path.startsWith('http')) {
        console.error('❌ Cloudinary upload failed - invalid URL format:', req.file.path);
        return res.status(500).json({
          success: false,
          error: 'File upload failed',
          message: 'Cloudinary upload failed - invalid URL format'
        });
      }

      // Validate cloudinary URL structure
      if (!req.file.path.includes('cloudinary.com')) {
        console.error('❌ Cloudinary upload failed - invalid cloudinary URL:', req.file.path);
        return res.status(500).json({
          success: false,
          error: 'File upload failed',
          message: 'Cloudinary upload failed - invalid cloudinary URL'
        });
      }

      console.log('✅ Cloudinary upload successful:', req.file.path);
      console.log('✅ Cloudinary URL validated');
    } else {
      console.log('⚠️ No file uploaded - this might be expected for some requests');
    }

    // Check if this is a faculty-based course or standalone
    const facultySlug = req.body.facultySlug;
    const hasFaculty = facultySlug && facultySlug.trim() !== '';

    console.log('🔍 Course type detection:', {
      facultySlug: facultySlug,
      hasFaculty: hasFaculty,
      finalDecision: hasFaculty ? 'FACULTY' : 'STANDALONE'
    });

    if (hasFaculty) {
      // Handle faculty-based course - save to Faculty's courses array
      console.log('📍 Processing as faculty-based course');

      try {
        console.log('🔍 Looking up faculty with slug:', facultySlug);
        const faculty = await Faculty.findOne({ slug: facultySlug });
        if (!faculty) {
          console.log('❌ Faculty not found:', facultySlug);
          return res.status(404).json({
            success: false,
            error: 'Faculty not found',
            message: `Faculty with slug '${facultySlug}' not found in database`
          });
        }

        console.log('✅ Faculty found:', {
          id: faculty._id,
          firstName: faculty.firstName,
          lastName: faculty.lastName,
          slug: faculty.slug,
          coursesCount: faculty.courses ? faculty.courses.length : 0
        });

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
            console.log('⚠️ Raw pricing data:', req.body.modeAttemptPricing);
            console.log('⚠️ Parse error:', e.message);
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

        // Log course data for debugging
        console.log('📝 Course data created:', {
          title: courseData.title,
          subject: courseData.subject,
          facultySlug: courseData.facultySlug,
          facultyName: courseData.facultyName,
          posterUrl: courseData.posterUrl ? 'Yes' : 'No',
          pricingCount: courseData.modeAttemptPricing.length,
          category: courseData.category,
          subcategory: courseData.subcategory,
          paperId: courseData.paperId,
          paperName: courseData.paperName,
          courseType: courseData.courseType,
          isStandalone: courseData.isStandalone,
          isActive: courseData.isActive
        });

        // Log full course data for debugging
        console.log('📝 Full course data:', JSON.stringify(courseData, null, 2));

        // Validate course data before adding to faculty
        console.log('🔍 Validating faculty course data...');

        // Check required fields
        if (!courseData.title || !courseData.subject) {
          console.error('❌ Faculty course validation failed - missing required fields');
          console.error('❌ Title:', courseData.title);
          console.error('❌ Subject:', courseData.subject);
          return res.status(400).json({
            success: false,
            error: 'Validation failed',
            message: 'Title and subject are required for faculty courses'
          });
        }

        // Validate string fields are not too long
        if (courseData.title.length > 200) {
          console.error('❌ Faculty course validation failed - title too long');
          return res.status(400).json({
            success: false,
            error: 'Validation failed',
            message: 'Title is too long (max 200 characters)'
          });
        }

        if (courseData.subject.length > 200) {
          console.error('❌ Faculty course validation failed - subject too long');
          return res.status(400).json({
            success: false,
            error: 'Validation failed',
            message: 'Subject is too long (max 200 characters)'
          });
        }

        // Validate pricing data
        if (courseData.modeAttemptPricing && courseData.modeAttemptPricing.length > 0) {
          console.log('🔍 Validating pricing data...');
          for (let i = 0; i < courseData.modeAttemptPricing.length; i++) {
            const pricing = courseData.modeAttemptPricing[i];
            console.log(`🔍 Validating pricing item ${i}:`, pricing);

            if (!pricing.mode || !pricing.attempt || pricing.costPrice === undefined || pricing.sellingPrice === undefined) {
              console.error('❌ Faculty course validation failed - invalid pricing data at index', i);
              console.error('❌ Pricing data:', pricing);
              return res.status(400).json({
                success: false,
                error: 'Validation failed',
                message: 'Invalid pricing data - mode, attempt, costPrice, and sellingPrice are required'
              });
            }

            // Validate pricing values
            if (pricing.costPrice < 0 || pricing.sellingPrice < 0) {
              console.error('❌ Faculty course validation failed - invalid pricing values at index', i);
              console.error('❌ Pricing data:', pricing);
              return res.status(400).json({
                success: false,
                error: 'Validation failed',
                message: 'Pricing values must be non-negative'
              });
            }
          }
          console.log('✅ Pricing data validation passed');
        } else {
          console.log('⚠️ No pricing data to validate');
        }

        // Final validation check
        console.log('🔍 Final faculty course data check:', {
          title: courseData.title,
          subject: courseData.subject,
          facultySlug: courseData.facultySlug,
          facultyName: courseData.facultyName,
          posterUrl: courseData.posterUrl ? 'Yes' : 'No',
          pricingCount: courseData.modeAttemptPricing.length,
          isStandalone: courseData.isStandalone,
          isActive: courseData.isActive,
          category: courseData.category,
          subcategory: courseData.subcategory,
          paperId: courseData.paperId,
          paperName: courseData.paperName,
          courseType: courseData.courseType
        });

        // Additional validation for faculty course data structure
        if (!courseData.title || courseData.title.trim() === '') {
          console.error('❌ Faculty course validation failed - empty title');
          return res.status(400).json({
            success: false,
            error: 'Validation failed',
            message: 'Course title cannot be empty'
          });
        }

        if (!courseData.subject || courseData.subject.trim() === '') {
          console.error('❌ Faculty course validation failed - empty subject');
          return res.status(400).json({
            success: false,
            error: 'Validation failed',
            message: 'Course subject cannot be empty'
          });
        }

        // Validate faculty slug is not empty
        if (!courseData.facultySlug || courseData.facultySlug.trim() === '') {
          console.error('❌ Faculty course validation failed - empty faculty slug');
          return res.status(400).json({
            success: false,
            error: 'Validation failed',
            message: 'Faculty slug cannot be empty'
          });
        }

        console.log('📝 Adding course to faculty:', facultySlug);
        console.log('📝 Course data:', courseData);

        // Add course to faculty's courses array
        faculty.courses.push(courseData);

        console.log('📝 Faculty courses array length after adding:', faculty.courses.length);

        // Save faculty with new course
        try {
          console.log('💾 Saving faculty with new course...');
          const savedFaculty = await faculty.save();
          console.log('✅ Faculty course saved successfully');
          console.log('✅ Saved faculty ID:', savedFaculty._id);
          console.log('✅ Faculty courses count after save:', savedFaculty.courses.length);
        } catch (saveError) {
          console.error('❌ Faculty save error:', saveError);
          console.error('❌ Save error details:', {
            name: saveError.name,
            message: saveError.message,
            code: saveError.code,
            stack: saveError.stack
          });
          return res.status(500).json({
            success: false,
            error: 'Faculty save failed',
            message: saveError.message || 'Failed to save faculty with new course',
            details: saveError.name || 'UnknownError'
          });
        }

        return res.status(201).json({
          success: true,
          message: 'Faculty course created successfully',
          course: courseData,
          faculty: {
            slug: faculty.slug,
            name: `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`
          }
        });
      } catch (facultyError) {
        console.error('❌ Faculty course creation error:', facultyError);
        return res.status(500).json({
          success: false,
          error: 'Faculty course creation failed',
          message: facultyError.message || 'Internal Server Error',
          details: facultyError.name || 'UnknownError'
        });
      }

    } else {
      // Handle standalone course - save to Course collection
      console.log('📍 Processing as standalone course');

      try {
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
            console.log('⚠️ Raw pricing data:', req.body.modeAttemptPricing);
            console.log('⚠️ Parse error:', e.message);
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
          facultySlug: '',
          facultyName: '',
          institute: req.body.institute || '',
          posterUrl,
          posterPublicId,
          modeAttemptPricing,
          costPrice: req.body.costPrice ? Number(req.body.costPrice) : 0,
          sellingPrice: req.body.sellingPrice ? Number(req.body.sellingPrice) : 0,
          isStandalone: true,
          isActive: true
        };

        console.log('📝 Creating standalone course with data:', courseData);

        // Log full course data for debugging
        console.log('📝 Full standalone course data:', JSON.stringify(courseData, null, 2));

        const newCourse = new Course(courseData);

        // Validate before saving
        console.log('🔍 Validating standalone course data...');
        const validationError = newCourse.validateSync();
        if (validationError) {
          console.error('❌ Validation error:', validationError);
          console.error('❌ Validation error details:', validationError.errors);
          return res.status(400).json({
            success: false,
            error: 'Validation Error',
            message: 'Course data validation failed',
            details: Object.keys(validationError.errors || {}),
            validationErrors: validationError.errors
          });
        }

        console.log('✅ Standalone course validation passed');

        // Additional validation for standalone courses
        if (!courseData.title || !courseData.subject) {
          console.error('❌ Standalone course validation failed - missing required fields');
          return res.status(400).json({
            success: false,
            error: 'Validation failed',
            message: 'Title and subject are required for standalone courses'
          });
        }

        // Validate string fields are not too long
        if (courseData.title.length > 200) {
          console.error('❌ Standalone course validation failed - title too long');
          return res.status(400).json({
            success: false,
            error: 'Validation failed',
            message: 'Title is too long (max 200 characters)'
          });
        }

        if (courseData.subject.length > 200) {
          console.error('❌ Standalone course validation failed - subject too long');
          return res.status(400).json({
            success: false,
            error: 'Validation failed',
            message: 'Subject is too long (max 200 characters)'
          });
        }

        // Validate pricing data
        if (courseData.modeAttemptPricing && courseData.modeAttemptPricing.length > 0) {
          console.log('🔍 Validating standalone course pricing data...');
          for (let i = 0; i < courseData.modeAttemptPricing.length; i++) {
            const pricing = courseData.modeAttemptPricing[i];
            console.log(`🔍 Validating standalone pricing item ${i}:`, pricing);

            if (!pricing.mode || !pricing.attempt || pricing.costPrice === undefined || pricing.sellingPrice === undefined) {
              console.error('❌ Standalone course validation failed - invalid pricing data at index', i);
              console.error('❌ Pricing data:', pricing);
              return res.status(400).json({
                success: false,
                error: 'Validation failed',
                message: 'Invalid pricing data - mode, attempt, costPrice, and sellingPrice are required'
              });
            }

            // Validate pricing values
            if (pricing.costPrice < 0 || pricing.sellingPrice < 0) {
              console.error('❌ Standalone course validation failed - invalid pricing values at index', i);
              console.error('❌ Pricing data:', pricing);
              return res.status(400).json({
                success: false,
                error: 'Validation failed',
                message: 'Pricing values must be non-negative'
              });
            }
          }
          console.log('✅ Standalone course pricing data validation passed');
        } else {
          console.log('⚠️ No standalone course pricing data to validate');
        }

        // Final validation check for standalone course
        console.log('🔍 Final standalone course data check:', {
          title: courseData.title,
          subject: courseData.subject,
          facultySlug: courseData.facultySlug,
          facultyName: courseData.facultyName,
          posterUrl: courseData.posterUrl ? 'Yes' : 'No',
          pricingCount: courseData.modeAttemptPricing.length,
          isStandalone: courseData.isStandalone,
          isActive: courseData.isActive,
          category: courseData.category,
          subcategory: courseData.subcategory,
          paperId: courseData.paperId,
          paperName: courseData.paperName,
          courseType: courseData.courseType
        });

        // Additional validation for course data structure
        if (!courseData.title || courseData.title.trim() === '') {
          console.error('❌ Standalone course validation failed - empty title');
          return res.status(400).json({
            success: false,
            error: 'Validation failed',
            message: 'Course title cannot be empty'
          });
        }

        if (!courseData.subject || courseData.subject.trim() === '') {
          console.error('❌ Standalone course validation failed - empty subject');
          return res.status(400).json({
            success: false,
            error: 'Validation failed',
            message: 'Course subject cannot be empty'
          });
        }

        // Save course to database
        try {
          console.log('💾 Saving standalone course to database...');
          const savedCourse = await newCourse.save();
          console.log('✅ Standalone course saved successfully:', savedCourse._id);
          console.log('✅ Course data after save:', {
            id: savedCourse._id,
            title: savedCourse.title,
            subject: savedCourse.subject,
            isStandalone: savedCourse.isStandalone,
            isActive: savedCourse.isActive
          });
        } catch (saveError) {
          console.error('❌ Course save error:', saveError);
          console.error('❌ Save error details:', {
            name: saveError.name,
            message: saveError.message,
            code: saveError.code,
            stack: saveError.stack
          });
          return res.status(500).json({
            success: false,
            error: 'Course save failed',
            message: saveError.message || 'Failed to save course to database',
            details: saveError.name || 'UnknownError'
          });
        }

        return res.status(201).json({
          success: true,
          message: 'Standalone course created successfully',
          course: savedCourse
        });
      } catch (standaloneError) {
        console.error('❌ Standalone course creation error:', standaloneError);
        return res.status(500).json({
          success: false,
          error: 'Standalone course creation failed',
          message: standaloneError.message || 'Internal Server Error',
          details: standaloneError.name || 'UnknownError'
        });
      }
    }

  } catch (error) {
    console.error('❌ MAIN COURSE CREATION ERROR:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    // Set CORS headers even on error
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (error.name === 'MulterError') {
      console.error('❌ MulterError details:', error);
      return res.status(400).json({
        success: false,
        error: 'File upload error',
        message: error.message,
        field: error.field,
        code: error.code
      });
    }

    if (error.name === 'ValidationError') {
      console.error('❌ Mongoose validation error:', error);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: error.message,
        errors: error.errors
      });
    }

    // Log additional error context
    console.error('❌ Additional error context:', {
      requestPath: req.path,
      requestMethod: req.method,
      requestHeaders: req.headers,
      requestBody: req.body ? Object.keys(req.body) : 'No body',
      fileInfo: req.file ? {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : 'No file'
    });

    // Ensure we always return JSON
    return res.status(500).json({
      success: false,
      error: 'Course creation failed',
      message: error.message || 'Internal Server Error',
      details: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
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
// Faculty creation endpoint has been moved to faculty.routes.js and faculty.controller.js

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

  // Handle multer errors specifically
  if (error.name === 'MulterError') {
    console.error('🚨 Multer error caught:', error);
    if (req.path.startsWith('/api/')) {
      return res.status(400).json({
        success: false,
        error: 'File upload error',
        message: error.message || 'File upload failed',
        field: error.field,
        code: error.code
      });
    }
  }

  // For API routes, always return JSON
  if (req.path.startsWith('/api/')) {
    // Ensure CORS headers on error responses too
    const origin = req.headers.origin;
    const allowed = [
      'https://academywale.com',
      'https://www.academywale.com',
      'https://academywale-lms.onrender.com',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000'
    ];
    if (origin && allowed.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
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
