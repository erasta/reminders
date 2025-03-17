'use client';

import { useLogin } from '@/contexts/LoginContext';
import { Companies } from './companies/Companies';

export function AuthenticatedView() {
  const { loginData, setLoginData } = useLogin();

  if (!loginData) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Welcome, {loginData.user.name}!</h2>
          <p className="text-gray-500 text-sm">{loginData.user.email}</p>
        </div>
        <button
          onClick={() => setLoginData(null)}
          className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <Companies />
    </div>
  );
} 