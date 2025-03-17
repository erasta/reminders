'use client';

import { useEffect, useState } from 'react';
import { useLogin } from '@/contexts/LoginContext';

interface Company {
  name: string;
  daysBeforeDeactivation: number;
  policyLink: string;
}

export function Companies() {
  const { loginData } = useLogin();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies');
        if (!response.ok) {
          throw new Error(`Failed to fetch companies: ${response.statusText}`);
        }
        const data = await response.json();
        setCompanies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load companies');
      }
    };

    if (loginData) {
      fetchCompanies();
    }
  }, [loginData]);

  if (!loginData) {
    return null;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading companies: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
          Select Company
        </label>
        <select
          id="company"
          value={selectedCompany?.name || ''}
          onChange={(e) => {
            const company = companies.find(c => c.name === e.target.value);
            setSelectedCompany(company || null);
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a company...</option>
          {companies.map((company) => (
            <option key={company.name} value={company.name}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCompany && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-900">{selectedCompany.name}</h3>
          <p className="mt-1 text-sm text-gray-500">
            Days before deactivation: {selectedCompany.daysBeforeDeactivation}
          </p>
          <a
            href={selectedCompany.policyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
          >
            View Policy
          </a>
        </div>
      )}
    </div>
  );
} 