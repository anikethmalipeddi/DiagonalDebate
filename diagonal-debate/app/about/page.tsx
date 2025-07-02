"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Award, Zap, BookOpen, FileText, Target, Lightbulb, Rocket } from "lucide-react"
import { features } from "@/lib/constants"
import { ScrollAnimation } from "@/components/scroll-animation"

const journey = [
  {
    phase: "Problem",
    title: "The Challenge We Faced",
    description:
      "Manual formatting, inconsistent submissions, and endless email chains were slowing down our debate preparation.",
    icon: Target,
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
  },
  {
    phase: "Solution",
    title: "Our Innovative Approach",
    description:
      "We built an intelligent platform that automates the tedious parts while enhancing the creative process.",
    icon: Lightbulb,
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200",
  },
  {
    phase: "Impact",
    title: "Transforming Debate Teams",
    description:
      "Now teams can focus on crafting compelling arguments instead of wrestling with formatting requirements.",
    icon: Rocket,
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
  },
]

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-transparent" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="fade" className="text-center">
            <Badge className="bg-red-100 text-red-800 mb-8 px-6 py-3 text-base font-semibold border border-red-200 shadow-sm">
              About DiagonalDebate
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
              Built for{" "}
              <span className="text-red-600 relative">
                Debate Excellence
                <div className="absolute -bottom-4 left-0 right-0 h-2 bg-gradient-to-r from-red-400 to-red-600 rounded-full opacity-60" />
              </span>
            </h1>
            <p className="text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
              A comprehensive platform designed to streamline congressional debate preparation for high school students.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How We Got Here</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From problem identification to solution implementation
            </p>
          </ScrollAnimation>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-red-200 via-gray-200 to-red-200 rounded-full hidden lg:block" />

            {journey.map((step, index) => (
              <ScrollAnimation key={index} direction="up" delay={index * 300}>
                <div className={`flex items-center mb-16 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                  <div className="flex-1 lg:px-8">
                    <Card
                      className={`${step.borderColor} border-2 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group`}
                    >
                      <CardContent className="p-8">
                        <div className="flex items-center mb-4">
                          <div
                            className={`${step.bgColor} p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300`}
                          >
                            <step.icon className={`h-8 w-8 ${step.color}`} />
                          </div>
                          <Badge className={`${step.bgColor} ${step.color} border-0 px-3 py-1 text-sm font-semibold`}>
                            {step.phase}
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                        <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="hidden lg:block relative z-10">
                    <div className={`w-6 h-6 ${step.bgColor} ${step.borderColor} border-4 rounded-full shadow-lg`} />
                  </div>

                  <div className="flex-1 lg:px-8" />
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              DiagonalDebate eliminates the friction of back-and-forth edits, lost formatting, and inconsistent
              standards by offering an automated legislation checker and submission workflow.
            </p>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <ScrollAnimation direction="up" delay={200}>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Collaboration</h3>
                <p className="text-gray-600">Standardize processes across your entire debate team</p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation direction="up" delay={400}>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assurance</h3>
                <p className="text-gray-600">Ensure every submission meets professional standards</p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation direction="up" delay={600}>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Efficiency</h3>
                <p className="text-gray-600">Save time with automated checks and formatting</p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Platform Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tools designed specifically for congressional debate preparation
            </p>
          </ScrollAnimation>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {features.map((feature, index) => (
              <ScrollAnimation key={feature.id} direction="up" delay={index * 150}>
                <Card className="border-2 border-gray-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group h-full bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                          feature.color === "text-red-600"
                            ? "bg-red-100 group-hover:bg-red-200"
                            : "bg-gray-100 group-hover:bg-gray-200"
                        }`}
                      >
                        <feature.icon className={`h-8 w-8 ${feature.color} transition-all duration-300`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl text-gray-900 mb-2">{feature.title}</CardTitle>
                        <div
                          className={`w-16 h-1 rounded-full ${feature.color === "text-red-600" ? "bg-red-500" : "bg-gray-500"} group-hover:w-24 transition-all duration-300`}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-lg leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Built by a Debater</h2>
            <p className="text-xl text-gray-600">
              Created by a member of the Rock Ridge debate team who understood the challenges firsthand
            </p>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={200}>
            <Card className="border-0 shadow-xl bg-white">
              <div className="h-2 bg-gradient-to-r from-red-500 to-red-600" />
              <CardContent className="p-12">
                <div className="space-y-6">
                  <p className="text-xl text-gray-700 leading-relaxed">
                    DiagonalDebate was created as an internal tool for the team to standardize the process of writing and submitting congressional debate legislation. Traditionally,
                    debaters relied on Google Forms, email threads, and manually formatted documents that often contained
                    errors or inconsistencies.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Our platform replaces that chaotic workflow with a centralized website where students can input their
                    legislation, receive automated feedback based on template adherence and clarity, and submit finalized
                    PDFs directly to captains.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    The platform also includes educational resources (lessons) and a contention idea bank to help students
                    develop stronger arguments and learn effective bill writing. It is designed for ease of use,
                    integrates modern UI/UX principles, and incorporates AI and automation to improve the quality and
                    efficiency of the legislative process.
                  </p>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  )
}
