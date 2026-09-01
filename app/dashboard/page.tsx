"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  Building2,
  Rocket,
  BadgeCheck,
  Landmark,
  IndianRupee,
  Target,
  Trophy,
  Users,
  ClipboardCheck,
  CheckCircle2,
  ShieldCheck,
  Sliders,
  TrendingUp,
  ArrowRight,
  Plus,
  FileText,
  FileCode2,
  FlaskConical,
  Handshake,
  Wallet,
  Send,
  Zap,
  Sparkles,
  Loader2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { createSupabaseClient, type Database } from "@/utils/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

import { downloadGovernmentOrder } from "@/utils/government-order";
import TemplateStudio from "@/components/templates/TemplateStudio";
import type { ChallengePrefill } from "@/lib/templates";
import SandboxStudio from "@/components/sandbox/SandboxStudio";
import SandboxTable from "@/components/sandbox/SandboxTable";
import type { SandboxConfig } from "@/lib/sandbox";
import type { AnalysisResult } from "@/app/api/analysis/route";
import EvalRubricModal from "@/components/evaluator/EvalRubricModal";
import type { EvaluationScores } from "@/lib/evaluations";
import { computeWeightedScore, EVALUATION_THRESHOLD } from "@/lib/evaluations";
import EscrowDrawer, { type EscrowState } from "@/components/escrow/EscrowDrawer";

interface Challenge {
  id: string;
  title: string;
  department_name: string;
  description: string;
  target_metrics: string;
  budget_allocation: number;
  sandbox_template: string;
  created_at: string;
}

type PilotStatus = "active" | "completed" | "scaled_up";

interface Pilot {
  id: string;
  challenge_id: string | null;
  startup_id: string | null;
  startup_name: string;
  status: PilotStatus;
  current_milestone: number;
  total_milestones: number;
  tranche_amount: number;
  environment: string;
  data_privacy: string;
  stop_loss: string;
  ip_retainment: string;
  audit_score: number;
  created_at: string;
}

const currency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const compactCurrency = (value: number) =>
  value >= 10000000
    ? `₹${(value / 10000000).toFixed(1)} Cr`
    : value >= 100000
      ? `₹${(value / 100000).toFixed(1)} L`
      : `₹${value.toLocaleString("en-IN")}`;

const initials = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const STATUS_LABEL: Record<PilotStatus, string> = {
  active: "Active Pilot",
  completed: "Completed",
  scaled_up: "Scale-Up Approved",
};

const dippNumber = (id: string) =>
  `DIPP-${id
    .split("")
    .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 900000 + 100000, 7)}`;

/* ------------------------------------------------------------------ */
/* Impact metrics (policymaker analytics)                               */
/* ------------------------------------------------------------------ */

interface ImpactMetrics {
  funnel: { published: number; applied: number; completed: number; scaled: number };
  activePilots: number;
  challengeBudget: number;
  trancheBudget: number;
  escrowAllocated: number;
  escrowDisbursed: number;
  escrowUtilization: number;
  medianDaysToComplete: number | null;
  approvalRate: number | null;
  avgWeightedScore: number | null;
  avgMilestoneProgress: number;
  sectors: { name: string; challenges: number }[];
}

function computeImpact(
  challenges: Challenge[],
  pilots: Pilot[],
  evaluations: DbEvaluation[],
  escrow: EscrowState
): ImpactMetrics {
  const funnel = {
    published: challenges.length,
    applied: pilots.length,
    completed: pilots.filter(
      (p) => p.status === "completed" || p.status === "scaled_up"
    ).length,
    scaled: pilots.filter((p) => p.status === "scaled_up").length,
  };

  const days: number[] = [];
  for (const pilot of pilots) {
    if (pilot.status !== "completed" && pilot.status !== "scaled_up") continue;
    if (!pilot.created_at) continue;
    const ev = evaluations.find(
      (e) => e.pilot_id === pilot.id && e.is_approved && e.evaluated_at
    );
    if (!ev) continue;
    if (!ev.evaluated_at) continue;
    const start = new Date(pilot.created_at).getTime();
    const end = new Date(ev.evaluated_at).getTime();
    if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
      days.push(Math.round((end - start) / 86400000));
    }
  }
  const sorted = [...days].sort((a, b) => a - b);
  const medianDaysToComplete =
    sorted.length > 0
      ? sorted.length % 2 === 0
        ? Math.round((sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2)
        : sorted[Math.floor(sorted.length / 2)]
      : null;

  const approvedCount = evaluations.filter((e) => e.is_approved).length;
  const sectorMap = new Map<string, number>();
  for (const c of challenges) {
    sectorMap.set(c.department_name, (sectorMap.get(c.department_name) ?? 0) + 1);
  }
  const sectors = [...sectorMap.entries()]
    .map(([name, count]) => ({ name, challenges: count }))
    .sort((a, b) => b.challenges - a.challenges);

  const progress =
    pilots.length > 0
      ? pilots.reduce(
          (sum, p) => sum + (p.current_milestone / p.total_milestones) * 100,
          0
        ) / pilots.length
      : 0;

  return {
    funnel,
    activePilots: pilots.filter((p) => p.status === "active").length,
    challengeBudget: challenges.reduce((sum, c) => sum + c.budget_allocation, 0),
    trancheBudget: pilots.reduce((sum, p) => sum + p.tranche_amount, 0),
    escrowAllocated: escrow.total_allocated,
    escrowDisbursed: escrow.total_disbursed,
    escrowUtilization:
      escrow.total_allocated > 0
        ? Math.round((escrow.total_disbursed / escrow.total_allocated) * 100)
        : 0,
    medianDaysToComplete,
    approvalRate:
      evaluations.length > 0
        ? Math.round((approvedCount / evaluations.length) * 100)
        : null,
    avgWeightedScore:
      evaluations.length > 0
        ? evaluations.reduce((sum, e) => sum + e.weighted_score, 0) /
          evaluations.length
        : null,
    avgMilestoneProgress: Math.round(progress),
    sectors,
  };
}

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: "c1",
    title: "AI-Driven Land Record Dispute Prediction",
    department_name: "Revenue & Land Records",
    description:
      "Automate detection of latent disputes in digitised land records and flag high-risk parcels before they escalate into litigation.",
    target_metrics: "95% dispute identification rate",
    budget_allocation: 25000000,
    sandbox_template: "Geofenced Urban Zone",
    created_at: "2026-07-03",
  },
  {
    id: "c2",
    title: "Smart Public Grievance Triage",
    department_name: "Urban Development",
    description:
      "Classify and route citizen grievances to the correct civic department with recommended response actions in real time.",
    target_metrics: "40% reduction in resolution turnaround",
    budget_allocation: 18500000,
    sandbox_template: "Synthetic Data Testbed",
    created_at: "2026-07-11",
  },
  {
    id: "c3",
    title: "Crop Price Forecast & Procurement Optimisation",
    department_name: "Agricultural Marketing",
    description:
      "Forecast mandi prices using market, weather and export signals to guide procurement scheduling and MSP planning.",
    target_metrics: "88% forecast accuracy over 45 days",
    budget_allocation: 32000000,
    sandbox_template: "Synthetic Data Testbed",
    created_at: "2026-07-18",
  },
];

