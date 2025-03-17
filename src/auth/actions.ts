'use server';

import { supabase } from '@/lib/supabase';

export async function register(name: string, email: string, password: string) {
  try {
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
      error: error instanceof Error ? error.message : 'Registration failed'
    };
  }
}

export async function login(email: string, password: string) {
  try {
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
      error: error instanceof Error ? error.message : 'Login failed'
    };
  }
} 