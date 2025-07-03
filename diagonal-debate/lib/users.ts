import { prisma } from './prisma'
import { events, Event } from './events'

// Example function: get user by ID
export async function getUserById(userId: string) {
  return prisma.user.findUnique({ where: { id: userId } })
}

// Example function: get all events
export async function getAllEvents() {
  return prisma.event.findMany()
}

// ... add more functions as needed, all using prisma ... 