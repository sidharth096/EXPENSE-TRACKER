create extension if not exists "pgcrypto";

create table public.monthly_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month date not null,
  expected_income_paise bigint not null default 0 check (expected_income_paise >= 0),
  savings_target_paise bigint not null default 0 check (savings_target_paise >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, month)
);

create table public.fixed_bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  monthly_plan_id uuid not null references public.monthly_plans(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  amount_paise bigint not null check (amount_paise > 0),
  created_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('expense', 'income')),
  amount_paise bigint not null check (amount_paise > 0),
  category text not null,
  note text not null check (char_length(note) between 1 and 160),
  transaction_date date not null,
  created_at timestamptz not null default now()
);

create index transactions_user_date_idx on public.transactions (user_id, transaction_date desc);
create index fixed_bills_plan_idx on public.fixed_bills (monthly_plan_id);

alter table public.monthly_plans enable row level security;
alter table public.fixed_bills enable row level security;
alter table public.transactions enable row level security;

create policy "Users manage their monthly plans"
on public.monthly_plans for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their fixed bills"
on public.fixed_bills for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their transactions"
on public.transactions for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
