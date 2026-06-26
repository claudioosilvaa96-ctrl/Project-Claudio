create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.settings (
  user_id uuid primary key references public.users(id) on delete cascade,
  calorie_target integer not null default 2400,
  calorie_tolerance integer not null default 180,
  protein_target integer not null default 180,
  water_target_litres numeric(4, 1) not null default 2.5,
  steps_target integer not null default 8000,
  sleep_target_hours numeric(4, 1) not null default 7,
  daily_spend_limit numeric(10, 2) not null default 25,
  monthly_sales_target integer not null default 18,
  house_deposit_target numeric(12, 2) not null default 45000,
  emergency_fund_target numeric(12, 2) not null default 10000,
  weekly_training_target integer not null default 4,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  log_date date not null,
  weight_kg numeric(5, 2),
  mood integer not null check (mood between 1 and 10),
  sleep_hours numeric(4, 1) not null default 0,
  calories integer not null default 0,
  protein integer not null default 0,
  water_litres numeric(4, 1) not null default 0,
  steps integer not null default 0,
  gym boolean not null default false,
  football boolean not null default false,
  mobility boolean not null default false,
  money_spent numeric(10, 2) not null default 0,
  unnecessary_spending boolean not null default false,
  sales_activity integer not null default 0,
  time_with_family boolean not null default false,
  notes text not null default '',
  bad_day boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, log_date)
);

create table if not exists public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  week_start date not null,
  went_well text not null default '',
  didnt text not null default '',
  learned text not null default '',
  next_focus text not null default '',
  generated_summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);

do $$
begin
  if not exists (select 1 from pg_type where typname = 'workout_type') then
    create type public.workout_type as enum ('gym', 'pitch', 'sprint', 'conditioning', 'mobility');
  end if;
end $$;

create table if not exists public.workout_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  session_date date not null,
  type public.workout_type not null,
  bodyweight_kg numeric(5, 2),
  bench_kg numeric(6, 2),
  squat_kg numeric(6, 2),
  deadlift_kg numeric(6, 2),
  session_rating integer check (session_rating between 1 and 10),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.finance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  snapshot_date date not null,
  current_savings numeric(12, 2) not null default 0,
  mortgage_fund numeric(12, 2) not null default 0,
  emergency_fund numeric(12, 2) not null default 0,
  investments numeric(12, 2) not null default 0,
  monthly_spending numeric(12, 2) not null default 0,
  monthly_income numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, snapshot_date)
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  sales_date date not null,
  cars_sold integer not null default 0,
  appointments integer not null default 0,
  calls integer not null default 0,
  finance_conversions integer not null default 0,
  commission_estimate numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, sales_date)
);

create table if not exists public.integration_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  provider text not null check (provider in ('garmin', 'myfitnesspal', 'bank_feed', 'calendar', 'push', 'voice_coach', 'apple_watch')),
  status text not null default 'planned',
  external_account_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    updated_at = now();

  insert into public.settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

drop trigger if exists set_users_updated_at on public.users;
drop trigger if exists set_settings_updated_at on public.settings;
drop trigger if exists set_daily_logs_updated_at on public.daily_logs;
drop trigger if exists set_weekly_reviews_updated_at on public.weekly_reviews;
drop trigger if exists set_workout_history_updated_at on public.workout_history;
drop trigger if exists set_finance_updated_at on public.finance;
drop trigger if exists set_sales_updated_at on public.sales;
drop trigger if exists set_integration_connections_updated_at on public.integration_connections;

create trigger set_users_updated_at before update on public.users for each row execute function public.set_updated_at();
create trigger set_settings_updated_at before update on public.settings for each row execute function public.set_updated_at();
create trigger set_daily_logs_updated_at before update on public.daily_logs for each row execute function public.set_updated_at();
create trigger set_weekly_reviews_updated_at before update on public.weekly_reviews for each row execute function public.set_updated_at();
create trigger set_workout_history_updated_at before update on public.workout_history for each row execute function public.set_updated_at();
create trigger set_finance_updated_at before update on public.finance for each row execute function public.set_updated_at();
create trigger set_sales_updated_at before update on public.sales for each row execute function public.set_updated_at();
create trigger set_integration_connections_updated_at before update on public.integration_connections for each row execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.settings enable row level security;
alter table public.daily_logs enable row level security;
alter table public.weekly_reviews enable row level security;
alter table public.workout_history enable row level security;
alter table public.finance enable row level security;
alter table public.sales enable row level security;
alter table public.integration_connections enable row level security;

drop policy if exists "Users can read themselves" on public.users;
drop policy if exists "Users can update themselves" on public.users;
drop policy if exists "Settings are owned" on public.settings;
drop policy if exists "Daily logs are owned" on public.daily_logs;
drop policy if exists "Weekly reviews are owned" on public.weekly_reviews;
drop policy if exists "Workout history is owned" on public.workout_history;
drop policy if exists "Finance is owned" on public.finance;
drop policy if exists "Sales are owned" on public.sales;
drop policy if exists "Integrations are owned" on public.integration_connections;

create policy "Users can read themselves" on public.users for select using (id = auth.uid());
create policy "Users can update themselves" on public.users for update using (id = auth.uid()) with check (id = auth.uid());

create policy "Settings are owned" on public.settings for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Daily logs are owned" on public.daily_logs for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Weekly reviews are owned" on public.weekly_reviews for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Workout history is owned" on public.workout_history for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Finance is owned" on public.finance for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Sales are owned" on public.sales for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Integrations are owned" on public.integration_connections for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create index if not exists daily_logs_user_date_idx on public.daily_logs (user_id, log_date desc);
create index if not exists weekly_reviews_user_week_idx on public.weekly_reviews (user_id, week_start desc);
create index if not exists workout_history_user_date_idx on public.workout_history (user_id, session_date desc);
create index if not exists finance_user_date_idx on public.finance (user_id, snapshot_date desc);
create index if not exists sales_user_date_idx on public.sales (user_id, sales_date desc);
