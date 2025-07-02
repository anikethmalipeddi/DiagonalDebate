import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/index.js';
import { getCurrentUser } from '@/lib/auth';

let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

// GET: fetch total enrolled and if user is enrolled
export async function GET(req: NextRequest, context: { params: { lessonFileName: string } }) {
  try {
    const { params } = await context;
  const user = await getCurrentUser();
  const userId = user?.id;
  const lessonFileName = decodeURIComponent(params.lessonFileName);

  // Count total enrollments for this lesson
  const total = await prisma.lessonEnrollment.count({ where: { lessonFileName } });
  // Check if current user is enrolled
  let isEnrolled = false;
  if (userId) {
    isEnrolled = !!(await prisma.lessonEnrollment.findUnique({ where: { userId_lessonFileName: { userId, lessonFileName } } }));
  }
  return NextResponse.json({ total, isEnrolled });
  } catch (error) {
    console.error('Error in enrollment GET:', error);
    return NextResponse.json({ total: 0, isEnrolled: false });
  }
}

// POST: enroll current user in lesson
export async function POST(req: NextRequest, context: { params: { lessonFileName: string } }) {
  try {
    const { params } = await context;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    
  const userId = user.id;
  const lessonFileName = decodeURIComponent(params.lessonFileName);

    // Verify user exists in database before creating enrollment
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      console.error('User not found in database:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

  // Enroll the user if not already enrolled
  await prisma.lessonEnrollment.upsert({
    where: { userId_lessonFileName: { userId, lessonFileName } },
    update: {},
    create: { userId, lessonFileName },
  });
    
  // Count total enrollments for this lesson
  const total = await prisma.lessonEnrollment.count({ where: { lessonFileName } });
  return NextResponse.json({ success: true, total });
  } catch (error) {
    console.error('Error in enrollment POST:', error);
    return NextResponse.json({ error: 'Failed to enroll in lesson' }, { status: 500 });
  }
} 