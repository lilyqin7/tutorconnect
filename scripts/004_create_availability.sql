-- Create availability table for tutors
create table if not exists public.availability (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.profiles(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6), -- 0 = Sunday, 6 = Saturday
  start_time time not null,
  end_time time not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(tutor_id, day_of_week, start_time)
);

-- Enable RLS
alter table public.availability enable row level security;

-- RLS Policies for availability
create policy "Anyone can view availability"
  on public.availability for select
  using (true);

create policy "Tutors can insert their own availability"
  on public.availability for insert
  with check (auth.uid() = tutor_id);

create policy "Tutors can update their own availability"
  on public.availability for update
  using (auth.uid() = tutor_id);

create policy "Tutors can delete their own availability"
  on public.availability for delete
  using (auth.uid() = tutor_id);

-- Create index
create index if not exists availability_tutor_id_idx on public.availability(tutor_id);
