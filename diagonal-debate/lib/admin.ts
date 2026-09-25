// Admins also receive legislation submissions. Keep this list in deployment
// configuration so team ownership can transfer without a code change.
export function getAdminEmails(): string[] {
  const configuredEmails = process.env.ADMIN_EMAILS || process.env.CAPTAIN_EMAILS || ""

  return configuredEmails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdmin(email: string): boolean {
  return getAdminEmails().includes(email.trim().toLowerCase())
}

export function getAdminEmailsString(): string {
  return getAdminEmails().join(', ')
}
