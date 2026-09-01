<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 🏛️ SIH 2026 HIGH-VELOCITY VIBECODING COMPANION
# PROBLEM STATEMENT ID: 26136 | CATEGORY: SMART AUTOMATION
# THEME: STARTUP-FRIENDLY PUBLIC PROCUREMENT PORTAL

## 🎯 1. ARCHITECTURAL CORE & STACK DEFINITION
- **Framework:** Next.js 14/15 (App Router Architecture, Strict TypeScript, Concurrent Features).
- **Styling UI:** Tailwind CSS, PostCSS, Framer Motion (for smooth micro-interactions).
- **Component Primitives:** Radix UI via `shadcn/ui` custom CLI installations.
- **Database Engine:** Hosted Supabase (PostgreSQL) leveraging direct client invocations.
- **State Architecture:** React Context for active persona switching, combined with local state wrappers for inline table filterings.

## ⚠️ 2. AI OPERATIONAL CONSTRAINTS (TOKEN PRESERVATION MANDATES)
- **Code Pruning:** NEVER generate redundant import blocks or duplicate layout components. If a file is modified, output ONLY the specific target functions or use the `// ... existing codebase constraints ...` marker explicitly.
- **Client/Server Isolation:** Explicitly tag all interactive dashboards with `"use client"` at line 1. Keep data access layers separated.
- **Strict Schema Enforcement:** Do NOT hallucinate database columns, foreign keys, or table relations. Strictly follow the blueprint provided in Section 3.
- **Defensive Layouts:** All UI panels must look professional out-of-the-box. Utilize clean cards, explicit table headers, spacing utilities (`space-y-6`), and semantic HTML elements. Do not emit plain unstyled text blocks.

## 🔍 3. GAP ANALYSIS: GOVINNOVATE-OS vs CURRENT PROJECT

### Features present in `govinnovate-os/` but MISSING from the Next.js app:

| Feature | GovInnovate-OS | Current Project | Priority |
|---------|---------------|-----------------|----------|
| **Templates View** — 6 pre-vetted legal/operational templates (Problem Statement, QCBS Rubric, Pilot Agreement, IP/Data Clause, Cybersecurity Risk, GeM Scale-Up) with live document editor, copy/export, and parameterized generation | Full implementation (6 templates, editor, copy, download, apply-to-department) | Not implemented at all | HIGH |
| **Sandbox Studio** — Controlled sandbox configuration: environment isolation scope, data access/security protocols, risk thresholds/stop-loss, per-pilot sandbox table | Full implementation (3 config pillars, active sandbox table, lock & deploy) | Not implemented | HIGH |
| **QCBS Evaluation Rubric Modal** — 5-pillar weighted scoring (Technical 30%, KPI 25%, Cyber 20%, Scalability 15%, DPIIT 10%) with interactive sliders, real-time aggregate calculation | Full implementation (modal with 4 slider inputs, auto-calculation, approve flow) | Basic approve button only, no weighted scoring | HIGH |
| **Smart Escrow Financial Ledger** — Side drawer with vault balance, automated payout trail, transaction history with hashes | Full implementation (drawer modal, balance display, tx list) | Not implemented | HIGH |
| **Escrow Balance in Nav** — Live escrow vault balance in the header navigation | Implemented | Not implemented | MEDIUM |
| **Sandbox Config on Challenges** — Department form includes sandbox template selection (Geofenced/Synthetic/Shadow) and escrow budget | Implemented (sandbox template dropdown, escrow budget field) | Only basic budget field, no sandbox template | MEDIUM |
| **DPIIT Verification Badge** — "DPIIT Verified Entity · DIPP-XXXXX" badge with GFR 173(i) waiver mention | Implemented | Basic badge only, no DIPP number | LOW |
| **Judge Demo Auto-Simulation** — 1-click automated demo that cycles through evaluator → approval → escrow drawer | Implemented | Not implemented | MEDIUM |
| **1-Click Apply with GFR Reference** — Apply button shows "Applied (GFR 173(i) Exempted)" state | Implemented | Basic apply button, no GFR reference | LOW |
| **Milestone Telemetry Submit** — "Submit Milestone Evidence Feed" button that notifies evaluator committee | Implemented | Basic "Submit Milestone" button | LOW |
| **Sandbox Table Columns** — Per-pilot: environment, data privacy, stop-loss, IP retainment, sandbox state | Implemented (table with all columns) | Not implemented | MEDIUM |

