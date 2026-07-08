const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase.config');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

const protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in! Please log in to get access.'
      });
    }

    // 2) Verification token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3) Check if user still exists
    const { data: currentUser, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .maybeSingle();

    if (error || !currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token does no longer exist.'
      });
    }

    // 4) Check if user is active
    if (!currentUser.is_active) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. Please log in again!'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Your token has expired! Please log in again.'
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Error verifying token'
    });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'user']. role='user'
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action'
      });
    }

    next();
  };
};

// Legacy compatibility
const requireAuth = protect;

module.exports = {
  protect,
  restrictTo,
  requireAuth,
  requireAdminCookie: async (req, res, next) => {
    try {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      } else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
      }

      if (!token) {
        return res.status(401).json({ status: 'error', message: 'Admin authentication required' });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('id, role, is_active')
        .eq('id', decoded.id)
        .maybeSingle();

      if (error || !user || user.role !== 'admin' || !user.is_active) {
        return res.status(403).json({ status: 'error', message: 'You do not have permission to perform this action' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Admin authentication middleware error:', error);
      return res.status(401).json({ status: 'error', message: 'Admin authentication required' });
    }
  }
};
