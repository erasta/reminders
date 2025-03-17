# Authentication Components

This directory contains the authentication-related components for the application. The authentication system uses Supabase as the database but implements its own token-based authentication mechanism.

## Components

### AuthContext (`src/contexts/AuthContext.tsx`)

A React context provider that manages authentication state and provides authentication-related functions.

#### Features:
- User registration
- User login
- User logout
- Token management
- Loading state
- Error handling

#### Usage:
```tsx
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/AuthContext';

// Wrap your app with AuthProvider
function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}

// Use auth functions in your components
function YourComponent() {
  const { user, login, register, logout } = useAuth();
  // ...
}
```

### AuthForm (`src/components/AuthForm.tsx`)

A reusable form component that handles both login and registration.

#### Features:
- Toggle between login and registration modes
- Form validation
- Error display
- Loading state
- Responsive design with Tailwind CSS

#### Usage:
```tsx
import { AuthForm } from '@/components/AuthForm';

function LoginPage() {
  return (
    <div>
      <AuthForm />
    </div>
  );
}
```

## Database Schema

The authentication system requires two tables in Supabase:

### profiles
```sql
create table profiles (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text unique not null,
  password text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### tokens
```sql
create table tokens (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  token text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## Security Considerations

1. Passwords are stored in plain text in this implementation. In a production environment, you should:
   - Hash passwords using a secure algorithm (e.g., bcrypt)
   - Use HTTPS for all API calls
   - Implement rate limiting
   - Add password complexity requirements

2. Tokens are simple base64 strings. In production, you should:
   - Use proper JWT tokens
   - Implement token expiration
   - Add token refresh mechanism
   - Use secure session management

3. Database security:
   - Implement Row Level Security (RLS) policies
   - Use prepared statements for all queries
   - Implement proper access controls

## Testing

Run the tests with:
```bash
npm test
```

The test suite covers:
- User registration
- User login
- Token management
- Error handling
- Form validation 