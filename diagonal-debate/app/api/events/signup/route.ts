import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { randomUUID } from 'crypto'

const dbPromise = open({
  filename: './prisma/dev.db',
  driver: sqlite3.Database
})

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { eventId } = await request.json()
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    const db = await dbPromise

    // Check if already signed up
    const existingSignup = await db.get(
      'SELECT id FROM EventSignup WHERE eventId = ? AND userId = ?',
      [eventId, user.id]
    )

    if (existingSignup) {
      return NextResponse.json({ message: 'Already signed up' })
    }

    // Create signup
    const signupId = randomUUID()
    await db.run(
      'INSERT INTO EventSignup (id, eventId, userId, createdAt) VALUES (?, ?, ?, ?)',
      [signupId, eventId, user.id, new Date()]
    )

    return NextResponse.json({ success: true, signupId })
  } catch (error) {
    console.error('Event signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 