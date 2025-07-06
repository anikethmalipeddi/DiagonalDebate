"use client"

import { events } from "@/lib/events"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Calendar, UserCheck, ShieldAlert, BookOpen, Star, ChevronDown, ChevronRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

const ADMIN_EMAILS = [
  "aniketh.malipeddi@gmail.com",
  "anikethmalipeddi@gmail.com"
]

const lessonFiles: string[] = [
  "general-overview-schedule-wacfl-1.pdf",
  "congressional-debate-basics.pdf",
  "presentation-delivery-how-to.pdf",
  "intros-rhetoric-how-to.pdf",
  "speech-structures-round-strategy-overview.pdf",
  "argument-construction.pdf",
  "logical-reasoning-how-to.pdf",
  "contention-structure-practice.pdf",
  "introduction-to-refutation-weighing.pdf",
  "refutations-2025.pdf",
  "cross-examination.pdf",
  "impacting-how-to.pdf",
  "parliamentary-procedure.pdf",
  "presiding-guide-rr.pdf",
  "legislation-civics-research-how-to.pdf",
  "practice-drills.pdf",
  "advanced-rhetoric-how-to.pdf",
  "argument-generation-bonus-lecture-2025.pdf",
  "extemporaneous-speaking-textbook.pdf"
];

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [usersWithLessons, setUsersWithLessons] = useState<any[]>([])
  const [eventsWithSignups, setEventsWithSignups] = useState<any[]>([])
  const [selectedUsers, setSelectedUsers] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})
  const { toast } = useToast()
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const allLessons = lessonFiles;
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)

  useEffect(() => {
    // Fetch current user
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user)
        }
  })
  
    // Fetch users
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (data.users) {
          setUsersWithLessons(data.users)
        }
      })

    // Fetch events with signups
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.events) {
          setEventsWithSignups(data.events)
        }
      })
  }, [])

  const handleAddUser = async (eventId: string) => {
    const userId = selectedUsers[eventId]
    if (!userId) {
      toast({
        title: "Error",
        description: "Please select a user first",
        variant: "destructive"
      })
      return
    }

    setLoading(prev => ({ ...prev, [eventId]: true }))

    try {
      const response = await fetch(`/api/events/${eventId}/add-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: `User added to event successfully`,
  })

        // Refresh events data
        const eventsResponse = await fetch('/api/events')
        const eventsData = await eventsResponse.json()
        if (eventsData.events) {
          setEventsWithSignups(eventsData.events)
        }
        
        // Clear selection
        setSelectedUsers(prev => ({ ...prev, [eventId]: '' }))
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add user to event",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user to event",
        variant: "destructive"
      })
    } finally {
      setLoading(prev => ({ ...prev, [eventId]: false }))
    }
  }

  if (!currentUser || !ADMIN_EMAILS.includes(currentUser.email)) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <Alert className="max-w-md">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You need admin privileges to access this page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const totalUsers = usersWithLessons.length
  const totalEvents = eventsWithSignups.length

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="max-w-screen-lg mx-auto">
            <TabsList className="w-full gap-0 rounded-2xl overflow-hidden p-0 m-0">
              <TabsTrigger className="flex-1" value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger className="flex-1" value="users">User Management</TabsTrigger>
              <TabsTrigger className="flex-1" value="lessons">Lesson Analytics</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="dashboard">
            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 my-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUsers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalEvents}</div>
                </CardContent>
              </Card>
            </div>
            {/* Events Table */}
            <Card>
              <CardHeader>
                <CardTitle>Event Signups</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Signups</TableHead>
                      <TableHead>Attendees</TableHead>
                      <TableHead>Add User</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventsWithSignups.map((event: any) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={event.signupCount > 0 ? "default" : "outline"}>
                            {event.signupCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {Array.isArray(event.signedUpUsers) && event.signedUpUsers.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {event.signedUpUsers.map((name: string, index: number) => (
                                <Badge key={index} variant="outline" className="font-normal">{name}</Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">No one signed up</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select 
                              value={selectedUsers[event.id] || ''} 
                              onValueChange={(value) => setSelectedUsers(prev => ({ ...prev, [event.id]: value }))}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Select user" />
                              </SelectTrigger>
                              <SelectContent>
                                {usersWithLessons.map((user) => (
                                  <SelectItem key={user.id} value={user.id}>
                                    {user.name || user.email}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAddUser(event.id)}
                              disabled={loading[event.id]}
                            >
                              {loading[event.id] ? 'Adding...' : 'Add'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users & Their Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Select value={selectedUserId || ''} onValueChange={setSelectedUserId}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                    {usersWithLessons.map((user: any) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedUserId && (() => {
                  const user = usersWithLessons.find((u: any) => u.id === selectedUserId)
                  if (!user) return null
                  return (
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="mb-4">
                        <span className="font-semibold text-lg">{user.name}</span>
                        <span className="ml-4 text-gray-600">{user.email}</span>
                        <span className="ml-4 text-gray-500">Registered: {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <div className="font-semibold mb-2">Event Signups</div>
                          {user.eventSignups && user.eventSignups.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {user.eventSignups.map((signup: any) => {
                                const event = eventsWithSignups.find(e => e.id === signup.eventId);
                                return (
                                  <div key={signup.id} className="text-xs bg-white rounded px-2 py-1 border border-gray-200 mb-1 flex flex-col">
                                    <span className="font-medium text-gray-800">{event ? event.title : signup.eventId}</span>
                                    <span className="text-gray-500">{new Date(signup.createdAt).toLocaleDateString()}</span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">No event signups</span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold mb-2">Lesson Enrollments</div>
                          {user.lessonEnrollments && user.lessonEnrollments.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {user.lessonEnrollments.map((enrollment: any) => (
                                <div key={enrollment.id} className="text-xs bg-white rounded px-2 py-1 border border-gray-200 mb-1 flex flex-col">
                                  <span className="font-medium text-gray-800">{enrollment.lessonFileName.replace('.pdf', '')}</span>
                                  <span className="text-gray-500">{new Date(enrollment.createdAt).toLocaleDateString()}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">No lesson enrollments</span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold mb-2">Lesson Ratings</div>
                          {user.lessonRatings && user.lessonRatings.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {user.lessonRatings.map((rating: any) => (
                                <div key={rating.id} className="text-xs bg-white rounded px-2 py-1 border border-gray-200 mb-1 flex flex-col">
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-800">{rating.lessonFileName.replace('.pdf', '')}</span>
                                    <span className="text-yellow-600">★ {rating.rating}</span>
                                  </div>
                                  <span className="text-gray-500">{new Date(rating.createdAt).toLocaleDateString()}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">No ratings</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="lessons">
              <Card>
                <CardHeader>
                <CardTitle>Lesson Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="mb-6">
                  <Select value={selectedLesson || ''} onValueChange={setSelectedLesson}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select a lesson" />
                    </SelectTrigger>
                    <SelectContent>
                      {allLessons.map((lesson) => (
                        <SelectItem key={lesson} value={lesson}>
                          {lesson.replace('.pdf', '')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedLesson && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="font-semibold mb-2">Enrollments</div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Enrolled On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                          {usersWithLessons.flatMap(user =>
                            user.lessonEnrollments?.filter((e: any) => e.lessonFileName === selectedLesson).map((e: any) => ({ ...e, user })) || []
                          ).map((enrollment: any) => (
                        <TableRow key={enrollment.id}>
                              <TableCell>{enrollment.user.name || enrollment.user.email}</TableCell>
                              <TableCell>{new Date(enrollment.createdAt).toLocaleDateString()} {new Date(enrollment.createdAt).toLocaleTimeString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                    </div>
                    <div>
                      <div className="font-semibold mb-2">Ratings</div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Rated On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                          {usersWithLessons.flatMap(user =>
                            user.lessonRatings?.filter((r: any) => r.lessonFileName === selectedLesson).map((r: any) => ({ ...r, user })) || []
                          ).map((rating: any) => (
                        <TableRow key={rating.id}>
                              <TableCell>{rating.user.name || rating.user.email}</TableCell>
                              <TableCell><span className="text-yellow-600">★</span> {rating.rating}/5</TableCell>
                              <TableCell>{new Date(rating.createdAt).toLocaleDateString()} {new Date(rating.createdAt).toLocaleTimeString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                    </div>
                  </div>
                )}
                </CardContent>
              </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 