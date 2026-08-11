import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

export interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export function getJwtSecret(): Uint8Array {
  const jwtSecret = process.env.JWT_SECRET

  if (!jwtSecret) {
    throw new Error('JWT_SECRET must be configured')
  }

  return new TextEncoder().encode(jwtSecret)
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')

    if (!token) {
      return null
    }

    const secret = getJwtSecret()
    const { payload } = await jwtVerify(token.value, secret)

    if (!payload.userId || !payload.email || !payload.name) {
      return null
    }

    return {
      id: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      password: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    return user || null
  } catch (error) {
    console.error('Error getting user by ID:', error)
    return null
  }
}
