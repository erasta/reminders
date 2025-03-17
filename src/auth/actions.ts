'use server';

import { supabase } from '@/lib/supabase';
import { validateRegistration, validateLogin } from './validate';
import { createToken } from './token';

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

    // Create token after successful registration
    const token = await createToken(id);

    return { 
      success: true, 
      data,
      token 
    };
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
    if (!passwordMatch) {
      return {
        success: false,
        error: 'Invalid password'
      };
    }

    // Create token after successful login
    const token = await createToken(data.id);

    return {
      success: true,
      data: {
        id: data.id,
        email: data.email,
        name: data.name
      },
      token
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Login failed'
    };
  }
} 