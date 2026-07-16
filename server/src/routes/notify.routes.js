const express = require('express');
const router = express.Router();
const { sendAdminNotificationEmail } = require('../utils/email.utils');

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

    // Send email notification to support with beautiful draft in the background
    sendAdminNotificationEmail({
      type: 'interest',
      userDetails,
      courseDetails: {
        courseName,
        mode: selectedMode,
        validity: selectedValidity
      },
      amount: price
    }).catch(error => {
      console.error('Background course interest email notification failed:', error);
    });

    res.status(200).json({ 
      success: true, 
      message: 'Notification initiated successfully' 
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
    const { userDetails, courseDetails, cartItems, transactionId, amount } = req.body;
    
    // Input validation
    if (!userDetails || !amount || !transactionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: userDetails, transactionId, amount' 
      });
    }

    // Send payment email notification to support with beautiful draft
    await sendAdminNotificationEmail({
      type: 'purchase',
      userDetails,
      courseDetails,
      cartItems,
      transactionId,
      amount
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
