-- Create sessions table
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  scheduled_at timestamp with time zone not null,
  duration_minutes integer not null default 60,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  meeting_url text,
  notes text,
  student_notes text,
  tutor_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.sessions enable row level security;

-- RLS Policies for sessions
create policy "Users can view their own sessions"
  on public.sessions for select
  using (auth.uid() = tutor_id or auth.uid() = student_id);

create policy "Students can insert sessions"
  on public.sessions for insert
  with check (auth.uid() = student_id);

create policy "Users can update their own sessions"
  on public.sessions for update
  using (auth.uid() = tutor_id or auth.uid() = student_id);

create policy "Users can delete their own sessions"
  on public.sessions for delete
  using (auth.uid() = tutor_id or auth.uid() = student_id);

-- Create indexes
create index if not exists sessions_tutor_id_idx on public.sessions(tutor_id);
create index if not exists sessions_student_id_idx on public.sessions(student_id);
create index if not exists sessions_scheduled_at_idx on public.sessions(scheduled_at);
create index if not exists sessions_status_idx on public.sessions(status);
