const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../utils/email.utils');

// GET /api/contact/test - Test email configuration
router.get('/test', async (req, res) => {
  try {
    const emailConfig = require('../config/email.config');
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
    const { name, email, phone, subject, message } = req.body;

    console.log('Contact form submission received:', { name, email, phone, subject, message });

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and message are required'
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

    const fullMessage = phone ? `Phone: ${phone}\n\n${message}` : message;

    // 1. Try logging contact submission to Supabase database
    try {
      const { supabaseAdmin } = require('../config/supabase.config');
      const { error: error1 } = await supabaseAdmin
        .from('contact_submissions')
        .insert([{ name, email, subject: subject || 'General Query', message: fullMessage, created_at: new Date() }]);
      
      if (error1) {
        await supabaseAdmin
          .from('contacts')
          .insert([{ name, email, subject: subject || 'General Query', message: fullMessage, created_at: new Date() }]);
      }
    } catch (dbError) {
      console.error('Supabase contact log warning:', dbError.message);
    }

    // 2. Send email via Brevo / Resend / Nodemailer
    try {
      await sendContactEmail({
        name,
        email,
        subject: subject || 'New Contact Form Submission',
        message: fullMessage
      });
    } catch (mailErr) {
      console.error('Error sending contact email:', mailErr);
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you for your message! Our support team will get back to you shortly.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

module.exports = router;