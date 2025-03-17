import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const relativePath = 'companies.csv';
    const absolutePath = path.join(process.cwd(), relativePath);
    
    console.log('Attempting to read companies.csv:');
    console.log('Relative path:', relativePath);
    console.log('Absolute path:', absolutePath);
    
    const fileContents = await fs.readFile(absolutePath, 'utf-8');
    const rows = fileContents.split('\n').slice(1); // Skip header row
    
    const companies = rows
      .filter(row => row.trim())
      .map(row => {
        const [company_id, company_name, days_before_deactivation, link_to_policy] = row.split(',');
        return {
          name: company_name,
          daysBeforeDeactivation: parseInt(days_before_deactivation),
          policyLink: link_to_policy
        };
      });

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error reading companies.csv:', error);
    return NextResponse.json(
      { error: 'Failed to read companies data' },
      { status: 500 }
    );
  }
} 