"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Clock, Users, Search, Filter, Play, Download, Star, Target, Zap, FileText } from "lucide-react"
import { ScrollAnimation } from "@/components/scroll-animation"
import dynamic from 'next/dynamic'
import { StarRating } from '@/components/ui/star-rating'
import { useRouter } from 'next/navigation'
import { Textarea } from "@/components/ui/textarea"
const PDFPreview = dynamic(() => import('../components/PDFPreview'), { ssr: false });
const PDFViewer = dynamic(() => import('../components/PDFViewer'), { ssr: false });

interface Lesson {
  id: number
  title: string
  description: string
  duration: string
  difficulty: string
  category: string
  rating: number
  enrolled: number
  topics: string[]
  content: string
  objectives: string[]
  pdfUrl: string
  isPdfLesson: boolean
  fileName: string
  phase: string
}

// Dynamic lesson generation based on PDF files
const generateLessonsFromFiles = (): Lesson[] => {
  // All actual PDF files from /public/lessons/ directory
  // Organized in proper learning sequence for beginner debaters
  const lessonFiles: string[] = [
    // PHASE 1: FOUNDATION (Beginner - Start Here)
    // 1.1 Understanding the basics and overview
    "General Overview + Schedule 'til WACFL 1.pdf",
    "Congressional Debate Basics.pdf",
    
    // 1.2 Core speaking fundamentals
    "Presentation & Delivery - How to_.pdf",
    "Intros + Rhetoric - How to_.pdf",
    
    // PHASE 2: STRUCTURE & ARGUMENTATION (Beginner-Intermediate)
    // 2.1 Speech structure and strategy
    "Speech Structures + Round Strategy - OVERVIEW.pdf",
    "Argument Construction .pdf",
    
    // 2.2 Logical reasoning and contention building
    "Logical Reasoning - How to_.pdf",
    "Contention Structure Practice.pdf",
    
    // PHASE 3: REFUTATION & ANALYSIS (Intermediate)
    // 3.1 Refutation fundamentals
    "Introduction to Refutation & Weighing.pdf",
    "Refutations - 2025.pdf",
    
    // 3.2 Cross-examination and impacting
    "Cross Examination.pdf",
    "Impacting - How to_.pdf",
    
    // PHASE 4: PROCEDURE & RESEARCH (Intermediate)
    // 4.1 Parliamentary procedure
    "Parliamentary Procedure.pdf",
    "Presiding Guide - RR.pdf",
    
    // 4.2 Research and legislation
    "Legislation, Civics, & Research - How to_.pdf",
    
    // PHASE 5: PRACTICE & ADVANCED TECHNIQUES (Intermediate-Advanced)
    // 5.1 Practice and drills
    "Practice Drills.pdf",
    
    // 5.2 Advanced techniques
    "Advanced Rhetoric - How to_.pdf",
    "Argument Generation Bonus Lecture 2025.pdf",
    
    // PHASE 6: SPECIALIZED SKILLS (Advanced)
    // 6.1 Extemporaneous speaking
    "Extemporaneous-Speaking-Textbook.pdf"
  ]

  if (lessonFiles.length === 0) {
    // Return placeholder lessons when no files are present
    return [
      {
        id: 1,
        title: "Congressional Debate Fundamentals",
        description: "Essential introduction to congressional debate structure, procedures, and basic strategies.",
        duration: "60 min",
        difficulty: "Beginner",
        category: "Speaking",
        rating: 4.9,
        enrolled: 156,
        topics: ["Basics", "Structure", "Procedures"],
        content: "This foundational lesson covers the core concepts of congressional debate, including chamber procedures, speaking order, and basic argumentation techniques.",
        objectives: [
          "Understand congressional debate format and procedures",
          "Learn proper speaking order and time management",
          "Master basic argument structure (claim, warrant, impact)",
          "Practice parliamentary procedure basics",
        ],
        pdfUrl: "/lessons/placeholder-1.pdf",
        isPdfLesson: true,
        fileName: "placeholder-1.pdf",
        phase: "Foundation"
      },
      {
        id: 2,
        title: "Bill Writing and Analysis",
        description: "Comprehensive guide to writing effective legislation and analyzing bills in debate.",
        duration: "75 min",
        difficulty: "Intermediate",
        category: "Writing",
        rating: 4.8,
        enrolled: 134,
        topics: ["Legislation", "Writing", "Analysis"],
        content: "Learn the NSDA standards for bill writing, including proper formatting, effective policy proposals, and how to analyze legislation for debate.",
        objectives: [
          "Master NSDA bill formatting requirements",
          "Write clear, actionable policy proposals",
          "Analyze legislation for strengths and weaknesses",
          "Identify key debate points in any bill",
        ],
        pdfUrl: "/lessons/placeholder-2.pdf",
        isPdfLesson: true,
        fileName: "placeholder-2.pdf",
        phase: "Foundation"
      },
      {
        id: 3,
        title: "Advanced Argumentation Techniques",
        description: "Elevate your debate skills with advanced argumentation and refutation strategies.",
        duration: "90 min",
        difficulty: "Advanced",
        category: "Speaking",
        rating: 4.7,
        enrolled: 98,
        topics: ["Argumentation", "Refutation", "Strategy"],
        content: "Advanced techniques for constructing compelling arguments, effective refutation, and strategic debate positioning.",
        objectives: [
          "Master advanced argument structures",
          "Develop effective refutation techniques",
          "Learn strategic debate positioning",
          "Practice complex argument interactions",
        ],
        pdfUrl: "/lessons/placeholder-3.pdf",
        isPdfLesson: true,
        fileName: "placeholder-3.pdf",
        phase: "Foundation"
      }
    ]
  }

  // Lesson-specific objectives
  const lessonObjectives: { [key: string]: string[] } = {
    "General Overview + Schedule": [
      "Understand the structure of the debate season",
      "Familiarize with key dates and milestones",
      "Set personal goals for WACFL tournaments"
    ],
    "Congressional Debate Basics": [
      "Learn the basic format of congressional debate",
      "Understand chamber procedures",
      "Identify key roles and responsibilities"
    ],
    "Speech Structures + Round Strategy": [
      "Master speech organization",
      "Develop round strategies",
      "Practice transitions and signposting"
    ],
    "Intros + Rhetoric": [
      "Craft engaging introductions",
      "Apply rhetorical devices",
      "Capture audience attention"
    ],
    "Presentation & Delivery": [
      "Improve vocal delivery",
      "Enhance body language",
      "Build confidence in public speaking"
    ],
    "Argument Construction": [
      "Structure arguments logically",
      "Support claims with evidence",
      "Avoid logical fallacies"
    ],
    "Logical Reasoning": [
      "Apply critical thinking",
      "Identify logical flaws",
      "Strengthen argument validity"
    ],
    "Contention Structure Practice": [
      "Build clear contentions",
      "Practice with real examples",
      "Organize evidence effectively"
    ],
    "Introduction to Refutation & Weighing": [
      "Learn refutation basics",
      "Practice weighing arguments",
      "Respond to opposing claims"
    ],
    "Refutations": [
      "Develop advanced refutation skills",
      "Defend your arguments",
      "Turn opponent points"
    ],
    "Cross Examination": [
      "Ask effective questions",
      "Expose weaknesses in arguments",
      "Control the narrative"
    ],
    "Impacting": [
      "Demonstrate argument significance",
      "Connect impacts to the resolution",
      "Prioritize key issues"
    ],
    "Parliamentary Procedure": [
      "Understand motions and rules",
      "Participate in chamber business",
      "Apply procedure in rounds"
    ],
    "Presiding Guide": [
      "Learn presiding officer duties",
      "Manage debate sessions",
      "Ensure fair proceedings"
    ],
    "Legislation, Civics, & Research": [
      "Research legislation effectively",
      "Understand civic processes",
      "Develop policy expertise"
    ],
    "Practice Drills": [
      "Reinforce debate skills",
      "Practice under timed conditions",
      "Receive actionable feedback"
    ],
    "Advanced Rhetoric": [
      "Use advanced rhetorical strategies",
      "Persuade diverse audiences",
      "Refine speaking style"
    ],
    "Argument Generation Bonus Lecture": [
      "Generate creative arguments",
      "Adapt to any topic",
      "Think on your feet"
    ],
    "Extemporaneous-Speaking-Textbook": [
      "Master extemporaneous speaking",
      "Organize speeches quickly",
      "Respond to prompts effectively"
    ]
  }

  // Generate lessons based on actual filenames
  return lessonFiles.map((fileName, index) => {
    // Extract lesson info from filename
    const nameWithoutExt = fileName.replace('.pdf', '')
    
    // Generate title from filename - handle various naming patterns
    let title = nameWithoutExt
    
    // Remove common prefixes and suffixes
    title = title.replace(/^Copy of /, '') // Remove "Copy of" prefix
    title = title.replace(/ - OVERVIEW$/, '') // Remove " - OVERVIEW" suffix
    title = title.replace(/ - How to_$/, '') // Remove " - How to_" suffix
    title = title.replace(/ - \d{4}$/, '') // Remove year suffixes like " - 2025"
    title = title.replace(/ Bonus Lecture \d{4}$/, '') // Remove " Bonus Lecture 2025"
    title = title.replace(/ 'til WACFL 1$/, '') // Remove schedule suffix
    title = title.replace(/ - RR$/, '') // Remove " - RR" suffix
    
    // Clean up extra spaces and formatting
    title = title.replace(/\s+/g, ' ').trim()
    
    // Determine category and difficulty based on filename or content
    const category = determineCategory(fileName)
    const difficulty = determineDifficulty(fileName)
    
    // Generate more specific descriptions based on content
    const description = generateDescription(title, category, difficulty)
    
    return {
      id: index + 1,
      title: title,
      description: description,
      duration: generateDuration(fileName),
      difficulty: difficulty,
      category: category,
      rating: 4.5 + (Math.random() * 0.5), // Random rating between 4.5-5.0
      enrolled: 100 + Math.floor(Math.random() * 100),
      topics: generateTopics(category),
      content: `This comprehensive lesson provides in-depth coverage of ${title.toLowerCase()} with practical examples, exercises, and real-world applications for congressional debate.`,
      objectives: lessonObjectives[title] || generateObjectives(category),
      pdfUrl: `/lessons/${fileName}`,
      isPdfLesson: true,
      fileName: fileName,
      phase: determinePhase(fileName)
    }
  })
}

// Helper functions to categorize lessons
const determineCategory = (fileName: string): string => {
  const lower = fileName.toLowerCase()
  if (lower.includes('speech') || lower.includes('presentation') || lower.includes('delivery') || 
      lower.includes('rhetoric') || lower.includes('intro') || lower.includes('argument') ||
      lower.includes('extemporaneous')) return "Speaking"
  if (lower.includes('legislation') || lower.includes('civics') || lower.includes('research')) return "Writing"
  if (lower.includes('refutation') || lower.includes('cross examination') || lower.includes('weighing') ||
      lower.includes('impacting') || lower.includes('logical reasoning')) return "Research"
  if (lower.includes('procedure') || lower.includes('parliamentary') || lower.includes('presiding')) return "Procedure"
  if (lower.includes('practice') || lower.includes('drills') || lower.includes('basics') || 
      lower.includes('overview') || lower.includes('structure')) return "Speaking"
  return "Speaking" // Default
}

const determineDifficulty = (fileName: string): string => {
  const lower = fileName.toLowerCase()
  
  // Phase 1: Foundation (Beginner)
  if (lower.includes('overview') || lower.includes('basics') || lower.includes('introduction') ||
      lower.includes('presentation') || lower.includes('delivery') || lower.includes('intro')) {
    return "Beginner"
  }
  
  // Phase 2: Structure & Argumentation (Beginner-Intermediate)
  if (lower.includes('speech structures') || lower.includes('argument construction') ||
      lower.includes('logical reasoning') || lower.includes('contention structure')) {
    return "Beginner"
  }
  
  // Phase 3: Refutation & Analysis (Intermediate)
  if (lower.includes('refutation') || lower.includes('cross examination') || 
      lower.includes('weighing') || lower.includes('impacting')) {
    return "Intermediate"
  }
  
  // Phase 4: Procedure & Research (Intermediate)
  if (lower.includes('procedure') || lower.includes('parliamentary') || 
      lower.includes('presiding') || lower.includes('legislation') || 
      lower.includes('civics') || lower.includes('research')) {
    return "Intermediate"
  }
  
  // Phase 5: Practice & Advanced Techniques (Intermediate-Advanced)
  if (lower.includes('practice') || lower.includes('drills')) {
    return "Intermediate"
  }
  
  // Phase 6: Advanced Techniques (Advanced)
  if (lower.includes('advanced') || lower.includes('bonus lecture') || 
      lower.includes('textbook') || lower.includes('extemporaneous')) {
    return "Advanced"
  }
  
  return "Intermediate" // Default
}

const generateDescription = (title: string, category: string, difficulty: string): string => {
  const descriptions: { [key: string]: string } = {
    "General Overview + Schedule 'til WACFL 1": "Complete overview of the debate season with schedule and key milestones for WACFL tournaments.",
    "Congressional Debate Basics": "Essential introduction to congressional debate format, procedures, and fundamental concepts.",
    "Speech Structures + Round Strategy": "Master the art of structuring effective speeches and developing winning round strategies.",
    "Intros + Rhetoric": "Learn powerful introduction techniques and advanced rhetorical devices to captivate your audience.",
    "Presentation & Delivery": "Perfect your speaking delivery, body language, and presentation skills for maximum impact.",
    "Argument Construction": "Build compelling arguments with proper structure, evidence, and logical reasoning.",
    "Logical Reasoning": "Develop critical thinking skills and master logical argumentation techniques.",
    "Contention Structure Practice": "Practice building and organizing contentions with hands-on exercises and examples.",
    "Introduction to Refutation & Weighing": "Learn the fundamentals of refuting arguments and weighing competing claims.",
    "Refutations": "Advanced techniques for effectively refuting opponent arguments and defending your positions.",
    "Cross Examination": "Master the art of cross-examination to strengthen your arguments and weaken opponents.",
    "Impacting": "Learn how to effectively impact your arguments and demonstrate their significance.",
    "Parliamentary Procedure": "Understand parliamentary procedure and chamber rules for effective debate participation.",
    "Presiding Guide": "Complete guide to presiding over congressional debate sessions and managing chamber procedures.",
    "Legislation, Civics, & Research": "Learn how to research legislation, understand civics, and develop policy expertise.",
    "Practice Drills": "Interactive practice exercises to reinforce debate skills and improve performance.",
    "Advanced Rhetoric": "Advanced rhetorical techniques and persuasive speaking strategies for experienced debaters.",
    "Argument Generation Bonus Lecture": "Bonus content on generating creative and effective arguments for any topic.",
    "Extemporaneous-Speaking-Textbook": "Comprehensive textbook covering all aspects of extemporaneous speaking."
  }
  
  return descriptions[title] || `Comprehensive lesson on ${title.toLowerCase()} designed for ${difficulty.toLowerCase()} level debaters.`
}

const generateDuration = (fileName: string): string => {
  const lower = fileName.toLowerCase()
  if (lower.includes('overview') || lower.includes('basics') || lower.includes('introduction')) return "45 min"
  if (lower.includes('advanced') || lower.includes('textbook') || lower.includes('comprehensive')) return "90 min"
  if (lower.includes('practice') || lower.includes('drills')) return "60 min"
  if (lower.includes('bonus lecture')) return "30 min"
  return "60 min" // Default
}

const generateTopics = (category: string): string[] => {
  const topicMap = {
    "Speaking": ["Argumentation", "Delivery", "Strategy"],
    "Writing": ["Legislation", "Analysis", "Formatting"],
    "Research": ["Sources", "Evidence", "Data"],
    "Procedure": ["Motions", "Chamber", "Rules"]
  }
  return topicMap[category as keyof typeof topicMap] || ["Debate", "Skills"]
}

const generateObjectives = (category: string): string[] => {
  const objectiveMap = {
    "Speaking": [
      "Master effective argument delivery",
      "Develop persuasive speaking techniques",
      "Improve debate strategy and timing"
    ],
    "Writing": [
      "Learn proper legislation formatting",
      "Master bill analysis techniques",
      "Develop effective policy proposals"
    ],
    "Research": [
      "Find and evaluate credible sources",
      "Present evidence effectively",
      "Build data-driven arguments"
    ],
    "Procedure": [
      "Master parliamentary procedures",
      "Navigate chamber rules effectively",
      "Handle procedural challenges"
    ]
  }
  return objectiveMap[category as keyof typeof objectiveMap] || [
    "Improve debate skills",
    "Master core concepts",
    "Apply techniques effectively"
  ]
}

const determinePhase = (fileName: string): string => {
  const lower = fileName.toLowerCase()
  
  // Phase 1: Foundation
  if (lower.includes('overview') || lower.includes('basics') || lower.includes('introduction') ||
      lower.includes('presentation') || lower.includes('delivery') || lower.includes('intro')) {
    return "Phase 1: Foundation"
  }
  
  // Phase 2: Structure & Argumentation
  if (lower.includes('speech structures') || lower.includes('argument construction') ||
      lower.includes('logical reasoning') || lower.includes('contention structure')) {
    return "Phase 2: Structure & Argumentation"
  }
  
  // Phase 3: Refutation & Analysis
  if (lower.includes('refutation') || lower.includes('cross examination') || 
      lower.includes('weighing') || lower.includes('impacting')) {
    return "Phase 3: Refutation & Analysis"
  }
  
  // Phase 4: Procedure & Research
  if (lower.includes('procedure') || lower.includes('parliamentary') || 
      lower.includes('presiding') || lower.includes('legislation') || 
      lower.includes('civics') || lower.includes('research')) {
    return "Phase 4: Procedure & Research"
  }
  
  // Phase 5: Practice & Advanced Techniques
  if (lower.includes('practice') || lower.includes('drills')) {
    return "Phase 5: Practice & Advanced Techniques"
  }
  
  // Phase 6: Specialized Skills
  if (lower.includes('advanced') || lower.includes('bonus lecture') || 
      lower.includes('textbook') || lower.includes('extemporaneous')) {
    return "Phase 6: Specialized Skills"
  }
  
  return "Phase 1: Foundation" // Default
}

const categories = ["All", "Speaking", "Writing", "Research", "Procedure"]
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]
const phases = [
  "All",
  "Phase 1: Foundation",
  "Phase 2: Structure & Argumentation", 
  "Phase 3: Refutation & Analysis",
  "Phase 4: Procedure & Research",
  "Phase 5: Practice & Advanced Techniques",
  "Phase 6: Specialized Skills"
]

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [showPdf, setShowPdf] = useState(false)
  const [showSecureViewer, setShowSecureViewer] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [selectedPhase, setSelectedPhase] = useState("All")
  const [enrolledLessons, setEnrolledLessons] = useState<{ [fileName: string]: number }>({})
  const [userEnrollments, setUserEnrollments] = useState<{ [fileName: string]: boolean }>({})
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [userRatings, setUserRatings] = useState<{ [fileName: string]: number }>({})
  const [averageRatings, setAverageRatings] = useState<{ [fileName: string]: number | null }>({})
  const [ratingCounts, setRatingCounts] = useState<{ [fileName: string]: number }>({})
  const [ratingSubmitting, setRatingSubmitting] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [ratingLesson, setRatingLesson] = useState<string | null>(null)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Load lessons on component mount
  useEffect(() => {
    const generatedLessons = generateLessonsFromFiles()
    setLessons(generatedLessons)
  }, [])

  // Check for rating modal flag on mount
  useEffect(() => {
    const showRatingFlag = localStorage.getItem('showRatingModal');
    if (showRatingFlag) {
      setRatingLesson(showRatingFlag);
      // Clear the flag
      localStorage.removeItem('showRatingModal');
      // Show modal with a delay for smooth fade-in, but only if logged in
      setTimeout(() => {
        if (isLoggedIn) {
          setShowRatingModal(true);
        }
      }, 600);
    }
  }, [isLoggedIn]);

  // Check user authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setIsLoggedIn(!!data.user);
        console.log('Auth check result:', data);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch enrollments for all lessons on mount
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
      const generatedLessons = generateLessonsFromFiles();
      const results = await Promise.all(
        generatedLessons.map(async (lesson) => {
            try {
          const res = await fetch(`/api/lessons/${encodeURIComponent(lesson.fileName)}/enrollment`);
              if (!res.ok) {
                console.error(`Enrollment fetch failed for ${lesson.fileName}:`, res.status);
                return { total: 0, isEnrolled: false };
              }
              const data = await res.json();
              console.log(`Enrollment data for ${lesson.fileName}:`, data);
              return data;
            } catch (error) {
              console.error(`Error fetching enrollment for ${lesson.fileName}:`, error);
              return { total: 0, isEnrolled: false };
            }
        })
      );
      const enrolledMap: { [fileName: string]: number } = {};
      const userMap: { [fileName: string]: boolean } = {};
      generatedLessons.forEach((lesson, i) => {
        enrolledMap[lesson.fileName] = results[i].total;
        userMap[lesson.fileName] = results[i].isEnrolled;
      });
        console.log('Final enrollment maps:', { enrolledMap, userMap });
      setEnrolledLessons(enrolledMap);
      setUserEnrollments(userMap);
      } catch (error) {
        console.error('Error in fetchEnrollments:', error);
      }
    };
    fetchEnrollments();
  }, []);

  // Function to refresh enrollments (accessible from button handlers)
  const refreshEnrollments = async () => {
    const generatedLessons = generateLessonsFromFiles();
    const results = await Promise.all(
      generatedLessons.map(async (lesson) => {
        const res = await fetch(`/api/lessons/${encodeURIComponent(lesson.fileName)}/enrollment`);
        if (!res.ok) return { total: 0, isEnrolled: false };
        return res.json();
      })
    );
    const enrolledMap: { [fileName: string]: number } = {};
    const userMap: { [fileName: string]: boolean } = {};
    generatedLessons.forEach((lesson, i) => {
      enrolledMap[lesson.fileName] = results[i].total;
      userMap[lesson.fileName] = results[i].isEnrolled;
    });
    setEnrolledLessons(enrolledMap);
    setUserEnrollments(userMap);
  };

  // Fetch ratings for all lessons on mount
  useEffect(() => {
    const fetchRatings = async () => {
      const generatedLessons = generateLessonsFromFiles();
      const results = await Promise.all(
        generatedLessons.map(async (lesson) => {
          const res = await fetch(`/api/lessons/${encodeURIComponent(lesson.fileName)}/rating`);
          if (!res.ok) return { fileName: lesson.fileName, userRating: 0, averageRating: null, count: 0 };
          const data = await res.json();
          return {
            fileName: lesson.fileName,
            userRating: data.userRating || 0,
            averageRating: data.averageRating,
            count: data.count,
          };
        })
      );
      const userRatingsObj: { [fileName: string]: number } = {};
      const averageRatingsObj: { [fileName: string]: number | null } = {};
      const ratingCountsObj: { [fileName: string]: number } = {};
      results.forEach(r => {
        userRatingsObj[r.fileName] = r.userRating;
        averageRatingsObj[r.fileName] = r.averageRating;
        ratingCountsObj[r.fileName] = r.count;
      });
      setUserRatings(userRatingsObj);
      setAverageRatings(averageRatingsObj);
      setRatingCounts(ratingCountsObj);
    };
    fetchRatings();
  }, []);

  // Global security measures
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common screenshot and developer tools shortcuts
      if (
        (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'u')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.metaKey && e.shiftKey && e.key === '4') || // Mac screenshot
        (e.metaKey && e.shiftKey && e.key === '3') || // Mac screenshot
        (e.key === 'PrintScreen') || // Windows screenshot
        (e.ctrlKey && e.key === 'PrintScreen') // Windows screenshot
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Add global event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Reset PDF view when dialog opens/closes
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setShowPdf(false)
      setSelectedLesson(null)
    }
  }

  // Fetch login state when PDF dialog opens
  useEffect(() => {
    if (showPdf) {
      fetch('/api/auth/me')
        .then(res => res.json())
        .then(data => setIsLoggedIn(!!data.user))
        .catch(() => setIsLoggedIn(false));
    }
  }, [showPdf]);

  // Handle rating submission per lesson
  const handleRateLesson = async (value: number) => {
    if (!selectedLesson) return;
    setRatingSubmitting(true);
    await fetch(`/api/lessons/${encodeURIComponent(selectedLesson.fileName)}/rating`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: value }),
    });
    // Refetch rating for this lesson
    const res = await fetch(`/api/lessons/${encodeURIComponent(selectedLesson.fileName)}/rating`);
    if (res.ok) {
      const data = await res.json();
      setUserRatings(prev => ({ ...prev, [selectedLesson.fileName]: data.userRating || 0 }));
      setAverageRatings(prev => ({ ...prev, [selectedLesson.fileName]: data.averageRating }));
      setRatingCounts(prev => ({ ...prev, [selectedLesson.fileName]: data.count }));
    }
    setRatingSubmitting(false);
  }

  const handleSubmitRating = async () => {
    if (rating === 0 || !ratingLesson) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/lessons/${encodeURIComponent(ratingLesson)}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, feedback }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update the lesson's rating data
        setAverageRatings(prev => ({ ...prev, [ratingLesson]: data.averageRating }));
        setRatingCounts(prev => ({ ...prev, [ratingLesson]: data.count }));
        // Close modal
        setShowRatingModal(false);
        setRatingLesson(null);
        setRating(0);
        setFeedback("");
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipRating = () => {
    setShowRatingModal(false);
    setRatingLesson(null);
    setRating(0);
    setFeedback("");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-gray-100 text-gray-800"
      case "Intermediate":
        return "bg-red-100 text-red-800"
      case "Advanced":
        return "bg-gray-900 text-white"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Speaking":
        return Target
      case "Writing":
        return BookOpen
      case "Research":
        return Search
      case "Procedure":
        return Zap
      default:
        return BookOpen
    }
  }

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.topics.some((topic) => topic.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || lesson.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || lesson.difficulty === selectedDifficulty
    const matchesPhase = selectedPhase === "All" || lesson.phase === selectedPhase

    return matchesSearch && matchesCategory && matchesDifficulty && matchesPhase
  })

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-transparent" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="fade" className="text-center">
            <Badge className="bg-red-100 text-red-800 mb-6 px-4 py-2 text-sm font-medium border border-red-200 shadow-sm">
              Educational Resources
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Master Congressional{" "}
              <span className="text-red-600 relative">
                Debate
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse" />
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Comprehensive lessons designed to elevate your debate skills from fundamentals to advanced techniques.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" className="space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search lessons, topics, or skills..."
                className="pl-10 py-3 border-gray-300 focus:border-red-500 focus:ring-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 border-gray-300">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-40 border-gray-300">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                <SelectTrigger className="w-40 border-gray-300">
                  <SelectValue placeholder="Phase" />
                </SelectTrigger>
                <SelectContent>
                  {phases.map((phase) => (
                    <SelectItem key={phase} value={phase}>
                      {phase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Lessons Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredLessons.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No lessons found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLessons.map((lesson, index) => {
                const CategoryIcon = getCategoryIcon(lesson.category)
                return (
                  <ScrollAnimation key={lesson.id} direction="up" delay={index * 50}>
                    <Card className="flex flex-col h-full min-w-[320px] max-w-[370px] bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 group">
                      <CardHeader className="pb-2 pt-5 px-6">
                        <div className="flex justify-between items-start mb-2">
                          <div className="bg-red-100 p-3 rounded-xl group-hover:bg-red-200 transition-colors">
                            <CategoryIcon className="w-6 h-6 text-red-600" />
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                          <Badge className={getDifficultyColor(lesson.difficulty)}>{lesson.difficulty}</Badge>
                            <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50 mt-1">
                              {lesson.phase.split(': ')[1]}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-xl text-gray-900 group-hover:text-red-600 transition-colors leading-tight mt-2 mb-1 truncate">
                          {lesson.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 leading-relaxed mb-3 line-clamp-2">
                          {lesson.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col flex-1 justify-between px-6 pb-6 pt-0">
                        {/* Stats Row */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{lesson.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>
                              {enrolledLessons[lesson.fileName] !== undefined 
                                ? `${enrolledLessons[lesson.fileName]} enrolled` 
                                : '— enrolled'}
                              {/* Debug: {JSON.stringify(enrolledLessons[lesson.fileName])} */}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>
                              {averageRatings[lesson.fileName] !== null && averageRatings[lesson.fileName] !== undefined
                                ? `${averageRatings[lesson.fileName]!.toFixed(1)} (${ratingCounts[lesson.fileName] || 0})` 
                                : '—'}
                            </span>
                          </div>
                        </div>
                        {/* Topics */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {lesson.topics.map((topic, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs border-gray-300 text-gray-700 bg-gray-50 hover:border-red-300 hover:text-red-700 transition-colors"
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                        {/* Start Lesson button (visual only, no backend logic) */}
                        <div className="mt-auto pt-2">
                          <Button
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300"
                            type="button"
                            onClick={async () => { 
                              // If not enrolled, enroll the user first
                              if (!userEnrollments[lesson.fileName]) {
                                try {
                                  const response = await fetch(`/api/lessons/${encodeURIComponent(lesson.fileName)}/enrollment`, {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                  });
                                  
                                  if (response.ok) {
                                    const data = await response.json();
                                    // Update local state to reflect enrollment
                                    setUserEnrollments(prev => ({
                                      ...prev,
                                      [lesson.fileName]: true
                                    }));
                                    // Update the global count immediately with the response
                                    setEnrolledLessons(prev => ({
                                      ...prev,
                                      [lesson.fileName]: data.total
                                    }));
                                  }
                                } catch (error) {
                                  console.error('Failed to enroll in lesson:', error);
                                }
                              }
                              
                              setSelectedLesson(lesson); 
                              setShowPdf(true); 
                            }}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            <span>
                              {userEnrollments[lesson.fileName] ? "Revisit Lesson" : "Start Lesson"}
                              {/* Debug: {JSON.stringify(userEnrollments[lesson.fileName])} */}
                            </span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollAnimation>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* PDF Preview Dialog (small box) */}
      <Dialog open={showPdf} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-2xl w-full p-0 overflow-visible rounded-2xl shadow-2xl border-2 border-red-200 bg-white flex flex-col items-center" style={{ minHeight: 'unset', paddingTop: 0, paddingBottom: 0 }}>
          {/* DialogTitle for accessibility (visually hidden) */}
          <DialogTitle className="sr-only">Lesson Preview</DialogTitle>
          {/* Custom Close Button */}
          <button
            onClick={() => handleDialogOpenChange(false)}
            className="absolute top-4 right-4 z-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 shadow transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* Centered Title */}
          <div className="w-full text-center pt-8 pb-2 px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
              <span className="relative inline-block">
                {selectedLesson?.title}
                <span className="block h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full mt-1 animate-pulse" />
              </span>
            </h2>
            <p className="text-sm text-gray-500 font-medium mb-2">PDF Lesson</p>
          </div>

          {/* Preview/Info */}
          <div className="w-full flex flex-col items-center justify-center px-6 pb-4">
            {/* PDF first page thumbnail */}
            <div className="w-[400px] h-[180px] bg-gray-100 rounded-lg flex items-center justify-center mb-4 border border-gray-200 overflow-hidden">
              {selectedLesson && <PDFPreview file={selectedLesson.pdfUrl} />}
            </div>
            {/* Lesson Info */}
            {selectedLesson && (
              <div className="text-gray-700 text-center mb-2 w-full">
                <div className="flex flex-wrap justify-center gap-2 mb-2">
                  <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">{selectedLesson.duration}</span>
                  <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">{selectedLesson.difficulty}</span>
                </div>
                <div className="mb-2 text-sm text-gray-600">{selectedLesson.description}</div>
                {selectedLesson.objectives && selectedLesson.objectives.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-semibold text-gray-500 mb-1">Objectives:</div>
                    <ul className="list-disc list-inside text-xs text-gray-600 text-left mx-auto max-w-xs">
                      {selectedLesson.objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <div className="text-gray-700 text-center mb-2">
              <span className="font-semibold">Ready to view the lesson PDF?</span><br />
              Click below to open the secure PDF viewer.
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full flex justify-center pb-6">
            <button
              onClick={async () => {
                if (selectedLesson) {
                  // If not enrolled, enroll the user first
                  if (!userEnrollments[selectedLesson.fileName]) {
                    try {
                      const response = await fetch(`/api/lessons/${encodeURIComponent(selectedLesson.fileName)}/enrollment`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                      });
                      
                      if (response.ok) {
                        const data = await response.json();
                        // Update local state to reflect enrollment
                        setUserEnrollments(prev => ({
                          ...prev,
                          [selectedLesson.fileName]: true
                        }));
                        // Update the global count immediately with the response
                        setEnrolledLessons(prev => ({
                          ...prev,
                          [selectedLesson.fileName]: data.total
                        }));
                      }
                    } catch (error) {
                      console.error('Failed to enroll in lesson:', error);
                    }
                  }
                  
                  router.push(`/lessons/viewer?file=${encodeURIComponent(selectedLesson.pdfUrl)}`);
                  setShowPdf(false);
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow transition-all focus:outline-none focus:ring-2 focus:ring-red-400 text-lg"
            >
              <span>
                {selectedLesson && userEnrollments[selectedLesson.fileName] ? "Revisit Lesson" : "Open Lesson"}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rating Modal - appears with smooth fade-in */}
      {showRatingModal && ratingLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How was this lesson?</h2>
              <p className="text-gray-600 mb-2">Your feedback helps us improve our content!</p>
              <p className="text-sm font-medium text-red-600">
                {ratingLesson?.replace('.pdf', '')}
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center mb-6">
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                size="lg"
              />
            </div>

            {/* Feedback Textarea */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional feedback (optional)
              </label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What did you think of this lesson? Any suggestions for improvement?"
                className="w-full"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleSkipRating}
                className="flex-1"
              >
                Skip
              </Button>
              <Button
                onClick={handleSubmitRating}
                disabled={rating === 0 || isSubmitting}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
