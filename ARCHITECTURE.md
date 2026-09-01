# Architecture — SIH 2026 · PS 26136

**Startup-Friendly Public Procurement Portal**  
Stack: Next.js 16 · React 19 · Tailwind 4 · Supabase Postgres · jsPDF

Interactive maps (open in a browser): [archify/](archify/) — generated with [Archify](https://github.com/tt-a1i/archify).

---

## 1. What this system is

A **multi-persona demo portal** that shows how government departments can buy innovation from startups without classic RFP friction:

| Persona | Job |
|---------|-----|
| **Department** | Publish an **outcome-based** challenge (metrics + budget), not a locked solution spec |
| **Startup** | **One-click apply**, run a **pilot**, submit **milestones** |
| **Evaluator** | Audit progress and **approve scale-up**, which generates a **Government Order PDF** |

All three personas live on **one route**: `/dashboard`, with a **Demo as** switcher for live judging.

---

## 2. Runtime flow (end-to-end)

```
Judge Browser
    │  Demo as Department / Startup / Evaluator
    ▼
Next.js Dashboard SPA  (app/dashboard/page.tsx)
    │
    ├─► Supabase Postgres   challenges · pilots   (live mode)
    │       ▲
    │       └── Realtime postgres_changes + 6s poll fallback
    │
    ├─► In-memory mock arrays   (no env vars → Demo · Mock data)
    │
    └─► jsPDF (utils/government-order.ts)
            └── download Government-Order-*.pdf on scale-up
```

**Live mode** requires:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

If either is missing, `createSupabaseClient()` throws and the UI stays on **mock data** (still fully clickable for judges).

---

## 3. Data model

Defined in `AGENTS.md` and created by `supabase/seed.sql`.

```
profiles (auth.users)          challenges                 pilots
─────────────────────          ───────────                ──────
id (uuid FK)                   id                         id
organization_name              title                      challenge_id → challenges
role: department|startup|      department_name            startup_id → profiles (often NULL in demo)
      evaluator                description                status: active | completed | scaled_up
created_at                     target_metrics             current_milestone (default 1)
                               budget_allocation          total_milestones (default 3)
                               created_at                 created_at
```

**Demo caveat:** There is no Auth UI. Pilot rows often keep `startup_id = null` and the UI labels them `DEMO_STARTUP_NAME` ("Startup One").

RLS is **intentionally open** (`using (true)`) so the publishable anon key can drive the hackathon demo.

---

## 4. Application modules

| Path | Responsibility |
|------|----------------|
| `app/dashboard/page.tsx` | Entire product UI + `useDashboard()` data hook |
| `utils/supabase/client.ts` | Typed Supabase browser client |
| `utils/government-order.ts` | jsPDF letterhead + scale-up order |
| `supabase/seed.sql` | Schema + Maharashtra challenge seeds |
| `components/ui/*` | shadcn/Radix primitives |
| `app/page.tsx` | Default Next.js landing (not the demo entry) |

### Hook API (`useDashboard`)

| Action | Effect |
|--------|--------|
| `publishChallenge` | Insert `challenges` (or mock prepend) |
| `applyToChallenge` | Insert `pilots` with `status=active` |
| `advanceMilestone` | Increment milestone; set `completed` when past total |
| `approveScaleUp` | Require `completed` → set `scaled_up` + download PDF |

Cross-view sync: Supabase Realtime channel `dashboard-sync` on `challenges` + `pilots`, plus **6s polling** fallback.

---

## 5. Pilot state machine

```
                 Submit Milestone × N
   [apply] ──────────────────────────► active (m=1..total)
                                              │
                                              │ last milestone submitted
                                              ▼
                                         completed
                                              │
                                              │ Evaluator: Verify & Approve
                                              ▼
                                         scaled_up  +  GO PDF
```

UI blocks scale-up unless `status === "completed"`.

---

## 6. Trust & hosting boundaries

| Layer | Notes |
|-------|--------|
| **Browser** | All interactive logic is `"use client"`; PDF generated client-side |
| **Vercel** | Hosts the demo (see `AGENTS.md` deploy notes) |
| **Supabase** | Managed Postgres + Realtime; demo RLS is not production-ready |
| **No server actions / API routes** | Prototype talks to Supabase directly from the browser |

---

## 7. Archify diagrams

| Diagram | File | Use in pitch |
|---------|------|--------------|
| Runtime architecture | [archify/sih-runtime.architecture.html](archify/sih-runtime.architecture.html) | “How the system is wired” |
| Procurement workflow | [archify/sih-procurement.workflow.html](archify/sih-procurement.workflow.html) | “How the three personas collaborate” |
| Pilot lifecycle | [archify/sih-pilot.lifecycle.html](archify/sih-pilot.lifecycle.html) | “Status machine from apply → GO” |

Open HTML locally → press **F** for Presentation Stage → **E** to export PNG / share card.

JSON IR sources sit beside each HTML file for reproducible rebuilds via Archify CLI.
