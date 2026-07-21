const Razorpay = require('razorpay');
require('dotenv').config();

// Live Razorpay credentials
const RAZORPAY_KEY_ID = (process.env.RAZORPAY_KEY_ID || 'rzp_live_TG5aLJKK3oiyxV').trim().replace(/^['"]|['"]$/g, '');
const RAZORPAY_KEY_SECRET = (process.env.RAZORPAY_KEY_SECRET || '6wp93bM8XpozI44f4ra4F0fC').trim().replace(/^['"]|['"]$/g, '');

const getKeyId = () => RAZORPAY_KEY_ID;
const getKeySecret = () => RAZORPAY_KEY_SECRET;

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  });
};

module.exports = {
  getRazorpayInstance,
  getKeyId,
  getKeySecret
};