### Features present in current project but NOT in GovInnovate-OS:
- Government Order PDF generation (jsPDF) — already implemented, keep.
- Supabase Realtime + polling sync — already implemented, keep.
- Mock data fallback mode — already implemented, keep.

## 🗄️ 4. RELATIONAL DATABASE BLUEPRINT (SUPABASE POSTGRESQL)

> **IMPORTANT:** Schema is EXTENDED from the original 3-table design. New tables support templates, sandbox configs, evaluations, and escrow. Existing tables gain new columns. All changes are additive and backward-compatible.

### Table: `profiles` (unchanged)
- `id` (uuid, primary key, references auth.users)
- `organization_name` (text, non-nullable)
- `role` (text, check constraint: 'department' | 'startup' | 'evaluator')
- `created_at` (timestamp with time zone, default: now())

### Table: `challenges` (extended)
- `id` (uuid, primary key, default: gen_random_uuid())
- `title` (text, non-nullable)
- `department_name` (text, non-nullable)
- `description` (text, non-nullable)
- `target_metrics` (text, non-nullable) -> E.g., "Achieve 95% identification rate"
- `budget_allocation` (numeric, non-nullable)
- `sandbox_template` (text, default: 'Geofenced Urban Zone') -> 'Geofenced Urban Zone' | 'Synthetic Data Testbed' | 'Shadow Telemetry Mode'
- `created_at` (timestamp with time zone, default: now())

### Table: `pilots` (extended)
- `id` (uuid, primary key, default: gen_random_uuid())
- `challenge_id` (uuid, foreign key references challenges.id)
- `startup_id` (uuid, foreign key references profiles.id)
- `status` (text, check constraint: 'active' | 'completed' | 'scaled_up', default: 'active')
- `current_milestone` (integer, default: 1)
- `total_milestones` (integer, default: 4)
- `tranche_amount` (numeric, default: 0) -> Escrow tranche guaranteed for this pilot
- `environment` (text, default: 'Geofenced 5km Urban Zone') -> Sandbox environment type
- `data_privacy` (text, default: 'Anonymized PII + Edge Ingestion') -> Data access protocol
- `stop_loss` (text, default: 'Max 5.0% False Positive Tolerance') -> Risk threshold
- `ip_retainment` (text, default: '100% Retained by Startup') -> IP rights clause
- `audit_score` (numeric, default: 0) -> QCBS weighted aggregate score
- `created_at` (timestamp with time zone, default: now())

### Table: `templates` (NEW)
- `id` (uuid, primary key, default: gen_random_uuid())
- `template_key` (text, unique, non-nullable) -> 'problem_statement' | 'evaluation_criteria' | 'pilot_agreement' | 'ip_data_clause' | 'cybersecurity_risk' | 'procurement_scaleup'
- `doc_id` (text, non-nullable) -> E.g., 'STD-GFR-TPL-01'
- `title` (text, non-nullable)
- `filename` (text, non-nullable) -> E.g., 'STD-GFR-TPL-01_Problem_Statement.md'
- `hash` (text, non-nullable) -> Digital document hash
- `labels` (jsonb, non-nullable) -> Array of 3 parameter labels
- `default_values` (jsonb, non-nullable) -> Array of 3 default parameter values
- `body_template` (text, non-nullable) -> The template string with {{p1}}, {{p2}}, {{p3}} placeholders
- `created_at` (timestamp with time zone, default: now())

### Table: `evaluations` (NEW)
- `id` (uuid, primary key, default: gen_random_uuid())
- `pilot_id` (uuid, foreign key references pilots.id, unique)
- `technical_merit` (integer, default: 95) -> Weight: 30%, range 50-100
- `kpi_accuracy` (integer, default: 92) -> Weight: 25%, range 50-100
- `cybersecurity` (integer, default: 98) -> Weight: 20%, range 50-100
- `scalability` (integer, default: 88) -> Weight: 15%, range 50-100
- `dpiit_recognition` (integer, default: 100) -> Weight: 10%, fixed at 100
- `weighted_score` (numeric, computed) -> (technical*0.30 + kpi*0.25 + cyber*0.20 + scale*0.15 + dpiit*0.10)
- `is_approved` (boolean, default: false) -> True when score >= 85.0
- `evaluator_notes` (text, default: '')
- `evaluated_at` (timestamp with time zone)
- `created_at` (timestamp with time zone, default: now())

