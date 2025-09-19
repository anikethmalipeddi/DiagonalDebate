"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  CalendarIcon,
  Trophy,
  Info,
  UserPlus,
  FileText,
  Bell,
  School,
  CheckCircle2,
  Users,
  Loader2,
  Clock,
  Sparkles,
  CalendarIcon as CalendarIconAlt,
} from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { events, type Event } from "@/lib/events"
import { format, isSameDay } from "date-fns"
import type { User } from "@/lib/auth"
import { toast } from "sonner"
import Link from "next/link"
import { ScrollAnimation } from "@/components/scroll-animation"

function SignUpModal({
  event,
  children,
  onSignUpSuccess,
}: {
  event: Event
  children: React.ReactNode
  onSignUpSuccess: () => void
}) {
  const [step, setStep] = useState(1)
  const [hasAgreed, setHasAgreed] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [announce, setAnnounce] = useState<string | null>(null)
  const [showCheck, setShowCheck] = useState(false)

  const handleSignUp = async () => {
    setIsLoading(true)
    setAnnounce(null)
    try {
      const res = await fetch("/api/events/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Sign-up failed")
      }

      setShowCheck(true)
      setAnnounce(`Successfully signed up for ${event.name}! You'll receive updates about this event.`)
      setTimeout(() => {
        setShowCheck(false)
        onSignUpSuccess()
        setIsOpen(false)
      }, 1200)
    } catch (error) {
      setAnnounce(error instanceof Error ? error.message : "An unknown error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <div aria-live="polite" className="sr-only">{announce}</div>
        {step === 1 && (
          <>
            <DialogHeader>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-3 rounded-xl">
                  <Trophy className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <DialogTitle className="text-xl">Join Event: {event.name}</DialogTitle>
                  <DialogDescription>Review the details and confirm your participation</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* Event Info Card */}
              <div className="bg-white shadow-md rounded-lg p-5 border border-gray-100 flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2">
                  <CalendarIconAlt className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-lg text-gray-900">{format(new Date(event.date.replace(/-/g, "/")), "MMMM d, yyyy")}</span>
                </div>
                {event.endDate && (
                  <div className="flex items-center gap-2 ml-7 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Ends: {format(new Date(event.endDate.replace(/-/g, "/")), "MMMM d, yyyy")}</span>
                  </div>
                )}
                <div className="ml-7 text-base text-gray-700 font-medium mt-1">{event.details}</div>
              </div>
              {/* Divider */}
              <div className="border-t border-gray-200 w-full" />
              {/* Agreement Section */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-lg w-full">
                <Checkbox
                  id="terms"
                  checked={hasAgreed}
                  onCheckedChange={(checked) => setHasAgreed(checked as boolean)}
                  className="w-6 h-6"
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-relaxed cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I have read the event details and want to participate in this event.
                </label>
              </div>
              {/* Button Area */}
              <div className="flex w-full justify-center">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!hasAgreed || isLoading}
                  className="w-full sm:w-auto transition-transform active:scale-95 mt-2"
                  autoFocus
                >
                  Continue
                </Button>
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <DialogHeader>
              <div className="flex items-center space-x-3 mb-4 justify-center">
                <div className="bg-green-100 p-3 rounded-xl flex items-center justify-center">
                  {showCheck ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600 animate-bounce" />
                  ) : (
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-xl">Confirm Registration</DialogTitle>
                  <DialogDescription>Finalize your sign-up for {event.name}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex flex-col gap-2 w-full">
                <p className="text-green-800 font-semibold">
                  You're about to confirm your participation. This action will be recorded and you'll receive event updates.
                </p>
                {/* Event summary */}
                <div className="flex items-center gap-2 mt-2">
                  <CalendarIconAlt className="w-4 h-4 text-green-700" />
                  <span className="font-medium text-green-900">{format(new Date(event.date.replace(/-/g, "/")), "MMMM d, yyyy")}</span>
                  {event.endDate && (
                    <span className="text-green-700 text-xs ml-2">to {format(new Date(event.endDate.replace(/-/g, "/")), "MMMM d, yyyy")}</span>
                  )}
                </div>
                <div className="ml-6 text-green-900 text-sm">{event.details}</div>
              </div>
              <div className="flex w-full justify-center gap-3 mt-2">
                <Button variant="outline" onClick={() => setStep(1)} disabled={isLoading}>
                  Back
                </Button>
                <Button
                  variant="success"
                  onClick={handleSignUp}
                  disabled={isLoading}
                  className="w-full sm:w-auto transition-transform active:scale-95"
                  autoFocus
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Confirming..." : "Confirm Registration"}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function EventCard({ event, currentUser }: { event: Event; currentUser: User | null }) {
  const isChampionship = event.tournamentType === "Championship"
  const isNational = event.tournamentType === "National"
  const eventDate = new Date(event.date.replace(/-/g, "/"))
  const eventEndDate = event.endDate ? new Date(event.endDate.replace(/-/g, "/")) : null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isPast = (eventEndDate || eventDate) < today

  const [attendees, setAttendees] = useState<{ id: string; name: string }[]>([])
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(true)
  const [isSignedUp, setIsSignedUp] = useState(false)

  const fetchAttendees = async () => {
    setIsLoadingAttendees(true)
    try {
      const res = await fetch(`/api/events/${event.id}/signups`)
      const data = await res.json()
      if (res.ok) {
        setAttendees(data.signups || [])
        if (currentUser) {
          setIsSignedUp(data.signups.some((a: any) => a.id === currentUser.id))
        }
      }
    } catch (error) {
      console.error("Failed to fetch attendees", error)
    } finally {
      setIsLoadingAttendees(false)
    }
  }

  useEffect(() => {
    if (event.category === "Tournament" || event.category === "Meeting") {
      fetchAttendees()
    }
  }, [event.id, event.category, currentUser])

  const categoryStyles = {
    Tournament: { icon: Trophy, color: "border-red-500", bgColor: "bg-red-50", iconColor: "text-red-600" },
    Meeting: { icon: School, color: "border-gray-400", bgColor: "bg-gray-50", iconColor: "text-gray-600" },
    Clinic: { icon: UserPlus, color: "border-red-400", bgColor: "bg-red-50", iconColor: "text-red-500" },
    Deadline: { icon: FileText, color: "border-amber-500", bgColor: "bg-amber-50", iconColor: "text-amber-600" },
    Holiday: { icon: Bell, color: "border-gray-300", bgColor: "bg-gray-50", iconColor: "text-gray-500" },
  }

  let { icon: CategoryIcon, color, bgColor, iconColor } = categoryStyles[event.category]

  if (isChampionship) {
    color = "border-yellow-500"
    bgColor = "bg-yellow-50"
    iconColor = "text-yellow-600"
  }
  if (isNational) {
    color = "border-red-800"
    bgColor = "bg-red-100"
    iconColor = "text-red-800"
  }

  const canSignUp = event.category === "Tournament" || event.category === "Meeting"

  const isAdmin = currentUser && [
    "aniketh.malipeddi@gmail.com",
    "anikethmalipeddi@gmail.com",
    "adithestar6@gmail.com",
    "udaygoel234@gmail.com",
    "uday.goel234@gmail.com"
  ].includes(currentUser.email)

  const isInviteOnly = isChampionship || isNational;

  return (
    <Card
      className={`flex flex-col h-full border-2 ${color} ${
        isPast ? "opacity-60" : ""
      } hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group bg-white`}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3 flex-1">
            <div className={`${bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
              <CategoryIcon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl text-gray-900 group-hover:text-red-600 transition-colors leading-tight mb-2">
                {event.name}
              </CardTitle>
              <div className="flex items-center space-x-2 text-gray-600">
                <CalendarIconAlt className="w-4 h-4" />
                <CardDescription className="text-base">
                  {format(eventDate, "EEEE, MMMM d, yyyy")}
                  {eventEndDate && ` - ${format(eventEndDate, "MMMM d, yyyy")}`}
                </CardDescription>
              </div>
            </div>
          </div>
          <Badge
            variant={isChampionship ? "default" : isNational ? "destructive" : "secondary"}
            className="px-3 py-1 text-sm font-medium"
          >
            {event.tournamentType ? `${event.tournamentType} ${event.category}` : event.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col space-y-4">
        <p className="text-gray-700 leading-relaxed flex-grow">{event.details}</p>
        {event.events && event.events.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.events.map((e) => (
              <Badge key={e} variant="outline" className="text-xs">
                {e}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-start space-y-4 pt-4 border-t border-gray-100">
        {canSignUp && !isPast && (
          <div className="w-full space-y-3">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-600" />
                <h4 className="font-semibold text-gray-900">Attendees ({attendees.length})</h4>
              </div>
              {isInviteOnly ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white font-semibold text-base shadow-sm border-2 border-red-700">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Invite Only – You must qualify to participate.
                </div>
              ) : currentUser ? (
                isSignedUp ? (
                  <Button variant="success" disabled>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Registered
                  </Button>
                ) : (
                  <SignUpModal event={event} onSignUpSuccess={fetchAttendees}>
                    <Button variant="primary">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Join Event
                    </Button>
                  </SignUpModal>
                )
              ) : (
                <Link href="/auth">
                  <Button variant="primary">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Login to Join
                  </Button>
                </Link>
              )}
            </div>

            {isLoadingAttendees ? (
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                <span className="text-sm text-gray-600">Loading attendees...</span>
              </div>
            ) : attendees.length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-3">
                <ScrollArea className="w-full max-h-40">
                  <div className="flex flex-col gap-1">
                    {attendees.map((a) => (
                      <div key={a.id} className="text-sm text-gray-700 flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>{a.name}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500">Be the first to join this event!</p>
              </div>
            )}
          </div>
        )}
        {isPast && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Completed
          </Badge>
        )}
      </CardFooter>
    </Card>
  )
}

export default function EventBoardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isClient, setIsClient] = useState(false)

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])

  const [wacflDates, setWacflDates] = useState<Date[]>([])
  const [championshipDates, setChampionshipDates] = useState<Date[]>([])
  const [nationalDates, setNationalDates] = useState<Date[]>([])
  const [meetingDates, setMeetingDates] = useState<Date[]>([])
  const [clinicDates, setClinicDates] = useState<Date[]>([])
  const [deadlineDates, setDeadlineDates] = useState<Date[]>([])
  const [holidayDates, setHolidayDates] = useState<Date[]>([])
  const [pastDates, setPastDates] = useState<Date[]>([])

  const [calendarMonth, setCalendarMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me")
        const data = await res.json()
        if (res.ok && data.user) {
          setCurrentUser(data.user)
        }
      } catch (error) {
        console.error("Failed to fetch user", error)
      }
    }
    fetchUser()

    // Date-sensitive logic is now on the client
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const getDatesFromEvents = (events: Event[]): Date[] => {
      const dates: Date[] = []
      events.forEach((event) => {
        const startDate = new Date(event.date.replace(/-/g, "/"))
        const endDate = event.endDate ? new Date(event.endDate.replace(/-/g, "/")) : startDate

        const currentDate = new Date(startDate)
        while (currentDate <= endDate) {
          dates.push(new Date(currentDate))
          currentDate.setDate(currentDate.getDate() + 1)
        }
      })
      return dates
    }

    const upcoming = events
      .filter(
        (event) =>
          (event.endDate ? new Date(event.endDate.replace(/-/g, "/")) : new Date(event.date.replace(/-/g, "/"))) >=
          today,
      )
      .sort((a, b) => new Date(a.date.replace(/-/g, "/")).getTime() - new Date(b.date.replace(/-/g, "/")).getTime())

    const past = events
      .filter(
        (event) =>
          (event.endDate ? new Date(event.endDate.replace(/-/g, "/")) : new Date(event.date.replace(/-/g, "/"))) <
          today,
      )
      .sort((a, b) => new Date(b.date.replace(/-/g, "/")).getTime() - new Date(a.date.replace(/-/g, "/")).getTime())

    setUpcomingEvents(upcoming)
    setPastEvents(past)

    const wacflEvents = upcoming.filter(
      (e) => e.tournamentType === "WACFL" || (!e.tournamentType && e.category === "Tournament"),
    )
    const championshipEvents = upcoming.filter((e) => e.tournamentType === "Championship")
    const nationalEvents = upcoming.filter((e) => e.tournamentType === "National")
    const meetingEvents = upcoming.filter((e) => e.category === "Meeting")
    const clinicEvents = upcoming.filter((e) => e.category === "Clinic")
    const deadlineEvents = upcoming.filter((e) => e.category === "Deadline")
    const holidayEvents = upcoming.filter((e) => e.category === "Holiday")

    setWacflDates(getDatesFromEvents(wacflEvents))
    setChampionshipDates(getDatesFromEvents(championshipEvents))
    setNationalDates(getDatesFromEvents(nationalEvents))
    setMeetingDates(getDatesFromEvents(meetingEvents))
    setHolidayDates(getDatesFromEvents(holidayEvents))
    setDeadlineDates(getDatesFromEvents(deadlineEvents))
    setClinicDates(getDatesFromEvents(clinicEvents))
    setPastDates(getDatesFromEvents(past))

    setIsClient(true)
  }, [])

  const filteredEvents = date
    ? upcomingEvents.filter((event) => {
        const startDate = new Date(event.date.replace(/-/g, "/"))
        const endDate = event.endDate ? new Date(event.endDate.replace(/-/g, "/")) : startDate

        const currentDate = new Date(startDate)
        while (currentDate <= endDate) {
          if (isSameDay(currentDate, date)) {
            return true
          }
          currentDate.setDate(currentDate.getDate() + 1)
        }
        return false
      })
    : upcomingEvents

  const getEventStats = () => {
    const totalEvents = upcomingEvents.length
    const tournaments = upcomingEvents.filter((e) => e.category === "Tournament").length
    const meetings = upcomingEvents.filter((e) => e.category === "Meeting").length
    const deadlines = upcomingEvents.filter((e) => e.category === "Deadline").length

    return { totalEvents, tournaments, meetings, deadlines }
  }

  const stats = getEventStats()

  const upcomingTitle = !date
    ? "All Upcoming Events"
    : isSameDay(date, new Date())
    ? "Today's Events"
    : `Events on ${format(date, "EEEE, MMMM d")}`

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
              Team Calendar
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Event{" "}
              <span className="text-red-600 relative">
                Board
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse" />
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Stay connected with all debate team activities, from tournaments to team meetings and important deadlines.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <ScrollAnimation direction="up" delay={200}>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stats.totalEvents}</div>
                  <div className="text-sm text-gray-600">Total Events</div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation direction="up" delay={300}>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-red-600 mb-1">{stats.tournaments}</div>
                  <div className="text-sm text-gray-600">Tournaments</div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation direction="up" delay={400}>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-700 mb-1">{stats.meetings}</div>
                  <div className="text-sm text-gray-600">Meetings</div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation direction="up" delay={500}>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-amber-600 mb-1">{stats.deadlines}</div>
                  <div className="text-sm text-gray-600">Deadlines</div>
                </div>
              </ScrollAnimation>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Calendar Sidebar */}
            <div className="lg:col-span-1">
              <ScrollAnimation direction="left">
                <Card className="shadow-xl border-gray-200 bg-white sticky top-8">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <CalendarIcon className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Event Calendar</CardTitle>
                        <CardDescription>Select a date to filter events</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex justify-center pb-4">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      month={calendarMonth}
                      onMonthChange={setCalendarMonth}
                      className="p-0"
                      modifiers={{
                        wacfl: wacflDates,
                        championship: championshipDates,
                        national: nationalDates,
                        meeting: meetingDates,
                        holiday: holidayDates,
                        deadline: deadlineDates,
                        clinic: clinicDates,
                        past: pastDates,
                        event: [
                          ...wacflDates,
                          ...championshipDates,
                          ...nationalDates,
                          ...meetingDates,
                          ...holidayDates,
                          ...deadlineDates,
                          ...clinicDates,
                        ],
                      }}
                      modifiersClassNames={{
                        wacfl: "border-2 border-red-500",
                        championship: "border-2 border-yellow-500",
                        national: "border-2 border-red-800",
                        meeting: "border-2 border-gray-400",
                        holiday: "border-2 border-gray-300",
                        deadline: "border-2 border-amber-500",
                        clinic: "border-2 border-red-400",
                        past: "line-through opacity-50",
                      }}
                    />
                  </CardContent>
                  {date && (
                    <CardFooter className="pt-0">
                      <Button
                        variant="outline"
                        onClick={() => setDate(undefined)}
                        className="w-full border-gray-300 hover:bg-gray-50"
                      >
                        View All Events
                      </Button>
                    </CardFooter>
                  )}

                  {/* Legend */}
                  <CardFooter className="pt-4 border-t border-gray-100">
                    <div className="w-full space-y-2">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Event Types</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-600 rounded-full" />
                          <span>Tournaments</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                          <span>Championships</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-gray-400 rounded-full" />
                          <span>Meetings</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-amber-500 rounded-full" />
                          <span>Deadlines</span>
                        </div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </ScrollAnimation>
            </div>

            {/* Events Content */}
            <div className="lg:col-span-3">
              <ScrollAnimation direction="right">
                <Tabs defaultValue="today" className="w-full">
                  <TabsList className="w-full gap-0 bg-white border border-gray-200 p-1 rounded-lg shadow-sm flex justify-center">
                    <TabsTrigger value="today">
                      <div className="flex items-center space-x-2">
                        <CalendarIconAlt className="w-4 h-4" />
                        <span>Upcoming Events</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed Events</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="today" className="mt-8">
                    {!isClient ? (
                      <div className="text-center py-16">
                        <div className="relative mb-4">
                          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
                          <Sparkles className="w-6 h-6 text-red-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <p className="text-lg font-medium text-gray-900">Loading events...</p>
                        <p className="text-gray-600">Please wait while we fetch the latest information</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h2 className="text-2xl font-bold text-gray-900">{upcomingTitle}</h2>
                              <p className="text-gray-600 mt-1">
                                {date
                                  ? format(date, "EEEE, MMMM d, yyyy")
                                  : "Showing all upcoming events"}
                              </p>
                            </div>
                            {date ? (
                              <Button
                                variant="outline"
                                onClick={() => setDate(undefined)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                View All Upcoming
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                onClick={() => {
                                  const today = new Date();
                                  setDate(today);
                                  setCalendarMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                                }}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                Show Today's Events
                              </Button>
                            )}
                          </div>

                          {filteredEvents.length > 0 ? (
                            <div className="grid grid-cols-1 gap-8">
                              {filteredEvents.map((event, index) => (
                                <ScrollAnimation key={event.id} direction="up" delay={index * 50}>
                                  <EventCard event={event} currentUser={currentUser} />
                                </ScrollAnimation>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-16">
                              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CalendarIcon className="w-10 h-10 text-gray-400" />
                              </div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {date ? "No events on this date" : "No upcoming events"}
                              </h3>
                              <p className="text-gray-600 mb-4">
                                {date
                                  ? "Try selecting another date or view all upcoming events."
                                  : "Check back later for new events and announcements."}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="completed" className="mt-8">
                    {!isClient ? (
                      <div className="text-center py-16">
                        <div className="relative mb-4">
                          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto"></div>
                          <CheckCircle2 className="w-6 h-6 text-gray-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <p className="text-lg font-medium text-gray-900">Loading completed events...</p>
                      </div>
                    ) : pastEvents.length > 0 ? (
                      <div className="grid grid-cols-1 gap-8">
                        {pastEvents.map((event, index) => (
                          <ScrollAnimation key={event.id} direction="up" delay={index * 50}>
                            <EventCard event={event} currentUser={currentUser} />
                          </ScrollAnimation>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No completed events yet</h3>
                        <p className="text-gray-600">Completed events will appear here after they finish.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* General Notices Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="bg-red-100 p-3 rounded-xl inline-flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Important Notices</h2>
                <p className="text-lg text-gray-600">Please review these important updates and policies</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Weather Policy */}
                <Card className="border-red-200 bg-red-50/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="bg-red-100 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <Info className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-900">Weather Policy</CardTitle>
                        <CardDescription>Tournament flexibility</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      Any tournament may be shifted to virtual format in case of weather cancellations, 
                      while maintaining the same calendar dates. This ensures continuity of the debate season.
                    </p>
                  </CardContent>
                </Card>

                {/* MetroFinals Format */}
                <Card className="border-yellow-200 bg-yellow-50/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="bg-yellow-100 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-900">MetroFinals Format</CardTitle>
                        <CardDescription>Hybrid tournament structure</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      Congress MetroFinals in March will be held virtually on Friday and in-person on Saturday 
                      at Dominion High School (Sterling, VA). This hybrid format maximizes participation and safety.
                    </p>
                  </CardContent>
                </Card>

                {/* Schedule Status */}
                <Card className="border-gray-200 bg-gray-50/50 md:col-span-2">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-900">Schedule Status</CardTitle>
                        <CardDescription>Subject to change</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      This is a draft schedule and subject to change until tournaments officially open on Tabroom.com. 
                      Please check back regularly for updates and confirm all details before making travel arrangements.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  )
} 