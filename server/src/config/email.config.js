// Email Configuration
// To use this email system, you need to:

// 1. Create a .env file in the root directory with:
// EMAIL_USER=support@academywale.com
// EMAIL_PASSWORD=your_email_app_password_here

// 2. For Gmail, you need to:
//    - Enable 2-factor authentication
//    - Generate an App Password (not your regular password)
//    - Use that App Password in EMAIL_PASSWORD

// 3. For other email providers, update the service in email.utils.js

const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.EMAIL_PORT, 10) || 465,
  secure: process.env.EMAIL_SECURE !== 'false', // true for 465 (SSL/TLS), false for others
  user: process.env.EMAIL_USER || 'support@academywale.com',
  password: process.env.EMAIL_PASSWORD,
  service: process.env.EMAIL_SERVICE || '', // Use Gmail if service is explicitly 'gmail'
  from: process.env.EMAIL_USER || 'support@academywale.com',
  to: 'support@academywale.com'
};

module.exports = emailConfig; 