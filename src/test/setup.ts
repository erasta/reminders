import { beforeAll, vi } from 'vitest';
import { config } from 'dotenv';
import bcrypt from 'bcryptjs';

// Create a hashed password for testing
const testPassword = 'testpass123';
const hashedPassword = bcrypt.hashSync(testPassword, 10);

beforeAll(() => {
  // Load environment variables from .env.test if it exists
  config({ path: '.env.test' });
  
  // Set required environment variables if not already set
  process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key';
});

// Mock the Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnValue({ 
      error: null,
      data: [{ id: 'test-id' }]
    }),
    delete: vi.fn().mockReturnValue({ error: null }),
    eq: vi.fn().mockReturnValue({ 
      single: vi.fn().mockReturnValue({ 
        data: { 
          id: 'test-id',
          email: 'test@example.com',
          name: 'Test User',
          password: hashedPassword
        },
        error: null 
      })
    }),
  }
})); 