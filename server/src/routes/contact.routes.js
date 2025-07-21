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

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Send email
    const emailResult = await sendContactEmail({
      name,
      email,
      subject,
      message
    });

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
        messageId: emailResult.messageId
      });
    } else {
      console.error('Email sending failed:', emailResult.error);
      res.status(500).json({
        success: false,
        message: 'Failed to send email. Please try again later.'
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