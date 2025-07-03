import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

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
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonFileName: string }> }
) {
  try {
    const { lessonFileName } = await params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.lessonEnrollment.findFirst({
      where: { lessonFileName, userId: user.id }
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Already enrolled in this lesson' }, { status: 409 });
    }

    // Create enrollment
    const enrollment = await prisma.lessonEnrollment.create({
      data: {
        lessonFileName,
        userId: user.id
      }
    });

    return NextResponse.json({ success: true, enrollment });
  } catch (error) {
    console.error('Error enrolling in lesson:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 