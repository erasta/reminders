'use client';

import { AuthForm } from '@/auth/AuthForm';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Welcome to Reminder App
          </h1>
          <h2 className="mt-6 text-center text-xl text-gray-600">
            Sign in to your account
          </h2>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
