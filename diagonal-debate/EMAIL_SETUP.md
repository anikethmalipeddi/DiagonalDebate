# Email Setup for Legislation Submissions

## Overview
When users submit legislation through the Legislation Checker, the system:
1. Generates a properly formatted PDF using the templates
2. Emails the PDF to team admins (who also serve as captains) for review
3. Sends a confirmation email to the user who submitted the legislation
4. Stores the submission record in the database

## Admin/Captain Management

Admins and captains are now unified into one system. The same people who have admin access to the platform also receive legislation submissions for review.

**Admin emails are configured in**: `lib/admin.ts`

To modify who receives legislation submissions:
1. Edit the `ADMIN_EMAILS` array in `lib/admin.ts`
2. These same emails will have admin panel access AND receive legislation submissions
3. No separate captain management is needed

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

**Note**: The `CAPTAIN_EMAILS` environment variable is no longer needed as admins now serve as captains.

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
2. Ensure admin emails are configured in `lib/admin.ts`
3. Submit legislation through the form
4. Check the console logs for email status
5. Verify admins receive the PDF attachment
6. Verify the user receives a confirmation email

## Email Flow

When legislation is submitted:

1. **To Admins**: Email with PDF attachment containing the legislation details and review instructions
2. **To User**: Confirmation email with submission details and list of admins who will review

## PDF Format

The generated PDF includes:
- Proper header (BILL/RESOLUTION/AMENDMENT)
- Category and number
- Title
- Line-numbered content
- Section headers in bold
- Footer with submission details
- Professional formatting matching debate standards 