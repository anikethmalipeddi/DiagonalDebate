"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Mail,
  MessageSquare,
  Lightbulb,
  Send,
  CheckCircle,
  Scale,
  Clock,
  Users,
  LifeBuoy,
  ArrowUpCircle,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function ContactPage() {
  const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false)
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)
  const [activeTab, setActiveTab] = useState<"contact" | "suggestion">("contact")

  const handleSuggestionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setIsSubmittingSuggestion(true)

    const formData = new FormData(form)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      feature: formData.get("feature") as string,
    }

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        let message = `Error: ${response.statusText}`
        try {
          const errorData = await response.json()
          message = errorData.error || message
        } catch (e) {
          // Ignore if response is not JSON
        }
        throw new Error(message)
      }

      toast.success("Thank you for your suggestion!")
      form.reset()
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.")
    } finally {
      setIsSubmittingSuggestion(false)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setIsSubmittingContact(true)

    const formData = new FormData(form)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        let message = `Error: ${response.statusText}`
        try {
          const errorData = await response.json()
          message = errorData.error || message
        } catch (e) {
          // Ignore if response is not JSON
        }
        throw new Error(message)
      }

      toast.success("Message sent! We'll get back to you soon.")
      form.reset()
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.")
    } finally {
      setIsSubmittingContact(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-transparent" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-2xl">
              <Scale className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have questions, feedback, or brilliant ideas? We'd love to hear from you and help make DiagonalDebate even
            better.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 text-sm">diagonaldebate@gmail.com</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
              <p className="text-gray-600 text-sm">24-48 hours</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Office Hours</h3>
              <p className="text-gray-600 text-sm">Mon-Fri, 9AM-5PM EST</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("contact")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === "contact"
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Send Message</span>
              </button>
              <button
                onClick={() => setActiveTab("suggestion")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === "suggestion"
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                }`}
              >
                <Lightbulb className="h-4 w-4" />
                <span>Feature Suggestion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Forms */}
        <div className="max-w-2xl mx-auto">
          {/* Contact Form */}
          {activeTab === "contact" && (
            <Card className="bg-white border-gray-200 shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Send us a Message</CardTitle>
                <p className="text-gray-600 mt-2">Have a question or need support? We're here to help!</p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contactName" className="text-sm font-medium text-gray-700">
                        Name
                      </Label>
                      <Input
                        id="contactName"
                        name="name"
                        type="text"
                        required
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="contactEmail"
                        name="email"
                        type="email"
                        required
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500 transition-colors"
                      placeholder="What's this about?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500 transition-colors resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmittingContact}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 border-0 shadow-lg"
                  >
                    {isSubmittingContact ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Send className="h-4 w-4" />
                        <span>Send Message</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Suggestion Form */}
          {activeTab === "suggestion" && (
            <Card className="bg-white border-gray-200 shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Suggest a Feature</CardTitle>
                <p className="text-gray-600 mt-2">Have an idea for a new feature? We'd love to hear it!</p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSuggestionSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="suggestionName" className="text-sm font-medium text-gray-700">
                        Name
                      </Label>
                      <Input
                        id="suggestionName"
                        name="name"
                        type="text"
                        required
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="suggestionEmail" className="text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="suggestionEmail"
                        name="email"
                        type="email"
                        required
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feature" className="text-sm font-medium text-gray-700">
                      Feature Request
                    </Label>
                    <Textarea
                      id="feature"
                      name="feature"
                      rows={6}
                      required
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500 transition-colors resize-none"
                      placeholder="Describe your brilliant idea..."
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmittingSuggestion}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {isSubmittingSuggestion ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Lightbulb className="h-4 w-4" />
                        <span>Submit Idea</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <JoinCommunity />
      </div>
    </div>
  )
}

function JoinCommunity() {
  return (
    <div className="relative mt-16 rounded-2xl overflow-hidden">
      {/* Gradient background and overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700" />
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
      {/* Floating circles */}
      <div className="absolute top-8 left-8 w-16 h-16 bg-white/10 rounded-full animate-bounce" />
      <div className="absolute bottom-8 right-8 w-12 h-12 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
      <div className="relative max-w-4xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Join the Community</h2>
        <p className="mt-4 text-lg text-red-100">
          Be part of shaping the future of congressional debate tools. Your feedback helps us create better experiences
          for students everywhere.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Badge text="Dedicated Support" icon={LifeBuoy} />
          <Badge text="Community Driven" icon={Users} />
          <Badge text="Constantly Improving" icon={ArrowUpCircle} />
        </div>
      </div>
    </div>
  )
}

const Badge = ({ text, icon: Icon }: { text: string; icon: React.ElementType }) => (
  <div className="bg-red-500/50 backdrop-blur-sm text-white rounded-full px-5 py-3 text-sm font-medium flex items-center space-x-2 shadow-lg">
    <Icon className="h-5 w-5 opacity-80" />
    <span>{text}</span>
  </div>
)
