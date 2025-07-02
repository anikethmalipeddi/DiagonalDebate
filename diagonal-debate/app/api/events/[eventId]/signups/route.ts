import { NextRequest, NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const dbPromise = open({
  filename: './prisma/dev.db',
  driver: sqlite3.Database
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    const db = await dbPromise
    const signups = await db.all(
      `SELECT u.id, u.name 
       FROM User u
       JOIN EventSignup es ON u.id = es.userId
       WHERE es.eventId = ?
       ORDER BY es.createdAt ASC`,
      [eventId]
    )

    return NextResponse.json({ signups })
  } catch (error) {
    console.error('Error fetching event signups:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 