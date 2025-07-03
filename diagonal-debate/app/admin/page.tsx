import { events } from "@/lib/events"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Users, Calendar, UserCheck, ShieldAlert, BookOpen, Star } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { prisma } from '@/lib/prisma'

const ADMIN_EMAILS = [
  "aniketh.malipeddi@gmail.com",
  "anikethmalipeddi@gmail.com"
]

export default async function AdminPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser || !ADMIN_EMAILS.includes(currentUser.email)) {
    redirect("/")
  }

  // Fetch users with lesson data
  const usersWithLessons = await prisma.user.findMany({
    include: {
      lessonRatings: true,
      lessonEnrollments: true,
    },
  })
  
  // Fetch lesson enrollments and ratings
  const lessonEnrollments = await prisma.lessonEnrollment.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  })
  const lessonRatings = await prisma.lessonRating.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  })

  // Fetch event signups
  const eventSignups = await prisma.eventSignup.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  })

  // Fetch real events from the database
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
  });

  const totalUsers = usersWithLessons.length
  const totalLessonEnrollments = lessonEnrollments.length
  const totalLessonRatings = lessonRatings.length

  const totalEvents = events.length

  // Await all event signups promises
  const eventsWithSignups = await Promise.all(events.map(async (event: ReturnType<typeof prisma.event.findMany>[number]) => {
    const signupsForEvent = await prisma.eventSignup.findMany({
      where: { eventId: event.id },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    const signedUpUsers = signupsForEvent.map((signup) => signup.user?.name || signup.user?.email || 'Unknown');
    return {
      ...event,
      signupCount: signupsForEvent.length,
      signedUpUsers
    };
  }));

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
                  <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{eventSignups.length}</div>
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lesson Enrollments</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalLessonEnrollments}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lesson Ratings</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalLessonRatings}</div>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventsWithSignups.map((event: any) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.date}</TableCell>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Event Signups</TableHead>
                      <TableHead>Lesson Enrollments</TableHead>
                      <TableHead>Lesson Ratings</TableHead>
                      <TableHead>Registered On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersWithLessons.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.eventSignups && user.eventSignups.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {user.eventSignups.map((signup: any) => {
                                const event = events.find(e => e.id === signup.eventId);
                                return (
                                  <div key={signup.id} className="text-xs">
                                    <Badge variant="secondary" className="text-xs">
                                      {event ? event.title : signup.eventId}
                                    </Badge>
                                    <div className="text-gray-500 mt-1">
                                      {signup.createdAt.toLocaleDateString()}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">No event signups</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.lessonEnrollments && user.lessonEnrollments.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {user.lessonEnrollments.map((enrollment: any) => (
                                <div key={enrollment.id} className="text-xs">
                                  <Badge variant="outline" className="text-xs">
                                    {enrollment.lessonFileName.replace('.pdf', '')}
                                  </Badge>
                                  <div className="text-gray-500 mt-1">
                                    {enrollment.createdAt.toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">No lesson enrollments</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.lessonRatings && user.lessonRatings.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {user.lessonRatings.map((rating: any) => (
                                <div key={rating.id} className="text-xs">
                                  <div className="flex items-center gap-1">
                                    <Badge variant="outline" className="text-xs">
                                      {rating.lessonFileName.replace('.pdf', '')}
                                    </Badge>
                                    <span className="text-yellow-600">★ {rating.rating}</span>
                                  </div>
                                  <div className="text-gray-500 mt-1">
                                    {rating.createdAt.toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">No ratings</span>
                          )}
                        </TableCell>
                        <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="lessons">
            <div className="grid gap-6">
              {/* Lesson Enrollments */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Lesson Enrollments</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Lesson</TableHead>
                        <TableHead>Enrolled On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lessonEnrollments.slice(0, 20).map((enrollment: any) => (
                        <TableRow key={enrollment.id}>
                          <TableCell className="font-medium">
                            {enrollment.user.name || enrollment.user.email}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {enrollment.lessonFileName.replace('.pdf', '')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {enrollment.createdAt.toLocaleDateString()} at {enrollment.createdAt.toLocaleTimeString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Lesson Ratings */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Lesson Ratings</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Lesson</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Rated On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lessonRatings.slice(0, 20).map((rating: any) => (
                        <TableRow key={rating.id}>
                          <TableCell className="font-medium">
                            {rating.user.name || rating.user.email}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {rating.lessonFileName.replace('.pdf', '')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-600">★</span>
                              <span className="font-medium">{rating.rating}/5</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {rating.createdAt.toLocaleDateString()} at {rating.createdAt.toLocaleTimeString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 