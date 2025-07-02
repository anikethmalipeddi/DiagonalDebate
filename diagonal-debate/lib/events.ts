import { Calendar, Building, Globe, Star, Trophy } from "lucide-react"

export type Event = {
  id: string
  name: string
  host?: string
  date: string
  endDate?: string
  category: "Tournament" | "Meeting" | "Clinic" | "Deadline" | "Holiday"
  tournamentType?: "WACFL" | "Championship" | "National"
  events?: string[]
  status?: "Open" | "Qualifiers Only" | "Confirm Attendance"
  details: string
  invitationLink?: string
}

export const events: Event[] = [
  // Deadlines
  {
    id: "deadline-reg-opens",
    name: "Online Team Registration Opens",
    date: "2025-08-27",
    category: "Deadline",
    details: "Registration for the new season opens online.",
  },
  {
    id: "deadline-dues",
    name: "Debate Team Dues",
    date: "2025-09-25",
    category: "Deadline",
    details: "Team dues payment due via SchoolCashOnline.",
  },
  {
    id: "deadline-field-trip-form",
    name: "Field Trip Form",
    date: "2025-09-25",
    category: "Deadline",
    details: "Field trip form must be submitted to Ms. Srinivasan in person.",
  },
  {
    id: "deadline-final",
    name: "Final Registration Deadline",
    date: "2025-09-25",
    category: "Deadline",
    details: "Final deadline for all registration, dues ($95), and field trip forms.",
  },

  // Clinics
  {
    id: "clinic-congress",
    name: "Congressional Debate Clinic",
    date: "2025-09-08",
    category: "Clinic",
    details: "A special clinic focused on Congressional Debate.",
  },

  // Holidays / No Practice
  { id: "holiday-oct-2", name: "No Practice", date: "2025-10-02", category: "Holiday", details: "No practice due to holiday." },
  { id: "holiday-nov-4", name: "No Practice", date: "2025-11-04", category: "Holiday", details: "No practice due to student holiday." },
  { id: "holiday-dec-18", name: "No Practice", date: "2025-12-18", category: "Holiday", details: "Last day before winter break." },
  { id: "holiday-feb-17", name: "No Practice", date: "2026-02-17", category: "Holiday", details: "No practice due to holiday." },

  // Regular Meetings
  // September
  { id: "meeting-2025-09-16", name: "Regular Practice", date: "2025-09-16", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2025-09-18", name: "Regular Practice", date: "2025-09-18", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2025-09-23", name: "Regular Practice", date: "2025-09-23", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2025-09-25", name: "Regular Practice", date: "2025-09-25", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2025-09-30", name: "Regular Practice", date: "2025-09-30", category: "Meeting", details: "Regular team practice." },
  // October
  { id: "meeting-2025-10-07", name: "Regular Practice", date: "2025-10-07", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2025-10-09", name: "Regular Practice", date: "2025-10-09", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2025-10-14", name: "Regular Practice", date: "2025-10-14", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2025-10-16", name: "Regular Practice", date: "2025-10-16", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2025-10-21", name: "Regular Practice", date: "2025-10-21", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2025-10-23", name: "Regular Practice", date: "2025-10-23", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2025-10-28", name: "Regular Practice", date: "2025-10-28", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2025-10-30", name: "Regular Practice", date: "2025-10-30", category: "Meeting", details: "Regular team practice." },
  // November
  { id: "meeting-2025-11-06", name: "Regular Practice", date: "2025-11-06", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2025-11-11", name: "Regular Practice", date: "2025-11-11", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2025-11-13", name: "Regular Practice", date: "2025-11-13", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2025-11-18", name: "Regular Practice", date: "2025-11-18", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2025-11-20", name: "Regular Practice", date: "2025-11-20", category: "Meeting", details: "Regular team practice." },
  // December
  { id: "meeting-2025-12-02", name: "Regular Practice", date: "2025-12-02", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2025-12-04", name: "Regular Practice", date: "2025-12-04", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2025-12-09", name: "Regular Practice", date: "2025-12-09", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2025-12-11", name: "Regular Practice", date: "2025-12-11", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2025-12-16", name: "Regular Practice", date: "2025-12-16", category: "Meeting", details: "Regular team practice." },
  // January
  { id: "meeting-2026-01-06", name: "Regular Practice", date: "2026-01-06", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2026-01-08", name: "Regular Practice", date: "2026-01-08", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2026-01-13", name: "Regular Practice", date: "2026-01-13", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2026-01-15", name: "Regular Practice", date: "2026-01-15", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2026-01-20", name: "Regular Practice", date: "2026-01-20", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2026-01-22", name: "Regular Practice", date: "2026-01-22", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2026-01-27", name: "Regular Practice", date: "2026-01-27", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2026-01-29", name: "Regular Practice", date: "2026-01-29", category: "Meeting", details: "Regular team practice." },
  // February
  { id: "meeting-2026-02-03", name: "Regular Practice", date: "2026-02-03", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2026-02-05", name: "Regular Practice", date: "2026-02-05", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2026-02-10", name: "Regular Practice", date: "2026-02-10", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2026-02-12", name: "Regular Practice", date: "2026-02-12", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2026-02-19", name: "Congress: Last Regular Practice", date: "2026-02-19", category: "Meeting", details: "Final regular practice for Congressional Debate." },
  { id: "meeting-2026-02-24", name: "Regular Practice", date: "2026-02-24", category: "Meeting", details: "Regular team practice." },
  { id: "meeting-2026-02-26", name: "Regular Practice", date: "2026-02-26", category: "Meeting", details: "Regular team practice." },
  
  // Tournaments
  {
    id: "wacfl-1",
    name: "Congress 1",
    host: "Dominion HS",
    date: "2025-10-18",
    category: "Tournament",
    tournamentType: "WACFL",
    events: ["Congress"],
    status: "Open",
    details: "Congress 1 tournament at Dominion High School in Sterling, VA. All congressional debaters are encouraged to attend.",
  },
  {
    id: "wacfl-2",
    name: "Congress 2",
    host: "Rock Ridge HS",
    date: "2025-11-22",
    category: "Tournament",
    tournamentType: "WACFL",
    events: ["Congress"],
    status: "Open",
    details: "Congress 2 tournament at our home school, Rock Ridge High School in Ashburn, VA. Let's represent our school well!",
  },
  {
    id: "wacfl-3",
    name: "Congress 3",
    host: "VIRTUAL",
    date: "2025-12-13",
    category: "Tournament",
    tournamentType: "WACFL",
    events: ["Congress"],
    status: "Open",
    details: "Congress 3 tournament will be held virtually online. Please ensure you have a stable internet connection and quiet environment.",
  },
  {
    id: "wacfl-4",
    name: "Congress 4",
    host: "Yorktown HS",
    date: "2026-01-31",
    category: "Tournament",
    tournamentType: "WACFL",
    events: ["Congress"],
    status: "Open",
    details: "Congress 4 tournament at Yorktown High School in Arlington, VA. The first tournament of the new year.",
  },
  {
    id: "wacfl-5",
    name: "Congress 5",
    host: "Robinson Secondary School",
    date: "2026-02-21",
    category: "Tournament",
    tournamentType: "WACFL",
    events: ["Congress"],
    status: "Open",
    details: "Congress 5 tournament at Robinson Secondary School in Fairfax, VA. The final WACFL tournament before MetroFinals.",
  },
  {
    id: "metrofinals",
    name: "Congress MetroFinals",
    host: "Virtual + Dominion HS",
    date: "2026-03-13",
    endDate: "2026-03-14",
    category: "Tournament",
    tournamentType: "Championship",
    events: ["Congress"],
    status: "Qualifiers Only",
    details: "Congress MetroFinals: Virtual on Friday, March 13, and in-person on Saturday, March 14 at Dominion High School (Sterling, VA). Attendance is for qualified members only.",
  },
  {
    id: "ncfls",
    name: "NCFL Grand National Tournament",
    host: "Location Varies",
    date: "2026-05-22",
    endDate: "2026-05-24",
    category: "Tournament",
    tournamentType: "National",
    events: ["Congress", "Public Forum", "Lincoln-Douglas", "Policy Debate"],
    status: "Confirm Attendance",
    details: "The National Catholic Forensic League Grand National Tournament. Travel may be required.",
  },
] 