### Table: `escrow_transactions` (NEW)
- `id` (uuid, primary key, default: gen_random_uuid())
- `pilot_id` (uuid, foreign key references pilots.id)
- `amount` (numeric, non-nullable) -> Payout amount in INR
- `tx_hash` (text, non-nullable) -> Simulated blockchain-style hash
- `status` (text, default: 'disbursed') -> 'pending' | 'disbursed' | 'failed'
- `disbursed_at` (timestamp with time zone, default: now())
- `created_at` (timestamp with time zone, default: now())

### SQL Functions (NEW)
- `compute_weighted_score()` — Trigger function to auto-calculate `evaluations.weighted_score` on INSERT/UPDATE.
- `get_escrow_vault_balance()` — Aggregate function returning total escrow pool minus total disbursed transactions.
- `advance_milestone(pilot_id uuid)` — RPC function that increments `current_milestone`, checks if completed, updates status.

## 🗺️ 5. PHASED EXECUTION TRACKER

### 🟥 PHASE 1: UNIFIED DEMO DASHBOARD SHELL
- [ ] Create `app/dashboard/page.tsx` as a single-entry mock interface.
- [ ] Integrate a global Persona Switcher bar (`tabs` or `select` native component).
- [ ] Render the Department Panel containing an outcome-form wizard template.
- [ ] Render the Startup Hub tracking view containing a step-by-step pipeline element.
- [ ] Render the Evaluator View complete with list tables and action buttons.
- [ ] Confirm all views switch gracefully using local React states.

### 🟨 PHASE 2: SUPABASE DATA-LAYER INTEGRATION
- [x] Establish Supabase Client initialization logic (`utils/supabase/client.ts`).
- [x] Replace state arrays with actual asynchronous `useEffect` fetches from Postgres.
- [x] Implement database write logic inside the Department "Publish Challenge" form.
- [x] Build the Startup "One-Click Apply" workflow writing rows into the `pilots` table.

### 🟩 PHASE 3: INTERACTIVE MILESTONE SIMULATOR ENGINE
- [x] Build click triggers inside the Startup workspace to increment `current_milestone`.
- [x] Wire status mutation transitions from `active` ➡️ `completed` once milestones top out.
- [x] Set up auto-refresh listeners or polling triggers to instantly update across views.

### 🟦 PHASE 4: REPO POLISH & PDF PROCUREMENT GENERATION
- [x] Inject `jspdf` into the Evaluator pane's "Approve Scale-Up" pipeline execution.
- [x] Output a crisp, dynamically rendered official Government Order text format.
- [x] Run final schema seeds for Maharashtra Government regional demo presentation.
- [x] Push to Production via GitHub on Vercel.

---

## 🔧 BACKEND IMPLEMENTATION PHASES (govinnovate-os feature parity)

> These phases build the missing Supabase backend tables, SQL functions, and API routes
> required to support the Templates, Sandbox Studio, QCBS Evaluation, and Escrow features.

### 🟪 PHASE 5: DATABASE SCHEMA EXTENSION
**Goal:** Extend the existing 3-table schema to 7 tables + 3 SQL functions. All changes are additive, backward-compatible with existing dashboard.

- [x] 5.1 Add `sandbox_template` column to `challenges` table (text, default 'Geofenced Urban Zone').
- [x] 5.2 Add `tranche_amount`, `environment`, `data_privacy`, `stop_loss`, `ip_retainment`, `audit_score` columns to `pilots` table.
- [x] 5.3 Update `pilots.total_milestones` default from 3 to 4.
- [x] 5.4 Create `templates` table with all columns per blueprint.
- [x] 5.5 Create `evaluations` table with all columns per blueprint.
- [x] 5.6 Create `escrow_transactions` table with all columns per blueprint.
- [x] 5.7 Write and test `compute_weighted_score()` trigger function (auto-compute on evaluations INSERT/UPDATE).
- [x] 5.8 Write and test `get_escrow_vault_balance()` aggregate function.
- [x] 5.9 Write and test `advance_milestone(pilot_id uuid)` RPC function.
- [x] 5.10 Update RLS policies for all new tables (demo open policies).
- [x] 5.11 Add new tables to `supabase_realtime` publication.
- [x] 5.12 Update `supabase/seed.sql` with all new table definitions.
- [x] 5.13 Update `utils/supabase/client.ts` Database type to match new schema.
- [x] 5.14 Seed `templates` table with all 6 template definitions from govinnovate-os.
- [x] 5.15 Seed 2 demo evaluations and 2 demo escrow transactions.

