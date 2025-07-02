"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, FileText, Users, AlertTriangle, Mail } from "lucide-react"
import { ScrollAnimation } from "@/components/scroll-animation"
import { AnimatedIcon } from "@/components/animated-icon"

export default function TermsPage() {
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
              Legal Documentation
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Terms of{" "}
              <span className="text-red-600 relative">
                Service
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse" />
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using DiagonalDebate. Your security and privacy are our top
              priorities.
            </p>
            <div className="bg-white/70 backdrop-blur-sm rounded-lg px-6 py-3 inline-block shadow-lg border border-gray-200">
              <p className="text-sm text-gray-600 font-medium">Last updated: June 20, 2025</p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Security Emphasis */}
            <ScrollAnimation direction="up" delay={0}>
              <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/5" />
                <CardHeader className="relative">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-red-200 group-hover:bg-red-300 transition-all duration-300">
                      <AnimatedIcon icon={Shield} className="h-8 w-8 text-red-600" delay={200} />
                    </div>
                    <CardTitle className="text-2xl text-red-800 font-bold">Security is Our Top Priority</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-red-700 text-lg leading-relaxed">
                    At DiagonalDebate, we implement industry-leading security measures to protect your data,
                    legislation, and personal information. Your privacy and security are fundamental to our service.
                  </p>
                </CardContent>
              </Card>
            </ScrollAnimation>

            {/* Terms Sections */}
            <ScrollAnimation direction="up" delay={100}>
              <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-all duration-300">
                      <FileText className="h-6 w-6 text-gray-700" />
                    </div>
                    <CardTitle className="text-xl text-gray-900 group-hover:text-gray-800 transition-colors">
                      1. Acceptance of Terms
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    By accessing and using DiagonalDebate ("the Service"), you accept and agree to be bound by the terms
                    and provision of this agreement. If you do not agree to abide by the above, please do not use this
                    service.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    These Terms of Service apply to all users of the Service, including without limitation users who are
                    browsers, vendors, customers, merchants, and/or contributors of content.
                  </p>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={200}>
              <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-all duration-300">
                      <Users className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900 group-hover:text-gray-800 transition-colors">
                      2. Description of Service
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    DiagonalDebate is a web-based platform designed to help high school congressional debate students
                    create, refine, and submit legislation. The Service includes:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Automated legislation formatting and NSDA template checking</li>
                      <li>AI-powered grammar and clarity suggestions</li>
                      <li>PDF generation and email submission to debate captains</li>
                      <li>Educational resources and lesson materials</li>
                      <li>Searchable contention idea database</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={300}>
              <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-all duration-300">
                      <Lock className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900 group-hover:text-gray-800 transition-colors">
                      3. User Accounts and Security
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-red-800 font-semibold mb-2">Account Security:</p>
                        <p className="text-red-700 leading-relaxed">
                          You are responsible for maintaining the confidentiality of your account credentials. We
                          implement advanced encryption and security measures to protect your data.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    You must provide accurate and complete information when creating your account. You are responsible
                    for all activities that occur under your account.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You must immediately notify us of any unauthorized use of your account or any other breach of
                    security.
                  </p>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={400}>
              <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-all duration-300">
                      <AlertTriangle className="h-6 w-6 text-gray-700" />
                    </div>
                    <CardTitle className="text-xl text-gray-900 group-hover:text-gray-800 transition-colors">
                      4. Acceptable Use Policy
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed font-medium">You agree not to use the Service to:</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Upload, post, or transmit any content that is unlawful, harmful, or inappropriate</li>
                      <li>Violate any applicable local, state, national, or international law</li>
                      <li>Impersonate any person or entity or misrepresent your affiliation</li>
                      <li>Interfere with or disrupt the Service or servers connected to the Service</li>
                      <li>Attempt to gain unauthorized access to any portion of the Service</li>
                      <li>Use the Service for any commercial purpose without our express written consent</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={500}>
              <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-all duration-300">
                      <FileText className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900 group-hover:text-gray-800 transition-colors">
                      5. Intellectual Property Rights
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    The Service and its original content, features, and functionality are and will remain the exclusive
                    property of DiagonalDebate and its licensors. The Service is protected by copyright, trademark, and
                    other laws.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 leading-relaxed">
                      <strong>Your Content:</strong> You retain ownership of any legislation or content you create using
                      the Service. By using the Service, you grant us a limited license to process, store, and transmit
                      your content solely for the purpose of providing the Service.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={600}>
              <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-all duration-300">
                      <Shield className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900 group-hover:text-gray-800 transition-colors">
                      6. Data Protection and Privacy
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-red-800 font-semibold mb-2">Security Commitment:</p>
                        <p className="text-red-700 leading-relaxed">
                          We employ industry-standard security measures including encryption, secure data transmission,
                          and regular security audits to protect your information.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Your privacy is important to us. Please review our Privacy Policy, which also governs your use of
                    the Service, to understand our practices.
                  </p>
                </CardContent>
              </Card>
            </ScrollAnimation>

            {/* Continue with remaining sections... */}
            <ScrollAnimation direction="up" delay={700}>
              <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-all duration-300">
                      <Users className="h-6 w-6 text-gray-700" />
                    </div>
                    <CardTitle className="text-xl text-gray-900 group-hover:text-gray-800 transition-colors">
                      7. Educational Use
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    DiagonalDebate is designed specifically for educational purposes in the context of high school
                    congressional debate. The Service is intended to:
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <ul className="list-disc list-inside text-blue-800 space-y-2">
                      <li>Enhance learning and skill development in debate and legislation writing</li>
                      <li>Provide educational resources and materials</li>
                      <li>Facilitate proper formatting and submission of debate materials</li>
                      <li>Support academic integrity and best practices in debate</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>

            {/* Contact Section */}
            <ScrollAnimation direction="up" delay={800}>
              <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/5" />
                <CardHeader className="relative flex justify-center">
                  <div className="flex items-center space-x-4 justify-center">
                    <div className="p-3 rounded-xl bg-red-200 transition-all duration-300">
                      <Mail className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl text-red-800 font-bold">Contact Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-2 text-center flex flex-col items-center">
                  <p className="text-red-700 text-lg leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us using the form below:
                  </p>
                  <a href="/contact">
                    <button className="mt-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg shadow hover:from-red-700 hover:to-red-800 transition-all duration-300">
                      Send Us a Message
                    </button>
                  </a>
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-red-200 shadow-lg inline-block">
                    <div className="space-y-1">
                      <p className="text-gray-700">
                        <strong className="text-red-700">Platform:</strong> DiagonalDebate
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </div>
  )
}
