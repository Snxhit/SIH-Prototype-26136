-- ============================================================================
-- SIH 2026 · Problem Statement 26136 · Startup-Friendly Public Procurement
-- Maharastra Regional Demo Seed · GOVINNOVATE-OS BACKEND (PHASE 5)
-- ----------------------------------------------------------------------------
-- CLEAN FROM-SCRATCH SEED. Drops & recreates all Phase 5 objects so it works
-- on a wiped database (no reliance on pre-existing tables or migration guards).
-- Safe to run on a fresh DB, or after wiping the public schema.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. Clean slate (safe on a demo DB; all data here is re-seeded below)
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- Drop tables FIRST (cascades away their triggers automatically). The
-- dependent SQL function bodies can be dropped afterwards by name.
-- Drop tables FIRST. CASCADE removes dependents (triggers, and any functions
-- that reference the dropped row types) so this works from ANY prior state:
-- fully intact DB, partial crash, or already-wiped. All data is re-seeded.
drop table if exists public.escrow_transactions cascade;
drop table if exists public.evaluations cascade;
drop table if exists public.templates cascade;
drop table if exists public.pilots cascade;
drop table if exists public.challenges cascade;
drop table if exists public.profiles cascade;

-- Drop any remaining functions (safe no-op if CASCADE already removed them).
drop function if exists public.compute_weighted_score();
drop function if exists public.get_escrow_vault_balance();
drop function if exists public.advance_milestone(uuid);

-- ---------------------------------------------------------------------------
-- 1. Schema (7 tables, per the AGENTS.md relational blueprint)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  organization_name text not null,
  role text not null check (role in ('department', 'startup', 'evaluator')),
  created_at timestamptz not null default now()
);

create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department_name text not null,
  description text not null,
  target_metrics text not null,
  budget_allocation numeric not null,
  sandbox_template text not null default 'Geofenced Urban Zone'
    check (sandbox_template in ('Geofenced Urban Zone', 'Synthetic Data Testbed', 'Shadow Telemetry Mode')),
  created_at timestamptz not null default now()
);

create table public.pilots (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references public.challenges (id),
  startup_id uuid references public.profiles (id),
  status text not null default 'active' check (status in ('active', 'completed', 'scaled_up')),
  current_milestone integer not null default 1,
  total_milestones integer not null default 4,
  tranche_amount numeric not null default 0,
  environment text not null default 'Geofenced 5km Urban Zone',
  data_privacy text not null default 'Anonymized PII + Edge Ingestion',
  stop_loss text not null default 'Max 5.0% False Positive Tolerance',
  ip_retainment text not null default '100% Retained by Startup',
  audit_score numeric not null default 0,
  created_at timestamptz not null default now()
);

create table public.templates (
  id uuid primary key default gen_random_uuid(),
  template_key text not null unique
    check (template_key in ('problem_statement', 'evaluation_criteria', 'pilot_agreement', 'ip_data_clause', 'cybersecurity_risk', 'procurement_scaleup')),
  doc_id text not null,
  title text not null,
  filename text not null,
  hash text not null,
  labels jsonb not null,
  default_values jsonb not null,
  body_template text not null,
  created_at timestamptz not null default now()
);

