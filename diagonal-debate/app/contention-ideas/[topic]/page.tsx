"use client"

import type React from "react"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Tag, FileText, Target } from "lucide-react"
import { contentionIdeas, type ContentionIdea } from "@/lib/contentionIdeas"
import { ScrollAnimation } from "@/components/scroll-animation"



function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export default function ContentionTopicPage() {
  const params = useParams()
  const router = useRouter()
  const { topic } = params as { topic: string }
  const topicObj: ContentionIdea | undefined = contentionIdeas.find(
    (idea: ContentionIdea) => slugify(idea.title) === topic,
  )

  if (!topicObj) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-transparent" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-70" />

        <div className="relative max-w-2xl mx-auto py-32 text-center px-4">
          <ScrollAnimation direction="fade">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Topic Not Found</h2>
            <p className="text-lg text-gray-600 mb-8">The contention topic you're looking for doesn't exist.</p>
            <Button
              onClick={() => router.push("/contention-ideas")}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Contention Ideas
            </Button>
          </ScrollAnimation>
        </div>
      </div>
    )
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-transparent" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-red-200/30 to-gray-200/30 rounded-full filter blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <ScrollAnimation direction="left">
          <Button variant="ghost" className="mb-8 transition-all duration-300 group" onClick={() => router.push("/contention-ideas")}>
            <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Contention Ideas
          </Button>
        </ScrollAnimation>

        {/* Tabs for Overview and AI Generator */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8 bg-red-600 p-0 rounded-lg flex gap-0 justify-center overflow-hidden">
            <TabsTrigger
              value="overview"
              className="!bg-red-600 !text-white !shadow-none w-full justify-center rounded-none px-6 py-4"
            >
              <div className="flex items-center justify-center gap-3 w-full">
                <FileText className="w-5 h-5 text-white" />
                <span className="text-lg font-semibold">Topic Overview</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Topic Overview Tab */}
          <TabsContent value="overview">
            <ScrollAnimation direction="up" className="mb-12">
              <Card className="border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex flex-wrap gap-2 items-center mb-4">
                    <Badge className="bg-red-100 text-red-800 border border-red-200 px-3 py-1 font-medium">
                      {topicObj.category}
                    </Badge>
                    {topicObj.tags.map((tag: string, i: number) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-900 leading-tight mb-3">{topicObj.title}</CardTitle>
                  <CardDescription className="text-lg text-gray-600 leading-relaxed">
                    {topicObj.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="for" className="w-full">
                    <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg flex justify-center gap-2">
                      <TabsTrigger value="for">
                        <div className="flex items-center justify-center gap-3">
                          <Target className="w-5 h-5" />
                          <span className="text-base font-semibold">Arguments For</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger value="against">
                        <div className="flex items-center justify-center gap-3">
                          <Target className="w-5 h-5" />
                          <span className="text-base font-semibold">Arguments Against</span>
                        </div>
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="for" className="mt-6">
                      <div className="space-y-3">
                        {topicObj.argumentsFor.map((arg: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 border border-green-100"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <p className="text-gray-800 leading-relaxed">{arg}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="against" className="mt-6">
                      <div className="space-y-3">
                        {topicObj.argumentsAgainst.map((arg: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-start space-x-3 p-3 rounded-lg bg-red-50 border border-red-100"
                          >
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                            <p className="text-gray-800 leading-relaxed">{arg}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 