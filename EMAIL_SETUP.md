# Email Setup Guide for AcademyWale

This guide will help you set up email sending functionality using Nodemailer without any third-party services.

## Prerequisites

1. A Gmail account (support@academywale.com)
2. 2-Factor Authentication enabled on your Gmail account

## Setup Steps

### 1. Create .env File

Create a `.env` file in the root directory of your project with the following content:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/academywale

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration
EMAIL_USER=support@academywale.com
EMAIL_PASSWORD=your_gmail_app_password_here

# Server Configuration
PORT=5000
```

### 2. Generate Gmail App Password

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to "Security"
3. Enable "2-Step Verification" if not already enabled
4. Go to "App passwords" (under 2-Step Verification)
5. Select "Mail" as the app and "Other" as the device
6. Generate the app password
7. Copy the 16-character password and paste it in your `.env` file as `EMAIL_PASSWORD`

### 3. Test Email Configuration

1. Start your server: `cd server && npm run dev`
2. Test the email configuration by visiting: `http://localhost:5000/api/contact/test`
3. You should see a success message if everything is configured correctly

### 4. Test Contact Form

1. Start your frontend: `cd client && npm run dev`
2. Go to the Contact page
3. Fill out and submit the contact form
4. Check your support@academywale.com inbox for the email

## Email Features

The system includes three types of emails:

1. **Contact Form Emails**: Sent when users submit the contact form
2. **Welcome Emails**: Sent to new users upon registration
3. **Enrollment Emails**: Sent when users enroll in courses

## Troubleshooting

### Common Issues

1. **"Email password not configured"**

   - Make sure you've created the `.env` file
   - Ensure `EMAIL_PASSWORD` is set correctly

2. **"Invalid login" or "Authentication failed"**

   - Verify you're using an App Password, not your regular Gmail password
   - Make sure 2-Factor Authentication is enabled

3. **"Less secure app access" error**
   - This is expected - you need to use App Passwords instead

### Alternative Email Providers

If you want to use a different email provider:

1. Update the `service` field in `server/src/config/email.config.js`
2. Common services: 'outlook', 'yahoo', 'hotmail'
3. For custom SMTP servers, update the transporter configuration in `email.utils.js`

## Security Notes

- Never commit your `.env` file to version control
- Keep your App Password secure
- Consider using environment variables in production

## Production Deployment

For production deployment:

1. Use environment variables instead of `.env` file
2. Consider using a dedicated email service for better deliverability
3. Set up proper error logging and monitoring
4. Implement rate limiting for the contact form

## Support

If you encounter any issues, check the server logs for detailed error messages. The email system will log all errors to help with debugging.