### 🟫 PHASE 6: TEMPLATES & LEGAL DOCUMENT BACKEND
**Goal:** Serve the 6 pre-vetted legal templates from Supabase with parameterized generation.

- [x] 6.1 Create `app/api/templates/route.ts` — GET all templates, GET single by key.
- [x] 6.2 Create `lib/templates.ts` — Template generation logic: takes (template_key, p1, p2, p3) and returns rendered document text.
- [x] 6.3 Create `components/templates/TemplateStudio.tsx` — Full templates view (selector + editor + parameter form + preview).
- [x] 6.4 Implement copy-to-clipboard and export-as-.md functionality.
- [x] 6.5 Implement "Use in New Challenge" — populates Department form with template parameters.
- [x] 6.6 Wire Templates tab into dashboard persona switcher.

### 🟧 PHASE 7: SANDBOX CONFIGURATION BACKEND
**Goal:** Persist sandbox isolation parameters per pilot, render the Sandbox Studio view.

- [x] 7.1 Create `app/api/sandbox/route.ts` — GET sandbox configs for all pilots, PUT update sandbox params.
- [x] 7.2 Create `components/sandbox/SandboxStudio.tsx` — 3-pillar config cards (Environment, Data Privacy, Risk/Stop-Loss).
- [x] 7.3 Create `components/sandbox/SandboxTable.tsx` — Active sandboxes table with all columns (environment, data_privacy, stop_loss, ip_retainment, sandbox_state).
- [x] 7.4 Implement "Lock & Deploy Parameters" — writes sandbox config to pilots table.
- [x] 7.5 Add sandbox_template dropdown to Department challenge form.
- [x] 7.6 Wire Sandbox tab into dashboard persona switcher.

### 🟥 PHASE 8: QCBS EVALUATION ENGINE BACKEND
**Goal:** Implement the 5-pillar weighted scoring rubric with real-time aggregate calculation.

- [x] 8.1 Create `app/api/evaluations/route.ts` — GET evaluation by pilot_id, POST create/update evaluation (upsert on `pilot_id`, trigger auto-computes `weighted_score`/`is_approved`, auto-scales pilot + inserts escrow payout exactly once).
- [x] 8.2 Create `components/evaluator/EvalRubricModal.tsx` — Modal with 4 slider inputs (Technical 30%, KPI 25%, Cyber 20%, Scalability 15%) + fixed DPIIT (10%) + real-time aggregate display; Confirm button flips between "Approve & Release Escrow" / "Record Evaluation" by threshold.
- [x] 8.3 Create `components/evaluator/EvaluatorPanelExtended.tsx` — Extended evaluator view with "Audit & Evaluate" opening the rubric modal per pilot (implemented inline as `EvaluatorPanel` in `app/dashboard/page.tsx`, which already hosted the evaluator view).
- [x] 8.4 Implement `confirmApproval()` — `submitEvaluation` in `useDashboard` writes the evaluation (API POST → direct client fallback), trigger auto-sets `is_approved` if score >= 85.0, the route auto-scales the pilot and triggers escrow payout; on approval `issueOrder` also emits the Government Order PDF.
- [x] 8.5 Display aggregate scores in evaluator table (replace "Pending" with actual weighted score + approved badge).
- [x] 8.6 Wire Evaluator tab update into dashboard persona switcher (QCBS column + Audit & Evaluate wired into the existing evaluator tab).

### 🟨 PHASE 9: ESCROW FINANCIAL LEDGER BACKEND
**Goal:** Smart escrow vault with automated payout transactions, side drawer, and nav balance.

