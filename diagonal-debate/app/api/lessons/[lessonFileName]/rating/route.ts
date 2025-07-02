import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/index.js';
import { getCurrentUser } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

// GET: fetch average rating and user's rating for a lesson
export async function GET(req: NextRequest, context: { params: { lessonFileName: string } }) {
  const { params } = await context;
  const user = await getCurrentUser();
  const userId = user?.id;
  const lessonFileName = decodeURIComponent(params.lessonFileName);

  // Fetch all ratings for this lesson
  const ratings = await prisma.lessonRating.findMany({
    where: { lessonFileName },
  });
  const count = ratings.length;
  const averageRating = count > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / count : null;
  const userRating = userId ? ratings.find(r => r.userId === userId)?.rating : null;

  return NextResponse.json({ averageRating, count, userRating });
}

// POST: submit/update user's rating for a lesson
export async function POST(req: NextRequest, context: { params: { lessonFileName: string } }) {
  const { params } = await context;
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const userId = user.id;
  const lessonFileName = decodeURIComponent(params.lessonFileName);
  const { rating, feedback } = await req.json();

  // Upsert the rating
  const newRating = await prisma.lessonRating.upsert({
    where: { userId_lessonFileName: { userId, lessonFileName } },
    update: { rating },
    create: { userId, lessonFileName, rating },
  });

  // Optionally, send feedback via email if provided
  if (feedback && feedback.trim().length > 0) {
    await sendEmail(
      `New Lesson Feedback: ${lessonFileName} (${rating} stars)`,
      `User: ${user.email}\nLesson: ${lessonFileName}\nRating: ${rating}\nFeedback: ${feedback}`
    );
  }

  // Return updated average and count
  const ratings = await prisma.lessonRating.findMany({ where: { lessonFileName } });
  const count = ratings.length;
  const averageRating = count > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / count : null;

  return NextResponse.json({ averageRating, count, userRating: rating });
} 