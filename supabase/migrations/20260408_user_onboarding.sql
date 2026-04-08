-- User onboarding table and RLS policies

create table if not exists public.user_onboarding (
  user_id uuid primary key references auth.users(id) on delete cascade,
  business_name text,
  industry text,
  team_size text,
  monthly_review_volume text,
  primary_goal text,
  biggest_challenge text,
  onboarding_completed boolean not null default false,
  setup_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_onboarding_setup_completed
  on public.user_onboarding(setup_completed);

alter table public.user_onboarding enable row level security;

drop policy if exists "user_onboarding_select_own" on public.user_onboarding;
create policy "user_onboarding_select_own"
  on public.user_onboarding for select
  using (auth.uid() = user_id);

drop policy if exists "user_onboarding_insert_own" on public.user_onboarding;
create policy "user_onboarding_insert_own"
  on public.user_onboarding for insert
  with check (auth.uid() = user_id);

drop policy if exists "user_onboarding_update_own" on public.user_onboarding;
create policy "user_onboarding_update_own"
  on public.user_onboarding for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "user_onboarding_delete_own" on public.user_onboarding;
create policy "user_onboarding_delete_own"
  on public.user_onboarding for delete
  using (auth.uid() = user_id);
