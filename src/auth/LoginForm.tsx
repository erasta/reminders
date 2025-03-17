'use client';

import { useState } from 'react';
import { login } from './actions';
import { InputField } from './InputField';
import { Message } from './Message';
import { validateLogin, ValidationError, FormData } from './validate';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: (token: string) => void;
}

export function LoginForm({ onSwitchToRegister, onLoginSuccess }: LoginFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const handleLogin = async () => {
    try {
      setError(null);
      setSuccess(false);
      setValidationErrors([]);

      const errors = validateLogin(formData);
      if (errors.length > 0) {
        setValidationErrors(errors);
        return;
      }

      const result = await login(formData.email, formData.password);
      
      if (!result.success) {
        setError('Login failed');
      } else if (result.token) {
        setSuccess(true);
        // Store the token
        onLoginSuccess(result.token);
      } else {
        setError('Login failed: No token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed');
    }
  };

  const handleFieldChange = (field: 'email' | 'password') => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationErrors(prev => prev.filter(error => error.field !== field));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <InputField
          formData={formData}
          field="email"
          onChange={handleFieldChange('email')}
          error={validationErrors.find(e => e.field === 'email')?.message}
        />
        <InputField
          formData={formData}
          field="password"
          isPassword
          onChange={handleFieldChange('password')}
          error={validationErrors.find(e => e.field === 'password')?.message}
        />
      </div>
      <button
        onClick={handleLogin}
        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
      >
        Sign In
      </button>
      <div className="text-center">
        <button
          onClick={onSwitchToRegister}
          className="text-blue-500 hover:text-blue-600"
        >
          Don't have an account? Sign up
        </button>
      </div>
      <Message type="error" message={error || ''} />
      <Message 
        type="success" 
        message={success ? 'Login successful!' : ''} 
      />
    </div>
  );
} 