- [x] 9.1 Create `app/api/escrow/route.ts` — GET all transactions, GET vault balance (calls `get_escrow_vault_balance()` RPC), POST create payout.
- [x] 9.2 Create `components/escrow/EscrowDrawer.tsx` — Side drawer modal: vault balance hero, disbursement coverage bar, transaction list with hashes/amounts/status.
- [x] 9.3 Add escrow vault balance to header nav bar (next to persona switcher) as an "Escrow Vault" button pill showing `compactCurrency`.
- [x] 9.4 Wire escrow payout creation into `confirmApproval()` — `submitEvaluation` + the `/api/evaluations` route already insert `escrow_transactions` with amount = pilot's `tranche_amount` + simulated tx_hash exactly once on approval (verified 9.4 in Phase 8).
- [x] 9.5 Auto-refresh escrow balance via Supabase Realtime on `escrow_transactions` changes (channel + 6s polling fallback).

### 🟩 PHASE 10: API ROUTES & INTEGRATION
**Goal:** Final integration pass — connect all frontend panels to new backend, update seeds, verify end-to-end flow.

- [x] 10.1 Update `supabase/seed.sql` with complete seeds: 6 templates, 2 pilots with sandbox configs, 2 evaluations, 2 escrow transactions (1 disbursed + 1 pending; vault remains ₹12,50,000).
- [x] 10.2 Add GFR 173(i) reference text to 1-Click Apply button state ("Applied · GFR 173(i) Exempted" / "One-Click Apply · GFR 173(i)").
- [x] 10.3 Add "Submit Milestone Evidence Feed" button that notifies evaluator (shared `evidenceFeed` state per pilot, reflected as a "Milestone evidence feed received" chip in the Evaluator panel).
- [x] 10.4 Add DPIIT verification badge with DIPP number display per pilot (deterministic `DIPP-XXXXX` derived from pilot id, no schema change).
- [x] 10.5 Implement Judge Demo auto-simulation (1-click cycles: evaluator → rubric modal → auto-approval → GO PDF → escrow drawer opens).
- [x] 10.6 Run `npm run build` and verify zero errors.
- [x] 10.7 Run `npm run lint` and fix any warnings.
- [ ] 10.8 Deploy to Vercel and verify all new features in browser.

### 🟨 PHASE 11: GFR-BRAND DARK UI RESTYLE (source: `govinnovate-os-1/`)
**Goal:** Restyle the dashboard to match the `govinnovate-os-1/` static prototype's visual identity — deep emerald dark theme with tech-orange accents and serif display type. Pure frontend pass; no database/feature changes.

**Design tokens (from govinnovate-os-1 tailwind config + style.css):**
- Palette: `emerald` bg `#0F5132`, dark `#0B3D26` (cards/drawers), borders `#166534`, lighter hover `#1E7E4A`; `techOrange` `#FF6B35` (primary CTAs, accents, active states), hover `#EA580C`, light `#FFA07A`.
- Text: crisp white `#FFFFFF`, muted slate `#E2E8F0`.
- Fonts: **Instrument Serif** (display/serif headlines), **Plus Jakarta Sans** (sans/body), **JetBrains Mono** (mono numbers, hashes, amounts).
- Shape: `rounded-2xl`/`rounded-3xl` cards, 1px `#166534` borders, orange focus rings on inputs, `#FF6B35`-on-translucent chips with `border-[#FF6B35]/30`.

- [x] 11.1 Replace Geist fonts in `app/layout.tsx` with Plus Jakarta Sans + JetBrains Mono + Instrument Serif (via next/font), force `dark` on `<html>`, update metadata title to "GovInnovate OS | Public Procurement & Sandbox Gateway".
- [x] 11.2 Remap shadcn theme vars in `app/globals.css` to the emerald-dark palette (bg `#0F5132`, card `#0B3D26`, border/input `#166534`, primary `#FF6B35`, muted `#E2E8F0`, ring `#FF6B35`, soft orange chart ramp, radius bumped to 0.85rem) in both `:root` and `.dark`; map `--font-sans/--font-mono/--font-serif` to the new next/font vars; add orange text selection.
- [x] 11.3 Dashboard (page.tsx): serif hero heading with orange-gradient italic emphasis (font-serif + `bg-clip-text`), `font-mono font-black` stat numbers in overview cards, Escrow Vault nav pill switched emerald → `#FF6B35`.
- [x] 11.4 EvalRubricModal: score values + DPIIT gate → `#FF6B35`, sliders `accent-[#FF6B35]`, aggregate panel restyled to `bg-[#FF6B35]/15 border-[#FF6B35]/30` with orange total.
- [x] 11.5 EscrowDrawer: vault balance hero + disbursed figure + coverage bar → orange accents, Landmark/status icons to brand colors; status chips keep semantic emerald/amber/rose.
- [x] 11.6 Validate with `npx tsc --noEmit`, `npm run lint`, `npm run build`; verify visuals locally (emerald-dark everywhere, orange primaries, serif headings, mono numbers).

