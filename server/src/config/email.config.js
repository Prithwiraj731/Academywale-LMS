// Email Configuration for Hostinger SMTP
// Ensure EMAIL_USER and EMAIL_PASSWORD are set in .env

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.EMAIL_PORT, 10) || 465,
  secure: process.env.EMAIL_SECURE !== 'false', // true for 465 (SSL/TLS)
  user: process.env.EMAIL_USER || 'support@academywale.com',
  password: process.env.EMAIL_PASSWORD,
  service: process.env.EMAIL_SERVICE || null, // null so nodemailer uses host/port instead
  from: `"AcademyWale" <${process.env.EMAIL_USER || 'support@academywale.com'}>`,
  to: 'support@academywale.com'
};

module.exports = emailConfig; 