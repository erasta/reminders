'use client';

import { useState, useEffect } from 'react';
import { Company, Reminder } from '@/types';

interface ReminderFormProps {
  companies: Company[];
  onSuccess: () => void;
  editingReminder?: Reminder | null;
  onCancel?: () => void;
}

export default function ReminderForm({ companies, onSuccess, editingReminder, onCancel }: ReminderFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [companyUserId, setCompanyUserId] = useState('');
  const [lastEntryDate, setLastEntryDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (editingReminder) {
      setCompanyId(editingReminder.companyId);
      setCompanyUserId(editingReminder.companyUserId);
      setLastEntryDate(editingReminder.lastEntryDate.split('T')[0]);
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
    };

    try {
      const url = editingReminder 
        ? `/api/reminders/${editingReminder.id}`
        : '/api/reminders';
      
      const res = await fetch(url, {
        method: editingReminder ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="w-1/2">
        <label htmlFor="companyId" className="block text-sm font-medium text-gray-700">
          Company
        </label>
        <select
          id="companyId"
          name="companyId"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10"
          required
        >
          <option value="">Select a company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name} ({company.days_before_deactivation} days)
            </option>
          ))}
        </select>
      </div>

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