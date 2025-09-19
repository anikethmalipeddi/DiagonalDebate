import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'

export async function GET() {
  try {
    // Get current user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if (!isAdmin(currentUser.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Fetch all events with their signups
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
    })

    // Get signups for each event
    const eventsWithSignups = await Promise.all(events.map(async (event) => {
      const signupsForEvent = await prisma.eventSignup.findMany({
        where: { eventId: event.id },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      })
      const signedUpUsers = signupsForEvent.map((signup) => signup.user?.name || signup.user?.email || 'Unknown')
      return {
        ...event,
        signupCount: signupsForEvent.length,
        signedUpUsers
      }
    }))

    return NextResponse.json({ events: eventsWithSignups })

  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 