# DiagonalDebate

A debate-team website for event signups, lesson materials, legislation review, and team administration.

[diagonaldebate.tech](https://diagonaldebate.tech/)

The Next.js app lives in [`diagonal-debate/`](diagonal-debate/), with PostgreSQL and Prisma for storage.

## Run locally

Use Node.js 20.9 or newer and a PostgreSQL database.

```sh
cd diagonal-debate
cp .env.example .env.local
npm ci
```

Fill in the required values in `.env.local`, including a `JWT_SECRET` of at least 32 characters. Then run:

```sh
npx prisma migrate deploy
npm run seed-events
npm run dev
```

Open http://localhost:3000. Use a development database for local work.

## Checks

From `diagonal-debate/`:

```sh
npm run check
npm run build
```

With the development server running, `npm run test:legislation` checks the legislation and PDF endpoints. It writes output to `test-outputs/`.

## Maintenance

On Vercel, set the project root to `diagonal-debate`. Configure the environment variables before running migrations or seeding the deployment database.

[HANDOFF.md](HANDOFF.md) covers deployment, service ownership, secret rotation, and seasonal updates. [Lesson notes](diagonal-debate/public/lessons/README.md) explain how to add PDFs.

Do not commit local environment files, databases, or build output. Files in `public/` are publicly served; hiding PDF viewer controls does not prevent downloads.
