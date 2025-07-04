import { PrismaClient } from '@prisma/client'
import { events } from '../lib/events'

const prisma = new PrismaClient()

async function seedEvents() {
  console.log('🌱 Seeding events...')

  try {
    // Clear existing events first
    await prisma.event.deleteMany()
    console.log('🗑️  Cleared existing events')

    // Insert all events from lib/events.ts
    for (const event of events) {
      await prisma.event.create({
        data: {
          id: event.id,
          title: event.name,
          date: new Date(event.date),
        },
      })
      console.log(`✅ Added event: ${event.name}`)
    }

    console.log(`🎉 Successfully seeded ${events.length} events!`)
  } catch (error) {
    console.error('❌ Error seeding events:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedEvents() 