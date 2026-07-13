const nodemailer = require('nodemailer');
const emailConfig = require('../config/email.config');

// Create transporter for sending emails
const createTransporter = () => {
  if (emailConfig.service) {
    return nodemailer.createTransport({
      service: emailConfig.service,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.password
      }
    });
  }
  
  return nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.password
    }
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

module.exports = {
  sendContactEmail,
  sendWelcomeEmail,
  sendEnrollmentEmail,
  sendPurchaseInvoiceEmail,
  sendOTPEmail
}; 