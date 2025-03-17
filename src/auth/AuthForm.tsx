'use client';

import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface UserData {
  email: string;
  name: string;
}

interface LoginData {
  token: string;
  user: UserData;
}

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState<LoginData | null>(null);

  const handleLoginSuccess = (newToken: string, user: UserData) => {
    setLoginData({ token: newToken, user });
  };

  const handleRegisterSuccess = (newToken: string, user: UserData) => {
    setLoginData({ token: newToken, user });
  };

  const handleLogout = () => {
    setLoginData(null);
  };

  if (loginData) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Authenticated!</h2>
        <div className="text-center mb-4">
          <p className="text-gray-600">Welcome, {loginData.user.name}!</p>
          <p className="text-gray-500 text-sm">{loginData.user.email}</p>
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