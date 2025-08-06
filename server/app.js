const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Pre-register models
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

// Test Route
app.get('/', (req, res) => {
  res.send('Hello World! AcademyWale Backend is running!');
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
const authRoutes = require('./src/routes/auth.routes');
app.use('/api/auth', authRoutes);

const facultyRoutes = require('./src/routes/faculty.routes');
app.use(facultyRoutes);

const contactRoutes = require('./src/routes/contact.routes');
app.use('/api/contact', contactRoutes);

const purchaseRoutes = require('./src/routes/purchase.routes');
const requireAuth = require('./src/middlewares/clerkAuth.middleware');
app.use('/api/purchase', requireAuth, purchaseRoutes);

const couponRoutes = require('./src/routes/coupon.routes');
app.use(couponRoutes);

const testimonialRoutes = require('./src/routes/testimonial.routes');
app.use('/api/testimonials', testimonialRoutes);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/static', express.static(path.join(__dirname, 'static')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    status: 'error', 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    status: 'error', 
    message: `Route ${req.originalUrl} not found` 
  });
});

// Start server with better error handling
const PORT = process.env.PORT || 5000;

// Try to connect to database, but don't fail if it doesn't work
const dbConnection = require('./src/config/db.config');
dbConnection().then(() => {
  console.log('✅ Database connected successfully');
}).catch((err) => {
  console.error('❌ Database connection failed:', err.message);
  console.log('⚠️ Server will start without database connection');
}).finally(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth test: http://localhost:${PORT}/api/auth/test`);
  });
});