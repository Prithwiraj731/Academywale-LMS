/**
 * SMS & OTP Dispatch Utility for AcademyWale Core System
 * Multi-Gateway Support: Fast2SMS (Official OpenAPI /dev/otp/send & /dev/bulkV2), 2Factor, Twilio
 */

const sendSMSOTP = async (mobile, otp) => {
  const cleanMobile = String(mobile).replace(/\D/g, '').trim();
  console.log('\n==================================================');
  console.log(`📱 [SMS GATEWAY] OTP DISPATCH FOR ACADEMYWALE`);
  console.log(`📱 Target Mobile Number: +91 ${cleanMobile}`);
  console.log(`🔐 Verification Code: ${otp}`);
  console.log(`⏰ Expiration: 10 minutes`);
  console.log('==================================================\n');

  let dispatched = false;
  let errors = [];

  const fast2smsKey = process.env.FAST2SMS_API_KEY || process.env.FAST2SMS_KEY;
  const fast2smsOtpId = process.env.FAST2SMS_OTP_ID;

  // 1. Fast2SMS Integration
  if (fast2smsKey) {
    // 1A. Try Official Fast2SMS POST /dev/otp/send API
    try {
      console.log('🚀 Attempting Fast2SMS Official POST /dev/otp/send API...');
      const payload = {
        mobile: cleanMobile,
        otp: String(otp),
        otp_expiry: 10
      };
      if (fast2smsOtpId) {
        payload.otp_id = fast2smsOtpId;
      }

      const postRes = await fetch('https://www.fast2sms.com/dev/otp/send', {
        method: 'POST',
        headers: {
          'Authorization': fast2smsKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const postResult = await postRes.json();
      console.log('✅ Fast2SMS POST /dev/otp/send Result:', postResult);

      if (postResult.return || postResult.status_code === 200) {
        dispatched = true;
      } else {
        errors.push(`Fast2SMS POST: ${postResult.message || JSON.stringify(postResult)}`);
      }
    } catch (postErr) {
      console.warn('⚠️ Fast2SMS POST /dev/otp/send error:', postErr.message);
      errors.push(`Fast2SMS POST Error: ${postErr.message}`);
    }

    // 1B. Fallback: Fast2SMS GET /dev/bulkV2 (route=otp)
    if (!dispatched) {
      try {
        console.log('🚀 Attempting Fast2SMS GET /dev/bulkV2 (route=otp)...');
        const fast2smsUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsKey}&route=otp&variables_values=${otp}&flash=0&numbers=${cleanMobile}`;
        const response = await fetch(fast2smsUrl, { method: 'GET' });
        const result = await response.json();
        console.log('✅ Fast2SMS GET (route=otp) Result:', result);
        
        if (result.return || result.status_code === 200) {
          dispatched = true;
        } else {
          // 1C. Fallback: Fast2SMS GET /dev/bulkV2 (route=q Quick SMS)
          console.log('🚀 Attempting Fast2SMS GET /dev/bulkV2 (route=q Quick SMS)...');
          const qUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsKey}&route=q&message=${encodeURIComponent(`Your AcademyWale verification code is: ${otp}`)}&flash=0&numbers=${cleanMobile}`;
          const qRes = await fetch(qUrl, { method: 'GET' });
          const qResult = await qRes.json();
          console.log('✅ Fast2SMS Quick SMS Result:', qResult);
          if (qResult.return || qResult.status_code === 200) {
            dispatched = true;
          } else {
            errors.push(`Fast2SMS GET: ${result.message || qResult.message || JSON.stringify(result)}`);
          }
        }
      } catch (getErr) {
        console.warn('⚠️ Fast2SMS GET error:', getErr.message);
        errors.push(`Fast2SMS GET Error: ${getErr.message}`);
      }
    }
  }

  // 2. 2Factor.in Integration (popular Indian OTP API)
  const twoFactorKey = process.env.TWO_FACTOR_API_KEY || process.env.TWOFACTOR_API_KEY;
  if (!dispatched && twoFactorKey) {
    try {
      console.log('🚀 Attempting SMS dispatch via 2Factor.in API...');
      const response = await fetch(`https://2factor.in/API/V1/${twoFactorKey}/SMS/${cleanMobile}/${otp}/AUTOGEN`, { method: 'GET' });
      const result = await response.json();
      console.log('✅ 2Factor API Result:', result);
      if (result.Status === 'Success') {
        dispatched = true;
      }
    } catch (err) {
      console.warn('⚠️ 2Factor dispatch error:', err.message);
    }
  }

  // 3. Twilio Integration
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
  if (!dispatched && twilioSid && twilioToken && twilioPhone) {
    try {
      console.log('🚀 Attempting SMS dispatch via Twilio API...');
      const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          To: `+91${cleanMobile}`,
          From: twilioPhone,
          Body: `Your AcademyWale verification OTP is ${otp}. Valid for 10 minutes.`
        }).toString()
      });
      const result = await response.json();
      console.log('✅ Twilio API Result:', result.sid ? 'Success' : result);
      if (result.sid) dispatched = true;
    } catch (err) {
      console.warn('⚠️ Twilio dispatch error:', err.message);
    }
  }

  return {
    success: true,
    dispatched,
    message: `OTP generated for +91 ${cleanMobile}`,
    mobile: cleanMobile,
    errors
  };
};

module.exports = {
  sendSMSOTP
};
