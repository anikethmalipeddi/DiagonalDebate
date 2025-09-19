// Centralized admin/captain management
// Admins are also the captains who receive legislation submissions

export const ADMIN_EMAILS = [
  "aniketh.malipeddi@gmail.com",
  "anikethmalipeddi@gmail.com",
  "adithestar6@gmail.com",
  "udaygoel234@gmail.com",
  "uday.goel234@gmail.com"
]

export function isAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email)
}

export function getAdminEmails(): string[] {
  return ADMIN_EMAILS
}

export function getAdminEmailsString(): string {
  return ADMIN_EMAILS.join(', ')
}