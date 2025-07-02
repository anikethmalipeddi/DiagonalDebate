import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { SignJWT } from 'jose'

const dbPromise = open({
  filename: './prisma/dev.db',
  driver: sqlite3.Database
})

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // console.log('DEBUG: Login attempt for email:', email)

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const db = await dbPromise
    const user = await db.get(
      'SELECT * FROM User WHERE email = ?',
      [email]
    )

    // console.log('DEBUG: User found:', Boolean(user))
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    // console.log('DEBUG: bcrypt.compare result:', isValidPassword)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')
    const token = await new SignJWT({ 
      userId: user.id, 
      email: user.email,
      name: user.name 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret)

    // Create response with cookie
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })

    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 