-- Create tutor_subjects junction table
create table if not exists public.tutor_subjects (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.profiles(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  proficiency_level text check (proficiency_level in ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(tutor_id, subject_id)
);

-- Enable RLS
alter table public.tutor_subjects enable row level security;

-- RLS Policies for tutor_subjects
create policy "Anyone can view tutor subjects"
  on public.tutor_subjects for select
  using (true);

create policy "Tutors can insert their own subjects"
  on public.tutor_subjects for insert
  with check (auth.uid() = tutor_id);

create policy "Tutors can update their own subjects"
  on public.tutor_subjects for update
  using (auth.uid() = tutor_id);

create policy "Tutors can delete their own subjects"
  on public.tutor_subjects for delete
  using (auth.uid() = tutor_id);

-- Create indexes
create index if not exists tutor_subjects_tutor_id_idx on public.tutor_subjects(tutor_id);
create index if not exists tutor_subjects_subject_id_idx on public.tutor_subjects(subject_id);
