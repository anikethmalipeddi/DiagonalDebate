"use client"

import React, { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  AlertCircle,
  Lightbulb,
  FileText,
  Send,
  CheckCircle2,
  Zap,
  BookOpen,
  Target,
  Sparkles,
  Clock,
  Shield,
  Award,
  Puzzle,
} from "lucide-react"
import { Toaster, toast } from "sonner"
import { ScrollAnimation } from "@/components/scroll-animation"

type GrammarSpellingError = {
  message: string
  context: string
  offset: number
  length: number
  replacements: string[]
  rule: string
}

const legislationTypes = [
  {
    value: "bill",
    label: "Bill",
    icon: FileText,
    description: "Creates/changes a law.",
  },
  {
    value: "resolution",
    label: "Resolution",
    icon: Target,
    description: "Expresses an opinion/stance.",
  },
  {
    value: "amendment",
    label: "Amendment",
    icon: Zap,
    description: "Modifies existing legislation.",
  },
]

const categories = [
  { value: "domestic", label: "Domestic", icon: Shield, description: "Internal affairs and policies" },
  { value: "economic", label: "Economic", icon: Award, description: "Financial and trade matters" },
  { value: "international", label: "International", icon: BookOpen, description: "Foreign policy and relations" },
]

const titlePlaceholders: Record<string, string> = {
  bill: 'A Bill to [action word] [article] [subject] to [reason]',
  amendment: 'A Resolution to Amend the Constitution [to… Summarize the Solution Specifically]',
  resolution: 'A Resolution to [Action Word] [article] [Object] to [Summarize the Solution Specifically]'
}
const titleStarters: Record<string, string> = {
  bill: 'A Bill to',
  amendment: 'A Resolution to Amend the Constitution',
  resolution: 'A Resolution to'
}

// Update the availableNumbers to be dynamic based on category
const getAvailableNumbers = (category: string) => {
  const prefix = category.charAt(0).toUpperCase()
  return Array.from({ length: 20 }, (_, i) => `${prefix}${410 + i}`)
}

