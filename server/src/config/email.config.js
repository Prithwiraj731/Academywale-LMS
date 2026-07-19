// Email Configuration
// Supports Resend HTTP API (for cloud hosting like Render) and SMTP fallback (local dev)

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Helper to strip surrounding quotes from env variables
const cleanEnvValue = (val) => {
  if (typeof val === 'string') {
    return val.replace(/^["']|["']$/g, '').trim();
  }
  return val;
};

const resendApiKey = cleanEnvValue(process.env.RESEND_API_KEY) || null;

// SMTP settings (fallback for local development)
const host = cleanEnvValue(process.env.EMAIL_HOST) || 'smtp.hostinger.com';
const port = parseInt(cleanEnvValue(process.env.EMAIL_PORT), 10) || 465;
const secure = process.env.EMAIL_SECURE !== undefined ? (cleanEnvValue(process.env.EMAIL_SECURE) === 'true') : true;
const user = cleanEnvValue(process.env.EMAIL_USER) || 'support@academywale.com';
const password = cleanEnvValue(process.env.EMAIL_PASSWORD) || cleanEnvValue(process.env.EMAIL_PASS) || null;
const service = cleanEnvValue(process.env.EMAIL_SERVICE) || null;

// Resend "from" address (use verified domain or default Resend sender)
const resendFrom = cleanEnvValue(process.env.RESEND_FROM) || 'AcademyWale <onboarding@resend.dev>';

const emailConfig = {
  resendApiKey,
  resendFrom,
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