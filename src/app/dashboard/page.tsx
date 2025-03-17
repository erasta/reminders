'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReminderForm from '@/components/ReminderForm';
import { Company, Reminder } from '@/types';
import { format } from 'date-fns';
import { useLogin } from '@/contexts/LoginContext';

export default function DashboardPage() {
  const { loginData, setLoginData } = useLogin();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  useEffect(() => {
    if (!loginData) {
      router.push('/');
    }
  }, [loginData, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, remindersRes] = await Promise.all([
          fetch('/api/companies', {
            headers: {
              'Authorization': `Bearer ${loginData?.token}`
            }
          }),
          fetch('/api/reminders', {
            headers: {
              'Authorization': `Bearer ${loginData?.token}`
            }
          })
        ]);

        if (companiesRes.ok && remindersRes.ok) {
          const [companiesData, remindersData] = await Promise.all([
            companiesRes.json(),
            remindersRes.json()
          ]);

          setCompanies(companiesData);
          setReminders(remindersData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (loginData) {
      fetchData();
    }
  }, [loginData]);

  const handleReminderSuccess = () => {
    setEditingReminder(null);
    fetch('/api/reminders', {
      headers: {
        'Authorization': `Bearer ${loginData?.token}`
      }
    })
      .then(res => res.json())
      .then(data => setReminders(data))
      .catch(error => console.error('Error refreshing reminders:', error));
  };

  const handleDeleteReminder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;

    try {
      const res = await fetch(`/api/reminders/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${loginData?.token}`
        }
      });

      if (res.ok) {
        handleReminderSuccess();
      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const handleLogout = () => {
    setLoginData(null);
    router.push('/');
  };

  if (!loginData || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Reminders for {loginData.user.name}
              </h1>
              <h2 className="mt-1 text-lg text-gray-600">
                Email: {loginData.user.email}
              </h2>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Reminder</h2>
            <ReminderForm 
              companies={companies} 
              onSuccess={handleReminderSuccess}
              editingReminder={editingReminder}
              onCancel={() => setEditingReminder(null)}
            />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Reminders</h2>
            {reminders.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-600">No reminders yet. Create your first reminder above!</p>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {reminders.map((reminder) => {
                    const company = companies.find(c => c.id === reminder.company_id);
                    return (
                      <li key={reminder.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {company?.name} - User ID: {reminder.company_user_id}
                            </h3>
                            <div className="mt-2 text-sm text-gray-500">
                              <p>Last entry: {format(reminder.last_entry_date ? new Date(reminder.last_entry_date) : new Date(), 'PPP')}</p>
                              <p>Next reminder: {format(new Date(reminder.next_send_date), 'PPP')}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingReminder(reminder)}
                              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteReminder(reminder.id)}
                              className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 