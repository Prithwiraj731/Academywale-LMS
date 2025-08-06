const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.DB_URL || 'mongodb+srv://prithwi1016:4xtVi1z1uzyAdA7v@courses.znwo0tt.mongodb.net/?retryWrites=true&w=majority&appName=courses';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('⚠️ Server will start without database connection');
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  mobile: {
    type: String,
    required: [true, 'Please provide your mobile number'],
    unique: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to check password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to update last login
userSchema.methods.updateLastLogin = async function() {
  this.lastLoginAt = new Date();
  await this.save({ validateBeforeSave: false });
};

const User = mongoose.model('User', userSchema);

// Generate JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '90d',
  });
};

// Create and send token response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

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

// Auth test route
app.get('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth routes working' });
});

// Signup route with MongoDB
app.post('/api/auth/signup', async (req, res) => {
  try {
    console.log('📥 Signup request received:', req.body);
    
    const { name, email, password, mobile, role } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields (name, email, password, mobile) are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      mobile,
      role: role || 'user'
    });

    console.log('✅ User created successfully:', newUser.email);

    // Update last login
    await newUser.updateLastLogin();

    // Send token response
    createSendToken(newUser, 201, res);
    
  } catch (error) {
    console.error('❌ Signup error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        status: 'error',
        message: `An account with that ${field} already exists.`
      });
    }
    
    res.status(400).json({
      status: 'error',
      message: error.message || 'Error creating user'
    });
  }
});

// Login route with MongoDB
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔑 Login attempt for:', email);

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    console.log('✅ Login successful for:', user.email);

    // Update last login
    await user.updateLastLogin();

    createSendToken(user, 200, res);
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error during login'
    });
  }
});

// Logout route
app.post('/api/auth/logout', (req, res) => {
  res.status(200).json({ 
    status: 'success',
    message: 'Logged out successfully'
  });
});

// Get current user route
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in! Please log in to get access.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token does no longer exist.'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('❌ Get me error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching user data'
    });
  }
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

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
    console.log(`🌐 Health: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth test: http://localhost:${PORT}/api/auth/test`);
    console.log(`📝 Signup: http://localhost:${PORT}/api/auth/signup`);
    console.log(`🔑 Login: http://localhost:${PORT}/api/auth/login`);
  });
}).catch((err) => {
  console.error('❌ Failed to start server:', err);
});