export default function LegislationCheckerPage() {
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    number: "",
    title: "",
    text: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingStage, setLoadingStage] = useState("")
  const [numberingError, setNumberingError] = useState<string | null>(null)
  const [isReviewed, setIsReviewed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{
    templateErrors: string[]
    grammarSpellingErrors: GrammarSpellingError[]
    grammar: string[]
    readability: { score: number; suggestions: string[] }
    aiSuggestions: string[]
    isSubmittable: boolean
    grammarSpellingRateLimited: boolean
    overallScore?: number
  }>({
    templateErrors: [],
    grammarSpellingErrors: [],
    grammar: [],
    readability: { score: 0, suggestions: [] },
    aiSuggestions: [],
    isSubmittable: false,
    grammarSpellingRateLimited: false,
  })
  const [userFirstName, setUserFirstName] = useState<string>("")
  const [userFullName, setUserFullName] = useState<string>("")
  const [bodyWarning, setBodyWarning] = useState<string>("")
  const [titleWarning, setTitleWarning] = useState<string>("")
  const [titleFontSize, setTitleFontSize] = useState<number>(16)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const titleMeasureRef = useRef<HTMLSpanElement>(null)
  const [showNumberSuggestions, setShowNumberSuggestions] = useState(false)
  const [filteredNumbers, setFilteredNumbers] = useState<string[]>([])

  // Update filtered numbers when category changes
  useEffect(() => {
    if (formData.category) {
      const availableNumbers = getAvailableNumbers(formData.category)
      setFilteredNumbers(availableNumbers)
    } else {
      setFilteredNumbers([])
    }
  }, [formData.category])

  // Fetch user first name on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.user && data.user.name) {
          const firstName = data.user.name.split(" ")[0]
          setUserFirstName(firstName)
          setUserFullName(data.user.name)
        }
      })
  }, [])

  // Validate body for name/title
  useEffect(() => {
    const body = formData.text.toLowerCase()
    const title = formData.title.toLowerCase()
    const name = userFirstName.toLowerCase()
    let warning = ""

    // 1. Block title in body
    if (body && (body.includes(title) && title.length > 0)) {
      warning = "Do not include the title in the body of your legislation."
    }
    // 2. Block user's name in body
    else if (body && name && name.length > 0 && body.includes(name)) {
      warning = "Do not include your name in the body of your legislation."
    }
    // 3. Block submission signature phrases
    else if (["respectfully submitted", "representative", "rock ridge high school", name].some(phrase => phrase && body.includes(phrase))) {
      warning = "Do not include any part of the submission signature (e.g., 'Respectfully Submitted', 'Representative', 'Rock Ridge High School', or your name) in the body of your legislation."
    }
    // 3.5. Block enactment clause in body for bills
    else if (
      formData.type === 'bill' &&
      /be\s*it\s*enacted\s*by\s*the\s*congress\s*here\s*assembled\s*that\s*:?/i.test(body.replace(/\s+/g, ' '))
    ) {
      warning = "Do not include the enactment clause ('BE IT ENACTED BY THE CONGRESS HERE ASSEMBLED THAT:') in the body of your legislation. The system will add it automatically."
    }
    // 4. Block line numbers at the start of lines (not part of section headers)
    else if (formData.text.split(/\n/).some(line => {
      const trimmed = line.trim()
      return /^\d{1,3}(\.|:|\s)/.test(trimmed) && !/^section\s+\d+\./i.test(trimmed)
    })) {
      warning = "Do not include line numbers at the start of lines in your legislation text."
    }
    // 5. Block 3+ consecutive lines that are just numbers (with optional whitespace)
    else {
      const lines = formData.text.split(/\n/)
      let consecutive = 0
      for (let i = 0; i < lines.length; i++) {
        if (/^\s*\d{1,3}\s*$/.test(lines[i])) {
          consecutive++
          if (consecutive >= 3) {
            warning = "Do not include pasted line number blocks in your legislation text."
            break
          }
        } else {
          consecutive = 0
        }
      }
    }
    setBodyWarning(warning)
  }, [formData.text, formData.title, userFirstName, formData.type])

  // Loading animation with stages
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isLoading) {
      const stages = [
        { stage: "Analyzing structure", progress: 20 },
        { stage: "Checking grammar", progress: 40 },
        { stage: "Evaluating readability", progress: 60 },
        { stage: "Generating AI insights", progress: 80 },
        { stage: "Finalizing review", progress: 100 },
      ]

      let currentStage = 0
      setLoadingProgress(0)
      setLoadingStage(stages[0].stage)

      interval = setInterval(() => {
        if (currentStage < stages.length - 1) {
          currentStage++
          setLoadingStage(stages[currentStage].stage)
          setLoadingProgress(stages[currentStage].progress)
        }
      }, 800)
    } else {
      setLoadingProgress(0)
      setLoadingStage("")
    }
    return () => clearInterval(interval)
  }, [isLoading])

  useEffect(() => {
    const { category, number } = formData
    if (category && number) {
      const numberParts = number.trim().split(/[\s.]+/)
      const idPart = numberParts[numberParts.length - 1]
      if (idPart) {
        const numberPrefix = idPart.charAt(0).toLowerCase()
        const categoryPrefix = category.charAt(0).toLowerCase()
        if (numberPrefix !== categoryPrefix) {
          setNumberingError(
            `Number prefix must match the category. Expected prefix: '${category.charAt(0).toUpperCase()}'`,
          )
        } else {
          setNumberingError(null)
        }
      }
    } else {
      setNumberingError(null)
    }
  }, [formData])

  useEffect(() => {
    // Title starter validation
    if (formData.type && formData.title) {
      const starter = titleStarters[formData.type]
      if (starter && !formData.title.trim().toLowerCase().startsWith(starter.toLowerCase())) {
        setTitleWarning(`Title must start with: '${starter}'`)
      } else {
        setTitleWarning("")
      }
    } else {
      setTitleWarning("")
    }
  }, [formData.type, formData.title])

  useEffect(() => {
    if (isReviewed && feedback.grammarSpellingRateLimited) {
      toast.warning("Grammar check temporarily unavailable", {
        description: "The grammar/spelling checker is experiencing high usage. Please try again in a minute.",
        duration: 6000,
      })
    }
  }, [isReviewed, feedback.grammarSpellingRateLimited])

  // Dynamically resize font size to fit input
  useEffect(() => {
    if (!titleInputRef.current || !titleMeasureRef.current) return
    const input = titleInputRef.current
    const measure = titleMeasureRef.current
    // Set the span's text to the input value or placeholder
    measure.textContent = formData.title || (titlePlaceholders[formData.type] || "Enter the full title of your legislation")
    // Get the input's width
    const inputWidth = input.offsetWidth - 24 // account for padding
    // Start from max font size and decrease until it fits or hits min
    let fontSize = 16
    measure.style.fontSize = fontSize + 'px'
    while (measure.offsetWidth > inputWidth && fontSize > 10) {
      fontSize -= 1
      measure.style.fontSize = fontSize + 'px'
    }
    setTitleFontSize(fontSize)
  }, [formData.title, formData.type])

  const isFormComplete = Object.values(formData).every((value) => value.trim() !== "") && numberingError === null && !titleWarning

  const getCompletionPercentage = () => {
    const fields = Object.values(formData)
    const completedFields = fields.filter((value) => value.trim() !== "").length
    return Math.round((completedFields / fields.length) * 100)
  }

  const handleReview = async () => {
    setIsLoading(true)
    setIsReviewed(false)
    try {
      const response = await fetch("/api/legislation-checker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: formData.text,
          type: formData.type,
          category: formData.category,
          number: formData.number,
          title: formData.title,
        }),
      })

      if (!response.ok) {
        if (response.status === 429) {
          toast.warning("Grammar check temporarily unavailable", {
            description: "The grammar/spelling checker is experiencing high usage (rate limit). Please try again in a minute.",
            duration: 6000,
          })
          setIsLoading(false)
          setIsReviewed(false)
          return
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to get feedback from the server.")
      }

      const data = await response.json()
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response from server')
      }
      setFeedback(data)
      if (data.isSubmittable && data.templateErrors.length === 0) {
        toast.success("Excellent Work!", {
          description: "Your legislation meets all requirements and is ready for submission.",
          duration: 5000,
        })
      } else {
        toast.warning("Needs Improvement", {
          description: "Your legislation needs some adjustments. Check the feedback for details.",
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Review error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while reviewing the legislation. Please try again.'
      toast.error("Review Failed", {
        description: errorMessage,
        duration: 6000,
      })
    } finally {
      setIsLoading(false)
      setIsReviewed(true)
    }
  }

  const getOverallScore = () => {
    if (!isReviewed) return 0
    // Use the AI-generated overall score from the backend
    return feedback.overallScore || 0
  }

  const handleSubmit = async () => {
    if (bodyWarning) {
      toast.error("Cannot Submit", {
        description: bodyWarning,
      })
      return
    }
    if (titleWarning) {
      toast.error("Cannot Submit", {
        description: titleWarning,
      })
      return
    }
    console.log('Submit button clicked!')
    console.log('Starting submission process...')
    if (!feedback.isSubmittable || feedback.templateErrors.length > 0) {
      console.log('Submission blocked by validation')
      toast.error("Cannot Submit", {
        description: "Please fix all template errors before submitting to captains.",
      })
      return
    }

    setIsSubmitting(true)
    console.log('Set isSubmitting to true')
    try {
      console.log('Making API call to /api/legislation-checker/submit')
      const response = await fetch('/api/legislation-checker/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          category: formData.category,
          number: formData.number,
          title: formData.title,
          content: formData.text,
          feedback: {
            overallScore: getOverallScore(),
            templateErrors: feedback.templateErrors,
            grammarSpellingErrors: feedback.grammarSpellingErrors,
            readability: feedback.readability,
            aiSuggestions: feedback.aiSuggestions,
          }
        }),
      })

      console.log('API response status:', response.status)
      if (!response.ok) {
        console.log('API call failed with status:', response.status)
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'Failed to submit legislation'
        const errorDetails = errorData.details || 'No additional details'
        console.log('Error details:', errorDetails)
        
        if (response.status === 401) {
          toast.error("Authentication Required", {
            description: "Please log in to submit legislation.",
          })
        } else {
          toast.error("Submission Failed", {
            description: `${errorMessage}: ${errorDetails}`,
          })
        }
        return
      }

      console.log('API call successful, parsing response...')
      const result = await response.json()
      console.log('Response parsed successfully:', result)
      
      // Show success message
      toast.success("Successfully Submitted!", {
        description: "Your legislation has been formatted as a PDF and emailed to your team captains for review.",
      })
      
      console.log('Resetting form...')
      // Add a delay to see if form reset is causing issues
      setTimeout(() => {
        // Reset form after successful submission
        setFormData({
          type: "bill",
          category: "",
          number: "",
          title: "",
          text: "",
        })
        setIsReviewed(false)
        setFeedback({
          templateErrors: [],
          grammarSpellingErrors: [],
          grammar: [],
          readability: { score: 0, suggestions: [] },
          aiSuggestions: [],
          isSubmittable: false,
          grammarSpellingRateLimited: false,
        })
        console.log('Form reset completed')
      }, 1000)

    } catch (error) {
      console.error('Error submitting legislation:', error)
      console.log('Caught error in submission:', error)
    } finally {
      console.log('Setting isSubmitting to false')
      setIsSubmitting(false)
    }
  }

  const renderFeedbackContent = (
    title: string,
    items: string[],
    iconColor: string,
    badgeClass: string,
    contentClass: string,
    icon: React.ElementType = AlertCircle,
  ) => {
    const hasItems = items.length > 0
    const finalBadgeClass = hasItems ? badgeClass : "bg-green-100 text-green-800"
    const IconComponent = icon

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          {hasItems ? (
            <IconComponent className={`w-6 h-6 ${iconColor}`} />
          ) : (
            <CheckCircle className="w-6 h-6 text-green-600" />
          )}
          <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
          <Badge className={`${finalBadgeClass} px-3 py-1 text-sm font-medium`}>{items.length}</Badge>
        </div>
        {hasItems ? (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className={`p-4 border rounded-lg ${contentClass} hover:shadow-sm transition-shadow`}>
                <p className="text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-green-200 rounded-xl bg-green-50">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-3" />
            <p className="text-lg font-semibold text-green-700 mb-1">Perfect!</p>
            <p className="text-sm text-green-600">No issues found in this category.</p>
          </div>
        )}
      </div>
    )
  }

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
              AI-Powered Analysis
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Perfect Your{" "}
              <span className="text-red-600 relative">
                Legislation
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse" />
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get instant feedback on formatting, grammar, and content quality. Submit with confidence.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <ScrollAnimation direction="left">
              <Card className="border-gray-200 shadow-xl bg-white h-fit">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-red-100 p-3 rounded-xl">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-gray-900">Legislation Details</CardTitle>
                      <CardDescription className="text-gray-600">
                        Complete all fields to enable AI review
                      </CardDescription>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Form Completion</span>
                      <span className="text-gray-900 font-medium">{getCompletionPercentage()}%</span>
                    </div>
                    <Progress value={getCompletionPercentage()} className="h-2" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Type and Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-gray-700 font-medium">
                        Legislation Type
                      </Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {legislationTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-5 py-1.5 min-h-[48px] w-full">
                                <type.icon className="w-4 h-4 flex-shrink-0" />
                                <div className={`flex flex-col justify-center w-full ${type.value === 'bill' ? 'pl-2' : 'pl-1'}`}>
                                  <div className="font-medium text-sm leading-tight break-words whitespace-normal w-full max-w-[180px]">{type.label}</div>
                                  <div className="text-[10px] text-gray-500 mt-0.5 leading-snug break-words whitespace-normal w-full max-w-[180px]">{type.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-gray-700 font-medium">
                        Category
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center gap-5 py-1.5 min-h-[48px] max-w-full">
                                <category.icon className="w-4 h-4 flex-shrink-0" />
                                <div className="flex flex-col justify-center w-full pl-1">
                                  <div className="font-medium text-sm leading-tight break-words whitespace-normal w-full max-w-[180px]">{category.label}</div>
                                  <div className="text-xs text-gray-500 mt-0.5 leading-snug break-words whitespace-normal w-full max-w-[180px]">{category.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Number */}
                  <div className="space-y-2">
                    <Label htmlFor="number" className="text-gray-700 font-medium">
                      Legislation ID
                    </Label>
                    <div className="relative">
                      <Input
                        id="number"
                        placeholder={formData.category ? `Select or enter a number (e.g., ${formData.category.charAt(0).toUpperCase()}410)` : "Select category first"}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                        value={formData.number}
                        onFocus={() => setShowNumberSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowNumberSuggestions(false), 100)}
                        onChange={e => {
                          setFormData({ ...formData, number: e.target.value })
                          setShowNumberSuggestions(true)
                          if (formData.category) {
                            const availableNumbers = getAvailableNumbers(formData.category)
                            setFilteredNumbers(availableNumbers.filter(num => num.toLowerCase().startsWith(e.target.value.toLowerCase())))
                          }
                        }}
                        autoComplete="off"
                        disabled={!formData.category}
                      />
                      {showNumberSuggestions && filteredNumbers.length > 0 && (
                        <div className="absolute z-10 bg-white border border-gray-200 rounded shadow w-full max-h-40 overflow-auto">
                          {filteredNumbers.map(num => (
                            <div
                              key={num}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                              onMouseDown={() => {
                                setFormData({ ...formData, number: num })
                                setShowNumberSuggestions(false)
                              }}
                            >
                              {num}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {numberingError && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <p className="text-sm">{numberingError}</p>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-700 font-medium">
                      Legislation Title
                    </Label>
                    <div className="relative">
                      <Input
                        id="title"
                        ref={titleInputRef}
                        placeholder={titlePlaceholders[formData.type] || "Enter the full title of your legislation"}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 pr-2"
                        style={{ fontSize: `${titleFontSize}px` }}
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                      {/* Hidden span for measuring text width */}
                      <span
                        ref={titleMeasureRef}
                        className="absolute invisible whitespace-pre pointer-events-none"
                        style={{
                          left: 0,
                          top: 0,
                          fontFamily: 'inherit',
                          fontWeight: 'inherit',
                          fontSize: `${titleFontSize}px`,
                          padding: '0 12px',
                          whiteSpace: 'pre',
                          visibility: 'hidden',
                          position: 'absolute',
                        }}
                      />
                    </div>
                    {titleWarning && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <p className="text-sm">{titleWarning}</p>
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="space-y-2">
                    <Label htmlFor="text" className="text-gray-700 font-medium">
                      Legislation Body Text
                    </Label>
                    <Textarea
                      id="text"
                      placeholder="Paste or type ONLY the body of your legislation here. Do not include the title or your name."
                      className="min-h-[300px] border-gray-300 focus:border-red-500 focus:ring-red-500 resize-none"
                      value={formData.text}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      disabled={isSubmitting}
                    />
                    <div className="text-xs text-gray-500">
                      {formData.text.length} characters • {formData.text.split(/\s+/).filter(Boolean).length} words
                    </div>
                    {bodyWarning && (
                      <div className="text-red-600 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {bodyWarning}
                      </div>
                    )}
                    {/* Uneditable Respectfully Submitted card */}
                    <div className="space-y-2 mt-6 mb-4">
                      <Label className="text-gray-700 font-medium">Submission Signature</Label>
                      <div className="min-h-[80px] border border-gray-300 bg-gray-50 rounded-md px-6 py-4 text-gray-700 text-sm whitespace-pre-line select-none">
                        Respectfully Submitted,
                        <br />Representative {userFullName ? userFullName : "_______"}
                        <br />Rock Ridge High School
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-3 pt-4">
                    <Button
                      onClick={handleReview}
                      variant="primary"
                      disabled={!isFormComplete || isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-5 h-5 animate-spin" />
                          <span>Analyzing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Zap className="w-5 h-5" />
                          <span>Review My Legislation</span>
                        </div>
                      )}
                    </Button>

                    {isReviewed && !isLoading && (
                      <Button
                        onClick={handleSubmit}
                        variant="primary"
                        disabled={!!bodyWarning || !isFormComplete || isLoading || !isReviewed || feedback.templateErrors.length > 0}
                        className="w-full text-lg font-bold py-3 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300"
                        title={
                          isSubmitting
                            ? "Submitting your legislation..."
                            : !isReviewed
                              ? "You must review your legislation before submitting."
                              : feedback.templateErrors.length > 0
                                ? "Submission is disabled until all template and critical issues are resolved."
                                : bodyWarning
                                  ? bodyWarning
                                  : titleWarning
                                    ? titleWarning
                                    : "Submit to your team captains"
                        }
                      >
                        <div className="flex items-center space-x-2">
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              <span>Submit to Captains</span>
                            </>
                          )}
                        </div>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>

            {/* Feedback Section */}
            <ScrollAnimation direction="right">
              <Card className="border-gray-200 shadow-xl bg-white h-fit">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-red-100 p-3 rounded-xl">
                      <Target className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl text-gray-900">AI Review Results</CardTitle>
                      <CardDescription className="text-gray-600">
                        {isLoading
                          ? "AI is analyzing your legislation..."
                          : isReviewed
                            ? "Review complete - check feedback below"
                            : "Submit your legislation for instant AI feedback"}
                      </CardDescription>
                    </div>
                    {isReviewed && !isLoading && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{getOverallScore()}</div>
                        <div className="text-xs text-gray-500">Overall Score</div>
                      </div>
                    )}
                  </div>

                  {/* Loading Progress */}
                  {isLoading && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-gray-700">{loadingStage}</span>
                      </div>
                      <Progress value={loadingProgress} className="h-2" />
                    </div>
                  )}
                </CardHeader>

                <CardContent>
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-96 space-y-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                        <Sparkles className="w-6 h-6 text-red-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium text-gray-900">{loadingStage}</p>
                        <p className="text-sm text-gray-600">This may take a few moments...</p>
                      </div>
                    </div>
                  ) : isReviewed ? (
                    <Tabs defaultValue="template" className="w-full">
                      <TabsList className="w-full gap-0 bg-gray-100 p-1 rounded-lg overflow-x-auto whitespace-nowrap flex">
                        <TabsTrigger value="template"><Puzzle className="w-4 h-4" />Template</TabsTrigger>
                        <TabsTrigger value="grammarSpelling"><CheckCircle className="w-4 h-4" />Grammar</TabsTrigger>
                        <TabsTrigger value="readability"><BookOpen className="w-4 h-4" />Readability</TabsTrigger>
                        <TabsTrigger value="ai"><Sparkles className="w-4 h-4" />AI Tips</TabsTrigger>
                      </TabsList>

                      <div className="mt-6">
                        <TabsContent value="template">
                          {renderFeedbackContent(
                            "Template Compliance",
                            feedback.templateErrors,
                            "text-red-600",
                            "bg-red-100 text-red-800",
                            "bg-red-50 border-red-200 text-red-800",
                            AlertCircle,
                          )}
                        </TabsContent>

                        <TabsContent value="grammarSpelling">
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="w-6 h-6 text-blue-600" />
                              <h3 className="font-semibold text-gray-900 text-lg">Grammar & Spelling</h3>
                              <Badge
                                className={
                                  feedback.grammarSpellingErrors.length > 0
                                    ? "bg-blue-100 text-blue-800 px-3 py-1 text-sm font-medium"
                                    : "bg-green-100 text-green-800 px-3 py-1 text-sm font-medium"
                                }
                              >
                                {feedback.grammarSpellingErrors.length}
                              </Badge>
                            </div>
                            {feedback.grammarSpellingErrors.length > 0 ? (
                              <div className="space-y-3">
                                {feedback.grammarSpellingErrors.map((err, idx) => (
                                  <div
                                    key={idx}
                                    className="p-4 border rounded-lg bg-blue-50 border-blue-200 hover:shadow-sm transition-shadow"
                                  >
                                    <div className="text-sm text-blue-900 font-medium mb-2">{err.message}</div>
                                    {err.context && (
                                      <div className="text-xs text-gray-700 mb-2 font-mono bg-white p-2 rounded border">
                                        ...{err.context.substring(0, err.offset)}
                                        <span className="bg-blue-200 text-blue-900 font-semibold px-1 rounded">
                                          {err.context.substring(err.offset, err.offset + err.length)}
                                        </span>
                                        {err.context.substring(err.offset + err.length)}...
                                      </div>
                                    )}
                                    {err.replacements && err.replacements.length > 0 && (
                                      <div className="text-xs text-blue-700 mb-1">
                                        <strong>Suggestions:</strong> {err.replacements.join(", ")}
                                      </div>
                                    )}
                                    {err.rule && (
                                      <div className="text-xs text-gray-500">
                                        <strong>Rule:</strong> {err.rule}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-green-200 rounded-xl bg-green-50">
                                <CheckCircle2 className="w-16 h-16 text-green-500 mb-3" />
                                <p className="text-lg font-semibold text-green-700 mb-1">Perfect Grammar!</p>
                                <p className="text-sm text-green-600">No grammar or spelling errors detected.</p>
                              </div>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="readability">
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <BookOpen className="w-6 h-6 text-green-600" />
                              <h3 className="font-semibold text-gray-900 text-lg">Readability Analysis</h3>
                              <Badge className="bg-green-100 text-green-800 px-3 py-1 text-sm font-medium">
                                Score: {feedback.readability.score}/100
                              </Badge>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Readability Score</span>
                                <span className="text-gray-900 font-medium">{feedback.readability.score}/100</span>
                              </div>
                              <Progress value={feedback.readability.score} className="h-3" />
                              <div className="text-xs text-gray-500 mt-1">
                                {feedback.readability.score >= 80
                                  ? "Excellent readability"
                                  : feedback.readability.score >= 60
                                    ? "Good readability"
                                    : "Needs improvement"}
                              </div>
                            </div>
                            {feedback.readability.suggestions.length > 0 ? (
                              <div className="space-y-3">
                                {feedback.readability.suggestions.map((suggestion, index) => (
                                  <div
                                    key={index}
                                    className="p-4 bg-green-50 border border-green-200 rounded-lg hover:shadow-sm transition-shadow"
                                  >
                                    <p className="text-sm text-green-800 leading-relaxed">{suggestion}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-green-200 rounded-xl bg-green-50">
                                <CheckCircle2 className="w-16 h-16 text-green-500 mb-3" />
                                <p className="text-lg font-semibold text-green-700 mb-1">Excellent Readability!</p>
                                <p className="text-sm text-green-600">Your text is clear and easy to understand.</p>
                              </div>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="ai">
                          {renderFeedbackContent(
                            "AI Enhancement Suggestions",
                            feedback.aiSuggestions,
                            "text-purple-600",
                            "bg-purple-100 text-purple-800",
                            "bg-purple-50 border-purple-200 text-purple-800",
                            Sparkles,
                          )}
                        </TabsContent>
                      </div>
                    </Tabs>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-96 text-center p-8 border-2 border-dashed border-gray-200 rounded-xl">
                      <FileText className="w-20 h-20 text-gray-300 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready for Review</h3>
                      <p className="text-gray-500 max-w-md">
                        Complete the form and click "Review My Legislation" to get instant AI-powered feedback on your
                        congressional debate legislation.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </div>
  )
}
