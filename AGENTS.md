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

## 🗄️ 3. RELATIONAL DATABASE BLUEPRINT (SUPABASE POSTGRESQL)
### Table: `profiles`
- `id` (uuid, primary key, references auth.users)
- `organization_name` (text, non-nullable)
- `role` (text, check constraint: 'department' | 'startup' | 'evaluator')
- `created_at` (timestamp with time zone, default: now())

### Table: `challenges`
- `id` (uuid, primary key, default: gen_random_uuid())
- `title` (text, non-nullable)
- `department_name` (text, non-nullable)
- `description` (text, non-nullable)
- `target_metrics` (text, non-nullable) -> E.g., "Achieve 95% identification rate"
- `budget_allocation` (numeric, non-nullable)
- `created_at` (timestamp with time zone, default: now())

### Table: `pilots`
- `id` (uuid, primary key, default: gen_random_uuid())
- `challenge_id` (uuid, foreign key references challenges.id)
- `startup_id` (uuid, foreign key references profiles.id)
- `status` (text, check constraint: 'active' | 'completed' | 'scaled_up', default: 'active')
- `current_milestone` (integer, default: 1)
- `total_milestones` (integer, default: 3)
- `created_at` (timestamp with time zone, default: now())

## 🗺️ 4. PHASED EXECUTION TRACKER

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

## 🚀 DEPLOYMENT CONTEXT (added 2026-08-29)
- **Live URL:** https://sih-prototype-26136.vercel.app/dashboard (verified HTTP 200, serves dashboard)
- **Vercel team/scope:** `snxhits-projects-502fa58f` (`team_2BlNaAQsAnLE2Ku3j8ZzQvBF`), account `snxhit` (amitdgames@gmail.com). Project name: `sih-prototype-26136`.
- This is a **brand-new Vercel project** created via CLI. The original `.vercel.app` domain/project lived under a different account and was unreachable (Vercel edge 404 on every path) — it was abandoned.
- **Vercel CLI deploy (worked):** from repo root run `vercel --prod --yes` (project already linked). Auth: `VERCEL_TOKEN` account token.
- **Env vars set on Vercel (all envs):** `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (values in `.env.local`, gitignored). These are required — without them the Supabase URL is not inlined and the app silently runs in "Demo · Mock data" mode.
- **GitHub repo `Snxhit/SIH-Prototype-26136` is correct** (contains the app at root). CAUTION: the *local* `git` remote inside `sih-prototype-26136` points at the same GitHub URL but the local parent `/Users/snxhit/Projects` is a separate Cargo/`.lm` repo — do NOT push from the parent `Projects` folder; push only from within `sih-prototype-26136`.
- The dashboard's "Demo · Mock data" text in raw HTML is the pre-hydration shell; the "Live · Supabase" badge + data load client-side in a browser.