const MOCK_PILOTS: Pilot[] = [
  {
    id: "p1",
    challenge_id: "c1",
    startup_id: "s1",
    startup_name: "AgriSense Analytics",
    status: "active",
    current_milestone: 2,
    total_milestones: 4,
    tranche_amount: 1250000,
    environment: "Geofenced 5km Urban Zone",
    data_privacy: "Anonymized PII + Edge Ingestion",
    stop_loss: "Max 5.0% False Positive Tolerance",
    ip_retainment: "100% Retained by Startup",
    audit_score: 0,
    created_at: "2026-07-20",
  },
  {
    id: "p2",
    challenge_id: "c2",
    startup_id: "s2",
    startup_name: "CivicFlow Labs",
    status: "scaled_up",
    current_milestone: 4,
    total_milestones: 4,
    tranche_amount: 1200000,
    environment: "Synthetic Data Testbed",
    data_privacy: "100% Synthetic Dummy Datasets",
    stop_loss: "Max 2.0% Anomaly Deviation",
    ip_retainment: "100% Retained by Startup",
    audit_score: 94.3,
    created_at: "2026-07-10",
  },
  {
    id: "p3",
    challenge_id: "c3",
    startup_id: "s3",
    startup_name: "Mandibazaar AI",
    status: "completed",
    current_milestone: 4,
    total_milestones: 4,
    tranche_amount: 2000000,
    environment: "Synthetic Data Testbed",
    data_privacy: "100% Synthetic Dummy Datasets",
    stop_loss: "Relaxed: Max 10.0% Early Prototype",
    ip_retainment: "100% Retained by Startup",
    audit_score: 0,
    created_at: "2026-07-05",
  },
];

const MOCK_EVALUATIONS: DbEvaluation[] = [
  {
    id: "e1",
    pilot_id: "p2",
    technical_merit: 95,
    kpi_accuracy: 92,
    cybersecurity: 98,
    scalability: 88,
    dpiit_recognition: 100,
    weighted_score: 94.3,
    is_approved: true,
    evaluator_notes: "Clear technical merit; approved for direct GeM conversion.",
    evaluated_at: "2026-08-04T09:30:00Z",
    created_at: "2026-08-04T09:30:00Z",
  },
];

const MOCK_ESCROW: EscrowState = {
  vault_balance: 19500000,
  total_disbursed: 25000000,
  total_allocated: 44500000,
  transactions: [
    {
      id: "tx1",
      amount: 25000000,
      tx_hash: "0x1b4c...98e4",
      status: "disbursed",
      disbursed_at: "2026-08-19T10:00:00Z",
    },
    {
      id: "tx2",
      amount: 1250000,
      tx_hash: "0x6f3a...c21d",
      status: "pending",
      disbursed_at: "2026-09-01T08:30:00Z",
    },
  ],
};

type DbPilot = Database["public"]["Tables"]["pilots"]["Row"];
type DbEvaluation = Database["public"]["Tables"]["evaluations"]["Row"];
type DbEscrowTransaction = Database["public"]["Tables"]["escrow_transactions"]["Row"];

/** The single demo startup identity shown across the UI. The `pilots.startup_id`
 *  column is a FK to `profiles.id` -> `auth.users`, which has no rows without an
 *  auth flow, so DB rows keep `startup_id = null` and we render this local name. */
const DEMO_STARTUP_NAME = "Startup One";

function mapDbPilot(row: DbPilot): Pilot {
  return {
    id: row.id,
    challenge_id: row.challenge_id,
    startup_id: row.startup_id,
    startup_name: DEMO_STARTUP_NAME,
    status: row.status,
    current_milestone: row.current_milestone,
    total_milestones: row.total_milestones,
    tranche_amount: row.tranche_amount,
    environment: row.environment,
    data_privacy: row.data_privacy,
    stop_loss: row.stop_loss,
    ip_retainment: row.ip_retainment,
    audit_score: row.audit_score,
    created_at: row.created_at ?? new Date().toISOString().slice(0, 10),
  };
}

