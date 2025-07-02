"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Tag,
  BookOpen,
  TrendingUp,
  Globe,
  DollarSign,
  Home,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  FileText,
  Target,
  Lightbulb,
  ArrowRight,
  RefreshCw,
} from "lucide-react"
import { ScrollAnimation } from "@/components/scroll-animation"
import { contentionIdeas } from "@/lib/contentionIdeas"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { AnimatedIcon } from "@/components/animated-icon"

// Enhanced contention ideas with additional metadata
const enhancedContentionIdeas = contentionIdeas.map((idea, index) => ({
  ...idea,
  difficulty: getDifficultyFromTitle(idea.title),
  popularity: getPopularityFromId(idea.id),
  keyStats: getKeyStatsFromCategory(idea.category, idea.title),
  relatedTopics: getRelatedTopicsFromTags(idea.tags, idea.category),
}))

function getDifficultyFromTitle(title: string): string {
  const advancedKeywords = ["NATO", "North Korea", "Venezuela", "Japan Military", "Methane Pollution", "Inflation Policy"]
  const intermediateKeywords = ["Universal Healthcare", "Immigration", "Trade War", "Carbon Tax", "Autonomous Vehicles", "Aid to Ukraine"]
  
  if (advancedKeywords.some(keyword => title.includes(keyword))) return "Advanced"
  if (intermediateKeywords.some(keyword => title.includes(keyword))) return "Intermediate"
  return "Beginner"
}

function getPopularityFromId(id: number): number {
  // Generate popularity based on ID and some randomness
  const basePopularity = 70 + (id % 30)
  return Math.min(100, Math.max(60, basePopularity))
}

function getKeyStatsFromCategory(category: string, title: string): string {
  const stats: Record<string, Record<string, string>> = {
    Domestic: {
      "Universal Healthcare": "32 developed countries have universal healthcare",
      "DC Statehood": "DC has 700k+ residents without congressional representation",
      "Teacher Shortage": "300k+ teacher vacancies nationwide",
      "Fentanyl Crisis": "100k+ overdose deaths annually",
      "Military Recruitment": "Army missed 2023 recruitment goal by 15k",
      "Weight Loss Drugs": "42% of US adults have obesity",
      "Price Gouging": "Price gouging affects 60% of consumers during crises",
      "Food Safety": "48M foodborne illnesses annually in US",
      "Foster Care": "400k+ children in foster care system",
      "Police Body Cameras": "80% of large police departments use body cameras",
      "Voting Rights for Felons": "5.2M Americans disenfranchised due to felony convictions",
      "Mandatory Vaccinations": "95% vaccination rate needed for herd immunity",
      "Four-Day School Week": "560+ school districts use four-day weeks",
      "National Peptide Database": "50k+ peptides identified for research",
      "Defunding For-Profit Charter Schools": "15% of charter schools are for-profit",
      "Eliminating Squatter Laws": "1.2M+ squatter cases filed annually",
      "Banning Deepfakes": "96% of deepfakes are non-consensual pornography",
      "Banning Pharmaceutical TV Ads": "US and New Zealand only allow pharma TV ads",
      "Banning Stock Trading by Congress": "75% of Congress members own stocks",
      "Banning Facial Recognition": "20+ cities have banned facial recognition",
      "Remittance Fees": "$67B in remittances sent from US annually",
      "Abolishing Plea Bargaining": "95% of criminal cases end in plea bargains",
      "Abolishing the Use of Bail": "450k+ people held pretrial due to inability to pay bail",
      "Voting by Phone": "Estonia has allowed online voting since 2005",
    },
    Economic: {
      "NIL for Amateur Athletes": "500k+ college athletes eligible for NIL",
      "Global Currency": "60+ countries exploring digital currencies",
      "Meat & Agricultural Subsidies": "$38B in agricultural subsidies annually",
      "Autonomous Vehicles": "94% of accidents caused by human error",
      "Affordable Housing": "11M+ Americans spend 50%+ of income on rent",
      "Inflation Policy & Interest Rates": "Federal Reserve targets 2% inflation",
      "Single‑Family Zoning": "75% of residential land zoned single-family only",
      "Big Pharmaceuticals Tax": "Pharma industry worth $1.5T globally",
      "Sectoral Bargaining": "10% of US workers covered by collective bargaining",
      "Flood Insurance": "5M+ properties at risk of flooding",
    },
    International: {
      "North Korea": "25M+ people under authoritarian rule",
      "Haiti": "11M+ people affected by political instability",
      "Venezuela": "7M+ Venezuelans have fled the country",
      "Japan Military Expansion": "Japan constitution Article 9 limits military",
      "Aid to Ukraine": "$75B+ in US aid provided to Ukraine",
      "Methane Pollution Agreement": "Methane 25x more potent than CO2",
    }
  }
  
  return stats[category]?.[title] || `${category} policy affects millions of Americans`
}

