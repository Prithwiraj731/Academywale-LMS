const Razorpay = require('razorpay');
require('dotenv').config();

const getKeyId = () => (
  process.env.RAZORPAY_KEY_ID ||
  process.env.RAZORPAY_API_KEY ||
  process.env.RAZORPAY_KEY ||
  process.env.VITE_RAZORPAY_KEY_ID ||
  process.env.RZP_KEY_ID ||
  ''
).trim().replace(/^['"]|['"]$/g, '');

const getKeySecret = () => (
  process.env.RAZORPAY_KEY_SECRET ||
  process.env.RAZORPAY_API_SECRET ||
  process.env.RAZORPAY_SECRET ||
  process.env.VITE_RAZORPAY_KEY_SECRET ||
  process.env.RZP_KEY_SECRET ||
  ''
).trim().replace(/^['"]|['"]$/g, '');

const getRazorpayInstance = () => {
  const keyId = getKeyId();
  const keySecret = getKeySecret();

  if (!keyId || !keySecret) {
    throw new Error('Razorpay API keys (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are missing from server environment settings.');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
};

module.exports = {
  getRazorpayInstance,
  getKeyId,
  getKeySecret
};
