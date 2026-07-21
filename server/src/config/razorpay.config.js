const Razorpay = require('razorpay');
require('dotenv').config();

const getKeyId = () => (
  process.env.RAZORPAY_KEY_ID ||
  process.env.RAZORPAY_API_KEY ||
  process.env.VITE_RAZORPAY_KEY_ID ||
  ''
).trim().replace(/^['"]|['"]$/g, '');

const getKeySecret = () => (
  process.env.RAZORPAY_KEY_SECRET ||
  process.env.RAZORPAY_API_SECRET ||
  ''
).trim().replace(/^['"]|['"]$/g, '');

const getRazorpayInstance = () => {
  const key_id = getKeyId();
  const key_secret = getKeySecret();

  if (!key_id || !key_secret) {
    console.warn('⚠️ Razorpay credentials missing in environment variables');
  }

  return new Razorpay({
    key_id,
    key_secret
  });
};

module.exports = {
  getRazorpayInstance,
  getKeyId,
  getKeySecret
};

