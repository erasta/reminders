# Reminder Application

A web application for managing periodic reminders built with Next.js, TypeScript, and Tailwind CSS.

## Features

- User authentication (register/login)
- Create and manage periodic reminders
- Email notifications for reminders
- Predefined reminder types with different periods
- Modern and responsive UI

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd reminders
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:
```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Email (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
SMTP_FROM=noreply@example.com
SMTP_SECURE=false
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and database operations
- `/src/types` - TypeScript type definitions
- `/data` - JSON files for data storage (created automatically)

## Development

- Run development server: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm start`
- Run linter: `npm run lint`

## Deployment

This application is designed to be deployed on Vercel. To deploy:

1. Push your code to a Git repository
2. Import the project in Vercel
3. Configure the environment variables
4. Deploy

## License

MIT
