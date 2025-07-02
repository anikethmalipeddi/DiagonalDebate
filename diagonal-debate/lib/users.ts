import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import { events, Event } from './events'

let db: Database | null = null

async function getDb() {
  if (!db) {
    db = await open({
      filename: './prisma/dev.db',
      driver: sqlite3.Database
    })
  }
  return db
}

export async function getAllSignups() {
  const db = await getDb()
  return db.all('SELECT * FROM EventSignup')
}

export async function getUsersWithSignups() {
  try {
    const db = await getDb()
    const users = await db.all('SELECT id, name, email, createdAt, password FROM User')
    const signups = await getAllSignups()
    
    const eventsMap = new Map(events.map(event => [event.id, { name: event.name, date: event.date }]))

    const usersWithSignups = users.map(user => ({
      ...user,
      signups: signups
        .filter(signup => signup.userId === user.id)
        .map(signup => ({
          ...signup,
          eventName: eventsMap.get(signup.eventId)?.name || 'Unknown Event',
          eventDate: eventsMap.get(signup.eventId)?.date || '',
          signupDate: signup.createdAt
        }))
    }))

    return { users: usersWithSignups, error: null }
  } catch (error) {
    console.error('Database error:', error)
    return { users: [], error: 'Failed to fetch user data.' }
  }
} 