-- ReviewShield initial production schema
-- Run in Supabase SQL editor or via supabase migration tooling.

create extension if not exists pgcrypto;

create table if not exists public.gbp_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id text not null,
  location_id text not null,
  location_name text,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, account_id, location_id)
);

create table if not exists public.reviews (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text,
  rating int,
  comment text,
  created_at timestamptz,
  platform text,
  location_name text,
  risk_score int not null default 0,
  risk_level text not null default 'low',
  status text not null default 'pending',
  detection_reason text,
  account_id text,
  location_id text,
  google_review_id text,
  owner_reply text,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  description text not null,
  severity text not null,
  review_id text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.evidence_packages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  review_id text not null,
  status text not null default 'ready',
  generated_at timestamptz not null default now(),
  summary jsonb not null default '{}'::jsonb
);

create table if not exists public.review_verifications (
  user_id uuid not null references auth.users(id) on delete cascade,
  review_id text not null,
  is_known_customer boolean,
  notes text,
  updated_at timestamptz not null default now(),
  primary key (user_id, review_id)
);

create index if not exists idx_gbp_connections_user_id on public.gbp_connections(user_id);
create index if not exists idx_reviews_user_id_created_at on public.reviews(user_id, created_at desc);
create index if not exists idx_reviews_user_id_risk_score on public.reviews(user_id, risk_score desc);
create index if not exists idx_alerts_user_id_created_at on public.alerts(user_id, created_at desc);
create index if not exists idx_evidence_packages_user_id_generated_at on public.evidence_packages(user_id, generated_at desc);

alter table public.gbp_connections enable row level security;
alter table public.reviews enable row level security;
alter table public.alerts enable row level security;
alter table public.evidence_packages enable row level security;
alter table public.review_verifications enable row level security;

-- gbp_connections policies
drop policy if exists "gbp_connections_select_own" on public.gbp_connections;
create policy "gbp_connections_select_own"
  on public.gbp_connections for select
  using (auth.uid() = user_id);

drop policy if exists "gbp_connections_insert_own" on public.gbp_connections;
create policy "gbp_connections_insert_own"
  on public.gbp_connections for insert
  with check (auth.uid() = user_id);

drop policy if exists "gbp_connections_update_own" on public.gbp_connections;
create policy "gbp_connections_update_own"
  on public.gbp_connections for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "gbp_connections_delete_own" on public.gbp_connections;
create policy "gbp_connections_delete_own"
  on public.gbp_connections for delete
  using (auth.uid() = user_id);

-- reviews policies
drop policy if exists "reviews_select_own" on public.reviews;
create policy "reviews_select_own"
  on public.reviews for select
  using (auth.uid() = user_id);

drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own"
  on public.reviews for insert
  with check (auth.uid() = user_id);

drop policy if exists "reviews_update_own" on public.reviews;
create policy "reviews_update_own"
  on public.reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "reviews_delete_own" on public.reviews;
create policy "reviews_delete_own"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- alerts policies
drop policy if exists "alerts_select_own" on public.alerts;
create policy "alerts_select_own"
  on public.alerts for select
  using (auth.uid() = user_id);

drop policy if exists "alerts_insert_own" on public.alerts;
create policy "alerts_insert_own"
  on public.alerts for insert
  with check (auth.uid() = user_id);

drop policy if exists "alerts_update_own" on public.alerts;
create policy "alerts_update_own"
  on public.alerts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "alerts_delete_own" on public.alerts;
create policy "alerts_delete_own"
  on public.alerts for delete
  using (auth.uid() = user_id);

-- evidence packages policies
drop policy if exists "evidence_packages_select_own" on public.evidence_packages;
create policy "evidence_packages_select_own"
  on public.evidence_packages for select
  using (auth.uid() = user_id);

drop policy if exists "evidence_packages_insert_own" on public.evidence_packages;
create policy "evidence_packages_insert_own"
  on public.evidence_packages for insert
  with check (auth.uid() = user_id);

drop policy if exists "evidence_packages_update_own" on public.evidence_packages;
create policy "evidence_packages_update_own"
  on public.evidence_packages for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "evidence_packages_delete_own" on public.evidence_packages;
create policy "evidence_packages_delete_own"
  on public.evidence_packages for delete
  using (auth.uid() = user_id);

-- review verifications policies
drop policy if exists "review_verifications_select_own" on public.review_verifications;
create policy "review_verifications_select_own"
  on public.review_verifications for select
  using (auth.uid() = user_id);

drop policy if exists "review_verifications_insert_own" on public.review_verifications;
create policy "review_verifications_insert_own"
  on public.review_verifications for insert
  with check (auth.uid() = user_id);

drop policy if exists "review_verifications_update_own" on public.review_verifications;
create policy "review_verifications_update_own"
  on public.review_verifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "review_verifications_delete_own" on public.review_verifications;
create policy "review_verifications_delete_own"
  on public.review_verifications for delete
  using (auth.uid() = user_id);
