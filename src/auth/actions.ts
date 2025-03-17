'use server';

import { supabase } from '@/lib/supabase';
import { validateRegistration, validateLogin } from './validate';

export async function register(name: string, email: string, password: string) {
  try {
    // Server-side validation
    const validationErrors = validateRegistration({ name, email, password });
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: validationErrors[0].message
      };
    }

    const id = crypto.randomUUID();
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ id, name, email, password }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'Registration failed'
    };
  }
}

export async function login(email: string, password: string) {
  try {
    // Server-side validation
    const validationErrors = validateLogin({ name: '', email, password });
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: validationErrors[0].message
      };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('email', email)
      .single();

    if (error) throw error;
    
    const passwordMatch = data?.password === password;
    return {
      success: passwordMatch,
      error: passwordMatch ? null : 'Invalid password'
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Login failed'
    };
  }
} 