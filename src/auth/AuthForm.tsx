'use client';

import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
    // Here you would typically:
    // 1. Store the token in an HttpOnly cookie (server-side)
    // 2. Redirect to the dashboard
    // 3. Set up token refresh mechanism
  };

  const handleRegisterSuccess = (newToken: string) => {
    setToken(newToken);
    // Same as login success
  };

  if (token) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Authenticated!</h2>
        <p className="text-center">You are now logged in.</p>
        {/* Add your authenticated content here */}
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