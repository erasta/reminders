import { NextResponse } from 'next/server';
import { addDays } from 'date-fns';
import { getCompanies } from '@/lib/companies';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/auth/token';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { data: reminders, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', payload.userId);

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
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    console.log('POST /api/reminders - Request body:', body);

    const { companyId, companyUserId, lastEntryDate, customDays } = body;
    
    if (!companyId || !companyUserId || !lastEntryDate) {
      console.log('Missing required fields:', { companyId, companyUserId, lastEntryDate });
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const companies = await getCompanies();
    console.log('Available companies:', companies);
    const company = companies.find(c => c.id === companyId);
    
    if (!company) {
      console.log('Invalid company ID:', companyId);
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

    console.log('Creating reminder with data:', {
      user_id: payload.userId,
      company_id: companyId,
      company_user_id: companyUserId,
      last_entry_date: lastEntryDateTime.toISOString(),
      next_send_date: nextSendDate.toISOString(),
      custom_days: company.days_before_deactivation === 0 ? customDays : null,
    });

    const { data: reminder, error } = await supabase
      .from('reminders')
      .insert([{
        user_id: payload.userId,
        company_id: companyId,
        company_user_id: companyUserId,
        last_entry_date: lastEntryDateTime.toISOString(),
        next_send_date: nextSendDate.toISOString(),
        custom_days: company.days_before_deactivation === 0 ? customDays : null,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Successfully created reminder:', reminder);
    return NextResponse.json(reminder);
  } catch (error) {
    console.error('Create reminder error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 