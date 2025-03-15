import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getReminders, updateReminder } from '@/lib/db';
import { addDays } from 'date-fns';
import { getCompanies } from '@/lib/companies';
import path from 'path';
import fs from 'fs/promises';

const REMINDERS_FILE = path.join(process.cwd(), 'data', 'reminders.json');

async function writeData(filePath: string, data: any[]): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const reminders = await getReminders();
    const reminderIndex = reminders.findIndex(r => r.id === params.id && r.userId === session.user.id);
    
    if (reminderIndex === -1) {
      return NextResponse.json({ message: 'Reminder not found' }, { status: 404 });
    }

    reminders.splice(reminderIndex, 1);
    await writeData(REMINDERS_FILE, reminders);
    
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
    const { companyId, companyUserId, lastEntryDate } = await request.json();
    
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

    const reminders = await getReminders();
    const reminder = reminders.find(r => r.id === params.id && r.userId === session.user.id);

    if (!reminder) {
      return NextResponse.json({ message: 'Reminder not found' }, { status: 404 });
    }

    const lastEntryDateTime = new Date(lastEntryDate);
    const nextSendDate = addDays(lastEntryDateTime, company.days_before_deactivation);

    const updatedReminder = {
      ...reminder,
      companyId,
      companyUserId,
      lastEntryDate: lastEntryDateTime.toISOString(),
      nextSendDate: nextSendDate.toISOString(),
    };

    await updateReminder(updatedReminder);
    return NextResponse.json(updatedReminder);
  } catch (error) {
    console.error('Update reminder error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 