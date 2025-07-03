import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    const signups = await prisma.eventSignup.findMany({
      where: { eventId },
      include: {
        user: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    const formattedSignups = signups.map((s: any) => ({ id: s.user.id, name: s.user.name }))

    return NextResponse.json({ signups: formattedSignups })
  } catch (error) {
    console.error('Error fetching event signups:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 