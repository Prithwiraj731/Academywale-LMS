// Load required modules
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Import Supabase config
const { supabaseAdmin } = require('./src/config/supabase.config');

// --- CORS Configuration ---
app.use(cors({
  origin: [
    'https://academywale.com',
    'https://www.academywale.com',
    'https://academywale-lms-backend.onrender.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:4175',
    'http://localhost:4176',
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
    'https://academywale-lms-backend.onrender.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:4175',
    'http://localhost:4176',
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware to ensure JSON responses for API routes
app.use('/api/*', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// --- Base Status Route ---
app.get('/api/status', (req, res) => {
  res.json({
    message: 'AcademyWale Backend Running on Supabase!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    deployVersion: 'v7-otp-fix-2026-08-13',
    buildTimestamp: '2026-08-13T20:00:00Z'
  });
});

app.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const { error } = await supabaseAdmin.from('users').select('id', { head: true, count: 'exact' });
    if (!error) {
      dbStatus = 'connected';
    }
  } catch (err) {
    console.error('Health check database query failed:', err.message);
  }
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// --- Mount Modular Routes ---
const authRoutes = require('./src/routes/auth.routes.js');
const courseDetailRoutes = require('./src/routes/courseDetail.routes.js');
const courseSearchRoutes = require('./src/routes/courseSearch.routes.js');
const courseControllerRoutes = require('./src/routes/course-controller.routes.js');
const courseRoutes = require('./src/routes/course.routes.js');
const facultyRoutes = require('./src/routes/faculty.routes.js');
const instituteRoutes = require('./src/routes/institute.routes.js');
const couponRoutes = require('./src/routes/coupon.routes.js');
const testimonialRoutes = require('./src/routes/testimonial.routes.js');
const purchaseRoutes = require('./src/routes/purchase.routes.js');
const manualEnrollmentRoutes = require('./src/routes/manualEnrollment.routes.js');
const notifyRoutes = require('./src/routes/notify.routes.js');
const contactRoutes = require('./src/routes/contact.routes.js');
const standaloneCourseRoutes = require('./src/routes/standaloneCourse.routes.js');
const imageMigrationRoutes = require('./src/routes/image-migration.routes.js');

const authController = require('./src/controllers/auth.controller.js');
const purchaseController = require('./src/controllers/purchase.controller.js');
const courseController = require('./src/controllers/course.controller.js');
const { requireAdminCookie } = require('./src/middlewares/auth.middleware.js');

const testimonialController = require('./src/controllers/testimonial.controller.js');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Direct Admin OTP Routes (guarantees route matching)
app.options('/api/auth/admin/send-otp', cors());
app.post('/api/auth/admin/send-otp', authController.sendAdminOTP);
app.options('/api/admin/send-otp', cors());
app.post('/api/admin/send-otp', authController.sendAdminOTP);

app.options('/api/auth/admin/verify-otp', cors());
app.post('/api/auth/admin/verify-otp', authController.verifyAdminOTP);
app.options('/api/admin/verify-otp', cors());
app.post('/api/admin/verify-otp', authController.verifyAdminOTP);

// Direct Testimonials Routes (guarantees route matching and CORS)
app.options('/api/testimonials', cors());
app.options('/api/testimonials/*', cors());
app.options('/api/admin/testimonials', cors());
app.options('/api/admin/testimonials/*', cors());

app.get('/api/testimonials', testimonialController.getAllTestimonials);
app.get('/api/admin/testimonials', testimonialController.getAllTestimonials);
app.get('/api/testimonials/:id', testimonialController.getTestimonialById);
app.get('/api/admin/testimonials/:id', testimonialController.getTestimonialById);

app.post('/api/testimonials', upload.single('image'), testimonialController.createTestimonial);
app.post('/api/admin/testimonials', upload.single('image'), testimonialController.createTestimonial);
app.put('/api/testimonials/:id', upload.single('image'), testimonialController.updateTestimonial);
app.put('/api/admin/testimonials/:id', upload.single('image'), testimonialController.updateTestimonial);
app.delete('/api/testimonials/:id', testimonialController.deleteTestimonial);
app.delete('/api/admin/testimonials/:id', testimonialController.deleteTestimonial);

// Direct Admin Backup & Restore Routes (guarantees route matching)
app.options('/api/admin/courses/backup', cors());
app.get('/api/admin/courses/backup', requireAdminCookie, courseController.exportCourseBackup);
app.options('/api/admin/courses/restore', cors());
app.post('/api/admin/courses/restore', requireAdminCookie, courseController.restoreCourseBackup);

app.options('/api/purchase/razorpay-order', cors());
app.post('/api/purchase/razorpay-order', purchaseController.createRazorpayOrder);
app.options('/api/purchase/razorpay-verify', cors());
app.post('/api/purchase/razorpay-verify', purchaseController.verifyRazorpayPayment);
app.options('/api/purchase/razorpay-webhook', cors());
app.post('/api/purchase/razorpay-webhook', purchaseController.handleRazorpayWebhook);
app.all('/razorpay-webhook', purchaseController.handleRazorpayWebhook);

// Diagnostic: Confirm manual enrollment routes are mounted
app.get('/api/admin/manual-enrollments-health', (req, res) => {
  res.json({ ok: true, message: 'Manual enrollment route is mounted v3', ts: new Date().toISOString() });
});
app.use('/api/admin/manual-enrollments', manualEnrollmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/', couponRoutes);
app.use('/', courseDetailRoutes);
app.use('/', courseSearchRoutes);
app.use('/', courseControllerRoutes);
app.use('/', courseRoutes);
app.use('/', facultyRoutes);
app.use('/', instituteRoutes);
app.options('/api/testimonials', cors());
app.options('/api/testimonials/*', cors());
app.options('/api/admin/testimonials', cors());
app.options('/api/admin/testimonials/*', cors());
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/admin/testimonials', testimonialRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/notify', notifyRoutes);
app.use('/api/contact', contactRoutes);
app.use('/', standaloneCourseRoutes);
app.use('/api/migration', imageMigrationRoutes);

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all handler: send back React's index.html file for any non-API routes if present
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ status: 'error', message: 'API route not found' });
  }
  const distIndexPath = path.join(__dirname, '../client/dist/index.html');
  if (fs.existsSync(distIndexPath)) {
    return res.sendFile(distIndexPath);
  }
  return res.status(200).send('AcademyWale LMS Backend API Server is running.');
});

// 404 handler for API routes only
app.use('/api/*', (req, res) => {
  console.warn(`⚠️ 404: ${req.method} ${req.originalUrl} not matched by any route`);
  res.status(404).json({ status: 'error', message: 'Route not found', method: req.method, path: req.originalUrl });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('🚨 Global error handler caught:', error);

  if (error.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      error: 'File upload error',
      message: error.message || 'File upload failed',
      field: error.field,
      code: error.code
    });
  }

  const statusCode = error.status || error.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    error: 'Server Error',
    message: error.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Health: http://localhost:${PORT}/health`);
});
