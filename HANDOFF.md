# DiagonalDebate maintainer handoff

This checklist is for the outgoing team head, incoming team head, and faculty sponsor. Complete it together; do not send passwords or API keys through ordinary email or chat.

## 1. Transfer service ownership

Confirm that the incoming maintainer and faculty sponsor can access:

- the GitHub repository and its branch settings;
- the Vercel project, production domain, deployment logs, and environment variables;
- the PostgreSQL/Neon project and backups;
- the Upstash Redis database used for rate limiting;
- the Google Gemini API project;
- the team email/SMTP account;
- domain and DNS management, if separate from Vercel.

Keep at least two trusted owners on every shared service. Prefer team-owned accounts over a student's personal account.

## 2. Rotate credentials

Create new database, Redis, Gemini, SMTP, and hosting credentials for the incoming team. Replace the production values using `diagonal-debate/.env.example` as the source of truth, redeploy, and revoke the outgoing credentials only after verification succeeds.

Generate a new authentication secret with:

```bash
openssl rand -base64 32
```

Put it in `JWT_SECRET`. Changing it signs out existing users. Set `ADMIN_EMAILS` to a comma-separated list of the new team head, a backup student maintainer, and the faculty sponsor. Remove outgoing students after the new admins have verified access.

## 3. Start a new season

1. Update the schedule in `diagonal-debate/lib/events.ts` using stable, unique event IDs.
2. Run `npm run seed-events` against the intended database. The script updates sign-up events without deleting existing signup history.
3. Add or retire lesson PDFs in `diagonal-debate/public/lessons` and update the lesson list in the application when filenames change.
4. Review the contact, privacy, terms, help, and about pages for current people, policies, and dates.
5. Test one normal event signup and confirm that championship/national events remain invite-only.

Never reuse an event ID for a different event; signup records reference those IDs.

## 4. Deploy safely

From `diagonal-debate`:

```bash
npm ci
npm run check
npm run build
npx prisma migrate deploy
npm run seed-events
```

Deploy only after all commands succeed. After deployment, verify registration, login/logout, event signup, admin access, lesson viewing, legislation review, contact email, and mobile navigation.

The rate limiter intentionally allows requests when Upstash is not configured or temporarily unavailable, so production should always have working Upstash credentials. Contact and suggestion submissions return an error when SMTP is unavailable; production email must be configured.

## 5. Routine maintenance

- Monthly: run `npm audit`, review Dependabot or security alerts, and merge tested updates.
- Before each tournament cycle: verify the event list and seed the database.
- Each semester: remove stale admin access and review service owners.
- Before major database changes: make a provider backup, add a Prisma migration, and test it on a non-production database.
- Record operational decisions and unresolved work in GitHub issues rather than personal notes.

## 6. Final acceptance

The handoff is complete when the incoming maintainer can independently clone the repository, configure a fresh local environment, pass all checks, deploy, access the admin area, and recover the database from the provider's documented backup process.
