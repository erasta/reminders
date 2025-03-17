# Authentication Module

This module handles user authentication including login and registration functionality.

## Components

### AuthForm
The main container component that manages the switching between login and registration forms.

### LoginForm
Handles user login with email and password fields. Includes:
- Email validation
- Password validation
- Error handling
- Success messages
- Link to registration form

### RegisterForm
Handles user registration with name, email, and password fields. Includes:
- Name validation
- Email validation
- Password validation (min 6 characters)
- Error handling
- Success messages
- Link to login form
- "Create Fake Data" button for testing

### InputField
Reusable form input component with:
- Label
- Input field
- Error message display
- Support for different input types (text, email, password)

### Message
Reusable component for displaying success and error messages.

## Validation

Validation is implemented both on the client and server side using the functions in `validate.ts`:
- Email format validation
- Required field validation
- Password length validation

## Server Actions

The `actions.ts` file contains server-side functions for:
- User registration
- User login
- Server-side validation
- Database operations

## Usage

```tsx
import { AuthForm } from '@/auth/AuthForm';

export default function Page() {
  return <AuthForm />;
}
```

## Styling

The components use Tailwind CSS for styling and are designed to be responsive and user-friendly. 