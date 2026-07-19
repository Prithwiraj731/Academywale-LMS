const nodemailer = require('nodemailer');
const emailConfig = require('../config/email.config');

// Create transporter for sending emails
const createTransporter = () => {
  console.log('Creating email transporter with config:', {
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    user: emailConfig.user,
    passwordSet: !!emailConfig.password,
    service: emailConfig.service,
    from: emailConfig.from
  });

  if (emailConfig.service) {
    return nodemailer.createTransport({
      service: emailConfig.service,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.password
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });
  }
  
  return nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.password
    },
    tls: {
      rejectUnauthorized: false // Required for some Hostinger SMTP setups
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  });
};

// Send contact form email
const sendContactEmail = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: emailConfig.from,
      to: emailConfig.to,
      subject: `New Contact Form Submission - ${contactData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Subject:</strong> ${contactData.subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
              ${contactData.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This email was sent from the AcademyWale contact form.
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email to new users
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: emailConfig.from,
      to: userEmail,
      subject: 'Welcome to AcademyWale!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to AcademyWale!</h2>
          <p>Dear ${userName},</p>
          <p>Thank you for joining AcademyWale! We're excited to have you as part of our learning community.</p>
          <p>You can now:</p>
          <ul>
            <li>Browse our courses</li>
            <li>Learn from expert faculty</li>
            <li>Track your progress</li>
            <li>Get support when needed</li>
          </ul>
          <p>If you have any questions, feel free to contact us at support@academywale.com</p>
          <p>Best regards,<br>The AcademyWale Team</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Welcome email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send course enrollment confirmation
const sendEnrollmentEmail = async (userEmail, userName, courseName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: emailConfig.from,
      to: userEmail,
      subject: `Enrollment Confirmation - ${courseName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Enrollment Confirmation</h2>
          <p>Dear ${userName},</p>
          <p>Your enrollment in <strong>${courseName}</strong> has been confirmed!</p>
          <p>You can now access your course materials and start learning.</p>
          <p>If you have any questions about the course, please contact us at support@academywale.com</p>
          <p>Happy learning!<br>The AcademyWale Team</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Enrollment email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send purchase invoice email
const sendPurchaseInvoiceEmail = async (userEmail, userName, course, transactionId, purchaseDate, amount) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: emailConfig.from,
      to: userEmail,
      subject: `Invoice for Your Course Purchase - ${course.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">AcademyWale - Course Purchase Invoice</h2>
          <p>Dear ${userName},</p>
          <p>Thank you for your purchase! Here are your invoice details:</p>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>Course:</strong> ${course.subject}</p>
            <p><strong>Faculty:</strong> ${course.facultyName}</p>
            <p><strong>Amount Paid:</strong> ₹${amount}</p>
            <p><strong>Transaction ID:</strong> ${transactionId}</p>
            <p><strong>Purchase Date:</strong> ${new Date(purchaseDate).toLocaleString()}</p>
          </div>
          <p>You now have access to your course. If you have any questions, contact us at <a href="mailto:support@academywale.com">support@academywale.com</a>.</p>
          <p>Best regards,<br>The AcademyWale Team</p>
        </div>
      `
    };
    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Invoice email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send OTP email for registration verification
