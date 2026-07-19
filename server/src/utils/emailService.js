const nodemailer = require('nodemailer');
const emailConfig = require('../config/email.config');

// Create transporter for sending emails
const createTransporter = () => {
  // --- Resend HTTP API ---
  if (emailConfig.resendApiKey) {
    return {
      sendMail: async (mailOptions) => {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${emailConfig.resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: emailConfig.resendFrom,
            to: Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to],
            subject: mailOptions.subject,
            html: mailOptions.html || undefined,
            text: mailOptions.text || undefined
          })
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || `Resend API error: ${response.status}`);
        }
        return { messageId: data.id };
      }
    };
  }

  // --- SMTP fallback ---
  if (emailConfig.service) {
    return nodemailer.createTransport({
      service: emailConfig.service,
      auth: { user: emailConfig.user, pass: emailConfig.password },
      connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 10000
    });
  }
  return nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: { user: emailConfig.user, pass: emailConfig.password },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 10000
  });
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
    from: emailConfig.from,
    to: options.to,
    subject: options.subject,
    text: options.text
  };

  if (options.html) {
    mailOptions.html = options.html;
  }

  try {
    const transporter = createTransporter();
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
