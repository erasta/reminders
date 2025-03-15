import nodemailer from 'nodemailer';
import { Reminder, User, ReminderType } from '@/types';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendReminderEmail(
  reminder: Reminder,
  user: User,
  reminderType: ReminderType
) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: `Reminder: ${reminder.title}`,
      html: `
        <h1>Hello ${user.name}!</h1>
        <p>This is a reminder for: <strong>${reminder.title}</strong></p>
        <p>${reminder.description || ''}</p>
        <p>This is a ${reminderType.name} reminder that occurs every ${reminderType.periodDays} days.</p>
        <p>Your next reminder will be sent on: ${reminder.nextSendDate}</p>
        <hr>
        <p>To manage your reminders, please log in to your account.</p>
      `,
    });
  } catch (error) {
    console.error('Error sending reminder email:', error);
    throw error;
  }
} 