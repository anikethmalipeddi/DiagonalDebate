import { PrismaClient } from '@prisma/client'
import { events } from '../lib/events'

const prisma = new PrismaClient()

async function main() {
  const signUpEvents = events.filter(
    (event) => event.category === 'Tournament' || event.category === 'Meeting',
  )

  for (const event of signUpEvents) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {
        title: event.name,
        date: new Date(`${event.date}T12:00:00.000Z`),
      },
      create: {
        id: event.id,
        title: event.name,
        date: new Date(`${event.date}T12:00:00.000Z`),
      },
    })
  }

  console.log(`Seeded ${signUpEvents.length} sign-up events.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
