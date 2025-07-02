"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, Database, UserCheck, Mail, MapPin } from "lucide-react"
import { ScrollAnimation } from "@/components/scroll-animation"
import { AnimatedIcon } from "@/components/animated-icon"

const securityFeatures = [
  {
    icon: Lock,
    title: "256-bit Encryption",
    description: "Military-grade encryption for all data",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    icon: Database,
    title: "Secure Storage",
    description: "Protected cloud infrastructure",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
  {
    icon: UserCheck,
    title: "Access Controls",
    description: "Multi-layered authentication",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
]

const privacyRights = [
  {
    title: "Access and Control",
    items: [
      "View your personal information",
      "Update your account details",
      "Download your data",
      "Delete your account",
    ],
  },
  {
    title: "Privacy Controls",
    items: [
      "Opt out of non-essential communications",
      "Control data sharing preferences",
      "Request data correction",
      "File privacy complaints",
    ],
  },
]

const securityMeasures = [
  {
    title: "Encryption",
    items: ["256-bit AES encryption for data at rest", "TLS 1.3 for data in transit", "Encrypted database storage"],
    icon: Lock,
  },
  {
    title: "Access Controls",
    items: ["Multi-factor authentication", "Role-based access permissions", "Regular access audits"],
    icon: UserCheck,
  },
  {
    title: "Infrastructure",
    items: ["Secure cloud hosting", "Regular security updates", "Automated backup systems"],
    icon: Database,
  },
  {
    title: "Monitoring",
    items: ["24/7 security monitoring", "Intrusion detection systems", "Regular security assessments"],
    icon: Shield,
  },
]

export default function PrivacyPage() {
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
              Privacy{" "}
              <span className="text-red-600 relative">
                Policy
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse" />
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your privacy and data security are our highest priorities. We're committed to transparency and protecting
              your information.
            </p>
            <p className="text-sm text-gray-500 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full inline-block shadow-sm">
              Last updated: June 20, 2025
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Security Emphasis Section */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" className="mb-12">
            <Card className="border-0 bg-gradient-to-br from-red-600 to-red-700 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <CardHeader className="relative">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <AnimatedIcon icon={Shield} className="h-8 w-8 text-white" delay={200} />
                  </div>
                  <CardTitle className="text-2xl lg:text-3xl font-bold">Security-First Approach</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-red-100 mb-6 text-lg leading-relaxed">
                  DiagonalDebate is built with security as our foundation. We implement multiple layers of protection
                  including end-to-end encryption, secure data transmission, regular security audits, and strict access
                  controls to ensure your information remains private and secure.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {securityFeatures.map((feature, index) => (
                    <ScrollAnimation key={index} direction="up" delay={index * 100}>
                      <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-all duration-300">
                        <AnimatedIcon icon={feature.icon} className="h-5 w-5 text-white" delay={300 + index * 100} />
                        <span className="text-sm text-white font-medium">{feature.title}</span>
                      </div>
                    </ScrollAnimation>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Information We Collect */}
            <ScrollAnimation direction="up" delay={100}>
              <Card className="border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 group-hover:text-gray-800 transition-colors">
                    1. Information We Collect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                      Personal Information
                    </h4>
                    <p className="text-gray-700 mb-3">When you create an account, we collect:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                      <li>Name and email address</li>
                      <li>Account credentials (securely hashed passwords)</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-gray-600 rounded-full mr-3"></div>
                      Content Information
                    </h4>
                    <p className="text-gray-700 mb-3">When you use our services, we collect:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                      <li>Legislation text and documents you create</li>
                      <li>Usage data and interaction patterns</li>
                      <li>Feedback and improvement suggestions</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                      Technical Information
                    </h4>
                    <p className="text-gray-700 mb-3">We automatically collect:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                      <li>IP address and browser information</li>
                      <li>Device and operating system details</li>
                      <li>Usage analytics and performance metrics</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>

            {/* How We Use Your Information */}
            <ScrollAnimation direction="up" delay={200}>
              <Card className="border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 group-hover:text-gray-800 transition-colors">
                    2. How We Use Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 text-lg">We use your information solely for educational purposes:</p>
                  <div className="grid gap-4">
                    {[
                      {
                        title: "Service Provision",
                        desc: "To provide legislation checking, formatting, and submission services",
                      },
                      { title: "Educational Support", desc: "To deliver lessons, resources, and learning materials" },
                      { title: "Communication", desc: "To send important updates about your submissions and account" },
                      { title: "Improvement", desc: "To enhance our services and develop new educational features" },
                      { title: "Security", desc: "To protect against fraud, abuse, and security threats" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                      >
                        <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong className="text-gray-900">{item.title}:</strong>
                          <span className="text-gray-700 ml-2">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>

            {/* Data Security Measures */}
            <ScrollAnimation direction="up" delay={300}>
              <Card className="border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 p-2 rounded-lg group-hover:bg-red-200 transition-colors duration-300">
                      <AnimatedIcon icon={Lock} className="h-6 w-6 text-red-600" delay={400} />
                    </div>
                    <CardTitle className="text-xl text-gray-900 group-hover:text-gray-800 transition-colors">
                      3. Data Security Measures
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-gray-700 text-lg">
                    We implement comprehensive security measures to protect your data:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {securityMeasures.map((measure, index) => (
                      <ScrollAnimation key={index} direction="up" delay={500 + index * 100}>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group/card">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover/card:shadow-md transition-shadow duration-300">
                              <AnimatedIcon
                                icon={measure.icon}
                                className="h-5 w-5 text-red-600"
                                delay={600 + index * 100}
                              />
                            </div>
                            <h4 className="font-semibold text-gray-900">{measure.title}</h4>
                          </div>
                          <ul className="text-sm text-gray-700 space-y-2">
                            {measure.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </ScrollAnimation>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>

            {/* Information Sharing */}
            <ScrollAnimation direction="up" delay={400}>
              <Card className="border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 group-hover:text-gray-800 transition-colors">
                    4. Information Sharing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 p-6 rounded-xl">
                    <p className="text-red-800 font-semibold text-lg">
                      We do not sell, trade, or rent your personal information to third parties.
                    </p>
                  </div>
                  <p className="text-gray-700">We may share information only in these limited circumstances:</p>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Educational Purpose",
                        desc: "With your debate captains when you submit legislation (as intended by the service)",
                      },
                      { title: "Legal Requirements", desc: "When required by law or to protect our rights and safety" },
                      {
                        title: "Service Providers",
                        desc: "With trusted partners who help us operate the service (under strict confidentiality agreements)",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                      >
                        <div className="w-3 h-3 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong className="text-gray-900">{item.title}:</strong>
                          <span className="text-gray-700 ml-2">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>

            {/* Your Rights and Choices */}
            <ScrollAnimation direction="up" delay={500}>
              <Card className="border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 group-hover:text-gray-800 transition-colors">
                    5. Your Rights and Choices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-gray-700 text-lg">
                    You have the following rights regarding your personal information:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {privacyRights.map((section, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300"
                      >
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <div
                            className={`w-3 h-3 ${index === 0 ? "bg-red-600" : "bg-gray-600"} rounded-full mr-3`}
                          ></div>
                          {section.title}
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-2">
                          {section.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>

            {/* Additional sections with similar styling... */}
            {[
              {
                title: "6. Data Retention",
                content: (
                  <div className="space-y-4">
                    <p className="text-gray-700">We retain your information only as long as necessary:</p>
                    <div className="space-y-3">
                      {[
                        { title: "Account Information", desc: "Until you delete your account or request removal" },
                        {
                          title: "Legislation Content",
                          desc: "As long as needed for educational purposes or as requested",
                        },
                        {
                          title: "Usage Data",
                          desc: "Aggregated and anonymized data may be retained for service improvement",
                        },
                        { title: "Security Logs", desc: "Retained for security monitoring and compliance purposes" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                        >
                          <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <strong className="text-gray-900">{item.title}:</strong>
                            <span className="text-gray-700 ml-2">{item.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
            ].map((section, sectionIndex) => (
              <ScrollAnimation key={sectionIndex} direction="up" delay={600 + sectionIndex * 100}>
                <Card className="border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 group-hover:text-gray-800 transition-colors">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>{section.content}</CardContent>
                </Card>
              </ScrollAnimation>
            ))}

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
                    If you have any questions about this Privacy Policy, please contact us using the form below:
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
