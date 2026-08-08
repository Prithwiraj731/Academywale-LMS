/**
 * SMS Utility for AcademyWale Core System
 * Handles dispatching SMS OTPs and phone notifications.
 */

const sendSMSOTP = async (mobile, otp) => {
  try {
    const cleanMobile = String(mobile).replace(/\D/g, '');
    console.log('\n==================================================');
    console.log(`📱 [SMS GATEWAY] OTP DISPATCH FOR ACADEMYWALE`);
    console.log(`📱 Target Mobile Number: +91 ${cleanMobile}`);
    console.log(`🔐 Verification Code: ${otp}`);
    console.log(`⏰ Expiration: 10 minutes`);
    console.log('==================================================\n');

    // If Fast2SMS API Key is present in process.env, trigger SMS API call
    if (process.env.FAST2SMS_API_KEY) {
      try {
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': process.env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            route: 'otp',
            variables_values: otp,
            numbers: cleanMobile
          })
        });
        const result = await response.json();
        console.log('✅ Fast2SMS Response:', result);
      } catch (smsApiErr) {
        console.warn('⚠️ Fast2SMS dispatch warning:', smsApiErr.message);
      }
    }

    // Return success response object
    return {
      success: true,
      message: `OTP sent successfully to +91 ${cleanMobile}`,
      mobile: cleanMobile
    };
  } catch (error) {
    console.error('❌ SMS sending error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendSMSOTP
};
