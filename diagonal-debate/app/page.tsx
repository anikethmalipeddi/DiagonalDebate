"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, FileText, Zap, BookOpen, Users, Award, ArrowRight, Quote, Star } from "lucide-react"
import { useState, useEffect } from "react"
import { AnimatedIcon } from "@/components/animated-icon"
import { ScrollAnimation } from "@/components/scroll-animation"

const features = [
  {
    id: "automated-formatting",
    icon: CheckCircle,
    title: "Automated Formatting & NSDA Checks",
    description: "Ensure your legislation meets all NSDA template requirements with automated structure validation.",
    color: "text-red-600",
    glowColor: "hover:shadow-red-500/25",
  },
  {
    id: "ai-suggestions",
    icon: Zap,
    title: "AI-Powered Suggestions",
    description: "Get intelligent recommendations for clarity, grammar, and argument strength from advanced AI.",
    color: "text-gray-700",
    glowColor: "hover:shadow-gray-500/25",
  },
  {
    id: "pdf-generation",
    icon: FileText,
    title: "Instant PDF Generation",
    description: "Generate properly formatted PDFs and automatically email them to your debate captains.",
    color: "text-red-600",
    glowColor: "hover:shadow-red-500/25",
  },
  {
    id: "educational-resources",
    icon: BookOpen,
    title: "Educational Resources",
    description: "Access comprehensive lessons and a searchable database of contention ideas.",
    color: "text-gray-700",
    glowColor: "hover:shadow-gray-500/25",
  },
]

const testimonials = [
  {
    quote:
      "DiagonalDebate has revolutionized how our team prepares legislation. The automated formatting and AI suggestions have improved the quality of our submissions dramatically, and the time savings allow us to focus more on developing strong arguments.",
    initials: "AJ",
    name: "Aditya Jupally",
    title: "Debater",
    rating: 5,
  },
  {
    quote:
      "The platform makes it so much easier to ensure our bills are formatted correctly and meet all the requirements. The feedback is clear and actionable, and the process is so much faster than before.",
    initials: "RS",
    name: "Raghav Swamy",
    title: "Debater",
    rating: 5,
  },
  {
    quote:
      "This tool has been a game-changer for our team. The automated checks catch formatting issues I used to spend hours reviewing manually, and the AI suggestions help our newer debaters improve their writing significantly.",
    initials: "AB",
    name: "Ajeet Bondugula",
    title: "Alumnus",
    rating: 5,
  },
  {
    quote:
      "The educational resources and contention ideas database have been invaluable for developing stronger arguments. It's like having a debate coach available 24/7 to help you think through complex policy issues.",
    initials: "ND",
    name: "Neeraj Dandamudi",
    title: "Alumnus",
    rating: 5,
  },
  {
    quote:
      "The interface is intuitive and easy to use. The PDF generation feature saves us so much time during tournament preparation.",
    initials: "HK",
    name: "HK",
    title: "Debater",
    rating: 5,
  },
  {
    quote:
      "The platform has standardized our entire legislation submission process. No more lost emails or formatting inconsistencies. Everything is centralized, organized, and professional-looking.",
    initials: "AP",
    name: "Aditya Pasarti",
    title: "Captain",
    rating: 5,
  },
]

