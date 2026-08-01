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
    const { name, fullName, email, phone, phoneNumber, city, subject, message } = req.body;

    const senderName = (name || fullName || 'Website Visitor').trim();
    const senderEmail = (email || 'support@academywale.com').trim();
    const senderPhone = (phone || phoneNumber || '').trim();

    console.log('📬 Contact form submission received:', { senderName, senderEmail, senderPhone, city, subject, message });

    // Validate required name
    if (!senderName) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    let fullMessage = message || '';
    if (city && !fullMessage.includes(`City:`)) {
      fullMessage = `City: ${city}\n\n${fullMessage}`;
    }
    if (senderPhone && !fullMessage.includes(`Phone:`)) {
      fullMessage = `Phone: ${senderPhone}\n${fullMessage}`;
    }

    // 1. Try logging contact submission to Supabase database
    try {
      const { supabaseAdmin } = require('../config/supabase.config');
      await supabaseAdmin
        .from('contact_submissions')
        .insert([{ 
          name: senderName, 
          email: senderEmail, 
          phone: senderPhone,
          subject: subject || 'Request a Call Back', 
          message: fullMessage, 
          created_at: new Date().toISOString() 
        }]);
    } catch (dbError) {
      console.warn('Supabase contact log warning:', dbError.message);
    }

    // 2. Send email via transporter (support@academywale.com & souravkashyap4416@gmail.com)
    const mailResult = await sendContactEmail({
      name: senderName,
      email: senderEmail,
      phone: senderPhone,
      subject: subject || 'Request a Call Back / Contact Inquiry',
      message: fullMessage
    });
    console.log('sendContactEmail result:', mailResult);

    if (!mailResult.success) {
      return res.status(502).json({
        success: false,
        message: 'We could not send your message right now. Please try WhatsApp or call support.',
        error: process.env.NODE_ENV === 'development' ? mailResult.error : undefined
      });
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