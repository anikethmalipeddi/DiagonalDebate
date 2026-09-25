import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { getJwtSecret } from './env'

export interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  isAdmin?: boolean
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(token.value, getJwtSecret())

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

    if (!user?.name || !user.email) {
      return null
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  } catch (error) {
    console.error('Error getting user by ID:', error)
    return null
  }
}
