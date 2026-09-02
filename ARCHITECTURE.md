# Architecture — SIH 2026 · PS 26136

**Startup-Friendly Public Procurement Portal**
Stack: Next.js 16.3 · React 19.2 · Tailwind 4 · Supabase Postgres · jsPDF (client-side)

---

## 1. What this system is

A **multi-persona demo portal** that shows how government departments can buy innovation from
startups without classic RFP friction. The prototype was built across 14 phases — the frontend
was re-themed to a dark **indigo/slate HUD** (originally emerald) and restructured into a
**left-sidebar dashboard** with an Overview command center.

### Entry points

| Route | Role |
|-------|------|
| `/` | Marketing landing → **Go to Dashboard** (no sign-in) |
| `/dashboard` | The whole product SPA (sidebar workspaces) |

The dashboard is a `"use client"` SPA with a **collapsible left sidebar** driving 7 workspaces:

| Workspace | Persona / job |
|-----------|---------------|
| **Overview** | Command center: KPIs + quick links into each workspace |
| **Department** | Publish an **outcome-based** challenge (metrics + budget + sandbox template) |
| **Startup Hub** | One-click apply, run a **pilot**, submit **milestone evidence** |
| **Evaluator** | AI screen evidence, then **QCBS audit & approve** scale-up → **GO PDF** |
| **Templates** | 6 pre-vetted legal/ops document models with live variable binding |
| **Sandbox** | Configure env / data-privacy / stop-loss per pilot; view the sandbox table |
| **Impact** | Policymaker funnel, budget & escrow utilisation, velocity analytics |

---

## 2. Runtime flow (end-to-end)

```
Judge Browser
    │  pick workspace in left sidebar
    ▼
Next.js Dashboard SPA  (app/dashboard/page.tsx, "use client")
    │
    ├─► Supabase Postgres   challenges·pilots·evaluations·escrow·templates   (live mode)
    │       ▲
    │       └── Realtime postgres_changes (channel "dashboard-sync") + 6s poll fallback
    │
    ├─► In-memory mock arrays   (missing env vars → "Demo · Mock data", still clickable)
    │
    ├─► /api/* routes (fallback writes when direct client insert is inconvenient)
    │
    └─► jsPDF (utils/government-order.ts)  → download GO-*.pdf on scale-up approval
```

**Live mode** requires the browser client to read:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

If either is missing, `createSupabaseClient()` throws, the UI shows **“Demo · Mock data”**, and
every action mutates the in-memory arrays instead — still fully clickable for judges.

---

## 3. Data model (7 tables — `supabase/seed.sql`)

```
profiles (auth.users)     challenges               pilots
──────────────────        ───────────              ──────
id (uuid FK)              id                       id
organization_name         title                    challenge_id → challenges
role: department|         department_name          startup_id → profiles (NULL in demo)
 startup|evaluator        description              status: active|completed|scaled_up
created_at                target_metrics           current_milestone (default 1)
                          budget_allocation        total_milestones (default 4)
                          sandbox_template         tranche_amount  ← escrow tranche
                          created_at               environment      ← sandbox pillar
                                                   data_privacy     ← sandbox pillar
                                                   stop_loss        ← sandbox pillar
                                                   ip_retainment    ← sandbox pillar
                                                   audit_score (QCBS aggregate)
                                                   created_at

templates (NEW)           evaluations (NEW)        escrow_transactions (NEW)
─────────────             ───────────────          ────────────────────
template_key (unique)     id                       id
doc_id / title /          pilot_id (unique)→pilots pilot_id → pilots
filename / hash           technical_merit (30%)    amount (INR)
labels (jsonb)            kpi_accuracy   (25%)     tx_hash (simulated)
default_values (jsonb)    cybersecurity  (20%)     status: pending|disbursed|failed
body_template ({{p1..3}}) scalability   (15%)      disbursed_at
created_at                dpiit_recognition(10%)   created_at
                          weighted_score (auto)
                          is_approved    (auto)
                          evaluator_notes
                          evaluated_at
```

**Key defaults / invariants**
- `pilots.total_milestones = 4` (Milestone X of 4 across every view).
- `evaluations.dpiit_recognition = 100` (fixed DPIIT gate).
- The `compute_weighted_score()` trigger auto-sets `weighted_score` and `is_approved`
  (`>= 85.0`) on every INSERT/UPDATE.
- `get_escrow_vault_balance()` returns total-allocated − total-disbursed.
- `advance_milestone(pilot_id)` increments the milestone and flips `completed` when maxed.

**Demo caveats**
- No Auth UI: pilot rows keep `startup_id = null`; the UI renders `DEMO_STARTUP_NAME` ("Startup One").
- RLS is intentionally **open** (`using (true)`) so the publishable anon key drives the demo.

---

## 4. Application modules

