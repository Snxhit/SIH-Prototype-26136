-- ============================================================================
-- SIH 2026 · Problem Statement 26136 · Startup-Friendly Public Procurement
-- Maharastra Regional Demo Seed
-- ----------------------------------------------------------------------------
-- Safe, idempotent. Run this in the Supabase SQL Editor (or `supabase db push`).
-- Idempotent: re-running will not duplicate rows or blow up on existing objects.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Schema (create-if-missing, matching the AGENTS.md relational blueprint)
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";

-- profiles.id references auth.users (per blueprint). Rows are only created via
-- Supabase Auth; the demo pilot rows below therefore leave startup_id NULL.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  organization_name text not null,
  role text not null check (role in ('department', 'startup', 'evaluator')),
  created_at timestamptz not null default now()
);

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department_name text not null,
  description text not null,
  target_metrics text not null,
  budget_allocation numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists public.pilots (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references public.challenges (id),
  startup_id uuid references public.profiles (id),
  status text not null default 'active' check (status in ('active', 'completed', 'scaled_up')),
  current_milestone integer not null default 1,
  total_milestones integer not null default 3,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. Row Level Security (open for the demo so the publishable key can operate)
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.challenges enable row level security;
alter table public.pilots enable row level security;

drop policy if exists "demo_all_profiles" on public.profiles;
create policy "demo_all_profiles" on public.profiles for all using (true) with check (true);

drop policy if exists "demo_all_challenges" on public.challenges;
create policy "demo_all_challenges" on public.challenges for all using (true) with check (true);

drop policy if exists "demo_all_pilots" on public.pilots;
create policy "demo_all_pilots" on public.pilots for all using (true) with check (true);

-- ---------------------------------------------------------------------------
-- 3. Realtime (powers the Phase 3 cross-view auto-refresh listeners)
-- ---------------------------------------------------------------------------

do $$
begin
  alter publication supabase_realtime add table public.challenges, public.pilots;
exception
  when duplicate_object then null;
end
$$;

-- ---------------------------------------------------------------------------
-- 4. Maharashtra regional challenge seeds
-- ---------------------------------------------------------------------------

insert into public.challenges (title, department_name, description, target_metrics, budget_allocation)
select v.title, v.department_name, v.description, v.target_metrics, v.budget_allocation
from (values
  (
    'AI-Driven Land Record Dispute Prediction',
    'Revenue & Land Records',
    'Automate detection of latent disputes in digitised land records and flag high-risk parcels before they escalate into litigation.',
    '95% dispute identification rate',
    25000000
  ),
  (
    'Smart Public Grievance Triage',
    'Urban Development',
    'Classify and route citizen grievances to the correct civic department with recommended response actions in real time.',
    '40% reduction in resolution turnaround',
    18500000
  ),
  (
    'Crop Price Forecast & Procurement Optimisation',
    'Agricultural Marketing',
    'Forecast mandi prices using market, weather and export signals to guide procurement scheduling and MSP planning.',
    '88% forecast accuracy over 45 days',
    32000000
  ),
  (
    'Real-Time Bus Pothole & Road Health Mapping',
    'Public Works (PWD)',
    'Use mounted camera feeds and telemetry from state transport buses to map road damage continuously across highways.',
    '90% severe-crack detection within 24 hours',
    45000000
  ),
  (
    'Smart Cold Storage & Post-Harvest Loss Monitor',
    'Department of Agriculture',
    'IoT-linked monitoring of humidity and temperature to prevent post-harvest spoilage across state warehousing.',
    '25% reduction in storage spoilage',
    22000000
  ),
  (
    'Predictive Water-Supply Piped-Network Leak Detection',
    'Water Supply & Sanitation',
    'Detect and localise leaks in urban piped networks using flow/pressure telemetry and ML anomaly detection.',
    '60% faster leak localisation',
    38000000
  )
) as v(title, department_name, description, target_metrics, budget_allocation)
where not exists (
  select 1 from public.challenges c where c.title = v.title
);

-- ---------------------------------------------------------------------------
-- 5. Demo pilots (startup_id = NULL because profiles live behind auth.users)
-- ---------------------------------------------------------------------------

insert into public.pilots (challenge_id, status, current_milestone, total_milestones)
select c.id, 'active', 1, 3
from public.challenges c
where c.title = 'AI-Driven Land Record Dispute Prediction'
  and not exists (
    select 1 from public.pilots p where p.challenge_id = c.id
  );

insert into public.pilots (challenge_id, status, current_milestone, total_milestones)
select c.id, 'active', 3, 3
from public.challenges c
where c.title = 'Smart Public Grievance Triage'
  and not exists (
    select 1 from public.pilots p where p.challenge_id = c.id
  );

-- ============================================================================
-- Done. You can now run `npm run dev` and open http://localhost:3000/dashboard
-- ============================================================================
