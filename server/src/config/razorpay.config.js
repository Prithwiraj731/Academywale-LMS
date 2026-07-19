const Razorpay = require('razorpay');
require('dotenv').config();

// Sanitize keys to strip potential surrounding quotes
const keyId = (process.env.RAZORPAY_KEY_ID || '').trim().replace(/^['"]|['"]$/g, '');
const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim().replace(/^['"]|['"]$/g, '');

if (!keyId || !keySecret) {
  console.warn('⚠️ WARNING: Razorpay Key ID or Key Secret is missing from environment variables.');
}

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret
});

module.exports = {
  razorpay,
  keyId,
  keySecret
};
