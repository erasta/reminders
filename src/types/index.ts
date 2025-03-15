export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface Company {
  id: string;
  name: string;
  days_before_deactivation: number;
  policy_link: string;
  link_to_policy: string | null;
  activities_to_avoid_deactivation: string | null;
}

export interface ReminderType {
  id: string;
  name: string;
  periodDays: number;
  description: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  company_id: string;
  company_user_id: string;
  last_entry_date: string;
  next_send_date: string;
  created_at: string;
  custom_days?: number;
} 