const aboutSections = [
  {
    icon: Users,
    title: "Eliminate the Friction",
    description:
      "DiagonalDebate eliminates the friction of back-and-forth edits, lost formatting, and inconsistent standards by offering an automated legislation checker and submission workflow.",
    delay: 200,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    icon: Award,
    title: "Intelligent Processing",
    description:
      "Students input their legislation text, and our system evaluates it against NSDA template standards, checks grammar and readability, and provides AI-powered improvement suggestions.",
    delay: 400,
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
  {
    icon: Zap,
    title: "Professional Output",
    description:
      "Ensure correct formatting before generating a properly named PDF and submitting directly to your debate captains.",
    delay: 600,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
]

const stats = [
  { number: "500+", label: "Bills Reviewed", delay: 0 },
  { number: "1000s", label: "Hours of Review Cycles", delay: 200 },
  { number: "150+", label: "Hours of Debate Lessons", delay: 400 },
  { number: "100%", label: "Improvement Guarantee", delay: 600 },
]

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [fade, setFade] = useState(true)

  // Auto-rotate testimonials with fade transition
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
        setFade(true)
      }, 350)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Manual dot navigation with fade
  const handleDotClick = (index: number) => {
    if (index === currentTestimonial) return
    setFade(false)
    setTimeout(() => {
      setCurrentTestimonial(index)
      setFade(true)
    }, 350)
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32 overflow-hidden">
        {/* Enhanced background decorations */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-transparent" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-red-200/30 to-gray-200/30 rounded-full filter blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="fade" className="text-center">
            <Badge className="bg-red-100 text-red-800 mb-6 px-4 py-2 text-sm font-medium border border-red-200 shadow-sm">
              Built for the team
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Craft Winning Legislation in{" "}
              <span className="text-red-600 relative">
                Minutes
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse" />
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your debate preparation with intelligent legislation checking, automated formatting, and
              comprehensive educational resources designed specifically for high school congressional debate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/legislation-checker">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/lessons">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-3 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:shadow-lg"
                >
                  Explore Lessons
                </Button>
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <ScrollAnimation key={index} direction="up" delay={stat.delay}>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Streamline Your Debate Workflow</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From draft to submission, we've got every step of your legislation process covered.
            </p>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aboutSections.map((section, index) => (
              <ScrollAnimation key={index} direction="up" delay={section.delay}>
                <div
                  className={`bg-white rounded-xl p-8 shadow-sm border border-gray-100 h-full transition-all duration-300 group
                    ${
                      (section.title === "Eliminate the Friction" || section.title === "Professional Output")
                        ? "hover:shadow-red-500/25 hover:shadow-2xl"
                        : "hover:shadow-md"
                    }
                  `}
                >
                  <div
                    className={`${section.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <AnimatedIcon
                      icon={section.icon}
                      className={`h-8 w-8 ${section.color}`}
                      delay={section.delay + 200}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{section.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{section.description}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Debate Excellence
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, refine, and submit winning legislation.
            </p>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <ScrollAnimation key={feature.id} direction="up" delay={index * 200}>
                <Card
                  className={`border-gray-200 transition-all duration-300 h-full hover:shadow-2xl ${feature.glowColor} hover:-translate-y-2 group cursor-pointer`}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                          feature.color === "text-red-600"
                            ? "bg-red-100 group-hover:bg-red-200"
                            : "bg-gray-100 group-hover:bg-gray-200"
                        }`}
                      >
                        <feature.icon
                          className={`h-7 w-7 ${feature.color} transition-all duration-300 group-hover:scale-110`}
                        />
                      </div>
                      <CardTitle className="text-xl text-gray-900 group-hover:text-gray-800 transition-colors">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Teammates</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what your fellow debaters are saying about DiagonalDebate.
            </p>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={200} className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-visible hover:shadow-red-500/25 hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 will-change-transform">
              {/* Gradient border wrapper */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 via-transparent to-gray-500/20 z-0 pointer-events-none" />
              {/* Card content with white/blurred background */}
              <div className="relative rounded-2xl bg-white/80 backdrop-blur-lg z-10 p-8 lg:p-12 overflow-hidden">
                <div className="text-center">
                  <div className="bg-red-100/80 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Quote className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className={fade ? "opacity-100 transition-opacity" : "opacity-0 transition-opacity"}>
                    <p className="text-xl text-gray-800 mb-6">{testimonials[currentTestimonial].quote}</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</span>
                      <span className="text-gray-500">/</span>
                      <span className="text-gray-500">{testimonials[currentTestimonial].title}</span>
                    </div>
                  </div>
                  <div className="flex justify-center mt-8 gap-2">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        className={`w-3 h-3 rounded-full ${i === currentTestimonial ? "bg-red-600" : "bg-gray-300"}`}
                        onClick={() => handleDotClick(i)}
                        aria-label={`Go to testimonial ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  )
}