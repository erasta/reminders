-- Create the reminders table
create table reminders (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  company_id text not null,
  company_user_id text not null,
  last_entry_date timestamp with time zone not null,
  next_send_date timestamp with time zone not null,
  custom_days integer,
  created_at timestamp with time zone default now()
);

-- Add RLS policies
alter table reminders enable row level security;

create policy "Users can view their own reminders"
  on reminders for select
  using (user_id::text = auth.uid()::text);

create policy "Users can insert their own reminders"
  on reminders for insert
  with check (user_id::text = auth.uid()::text);

create policy "Users can update their own reminders"
  on reminders for update
  using (user_id::text = auth.uid()::text);

create policy "Users can delete their own reminders"
  on reminders for delete
  using (user_id::text = auth.uid()::text); 