### 🟠 PHASE 12: LANDING PAGE AT ORIGIN `/` (source: `govinnovate-os-1/`)
**Goal:** Serve a polished marketing landing page at the origin URL — the dashboard was on `/dashboard` precisely so `/` could host the brand-facing entry. Mirrors the `govinnovate-os-1/` landing (nav, orbital hero graphic, live ticker, stats, features, how-it-works, for-whom, footer). Pure frontend, server component; no DB/feature changes.

- [x] 12.1 Add the reference motion utilities to `app/globals.css` (`@theme` block: `animate-float-slow`, `animate-float-delayed`, `animate-spin-slow`, `animate-reverse-spin`, `animate-marquee` + keyframes; no JS/animation lib needed).
- [x] 12.2 Rewrite `app/page.tsx` as an emerald-dark landing: fixed blur nav with serif "GovInnovate OS" brand + gradient logo mark + orange Launch Platform CTA (links to `/dashboard`).
- [x] 12.3 Hero: split 2-col — serif headline "Where Government Meets Innovation." with italic gradient accent, pulse status chip, primary/secondary CTAs, 4 GFR pillars grid; animated orbital graphic (spinning rings, glowing core hub, 4 floating persona nodes) on the right.
- [x] 12.4 Live ticker (marquee), 4 stat cards, 6 feature cards, 5-step How It Works pipeline, For Government / For DPIIT Startups split cards, footer — all in brand palette (`#0F5132`/`#0B3D26`/`#166534` + `#FF6B35` accents, serif headlines, mono numbers, JetBrains/Mono chips).
- [x] 12.5 Validate with `npx tsc --noEmit`, `npm run lint`, `npm run build`; smoke-test `/` serves 200 with the landing HTML (leave dashboard untouched, 10.8 deploy still on hold).

## 🚀 DEPLOYMENT CONTEXT (added 2026-08-29)
- **Live URL:** https://sih-prototype-26136.vercel.app/dashboard (verified HTTP 200, serves dashboard)
- **Vercel team/scope:** `snxhits-projects-502fa58f` (`team_2BlNaAQsAnLE2Ku3j8ZzQvBF`), account `snxhit` (amitdgames@gmail.com). Project name: `sih-prototype-26136`.
- This is a **brand-new Vercel project** created via CLI. The original `.vercel.app` domain/project lived under a different account and was unreachable (Vercel edge 404 on every path) — it was abandoned.
- **Vercel CLI deploy (worked):** from repo root run `vercel --prod --yes` (project already linked). Auth: `VERCEL_TOKEN` account token.
- **Env vars set on Vercel (all envs):** `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (values in `.env.local`, gitignored). These are required — without them the Supabase URL is not inlined and the app silently runs in "Demo · Mock data" mode.
- **GitHub repo `Snxhit/SIH-Prototype-26136` is correct** (contains the app at root). CAUTION: the *local* `git` remote inside `sih-prototype-26136` points at the same GitHub URL but the local parent `/Users/snxhit/Projects` is a separate Cargo/`.lm` repo — do NOT push from the parent `Projects` folder; push only from within `sih-prototype-26136`.
- The dashboard's "Demo · Mock data" text in raw HTML is the pre-hydration shell; the "Live · Supabase" badge + data load client-side in a browser.
- **Supabase schema deployments:** `supabase/seed.sql` now holds ALL Phase 5 schema (7 tables + 3 SQL functions + RLS + realtime + seeds). It is a **destructive drop-and-recreate** script (`drop table if exists ... cascade`), so re-running it wipes and re-seeds every table. Apply it via the Supabase SQL Editor (the SQL Editor truncates very large pasted scripts — keep it compact). Keep RLS **enabled**: the script creates its own open `demo_all_*` policies, so disabling RLS breaks the demo. Standalone local validation: Postgres.app `/Applications/Postgres.app/Contents/Versions/latest/bin/psql` works if you stub `auth.users` + a `supabase_realtime` publication.
- The repo actually runs **Next.js 16.3.3 / React 19.2.8** (see `package.json`) — the AGENTS.md top banner still says "Next.js 14/15" and is stale.

