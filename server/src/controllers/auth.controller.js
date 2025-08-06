const jwt = require('jsonwebtoken');
const User = require('../model/User.model.js');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Generate JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });
};

// Create and send token response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  // Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 90) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };

  res.cookie('jwt', token, cookieOptions);

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

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    console.log('📥 Signup request received');
    console.log('📥 Request body:', req.body);
    const { name, email, password, mobile, role } = req.body;

    console.log('🔐 New user signup attempt:', { name, email, mobile, role });

    // Validate required fields
    if (!name || !email || !password || !mobile) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        status: 'error',
        message: 'All fields (name, email, password, mobile) are required'
      });
    }

    // Check if user already exists
    console.log('🔍 Checking if user exists with email:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists with email:', email);
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    console.log('👤 Creating new user...');
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

    console.log('🔑 Sending token response...');
    createSendToken(newUser, 201, res);
  } catch (error) {
    console.error('❌ Signup error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return res.status(400).json({
        status: 'error',
        message: `${field} '${value}' is already taken. Please use a different ${field}.`
      });
    }
    
    res.status(400).json({
      status: 'error',
      message: error.message || 'Error creating user'
    });
  }
};

// Legacy register endpoint for compatibility
exports.register = exports.signup;

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
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
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({ 
    status: 'success',
    message: 'Logged out successfully'
  });
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

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
}; 