# Email Setup for Legislation Submissions

## Overview
When users submit legislation through the Legislation Checker, the system:
1. Generates a properly formatted PDF using the templates
2. Emails the PDF to team captains for review
3. Stores the submission record in the database

## Required Environment Variables

Add these to your `.env.local` file:

```env
# Email Configuration
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
CAPTAIN_EMAILS="captain1@example.com,captain2@example.com"
```

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password
3. **Use the App Password** in `EMAIL_PASS` (not your regular password)

## Alternative Email Services

You can modify `lib/email.ts` to use other services:

### SendGrid
```typescript
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
})
```

### AWS SES
```typescript
const transporter = nodemailer.createTransport({
  host: 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
  auth: {
    user: process.env.AWS_SES_USER,
    pass: process.env.AWS_SES_PASS
  }
})
```

## Testing

To test the email functionality:

1. Set up the environment variables
2. Submit legislation through the form
3. Check the console logs for email status
4. Verify captains receive the PDF attachment

## PDF Format

The generated PDF includes:
- Proper header (BILL/RESOLUTION/AMENDMENT)
- Category and number
- Title
- Line-numbered content
- Section headers in bold
- Footer with submission details
- Professional formatting matching debate standards 

# Email Setup Guide

## Environment Variables Required

The application uses the following environment variables for email configuration:

```bash
# SMTP Server Configuration
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password-or-app-password
SMTP_FROM=your-email@domain.com

# Email Recipients
CAPTAIN_EMAILS=captain1@domain.com,captain2@domain.com
```

## Gmail Setup (Most Common)

If you're using Gmail, follow these steps:

### Option 1: Use Gmail App Passwords (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate an App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other" as the device (name it "Diagonal Debate App")
   - Click "Generate"
   - Copy the 16-character password

3. **Update Environment Variables**
   ```bash
   # In your .env.local file
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your.email@gmail.com
   SMTP_PASS=your-16-character-app-password
   SMTP_FROM=your.email@gmail.com
   CAPTAIN_EMAILS=captain1@gmail.com,captain2@gmail.com
   ```

### Option 2: Use Gmail OAuth2 (Advanced)

For production environments, consider using OAuth2 instead of app passwords.

## Other Email Providers

### SendGrid
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=your-verified-sender@domain.com
```

### Mailgun
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
SMTP_FROM=your-verified-sender@domain.com
```

### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your.email@outlook.com
SMTP_PASS=your-password-or-app-password
SMTP_FROM=your.email@outlook.com
```

## Testing Email Configuration

You can test your email configuration by:

1. Setting up the environment variables
2. Restarting the development server
3. Submitting a piece of legislation through the app
4. Checking the console logs for email configuration debug information

## Troubleshooting

### Common Issues

1. **Authentication Failed**: 
   - For Gmail: Use an App Password instead of your regular password
   - Ensure 2-factor authentication is enabled
   - Check that the SMTP_USER and SMTP_PASS are correct

2. **Connection Timeout**:
   - Verify SMTP_HOST and SMTP_PORT are correct
   - Check firewall settings
   - Try different ports (587, 465, 25)

3. **Sender Not Verified**:
   - Some providers require sender verification
   - Check your email provider's documentation

### Debug Information

The application logs debug information about email configuration on startup. Look for:
- Which environment variables are set
- Email server connection status
- Any authentication errors

## PDF Format

The generated PDF includes:
- Proper header (BILL/RESOLUTION/AMENDMENT)
- Category and number
- Title
- Line-numbered content
- Section headers in bold
- Footer with submission details
- Professional formatting matching debate standards 