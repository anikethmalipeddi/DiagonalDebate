import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

// GET: fetch average rating and user's rating for a lesson
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonFileName: string }> }
) {
  try {
    const { lessonFileName } = await params;
    const user = await getCurrentUser();
    const userId = user?.id;

    const ratings = await prisma.lessonRating.findMany({
      where: { lessonFileName }
    });
    // Only include ratings >= 3 in the average and count
    const validRatings = ratings.filter((r: any) => r.rating >= 3);
    const count = validRatings.length;
    const average = count > 0 ? validRatings.reduce((sum: any, r: any) => sum + r.rating, 0) / count : 0;
    const userRating = ratings.find((r: any) => r.userId === userId)?.rating || null;

    return NextResponse.json({ averageRating: average, count, userRating });
  } catch (error) {
    console.error('Error fetching lesson ratings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: submit a rating for a lesson
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
    const { rating } = await request.json();
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }
    // Check if user already rated this lesson
    const existingRating = await prisma.lessonRating.findFirst({
      where: { lessonFileName, userId: user.id }
    });
    let ratingRecord;
    if (existingRating) {
      // Update existing rating
      ratingRecord = await prisma.lessonRating.update({
        where: { id: existingRating.id },
        data: { rating }
      });
    } else {
      // Create new rating
      ratingRecord = await prisma.lessonRating.create({
        data: {
          lessonFileName,
          userId: user.id,
          rating
        }
      });
    }
    // Fetch updated average (only ratings >= 3)
    const ratings = await prisma.lessonRating.findMany({ where: { lessonFileName } });
    const validRatings = ratings.filter((r: any) => r.rating >= 3);
    const count = validRatings.length;
    const average = count > 0 ? validRatings.reduce((sum: any, r: any) => sum + r.rating, 0) / count : 0;
    const userRating = ratings.find((r: any) => r.userId === user.id)?.rating || null;
    return NextResponse.json({ averageRating: average, count, userRating: rating });
  } catch (error) {
    console.error('Error submitting lesson rating:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 