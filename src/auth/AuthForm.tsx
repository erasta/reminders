'use client';

import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface UserData {
  id: string;
  email: string;
  name: string;
}

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleLoginSuccess = (newToken: string, user: UserData) => {
    setToken(newToken);
    setUserData(user);
  };

  const handleRegisterSuccess = (newToken: string, user: UserData) => {
    setToken(newToken);
    setUserData(user);
  };

  const handleLogout = () => {
    setToken(null);
    setUserData(null);
  };

  if (token) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Authenticated!</h2>
        <div className="text-center mb-4">
          <p className="text-gray-600">Welcome, {userData?.name}!</p>
          <p className="text-gray-500 text-sm">{userData?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? 'Sign In' : 'Create Account'}
      </h2>
      {isLogin ? (
        <LoginForm
          onSwitchToRegister={() => setIsLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <RegisterForm
          onSwitchToLogin={() => setIsLogin(true)}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
    </div>
  );
} 