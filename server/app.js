// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const dbConnection = require('./src/config/db.config');
// const path = require('path'); // <-- FIX: Import the built-in 'path' module

// // --- FIX: Pre-register models to prevent population errors ---
// // require('./src/model/Course.model');
// require('./src/model/User.model');
// // require('./src/model/Address.model');

// // Load .env variables from the root project directory
// // FIX: Replace the old dotenv.config() with this line
// dotenv.config({ path: path.resolve(__dirname, '../.env') });

// // Initialize App
// const app = express();

// // Enable CORS for frontend (Vite runs on port 5173)
// app.use(cors({
//   origin: [
//     'https://academywale.com',
//     'https://www.academywale.com',
//     'https://academywale-lms.vercel.app',
//     'http://localhost:5173',
//     'http://localhost:5174'
//   ],
//   credentials: true
// }));

// // Body Parsers
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Test Route
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// // Routes
// // const adminRoutes = require('./src/routes/admin.routes');
// // app.use('/admin', adminRoutes);

// // const userRoutes = require('./src/routes/user.routes');
// // app.use('/user', userRoutes);

// // const courseRoutes = require('./src/routes/course.routes');
// // app.use('/course', courseRoutes);

// // const cartRoutes = require('./src/routes/cart.routes');
// // app.use('/cart', cartRoutes);

// // const orderRoutes = require('./src/routes/order.routes');
// // app.use('/order', orderRoutes);

// const authRoutes = require('./src/routes/auth.routes');
// app.use('/api/auth', authRoutes);

// const facultyRoutes = require('./src/routes/faculty.routes');
// app.use(facultyRoutes);

// const contactRoutes = require('./src/routes/contact.routes');
// app.use('/api/contact', contactRoutes);

// const purchaseRoutes = require('./src/routes/purchase.routes');
// const requireAuth = require('./src/middlewares/clerkAuth.middleware');

// app.use('/api/purchase', requireAuth, purchaseRoutes);

// const couponRoutes = require('./src/routes/coupon.routes');
// app.use(couponRoutes);

// const multer = require('multer');

// // Configure Multer for file storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, 'uploads')); // Store files in the uploads directory
//   },
//   filename: (req, file, cb) => {
//     // Generate a unique filename
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const fileExtension = path.extname(file.originalname);
//     const filename = file.fieldname + '-' + uniqueSuffix + fileExtension;
//     cb(null, filename);
//   }
// });

// const upload = multer({ storage: storage });

// const testimonialRoutes = require('./src/routes/testimonial.routes');
// app.use('/api/testimonials', testimonialRoutes);

// // Serve static files from /uploads
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Serve static files from /static
// app.use('/static', express.static(path.join(__dirname, 'static')));

// // Connect to DB and start server
// dbConnection().then(() => {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`🚀 Server is running on http://localhost:${PORT}`);
//   });
// }).catch((err) => {
//   console.error('❌ Failed to connect to DB', err);
// });

















const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

// Load .env variables FIRST before importing any modules that depend on env vars
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Delete CLOUDINARY_URL to avoid conflicts with individual credentials
delete process.env.CLOUDINARY_URL;

const dbConnection = require('./src/config/db.config');

// --- Pre-register models to prevent population errors ---
require('./src/model/User.model');

// Initialize App
const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: [
    'https://academywale.com',
    'https://www.academywale.com',
    'https://academywale-lms.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// EMERGENCY ADMIN ROUTES (before auth)
const facultyController = require('./src/controllers/faculty.controller');
app.delete('/api/admin/faculty/delete-all', (req, res) => {
  console.log('🚨 EMERGENCY DELETE-ALL ROUTE HIT (before auth)');
  facultyController.deleteAllFaculty(req, res);
});

// Simple test route
app.get('/test-delete', (req, res) => {
  console.log('🧪 TEST ROUTE HIT');
  res.json({ message: 'Test route working', timestamp: new Date() });
});

// Emergency delete route with different pattern
app.delete('/emergency-delete-faculty', (req, res) => {
  console.log('🚨 EMERGENCY DELETE FACULTY ROUTE HIT');
  facultyController.deleteAllFaculty(req, res);
});

// =====================================================================
// AUTHENTICATION NOW HANDLED BY JWT IN INDIVIDUAL ROUTES
// =====================================================================

// Test Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Debug route to check deployment
app.get('/api/debug', (req, res) => {
  res.json({
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.1',
    routes: [
      '/api/auth/signup',
      '/api/auth/login',
      '/api/auth/test'
    ]
  });
});

// Routes (Your existing logic remains unchanged)
console.log('🔄 Loading routes...');

const authRoutes = require('./src/routes/auth.routes');
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes loaded at /api/auth');

const facultyRoutes = require('./src/routes/faculty.routes');
app.use(facultyRoutes);
console.log('✅ Faculty routes loaded');

const courseRoutes = require('./src/routes/course.routes');
app.use(courseRoutes);
console.log('✅ Course routes loaded');

const instituteRoutes = require('./src/routes/institute.routes');
app.use(instituteRoutes);
console.log('✅ Institute routes loaded');

const contactRoutes = require('./src/routes/contact.routes');
app.use('/api/contact', contactRoutes);
console.log('✅ Contact routes loaded at /api/contact');

const purchaseRoutes = require('./src/routes/purchase.routes');
const { protect } = require('./src/middlewares/auth.middleware');

// Protected routes now use JWT middleware
app.use('/api/purchase', protect, purchaseRoutes);

const couponRoutes = require('./src/routes/coupon.routes');
app.use(couponRoutes);

const testimonialRoutes = require('./src/routes/testimonial.routes');
app.use('/api/testimonials', testimonialRoutes);

// Serve static files from /uploads (for legacy support only)
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// Serve static files from /static
app.use('/static', express.static(path.join(__dirname, 'static')));

// Connect to DB and start server
dbConnection().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to DB', err);
});