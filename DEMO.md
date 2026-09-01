# Demo script — SIH 2026 · PS 26136

**Goal:** Walk a judge through the full procurement loop in **≤ 3 minutes**.

| | |
|---|---|
| **Live** | https://sih-prototype-26136.vercel.app/dashboard |
| **Local** | `npm run dev` → http://localhost:3000/dashboard |
| **Deep dive** | [ARCHITECTURE.md](ARCHITECTURE.md) · [archify/](archify/) · [ENHANCEMENTS.md](../ENHANCEMENTS.md) |

---

## 30-second pitch

> Public procurement locks startups out with paperwork, experience clauses, and rigid RFPs.  
> We built an **outcome-first** portal: departments publish **measurable challenges**, startups **pilot in milestones**, evaluators **approve scale-up** and get a **Government Order PDF** — DPIIT-friendly, demoable in three clicks.

---

## Pre-flight checklist

1. Open **`/dashboard`** (not `/`).
2. Confirm badge: **Live · Supabase** *or* **Demo · Mock data** (both are judge-safe).
3. Optional: open Archify HTML on a second screen for architecture questions.

---

## 3-minute persona walkthrough

### Minute 1 — Department (publish)

1. Switch **Demo as → Department**.
2. Fill **Publish Outcome-Based Challenge**:
   - Title: e.g. `AI Leak Detection for Urban Water Networks`
   - Department: `Water Supply & Sanitation`
   - Budget: `38000000`
   - Target metrics: `60% faster leak localisation`
   - Short outcome-oriented description
3. Click **Publish Challenge**.
4. Point to the table: challenge is now live for startups.

**Talking point:** *We ask for outcomes and KPIs, not a vendor’s prescribed stack.*

### Minute 2 — Startup (apply + milestones)

1. Switch **Demo as → Startup**.
2. Show **DPIIT Registered** badge (turnover / experience waived narrative).
3. On the new challenge card → **One-Click Apply**.
4. Under **My Active Pilots**, click **Submit Milestone** twice (or until status becomes **Completed**).
5. Show the pipeline: Discover → PoC → Rollout → Go/No-Go.

**Talking point:** *Pilots de-risk public spend before a full-scale purchase order.*

### Minute 3 — Evaluator (scale-up + GO)

1. Switch **Demo as → Evaluator**.
2. Stats: Active / Ready for Scale-Up / Approved.
3. On a **Completed** row → **Verify & Approve Scale-Up**.
4. Browser downloads `Government-Order-….pdf`.
5. Open PDF briefly: letterhead, sanctioned parameters, terms, signature block.

**Talking point:** *Scale-up is gated on completed milestones and produces an auditable artifact — not a chatty email.*

---

## Backup paths if something fails

| Symptom | Recovery |
|---------|----------|
| Badge stuck on Mock | Fine for judging — call it offline demo mode |
| Publish fails (Supabase) | Use Mock mode; still interactive |
| No “Ready for Scale-Up” | Advance milestones until **Completed** |
| PDF blocked by browser | Allow downloads; re-click Approve |
| Landed on `/` | Navigate to `/dashboard` |

---

## Likely judge questions (short answers)

| Question | Answer |
|----------|--------|
| Is this production-ready? | **No** — hackathon prototype; open RLS, no Auth UI, self-attested milestones. See ENHANCEMENTS.md. |
| Where is the smart automation? | Workflow automation of challenge → pilot → GO; next step = evidence verification / AI assist (roadmap). |
| Why Maharashtra seeds? | Regional demo challenges (land records, grievances, agri, PWD, cold storage, water). |
| How do personas stay in sync? | Supabase Realtime + 6s poll fallback. |
| Legal weight of the PDF? | **Demonstration only** — footer says system-generated for demo. |

---

## Suggested closing line

> “In three minutes we went from a measurable public problem, to a startup pilot, to a scale-up Government Order — the missing bridge between DPIIT startups and departmental buyers.”