| Path | Responsibility |
|------|----------------|
| `app/dashboard/page.tsx` | Entire product UI + `useDashboard()` data hook + Overview/panel components |
| `app/page.tsx` | Marketing landing (`/`) with orbital hero + ticker, **no sign-in** |
| `app/layout.tsx` | Fonts (Cormorant Garamond / Plus Jakarta Sans / JetBrains Mono) + forced `dark` |
| `app/globals.css` | Tailwind 4 dark **indigo/slate** theme tokens + animation keyframes |
| `components/templates/TemplateStudio.tsx` | Template selector + editor + params + export / apply-to-challenge |
| `components/sandbox/SandboxStudio.tsx`, `SandboxTable.tsx` | Sandbox config pillars + per-pilot table |
| `components/evaluator/EvalRubricModal.tsx` | QCBS slider rubric + real-time aggregate + approve flow |
| `components/escrow/EscrowDrawer.tsx` | Vault hero, coverage bar, tx history with hashes |
| `components/ui/*` | shadcn/Base-UI primitives (button, card, input, tabs, …) |
| `app/api/*` | 5 REST routes (see §5) |
| `lib/*` | `templates`, `sandbox`, `evaluations` (shapes + scoring helpers) |
| `utils/supabase/client.ts` | Typed Supabase browser client + `Database` type |
| `utils/government-order.ts` | jsPDF letterhead + scale-up Government Order |
| `supabase/seed.sql` | Destructive drop-and-recreate schema + all demo seeds |

### Hook API (`useDashboard`)

| Action | Effect |
|--------|--------|
| `publishChallenge` | Insert `challenges` (or mock prepend) |
| `applyToChallenge` | Insert `pilots` with `status = active` |
| `advanceMilestone` | Increment milestone; `completed` when past total |
| `submitMilestoneEvidence` | Store evidence feed; notifies evaluator panel |
| `submitEvaluation` | Write evaluation → trigger scores/approval → auto-scale-up + escrow payout + GO PDF |
| `lockSandboxConfig` | Persist the 4 sandbox pillars to `pilots` |

Cross-view sync: Supabase Realtime channel `dashboard-sync` on `pilots`/`challenges`/
`evaluations`/`escrow_transactions` + a **6s polling** fallback.

---

## 5. API routes (all `POST/GET/PUT` → Supabase)

| Route | Methods | Purpose |
|-------|---------|---------|
| `app/api/templates/route.ts` | GET | All templates / single by key |
| `app/api/sandbox/route.ts` | GET, PUT | Read sandbox configs; lock & deploy params |
| `app/api/evaluations/route.ts` | GET, POST | Fetch / upsert evaluation; auto-scales pilot + inserts escrow payout once |
| `app/api/escrow/route.ts` | GET, POST | Transactions + vault balance RPC; create payout |
| `app/api/analysis/route.ts` | POST | AI evidence screening → structured findings (LLM or heuristic fallback) |

While most demo actions hit Supabase directly from the browser, these routes centralize the
templating, escrow, evaluation and AI logic. `/api/analysis` calls an OpenAI-compatible provider
(`AI_BASE_URL` / `AI_API_KEY` / `AI_MODEL`) and **always** falls back to a deterministic keyword
scorer on error / missing key, returning `{ score, findings[], summary, mode: "llm"|"heuristic" }`.

---

## 6. Pilot state machine

```
                 Submit Milestone × N (evidence feed)
   [apply] ──────────────────────────────────────► active (m = 1..4)
                                                         │
                                                         │ last milestone submitted
                                                         ▼
                                                    completed
                                                         │
                                                         │ Evaluator: AI screen + QCBS approve
                                                         ▼
                                                    scaled_up  +  escrow payout  +  GO PDF
```

Scale-up is **human-gated** by the QCBS rubric — AI screening is assistive only.

---

## 7. Trust & hosting boundaries

| Layer | Notes |
|-------|--------|
| **Browser** | All interactive logic is `"use client"`; PDF + AI calls are client/fetch driven |
| **Vercel** | Hosts `/` and `/dashboard` (see `AGENTS.md` deploy notes — deploy is on hold) |
| **Supabase** | Managed Postgres + Realtime; open demo RLS is **not** production-ready |
| **API routes** | Thin Supabase/AI adapters; no server-rendered app state |

---

## 8. Reading the code to learn it

Fastest mental model — **follow the sidebar**:

1. **Overview** (`app/dashboard/page.tsx` → `OverviewPanel`) is the map. It shows live KPIs and
   a card per workspace so you can always get back your bearings.
2. Each workspace renders one panel (`DepartmentPanel`, `StartupHub`, `EvaluatorPanel`,
   `TemplateStudio`, `SandboxStudio`, `ImpactPanel`). Everything is in one `"use client"` file.
3. All data flows through **`useDashboard()`** — the single hook at the top of that file. It
   owns `challenges`, `pilots`, `evaluations`, `escrow`, `evidenceFeed` and every mutation.
4. Every button eventually calls one of the hook's actions (see §4 table). Read an action →
   it either writes to Supabase (live) or mutates the mock arrays (demo).
5. The **Evaluator → Audit & Evaluate** flow is the showcase: rubric slider → trigger computes
   score/approval → pilot becomes `scaled_up` → escrow payout + **GO PDF** downloads.

Suggested reading order: `utils/supabase/client.ts` → `useDashboard()` → `app/dashboard/page.tsx`
render tree → `EvalRubricModal` → `EscrowDrawer` → `app/api/analysis` (AI gate).