function useDashboard() {
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [pilots, setPilots] = useState<Pilot[]>(MOCK_PILOTS);
  const [evaluations, setEvaluations] = useState<DbEvaluation[]>(MOCK_EVALUATIONS);
  const [escrow, setEscrow] = useState<EscrowState>(MOCK_ESCROW);
  const [evidenceFeed, setEvidenceFeed] = useState<Record<string, string>>({});
  const [isLive, setIsLive] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const notify = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const harness = useCallback((): SupabaseClient<Database> | null => {
    try {
      return createSupabaseClient();
    } catch {
      return null;
    }
  }, []);

  const reloadChallenges = useCallback(
    async (client: SupabaseClient<Database>) => {
      const { data, error } = await client
        .from("challenges")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setChallenges(data as Challenge[]);
    },
    []
  );

  const reloadPilots = useCallback(
    async (client: SupabaseClient<Database>) => {
      const { data, error } = await client
        .from("pilots")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setPilots((data as DbPilot[]).map(mapDbPilot));
    },
    []
  );

  const reloadEvaluations = useCallback(
    async (client: SupabaseClient<Database>) => {
      const { data, error } = await client
        .from("evaluations")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setEvaluations(data as DbEvaluation[]);
    },
    []
  );

  const reloadEscrow = useCallback(
    async (client: SupabaseClient<Database>) => {
      const { data: vault, error: balErr } = await client.rpc(
        "get_escrow_vault_balance"
      );
      if (balErr) return;
      const { data: transactions, error: txErr } = await client
        .from("escrow_transactions")
        .select("*")
        .order("disbursed_at", { ascending: false });
      if (txErr) return;
      const rows = (transactions as DbEscrowTransaction[]) ?? [];
      const total_disbursed = rows.reduce(
        (sum, tx) => sum + (tx.status === "disbursed" ? tx.amount : 0),
        0
      );
      setEscrow({
        vault_balance: vault ?? 0,
        total_disbursed,
        total_allocated: (vault ?? 0) + total_disbursed,
        transactions: rows,
      });
    },
    []
  );

  useEffect(() => {
    const client = harness();
    if (!client) return;
    let cancelled = false;

    const load = async () => {
      const [chRes, piRes, evRes, escRes, txRes] = await Promise.all([
        client.from("challenges").select("*").order("created_at", { ascending: false }),
        client.from("pilots").select("*").order("created_at", { ascending: false }),
        client.from("evaluations").select("*").order("created_at", { ascending: false }),
        client.rpc("get_escrow_vault_balance"),
        client
          .from("escrow_transactions")
          .select("*")
          .order("disbursed_at", { ascending: false }),
      ]);
      if (cancelled) return;
      if (!chRes.error && chRes.data) setChallenges(chRes.data as Challenge[]);
      if (!piRes.error && piRes.data) setPilots((piRes.data as DbPilot[]).map(mapDbPilot));
      if (!evRes.error && evRes.data) setEvaluations(evRes.data as DbEvaluation[]);
      if (!escRes.error) {
        const vault = escRes.data ?? 0;
        const rows = (txRes.data as DbEscrowTransaction[]) ?? [];
        const total_disbursed = rows.reduce(
          (sum, tx) => sum + (tx.status === "disbursed" ? tx.amount : 0),
          0
        );
        setEscrow({
          vault_balance: vault,
          total_disbursed,
          total_allocated: vault + total_disbursed,
          transactions: rows,
        });
      }
      setIsLive(true);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [harness]);

  // Auto-refresh listeners: push updates as they land so all views stay in sync.
  useEffect(() => {
    const client = harness();
    if (!client) return;

    const channel = client
      .channel("dashboard-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pilots" },
        () => {
          reloadPilots(client);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "challenges" },
        () => {
          reloadChallenges(client);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "evaluations" },
        () => {
          reloadEvaluations(client);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "escrow_transactions" },
        () => {
          reloadEscrow(client);
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [harness, reloadPilots, reloadChallenges, reloadEvaluations, reloadEscrow]);

  // Polling fallback guarantees cross-view sync even if Realtime isn't enabled.
  useEffect(() => {
    const client = harness();
    if (!client || !isLive) return;
    const id = window.setInterval(async () => {
      await reloadPilots(client);
      await reloadChallenges(client);
      await reloadEvaluations(client);
      await reloadEscrow(client);
    }, 6000);
    return () => window.clearInterval(id);
  }, [harness, isLive, reloadPilots, reloadChallenges, reloadEvaluations, reloadEscrow]);

  const publishChallenge = async (form: Omit<Challenge, "id" | "created_at">) => {
    const client = harness();
    if (client && isLive) {
      const { error } = await client.from("challenges").insert({
        title: form.title,
        department_name: form.department_name,
        description: form.description,
        target_metrics: form.target_metrics,
        budget_allocation: form.budget_allocation,
        sandbox_template: form.sandbox_template,
      });
      if (error) {
        notify(`Could not publish challenge: ${error.message}`);
        return;
      }
      await reloadChallenges(client);
      notify("Challenge published and now live for startups.");
      return;
    }
    const challenge: Challenge = {
      ...form,
      id: `c${Date.now()}`,
      created_at: new Date().toISOString().slice(0, 10),
    };
    setChallenges((prev) => [challenge, ...prev]);
    notify("Challenge published and now live for startups.");
  };

  const applyToChallenge = async (challengeId: string) => {
    const client = harness();
    if (client && isLive) {
      const { error } = await client.from("pilots").insert({ challenge_id: challengeId });
      if (error) {
        notify(`Could not submit application: ${error.message}`);
        return;
      }
      await reloadPilots(client);
      notify("Application submitted. Your pilot workspace is now active.");
      return;
    }
    setPilots((prev) => [
      ...prev,
      {
        id: `p${Date.now()}`,
        challenge_id: challengeId,
        startup_id: null,
        startup_name: DEMO_STARTUP_NAME,
        status: "active",
        current_milestone: 1,
        total_milestones: 4,
        tranche_amount: 0,
        environment: "Geofenced 5km Urban Zone",
        data_privacy: "Anonymized PII + Edge Ingestion",
        stop_loss: "Max 5.0% False Positive Tolerance",
        ip_retainment: "100% Retained by Startup",
        audit_score: 0,
        created_at: new Date().toISOString().slice(0, 10),
      },
    ]);
    notify("Application submitted. Your pilot workspace is now active.");
  };

  const advanceMilestone = async (pilotId: string) => {
    const pilot = pilots.find((p) => p.id === pilotId);
    if (!pilot || pilot.status !== "active") return;

    const next = pilot.current_milestone + 1;
    const status: PilotStatus =
      next > pilot.total_milestones ? "completed" : pilot.status;
    const milestone = Math.min(next, pilot.total_milestones);

    const client = harness();
    if (client && isLive) {
      const { error } = await client
        .from("pilots")
        .update({ current_milestone: milestone, status })
        .eq("id", pilotId);
      if (error) {
        notify(`Could not save milestone: ${error.message}`);
        return;
      }
      await reloadPilots(client);
      notify(
        status === "completed"
          ? "Pilot complete. Now pending scale-up review."
          : "Milestone submitted. Progress updated across all views."
      );
      return;
    }

    setPilots((prev) =>
      prev.map((p) =>
        p.id === pilotId ? { ...p, current_milestone: milestone, status } : p
      )
    );
    notify(
      status === "completed"
        ? "Pilot complete. Now pending scale-up review."
        : "Milestone submitted. Progress updated across all views."
    );
  };

  const issueOrder = (pilot: Pilot) => {
    const challenge = challenges.find((c) => c.id === pilot.challenge_id);
    const year = new Date().getFullYear();
    const orderNumber = `MAH/PROC/E/${year}/${Date.now()
      .toString()
      .slice(-5)}`;
    const issueDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    downloadGovernmentOrder({
      orderNumber,
      issueDate,
      title: challenge?.title ?? "Government Challenge",
      department: challenge?.department_name ?? "Government of Maharashtra",
      startupName: pilot.startup_name,
      description: challenge?.description ?? "",
      targetMetrics: challenge?.target_metrics ?? "As per challenge terms",
      budgetAllocation: challenge?.budget_allocation ?? 0,
      currentMilestone: pilot.current_milestone,
      totalMilestones: pilot.total_milestones,
    });
  };

  const submitEvaluation = async (
    pilotId: string,
    scores: EvaluationScores
  ) => {
    const pilot = pilots.find((p) => p.id === pilotId);
    if (!pilot) return null;
    const payload = { pilot_id: pilotId, ...scores };
    const hashTx = () =>
      `0x${Math.random().toString(16).slice(2, 10)}...${Math.random()
        .toString(16)
        .slice(2, 8)}`;

    const client = harness();
    if (client && isLive) {
      try {
        const res = await fetch("/api/evaluations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (res.ok) {
          await Promise.all([reloadPilots(client), reloadEvaluations(client)]);
          if (result?.approved) {
            if (pilot.status !== "scaled_up") issueOrder(pilot);
            notify(`Evaluation ${result.evaluation?.weighted_score}% · scale-up approved, government order issued.`);
          } else {
            notify(`Evaluation recorded at ${result.evaluation?.weighted_score}% · below the ${EVALUATION_THRESHOLD}% threshold.`);
          }
          return result ?? null;
        }
        notify(`Could not save evaluation: ${result?.error ?? "API error"}`);
        return null;
      } catch {
        // fall through to direct client write
      }

      const { error } = await client
        .from("evaluations")
        .upsert(payload, { onConflict: "pilot_id" });
      if (error) {
        notify(`Could not save evaluation: ${error.message}`);
        return null;
      }
      const weighted = computeWeightedScore(scores);
      if (weighted >= EVALUATION_THRESHOLD && pilot.status !== "scaled_up") {
        await client
          .from("pilots")
          .update({ status: "scaled_up", audit_score: weighted })
          .eq("id", pilotId);
        await client.from("escrow_transactions").insert({
          pilot_id: pilotId,
          amount: pilot.tranche_amount,
          tx_hash: hashTx(),
          status: "disbursed",
        });
      }
      await Promise.all([reloadPilots(client), reloadEvaluations(client)]);
      if (weighted >= EVALUATION_THRESHOLD) issueOrder(pilot);
      notify(
        weighted >= EVALUATION_THRESHOLD
          ? `Evaluation ${weighted}% · scale-up approved, government order issued.`
          : `Evaluation recorded at ${weighted}% · below the ${EVALUATION_THRESHOLD}% threshold.`
      );
      return { approved: weighted >= EVALUATION_THRESHOLD, weighted_score: weighted };
    }

    const weighted = computeWeightedScore(scores);
    const approved = weighted >= EVALUATION_THRESHOLD;
    const now = new Date().toISOString();
    setEvaluations((prev) => [
      {
        id: `e${Date.now()}`,
        pilot_id: pilotId,
        technical_merit: scores.technical_merit,
        kpi_accuracy: scores.kpi_accuracy,
        cybersecurity: scores.cybersecurity,
        scalability: scores.scalability,
        dpiit_recognition: scores.dpiit_recognition ?? 100,
        weighted_score: weighted,
        is_approved: approved,
        evaluator_notes: approved ? "Approved at threshold." : "Below threshold.",
        evaluated_at: now,
        created_at: now,
      },
      ...prev.filter((e) => e.pilot_id !== pilotId),
    ]);
    setPilots((prev) =>
      prev.map((p) =>
        p.id === pilotId
          ? { ...p, audit_score: weighted, status: approved ? "scaled_up" : p.status }
          : p
      )
    );
    if (approved) issueOrder(pilot);
    notify(
      approved
        ? `Evaluation ${weighted}% · scale-up approved, government order issued.`
        : `Evaluation recorded at ${weighted}% · below the ${EVALUATION_THRESHOLD}% threshold.`
    );
    return { approved, weighted_score: weighted };
  };

  const submitMilestoneEvidence = (pilotId: string, content: string) => {
    const trimmed = content.trim();
    if (!trimmed) {
      notify("Add evidence text before submitting the milestone feed.");
      return;
    }
    setEvidenceFeed((prev) => ({
      ...prev,
      [pilotId]: trimmed,
    }));
    notify(
      "Milestone evidence feed submitted · Technical Evaluator Committee notified via realtime."
    );
  };

  const lockSandboxConfig = useCallback(
    async (pilotId: string, sandbox: SandboxConfig) => {
      const client = harness();
      if (client && isLive) {
        try {
          const res = await fetch("/api/sandbox", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pilot_id: pilotId, ...sandbox }),
          });
          if (res.ok) {
            await reloadPilots(client);
            notify("Sandbox parameters locked & deployed across the active pilot.");
            return;
          }
        } catch {
          // fall through to direct client write
        }
        const { error } = await client
          .from("pilots")
          .update(sandbox)
          .eq("id", pilotId);
        if (error) {
          notify(`Could not lock sandbox: ${error.message}`);
          return;
        }
        await reloadPilots(client);
        notify("Sandbox parameters locked & deployed across the active pilot.");
        return;
      }
      setPilots((prev) =>
        prev.map((p) =>
          p.id === pilotId ? { ...p, ...sandbox } : p
        )
      );
      notify("Sandbox parameters locked & deployed across the active pilot.");
    },
    [harness, isLive, reloadPilots, notify]
  );

  return {
    challenges,
    pilots,
    evaluations,
    escrow,
    evidenceFeed,
    isLive,
    toast,
    notify,
    publishChallenge,
    applyToChallenge,
    advanceMilestone,
    submitMilestoneEvidence,
    submitEvaluation,
    lockSandboxConfig,
  };
}

/* ------------------------------------------------------------------ */
/* Persona Header Bar                                                   */
/* ------------------------------------------------------------------ */

function PersonaSwitcher({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex w-full flex-wrap items-center gap-2 rounded-2xl border border-border bg-muted/40 p-1.5">
      <span className="hidden px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground lg:block">
        Demo as
      </span>
      <Tabs value={value} onValueChange={onChange} className="w-full">
        <TabsList variant="line" className="h-9 w-full justify-start">
          <TabsTrigger value="department" className="gap-1.5 px-3 text-xs">
            <Building2 className="size-3.5" /> Department
          </TabsTrigger>
          <TabsTrigger value="startup" className="gap-1.5 px-3 text-xs">
            <Rocket className="size-3.5" /> Startup
          </TabsTrigger>
          <TabsTrigger value="evaluator" className="gap-1.5 px-3 text-xs">
            <ShieldCheck className="size-3.5" /> Evaluator
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-1.5 px-3 text-xs">
            <FileCode2 className="size-3.5" /> Templates
          </TabsTrigger>
          <TabsTrigger value="sandbox" className="gap-1.5 px-3 text-xs">
            <FlaskConical className="size-3.5" /> Sandbox
          </TabsTrigger>
          <TabsTrigger value="impact" className="gap-1.5 px-3 text-xs">
            <TrendingUp className="size-3.5" /> Impact
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

function Header({
  escrowBalance,
  onOpenEscrow,
}: {
  escrowBalance: number;
  onOpenEscrow: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Landmark className="size-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">
              GovInnovate OS · Procure & Scale
            </p>
            <p className="text-xs text-muted-foreground">
              Government of Maharashtra · SIH 2026
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onOpenEscrow}
          >
            <Wallet className="size-4 text-[#FF6B35]" />
            <span className="hidden sm:inline text-xs">Escrow Vault</span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-[#FF6B35]/40 bg-[#FF6B35]/15 px-2 py-0.5 font-mono text-xs font-bold text-[#FF6B35]">
              {compactCurrency(escrowBalance)}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}

function DpiitBadge() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-emerald-600/30 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
      <BadgeCheck className="size-4 shrink-0" />
      <span>
        <span className="font-semibold">DPIIT Registered:</span> Turnover &
        Experience Requirements Waived
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section heading helper                                               */
/* ------------------------------------------------------------------ */

function SectionHeading({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4.5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Department Panel                                                     */
/* ------------------------------------------------------------------ */

function OutcomeForm({
  onSubmit,
  prefill,
}: {
  onSubmit: (form: Omit<Challenge, "id" | "created_at">) => void;
  prefill?: ChallengePrefill | null;
}) {
  const [title, setTitle] = useState(prefill?.title ?? "");
  const [description, setDescription] = useState("");
  const [targetMetrics, setTargetMetrics] = useState(prefill?.target_metrics ?? "");
  const [budget, setBudget] = useState("");
  const [department, setDepartment] = useState(prefill?.department_name ?? "");
  const [sandboxTemplate, setSandboxTemplate] = useState("Geofenced Urban Zone");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const budgetValue = Number(budget);
    if (!title || !description || !targetMetrics || !department) {
      setError("Please complete all fields.");
      return;
    }
    if (!budgetValue || budgetValue <= 0) {
      setError("Enter a valid budget amount.");
      return;
    }
    onSubmit({
      title,
      description,
      target_metrics: targetMetrics,
      budget_allocation: budgetValue,
      department_name: department,
      sandbox_template: sandboxTemplate,
    });
    setTitle("");
    setDescription("");
    setTargetMetrics("");
    setBudget("");
    setDepartment("");
    setSandboxTemplate("Geofenced Urban Zone");
    setError("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="size-4" /> Publish Outcome-Based Challenge
        </CardTitle>
        <CardDescription>
          Frame the problem around measurable outcomes, not prescribed
          solutions.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="title">Challenge Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. AI-Driven Land Record Dispute Prediction"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                placeholder="e.g. Revenue & Land Records"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="budget">Budget Allocation</Label>
              <div className="relative">
                <IndianRupee className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="budget"
                  type="number"
                  min={1}
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  className="pl-8"
                  placeholder="25000000"
                />
              </div>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="sandbox-template">Sandbox Template</Label>
              <select
                id="sandbox-template"
                value={sandboxTemplate}
                onChange={(event) => setSandboxTemplate(event.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="Geofenced Urban Zone">Geofenced Urban Zone</option>
                <option value="Synthetic Data Testbed">Synthetic Data Testbed</option>
                <option value="Shadow Telemetry Mode">Shadow Telemetry Mode</option>
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="metrics">Target Metrics</Label>
              <Input
                id="metrics"
                value={targetMetrics}
                onChange={(event) => setTargetMetrics(event.target.value)}
                placeholder="e.g. Achieve 95% identification rate"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                placeholder="Describe the problem statement in measurable, outcome-oriented terms…"
              />
            </div>
          </div>
          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button type="submit" className="gap-2">
            <Plus /> Publish Challenge
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function PublishedChallengesTable({
  challenges,
}: {
  challenges: Challenge[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ClipboardCheck className="size-4" /> Published Challenges
        </CardTitle>
        <CardDescription>
          {challenges.length} problem statement{challenges.length === 1 ? "" : "s"} open to startups.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="pb-3 pr-4 font-medium">Title</th>
              <th className="pb-3 pr-4 font-medium">Department</th>
              <th className="pb-3 pr-4 font-medium">Target Metric</th>
              <th className="pb-3 pr-4 font-medium">Budget</th>
              <th className="pb-3 font-medium">Published</th>
            </tr>
          </thead>
          <tbody>
            {challenges.map((challenge) => (
              <tr
                key={challenge.id}
                className="border-b border-border/60 last:border-0"
              >
                <td className="py-3 pr-4 font-medium">{challenge.title}</td>
                <td className="py-3 pr-4 text-muted-foreground">
                  {challenge.department_name}
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  {challenge.target_metrics}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  {currency(challenge.budget_allocation)}
                </td>
                <td className="py-3 text-muted-foreground">
                  {challenge.created_at}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function DepartmentPanel({
  challenges,
  onSubmit,
  prefill,
}: {
  challenges: Challenge[];
  onSubmit: (form: Omit<Challenge, "id" | "created_at">) => void;
  prefill?: ChallengePrefill | null;
}) {
  return (
    <div className="space-y-6">
      <SectionHeading
        icon={Landmark}
        title="Government Department Panel"
        description="Author problem statements, set budgets and manage an open call for solutions."
      />
      <OutcomeForm
        key={prefill ? JSON.stringify(prefill) : "initial"}
        onSubmit={onSubmit}
        prefill={prefill}
      />
      <PublishedChallengesTable challenges={challenges} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Startup Hub                                                         */
/* ------------------------------------------------------------------ */

function ChallengeCard({
  challenge,
  isApplied,
  onApply,
}: {
  challenge: Challenge;
  isApplied: boolean;
  onApply: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary">{challenge.department_name}</Badge>
          <span className="text-xs text-muted-foreground">
            Published {challenge.created_at}
          </span>
        </div>
        <CardTitle className="mt-1 text-base">{challenge.title}</CardTitle>
        <CardDescription>{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm">
          <Target className="size-4 shrink-0 text-primary" />
          <span className="text-muted-foreground">Target: </span>
          <span className="font-medium">{challenge.target_metrics}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Wallet className="size-4 shrink-0 text-muted-foreground" />
          <span className="text-muted-foreground">Budget: </span>
          <span className="font-semibold">{currency(challenge.budget_allocation)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full gap-2"
          variant={isApplied ? "secondary" : "default"}
          disabled={isApplied}
          onClick={onApply}
        >
          {isApplied ? (
            <>
              <CheckCircle2 /> Applied · GFR 173(i) Exempted
            </>
          ) : (
            <>
              <Handshake /> One-Click Apply · GFR 173(i)
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function PipelineTimeline({ pilot }: { pilot: Pilot }) {
  const steps = ["Discover & Apply", "Proof of Concept", "Pilot Rollout", "Go / No-Go Review"];
  const activeIndex = pilot.current_milestone - 1;
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{pilot.startup_name}</span>
            <Badge
              variant="outline"
              className="border-sky-600/30 text-sky-700 dark:text-sky-300"
            >
              <BadgeCheck className="size-3" /> DPIIT Verified · {dippNumber(pilot.id)}
            </Badge>
            <Badge
              variant="outline"
              className="border-emerald-600/30 text-emerald-700 dark:text-emerald-300"
            >
              Milestone {pilot.current_milestone} of {pilot.total_milestones}
            </Badge>
          </div>
          <Badge
            variant={pilot.status === "scaled_up" ? "default" : "outline"}
            className={
              pilot.status === "scaled_up"
                ? "bg-emerald-600 text-white hover:bg-emerald-600"
                : undefined
            }
          >
            {STATUS_LABEL[pilot.status]}
          </Badge>
        </div>

        <ol className="grid gap-2 sm:grid-cols-4">
          {steps.map((step, index) => {
            const isReached = index <= activeIndex;
            const isCurrent = index === activeIndex && pilot.status === "active";
            return (
              <li key={step} className="relative">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex size-6 items-center justify-center rounded-full border text-xs font-semibold ${
                        isReached
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      {isReached ? <CheckCircle2 className="size-3.5" /> : index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 rounded ${
                          index < activeIndex && pilot.status === "active"
                            ? "bg-emerald-600"
                            : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                  <p
                    className={`pr-1 text-xs ${
                      isCurrent
                        ? "font-semibold text-foreground"
                        : isReached
                          ? "text-foreground"
                          : "text-muted-foreground"
                    }`}
                  >
                    {step}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Startup Hub                                                          */
/* ------------------------------------------------------------------ */

const defaultEvidenceFor = (pilot: Pilot): string => {
  if (pilot.id === "p1")
    return "The pilot achieved 94% identification rate across the 5km geofenced urban zone; dashboard uptime maintained 24/7; anonymized PII handled at the edge with no breach.";
  if (pilot.id === "p2")
    return "CivicFlow delivered the grievance pipeline with 92% SLA adherence; synthetic testbed ran 40,000 iterations with anomaly deviation held under 2%.";
  if (pilot.id === "p3")
    return "Mandibazaar onboarded 5,000 procurement listings; vendor verification accuracy reached 88%; final geospatial certificate integration pending.";
  return "Milestone deliverable submitted with operational telemetry attached; core KPI aligned to the challenge target metric.";
};

function StartupHub({
  challenges,
  pilots,
  evidenceFeed,
  onApply,
  onAdvance,
  onSubmitEvidence,
}: {
  challenges: Challenge[];
  pilots: Pilot[];
  evidenceFeed: Record<string, string>;
  onApply: (challengeId: string) => void;
  onAdvance: (pilotId: string) => void;
  onSubmitEvidence: (pilotId: string, content: string) => void;
}) {
  const appliedIds = new Set(pilots.map((pilot) => pilot.challenge_id));
  const activePilots = pilots.filter(
    (pilot) => pilot.status === "active" || pilot.status === "completed"
  );
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={Rocket}
        title="Startup Hub Workspace"
        description="Browse live challenges and manage your active pilots."
        action={<DpiitBadge />}
      />
      <div>
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Open Challenges
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              isApplied={appliedIds.has(challenge.id)}
              onApply={() => onApply(challenge.id)}
            />
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          My Active Pilots
        </h3>
        {activePilots.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
              <Rocket className="size-8 text-muted-foreground/50" />
              <p className="text-sm font-medium">No active pilots yet</p>
              <p className="text-sm text-muted-foreground">
                Apply to a challenge to start your first pilot.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activePilots.map((pilot) => (
              <div key={pilot.id} className="space-y-2">
                <PipelineTimeline pilot={pilot} />
                {pilot.status === "active" && (
                  <div className="space-y-2">
                    {evidenceFeed[pilot.id] ? (
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-600/30 bg-emerald-500/5 px-3 py-2">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="size-4" /> Evidence feed submitted
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => onAdvance(pilot.id)}
                        >
                          Submit Milestone <ArrowRight />
                        </Button>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-border bg-muted/40 p-3">
                        <div className="space-y-2">
                          <Label
                            htmlFor={`evidence-${pilot.id}`}
                            className="text-xs text-muted-foreground"
                          >
                            Milestone evidence · description, link or KPIs achieved
                          </Label>
                          <Textarea
                            id={`evidence-${pilot.id}`}
                            rows={3}
                            placeholder="e.g. Achieved 94% identification rate in the 5km geofenced zone; dashboard live 24/7; anonymized PII handled at the edge."
                            value={drafts[pilot.id] ?? ""}
                            onChange={(e) =>
                              setDrafts((prev) => ({
                                ...prev,
                                [pilot.id]: e.target.value,
                              }))
                            }
                            className="bg-background/60"
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              className="gap-2"
                              onClick={() =>
                                onSubmitEvidence(pilot.id, drafts[pilot.id] ?? "")
                              }
                            >
                              <Send className="size-4" /> Submit Milestone Evidence
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2"
                              onClick={() => onAdvance(pilot.id)}
                            >
                              Advance Milestone <ArrowRight />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    {evidenceFeed[pilot.id] && (
                      <p className="max-w-xl truncate text-xs text-muted-foreground">
                        Latest: {evidenceFeed[pilot.id]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Evaluator Panel                                                      */
/* ------------------------------------------------------------------ */

function PhaseMatrix({ pilot }: { pilot: Pilot }) {
  const week = Math.max(0, (pilot.current_milestone - 1) * 2);
  const coverage =
    pilot.status === "scaled_up"
      ? 100
      : Math.min(96, 40 + pilot.current_milestone * 16);
  return (
    <div className="grid grid-cols-3 gap-4">
      {[
        { label: "Milestone", value: `${pilot.current_milestone}/${pilot.total_milestones}` },
        { label: "Week", value: week.toString() },
        { label: "Coordinate", value: `${pilot.startup_name.split(" ")[0]} Desk` },
      ].map((item) => (
        <div key={item.label} className="rounded-lg bg-muted/60 px-3 py-2">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {item.label}
          </p>
          <p className="truncate text-sm font-semibold">{item.value}</p>
        </div>
      ))}

      <div className="col-span-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Completion coverage</span>
          <span className="font-medium">{coverage}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${coverage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function EvaluatorPanel({
  pilots,
  evaluations,
  evidenceFeed,
  challenges,
  onEvaluate,
}: {
  pilots: Pilot[];
  evaluations: DbEvaluation[];
  evidenceFeed: Record<string, string>;
  challenges: Challenge[];
  onEvaluate: (pilot: Pilot) => void;
}) {
  const active = pilots.filter((pilot) => pilot.status === "active");
  const ready = pilots.filter((pilot) => pilot.status === "completed");
  const scaled = pilots.filter((pilot) => pilot.status === "scaled_up");
  const evaluationOf = new Map(evaluations.map((e) => [e.pilot_id, e]));
  const challengeOf = new Map(challenges.map((c) => [c.id, c]));

  const [screened, setScreened] = useState<Record<string, number>>({});
  const [screening, setScreening] = useState<{
    pilot: Pilot;
    result: AnalysisResult | null;
    loading: boolean;
    evidence: string;
    usedDefault: boolean;
  } | null>(null);

  const runScreen = async (pilot: Pilot) => {
    const challenge = challengeOf.get(pilot.challenge_id ?? "");
    const target_metrics =
      challenge?.target_metrics ??
      "Achieve measurable KPI aligned to the challenge objective";
    const submitted = (evidenceFeed[pilot.id] ?? "").trim();
    const usedDefault = !submitted;
    const evidence = usedDefault ? defaultEvidenceFor(pilot) : submitted;
    setScreening({ pilot, result: null, loading: true, evidence, usedDefault });
    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evidence_text: evidence, target_metrics }),
      });
      if (!res.ok) throw new Error("Analysis request failed");
      const data = (await res.json()) as AnalysisResult;
      setScreened((prev) => ({ ...prev, [pilot.id]: data.score }));
      setScreening({ pilot, result: data, loading: false, evidence, usedDefault });
    } catch {
      setScreening({ pilot, result: null, loading: false, evidence, usedDefault });
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={ShieldCheck}
        title="Technical Evaluator Panel"
        description="Audit active pilots against their phase metrics and clear scale-up clearance."
      />
      <DecimalStats
        rows={[
          { label: "Active Pilots", value: active.length, icon: Users },
          { label: "Ready for Scale-Up", value: ready.length, icon: TrendingUp },
          { label: "Scale-Ups Approved", value: scaled.length, icon: Trophy },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardCheck className="size-4" /> Pilot Audit Tracker
          </CardTitle>
          <CardDescription>
            Phase metrics and clearance actions for all startup pilots.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Startup</th>
                <th className="pb-3 pr-4 font-medium">Phase Metrics</th>
                <th className="pb-3 pr-4 font-medium">QCBS Weighted Score</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">Progress</th>
                <th className="pb-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {pilots.map((pilot) => {
                const evaluation = evaluationOf.get(pilot.id);
                return (
                  <tr
                    key={pilot.id}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {initials(pilot.startup_name)}
                        </div>
                        <div className="leading-tight">
                          <span className="font-medium">{pilot.startup_name}</span>
                          {screened[pilot.id] !== undefined && (
                            <span className="ml-1.5 inline-flex items-center gap-1 rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/10 px-2 py-0.5 font-mono text-[11px] font-bold text-[#FF6B35]">
                              <Sparkles className="size-3" /> AI {screened[pilot.id]}%
                            </span>
                          )}
                          {evidenceFeed[pilot.id] && (
                            <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                              <CheckCircle2 className="size-3 text-emerald-500" />
                              Milestone evidence feed received
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <PhaseMatrix pilot={pilot} />
                    </td>
                    <td className="py-4 pr-4">
                      {evaluation ? (
                        <span
                          className={`inline-flex items-center gap-1.5 font-mono font-bold ${
                            evaluation.is_approved
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {evaluation.weighted_score}%
                          {evaluation.is_approved && (
                            <BadgeCheck className="size-3.5" />
                          )}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Pending</span>
                      )}
                    </td>
                    <td className="py-4 pr-4">
                      <Badge
                        variant="outline"
                        className={
                          pilot.status === "scaled_up"
                            ? "border-emerald-600/30 text-emerald-700 dark:text-emerald-300"
                            : undefined
                        }
                      >
                        {STATUS_LABEL[pilot.status]}
                      </Badge>
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground">
                      {pilot.current_milestone}/{pilot.total_milestones} milestones
                    </td>
                    <td className="py-4 text-right">
                      {pilot.status === "scaled_up" ? (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                          <CheckCircle2 className="size-4" /> Approved
                        </span>
                      ) : (
                        <div className="flex flex-col items-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => runScreen(pilot)}
                            disabled={screening?.loading ?? false}
                          >
                            {screening?.pilot.id === pilot.id && screening.loading ? (
                              <Loader2 className="size-4 animate-spin text-[#FF6B35]" />
                            ) : (
                              <Sparkles className="size-4 text-[#FF6B35]" />
                            )}
                            AI Screening
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => onEvaluate(pilot)}
                          >
                            <Sliders className="size-4" /> Audit & Evaluate
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {screening && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-[#FF6B35]" /> AI Evidence Screening ·{" "}
              {screening.pilot.startup_name}
            </CardTitle>
            <CardDescription>
              Assistive readiness check against the challenge target metrics (human QCBS
              review remains the approval gate).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {screening.loading ? (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
                <Loader2 className="size-5 animate-spin text-[#FF6B35]" />
                Running AI readiness screening against target metrics…
              </div>
            ) : screening.result ? (
              <>
                <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
                  <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-muted/40 px-6 py-4">
                    <p
                      className={`font-mono text-4xl font-black ${
                        screening.result.score >= 80
                          ? "text-emerald-400"
                          : screening.result.score >= 60
                            ? "text-amber-400"
                            : "text-[#FF6B35]"
                      }`}
                    >
                      {screening.result.score}
                    </p>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Readiness score
                    </p>
                    <Badge
                      variant="outline"
                      className={
                        screening.result.score >= 80
                          ? "border-[#FF6B35]/40 text-[#FF6B35]"
                          : undefined
                      }
                    >
                      {screening.result.mode === "llm" ? "LLM · AI" : "Heuristic fallback"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Readiness level</span>
                      <span className="font-mono font-bold">
                        {screening.result.score >= 80
                          ? "Ready for scale-up review"
                          : screening.result.score >= 60
                            ? "Partial — inspect findings"
                            : "Gap — extra evidence needed"}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-[#FF6B35] transition-all"
                        style={{ width: `${screening.result.score}%` }}
                      />
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {screening.result.summary}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-muted/40 p-3">
                  <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                    Evidence screened
                  </p>
                  <p className="text-sm leading-relaxed text-foreground">
                    {screening.evidence}
                  </p>
                  {screening.usedDefault && (
                    <p className="mt-1 text-[11px] text-amber-500">
                      No submitted evidence for this pilot — screened against the default
                      demo evidence feed.
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Findings with citations
                  </p>
                  {screening.result.findings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl border border-border p-3"
                    >
                      <Badge
                        variant="outline"
                        className={
                          finding.verdict === "met"
                            ? "border-emerald-600/30 text-emerald-600 dark:text-emerald-400"
                            : finding.verdict === "partial"
                              ? "border-amber-600/30 text-amber-600 dark:text-amber-400"
                              : "border-rose-600/30 text-rose-600 dark:text-rose-400"
                        }
                      >
                        {finding.verdict}
                      </Badge>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{finding.area}</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {finding.citation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-rose-500">
                AI screening failed — please retry, or proceed with the manual QCBS rubric.
              </p>
            )}
          </CardContent>
          {screening.result && !screening.loading && (
            <CardFooter className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                Screening is assistive only — the QCBS rubric is the human approval gate.
              </p>
              <Button size="sm" variant="outline" className="gap-2" onClick={() => onEvaluate(screening.pilot)}>
                <Sliders className="size-4" /> Audit & Evaluate {screening.pilot.startup_name}
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
}

function DecimalStats({
  rows,
}: {
  rows: { label: string; value: number; icon: React.ElementType }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {rows.map((row) => (
        <Card key={row.label}>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <row.icon className="size-5" />
            </div>
            <div>
              <p className="font-mono text-2xl font-black leading-none">{row.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{row.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Impact panel (policymaker analytics)                                 */
/* ------------------------------------------------------------------ */

function ImpactPanel({ impact }: { impact: ImpactMetrics }) {
  const funnelSteps = [
    { label: "Published Challenges", value: impact.funnel.published },
    { label: "Startups Onboarded", value: impact.funnel.applied },
    { label: "Pilots Completed", value: impact.funnel.completed },
    { label: "Scale-Ups Approved", value: impact.funnel.scaled },
  ];
  const funnelMax = Math.max(impact.funnel.published, 1);

  const kpi = [
    { label: "Challenges Published", value: String(impact.funnel.published), icon: FileText, accent: false },
    { label: "Startups Onboarded", value: String(impact.funnel.applied), icon: Rocket, accent: true },
    { label: "Scale-Ups Approved", value: String(impact.funnel.scaled), icon: Trophy, accent: true },
    { label: "Escrow Managed", value: compactCurrency(impact.escrowAllocated), icon: Wallet, accent: true },
  ];

  const sectorMax = Math.max(impact.sectors[0]?.challenges ?? 0, 1);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={TrendingUp}
        title="Policymaker Impact"
        description="Live funnel, budget utilisation and pipeline velocity computed from challenge & pilot data."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpi.map((k) => (
          <Card key={k.label}>
            <CardContent className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <k.icon className="size-5" />
              </div>
              <div>
                <p
                  className={`font-mono text-2xl font-black leading-none ${
                    k.accent ? "text-[#FF6B35]" : ""
                  }`}
                >
                  {k.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{k.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardCheck className="size-4 text-[#FF6B35]" /> Innovation Funnel
            </CardTitle>
            <CardDescription>
              Conversion of published challenges into scaled-up pilots.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {funnelSteps.map((step, idx) => (
              <div key={step.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium">{step.label}</span>
                  <span className="font-mono font-bold text-muted-foreground">
                    {step.value}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${
                      idx === funnelSteps.length - 1
                        ? "bg-[#FF6B35]"
                        : "bg-primary"
                    }`}
                    style={{ width: `${Math.round((step.value / funnelMax) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="size-4 text-[#FF6B35]" /> Budget & Escrow Utilisation
            </CardTitle>
            <CardDescription>
              State funds parked vs. milestone-linked tranches disbursed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Challenge Budget", value: compactCurrency(impact.challengeBudget) },
                { label: "In Pilot Tranches", value: compactCurrency(impact.trancheBudget) },
                { label: "Escrow Disbursed", value: compactCurrency(impact.escrowDisbursed) },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-muted/60 p-3">
                  <p className="font-mono text-sm font-black text-[#FF6B35]">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Escrow utilisation</span>
                <span className="font-mono font-bold">{impact.escrowUtilization}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-[#FF6B35] transition-all"
                  style={{ width: `${Math.min(impact.escrowUtilization, 100)}%` }}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-[#FF6B35]/40 font-mono text-[#FF6B35]">
                Approval rate · {impact.approvalRate ?? 0}%
              </Badge>
              <Badge variant="outline" className="border-[#FF6B35]/40 font-mono text-[#FF6B35]">
                Avg QCBS · {impact.avgWeightedScore !== null ? `${impact.avgWeightedScore.toFixed(1)}%` : "—"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="size-4 text-[#FF6B35]" /> Sector Distribution
            </CardTitle>
            <CardDescription>
              Published challenges grouped by line of department.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {impact.sectors.length === 0 ? (
              <p className="text-sm text-muted-foreground">No challenges published yet.</p>
            ) : (
              impact.sectors.map((sector) => (
                <div key={sector.name}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{sector.name}</span>
                    <span className="font-mono font-bold text-muted-foreground">
                      {sector.challenges} challenge{sector.challenges === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.round((sector.challenges / sectorMax) * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="size-4 text-[#FF6B35]" /> Velocity Insights
            </CardTitle>
            <CardDescription>
              Pipeline throughput and average pilot progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted/60 p-3">
                <p className="font-mono text-xl font-black text-[#FF6B35]">
                  {impact.medianDaysToComplete !== null
                    ? `${impact.medianDaysToComplete}d`
                    : "—"}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                  Median days to complete
                </p>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <p className="font-mono text-xl font-black text-[#FF6B35]">
                  {impact.activePilots}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                  Pilots in flight
                </p>
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Avg milestone progress</span>
                <span className="font-mono font-bold">{impact.avgMilestoneProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${impact.avgMilestoneProgress}%` }}
                />
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {impact.medianDaysToComplete !== null
                ? `Approved pilots clear the full pipeline in a median of ${impact.medianDaysToComplete} days, from applied to scale-up order.`
                : "Approve a completed pilot through the Evaluator panel to populate velocity metrics."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page root                                                           */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const {
    challenges,
    pilots,
    isLive,
    toast,
    publishChallenge,
    applyToChallenge,
    advanceMilestone,
    submitEvaluation,
    lockSandboxConfig,
    evaluations,
    escrow,
    evidenceFeed,
    submitMilestoneEvidence,
    notify,
  } = useDashboard();

  const [persona, setPersona] = useState("department");
  const [challengePrefill, setChallengePrefill] = useState<ChallengePrefill | null>(
    null
  );
  const [evaluatingPilot, setEvaluatingPilot] = useState<Pilot | null>(null);
  const [escrowOpen, setEscrowOpen] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);

  const impact = useMemo(
    () => computeImpact(challenges, pilots, evaluations, escrow),
    [challenges, pilots, evaluations, escrow]
  );

  const handleUseInChallenge = (prefill: ChallengePrefill) => {
    setChallengePrefill({ ...prefill });
    setPersona("department");
  };

  const handleEvaluationConfirm = async (scores: EvaluationScores) => {
    if (!evaluatingPilot) return;
    const result = await submitEvaluation(evaluatingPilot.id, scores);
    if (!result) return;
    setEvaluatingPilot(null);
    if (result.approved) setEscrowOpen(true);
  };

  const runAutoDemo = async () => {
    if (demoRunning) return;
    const target = pilots.find((pilot) => pilot.status !== "scaled_up");
    if (!target) {
      notify("Every pilot is scale-up approved — apply to a challenge to re-run the demo.");
      return;
    }
    setDemoRunning(true);
    setPersona("evaluator");
    notify(`Auto-demo: Technical Evaluation opened for ${target.startup_name}.`);
    await new Promise((resolve) => window.setTimeout(resolve, 1400));
    setEvaluatingPilot(target);
    await new Promise((resolve) => window.setTimeout(resolve, 2000));
    setEvaluatingPilot(null);
    const result = await submitEvaluation(target.id, {
      technical_merit: 95,
      kpi_accuracy: 92,
      cybersecurity: 98,
      scalability: 88,
    });
    if (result?.approved) setEscrowOpen(true);
    setDemoRunning(false);
  };

  return (
    <div className="flex flex-1 flex-col">
      <Header
        escrowBalance={escrow.vault_balance}
        onOpenEscrow={() => setEscrowOpen(true)}
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {/* Intro hero */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-3 gap-1.5">
              <Landmark className="size-3" /> SIH 2026 · Smart Automation
            </Badge>
            <h1 className="font-serif text-3xl font-normal tracking-tight sm:text-4xl">
              Public Procurement with a{" "}
              <em className="bg-gradient-to-r from-[#FF6B35] via-[#FFA07A] to-[#FFFFFF] bg-clip-text italic text-transparent">
                startup-first
              </em>{" "}
              mindset.
            </h1>
            <p className="mt-2 text-muted-foreground">
              A unified demo portal spanning government problem-setting, startup
              piloting and technical evaluation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/40 px-3.5 py-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="size-4 text-emerald-600" /> DPIIT-backed
              </span>
              <span className="h-4 w-px bg-border" />
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4" /> Outcome-based
              </span>
              <span className="h-4 w-px bg-border" />
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                  isLive
                    ? "text-sky-700 dark:text-sky-300"
                    : "text-amber-700 dark:text-amber-300"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    isLive ? "bg-sky-500" : "bg-amber-500"
                  }`}
                />
                {isLive ? "Live · Supabase" : "Demo · Mock data"}
              </span>
            </div>
            <Button
              type="button"
              size="sm"
              className="gap-2"
              onClick={runAutoDemo}
              disabled={demoRunning}
            >
              <Zap className="size-4" />
              {demoRunning ? "Running Auto-Demo…" : "Run Auto-Demo"}
            </Button>
          </div>
        </div>

        <Tabs value={persona} onValueChange={setPersona}>
          <div className="mb-6">
            <PersonaSwitcher value={persona} onChange={setPersona} />
          </div>
          <TabsContent value="department">
            <DepartmentPanel
              challenges={challenges}
              onSubmit={publishChallenge}
              prefill={challengePrefill}
            />
          </TabsContent>
          <TabsContent value="startup">
            <StartupHub
              challenges={challenges}
              pilots={pilots}
              evidenceFeed={evidenceFeed}
              onApply={applyToChallenge}
              onAdvance={advanceMilestone}
              onSubmitEvidence={submitMilestoneEvidence}
            />
          </TabsContent>
          <TabsContent value="evaluator">
            <EvaluatorPanel
              pilots={pilots}
              evaluations={evaluations}
              evidenceFeed={evidenceFeed}
              challenges={challenges}
              onEvaluate={setEvaluatingPilot}
            />
          </TabsContent>
          <TabsContent value="templates">
            <TemplateStudio onUseInChallenge={handleUseInChallenge} />
          </TabsContent>
          <TabsContent value="sandbox">
            <div className="space-y-6">
              <SandboxStudio pilots={pilots} onLock={lockSandboxConfig} />
              <SandboxTable pilots={pilots} />
            </div>
          </TabsContent>
          <TabsContent value="impact">
            <ImpactPanel impact={impact} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border py-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 text-sm text-muted-foreground sm:px-6">
          <p>Smart Automation · Startup-Friendly Public Procurement</p>
          <p className="inline-flex items-center gap-1.5">
            <Handshake className="size-4" /> For hackathon judging demo
          </p>
        </div>
      </footer>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-600/30 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 shadow-lg dark:bg-emerald-500/10 dark:text-emerald-200">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
            {toast}
          </div>
        </div>
      )}

      {evaluatingPilot && (
        <EvalRubricModal
          key={evaluatingPilot.id}
          pilot={evaluatingPilot}
          existing={evaluations.find((e) => e.pilot_id === evaluatingPilot.id) ?? null}
          onClose={() => setEvaluatingPilot(null)}
          onConfirm={handleEvaluationConfirm}
        />
      )}

      <EscrowDrawer
        open={escrowOpen}
        onClose={() => setEscrowOpen(false)}
        escrow={escrow}
      />
    </div>
  );
}
