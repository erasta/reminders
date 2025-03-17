'use client';

import { useState } from 'react';
import { register } from './actions';
import { InputField } from './InputField';
import { Message } from './Message';
import { validateRegistration, ValidationError, FormData } from './validate';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const createFakeData = () => {
    const id = crypto.randomUUID();
    const last5 = id.slice(-5);
    const name = `E${last5}`;
    const email = `e${last5}@b.com`;
    const password = '123123';

    setFormData({ name, email, password });
    setValidationErrors([]);
  };

  const handleRegister = async () => {
    try {
      setError(null);
      setSuccess(false);
      setValidationErrors([]);

      const errors = validateRegistration(formData);
      if (errors.length > 0) {
        setValidationErrors(errors);
        return;
      }

      const result = await register(formData.name, formData.email, formData.password);
      
      if (!result.success) {
        setError('Registration failed');
      } else {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed');
    }
  };

  const handleFieldChange = (field: 'name' | 'email' | 'password') => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationErrors(prev => prev.filter(error => error.field !== field));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <InputField
          formData={formData}
          field="name"
          onChange={handleFieldChange('name')}
          error={validationErrors.find(e => e.field === 'name')?.message}
        />
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
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleRegister}
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Sign Up
        </button>
        <button
          onClick={createFakeData}
          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
        >
          Create Fake Data
        </button>
      </div>
      <div className="text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-blue-500 hover:text-blue-600"
        >
          Already have an account? Sign in
        </button>
      </div>
      <Message type="error" message={error || ''} />
      <Message 
        type="success" 
        message={success ? 'Registration successful!' : ''} 
      />
    </div>
  );
} 