-- Create subjects table
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.subjects enable row level security;

-- RLS Policies for subjects (read-only for all users)
create policy "Anyone can view subjects"
  on public.subjects for select
  using (true);

-- Insert default subjects
insert into public.subjects (name, description) values
  ('Mathematics', 'Algebra, Calculus, Geometry, Statistics'),
  ('Science', 'Physics, Chemistry, Biology'),
  ('English', 'Literature, Writing, Grammar'),
  ('History', 'World History, US History'),
  ('Computer Science', 'Programming, Algorithms, Data Structures'),
  ('Languages', 'Spanish, French, German, Mandarin'),
  ('Test Prep', 'SAT, ACT, GRE, GMAT')
on conflict (name) do nothing;
