import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { name, email, feature } = await request.json()

    if (!name || !email || !feature) {
      return NextResponse.json(
        { error: 'Name, email, and feature request are required' },
        { status: 400 }
      )
    }

    // Check if SMTP is configured
    console.log('SMTP Debug Info:')
    console.log('SMTP_HOST:', process.env.SMTP_HOST ? 'Set' : 'Not set')
    console.log('SMTP_USER:', process.env.SMTP_USER ? 'Set' : 'Not set')
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'Set' : 'Not set')
    
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Send actual email
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.SMTP_TO || 'diagonaldebate@gmail.com',
        subject: `Feature Suggestion from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">New Feature Suggestion</h2>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>From:</strong> ${name} (${email})</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h3 style="color: #374151; margin-top: 0;">Feature Request:</h3>
              <p style="line-height: 1.6; color: #4b5563;">${feature.replace(/\n/g, '<br>')}</p>
            </div>
            <div style="margin-top: 20px; padding: 15px; background-color: #fef2f2; border-left: 4px solid #dc2626; border-radius: 4px;">
              <p style="margin: 0; color: #991b1b; font-size: 14px;">
                This suggestion was submitted through the DiagonalDebate platform contact form.
              </p>
            </div>
          </div>
        `,
      })

      console.log('Feature suggestion email sent successfully')
      return NextResponse.json({ 
        message: 'Feature suggestion submitted successfully! We\'ll review it and get back to you.' 
      })
    } else {
      // SMTP not configured, return error
      return NextResponse.json(
        { error: 'Email service is not configured. Please try again later.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error submitting suggestion:', error)
    return NextResponse.json(
      { error: 'Failed to submit suggestion' },
      { status: 500 }
    )
  }
} 