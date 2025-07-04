# DiagonalDebate

DiagonalDebate is a full-stack web application designed to support debate education, event management, and resource sharing for students, coaches, and debate organizations. The platform provides tools for event signups, lesson distribution, legislation checking, and more.

## Features

- **User Authentication**: Secure registration, login, and password reset.
- **Event Board**: View and sign up for upcoming debate events.
- **Lesson Library**: Access a collection of debate lessons and resources in PDF format.
- **Legislation Checker**: Submit and verify debate legislation for compliance.
- **Contention Ideas**: Browse and contribute argument ideas for various debate topics.
- **Contact & Suggestions**: Reach out to admins or submit suggestions for platform improvement.
- **Admin Tools**: Manage users, events, and content (admin access required).

## Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL (via [Neon](https://neon.tech/))
- **Email**: Nodemailer (SMTP configuration required)
- **PDF Handling**: Custom PDF preview and viewer components
- **Authentication**: Custom logic (see `/api/auth/`)
- **Rate Limiting**: Custom middleware

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- A [Neon](https://neon.tech/) PostgreSQL database (or any Postgres-compatible database)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Steaker0187/DiagonalDebate.git
   cd DiagonalDebate/diagonal-debate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values, especially your `DATABASE_URL` for Neon/Postgres and SMTP credentials for email.

4. **Set up the database:**
   - Make sure your `prisma/schema.prisma` datasource block looks like this:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     ```
   - Run migrations:
     ```bash
     npx prisma migrate deploy
     # or for local development
     npx prisma migrate dev
     ```

5. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Access the app:**
   - Open with localhost in your browser.

### Email Configuration

See [`EMAIL_SETUP.md`](diagonal-debate/EMAIL_SETUP.md) for details on configuring SMTP for email features (password reset, notifications, etc).

## Database

This project uses **PostgreSQL** as the primary database, with [Neon](https://neon.tech/) as the recommended cloud provider.

- **Production/Cloud:**  
  Use your Neon connection string in the `.env` file:
  ```
  DATABASE_URL="postgresql://<username>:<password>@<host>/<database>?sslmode=require"
  ```
- **Local Development (Optional):**  
  You may use SQLite for quick local testing by changing the `provider` in `prisma/schema.prisma` to `"sqlite"` and updating the `DATABASE_URL` accordingly.  
  However, PostgreSQL is recommended for consistency.

## Project Structure

```
diagonal-debate/
  app/                # Next.js app directory (pages, API routes, components)
  components/         # Shared React components
  data/               # Static data (e.g., legislation templates)
  hooks/              # Custom React hooks
  lib/                # Utility libraries (auth, email, events, etc.)
  prisma/             # Prisma schema and migrations
  public/             # Static assets (PDFs, images, fonts)
  styles/             # Global and component styles
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

---

**Maintainer:** [Steaker0187](https://github.com/Steaker0187)  
For questions or support, please open an issue or contact the maintainer.
