const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase.config');
const { sendOTPEmail } = require('../utils/email.utils');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

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
  delete user.otp_code;
  delete user.otp_expires_at;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// @desc    Register user (generates & sends OTP)
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    console.log('📥 Signup request received');
    const { name, email, password, mobile, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    console.log('🔍 Checking if user exists with email:', email);
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    if (existingUser) {
      if (existingUser.is_active) {
        console.log('❌ User already exists with email:', email);
        return res.status(400).json({
          status: 'error',
          message: 'User with this email already exists'
        });
      } else if (existingUser.otp_code) {
        // Pending verification, update record with new details and OTP
        console.log('👤 Updating pending user with new registration details...');
        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update({
            name,
            password: hashedPassword,
            mobile: mobile || null,
            role: role || 'user',
            otp_code: otp,
            otp_expires_at: otpExpires
          })
          .eq('id', existingUser.id);

        if (updateError) throw updateError;
        
        // Send OTP email
        await sendOTPEmail(email.toLowerCase(), name, otp);

        return res.status(200).json({
          status: 'success',
          message: 'Verification code resent to your email.',
          email: email.toLowerCase()
        });
      } else {
        // Deactivated by admin
        return res.status(401).json({
          status: 'error',
          message: 'Your account has been deactivated. Please contact support.'
        });
      }
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

    console.log('👤 Creating new inactive user and generating verification code...');
    
    // Create new user (inactive until verified via OTP)
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        mobile: mobile || null,
        role: role || 'user',
        is_active: false,
        otp_code: otp,
        otp_expires_at: otpExpires,
        created_at: new Date(),
        last_login_at: new Date()
      })
      .select('*')
      .single();

    if (insertError) {
      throw insertError;
    }

    // Send OTP email
    await sendOTPEmail(email.toLowerCase(), name, otp);

    console.log('✅ User registered successfully. Verification code sent to:', newUser.email);
    res.status(201).json({
      status: 'success',
      message: 'Verification code sent to your email.',
      email: newUser.email
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Error creating user'
    });
  }
};

// @desc    Verify OTP for sign-up completion
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and verification code are required'
      });
    }

    console.log(`🔐 Verification request received for ${email} with code ${otp}`);

    // Fetch user
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (fetchError || !user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (user.is_active) {
      return res.status(400).json({
        status: 'error',
        message: 'Account is already verified and active.'
      });
    }

    if (!user.otp_code || user.otp_code !== otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Incorrect verification code'
      });
    }

    // Check expiration
    if (new Date(user.otp_expires_at) < new Date()) {
      return res.status(400).json({
        status: 'error',
        message: 'Verification code has expired. Please request a new one.'
      });
    }

    // Activate user and clear OTP fields
    console.log(`✅ Code matched. Activating account for ${email}...`);
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        is_active: true,
        otp_code: null,
        otp_expires_at: null,
        last_login_at: new Date()
      })
      .eq('id', user.id)
      .select('*')
      .single();

    if (updateError) throw updateError;

    // Send JWT token
    createSendToken(updatedUser, 200, res);
  } catch (error) {
    console.error('❌ OTP Verification error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error verifying code'
    });
  }
};

// @desc    Resend OTP to email
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required'
      });
    }

    console.log(`🔄 OTP Resend requested for ${email}`);

    // Fetch user
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (fetchError || !user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (user.is_active) {
      return res.status(400).json({
        status: 'error',
        message: 'Account is already verified and active.'
      });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user record
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        otp_code: otp,
        otp_expires_at: otpExpires
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // Send OTP email
    await sendOTPEmail(email.toLowerCase(), user.name, otp);

    res.status(200).json({
      status: 'success',
      message: 'New verification code sent to your email.'
    });
  } catch (error) {
    console.error('❌ Resend OTP error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error resending verification code'
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

    // Check if user is active or pending verification
    if (!user.is_active) {
      if (user.otp_code) {
        return res.status(401).json({
          status: 'error',
          code: 'PENDING_VERIFICATION',
          message: 'Please verify your email using the OTP sent to your email.',
          email: user.email
        });
      }
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