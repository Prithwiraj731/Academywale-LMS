const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../utils/email.utils');

// GET /api/contact/test - Test email configuration
router.get('/test', async (req, res) => {
  try {
    // Check if email credentials are configured
    const emailConfig = require('../config/email.config');
    
    if (!emailConfig.password) {
      return res.status(400).json({
        success: false,
        message: 'Email password not configured. Please set EMAIL_PASSWORD in your .env file.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email configuration is set up correctly.',
      config: {
        user: emailConfig.user,
        service: emailConfig.service,
        from: emailConfig.from,
        to: emailConfig.to
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking email configuration: ' + error.message
    });
  }
});

// POST /api/contact - Handle contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    console.log('Contact form submission received:', { name, email, subject, message });

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('Validation failed: Missing fields');
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: Invalid email format');
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Try logging contact submission to Supabase database if tables exist
    try {
      const { supabaseAdmin } = require('../config/supabase.config');
      
      // Try writing to 'contact_submissions'
      const { error: error1 } = await supabaseAdmin
        .from('contact_submissions')
        .insert([{ name, email, subject, message, created_at: new Date() }]);
      
      if (error1) {
        // Try fallback table name 'contacts'
        await supabaseAdmin
          .from('contacts')
          .insert([{ name, email, subject, message, created_at: new Date() }]);
      }
    } catch (dbError) {
      console.error('Supabase contact log warning:', dbError.message);
    }

    // Send email
    const emailResult = await sendContactEmail({
      name,
      email,
      subject,
      message
    });

    console.log('Email send result:', emailResult);

    if (emailResult.success) {
      return res.status(200).json({
        success: true,
        message: 'Thank you for your message! We will get back to you soon.'
      });
    } else {
      console.error('Email sending failed for submission:', { name, email, subject, message });
      console.error('Email error details:', emailResult.error);
      
      return res.status(500).json({
        success: false,
        message: 'We could not send your request right now. Please try again or contact us on WhatsApp.'
      });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

module.exports = router; 