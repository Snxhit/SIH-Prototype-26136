"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ShieldCheck, TrendingDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DPIIT_SCORE,
  EVALUATION_THRESHOLD,
  SLIDER_MAX,
  SLIDER_MIN,
  computeWeightedScore,
  type EvaluationScores,
} from "@/lib/evaluations";

const SLIDERS: { key: PillarKey; title: string; weight: number; hint: string }[] = [
  { key: "technical_merit", title: "Technical Merit & Sandbox Isolation", weight: 30, hint: "POC quality, sandbox fit and engineering maturity." },
  { key: "kpi_accuracy", title: "Outcome KPI Accuracy Match", weight: 25, hint: "Demonstrated accuracy against the challenge target KPI." },
  { key: "cybersecurity", title: "Cyber Security & Data Localization", weight: 20, hint: "CERT-In posture, encryption and data residency controls." },
  { key: "scalability", title: "Commercial & District Scalability", weight: 15, hint: "Path from pilot to state-wide multi-ULB rollout." },
];

type PillarKey = "technical_merit" | "kpi_accuracy" | "cybersecurity" | "scalability";

export default function EvalRubricModal({
  pilot,
  existing,
  onClose,
  onConfirm,
}: {
  pilot: { id: string; startup_name: string };
  existing?: Partial<EvaluationScores> | null;
  onClose: () => void;
  onConfirm: (scores: EvaluationScores) => Promise<void>;
}) {
  const [scores, setScores] = useState<Record<PillarKey, number>>({
    technical_merit: existing?.technical_merit ?? 95,
    kpi_accuracy: existing?.kpi_accuracy ?? 92,
    cybersecurity: existing?.cybersecurity ?? 98,
    scalability: existing?.scalability ?? 88,
  });
  const [submitting, setSubmitting] = useState(false);

  const total = useMemo(
    () => computeWeightedScore({ ...scores, dpiit_recognition: DPIIT_SCORE }),
    [scores]
  );
  const approved = total >= EVALUATION_THRESHOLD;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm(scores);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-xl animate-in space-y-4 rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <ShieldCheck className="size-4 text-emerald-500" />
              Technical Evaluation & Audit Matrix
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {pilot.startup_name} · QCBS weighted scoring, direct GeM conversion at ≥{" "}
              {EVALUATION_THRESHOLD}%
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs">
          {SLIDERS.map(({ key, title, weight, hint }) => (
            <div key={key}>
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <div>
                  <span className="font-semibold">{title}</span>
                  <span className="ml-1.5 text-muted-foreground">({weight}% weight)</span>
                </div>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {scores[key]}%
                </span>
              </div>
              <input
                type="range"
                min={SLIDER_MIN}
                max={SLIDER_MAX}
                value={scores[key]}
                onChange={(event) =>
                  setScores((prev) => ({ ...prev, [key]: Number(event.target.value) }))
                }
                className="w-full accent-emerald-500"
                aria-label={title}
              />
              <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>
            </div>
          ))}

          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-2.5">
            <div>
              <span className="font-semibold">DPIIT Startup Recognition Gate</span>
              <span className="ml-1.5 text-muted-foreground">(10% weight)</span>
            </div>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {DPIIT_SCORE}% (Verified)
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-muted/60 p-4">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Weighted Aggregate Score
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {approved
                  ? "Clears threshold · direct GeM conversion eligible"
                  : "Below 85.0% · scale-up not cleared"}
              </span>
            </div>
            <span
              className={`font-mono text-2xl font-black ${
                approved
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {total.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={submitting} className="gap-2">
            {approved ? <CheckCircle2 className="size-4" /> : <TrendingDown className="size-4" />}
            {submitting
              ? "Saving…"
              : approved
                ? "Approve & Release Escrow"
                : "Record Evaluation"}
          </Button>
        </div>
      </div>
    </div>
  );
}