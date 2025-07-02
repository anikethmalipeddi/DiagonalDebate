import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const dbPromise = open({
  filename: './prisma/dev.db',
  driver: sqlite3.Database
})

export interface User {
  id: string
  name: string
  email: string
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')

    if (!token) {
      return null
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')
    const { payload } = await jwtVerify(token.value, secret)

    if (!payload.userId || !payload.email || !payload.name) {
      return null
    }

    return {
      id: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const db = await dbPromise
    const user = await db.get(
      'SELECT id, name, email FROM User WHERE id = ?',
      [userId]
    )

    return user || null
  } catch (error) {
    console.error('Error getting user by ID:', error)
    return null
  }
} 