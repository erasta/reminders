export interface ValidationError {
  field: string;
  message: string;
}

export interface FormData {
  name: string;
  email: string;
  password: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRegistration = (formData: FormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!formData.name.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!validateEmail(formData.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (formData.password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  return errors;
};

export const validateLogin = (formData: FormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!validateEmail(formData.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (!formData.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return errors;
}; 