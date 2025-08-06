const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://academywale.com', 'https://www.academywale.com', 'http://localhost:5173'],
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
      data: { user: { name: newUser.name, email: newUser.email } }
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
      data: { user: { name: user.name, email: user.email } }
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
      data: { user: { name: user.name, email: user.email } }
    });
    
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
});

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