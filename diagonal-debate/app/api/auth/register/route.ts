import { NextRequest, NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { SignJWT } from 'jose'
import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs'

const dbPromise = open({
  filename: './prisma/dev.db',
  driver: sqlite3.Database
})

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // console.log('DEBUG: Registration received password:', password)

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    const db = await dbPromise
    
    // Check if user already exists
    const existingUser = await db.get(
      'SELECT id FROM User WHERE email = ?',
      [email]
    )

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create user
    const userId = randomUUID()
    const now = Date.now()
    const hashedPassword = await bcrypt.hash(password, 10)
    await db.run(
      'INSERT INTO User (id, name, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, email, hashedPassword, now, now]
    )

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')
    const token = await new SignJWT({ 
      userId, 
      email,
      name 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret)

    // Create response with cookie
    const response = NextResponse.json({
      user: {
        id: userId,
        email,
        name
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
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 