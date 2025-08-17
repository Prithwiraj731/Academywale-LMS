const nodemailer = require('nodemailer');

// Mock transporter for development
console.log('⚠️ Using mock email transporter for development');
const transporter = {
  sendMail: (options) => {
    console.log('📧 Mock email sent:', options);
    return Promise.resolve({ messageId: 'mock-id-' + Date.now() });
  }
};

/**
 * Send email notification
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text email content
 * @param {string} [options.html] - HTML email content (optional)
 * @returns {Promise} - Email sending result
 */
const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'AcademyWale <support@academywale.com>',
    to: options.to,
    subject: options.subject,
    text: options.text
  };

  if (options.html) {
    mailOptions.html = options.html;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail
};
