import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
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

    // Get request body
    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const { eventId } = await params
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is already signed up for this event
    const existingSignup = await prisma.eventSignup.findFirst({
      where: {
        userId: userId,
        eventId: eventId
      }
    })
    if (existingSignup) {
      return NextResponse.json({ error: 'User is already signed up for this event' }, { status: 409 })
    }

    // Create the event signup
    const signup = await prisma.eventSignup.create({
      data: {
        userId: userId,
        eventId: eventId
      },
      include: {
        user: true,
        event: true
      }
    })

    return NextResponse.json({
      message: 'User successfully added to event',
      signup: {
        id: signup.id,
        userId: signup.userId,
        eventId: signup.eventId,
        userName: signup.user.name || signup.user.email,
        eventTitle: signup.event?.title || 'Unknown Event',
        createdAt: signup.createdAt
      }
    })

  } catch (error) {
    console.error('Error adding user to event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 