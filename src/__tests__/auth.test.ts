import { describe, it, expect } from 'vitest';
import { POST as registerHandler } from '../app/api/auth/register/route';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

describe('Authentication', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpass123'
  };

  it('should register a new user', async () => {
    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    const response = await registerHandler(request);
    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data.user).toBeDefined();
    expect(data.user.name).toBe(testUser.name);
    expect(data.user.email).toBe(testUser.email);
  });

  it('should verify login credentials', async () => {
    // Get the user from the database
    const { data: user, error: loginError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', testUser.email)
      .single();

    expect(loginError).toBeNull();
    expect(user).toBeDefined();
    expect(user.email).toBe(testUser.email);

    // Verify the password
    const isPasswordValid = await bcrypt.compare(testUser.password, user.password);
    expect(isPasswordValid).toBe(true);
  });

  it('should register a real user with any email format', async () => {
    const simpleUser = {
      name: 'Simple User',
      email: 'a@b.com',
      password: 'testpass123'
    };

    // Try to register directly using the handler
    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(simpleUser)
    });

    // Log the request details
    console.log('Registration request:', {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: simpleUser
    });

    const response = await registerHandler(request);
    const data = await response.json();

    // Log the response details
    console.log('Registration response:', {
      ok: response.ok,
      status: response.status,
      data
    });

    // If there's an error, let's see what's happening in the registration process
    if (!response.ok) {
      // Get the user profile to see if it exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', simpleUser.email)
        .single();

      console.log('Existing user check:', existingUser);
    }

    expect(response.ok).toBe(true);
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe(simpleUser.email);
  });
}); 