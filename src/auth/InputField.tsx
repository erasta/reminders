'use client';

interface InputFieldProps {
  formData: {
    name: string;
    email: string;
    password: string;
  };
  field: 'name' | 'email' | 'password';
  isPassword?: boolean;
  onChange: (value: string) => void;
  error?: string;
}

export function InputField({ formData, field, isPassword, onChange, error }: InputFieldProps) {
  const label = field.charAt(0).toUpperCase() + field.slice(1) + ':';
  const inputId = `auth-${field}`;
  const inputName = field;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <label htmlFor={inputId} className="w-20">{label}</label>
        <input
          id={inputId}
          name={inputName}
          type={isPassword ? 'password' : field === 'email' ? 'email' : 'text'}
          value={formData[field]}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          className={`flex-1 px-3 py-2 border rounded ${error ? 'border-red-500' : ''}`}
          autoComplete={isPassword ? 'current-password' : field === 'email' ? 'email' : 'name'}
        />
      </div>
      {error && (
        <div className="text-red-500 text-sm ml-24">
          {error}
        </div>
      )}
    </div>
  );
} 