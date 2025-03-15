import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { addDays } from 'date-fns';
import { getCompanies } from '@/lib/companies';
import { supabase } from '@/lib/supabase';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', params.id)
      .eq('userId', session.user.id);

    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Delete reminder error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      .update({
        companyId,
        companyUserId,
        lastEntryDate: lastEntryDateTime.toISOString(),
        nextSendDate: nextSendDate.toISOString(),
        customDays: company.days_before_deactivation === 0 ? customDays : null,
      })
      .eq('id', params.id)
      .eq('userId', session.user.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(reminder);
  } catch (error) {
    console.error('Update reminder error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 