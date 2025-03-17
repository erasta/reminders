'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface UserData {
  email: string;
  name: string;
}

interface LoginData {
  token: string;
  user: UserData;
}

interface LoginContextType {
  loginData: LoginData | null;
  setLoginData: (data: LoginData | null) => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export function LoginProvider({ children }: { children: ReactNode }) {
  const [loginData, setLoginData] = useState<LoginData | null>(null);

  return (
    <LoginContext.Provider value={{ loginData, setLoginData }}>
      {children}
    </LoginContext.Provider>
  );
}

export function useLogin() {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error('useLogin must be used within a LoginProvider');
  }
  return context;
} 