const nodemailer = require('nodemailer');
const emailConfig = require('../config/email.config');

const getAdminRecipients = () => {
  const base = ['support@academywale.com', 'academywale01@gmail.com', 'prithwi1016@gmail.com'];
  if (Array.isArray(emailConfig.adminEmails)) {
    emailConfig.adminEmails.forEach(e => {
      if (e && !base.includes(e)) base.push(e);
    });
  }
  return base;
};

const getConfiguredProviders = () => {
  const providers = [];
  if (emailConfig.resendApiKey) providers.push('Resend');
  if (emailConfig.host && emailConfig.user && emailConfig.password) providers.push('SMTP');
  return providers;
};

const sendViaSmtp = async (mailOptions) => {
  console.log('Attempting email delivery via Hostinger SMTP...');
  const smtpTransport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.password
    },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000
  });

  const toAddress = Array.isArray(mailOptions.to) ? mailOptions.to.join(', ') : mailOptions.to;
  const result = await smtpTransport.sendMail({
    ...mailOptions,
    to: toAddress
  });

  console.log('Email sent via Hostinger SMTP:', result.messageId);
  return result;
};

const sendToRecipientsIndividually = async (transporter, recipients, mailOptions) => {
  const successful = [];
  const failed = [];

  for (const recipient of recipients) {
    try {
      const result = await transporter.sendMail({
        ...mailOptions,
        to: recipient
      });
      successful.push({ email: recipient, messageId: result.messageId });
    } catch (error) {
      failed.push({ email: recipient, error: error.message });
    }
  }

  return { successful, failed };
};

// Create transporter for sending emails
// Tries Resend HTTP API first (for cloud hosting) and falls back to Hostinger SMTP
const createTransporter = () => {
  return {
    sendMail: async (mailOptions) => {
      let errors = [];

      // 1. Try Resend HTTP API if configured
      if (emailConfig.resendApiKey) {
        try {
          console.log('📧 Attempting email delivery via Resend HTTP API...');
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${emailConfig.resendApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: emailConfig.resendFrom || `AcademyWale <${emailConfig.user}>`,
              to: Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to],
              subject: mailOptions.subject,
              html: mailOptions.html || undefined,
              text: mailOptions.text || undefined
            })
          });

          const data = await response.json();
          if (response.ok) {
            console.log('✅ Email sent via Resend:', data.id);
            return { messageId: data.id };
          }
          console.warn('⚠️ Resend API warning:', data);
          errors.push(`Resend: ${data.message || response.statusText}`);
        } catch (err) {
          console.warn('⚠️ Resend fetch error:', err.message);
          errors.push(`Resend: ${err.message}`);
        }
      }

      // 2. Try Hostinger SMTP
      if (emailConfig.host && emailConfig.user && emailConfig.password) {
        try {
          return await sendViaSmtp(mailOptions);
        } catch (err) {
          console.warn('SMTP delivery error:', err.message);
          errors.push(`SMTP: ${err.message}`);
        }
      } else {
        errors.push('SMTP: missing EMAIL_HOST, EMAIL_USER, or EMAIL_PASSWORD/EMAIL_PASS');
      }

      const configuredProviders = getConfiguredProviders();
      const providerLabel = configuredProviders.length ? configuredProviders.join(', ') : 'none';
      throw new Error(`All email providers failed. Configured providers: ${providerLabel}. ${errors.join(' | ')}`);
    }
  };
};

