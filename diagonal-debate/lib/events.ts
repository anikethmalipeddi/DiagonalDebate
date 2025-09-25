
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

  // Clinics (4:30-5:30 PM)
  {
    id: "clinic-congress",
    name: "Student Congress Clinic",
    date: "2025-09-08",
    category: "Clinic",
    details: "Student Congress Clinic from 4:30-5:30 PM in Room 1404. Learn about Congressional Debate.",
  },
  {
    id: "clinic-ld",
    name: "Lincoln-Douglas Clinic",
    date: "2025-09-09",
    category: "Clinic",
    details: "Lincoln-Douglas Clinic from 4:30-5:30 PM in Room 1404. Introduction to LD debate.",
  },
  {
    id: "clinic-policy",
    name: "Policy Debate Clinic",
    date: "2025-09-10",
    category: "Clinic",
    details: "Policy Debate Clinic from 4:30-5:30 PM in Room 1603. Learn about Policy debate.",
  },
  {
    id: "clinic-pf",
    name: "Public Forum Clinic",
    date: "2025-09-11",
    category: "Clinic",
    details: "Public Forum Clinic from 4:30-5:30 PM in Room 1404. Introduction to PF debate.",
  },
  {
    id: "clinic-speech",
    name: "Speech Clinic",
    date: "2025-09-12",
    category: "Clinic",
    details: "Speech Clinic from 4:30-5:30 PM in Room 1611. Learn about Speech events.",
  },

  // Holidays / No Practice
  { id: "holiday-oct-2", name: "No Practice", date: "2025-10-02", category: "Holiday", details: "No practice due to holiday." },
  { id: "holiday-oct-7", name: "No Practice", date: "2025-10-07", category: "Holiday", details: "No practice due to faculty meeting." },
  { id: "holiday-nov-4", name: "No Practice", date: "2025-11-04", category: "Holiday", details: "No practice due to student holiday." },
  { id: "holiday-thanksgiving-week", name: "No Practice", date: "2025-11-24", endDate: "2025-11-28", category: "Holiday", details: "No practice during Thanksgiving week." },
  { id: "holiday-dec-2", name: "No Practice", date: "2025-12-02", category: "Holiday", details: "No practice due to faculty meeting." },
  { id: "holiday-dec-18", name: "No Practice", date: "2025-12-18", category: "Holiday", details: "No practice - last day before winter break." },
  { id: "holiday-winter-break", name: "No Practice", date: "2025-12-22", endDate: "2026-01-02", category: "Holiday", details: "No practice during Winter Break." },
  { id: "holiday-jan-6", name: "No Practice", date: "2026-01-06", category: "Holiday", details: "No practice due to faculty meeting." },
  { id: "holiday-feb-3", name: "No Practice", date: "2026-02-03", category: "Holiday", details: "No practice due to faculty meeting." },
  { id: "holiday-feb-17", name: "No Practice", date: "2026-02-17", category: "Holiday", details: "No practice due to holiday." },

  // Regular Practices (Tuesdays & Thursdays, 4:30-5:30 PM)
  // September - Practices begin week of September 15
  { id: "meeting-2025-09-16", name: "Regular Practice", date: "2025-09-16", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2025-09-18", name: "Regular Practice", date: "2025-09-18", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2025-09-23", name: "Regular Practice", date: "2025-09-23", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2025-09-25", name: "Regular Practice", date: "2025-09-25", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2025-09-30", name: "Regular Practice", date: "2025-09-30", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },

  // October - Resume October 9 (skip Oct 2 & 7)
  { id: "meeting-2025-10-09", name: "Regular Practice", date: "2025-10-09", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2025-10-14", name: "Regular Practice", date: "2025-10-14", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2025-10-16", name: "Regular Practice", date: "2025-10-16", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2025-10-21", name: "Regular Practice", date: "2025-10-21", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2025-10-23", name: "Regular Practice", date: "2025-10-23", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2025-10-28", name: "Regular Practice", date: "2025-10-28", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2025-10-30", name: "Regular Practice", date: "2025-10-30", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },

  // November - Skip Nov 4, no practice Thanksgiving week (24-28)
  { id: "meeting-2025-11-06", name: "Regular Practice", date: "2025-11-06", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2025-11-11", name: "Regular Practice", date: "2025-11-11", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2025-11-13", name: "Regular Practice", date: "2025-11-13", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2025-11-18", name: "Regular Practice", date: "2025-11-18", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2025-11-20", name: "Regular Practice", date: "2025-11-20", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },

  // December - Skip Dec 2 (faculty meeting), no practice Dec 18+
  { id: "meeting-2025-12-04", name: "Regular Practice", date: "2025-12-04", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2025-12-09", name: "Regular Practice", date: "2025-12-09", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2025-12-11", name: "Regular Practice", date: "2025-12-11", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2025-12-16", name: "Regular Practice", date: "2025-12-16", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },

  // January - Skip Jan 6 (faculty meeting), resume Jan 8
  { id: "meeting-2026-01-08", name: "Regular Practice", date: "2026-01-08", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2026-01-13", name: "Regular Practice", date: "2026-01-13", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2026-01-15", name: "Regular Practice", date: "2026-01-15", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2026-01-20", name: "Regular Practice", date: "2026-01-20", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2026-01-22", name: "Regular Practice", date: "2026-01-22", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2026-01-27", name: "Regular Practice", date: "2026-01-27", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2026-01-29", name: "Regular Practice", date: "2026-01-29", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },

  // February - Skip Feb 3 (faculty meeting), final practices by event
  { id: "meeting-2026-02-05", name: "Final PF Regular Practice", date: "2026-02-05", category: "Meeting", details: "Final regular Public Forum practice 4:30-5:30 PM. After this, only qualifiers attend weekly." },
  { id: "meeting-2026-02-10", name: "Regular Practice", date: "2026-02-10", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2026-02-12", name: "Regular Practice", date: "2026-02-12", category: "Meeting", details: "Regular team practice 4:30-5:30 PM. Tuesdays & Thursdays by event." },
  { id: "meeting-2026-02-19", name: "Final LD/Congress/Policy Practice", date: "2026-02-19", category: "Meeting", details: "Final regular LD, Congress, and Policy practice 4:30-5:30 PM. After this, only qualifiers attend weekly." },
  { id: "meeting-2026-02-24", name: "Qualifiers Practice", date: "2026-02-24", category: "Meeting", details: "Practice for qualifiers preparing for Metro Finals and VHSL Regionals." },
  { id: "meeting-2026-02-26", name: "Qualifiers Practice", date: "2026-02-26", category: "Meeting", details: "Practice for qualifiers preparing for Metro Finals and VHSL Regionals." },

  // Tournaments
  // Fall Coaches Meeting & Judge Training
  {
    id: "fall-coaches-meeting",
    name: "Fall Coaches Meeting",
    host: "Yorktown HS",
    date: "2025-09-06",
    category: "Meeting",
    details: "Fall Coaches Meeting at Yorktown High School in Arlington, Virginia. Season planning and updates.",
  },
  {
    id: "judge-training",
    name: "Judge Training",
    host: "BASIS Independent McLean",
    date: "2025-10-04",
    category: "Clinic",
    details: "Judge Training session at BASIS Independent McLean. Coincides with SAT date.",
  },

  // October Tournaments
  {
    id: "pf-1",
    name: "Public Forum 1",
    host: "Westfield HS",
    date: "2025-10-11",
    category: "Tournament",
    details: "Public Forum 1 tournament at Westfield High School in Chantilly, VA.",
  },
  {
    id: "ld-congress-1",
    name: "Lincoln-Douglas & Congress 1",
    host: "Dominion HS",
    date: "2025-10-18",
    category: "Tournament",
    events: ["Lincoln-Douglas", "Congress"],
    status: "Open",
    details: "Lincoln-Douglas and Congress 1 tournament at Dominion High School in Sterling, VA. Coincides with ACT date.",
  },
  {
    id: "speech-policy-1",
    name: "Speech & Policy 1",
    host: "Fairfax HS",
    date: "2025-10-25",
    category: "Tournament",
    events: ["Speech", "Policy Debate"],
    status: "Open",
    details: "Speech and Policy 1 tournament at Fairfax High School in Fairfax, VA.",
  },

  // November Tournaments
  {
    id: "pf-2",
    name: "Public Forum 2",
    host: "George C. Marshall HS",
    date: "2025-11-08",
    category: "Tournament",
    events: ["Public Forum"],
    status: "Open",
    details: "Public Forum 2 tournament at George C. Marshall High School in Falls Church, VA. Coincides with SAT date.",
  },
  {
    id: "wudl-dragon",
    name: "WUDL Dragon Invitational",
    host: "Columbia Heights",
    date: "2025-11-08",
    category: "Tournament",
    events: ["Policy Debate"],
    status: "Open",
    details: "WUDL Dragon Invitational (Policy only) at Columbia Heights in Washington, DC. Non-WACFL tournament.",
  },
  {
    id: "revolutionary-rhetoric",
    name: "Revolutionary Rhetoric",
    host: "William and Mary",
    date: "2025-11-08",
    category: "Tournament",
    events: ["Speech", "Debate"],
    status: "Open",
    details: "Revolutionary Rhetoric tournament (NSDA rules) at William and Mary in Williamsburg, Virginia. Non-WACFL tournament.",
  },
  {
    id: "speech-policy-2",
    name: "Speech & Policy 2",
    host: "Charles Colgan Senior HS",
    date: "2025-11-15",
    category: "Tournament",
    events: ["Speech", "Policy Debate"],
    status: "Open",
    details: "Speech and Policy 2 tournament at Charles Colgan Senior High in Manassas, VA.",
  },
  {
    id: "ld-congress-2",
    name: "Lincoln-Douglas & Congress 2",
    host: "Rock Ridge HS",
    date: "2025-11-22",
    category: "Tournament",
    events: ["Lincoln-Douglas", "Congress"],
    status: "Open",
    details: "Lincoln-Douglas and Congress 2 tournament at our home school, Rock Ridge High School in Ashburn, VA. Let's represent our school well!",
  },

  // December Tournaments
  {
    id: "patriot-games",
    name: "GMU Patriot Games Invitational",
    host: "George Mason University",
    date: "2025-12-06",
    endDate: "2025-12-07",
    category: "Tournament",
    events: ["Speech", "Debate"],
    status: "Open",
    details: "GMU Patriot Games Invitational at George Mason University in Fairfax, VA. Two-day tournament coinciding with SAT date.",
  },
  {
    id: "pf-3",
    name: "Public Forum 3",
    host: "Host TBA",
    date: "2025-12-06",
    category: "Tournament",
    events: ["Public Forum"],
    status: "Open",
    details: "Public Forum 3 tournament at host school to be announced. Coincides with SAT date.",
  },
  {
    id: "ld-policy-congress-speech-3",
    name: "LD, Policy, Congress & Speech 3",
    host: "Robinson Secondary",
    date: "2025-12-13",
    category: "Tournament",
    events: ["Lincoln-Douglas", "Policy Debate", "Congress", "Speech"],
    status: "Open",
    details: "LD, Policy, Congress, and Speech 3 tournament at Robinson Secondary in Fairfax, VA. Coincides with ACT date.",
  },

  // January Tournaments
  {
    id: "pf-policy-4",
    name: "Public Forum & Policy 4",
    host: "George Mason University",
    date: "2026-01-10",
    category: "Tournament",
    events: ["Public Forum", "Policy Debate"],
    status: "Open",
    details: "Public Forum and Policy 4 tournament at George Mason University in Fairfax, VA.",
  },
  {
    id: "ld-4",
    name: "Lincoln-Douglas 4",
    host: "Lightridge HS",
    date: "2026-01-24",
    category: "Tournament",
    events: ["Lincoln-Douglas"],
    status: "Open",
    details: "Lincoln-Douglas 4 tournament at Lightridge High School in Aldie, VA.",
  },
  {
    id: "congress-speech-4",
    name: "Congress & Speech 4",
    host: "Yorktown HS",
    date: "2026-01-31",
    category: "Tournament",
    events: ["Congress", "Speech"],
    status: "Open",
    details: "Congress and Speech 4 tournament at Yorktown High School in Arlington, VA.",
  },

  // February Tournaments
  {
    id: "nsda-district",
    name: "NSDA Virginia District Qualifier",
    host: "James River HS",
    date: "2026-02-06",
    endDate: "2026-02-07",
    category: "Tournament",
    tournamentType: "Championship",
    events: ["Speech", "Debate"],
    status: "Qualifiers Only",
    details: "NSDA Virginia District Qualifier at James River High School in Midlothian, VA. Two-day championship tournament.",
  },
  {
    id: "virtual-all-events",
    name: "All Speech & Debate Events (Virtual)",
    host: "VIRTUAL",
    date: "2026-02-21",
    category: "Tournament",
    events: ["Speech", "Debate"],
    status: "Open",
    details: "All speech and debate events held virtually online. Ensure stable internet connection and quiet environment.",
  },

  // March Championships (MetroFinals)
  {
    id: "speech-metrofinals",
    name: "Speech MetroFinals",
    host: "Our Lady of Good Counsel HS",
    date: "2026-03-07",
    category: "Tournament",
    tournamentType: "Championship",
    events: ["Speech"],
    status: "Qualifiers Only",
    details: "Speech MetroFinals at Our Lady of Good Counsel High School in Olney, Maryland. Attendance is for qualified members only.",
  },
  {
    id: "pf-policy-congress-metrofinals",
    name: "PF, Policy & Congress MetroFinals",
    host: "Virtual + Washington-Liberty HS",
    date: "2026-03-13",
    endDate: "2026-03-14",
    category: "Tournament",
    tournamentType: "Championship",
    events: ["Public Forum", "Policy Debate", "Congress"],
    status: "Qualifiers Only",
    details: "Public Forum, Policy, and Congress MetroFinals: Virtual day on March 13th and in-person rounds on March 14th at Washington-Liberty High School in Arlington, VA. Coincides with SAT date. Attendance is for qualified members only.",
  },
  {
    id: "ld-metrofinals",
    name: "Lincoln-Douglas MetroFinals",
    host: "Alice Deal Middle School",
    date: "2026-03-21",
    category: "Tournament",
    tournamentType: "Championship",
    events: ["Lincoln-Douglas"],
    status: "Qualifiers Only",
    details: "Lincoln-Douglas MetroFinals at Alice Deal Middle School in Washington, DC. Six single-flighted rounds in one day. Attendance is for qualified members only.",
  },

  // Spring Wrap-up
  {
    id: "spring-coaches-meeting",
    name: "Spring Coaches Meeting",
    host: "Dominion Christian School",
    date: "2026-05-02",
    category: "Meeting",
    details: "Spring Coaches Meeting at Dominion Christian School in Herndon, VA. Season wrap-up and planning. Coincides with SAT date.",
  },
  {
    id: "ncfl-nationals",
    name: "NCFL Grand National Tournament",
    host: "Washington, DC",
    date: "2026-05-22",
    endDate: "2026-05-24",
    category: "Tournament",
    tournamentType: "National",
    events: ["Congress", "Public Forum", "Lincoln-Douglas", "Policy Debate", "Speech"],
    status: "Confirm Attendance",
    details: "The National Catholic Forensic League Grand National Tournament in Washington, DC. Three-day national championship tournament.",
  },
] 