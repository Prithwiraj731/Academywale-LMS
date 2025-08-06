const express = require('express');
const cors = require('cors');

// Initialize App
const app = express();

// Enable CORS
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
  res.json({ message: 'AcademyWale Backend is running!' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Simple auth test route
app.get('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth routes working' });
});

// Simple signup route (without database for now)
app.post('/api/auth/signup', (req, res) => {
  console.log('📥 Signup request received:', req.body);
  
  const { name, email, password, mobile } = req.body;
  
  if (!name || !email || !password || !mobile) {
    return res.status(400).json({
      status: 'error',
      message: 'All fields (name, email, password, mobile) are required'
    });
  }
  
  // For now, just return success without saving to database
  res.status(201).json({
    status: 'success',
    message: 'User registration endpoint is working!',
    data: {
      user: { name, email, mobile }
    }
  });
});

// Simple login route
app.post('/api/auth/login', (req, res) => {
  console.log('📥 Login request received:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide email and password'
    });
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Login endpoint is working!',
    data: {
      user: { email }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    status: 'error', 
    message: `Route ${req.originalUrl} not found` 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 MINIMAL SERVER RUNNING ON PORT ${PORT}`);
  console.log(`🌐 Health: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth test: http://localhost:${PORT}/api/auth/test`);
  console.log(`📝 Signup: http://localhost:${PORT}/api/auth/signup`);
}); 