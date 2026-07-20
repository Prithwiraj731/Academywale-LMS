const Razorpay = require('razorpay');
require('dotenv').config();

const DEFAULT_RAZORPAY_KEY_ID = 'rzp_test_TFRCtEZm0mJt7l';
const DEFAULT_RAZORPAY_KEY_SECRET = 'PAd1Tup4phZO0Ii6y4WKiXb0';

const getKeyId = () => (
  process.env.RAZORPAY_KEY_ID ||
  process.env.RAZORPAY_API_KEY ||
  process.env.RAZORPAY_KEY ||
  process.env.VITE_RAZORPAY_KEY_ID ||
  process.env.RZP_KEY_ID ||
  DEFAULT_RAZORPAY_KEY_ID
).trim().replace(/^['"]|['"]$/g, '');

const getKeySecret = () => (
  process.env.RAZORPAY_KEY_SECRET ||
  process.env.RAZORPAY_API_SECRET ||
  process.env.RAZORPAY_SECRET ||
  process.env.VITE_RAZORPAY_KEY_SECRET ||
  process.env.RZP_KEY_SECRET ||
  DEFAULT_RAZORPAY_KEY_SECRET
).trim().replace(/^['"]|['"]$/g, '');

const getRazorpayInstance = () => {
  const keyId = getKeyId();
  const keySecret = getKeySecret();

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