function getRelatedTopicsFromTags(tags: string[], category: string): string[] {
  const topicMap: Record<string, string[]> = {
    Healthcare: ["Medicare for All", "Healthcare Reform", "Public Option"],
    Economics: ["Economic Policy", "Market Regulation", "Fiscal Policy"],
    Policy: ["Legislation", "Regulation", "Government Reform"],
    Technology: ["Digital Innovation", "AI Regulation", "Cybersecurity"],
    Education: ["School Choice", "Higher Education", "Student Loans"],
    Immigration: ["Border Security", "DACA", "Guest Worker Programs"],
    Environment: ["Climate Change", "Renewable Energy", "Carbon Pricing"],
    Security: ["National Defense", "Cybersecurity", "Homeland Security"],
    Labor: ["Workers Rights", "Minimum Wage", "Unionization"],
    Housing: ["Urban Development", "Zoning Reform", "Homelessness"],
    Criminal: ["Criminal Justice Reform", "Police Reform", "Bail Reform"],
    Voting: ["Election Security", "Voter Access", "Gerrymandering"],
    Privacy: ["Data Protection", "Surveillance", "Digital Rights"],
    Transportation: ["Infrastructure", "Public Transit", "Electric Vehicles"],
    Agriculture: ["Food Security", "Sustainable Farming", "Subsidies"],
    Finance: ["Banking Regulation", "Digital Currency", "Tax Policy"],
    Diplomacy: ["Foreign Relations", "Trade Policy", "Alliances"],
    Humanitarian: ["Foreign Aid", "Refugee Policy", "Disaster Relief"],
  }
  
  const relatedTopics: string[] = []
  tags.forEach(tag => {
    const topics = topicMap[tag] || []
    relatedTopics.push(...topics.slice(0, 2))
  })
  
  return [...new Set(relatedTopics)].slice(0, 3)
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

const TAGS: string[] = [
  "legal/constitutional",
  "economic",
  "psychological",
  "scientific/technical",
  "international relations",
  "political strategy",
  "moral/ethical",
  "environmental",
  "public health",
  "security",
  "innovation",
  "implementation/agency inefficiency",
]

const IMPACT_FOCUS = [
  "Economic",
  "Lives Saved",
  "Geopolitical",
  "Societal Change",
  "Technological Advancement",
  "Environmental",
  "Equity/Justice",
  "Other",
]

export default function ContentionIdeasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [sortBy, setSortBy] = useState("popularity")
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [tab, setTab] = useState("browse")
  const [aiTopic, setAiTopic] = useState("")
  const [side, setSide] = useState<string>("pro")
  const [summary, setSummary] = useState<string>("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [aiContentions, setAiContentions] = useState<any[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [impactFocus, setImpactFocus] = useState<string>("")
  const [ellipsis, setEllipsis] = useState<string>("")
  const ellipsisInterval = useRef<NodeJS.Timeout | null>(null)
  const [progress, setProgress] = useState(0)
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null)

  const categories = ["All", "Domestic", "Economic", "International"]
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]
  const sortOptions = [
    { value: "popularity", label: "Most Popular" },
    { value: "title", label: "Alphabetical" },
    { value: "difficulty", label: "Difficulty" },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Domestic":
        return "bg-red-100 text-red-800"
      case "Economic":
        return "bg-gray-100 text-gray-800"
      case "International":
        return "bg-gray-900 text-white"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Domestic":
        return Home
      case "Economic":
        return DollarSign
      case "International":
        return Globe
      default:
        return BookOpen
    }
  }

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

  const filteredAndSortedIdeas = enhancedContentionIdeas
    .filter((idea) => {
      const matchesSearch =
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        idea.relatedTopics.some((topic) => topic.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === "All" || idea.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === "All" || idea.difficulty === selectedDifficulty
      return matchesSearch && matchesCategory && matchesDifficulty
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.popularity - a.popularity
        case "title":
          return a.title.localeCompare(b.title)
        case "difficulty":
          const difficultyOrder: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        default:
          return 0
      }
    })

  // Ellipsis animation for loading
  useEffect(() => {
    if (loading) {
      setEllipsis("")
      ellipsisInterval.current = setInterval(() => {
        setEllipsis((prev) => {
          if (prev.length === 3) return ""
          return prev + "."
        })
      }, 400)
    } else {
      setEllipsis("")
      if (ellipsisInterval.current) clearInterval(ellipsisInterval.current)
    }
    return () => {
      if (ellipsisInterval.current) clearInterval(ellipsisInterval.current)
    }
  }, [loading])

  // Progress bar animation
  useEffect(() => {
    if (loading) {
      setProgress(0)
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? Math.min(prev + Math.random() * 10, 100) : prev))
      }, 200)
      return () => clearInterval(interval)
    } else {
      setProgress(100)
      const timeout = setTimeout(() => setProgress(0), 400)
      return () => clearTimeout(timeout)
    }
  }, [loading])

  // AI Generator handler
  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiTopic.trim() || !summary.trim()) {
      toast.error("Please enter a topic and bill summary.")
      return
    }
    setLoading(true)
    setAiContentions(null)
    try {
      const res = await fetch("/api/contention-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          side,
          summary,
          tags: [...selectedTags, ...(impactFocus ? [impactFocus] : [])],
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.message || data.error || "Failed to generate contentions")
        return
      }
      const data = await res.json()
      if (data.fallback) {
        toast.warning("AI response was not fully structured. Results may be less detailed than usual.")
      }
      setAiContentions(data.contentions)
    } catch (err: any) {
      toast.error(err?.message || "Failed to generate AI contentions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerateContention = async (idx: number) => {
    if (!aiTopic.trim() || !summary.trim()) {
      toast.error("Please enter a topic and bill summary.")
      return
    }
    setRegeneratingIndex(idx)
    try {
      const res = await fetch("/api/contention-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          side,
          summary,
          tags: [...selectedTags, ...(impactFocus ? [impactFocus] : [])],
          single: true,
          index: idx,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.message || data.error || "Failed to regenerate contention")
        return
      }
      const data = await res.json()
      setAiContentions((prev: any) => {
        if (!prev) return prev
        const updated = [...prev]
        updated[idx] = data.contention
        return updated
      })
    } catch (err: any) {
      toast.error(err?.message || "Failed to regenerate contention. Please try again.")
    } finally {
      setRegeneratingIndex(null)
    }
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
              Argument Database
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Contention{" "}
              <span className="text-red-600 relative">
                Idea Bank
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse" />
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Explore comprehensive debate topics with detailed arguments, counterarguments, and strategic insights.
            </p>
          </ScrollAnimation>
      </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Tabs defaultValue="browse" value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-8 bg-gray-100 p-1 rounded-lg flex gap-2 justify-center">
            <TabsTrigger value="browse">Browse Topics</TabsTrigger>
            <TabsTrigger value="ai">AI Contentions Generator</TabsTrigger>
          </TabsList>

          {/* Browse Topics Tab */}
          <TabsContent value="browse" className="transition-all duration-300 data-[state=active]:translate-x-0 data-[state=active]:opacity-100 data-[state=inactive]:-translate-x-8 data-[state=inactive]:opacity-0">
            {/* Filters Section */}
            <section className="py-8 bg-white border-b border-gray-100">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <ScrollAnimation direction="up" className="space-y-6">
                  {/* Search Bar */}
                  <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
                      placeholder="Search topics, arguments, or tags..."
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

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40 border-gray-300">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
        </div>
                </ScrollAnimation>
      </div>
            </section>

            {/* Results Section */}
            <section className="py-16 bg-gray-50">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {filteredAndSortedIdeas.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">Try adjusting your search terms or filters</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                    {filteredAndSortedIdeas.map((idea, index) => {
                      const CategoryIcon = getCategoryIcon(idea.category);
                      return (
                        <ScrollAnimation key={idea.id} direction="up" delay={index * 50}>
                          <Link href={`/contention-ideas/${slugify(idea.title)}`} className="block group h-full" tabIndex={0} aria-label={`Go to AI argument creator for ${idea.title}`}> 
                            <Card className="hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 border-gray-200 h-full group bg-white cursor-pointer focus:ring-2 focus:ring-red-500 flex flex-col">
                              <CardHeader className="pb-4 flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center space-x-3">
                                    <div className="bg-red-100 p-2 rounded-lg group-hover:bg-red-200 transition-colors">
                                      <CategoryIcon className="w-5 h-5 text-red-600" />
                                    </div>
                    <Badge className={getCategoryColor(idea.category)}>{idea.category}</Badge>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge className={getDifficultyColor(idea.difficulty)}>{idea.difficulty}</Badge>
                                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>{idea.popularity}%</span>
                                  </div>
                                </div>
                              </div>
                              <CardTitle className="text-xl text-gray-900 group-hover:text-red-600 transition-colors leading-tight">
                                {idea.title}
                              </CardTitle>
                              <CardDescription className="text-gray-600 leading-relaxed">{idea.description}</CardDescription>
                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mt-3">
                        {idea.tags.map((tag, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-700 transition-colors"
                                      >
                                        <Tag className="w-3 h-3 mr-1" />
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                            </CardHeader>
                            <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                              {/* Key Stat */}
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-gray-900">Key Insight:</p>
                                <p className="text-sm text-gray-700">{idea.keyStats}</p>
                    </div>
                              {/* Arguments For */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <ThumbsUp className="w-4 h-4 text-gray-700" />
                        <span className="font-semibold text-sm text-gray-900">Arguments For:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {idea.argumentsFor.slice(0, expandedCard === idea.id ? undefined : 2).map((arg, index) => (
                          <li key={index}>{arg}</li>
                        ))}
                      </ul>
                    </div>
                              {/* Arguments Against */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <ThumbsDown className="w-4 h-4 text-red-600" />
                        <span className="font-semibold text-sm text-gray-900">Arguments Against:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    {idea.argumentsAgainst
                                      .slice(0, expandedCard === idea.id ? undefined : 2)
                                      .map((arg, index) => (
                          <li key={index}>{arg}</li>
                        ))}
                      </ul>
                    </div>
                              {/* Related Topics */}
                              {expandedCard === idea.id && (
                                <div>
                                  <p className="font-semibold text-sm text-gray-900 mb-2">Related Topics:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {idea.relatedTopics.map((topic, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {topic}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {/* Expand/Collapse Button */}
                    <Button
                      variant="outline"
                      size="sm"
                                  onClick={e => {
                                    e.preventDefault();
                        setExpandedCard(expandedCard === idea.id ? null : idea.id)
                      }}
                    >
                                  {expandedCard === idea.id ? (
                                    <>
                                      <EyeOff className="w-4 h-4 mr-2" />
                                      Show Less
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-4 h-4 mr-2" />
                                      Show More Details
                                    </>
                                  )}
                                </Button>
                              </CardContent>
                            </Card>
                          </Link>
                        </ScrollAnimation>
                      )
                    })}
                  </div>
                )}
              </div>
            </section>
          </TabsContent>

          {/* AI Generator Tab */}
          <TabsContent value="ai" className="transition-all duration-300 data-[state=active]:translate-x-0 data-[state=active]:opacity-100 data-[state=inactive]:translate-x-8 data-[state=inactive]:opacity-0">
            <ScrollAnimation direction="up" delay={200}>
              <Card className="relative shadow-xl border-0 bg-white/80 backdrop-blur-lg overflow-visible">
                {loading && (
                  <div className="absolute -top-1 left-0 w-full z-20 overflow-hidden">
                    <div
                      className="h-1 bg-gradient-to-r from-red-600 to-red-400 rounded-t-lg transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center">
                      <AnimatedIcon icon={Sparkles} className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900">Generate AI Contentions</CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        Get 3 unique, extremely impactful arguments tailored to your specific needs. You can enter any topic.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAIGenerate} className="space-y-6">
                    {/* Topic Input */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-900 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-red-600" />
                        Topic
                      </label>
                      <Input
                        value={aiTopic}
                        onChange={e => setAiTopic(e.target.value)}
                        placeholder="Enter your debate topic (e.g. Universal Healthcare, Ban TikTok, etc.)"
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    {/* Side Selection */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-900 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-red-600" />
                        Choose Your Side
                      </label>
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant={side === "pro" ? "tag" : "outline"}
                          onClick={() => setSide("pro")}
                        >
                          Pro
                        </Button>
                        <Button
                          type="button"
                          variant={side === "con" ? "tag" : "outline"}
                          onClick={() => setSide("con")}
                        >
                          Con
                        </Button>
                      </div>
                    </div>
                    {/* Bill Summary */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-900 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-red-600" />
                        Legislation Summary (2–3 sentences)
                      </label>
                      <Textarea
                        value={summary}
                        onChange={e => setSummary(e.target.value)}
                        placeholder="Paste or summarize the legislation here..."
                        className="min-h-[100px] border-gray-300 focus:border-red-500 focus:ring-red-500 resize-none"
                      />
                    </div>
                    {/* Tags Selection */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-900 flex items-center">
                        <Tag className="w-4 h-4 mr-2 text-red-600" />
                        Optional Tags
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {TAGS.map((tag: string) => (
                          <Button
                            key={tag}
                            type="button"
                            variant={selectedTags.includes(tag) ? "tag" : "outline"}
                            size="sm"
                            onClick={() =>
                              setSelectedTags(
                                selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag],
                              )
                            }
                          >
                            {tag}
                          </Button>
                        ))}
                      </div>
                    </div>
                    {/* Impact Focus */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-900 flex items-center mb-1">
                        <Lightbulb className="w-4 h-4 mr-2 text-red-600" />
                        Impact Focus
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 focus:ring-red-500 bg-white"
                        value={impactFocus}
                        onChange={(e) => setImpactFocus(e.target.value)}
                      >
                        <option value="">Select an impact focus (optional)</option>
                        {IMPACT_FOCUS.map((focus) => (
                          <option key={focus} value={focus}>
                            {focus}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                          Generate Contentions
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                  {/* AI Results */}
                  {aiContentions && (
                    <ScrollAnimation direction="up" delay={100} className="mt-8">
                      <div className="border-t border-gray-200 pt-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                          <div className="bg-red-100 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                            <Sparkles className="h-4 w-4 text-red-600" />
                          </div>
                          AI-Generated Contentions
                        </h3>
                        {Array.isArray(aiContentions) && aiContentions.length > 0 && (
                          <div className="space-y-6">
                            {aiContentions.map((c, i) =>
                              typeof c === 'object' && c !== null ? (
                                <div
                                  key={i}
                                  className="w-full bg-gradient-to-r from-gray-50 to-red-50/30 border border-gray-200 rounded-2xl p-8 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] relative"
                                  style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)', maxWidth: '100%' }}
                                >
                                  <div className="flex flex-row items-center gap-3 mb-4">
                                    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-base">
                                      {i + 1}
                                    </div>
                                    <span className="text-red-700 font-semibold text-lg leading-none">Contention {i + 1}</span>
                                    <button
                                      className="ml-2 p-2 rounded-full hover:bg-red-100 transition-colors"
                                      aria-label="Regenerate contention"
                                      onClick={() => handleRegenerateContention(i)}
                                      disabled={regeneratingIndex === i}
                                      type="button"
                                    >
                                      {regeneratingIndex === i ? null : <RefreshCw className="w-5 h-5 text-red-600" />}
                                    </button>
                                  </div>
                                  {regeneratingIndex === i && (
                                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20 rounded-2xl">
                                      <span className="inline-block animate-spin"><RefreshCw className="w-8 h-8 text-red-600" /></span>
                                    </div>
                                  )}
                                  <div className="text-2xl font-semibold text-gray-900 mb-4 leading-snug" style={{lineHeight: '1.3'}}>
                                    {c.contention}
                                  </div>
                                  <div className="border-b border-gray-200 mb-4" />
                                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-2">
                                    <dt className="text-sm font-semibold text-gray-500 pr-2 min-w-[72px]">Link:</dt>
                                    <dd className="text-base bg-gray-50 rounded px-3 py-1 border-l-2 border-gray-200 mb-2">{c.link}</dd>
                                    <dt className="text-sm font-semibold text-gray-500 pr-2 min-w-[72px]">Warrant:</dt>
                                    <dd className="text-base bg-gray-50 rounded px-3 py-1 border-l-2 border-gray-200 mb-2">{c.warrant}</dd>
                                    <dt className="text-sm font-semibold text-gray-500 pr-2 min-w-[72px]">Impact:</dt>
                                    <dd className="text-base bg-red-50 rounded px-3 py-1 border-l-2 border-red-300 mb-2 text-red-600">{c.impact}</dd>
                                  </dl>
                                </div>
                              ) : (
                                <div
                                  key={i}
                                  className="flex items-start space-x-3 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-red-50/30 border border-gray-200"
                                >
                                  <div className="bg-gradient-to-r from-red-600 to-red-700 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                                    {i + 1}
                                  </div>
                                  <p className="text-gray-800 leading-relaxed">{c}</p>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </ScrollAnimation>
                  )}
                </CardContent>
              </Card>
            </ScrollAnimation>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
