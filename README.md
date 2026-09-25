# DiagonalDebate

DiagonalDebate is the debate team's web portal for event signups, lesson resources, legislation review, and basic team administration. The deployable Next.js application lives in [`diagonal-debate`](diagonal-debate/).

## Quick start

Requirements: Node.js 20.9 or newer, npm, and a PostgreSQL database.

```bash
cd diagonal-debate
cp .env.example .env.local
npm ci
npx prisma migrate deploy
npm run seed-events
npm run dev
```

Open <http://localhost:3000>. Before running the app, replace every required placeholder in `.env.local`; `JWT_SECRET` must contain at least 32 characters.

## Quality checks

```bash
npm run check
npm run build
npm audit
```

These commands lint the repository, type-check it, create a production build, and check dependencies for known vulnerabilities.

With the development server running, `npm run test:legislation` exercises the legislation review and PDF endpoints and writes disposable output to `test-outputs`.

## Deployment

The production application is designed for Vercel with `diagonal-debate` configured as the project root. Add the values from [`diagonal-debate/.env.example`](diagonal-debate/.env.example) to the hosting provider, then run database migrations and `npm run seed-events` against the production database.

Do not commit `.env`, `.env.local`, database files, build output, or `node_modules`.

## Operations and ownership transfer

The full maintenance and transition checklist is in [`HANDOFF.md`](HANDOFF.md). It covers the services that must be transferred, secret rotation, seasonal event updates, database operations, and post-deployment checks.

## Project map

- `diagonal-debate/app` — pages and API routes
- `diagonal-debate/components` — shared interface components
- `diagonal-debate/lib` — authentication, email, events, database, and rate limiting
- `diagonal-debate/prisma` — PostgreSQL schema and migrations
- `diagonal-debate/public/lessons` — debate lesson PDFs
- `diagonal-debate/scripts` — maintenance and seed scripts

Report bugs and proposed changes through GitHub issues so the next maintainer has a durable record of decisions.
