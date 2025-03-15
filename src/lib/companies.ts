import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { Company } from '@/types';

let companiesCache: Company[] = [];

export async function getCompanies(): Promise<Company[]> {
  if (companiesCache.length > 0) {
    return companiesCache;
  }

  try {
    const filePath = path.join(process.cwd(), 'companies.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    companiesCache = records.map((record: any) => ({
      id: record.company_id,
      name: record.company_name,
      days_before_deactivation: parseInt(record.days_before_deactivation),
      link_to_policy: record.link_to_policy || null,
      activities_to_avoid_deactivation: record.activities_to_avoid_deactivation || null
    }));

    return companiesCache;
  } catch (error) {
    console.error('Error loading companies:', error);
    return [];
  }
} 