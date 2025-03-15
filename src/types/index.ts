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
  userId: string;
  companyId: string;
  companyUserId: string;
  lastEntryDate: string;
  lastSentDate: string;
  nextSendDate: string;
  createdAt: string;
  customDays?: number;
} 