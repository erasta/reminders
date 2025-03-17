'use client';

import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useLogin } from '@/contexts/LoginContext';

interface UserData {
  email: string;
  name: string;
}

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const { setLoginData } = useLogin();

  const handleLoginSuccess = (newToken: string, user: UserData) => {
    setLoginData({ token: newToken, user });
  };

  const handleRegisterSuccess = (newToken: string, user: UserData) => {
    setLoginData({ token: newToken, user });
  };

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