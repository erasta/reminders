'use client';

import { useLogin } from '@/contexts/LoginContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthenticatedView() {
  const { loginData, setLoginData } = useLogin();
  const router = useRouter();

  useEffect(() => {
    if (!loginData) {
      router.push('/');
    }
  }, [loginData, router]);

  if (!loginData) {
    return null;
  }

  router.push('/dashboard');
  return null;
} 