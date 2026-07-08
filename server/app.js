// Load required modules
const path = require('path');

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware to ensure JSON responses for API routes
app.use('/api/*', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// --- Base Status Route ---
app.get('/', (req, res) => {
  res.json({
    message: 'AcademyWale Backend Running on Supabase!',
    status: 'healthy',
    timestamp: new Date().toISOString()
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
const courseRoutes = require('./src/routes/course.routes.js');
const facultyRoutes = require('./src/routes/faculty.routes.js');
const instituteRoutes = require('./src/routes/institute.routes.js');
const couponRoutes = require('./src/routes/coupon.routes.js');
const testimonialRoutes = require('./src/routes/testimonial.routes.js');
const purchaseRoutes = require('./src/routes/purchase.routes.js');
const notifyRoutes = require('./src/routes/notify.routes.js');
const contactRoutes = require('./src/routes/contact.routes.js');
const standaloneCourseRoutes = require('./src/routes/standaloneCourse.routes.js');
const imageMigrationRoutes = require('./src/routes/image-migration.routes.js');

app.use('/api/auth', authRoutes);
app.use('/', courseRoutes);
app.use('/', facultyRoutes);
app.use('/', instituteRoutes);
app.use('/', couponRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/notify', notifyRoutes);
app.use('/api/contact', contactRoutes);
app.use('/', standaloneCourseRoutes);
app.use('/api/migration', imageMigrationRoutes);

// --- Serve React Build Files ---
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