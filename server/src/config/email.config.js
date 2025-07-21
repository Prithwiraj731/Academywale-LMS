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
  user: process.env.EMAIL_USER || 'support@academywale.com',
  password: process.env.EMAIL_PASSWORD,
  service: 'gmail', // Change this for other providers
  from: process.env.EMAIL_USER || 'support@academywale.com',
  to: 'support@academywale.com'
};

module.exports = emailConfig; 