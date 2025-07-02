import { NextResponse } from 'next/server'

export async function GET() {
  const config = {
    smtpUser: process.env.SMTP_USER ? 'Set' : 'Not set',
    smtpPass: process.env.SMTP_PASS ? `Set (length: ${process.env.SMTP_PASS.length})` : 'Not set',
    smtpFrom: process.env.SMTP_FROM ? 'Set' : 'Not set',
    captainEmails: process.env.CAPTAIN_EMAILS ? 'Set' : 'Not set',
    captainEmailsValue: process.env.CAPTAIN_EMAILS || 'Not set'
  }

  return NextResponse.json({
    message: 'Email configuration status',
    config,
    timestamp: new Date().toISOString()
  })
} 