create table public.evaluations (
  id uuid primary key default gen_random_uuid(),
  pilot_id uuid not null unique references public.pilots (id) on delete cascade,
  technical_merit integer not null default 95 check (technical_merit between 50 and 100),
  kpi_accuracy integer not null default 92 check (kpi_accuracy between 50 and 100),
  cybersecurity integer not null default 98 check (cybersecurity between 50 and 100),
  scalability integer not null default 88 check (scalability between 50 and 100),
  dpiit_recognition integer not null default 100 check (dpiit_recognition = 100),
  weighted_score numeric not null default 0,
  is_approved boolean not null default false,
  evaluator_notes text not null default '',
  evaluated_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.escrow_transactions (
  id uuid primary key default gen_random_uuid(),
  pilot_id uuid references public.pilots (id) on delete cascade,
  amount numeric not null,
  tx_hash text not null,
  status text not null default 'disbursed' check (status in ('pending', 'disbursed', 'failed')),
  disbursed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. SQL Functions & Triggers
-- ---------------------------------------------------------------------------

create function public.compute_weighted_score()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.weighted_score := round(
    (new.technical_merit * 0.30 +
     new.kpi_accuracy * 0.25 +
     new.cybersecurity * 0.20 +
     new.scalability * 0.15 +
     new.dpiit_recognition * 0.10)::numeric,
    1
  );
  new.is_approved := new.weighted_score >= 85.0;
  new.evaluated_at := now();
  return new;
end;
$$;

create trigger trg_compute_weighted_score
  before insert or update on public.evaluations
  for each row execute function public.compute_weighted_score();

create function public.get_escrow_vault_balance()
returns numeric
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(sum(p.tranche_amount), 0) - coalesce(sum(t.amount), 0)
  from public.pilots p
  left join public.escrow_transactions t on t.pilot_id = p.id and t.status = 'disbursed';
$$;

create function public.advance_milestone(p_pilot_id uuid)
returns public.pilots
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  target public.pilots;
begin
  update public.pilots
  set current_milestone = least(current_milestone + 1, total_milestones),
      status = case
        when current_milestone + 1 >= total_milestones then 'completed'
        else status
      end
  where id = p_pilot_id
  returning * into target;

  return target;
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Row Level Security (open demo policies)
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.challenges enable row level security;
alter table public.pilots enable row level security;
alter table public.templates enable row level security;
alter table public.evaluations enable row level security;
alter table public.escrow_transactions enable row level security;

create policy "demo_all_profiles" on public.profiles for all using (true) with check (true);
create policy "demo_all_challenges" on public.challenges for all using (true) with check (true);
create policy "demo_all_pilots" on public.pilots for all using (true) with check (true);
create policy "demo_all_templates" on public.templates for all using (true) with check (true);
create policy "demo_all_evaluations" on public.evaluations for all using (true) with check (true);
create policy "demo_all_escrow_transactions" on public.escrow_transactions for all using (true) with check (true);

-- ---------------------------------------------------------------------------
-- 4. Realtime
-- ---------------------------------------------------------------------------
do $$
begin
  alter publication supabase_realtime add table public.challenges, public.pilots, public.templates, public.evaluations, public.escrow_transactions;
exception
  when duplicate_object then null;
end
$$;

-- ---------------------------------------------------------------------------
-- 5. Challenges
-- ---------------------------------------------------------------------------

insert into public.challenges (title, department_name, description, target_metrics, budget_allocation, sandbox_template) values
  ('AI-Driven Land Record Dispute Prediction', 'Revenue & Land Records',
   'Automate detection of latent disputes in digitised land records and flag high-risk parcels before they escalate into litigation.',
   '95% dispute identification rate', 25000000, 'Geofenced Urban Zone'),
  ('Smart Public Grievance Triage', 'Urban Development',
   'Classify and route citizen grievances to the correct civic department with recommended response actions in real time.',
   '40% reduction in resolution turnaround', 18500000, 'Synthetic Data Testbed'),
  ('Crop Price Forecast & Procurement Optimisation', 'Agricultural Marketing',
   'Forecast mandi prices using market, weather and export signals to guide procurement scheduling and MSP planning.',
   '88% forecast accuracy over 45 days', 32000000, 'Synthetic Data Testbed'),
  ('Real-Time Bus Pothole & Road Health Mapping', 'Public Works (PWD)',
   'Use mounted camera feeds and telemetry from state transport buses to map road damage continuously across highways.',
   '90% severe-crack detection within 24 hours', 45000000, 'Shadow Telemetry Mode'),
  ('Smart Cold Storage & Post-Harvest Loss Monitor', 'Department of Agriculture',
   'IoT-linked monitoring of humidity and temperature to prevent post-harvest spoilage across state warehousing.',
   '25% reduction in storage spoilage', 22000000, 'Shadow Telemetry Mode'),
  ('Predictive Water-Supply Piped-Network Leak Detection', 'Water Supply & Sanitation',
   'Detect and localise leaks in urban piped networks using flow/pressure telemetry and ML anomaly detection.',
   '60% faster leak localisation', 38000000, 'Geofenced Urban Zone');

-- ---------------------------------------------------------------------------
-- 6. Pilots (incl. sandbox isolation params + escrow tranche)
-- ---------------------------------------------------------------------------

insert into public.pilots (challenge_id, status, current_milestone, total_milestones, tranche_amount, environment, data_privacy, stop_loss, ip_retainment)
select c.id, 'active', 1, 4, 1250000, 'Geofenced 5km Urban Zone', 'Anonymized PII + Edge Ingestion', 'Max 5.0% False Positive Tolerance', '100% Retained by Startup'
from public.challenges c where c.title = 'AI-Driven Land Record Dispute Prediction';

insert into public.pilots (challenge_id, status, current_milestone, total_milestones, tranche_amount, environment, data_privacy, stop_loss, ip_retainment)
select c.id, 'active', 3, 4, 2500000, 'Synthetic Data Testbed', '100% Synthetic Dummy Datasets', 'Max 2.0% Anomaly Deviation', '100% Retained by Startup'
from public.challenges c where c.title = 'Smart Public Grievance Triage';

-- ---------------------------------------------------------------------------
-- 7. Templates (6 pre-vetted legal docs, parameterized {{p1}}/{{p2}}/{{p3}})
-- ---------------------------------------------------------------------------

insert into public.templates (template_key, doc_id, title, filename, hash, labels, default_values, body_template) values
('problem_statement', 'STD-GFR-TPL-01', 'Outcome Problem Statement', 'STD-GFR-TPL-01_Problem_Statement.md', '0x8f7a...39b1',
 '["Department Authority", "Target Measurable KPI", "Sandbox Trial Scope"]'::jsonb,
 '["Water Supply & Sanitation Department, GoM", "Real-time acoustic detection of leaks >0.5 LPM with >95% accuracy in 48h", "5 km municipal distribution pipeline across 60 calendar days"]'::jsonb,
 $$STANDARD GOVERNMENT CHALLENGE IDENTIFICATION & OUTCOME FORMULATION TEMPLATE
Issued under Public Procurement (Preference to Make in India) & GFR Rule 173(i)
1. COMMISSIONING PUBLIC AUTHORITY: {{p1}}
2. OPERATIONAL PROBLEM DEFINITION: Invites functional tech solutions around measurable operational benchmarks.
3. MANDATORY PERFORMANCE TARGET: "{{p2}}", verified via continuous edge telemetry.
4. CONTROLLED SANDBOX PARAMETERS: Testbed Scope {{p3}}.
5. ELIGIBILITY & WAIVERS: DPIIT startups 100% waiver on prior turnover/experience; EMD exempted under GFR 170(i).
Signed by Designated Department Procurement Cell.$$),

('evaluation_criteria', 'STD-GFR-TPL-02', 'QCBS Evaluation Rubric', 'STD-GFR-TPL-02_QCBS_Rubric.md', '0x1b4c...98e4',
 '["Minimum Scale Threshold", "Evaluation Model", "TRL Benchmark"]'::jsonb,
 '["85.0% Weighted Aggregate Score", "QCBS 80:20 (Technical Merit to Commercial Viability)", "TRL 6 to TRL 8 (Validated Prototype / Operational Demonstration)"]'::jsonb,
 $$STANDARD EVALUATION CRITERIA & SCORING MATRIX (INNOVATION PROCUREMENT)
Compliant with CVC Guidelines & Central Vigilance Commission Manual
1. EVALUATION METHODOLOGY: Model {{p2}}; Minimum Readiness {{p3}}.
2. WEIGHTED SCORING MATRIX (100%): Pillar1 Technical Merit 30% | Pillar2 KPI Accuracy 25% |
   Pillar3 Cybersecurity 20% | Pillar4 Multi-District Scalability 15% | Pillar5 DPIIT Validation 10%.
3. DIRECT SCALE-UP CLEARANCE: startups scoring >= {{p1}} certified for direct single-source procurement on GeM.$$),

('pilot_agreement', 'STD-GFR-TPL-03', 'Sandbox Pilot Agreement', 'STD-GFR-TPL-03_Sandbox_Agreement.md', '0x3c2d...77a9',
 '["Department Authority", "Startup Entity Name", "Escrow Allocation"]'::jsonb,
 '["Department of Urban Development, Government of Maharashtra", "HydroSense DeepTech Innovations Private Limited", "Rs 38,00,000 locked in Smart Escrow"]'::jsonb,
 $$TRIPARTITE SANDBOX PILOT AGREEMENT FOR INNOVATION PROCUREMENT
Between Commissioning Department, Startup Provider & Escrow Trustee
PARTIES: 1. {{p1}} (Department) 2. {{p2}} (Startup) 3. Smart Escrow Trustee.
1. COMMITTED ESCROW FUNDING: {{p3}} held in escrow, released on verified milestone sign-off.
2. MILESTONE TRANCHES: Tranche1 30% lab calibration | Tranche2 40% live field deployment | Tranche3 30% audit & scale-up.
3. DISBURSEMENT: verified telemetry triggers direct payment within 48 hours.$$),

('ip_data_clause', 'STD-GFR-TPL-04', 'IP Retainment & Data Clause', 'STD-GFR-TPL-04_IP_Data_Retainment.md', '0x4e5f...12c8',
 '["Startup Entity Name", "Licensed Government Usage", "Cloud Region"]'::jsonb,
 '["HydroSense DeepTech Innovations Private Limited", "Non-Exclusive, Royalty-Free Internal Administrative License", "MeitY-Empanelled Data Centers (Mumbai / Pune Region, India)"]'::jsonb,
 $$STANDARD INTELLECTUAL PROPERTY & CITIZEN DATA PROTECTION FRAMEWORK (NDGFP)
1. IP OWNERSHIP: code, weights, firmware & patents developed by {{p1}} remain SOLE property of the Startup.
2. GOV USAGE: Department receives {{p2}} for internal municipal operations only.
3. DATA LOCALIZATION: all data must reside in {{p3}}; zero cross-border transfer; PII SHA-256 masked before ML ingestion.$$),

('cybersecurity_risk', 'STD-GFR-TPL-05', 'Cybersecurity & Risk Protocols', 'STD-GFR-TPL-05_Cybersecurity_Risk.md', '0x6a7b...88f3',
 '["Risk Stop-Loss Limit", "CERT-In Audit Standard", "Rollback Mechanism"]'::jsonb,
 '["Max 5.0% System Anomaly Deviation", "CERT-In Empanelled Information Security Audit", "Immediate Automated Failover to Legacy Manual Operations"]'::jsonb,
 $$STANDARD CYBERSECURITY & OPERATIONAL RISK MITIGATION PROTOCOL
1. RISK ISOLATION: sandbox isolated with zero write-access to core SCADA systems.
2. STOP-LOSS: ceiling {{p1}}; on breach trigger {{p3}}.
3. CERTIFICATION: cloud architecture must satisfy {{p2}}; TLS 1.3 + AES-256; VAPT clearance before Phase 2.$$),

('procurement_scaleup', 'STD-GFR-TPL-06', 'Direct GeM Scale-Up Pathway', 'STD-GFR-TPL-06_GeM_Scaleup_Conversion.md', '0x7c8d...44e1',
 '["Qualifying Audit Score", "Scale Horizon", "Procurement Mode"]'::jsonb,
 '["Score >= 85.0% on Independent QCBS Matrix", "State-wide rollout across 80 Urban Local Bodies (ULBs)", "Direct Purchase under GeM Innovation Category / GFR Rule 194"]'::jsonb,
 $$STANDARD CONVERSION CERTIFICATE: SANDBOX PILOT TO COMMERCIAL SCALE-UP
Legal Pathway for Direct Procurement without Re-Tendering (GFR 2017)
2. SCALE-UP BENCHMARK: verified {{p1}} certifies the solution as PROVEN INNOVATIVE TECHNOLOGY.
3. SINGLE-SOURCE JUSTIFICATION: re-tendering waived; horizon {{p2}}; mode {{p3}}.
4. PRICING: locked to sandbox unit economics with mandatory 15% volume discount for state-wide scale-up.$$);

-- ---------------------------------------------------------------------------
-- 8. Evaluations (weighted_score + is_approved auto-set by trigger)
-- ---------------------------------------------------------------------------

insert into public.evaluations (pilot_id, technical_merit, kpi_accuracy, cybersecurity, scalability, dpiit_recognition, evaluator_notes)
select p.id, 95, 92, 98, 88, 100, 'Strong sandbox isolation and outcome match; site validation pending.'
from public.pilots p join public.challenges c on c.id = p.challenge_id
where c.title = 'AI-Driven Land Record Dispute Prediction';

insert into public.evaluations (pilot_id, technical_merit, kpi_accuracy, cybersecurity, scalability, dpiit_recognition, evaluator_notes)
select p.id, 94, 92, 96, 92, 100, 'High accuracy on anonymised dataset; recommended for GeM scale-up.'
from public.pilots p join public.challenges c on c.id = p.challenge_id
where c.title = 'Smart Public Grievance Triage';

-- ---------------------------------------------------------------------------
-- 9. Escrow transactions (disbursed payouts)
-- ---------------------------------------------------------------------------

insert into public.escrow_transactions (pilot_id, amount, tx_hash, status)
select p.id, 2500000, '0x1b4c...98e4', 'disbursed'
from public.pilots p join public.challenges c on c.id = p.challenge_id
where c.title = 'Smart Public Grievance Triage';

-- ============================================================================
-- Done. Verify: select public.get_escrow_vault_balance();  -> 1,250,000
-- ============================================================================
