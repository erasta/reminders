'use client';

import { useEffect, useState } from 'react';
import { useLogin } from '@/contexts/LoginContext';
import { Company } from '@/types';

interface CompaniesProps {
  onSelect?: (company: Company) => void;
  selectedCompanyId?: string;
}

export function Companies({ onSelect, selectedCompanyId }: CompaniesProps) {
  const { loginData } = useLogin();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies', {
          headers: {
            'Authorization': `Bearer ${loginData?.token}`
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch companies: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        setCompanies(data);
        
        if (selectedCompanyId) {
          const company = data.find((c: Company) => c.id === selectedCompanyId);
          if (company) {
            setSelectedCompany(company);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load companies');
      }
    };

    if (loginData) {
      fetchCompanies();
    }
  }, [loginData, selectedCompanyId]);

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
          value={selectedCompany?.id || ''}
          onChange={(e) => {
            const company = companies.find(c => c.id === e.target.value);
            setSelectedCompany(company || null);
            if (company && onSelect) {
              onSelect(company);
            }
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a company...</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name} (ID: {company.id}, {company.days_before_deactivation === 0 ? 'Custom' : company.days_before_deactivation} days)
            </option>
          ))}
        </select>
      </div>

      {selectedCompany && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-900">{selectedCompany.name}</h3>
          <p className="mt-1 text-sm text-gray-500">
            Days before deactivation: {selectedCompany.days_before_deactivation === 0 ? 'Custom' : selectedCompany.days_before_deactivation}
          </p>
          {selectedCompany.policy_link && (
            <a
              href={selectedCompany.policy_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
            >
              View Policy
            </a>
          )}
        </div>
      )}
    </div>
  );
} 