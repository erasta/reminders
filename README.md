# Reminder App

A web application for managing reminders based on company-specific deactivation policies.

## Features

- User authentication with email/password
- Create and manage reminders for different companies
- Customizable reminder periods for companies with flexible policies
- Automatic next reminder date calculation
- Modern, responsive UI built with Tailwind CSS

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (Authentication & Database)
- NextAuth.js
- Tailwind CSS
- Vercel (Deployment)

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for deployment)

## Setup

1. Clone the repository
```bash
git clone <your-repo-url>
cd reminders
```

2. Install dependencies
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL scripts in the `sql` folder in order:
     1. `01_reminders.sql`
     2. `02_profiles.sql`

4. Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

5. Create a `companies.csv` file in the root directory with the following structure:
```csv
name,days_before_deactivation,policy_link
Company A,30,https://example.com/policy-a
Company B,60,https://example.com/policy-b
Company C,0,https://example.com/policy-c
```

6. Run the development server
```bash
npm run dev
```

## Testing Authentication

1. Register a test user:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test.user@example.com", "password": "testpass123"}'
```

2. Sign in using the test credentials:
   - Email: test.user@example.com
   - Password: testpass123

## Deployment

1. Create a new project on Vercel
2. Connect your repository using a GitHub token with limited scope:
   - Go to GitHub > Settings > Developer settings > Personal access tokens
   - Click "Generate new token (classic)"
   - Select only:
     - `repo` (for private repos) or `public_repo` (for public repos)
     - `read:packages`
   - Use this token when connecting your repo in Vercel

3. Add the environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`

4. Deploy!

## Development

The application uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

## License

MIT
