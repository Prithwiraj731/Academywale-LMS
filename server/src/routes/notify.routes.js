const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/emailService');

/**
 * Send course interest notification email
 * @route POST /api/notify/course-interest
 * @access Public
 */
router.post('/course-interest', async (req, res) => {
  try {
    const { courseName, courseId, userDetails, selectedMode, selectedValidity, price } = req.body;
    
    // Input validation
    if (!courseName || !userDetails) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Format email content
    const emailContent = `
      New Course Interest:
      
      Course: ${courseName} (ID: ${courseId})
      Mode: ${selectedMode || 'Not specified'}
      Validity: ${selectedValidity || 'Not specified'}
      Price: ₹${price || 'Not specified'}
      
      User Details:
      Name: ${userDetails.fullName || 'Not provided'}
      Email: ${userDetails.email || 'Not provided'}
      Phone: ${userDetails.phone || 'Not provided'}
      
      This user has shown interest in purchasing the course and is proceeding to payment.
    `;

    // Send email notification to support
    await sendEmail({
      to: 'support@academywale.com',
      subject: 'New Course Interest - AcademyWale',
      text: emailContent
    });

    res.status(200).json({ 
      success: true, 
      message: 'Notification sent successfully' 
    });
    
  } catch (error) {
    console.error('Course interest notification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send notification' 
    });
  }
});

/**
 * Send payment notification email
 * @route POST /api/notify/payment
 * @access Public
 */
router.post('/payment', async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    
    // Input validation
    if (!to || !subject || !text) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: to, subject, text' 
      });
    }

    // Send email notification
    await sendEmail({
      to,
      subject,
      text
    });

    res.status(200).json({ 
      success: true, 
      message: 'Payment notification sent successfully' 
    });
    
  } catch (error) {
    console.error('Payment notification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send payment notification' 
    });
  }
});

module.exports = router;
