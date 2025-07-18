# Email Setup for Legislation Submissions

## Overview
When users submit legislation through the Legislation Checker, the system:
1. Generates a properly formatted PDF using the templates
2. Emails the PDF to team captains for review
3. Sends a confirmation email to the user who submitted the legislation
4. Stores the submission record in the database

## Captain Management

Captains are now managed through the admin interface instead of environment variables. To add or manage captains:

1. **Access the Admin Panel**: Navigate to `/admin` and log in with an admin account
2. **Go to Captains Tab**: Click on the "Captains" tab in the admin dashboard
3. **Add Captains**: Use the "Add Captain" button to add new captains with their name and email
4. **Manage Captains**: Edit or delete existing captains, or toggle their active status

The system will automatically use all active captains when sending legislation submissions.

## Required Environment Variables

Add these to your `.env.local` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSTWO=your-app-password
SMTP_FROM=your-email@gmail.com
```

**Note**: The `CAPTAIN_EMAILS` environment variable is no longer needed as captains are now managed through the database.

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password
3. **Use the App Password** in `SMTP_PASSTWO` (not your regular password)

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
2. Add at least one captain through the admin interface
3. Submit legislation through the form
4. Check the console logs for email status
5. Verify captains receive the PDF attachment
6. Verify the user receives a confirmation email

## Email Flow

When legislation is submitted:

1. **To Captains**: Email with PDF attachment containing the legislation details and review instructions
2. **To User**: Confirmation email with submission details and list of captains who will review

## PDF Format

The generated PDF includes:
- Proper header (BILL/RESOLUTION/AMENDMENT)
- Category and number
- Title
- Line-numbered content
- Section headers in bold
- Footer with submission details
- Professional formatting matching debate standards 