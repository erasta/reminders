# Authentication System

This folder contains the authentication system implementation using JWT tokens and Supabase.

## Components

### AuthForm
The main authentication component that handles both login and registration flows. It manages the authentication token state and provides a clean interface for users to authenticate.

### LoginForm
Handles user login with email and password validation.

### RegisterForm
Handles user registration with name, email, and password validation.

### InputField
A reusable form input component with validation and error handling.

## Server Actions

### register
- Validates user input
- Creates a new user in the Supabase profiles table
- Generates a JWT token
- Returns user data and token

### login
- Validates user credentials
- Verifies password
- Generates a JWT token
- Returns user data and token

## Token System

The authentication system uses JWT tokens with the following characteristics:
- Short-lived (15 minutes)
- Contains only essential data (user ID and unique token ID)
- Secured with HS256 algorithm
- Includes JTI (JWT ID) for token uniqueness

## Security Considerations

Current implementation:
- Client-side token storage (for development)
- Basic password validation
- Server-side validation of credentials

Planned improvements:
- HttpOnly cookie storage for tokens
- Refresh token mechanism
- CSRF protection
- Rate limiting
- Token blacklisting for logout
- Secure password hashing

## Usage

```typescript
// Login
const result = await login(email, password);
if (result.success) {
  // Handle successful login
  const { token, data } = result;
}

// Register
const result = await register(name, email, password);
if (result.success) {
  // Handle successful registration
  const { token, data } = result;
}
```

## Development Notes

- The system is currently using client-side token storage for development purposes
- In production, implement proper token storage in HttpOnly cookies
- Add refresh token mechanism for better user experience
- Implement proper error handling and user feedback
- Add loading states for better UX 