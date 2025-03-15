import { NextResponse } from 'next/server';
import { getCompanies } from '@/lib/companies';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  console.log('Companies API: Starting request');
  const session = await getServerSession(authOptions);
  console.log('Companies API: Session:', session);
  
  if (!session?.user?.id) {
    console.log('Companies API: Unauthorized - no user ID in session');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Companies API: Fetching companies');
    const companies = await getCompanies();
    console.log('Companies API: Companies fetched:', companies.length);
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Companies API: Error fetching companies:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 