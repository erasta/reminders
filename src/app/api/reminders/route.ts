import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/auth/token';
import { promises as fs } from 'fs';
import path from 'path';

async function getCompanies() {
  const relativePath = 'companies.csv';
  const absolutePath = path.join(process.cwd(), relativePath);
  
  console.log('Reading companies from:', absolutePath);
  
  const fileContents = await fs.readFile(absolutePath, 'utf-8');
  const rows = fileContents.split('\n').slice(1); // Skip header row
  
  return rows
    .filter(row => row.trim())
    .map(row => {
      const [company_id, company_name, days_before_deactivation, link_to_policy, activities_to_avoid_deactivation] = row.split(',');
      return {
        id: company_id,
        name: company_name,
        days_before_deactivation: parseInt(days_before_deactivation),
        policy_link: link_to_policy || '',
        link_to_policy: link_to_policy || null,
        activities_to_avoid_deactivation: activities_to_avoid_deactivation || null
      };
    });
}

export async function GET(request: Request) {
  try {
    console.log('GET /api/reminders - Request headers:', Object.fromEntries(request.headers.entries()));
    
    const authHeader = request.headers.get('Authorization');
    console.log('GET /api/reminders - Auth header:', authHeader);
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('GET /api/reminders - No Bearer token found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    console.log('GET /api/reminders - Extracted token:', token.substring(0, 10) + '...');
    
    const payload = await verifyToken(token);
    console.log('GET /api/reminders - Token payload:', payload);
    
    if (!payload?.sub) {
      console.log('GET /api/reminders - No sub (userId) in token payload');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { data: reminders, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', payload.sub)
      .order('next_entry_date', { ascending: true });

    if (error) throw error;
    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reminders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/reminders - Request headers:', Object.fromEntries(request.headers.entries()));
    
    const authHeader = request.headers.get('Authorization');
    console.log('POST /api/reminders - Auth header:', authHeader);
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('POST /api/reminders - No Bearer token found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    console.log('POST /api/reminders - Extracted token:', token.substring(0, 10) + '...');
    
    const payload = await verifyToken(token);
    console.log('POST /api/reminders - Token payload:', payload);
    
    if (!payload?.sub) {
      console.log('POST /api/reminders - No sub (userId) in token payload');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    console.log('POST /api/reminders - Request body:', body);

    const { companyId, companyUserId, lastEntryDate, customDays } = body;

    if (!companyId || !companyUserId || !lastEntryDate) {
      console.log('POST /api/reminders - Missing required fields:', { companyId, companyUserId, lastEntryDate });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify company exists in CSV
    const companies = await getCompanies();
    const company = companies.find(c => c.id === companyId);
    
    if (!company) {
      console.log('POST /api/reminders - Invalid company ID:', companyId);
      return NextResponse.json(
        { error: 'Invalid company ID' },
        { status: 400 }
      );
    }

    console.log('POST /api/reminders - Creating reminder with data:', {
      user_id: payload.sub,
      company_id: companyId,
      company_user_id: companyUserId,
      last_entry_date: lastEntryDate,
      custom_days: customDays
    });

    const { data: reminder, error } = await supabase
      .from('reminders')
      .insert([{
        user_id: payload.sub,
        company_id: companyId,
        company_user_id: companyUserId,
        last_entry_date: lastEntryDate,
        custom_days: customDays
      }])
      .select()
      .single();

    if (error) {
      console.error('POST /api/reminders - Supabase error:', error);
      throw error;
    }

    console.log('POST /api/reminders - Successfully created reminder:', reminder);
    return NextResponse.json(reminder);
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 }
    );
  }
} 