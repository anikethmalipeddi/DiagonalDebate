import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

const ADMIN_EMAILS = [
  "aniketh.malipeddi@gmail.com",
  "anikethmalipeddi@gmail.com"
]

export async function GET() {
  try {
    // Get current user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if (!ADMIN_EMAILS.includes(currentUser.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Fetch all users
    const users = await prisma.user.findMany({
      include: {
        lessonRatings: true,
        lessonEnrollments: true,
        eventSignups: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ users })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 