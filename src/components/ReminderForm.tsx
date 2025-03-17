'use client';

import { useState, useEffect } from 'react';
import { Company, Reminder } from '@/types';
import { useLogin } from '@/contexts/LoginContext';
import { Companies } from './companies/Companies';

interface ReminderFormProps {
  companies: Company[];
  onSuccess: () => void;
  editingReminder?: Reminder | null;
  onCancel?: () => void;
}

export default function ReminderForm({ companies, onSuccess, editingReminder, onCancel }: ReminderFormProps) {
  const { loginData } = useLogin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [companyUserId, setCompanyUserId] = useState('');
  const [lastEntryDate, setLastEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [customDays, setCustomDays] = useState('180');

  const selectedCompany = companies.find(c => c.id === companyId);

  useEffect(() => {
    if (editingReminder) {
      setCompanyId(editingReminder.company_id);
      setCompanyUserId(editingReminder.company_user_id);
      setLastEntryDate(editingReminder.last_entry_date.split('T')[0]);
      if (editingReminder.custom_days) {
        setCustomDays(editingReminder.custom_days.toString());
      }
    }
  }, [editingReminder]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = {
      companyId,
      companyUserId,
      lastEntryDate: new Date(lastEntryDate).toISOString(),
      customDays: selectedCompany?.days_before_deactivation === 0 ? parseInt(customDays) : undefined,
    };

    try {
      const url = editingReminder 
        ? `/api/reminders/${editingReminder.id}`
        : '/api/reminders';
      
      const res = await fetch(url, {
        method: editingReminder ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData?.token}`
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save reminder');
      }

      onSuccess();
      if (!editingReminder) {
        setCompanyId('');
        setCompanyUserId('');
        setLastEntryDate(new Date().toISOString().split('T')[0]);
        setCustomDays('180');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySelect = (company: Company) => {
    setCompanyId(company.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="w-1/2">
        <Companies 
          onSelect={handleCompanySelect}
          selectedCompanyId={companyId}
        />
      </div>

      {selectedCompany?.days_before_deactivation === 0 && (
        <div className="w-1/2">
          <label htmlFor="customDays" className="block text-sm font-medium text-gray-700">
            Days Before Deactivation
          </label>
          <input
            type="number"
            id="customDays"
            name="customDays"
            value={customDays}
            onChange={(e) => setCustomDays(e.target.value)}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10"
            required
          />
        </div>
      )}

      <div className="w-1/2">
        <label htmlFor="companyUserId" className="block text-sm font-medium text-gray-700">
          Company User ID
        </label>
        <input
          type="text"
          id="companyUserId"
          name="companyUserId"
          value={companyUserId}
          onChange={(e) => setCompanyUserId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10"
          required
        />
      </div>

      <div className="w-1/2">
        <label htmlFor="lastEntryDate" className="block text-sm font-medium text-gray-700">
          Last Entry Date
        </label>
        <input
          type="date"
          id="lastEntryDate"
          name="lastEntryDate"
          value={lastEntryDate}
          onChange={(e) => setLastEntryDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10"
          required
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {loading ? 'Saving...' : editingReminder ? 'Update Reminder' : 'Create Reminder'}
        </button>
        {editingReminder && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
} 