const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase.config');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Generate JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });
};

// Create and send token response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  
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
  delete user.password;

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
    if (!name || !email || !password) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    console.log('🔍 Checking if user exists with email:', email);
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    if (existingUser) {
      console.log('❌ User already exists with email:', email);
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    // Check unique mobile if provided
    if (mobile) {
      const { data: existingMobile, error: mobileCheckError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('mobile', mobile)
        .maybeSingle();

      if (mobileCheckError) throw mobileCheckError;
      if (existingMobile) {
        return res.status(400).json({
          status: 'error',
          message: 'User with this mobile number already exists'
        });
      }
    }

    console.log('👤 Hashing password and creating new user...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        mobile: mobile || null,
        role: role || 'user',
        is_active: true,
        created_at: new Date(),
        last_login_at: new Date()
      })
      .select('*')
      .single();

    if (insertError) {
      throw insertError;
    }

    console.log('✅ User created successfully:', newUser.email);
    console.log('🔑 Sending token response...');
    createSendToken(newUser, 201, res);
  } catch (error) {
    console.error('❌ Signup error:', error);
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

    // Check if user exists
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    // Verify password
    const isCorrect = user && (await bcrypt.compare(password, user.password));

    if (!user || !isCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    console.log('✅ Login successful for:', user.email);

    // Update last login
    await supabaseAdmin
      .from('users')
      .update({ last_login_at: new Date() })
      .eq('id', user.id);

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
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, name, email, mobile, role, is_active, created_at, last_login_at')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
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
};