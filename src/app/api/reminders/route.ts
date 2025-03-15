import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { addDays } from 'date-fns';
import { getCompanies } from '@/lib/companies';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: reminders, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('userId', session.user.id);

    if (error) throw error;
    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Get reminders error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { companyId, companyUserId, lastEntryDate, customDays } = await request.json();
    
    if (!companyId || !companyUserId || !lastEntryDate) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const companies = await getCompanies();
    const company = companies.find(c => c.id === companyId);
    
    if (!company) {
      return NextResponse.json(
        { message: 'Invalid company' },
        { status: 400 }
      );
    }

    const daysBeforeDeactivation = company.days_before_deactivation === 0 
      ? customDays 
      : company.days_before_deactivation;

    const lastEntryDateTime = new Date(lastEntryDate);
    const nextSendDate = addDays(lastEntryDateTime, daysBeforeDeactivation);

    const { data: reminder, error } = await supabase
      .from('reminders')
      .insert([{
        userId: session.user.id,
        companyId,
        companyUserId,
        lastEntryDate: lastEntryDateTime.toISOString(),
        nextSendDate: nextSendDate.toISOString(),
        customDays: company.days_before_deactivation === 0 ? customDays : null,
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(reminder);
  } catch (error) {
    console.error('Create reminder error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 