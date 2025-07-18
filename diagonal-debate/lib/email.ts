import nodemailer from 'nodemailer'
import { prisma } from './prisma'

// Debug environment variables
console.log('SMTP Debug Info:')
console.log('SMTP_HOST:', process.env.SMTP_HOST ? 'Set' : 'Not set')
console.log('SMTP_USER:', process.env.SMTP_USER ? 'Set' : 'Not set')
console.log('SMTP_PASSTWO:', process.env.SMTP_PASSTWO ? 'Set' : 'Not set')
console.log('CAPTAIN_EMAILS:', process.env.CAPTAIN_EMAILS ? 'Set' : 'Not set')

// Email configuration with better error handling
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSTWO
  },
  // Add timeout and other options for better reliability
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,
  // Add secure options
  tls: {
    rejectUnauthorized: false
  }
})

// Verify connection configuration
transporter.verify(function(error: any, success: any) {
  if (error) {
    console.error('Email server connection error:', error)
  } else {
    console.log('Email server is ready to send messages')
  }
})

export interface LegislationData {
  type: string
  category: string
  number: string
  title: string
  content: string
  submittedBy: string
  submittedAt: Date
}

export async function emailToCaptains(pdfBuffer: Buffer, legislationData: LegislationData) {
  try {
    // Validate environment variables
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSTWO) {
      throw new Error('SMTP_USER or SMTP_PASSTWO environment variables are not set')
    }
    
    // Use CAPTAIN_EMAILS environment variable
    const captainEmails = process.env.CAPTAIN_EMAILS
    if (!captainEmails) {
      throw new Error('CAPTAIN_EMAILS environment variable is not set')
    }
    
    // If submittedBy looks like an email, add to cc
    const ccList = /.+@.+\..+/.test(legislationData.submittedBy) ? legislationData.submittedBy : undefined;
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: captainEmails,
      cc: ccList,
      subject: `New ${legislationData.type.toUpperCase()} Submitted by ${legislationData.submittedBy}: ${legislationData.category.charAt(0).toUpperCase() + legislationData.category.slice(1).toLowerCase()} ${legislationData.number}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #222;">
          <h2 style="color: #2a4365;">New Legislation Submission</h2>
          <table style="border-collapse: collapse; margin-bottom: 16px;">
            <tr><td style="font-weight: bold;">Submitted by:</td><td>${legislationData.submittedBy}</td></tr>
            <tr><td style="font-weight: bold;">Type:</td><td>${legislationData.type.toUpperCase()}</td></tr>
            <tr><td style="font-weight: bold;">Category:</td><td>${legislationData.category}</td></tr>
            <tr><td style="font-weight: bold;">Number:</td><td>${legislationData.number}</td></tr>
            <tr><td style="font-weight: bold;">Title:</td><td>${legislationData.title}</td></tr>
            <tr><td style="font-weight: bold;">Submitted at:</td><td>${legislationData.submittedAt.toLocaleString()}</td></tr>
          </table>
          <p style="margin-bottom: 16px;">Please find the attached PDF with the complete legislation.</p>
          <hr style="margin: 24px 0;">
          <h3 style="color: #2a4365;">Review Process</h3>
          <p style="margin-bottom: 16px;">
            <strong>This legislation has already been reviewed by the DiagonalDebate platform</strong> for completeness, formatting, and adherence to submission guidelines. It has passed initial checks and is now being sent to the captain(s) for final review and action.
          </p>
          <p style="font-size: 0.95em; color: #555;">If you have any questions or need further information, please reply to this email.</p>
        </div>
      `,
      attachments: [
        {
          filename: `${legislationData.number}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    }

    console.log('Attempting to send email to captains:', captainEmails, 'cc:', ccList)
    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully to captains:', result.messageId)
    
    // Also send confirmation email to the user if they provided an email
    if (ccList) {
      const userMailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: ccList,
        subject: `Your ${legislationData.type.toUpperCase()} has been submitted: ${legislationData.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #222;">
            <h2 style="color: #2a4365;">Legislation Submission Confirmation</h2>
            <p>Dear ${legislationData.submittedBy},</p>
            <p>Your legislation has been successfully submitted and sent to the team captains for review.</p>
            <table style="border-collapse: collapse; margin: 16px 0;">
              <tr><td style="font-weight: bold;">Type:</td><td>${legislationData.type.toUpperCase()}</td></tr>
              <tr><td style="font-weight: bold;">Category:</td><td>${legislationData.category}</td></tr>
              <tr><td style="font-weight: bold;">Number:</td><td>${legislationData.number}</td></tr>
              <tr><td style="font-weight: bold;">Title:</td><td>${legislationData.title}</td></tr>
              <tr><td style="font-weight: bold;">Submitted at:</td><td>${legislationData.submittedAt.toLocaleString()}</td></tr>
            </table>
            <p>Your legislation has been reviewed by our platform and passed initial checks. It has been forwarded to the team captains for final review.</p>
            <p>You will be notified once the captains have reviewed your submission.</p>
            <p style="font-size: 0.95em; color: #555;">Thank you for using DiagonalDebate!</p>
          </div>
        `,
        attachments: [
          {
            filename: `${legislationData.number}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      }
      
      const userResult = await transporter.sendMail(userMailOptions)
      console.log('Confirmation email sent successfully to user:', userResult.messageId)
    }
    
    return result
    
  } catch (error) {
    console.error('Email sending failed:', error)
    
    // Provide specific guidance for common Gmail authentication issues
    if (error instanceof Error && error.message.includes('Invalid login')) {
      console.error('Gmail authentication failed. Please check:')
      console.error('1. Use an App Password instead of your regular password')
      console.error('2. Enable 2-factor authentication on your Gmail account')
      console.error('3. Generate an App Password at: https://myaccount.google.com/apppasswords')
      console.error('4. Use the App Password in your SMTP_PASSTWO environment variable')
    }
    
    throw error
  }
}

export async function sendEmail(subject: string, text: string, html?: string, attachments?: any[]) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.CAPTAIN_EMAILS, // Use CAPTAIN_EMAILS as recipient
      subject: subject,
      text: text,
      html: html,
      attachments: attachments
    }

    console.log('Attempting to send email to:', process.env.CAPTAIN_EMAILS)
    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result.messageId)
    return result
  } catch (error) {
    console.error('Email sending failed:', error)
    throw error
  }
} 