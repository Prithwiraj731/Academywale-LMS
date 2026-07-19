// Email Configuration for Hostinger SMTP
// Ensure EMAIL_USER and EMAIL_PASSWORD are set in .env

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Helper to strip surrounding quotes from env variables (common on Render etc.)
const cleanEnvValue = (val) => {
  if (typeof val === 'string') {
    return val.replace(/^["']|["']$/g, '').trim();
  }
  return val;
};

const host = cleanEnvValue(process.env.EMAIL_HOST) || 'smtp.hostinger.com';
const port = parseInt(cleanEnvValue(process.env.EMAIL_PORT), 10) || 465;
const secure = process.env.EMAIL_SECURE !== undefined ? (cleanEnvValue(process.env.EMAIL_SECURE) === 'true') : true;
const user = cleanEnvValue(process.env.EMAIL_USER) || 'support@academywale.com';
const password = cleanEnvValue(process.env.EMAIL_PASSWORD);
const service = cleanEnvValue(process.env.EMAIL_SERVICE) || null;

const emailConfig = {
  host,
  port,
  secure,
  user,
  password,
  service,
  from: `"AcademyWale" <${user}>`,
  to: 'support@academywale.com'
};

module.exports = emailConfig; 