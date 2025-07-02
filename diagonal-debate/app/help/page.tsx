"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HelpCircle, Book, MessageCircle, Mail, Clock, AlertTriangle, ArrowRight, CheckCircle } from "lucide-react"
import { AnimatedIcon } from "@/components/animated-icon"
import { ScrollAnimation } from "@/components/scroll-animation"

const helpCategories = [
  {
    icon: Book,
    title: "Platform Tutorial",
    description: "Learn how to use DiagonalDebate's features effectively",
    color: "text-red-600",
    bgColor: "bg-red-100",
    glowColor: "hover:shadow-red-500/25",
    items: [
      "Getting started guide",
      "Legislation checker walkthrough",
      "Understanding feedback reports",
      "Submission process",
    ],
  },
  {
    icon: HelpCircle,
    title: "Technical Issues",
    description: "Resolve bugs, errors, and technical problems",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    glowColor: "hover:shadow-gray-500/25",
    items: ["Login and account issues", "Form submission problems", "PDF generation errors", "Browser compatibility"],
  },
  {
    icon: MessageCircle,
    title: "Debate Support",
    description: "Get help with congressional debate best practices",
    color: "text-red-600",
    bgColor: "bg-red-100",
    glowColor: "hover:shadow-red-500/25",
    items: [
      "NSDA formatting requirements",
      "Legislation writing tips",
      "Template explanations",
      "Best practice recommendations",
    ],
  },
]

const supportTips = [
  "Describe your issue clearly and specifically",
  "Include screenshots if relevant",
  "Mention your browser and device type",
  "List the steps you've already tried",
]

const responseTimes = [
  { type: "Urgent issues", time: "Same day response", color: "text-red-600" },
  { type: "Technical problems", time: "12-24 hours", color: "text-gray-700" },
  { type: "General questions", time: "24-48 hours", color: "text-red-600" },
  { type: "Feature requests", time: "3-5 business days", color: "text-gray-700" },
]

export default function HelpPage() {
  return (
    <div className="bg-white min-h-screen">
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
              Help Center
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Get{" "}
              <span className="text-red-600 relative">
                Help & Support
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse" />
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Need assistance with DiagonalDebate? Our help center is here to support your congressional debate journey
              with comprehensive resources and responsive support.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How We Can Help</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Common areas where our support team can assist you with expert guidance.
            </p>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {helpCategories.map((category, index) => (
              <ScrollAnimation key={index} direction="up" delay={index * 200}>
                <Card
                  className={`border-gray-200 transition-all duration-300 h-full hover:shadow-2xl ${category.glowColor} hover:-translate-y-2 group cursor-pointer`}
                >
                  <CardHeader>
                    <div
                      className={`${category.bgColor} p-3 rounded-xl w-fit transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <AnimatedIcon
                        icon={category.icon}
                        className={`h-7 w-7 ${category.color}`}
                        delay={index * 200 + 300}
                      />
                    </div>
                    <CardTitle className="text-xl text-gray-900 group-hover:text-gray-800 transition-colors">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-start group-hover:translate-x-1 transition-transform duration-300"
                        >
                          <CheckCircle className={`h-4 w-4 ${category.color} mr-3 mt-0.5 flex-shrink-0`} />
                          <span className="text-sm text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Support Guidelines */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Getting the Best Support</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Help us help you more effectively with these guidelines.
            </p>
          </ScrollAnimation>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ScrollAnimation direction="up" delay={200}>
              <Card className="border-gray-200 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="bg-red-100 p-3 rounded-xl w-fit mb-4">
                    <HelpCircle className="h-7 w-7 text-red-600" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">When Contacting Support</CardTitle>
                  <CardDescription className="text-gray-600">
                    Follow these tips to get faster, more accurate help
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {supportTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                          <CheckCircle className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="text-gray-600 leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={400}>
              <Card className="border-gray-200 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="bg-gray-100 p-3 rounded-xl w-fit mb-4">
                    <Clock className="h-7 w-7 text-gray-700" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">Response Times</CardTitle>
                  <CardDescription className="text-gray-600">
                    Expected response times for different types of requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {responseTimes.map((response, index) => (
                      <li key={index} className="flex items-start">
                        <div className={`${index % 2 === 0 ? "bg-red-100" : "bg-gray-100"} rounded-full p-1 mr-3 mt-1`}>
                          <Clock className={`h-4 w-4 ${response.color}`} />
                        </div>
                        <div>
                          <span className={`font-semibold ${response.color}`}>{response.type}:</span>
                          <span className="text-gray-600 ml-2">{response.time}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-24 bg-gradient-to-br from-red-50 to-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" className="text-center">
            <div className="bg-gradient-to-br from-red-500 to-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <AlertTriangle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Need Immediate Help?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              If you're experiencing a critical issue that's preventing you from submitting legislation before a
              deadline, mark your email as "URGENT" in the subject line.
            </p>

            <Card className="border-0 bg-white/70 backdrop-blur-lg shadow-2xl relative overflow-hidden max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 p-[1px] rounded-2xl">
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl h-full w-full" />
              </div>
              <CardContent className="relative p-8">
                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 p-6 rounded-xl">
                  <p className="text-red-800 font-medium text-lg leading-relaxed">
                    For time-sensitive issues during tournament preparation, we prioritize urgent requests and aim to
                    respond within 2-4 hours during business hours.
                  </p>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />

        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce" />
        <div
          className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        />

        <ScrollAnimation direction="up" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Still Have Questions?</h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Don't hesitate to reach out. We're here to ensure your debate preparation goes smoothly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact#suggestion">
              <Button
                size="lg"
                className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                Contact Us
                <Mail className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </a>
            <a href="/lessons">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-black hover:bg-white/10 px-8 py-3 transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
              >
                Browse Resources
              </Button>
            </a>
          </div>
        </ScrollAnimation>
      </section>
    </div>
  )
}
