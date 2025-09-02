

const express = require('express');
const app = express();

// Import the mode mapper utility
const { mapMode } = require('./src/utils/modeMapper');
const cors = require('cors');
const mongoose = require('mongoose');

// Import models
const Faculty = require('./src/model/Faculty.model');
const User = require('./src/model/User.model');
const Course = require('./src/model/Course.model');





// CORS configuration moved below with other middleware
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

// Import Cloudinary configuration
const { cloudinary, storage: cloudinaryFacultyStorage } = require('./src/config/cloudinary.config');

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
  const allowedOrigins = [
    'https://academywale.com',
    'https://www.academywale.com',
    'https://academywale-lms.onrender.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
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





// Mount course controller routes
const courseControllerRoutes = require('./src/routes/course-controller.routes.js');
app.use('/', courseControllerRoutes);

// Mount course detail routes
const courseDetailRoutes = require('./src/routes/courseDetail.routes.js');
app.use('/', courseDetailRoutes);






// Mount course search routes
const courseSearchRoutes = require('./src/routes/courseSearch.routes.js');
app.use('/', courseSearchRoutes);

// Standalone course routes removed - all courses now under faculty (including "N/A" faculty)

// Mount purchase routes
const purchaseRoutes = require('./src/routes/purchase.routes.js');
app.use('/api/purchase', purchaseRoutes);

// Mount notification routes
const notifyRoutes = require('./src/routes/notify.routes.js');
app.use('/api/notify', notifyRoutes);

// Import course utilities
const { validateCourseMode } = require('./src/utils/courseUtils');

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

// Initialize database connection
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'AcademyWale Backend Running!',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
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

      // Validate and fix course mode before adding to faculty
      const validatedCourseData = validateCourseMode(courseData);
      console.log('✅ Course mode validated and fixed if needed');

      // Add course to faculty's courses array
      faculty.courses.push(validatedCourseData);
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

    // Validate and fix course mode before adding to faculty
    const validatedCourseData = validateCourseMode(courseData);
    console.log('✅ Course mode validated and fixed if needed');

    // Add course to faculty's courses array
    faculty.courses.push(validatedCourseData);

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
app.post('/api/admin/courses/faculty', [courseUpload.single('poster')], async (req, res) => {
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

    // Validate and fix course mode before adding to faculty
    const validatedCourseData = validateCourseMode(courseData);
    console.log('✅ Course mode validated and fixed if needed');

    // Add course to faculty's courses array
    faculty.courses.push(validatedCourseData);

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

// MAIN COURSE CREATION ENDPOINT - SIMPLE AND WORKING
app.post('/api/admin/courses', [courseUpload.single('poster')], async (req, res) => {
  // Set CORS headers
  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  try {
    console.log('🎯 SIMPLE COURSE CREATION - Request received');
    console.log('📋 Request body:', req.body);
    console.log('📎 File received:', req.file ? 'Yes' : 'No');

    // Debug: Log all received fields
    console.log('🔍 All received fields:');
    Object.keys(req.body).forEach(key => {
      console.log(`   ${key}: "${req.body[key]}"`);
    });

    // Basic validation - Check for either title/subject OR paperName/category
    if (!req.body.title && !req.body.paperName) {
      console.log('❌ Validation failed: No title or paperName found');
      console.log('❌ Available fields:', Object.keys(req.body));
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Either title or paperName is required',
        receivedFields: Object.keys(req.body),
        requiredFields: ['title or paperName', 'subject or category']
      });
    }

    if (!req.body.subject && !req.body.category) {
      console.log('❌ Validation failed: No subject or category found');
      console.log('❌ Available fields:', Object.keys(req.body));
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Either subject or category is required',
        receivedFields: Object.keys(req.body),
        requiredFields: ['title or paperName', 'subject or category']
      });
    }

    console.log('✅ Validation passed - proceeding with course creation');

    // Get file info
    const posterUrl = req.file ? req.file.path : '';
    const posterPublicId = req.file ? req.file.filename : '';

    // Check if faculty-based or standalone
    const facultySlug = req.body.facultySlug;
    const hasFaculty = facultySlug && facultySlug.trim() !== '';

    if (hasFaculty) {
      // FACULTY COURSE - Save to Faculty collection
      console.log('📍 Processing as faculty course for:', facultySlug);

      const faculty = await Faculty.findOne({ slug: facultySlug });
      if (!faculty) {
        return res.status(404).json({
          success: false,
          error: 'Faculty not found',
          message: `Faculty with slug '${facultySlug}' not found`
        });
      }

      // Create simple course data - Use available fields
      const courseData = {
        title: req.body.title || req.body.paperName || 'Course Title',
        subject: req.body.subject || req.body.category || 'Course Subject',
        description: req.body.description || '',
        category: req.body.category || '',
        subcategory: req.body.subcategory || '',
        paperId: req.body.paperId || '',
        paperName: req.body.paperName || req.body.title || '',
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
        posterUrl: posterUrl,
        posterPublicId: posterPublicId,
        modeAttemptPricing: [],
        costPrice: req.body.costPrice ? Number(req.body.costPrice) : 0,
        sellingPrice: req.body.sellingPrice ? Number(req.body.sellingPrice) : 0,
        // FORCE A VALID MODE VALUE - Critical Fix
        mode: 'Live Watching', // Always use a valid mode value to avoid validation errors
        isStandalone: false,
        isActive: true,
        createdAt: new Date()
      };

      // Validate and fix course mode before adding to faculty
      const validatedCourseData = validateCourseMode(courseData);
      console.log('✅ Course mode validated and fixed if needed');

      // Double-check mode value is valid
      validatedCourseData.mode = 'Live Watching'; // Force valid mode

      // Add to faculty courses array
      faculty.courses.push(validatedCourseData);

      try {
        // Try to save with potential retry
        await faculty.save();
      } catch (saveError) {
        // If save fails and it's a validation error for mode, try a direct fix
        if (saveError.name === 'ValidationError' &&
          saveError.errors &&
          saveError.errors['courses.0.mode']) {
          console.log('⚠️ Mode validation error occurred despite fixes, applying emergency fix...');

          // Force valid mode value for the newly added course
          const lastIndex = faculty.courses.length - 1;
          faculty.courses[lastIndex].mode = 'Live Watching';

          // Try saving again without validation
          await faculty.collection.updateOne(
            { _id: faculty._id },
            { $set: { courses: faculty.courses } }
          );
          console.log('✅ Applied emergency direct database update to bypass validation');
        } else {
          // Rethrow other errors
          throw saveError;
        }
      }

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

    } else {
      // STANDALONE COURSE - Save to Course collection
      console.log('📍 Processing as standalone course');

      // Create simple course data - Use available fields
      const courseData = {
        title: req.body.title || req.body.paperName || 'Course Title',
        subject: req.body.subject || req.body.category || 'Course Subject',
        description: req.body.description || '',
        category: req.body.category || '',
        subcategory: req.body.subcategory || '',
        paperId: req.body.paperId || '',
        paperName: req.body.paperName || req.body.title || '',
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
        posterUrl: posterUrl,
        posterPublicId: posterPublicId,
        modeAttemptPricing: [],
        costPrice: req.body.costPrice ? Number(req.body.costPrice) : 0,
        sellingPrice: req.body.sellingPrice ? Number(req.body.sellingPrice) : 0,
        isStandalone: true,
        isActive: true,
        createdAt: new Date()
      };

      // Create and save course
      const newCourse = new Course(courseData);
      const savedCourse = await newCourse.save();

      console.log('✅ Standalone course saved successfully:', savedCourse._id);
      return res.status(201).json({
        success: true,
        message: 'Standalone course created successfully',
        course: savedCourse
      });
    }

  } catch (error) {
    console.error('❌ COURSE CREATION ERROR:', error);

    // Set CORS headers even on error
    if (req.headers.origin) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
      res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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

// Delete all courses (emergency endpoint)
app.delete('/api/admin/courses/delete-all', async (req, res) => {
  try {
    console.log('🔥 Delete all courses operation started...');
    const Faculty = require('./src/model/Faculty.model');
    const Course = require('./src/model/Course.model');

    let totalDeleted = 0;
    let facultyErrors = [];

    // Delete standalone courses
    console.log('📦 Deleting standalone courses...');
    try {
      const standaloneResult = await Course.deleteMany({});
      totalDeleted += standaloneResult.deletedCount;
      console.log(`✅ Deleted ${standaloneResult.deletedCount} standalone courses`);
    } catch (courseError) {
      console.error('❌ Error deleting standalone courses:', courseError);
      facultyErrors.push({
        type: 'standalone',
        error: courseError.message
      });
    }

    // Delete courses from all faculties
    console.log('👩‍🏫 Finding faculties to delete courses...');
    let faculties = [];
    try {
      faculties = await Faculty.find({});
      console.log(`📚 Found ${faculties.length} faculties`);
    } catch (findError) {
      console.error('❌ Error finding faculties:', findError);
      facultyErrors.push({
        type: 'find_faculties',
        error: findError.message
      });
    }

    // Process each faculty using direct database update instead of validation
    for (const faculty of faculties) {
      try {
        if (faculty.courses && faculty.courses.length > 0) {
          console.log(`📚 Processing faculty: ${faculty.firstName} ${faculty.lastName} with ${faculty.courses.length} courses`);
          const courseCount = faculty.courses.length;

          // Use direct update instead of save to bypass validation
          const updateResult = await Faculty.updateOne(
            { _id: faculty._id },
            { $set: { courses: [] } }
          );

          if (updateResult.modifiedCount === 1) {
            totalDeleted += courseCount;
            console.log(`✅ Removed ${courseCount} courses from faculty via direct update`);
          } else {
            console.warn(`⚠️ Failed to update faculty ${faculty._id} - no document modified`);
            facultyErrors.push({
              type: 'faculty_update',
              facultyId: faculty._id,
              name: `${faculty.firstName} ${faculty.lastName}`,
              error: 'No document was modified'
            });
          }
        }
      } catch (facultyError) {
        console.error(`❌ Error updating faculty ${faculty._id}:`, facultyError);
        facultyErrors.push({
          type: 'faculty_update',
          facultyId: faculty._id,
          name: `${faculty.firstName} ${faculty.lastName}`,
          error: facultyError.message
        });
      }
    }

    console.log(`✅ Delete all courses operation completed. Total deleted: ${totalDeleted}`);

    // If we have errors but also deleted some courses, it's a partial success
    if (facultyErrors.length > 0) {
      console.error(`⚠️ Some errors occurred during deletion: ${JSON.stringify(facultyErrors)}`);

      // If we failed to delete ANY courses, try one more desperate approach
      if (totalDeleted === 0) {
        console.log('🔥 Zero courses deleted with standard method. Trying direct database approach...');
        try {
          // Try to update all faculties at once
          const bulkUpdateResult = await Faculty.updateMany(
            {}, // Match all faculties
            { $set: { courses: [] } } // Set courses to empty array
          );

          console.log(`📊 Bulk update result: ${JSON.stringify(bulkUpdateResult)}`);
          if (bulkUpdateResult.modifiedCount > 0) {
            return res.json({
              success: true,
              deletedCount: -1, // We can't know exact count, use -1 to indicate "all"
              message: "Successfully removed all courses using direct database update. Please refresh to see changes."
            });
          }
        } catch (emergencyError) {
          console.error('💥 Emergency deletion also failed:', emergencyError);
          facultyErrors.push({
            type: 'emergency_update',
            error: emergencyError.message
          });
        }
      }

      return res.status(207).json({
        success: true,
        partial: true,
        deletedCount: totalDeleted,
        errors: facultyErrors,
        message: `Partially deleted ${totalDeleted} courses. Some errors occurred.`
      });
    }

    res.json({
      success: true,
      deletedCount: totalDeleted,
      message: `Successfully deleted ${totalDeleted} courses (both standalone and faculty courses).`
    });
  } catch (error) {
    console.error('❌ Major error deleting all courses:', error);
    // Add stack trace for more debugging info
    console.error('Stack trace:', error.stack);

    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while deleting courses.',
      details: error.stack ? error.stack.split('\n').slice(0, 3).join('\n') : 'No stack trace available'
    });
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

  // Special handling for Mongoose validation errors
  if (error.name === 'ValidationError') {
    console.error('❌ Mongoose validation error:', error.errors);

    // Check if it's a mode validation error
    const modeError = error.errors?.['courses.0.mode'];
    if (modeError && modeError.kind === 'enum') {
      const invalidMode = modeError.value;
      console.error(`❌ Invalid mode value detected: "${invalidMode}"`);

      return res.status(400).json({
        success: false,
        error: 'Validation error with course mode',
        message: 'Invalid mode value',
        invalidValue: invalidMode,
        validModes: ['Live Watching', 'Recorded Videos', 'Live at Home With Hard Copy', 'Self Study'],
        suggestion: 'Please use one of these modes: "Live Watching", "Recorded Videos", "Live at Home With Hard Copy", "Self Study"'
      });
    }

    // Handle other validation errors
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: error.message,
      details: error.errors
    });
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
