"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Maximize2, Star, MessageSquare } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { StarRating } from "@/components/ui/star-rating";
import { Textarea } from "@/components/ui/textarea";

const PDFViewer = dynamic(() => import("../../components/PDFViewer"), { ssr: false });

function LessonViewerPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const file = searchParams.get("file");
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  // Extract lesson filename from the file path
  const lessonFileName = file ? file.split('/').pop()?.replace(/%20/g, ' ') : '';

  useEffect(() => {
    // Check if this is the user's first visit to this lesson
    const lessonKey = `lesson_${lessonFileName}`;
    const hasVisited = localStorage.getItem(lessonKey);
    if (hasVisited) {
      setIsFirstVisit(false);
    }
  }, [lessonFileName]);

  const handleExitLesson = () => {
    if (lessonFileName) {
      localStorage.setItem('showRatingModal', lessonFileName);
      const lessonKey = `lesson_${lessonFileName}`;
      localStorage.setItem(lessonKey, 'completed');
    }
    router.push('/lessons');
  };

  if (!file) return (
    <div className="min-h-screen flex items-center justify-center text-xl font-bold text-gray-700">No lesson file specified.</div>
  );

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white relative px-2 pb-8 font-sans">
      {/* Decorative background blobs (z-[-10]) */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse z-[-10]" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse z-[-10]" />
      
      {/* PDFViewer in fullscreen mode only */}
      <PDFViewer file={file} initialFullscreen={true} onExit={handleExitLesson} />
    </div>
  );
}

export default function LessonViewerPage() {
  return (
    <Suspense fallback={<div>Loading lesson...</div>}>
      <LessonViewerPageInner />
    </Suspense>
  );
} 