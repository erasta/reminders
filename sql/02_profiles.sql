-- Create the profiles table
create table profiles (
  id uuid primary key,
  name text not null,
  email text unique not null,
  password text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Anyone can insert their own profile"
  on profiles for insert
  with check (true);

create policy "Users can update their own profile"
  on profiles for update
  using (true);

create policy "Users can delete their own profile"
  on profiles for delete
  using (true); 