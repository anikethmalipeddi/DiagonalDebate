import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'
import { randomUUID } from 'crypto'

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if user is admin
    if (!isAdmin(currentUser.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { eventId } = params

    // Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Get all users
    const allUsers = await prisma.user.findMany({
      select: { id: true, name: true, email: true }
    })

    // Get users already signed up for this event
    const existingSignups = await prisma.eventSignup.findMany({
      where: { eventId },
      select: { userId: true }
    })

    const signedUpUserIds = new Set(existingSignups.map(signup => signup.userId))

    // Filter users who haven't signed up yet
    const usersToAdd = allUsers.filter(user => !signedUpUserIds.has(user.id))

    if (usersToAdd.length === 0) {
      return NextResponse.json({ 
        message: 'All users are already signed up for this event',
        addedCount: 0 
      })
    }

    // Create signups for all remaining users
    const signupsToCreate = usersToAdd.map(user => ({
      id: randomUUID(),
      eventId,
      userId: user.id
    }))

    await prisma.eventSignup.createMany({
      data: signupsToCreate
    })

    return NextResponse.json({ 
      success: true, 
      addedCount: usersToAdd.length,
      addedUsers: usersToAdd.map(user => user.name || user.email)
    })

  } catch (error) {
    console.error('Add all users error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}