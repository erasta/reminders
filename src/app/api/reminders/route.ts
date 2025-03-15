import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createReminder, getUserReminders } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { getCompanies } from '@/lib/companies';
import { addDays } from 'date-fns';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const reminders = await getUserReminders(session.user.id);
  // Set lastEntryDate to createdAt for existing reminders that don't have it
  const updatedReminders = reminders.map(reminder => ({
    ...reminder,
    lastEntryDate: reminder.lastEntryDate || reminder.createdAt
  }));
  
  return NextResponse.json(updatedReminders);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { companyId, companyUserId } = await request.json();
    
    if (!companyId || !companyUserId) {
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

    const now = new Date();
    const nextSendDate = addDays(now, company.days_before_deactivation);

    const reminder = await createReminder({
      id: uuidv4(),
      userId: session.user.id,
      companyId,
      companyUserId,
      lastEntryDate: now.toISOString(),
      lastSentDate: now.toISOString(),
      nextSendDate: nextSendDate.toISOString(),
      createdAt: now.toISOString(),
    });

    return NextResponse.json(reminder, { status: 201 });
  } catch (error) {
    console.error('Create reminder error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 