const sendOTPEmail = async (userEmail, userName, otp) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: emailConfig.from,
      to: userEmail,
      subject: `${otp} is your AcademyWale Verification Code`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0d9488; text-align: center; font-weight: bold;">AcademyWale Verification</h2>
          <p>Dear ${userName},</p>
          <p>Thank you for signing up with AcademyWale. Please use the following One-Time Password (OTP) to verify your email address and activate your account:</p>
          <div style="background-color: #f0fdfa; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0d9488;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">This code is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #64748b; font-size: 12px; text-align: center;">
            Best regards,<br /><strong>The AcademyWale Team</strong><br />
            <a href="mailto:support@academywale.com" style="color: #0d9488;">support@academywale.com</a>
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('OTP email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send OTP email for password reset
const sendPasswordResetOTPEmail = async (userEmail, userName, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: emailConfig.from,
      to: userEmail,
      subject: `${otp} is your AcademyWale Password Reset Code`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0d9488; text-align: center; font-weight: bold;">AcademyWale Password Reset</h2>
          <p>Dear ${userName || 'AcademyWale User'},</p>
          <p>Use the following One-Time Password (OTP) to reset your AcademyWale account password:</p>
          <div style="background-color: #f0fdfa; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0d9488;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">This code is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #64748b; font-size: 12px; text-align: center;">
            Best regards,<br /><strong>The AcademyWale Team</strong><br />
            <a href="mailto:support@academywale.com" style="color: #0d9488;">support@academywale.com</a>
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Password reset OTP email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send beautiful HTML notification email to admin
const sendAdminNotificationEmail = async ({ type, userDetails, courseDetails, cartItems, transactionId, amount }) => {
  try {
    const transporter = createTransporter();
    
    const isPrePayment = type === 'interest';
    const subject = isPrePayment 
      ? `[Checkout Initiated] User Profile & Address Verification - AcademyWale`
      : `[Payment Submitted] New UPI Purchase Pending Verification - AcademyWale`;
      
    // Format Address
    const address = userDetails?.address;
    const addressHtml = address 
      ? `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 35%; font-size: 14px;"><strong>Street Address:</strong></td>
            <td style="padding: 6px 0; color: #1e293b; font-size: 14px;">${address.street}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;"><strong>City:</strong></td>
            <td style="padding: 6px 0; color: #1e293b; font-size: 14px;">${address.city}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;"><strong>State:</strong></td>
            <td style="padding: 6px 0; color: #1e293b; font-size: 14px;">${address.state}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;"><strong>Pin Code:</strong></td>
            <td style="padding: 6px 0; color: #1e293b; font-size: 14px;">${address.pinCode}</td>
          </tr>
        </table>
      `
      : `<p style="color: #ef4444; font-size: 14px;">No shipping address selected.</p>`;

    // Format Course Items Summary
    let itemsHtml = '';
    if (cartItems && cartItems.length > 0) {
      itemsHtml = cartItems.map((item, idx) => `
        <div style="padding: 12px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px;">
          <h4 style="margin: 0 0 5px 0; color: #0f766e; font-size: 15px;">${idx + 1}. ${item.title || item.subject}</h4>
          <p style="margin: 0; font-size: 12px; color: #64748b;">
            <strong>Mode:</strong> ${item.mode || 'Standard'} | 
            <strong>Validity:</strong> ${item.validity || 'Standard'} | 
            <strong>Faculty:</strong> ${item.facultyName || 'N/A'}
          </p>
          <p style="margin: 5px 0 0 0; font-size: 13px; color: #1e293b; font-weight: bold;">
            Price: ₹${item.price}
          </p>
        </div>
      `).join('');
    } else {
      const courseName = courseDetails?.courseName || 'LMS Course';
      itemsHtml = `
        <div style="padding: 12px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h4 style="margin: 0 0 5px 0; color: #0f766e; font-size: 15px;">${courseName}</h4>
          <p style="margin: 0; font-size: 12px; color: #64748b;">
            <strong>Mode:</strong> ${courseDetails?.mode || 'Standard'} | 
            <strong>Validity:</strong> ${courseDetails?.validity || 'Standard'} ${courseDetails?.attempt ? `| <strong>Exam Term:</strong> ${courseDetails.attempt}` : ''}
          </p>
          <p style="margin: 5px 0 0 0; font-size: 13px; color: #1e293b; font-weight: bold;">
            Price: ₹${amount}
          </p>
        </div>
      `;
    }

    // Format Payment Details
    const paymentHtml = isPrePayment
      ? `
        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
          <h4 style="margin: 0 0 5px 0; color: #1e3a8a; font-size: 14px;">Pre-Payment Check</h4>
          <p style="margin: 0; font-size: 13px; color: #1e40af;">
            User has filled out details and has been redirected to the payment gateway.
          </p>
        </div>
      `
      : `
        <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
          <h4 style="margin: 0 0 5px 0; color: #14532d; font-size: 14px;">Payment Verification Required</h4>
          <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
            <tr>
              <td style="padding: 4px 0; color: #14532d; font-size: 13px; width: 35%;"><strong>Transaction ID/UTR:</strong></td>
              <td style="padding: 4px 0; color: #14532d; font-size: 13px; font-weight: bold;">${transactionId}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #14532d; font-size: 13px;"><strong>Amount Paid:</strong></td>
              <td style="padding: 4px 0; color: #14532d; font-size: 13px; font-weight: bold;">₹${amount}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #14532d; font-size: 13px;"><strong>Payment Mode:</strong></td>
              <td style="padding: 4px 0; color: #14532d; font-size: 13px;">UPI (Scan/Mobile)</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #14532d; font-size: 13px;"><strong>Submitted At:</strong></td>
              <td style="padding: 4px 0; color: #14532d; font-size: 13px;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
            </tr>
          </table>
        </div>
      `;

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 30px 15px; color: #334155;">
        <div style="max-width: 600px; margin: 0 auto; bg-color: #ffffff; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05); border-top: 6px solid #0d9488;">
          
          <!-- Header Banner -->
          <div style="padding: 30px 20px; text-align: center; background-color: #f0fdfa;">
            <h2 style="margin: 0; color: #0d9488; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">AcademyWale Admin Notification</h2>
            <p style="margin: 8px 0 0 0; color: #0f766e; font-size: 14px; font-weight: 600;">
              ${isPrePayment ? '🛒 CHECKOUT INTEREST SUBMITTED' : '💰 UPI PAYMENT TO VERIFY'}
            </p>
          </div>
          
          <div style="padding: 25px 30px;">
            
            <!-- Section 1: Personal Details -->
            <h3 style="color: #0d9488; font-size: 16px; border-bottom: 2px solid #f0fdfa; padding-bottom: 6px; margin-top: 0; margin-bottom: 12px;">
              Personal Details
            </h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 35%; font-size: 14px;"><strong>Name:</strong></td>
                <td style="padding: 6px 0; color: #1e293b; font-size: 14px;">${userDetails?.fullName || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-size: 14px;"><strong>Email:</strong></td>
                <td style="padding: 6px 0; color: #1e293b; font-size: 14px;">
                  <a href="mailto:${userDetails?.email}" style="color: #0d9488; text-decoration: none;">${userDetails?.email || 'Not provided'}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-size: 14px;"><strong>Phone:</strong></td>
                <td style="padding: 6px 0; color: #1e293b; font-size: 14px;">${userDetails?.phone || 'Not provided'}</td>
              </tr>
            </table>

            <!-- Section 2: Address Details -->
            <h3 style="color: #0d9488; font-size: 16px; border-bottom: 2px solid #f0fdfa; padding-bottom: 6px; margin-bottom: 12px;">
              Billing & Shipping Address
            </h3>
            ${addressHtml}

            <!-- Section 3: Order Summary -->
            <h3 style="color: #0d9488; font-size: 16px; border-bottom: 2px solid #f0fdfa; padding-bottom: 6px; margin-bottom: 12px;">
              Order Summary
            </h3>
            <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
              ${itemsHtml}
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 15px; border-top: 1px dashed #e2e8f0; font-weight: bold; font-size: 15px; color: #0f766e;">
                <span>Total Amount:</span>
                <span>₹${amount}</span>
              </div>
            </div>

            <!-- Section 4: Payment Details & CTA -->
            ${paymentHtml}
            
            ${!isPrePayment ? `
              <div style="text-align: center; margin-top: 25px; margin-bottom: 10px;">
                <a href="https://academywale.com/admin/dashboard" style="display: inline-block; background-color: #0d9488; color: #ffffff; font-weight: bold; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(13, 148, 136, 0.2);">
                  Open Admin Dashboard to Verify
                </a>
              </div>
            ` : ''}

          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8;">
            This notification was automatically sent by the AcademyWale LMS core system.<br/>
            &copy; 2026 AcademyWale. All rights reserved.
          </div>
          
        </div>
      </div>
    `;

    const mailOptions = {
      from: emailConfig.from,
      to: 'support@academywale.com',
      subject: subject,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Admin notification email sending error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendContactEmail,
  sendWelcomeEmail,
  sendEnrollmentEmail,
  sendPurchaseInvoiceEmail,
  sendOTPEmail,
  sendPasswordResetOTPEmail,
  sendAdminNotificationEmail
}; 