// Send contact form email
const sendContactEmail = async (contactData) => {
  try {
    const transporter = createTransporter();
    const adminRecipients = getAdminRecipients();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #0d9488, #0f766e); padding: 24px 30px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">📩 New Contact / Call Back Inquiry</h2>
          <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">AcademyWale LMS Portal</p>
        </div>

        <div style="padding: 30px 25px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr>
              <td style="padding: 10px 12px; font-weight: bold; color: #475569; width: 140px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">Full Name:</td>
              <td style="padding: 10px 12px; color: #0f172a; font-weight: bold; border-bottom: 1px solid #e2e8f0;">${contactData.name || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; font-weight: bold; color: #475569; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">Email Address:</td>
              <td style="padding: 10px 12px; color: #0f172a; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${contactData.email}" style="color: #0d9488; font-weight: bold;">${contactData.email || 'Not provided'}</a></td>
            </tr>
            ${contactData.phone ? `
            <tr>
              <td style="padding: 10px 12px; font-weight: bold; color: #475569; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">Phone Number:</td>
              <td style="padding: 10px 12px; color: #0d9488; font-weight: bold; font-size: 15px; border-bottom: 1px solid #e2e8f0;"><a href="tel:${contactData.phone}" style="color: #0d9488;">+91 ${contactData.phone}</a></td>
            </tr>` : ''}
            <tr>
              <td style="padding: 10px 12px; font-weight: bold; color: #475569; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">Subject / Type:</td>
              <td style="padding: 10px 12px; color: #334155; font-weight: bold; border-bottom: 1px solid #e2e8f0;">${contactData.subject || 'General Inquiry'}</td>
            </tr>
          </table>

          <div style="background-color: #f1f5f9; border-left: 4px solid #0d9488; padding: 18px; border-radius: 6px; margin-top: 15px;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #334155; font-size: 13px; uppercase; letter-spacing: 0.5px;">Message / Inquiry Details:</p>
            <div style="color: #1e293b; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${contactData.message ? contactData.message.replace(/\n/g, '<br>') : 'No additional details provided.'}</div>
          </div>
        </div>

        <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 25px; text-align: center; font-size: 12px; color: #64748b;">
          <p style="margin: 0;">This email was automatically dispatched to AcademyWale admins (<strong>support@academywale.com</strong> &amp; <strong>academywale01@gmail.com</strong>).</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: emailConfig.from,
      replyTo: contactData.email || emailConfig.from,
      subject: `Contact Form Submission - ${contactData.name} (${contactData.subject || 'Inquiry'})`,
      text: [
        'New contact / call back inquiry',
        `Name: ${contactData.name || 'Not provided'}`,
        `Email: ${contactData.email || 'Not provided'}`,
        `Phone: ${contactData.phone || 'Not provided'}`,
        `Subject: ${contactData.subject || 'General Inquiry'}`,
        '',
        contactData.message || 'No additional details provided.'
      ].join('\n'),
      html: htmlContent
    };

    const result = await sendToRecipientsIndividually(transporter, adminRecipients, mailOptions);
    console.log('Contact email recipient results:', result);

    if (result.successful.length === 0) {
      return {
        success: false,
        error: result.failed.map(item => `${item.email}: ${item.error}`).join(' | ')
      };
    }

    return {
      success: true,
      messageId: result.successful.map(item => item.messageId).join(', '),
      deliveredTo: result.successful.map(item => item.email),
      failedRecipients: result.failed
    };
  } catch (error) {
    console.error('Email sending error in sendContactEmail:', error);
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

// Send manual/offline enrollment confirmation with account access guidance
const sendManualEnrollmentEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const userEmail = options.userEmail || options.email;
    const userName = options.userName || options.name || 'Valued Student';
    const details = options.courseDetails || {};
    const transactionId = options.transactionId || options.paymentReference || 'N/A';
    const amount = Number(options.amount !== undefined ? options.amount : (details.amountPaid || details.sellingPrice || 0));
    const paymentMethod = options.paymentMethod || 'offline';
    const userDetails = options.userDetails || {};

    const formattedDate = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const title = details.title || details.subject || 'Course Package';
    const mode = details.mode || 'Recorded Video';
    const validity = details.validity || details.attempt || 'Standard';
    const faculty = details.facultyName || 'AcademyWale Faculty';
    const attempt = details.attempt || '';
    const noOfLecture = details.noOfLecture || details.no_of_lecture || '';
    const books = details.books || '';
    const videoLanguage = details.videoLanguage || details.video_language || '';
    const videoRunOn = details.videoRunOn || details.video_run_on || '';
    const doubtSolving = details.doubtSolving || details.doubt_solving || '';
    const supportMail = details.supportMail || details.support_mail || '';
    const supportCall = details.supportCall || details.support_call || '';
    const institute = details.institute || details.instituteName || details.institute_name || '';

    const detailLines = [];
    if (Array.isArray(details.customOptions) && details.customOptions.length > 0) {
      details.customOptions.forEach(opt => {
        const lbl = String(opt.label || opt.name || '').trim();
        const val = String(opt.value || '').trim();
        if (lbl && val) {
          detailLines.push(`${lbl}: <strong>${val}</strong>`);
        } else if (val) {
          detailLines.push(val);
        }
      });
    } else {
      if (mode) detailLines.push(`Mode: <strong>${mode}</strong>`);
      if (validity) detailLines.push(`Validity / Attempt: <strong>${validity}</strong>`);
      if (faculty) detailLines.push(`Faculty: <strong>${faculty}</strong>`);
      if (attempt && attempt !== validity) detailLines.push(`Attempt: <strong>${attempt}</strong>`);
      if (institute && institute !== 'N/A') detailLines.push(`Institute: <strong>${institute}</strong>`);
      if (noOfLecture) detailLines.push(`Lectures: <strong>${noOfLecture}</strong>`);
      if (books) detailLines.push(`Material: <strong>${books}</strong>`);
      if (videoLanguage) detailLines.push(`Language: <strong>${videoLanguage}</strong>`);
      if (videoRunOn) detailLines.push(`Run On: <strong>${videoRunOn}</strong>`);
      if (doubtSolving) detailLines.push(`Doubts: <strong>${doubtSolving}</strong>`);
    }
    if (supportMail || supportCall) {
      const supportInfo = [supportMail, supportCall].filter(Boolean).join(' / ');
      detailLines.push(`Support: <strong>${supportInfo}</strong>`);
    }

    const detailHtml = detailLines.map(line => `<div style="margin-top: 3px; font-size: 12px; color: #475569; font-weight: 500;">${line}</div>`).join('');

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; padding: 35px 15px; color: #334155;">
        <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 32px 25px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">AcademyWale</h1>
            <p style="margin: 6px 0 0 0; font-size: 12px; opacity: 0.95; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
              Official Tax Invoice & Course Payment Receipt
            </p>
          </div>

          <!-- Status Bar -->
          <div style="background-color: #f0fdfa; border-bottom: 1px solid #ccfbf1; padding: 14px 25px; font-size: 13px; color: #0f766e;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span><strong>STATUS:</strong> <span style="color: #16a34a; font-weight: 800;">VERIFIED & CONFIRMED</span></span>
              <span><strong>Transaction ID:</strong> ${transactionId}</span>
            </div>
          </div>

          <!-- Body Content -->
          <div style="padding: 28px 25px;">
            <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-top: 0; margin-bottom: 10px;">
              Dear <strong>${userName}</strong>,
            </p>
            <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 10px;">
              Your payment has been recorded and your course enrollment is now active. 🎉
            </p>
            <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 22px;">
              Your course details are provided below. You can access your enrolled courses anytime by logging into your Student Dashboard.
            </p>

            <!-- Metadata Box -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 25px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="padding: 4px 0; color: #64748b;"><strong>Transaction / Reference:</strong></td>
                  <td style="padding: 4px 0; color: #0d9488; text-align: right; font-weight: 700; font-family: monospace;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;"><strong>Receipt Date:</strong></td>
                  <td style="padding: 4px 0; color: #1e293b; text-align: right; font-weight: 600;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;"><strong>Payment Method:</strong></td>
                  <td style="padding: 4px 0; color: #1e293b; text-align: right; font-weight: 600;">${paymentMethod}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;"><strong>Registered Email:</strong></td>
                  <td style="padding: 4px 0; color: #1e293b; text-align: right; font-weight: 600;">${userEmail}</td>
                </tr>
                ${(userDetails.phone || options.userPhone || options.phone) ? `
                  <tr>
                    <td style="padding: 4px 0; color: #64748b;"><strong>Mobile Number:</strong></td>
                    <td style="padding: 4px 0; color: #1e293b; text-align: right; font-weight: 600;">${userDetails.phone || options.userPhone || options.phone}</td>
                  </tr>
                ` : ''}
              </table>
            </div>

            <!-- Items Purchased Table -->
            <h3 style="font-size: 15px; font-weight: 800; color: #0f766e; margin-bottom: 10px; margin-top: 0;">
              Enrolled Courses
            </h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 22px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background-color: #f8fafc; text-align: left; font-size: 12px; color: #64748b; text-transform: uppercase;">
                  <th style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">Description</th>
                  <th style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 14px 12px; font-size: 14px; color: #1e293b; line-height: 1.5;">
                    <strong style="color: #0f766e; font-size: 15px;">1. ${title}</strong><br/>
                    ${detailHtml}
                  </td>
                  <td style="padding: 14px 12px; font-size: 14px; color: #1e293b; text-align: right; font-weight: bold; vertical-align: top;">
                    INR ${Number(details.sellingPrice || details.selling_price || details.originalPrice || details.original_price || details.costPrice || details.cost_price || details.price || options.sellingPrice || amount).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Summary Total Box -->
            <div style="background-color: #f0fdfa; border: 1px solid #99f6e4; border-radius: 12px; padding: 16px; margin-bottom: 25px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 16px; font-weight: 800; color: #0f766e;">Amount Paid:</td>
                  <td style="padding: 6px 0; font-size: 20px; font-weight: 900; color: #0d9488; text-align: right;">
                    INR ${amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </table>
            </div>

          </div>

          <!-- Footer -->
          <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 25px; text-align: center; font-size: 12px; color: #64748b;">
            <p style="margin: 0 0 4px 0; font-weight: bold; color: #334155;">AcademyWale Learning Management System</p>
            <p style="margin: 0;">Need help? Contact <a href="mailto:support@academywale.com" style="color: #0d9488; text-decoration: none; font-weight: bold;">support@academywale.com</a> or call <strong>+91 9693320108</strong>.</p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: emailConfig.from,
      to: Array.from(new Set([userEmail, ...getAdminRecipients()])).filter(Boolean),
      subject: `Course Enrollment Confirmed - ${details.title || details.subject || 'AcademyWale'}`,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Manual enrollment email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send purchase invoice email (Professional HTML Receipt)
const sendPurchaseInvoiceEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    // Normalize parameters
    let userEmail = options.userEmail || options.email;
    let userName = options.userName || options.name || 'Valued Student';
    let purchases = options.purchases || options.courses || [];
    let transactionId = options.transactionId || options.transaction_id || 'N/A';
    let amount = options.amount || 0;
    let paymentMethod = options.paymentMethod || 'Razorpay Online';
    let couponCode = options.couponCode || options.coupon || '';
    let discountPercent = options.discountPercent || 0;
    let userDetails = options.userDetails || {};

    if (!Array.isArray(purchases)) {
      purchases = [purchases];
    }

    const formattedDate = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const itemsTableRowsHtml = purchases.map((item, idx) => {
      const details = item.course_details || item;
      const title = details.title || details.subject || 'Course Package';
      const mode = details.mode || 'Standard';
      const validity = details.validity || 'Standard';
      const faculty = details.facultyName || 'AcademyWale Mentor';
      const attempt = details.attempt || '';
      const noOfLecture = details.noOfLecture || details.no_of_lecture || '';
      const books = details.books || '';
      const videoLanguage = details.videoLanguage || details.video_language || '';
      if (books) detailString += ` | Material: <strong>${books}</strong>`;
      if (videoLanguage) detailString += ` | Language: <strong>${videoLanguage}</strong>`;
      if (videoRunOn) detailString += ` | Run On: <strong>${videoRunOn}</strong>`;
      if (doubtSolving) detailString += ` | Doubts: <strong>${doubtSolving}</strong>`;
      if (supportMail || supportCall) {
        const supportInfo = [supportMail, supportCall].filter(Boolean).join(' / ');
        detailString += ` | Support: <strong>${supportInfo}</strong>`;
      }

      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 14px 12px; font-size: 14px; color: #1e293b; line-height: 1.5;">
            <strong style="color: #0f766e; font-size: 15px;">${idx + 1}. ${title}</strong><br/>
            <span style="font-size: 12px; color: #64748b; font-weight: 500;">
              ${detailString}
            </span>
          </td>
          <td style="padding: 14px 12px; font-size: 14px; color: #1e293b; text-align: right; font-weight: bold; vertical-align: top;">
            ₹${Number(actualCoursePrice).toLocaleString('en-IN')}
          </td>
        </tr>
      `;
    }).join('');

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; padding: 35px 15px; color: #334155;">
        <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 32px 25px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">AcademyWale</h1>
            <p style="margin: 6px 0 0 0; font-size: 12px; opacity: 0.95; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
              Official Tax Invoice & Course Payment Receipt
            </p>
          </div>

          <!-- Status Bar -->
          <div style="background-color: #f0fdfa; border-bottom: 1px solid #ccfbf1; padding: 14px 25px; font-size: 13px; color: #0f766e;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span><strong>STATUS:</strong> <span style="color: #16a34a; font-weight: 800;">VERIFIED & PAID</span></span>
              <span><strong>Transaction ID:</strong> ${transactionId}</span>
            </div>
          </div>

          <!-- Body Content -->
          <div style="padding: 28px 25px;">
              Dear <strong>${userName}</strong>,
            </p>
            <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 10px;">
              Thank you for purchasing from <strong>AcademyWale</strong>! 🎉
            </p>
            <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 10px;">
              Your payment has been successfully confirmed.
            </p>
            <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 10px;">
              Your course will be dispatched to your registered email address within 24–48 hours. You can access your course details from your Student Dashboard.
            </p>
            <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 22px;">
              If you have any questions or need assistance, please feel free to contact our support team.
            </p>

            <!-- Metadata Box -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 25px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="padding: 4px 0; color: #64748b;"><strong>Order ID:</strong></td>
                  <td style="padding: 4px 0; color: #0d9488; text-align: right; font-weight: 700; font-family: monospace;">${transactionId} (₹${Number(amount).toLocaleString('en-IN')})</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;"><strong>Receipt Date:</strong></td>
                  <td style="padding: 4px 0; color: #1e293b; text-align: right; font-weight: 600;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;"><strong>Payment Mode:</strong></td>
                  <td style="padding: 4px 0; color: #1e293b; text-align: right; font-weight: 600;">${paymentMethod}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;"><strong>Registered Email:</strong></td>
                  <td style="padding: 4px 0; color: #1e293b; text-align: right; font-weight: 600;">${userEmail}</td>
                </tr>
                ${(userDetails.phone || options.userPhone || options.phone) ? `
                  <tr>
                    <td style="padding: 4px 0; color: #64748b;"><strong>Mobile Number:</strong></td>
                    <td style="padding: 4px 0; color: #1e293b; text-align: right; font-weight: 600;">${userDetails.phone || options.userPhone || options.phone}</td>
                  </tr>
                ` : ''}
              </table>
            </div>

            <!-- Items Purchased Table -->
            <h3 style="font-size: 15px; font-weight: 800; color: #0f766e; margin-bottom: 10px; margin-top: 0;">
              Enrolled Courses
            </h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 22px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background-color: #f8fafc; text-align: left; font-size: 12px; color: #64748b; text-transform: uppercase;">
                  <th style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">Description</th>
                  <th style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsTableRowsHtml}
              </tbody>
            </table>

            <!-- Summary Total Box -->
            <div style="background-color: #f0fdfa; border: 1px solid #99f6e4; border-radius: 12px; padding: 16px; margin-bottom: 25px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                ${discountPercent > 0 ? `
                  <tr>
                    <td style="padding: 4px 0; color: #0f766e;"><strong>Applied Discount (${couponCode || 'Coupon'}):</strong></td>
                    <td style="padding: 4px 0; color: #16a34a; font-weight: bold; text-align: right;">-${discountPercent}% OFF</td>
                  </tr>
                ` : ''}
                <tr>
                  <td style="padding: 6px 0; font-size: 16px; font-weight: 800; color: #0f766e;">Total Amount Paid:</td>
                  <td style="padding: 6px 0; font-size: 20px; font-weight: 900; color: #0d9488; text-align: right;">
                    ₹${Number(amount).toLocaleString('en-IN')}
                  </td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin-top: 25px;">
              <a href="https://academywale.com/student-dashboard" style="display: inline-block; background-color: #0d9488; color: #ffffff; font-weight: bold; padding: 13px 30px; border-radius: 10px; text-decoration: none; font-size: 14px; box-shadow: 0 4px 10px rgba(13, 148, 136, 0.3);">
                Go to Student Dashboard
              </a>
            </div>

          </div>

          <!-- Footer -->
          <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 25px; text-align: center; font-size: 12px; color: #64748b;">
            <p style="margin: 0 0 4px 0; font-weight: bold; color: #334155;">AcademyWale Learning Management System</p>
            <p style="margin: 0;">Need assistance? Contact <a href="mailto:support@academywale.com" style="color: #0d9488;">support@academywale.com</a> or Call <strong>+91 9693320108</strong></p>
          </div>

        </div>
      </div>
    `;

    const recipientList = Array.from(new Set([userEmail, ...getAdminRecipients()])).filter(Boolean);

    const mailOptions = {
      from: emailConfig.from,
      to: recipientList,
      subject: `Receipt: Course Purchase Confirmed - AcademyWale (Txn: ${transactionId})`,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Invoice receipt email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send OTP email for registration verification
const sendOTPEmail = async (userEmail, userName, otp, mobile = '') => {
  try {
    const transporter = createTransporter();
    const phoneInfo = mobile ? ` for phone number +91 ${mobile}` : '';
    
    const mailOptions = {
      from: emailConfig.from,
      to: userEmail,
      subject: `${otp} is your AcademyWale Account Verification Code`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #0d9488; text-align: center; font-weight: bold; margin-top: 0;">AcademyWale Account Verification</h2>
          <p>Dear ${userName || 'Student'},</p>
          <p>Thank you for creating an account with AcademyWale. Please use the 6-digit One-Time Password (OTP) below to complete your registration${phoneInfo}:</p>
          <div style="background-color: #f0fdfa; border: 1px solid #ccfbf1; padding: 18px; border-radius: 10px; text-align: center; margin: 24px 0;">
            <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0d9488;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">This verification code is valid for 10 minutes. If you did not request this code, please ignore this message.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #64748b; font-size: 12px; text-align: center; margin-bottom: 0;">
            Best regards,<br /><strong>The AcademyWale Team</strong><br />
            <a href="mailto:support@academywale.com" style="color: #0d9488; text-decoration: none;">support@academywale.com</a>
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
      itemsHtml = cartItems.map((item, idx) => {
        const details = item.course_details || item;
        const title = details.title || details.subject || 'Course Package';
        const mode = details.mode || 'Standard';
        const validity = details.validity || 'Standard';
        const faculty = details.facultyName || 'N/A';
        const attempt = details.attempt || '';
        const noOfLecture = details.noOfLecture || details.no_of_lecture || '';
        const books = details.books || '';
        const videoLanguage = details.videoLanguage || details.video_language || '';
        const videoRunOn = details.videoRunOn || details.video_run_on || '';
        const doubtSolving = details.doubtSolving || details.doubt_solving || '';
        const supportMail = details.supportMail || details.support_mail || '';
        const supportCall = details.supportCall || details.support_call || '';
        const institute = details.institute || details.instituteName || details.institute_name || '';

        let detailsText = `<strong>Mode:</strong> ${mode} | <strong>Validity:</strong> ${validity}`;
        if (faculty && faculty !== 'N/A') detailsText += ` | <strong>Faculty:</strong> ${faculty}`;
        if (attempt) detailsText += ` | <strong>Attempt/Term:</strong> ${attempt}`;
        if (institute) detailsText += ` | <strong>Institute:</strong> ${institute}`;
        if (noOfLecture) detailsText += ` | <strong>Lectures:</strong> ${noOfLecture}`;
        if (books) detailsText += ` | <strong>Material:</strong> ${books}`;
        if (videoLanguage) detailsText += ` | <strong>Language:</strong> ${videoLanguage}`;
        if (videoRunOn) detailsText += ` | <strong>Run On:</strong> ${videoRunOn}`;
        if (doubtSolving) detailsText += ` | <strong>Doubt Solving:</strong> ${doubtSolving}`;
        if (supportMail || supportCall) {
          const supportInfo = [supportMail, supportCall].filter(Boolean).join(' / ');
          detailsText += ` | <strong>Support:</strong> ${supportInfo}`;
        }

        return `
          <div style="padding: 12px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px;">
            <h4 style="margin: 0 0 5px 0; color: #0f766e; font-size: 15px;">${idx + 1}. ${title}</h4>
            <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
              ${detailsText}
            </p>
            <p style="margin: 5px 0 0 0; font-size: 13px; color: #1e293b; font-weight: bold;">
              Price: ₹${item.price || item.amount || amount}
            </p>
          </div>
        `;
      }).join('');
    } else {
      const courseName = courseDetails?.courseName || courseDetails?.title || 'LMS Course';
      const mode = courseDetails?.mode || 'Standard';
      const validity = courseDetails?.validity || 'Standard';
      const faculty = courseDetails?.facultyName || 'N/A';
      const attempt = courseDetails?.attempt || '';
      const noOfLecture = courseDetails?.noOfLecture || courseDetails?.no_of_lecture || '';
      const books = courseDetails?.books || '';
      const videoLanguage = courseDetails?.videoLanguage || courseDetails?.video_language || '';
      const videoRunOn = courseDetails?.videoRunOn || courseDetails?.video_run_on || '';
      const doubtSolving = courseDetails?.doubtSolving || courseDetails?.doubt_solving || '';
      const supportMail = courseDetails?.supportMail || courseDetails?.support_mail || '';
      const supportCall = courseDetails?.supportCall || courseDetails?.support_call || '';
      const institute = courseDetails?.institute || courseDetails?.instituteName || courseDetails?.institute_name || '';

      let detailsText = `<strong>Mode:</strong> ${mode} | <strong>Validity:</strong> ${validity}`;
      if (faculty && faculty !== 'N/A') detailsText += ` | <strong>Faculty:</strong> ${faculty}`;
      if (attempt) detailsText += ` | <strong>Attempt/Term:</strong> ${attempt}`;
      if (institute) detailsText += ` | <strong>Institute:</strong> ${institute}`;
      if (noOfLecture) detailsText += ` | <strong>Lectures:</strong> ${noOfLecture}`;
      if (books) detailsText += ` | <strong>Material:</strong> ${books}`;
      if (videoLanguage) detailsText += ` | <strong>Language:</strong> ${videoLanguage}`;
      if (videoRunOn) detailsText += ` | <strong>Run On:</strong> ${videoRunOn}`;
      if (doubtSolving) detailsText += ` | <strong>Doubt Solving:</strong> ${doubtSolving}`;
      if (supportMail || supportCall) {
        const supportInfo = [supportMail, supportCall].filter(Boolean).join(' / ');
        detailsText += ` | <strong>Support:</strong> ${supportInfo}`;
      }

      itemsHtml = `
        <div style="padding: 12px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h4 style="margin: 0 0 5px 0; color: #0f766e; font-size: 15px;">${courseName}</h4>
          <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
            ${detailsText}
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
      to: getAdminRecipients(),
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

/**
 * Send secure 6-digit OTP email for Admin Login Portal
 */
const sendAdminOTPEmail = async (email, otp) => {
  try {
    const transporter = getTransporter();
    
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; padding: 35px 15px; color: #334155;">
        <div style="max-width: 550px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px 25px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: #38bdf8;">AcademyWale</h1>
            <p style="margin: 6px 0 0 0; font-size: 12px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; color: #94a3b8;">
              🔒 Admin Security Portal Verification
            </p>
          </div>

          <!-- Status Bar -->
          <div style="background-color: #f0fdf4; border-bottom: 1px solid #dcfce7; padding: 12px 25px; font-size: 12px; color: #166534; text-align: center; font-weight: 600;">
            Security Check: Login Request for ${email}
          </div>

          <!-- Body Content -->
          <div style="padding: 30px 25px; text-align: center;">
            <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px;">Your Admin Access Code</h2>
            <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 25px;">
              Use the single-use 6-digit Security Verification Code below to authenticate your session into the AcademyWale Admin Panel:
            </p>

            <!-- OTP Box -->
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 2px dashed #0d9488; border-radius: 14px; padding: 22px; margin: 0 auto 25px auto; max-width: 320px;">
              <span style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #0f766e; display: inline-block;">
                ${otp}
              </span>
            </div>

            <p style="font-size: 13px; color: #64748b; margin-bottom: 20px;">
              ⏱️ This code will expire in <strong>10 minutes</strong>.
            </p>

            <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 10px; padding: 12px 16px; text-align: left; font-size: 12px; color: #9f1239; line-height: 1.5;">
              ⚠️ <strong>Security Notice:</strong> Do not share this OTP with anyone. AcademyWale staff will never ask for your admin verification code. If you did not initiate this login, please change your credentials immediately.
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 18px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8;">
            &copy; 2026 AcademyWale Admin Security Gateway. All rights reserved.
          </div>
          
        </div>
      </div>
    `;

    const mailOptions = {
      from: emailConfig.from,
      to: email,
      subject: `🔒 Admin Portal Login OTP: ${otp}`,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Admin OTP Email sent successfully to ${email}. Message ID: ${result.messageId}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Admin OTP Email sending error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendContactEmail,
  sendWelcomeEmail,
  sendEnrollmentEmail,
  sendManualEnrollmentEmail,
  sendPurchaseInvoiceEmail,
  sendOTPEmail,
  sendPasswordResetOTPEmail,
  sendAdminNotificationEmail,
  sendAdminOTPEmail
};
