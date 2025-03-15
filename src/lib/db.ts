import fs from 'fs/promises';
import path from 'path';
import { User, Reminder, ReminderType } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const REMINDERS_FILE = path.join(DATA_DIR, 'reminders.json');
const REMINDER_TYPES_FILE = path.join(DATA_DIR, 'reminderTypes.json');

// Initialize data directory and files if they don't exist
async function initializeDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    const files = [
      { path: USERS_FILE, default: '[]' },
      { path: REMINDERS_FILE, default: '[]' },
      { path: REMINDER_TYPES_FILE, default: '[]' }
    ];

    for (const file of files) {
      try {
        await fs.access(file.path);
      } catch {
        await fs.writeFile(file.path, file.default);
      }
    }
  } catch (error) {
    console.error('Error initializing data files:', error);
  }
}

// Generic read function
async function readData<T>(filePath: string): Promise<T[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

// Generic write function
async function writeData<T>(filePath: string, data: T[]): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
  }
}

// Users
export async function getUsers(): Promise<User[]> {
  return readData<User>(USERS_FILE);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  return users.find(user => user.email === email) || null;
}

export async function createUser(user: User): Promise<User> {
  const users = await getUsers();
  users.push(user);
  await writeData(USERS_FILE, users);
  return user;
}

// Reminders
export async function getReminders(): Promise<Reminder[]> {
  return readData<Reminder>(REMINDERS_FILE);
}

export async function getUserReminders(userId: string): Promise<Reminder[]> {
  const reminders = await getReminders();
  return reminders.filter(reminder => reminder.userId === userId);
}

export async function createReminder(reminder: Reminder): Promise<Reminder> {
  const reminders = await getReminders();
  reminders.push(reminder);
  await writeData(REMINDERS_FILE, reminders);
  return reminder;
}

export async function updateReminder(reminder: Reminder): Promise<Reminder> {
  const reminders = await getReminders();
  const index = reminders.findIndex(r => r.id === reminder.id);
  if (index !== -1) {
    reminders[index] = reminder;
    await writeData(REMINDERS_FILE, reminders);
  }
  return reminder;
}

// Reminder Types
export async function getReminderTypes(): Promise<ReminderType[]> {
  return readData<ReminderType>(REMINDER_TYPES_FILE);
}

export async function createReminderType(type: ReminderType): Promise<ReminderType> {
  const types = await getReminderTypes();
  types.push(type);
  await writeData(REMINDER_TYPES_FILE, types);
  return type;
}

// Initialize data files on module load
initializeDataFiles(); 