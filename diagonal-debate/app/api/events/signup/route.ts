import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'

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

    // Fetch event
    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    if (event.tournamentType === 'Championship') {
      const adminEmails = [
        'aniketh.malipeddi@gmail.com',
        'anikethmalipeddi@gmail.com'
      ]
      if (!adminEmails.includes(user.email)) {
        return NextResponse.json({ error: 'Invite only: Only admins can add users to this event.' }, { status: 403 })
      }
    }

    // Check if already signed up
    const existingSignup = await prisma.eventSignup.findFirst({
      where: { eventId, userId: user.id }
    })

    if (existingSignup) {
      return NextResponse.json({ error: 'Already signed up for this event' }, { status: 409 })
    }

    // Create signup
    const signup = await prisma.eventSignup.create({
      data: {
        id: randomUUID(),
        eventId,
        userId: user.id
      }
    })

    return NextResponse.json({ success: true, signup })
  } catch (error) {
    console.error('Event signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 