"use client";

import { useState } from "react";
import { Check, CloudCog, FlaskConical, Lock, MapPinned, Plus, ShieldAlert, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  type SandboxConfig,
  type SandboxPilot,
  SANDBOX_CLOUD,
  SANDBOX_DURATION,
  SANDBOX_ENVIRONMENT_OPTIONS,
  SANDBOX_PRIVACY_OPTIONS,
  SANDBOX_ROLLBACK,
  SANDBOX_STOP_LOSS_OPTIONS,
} from "@/lib/sandbox";

const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function readonlyField(label: string, value: string) {
  return (
    <div>
      <Label className="text-xs font-semibold text-muted-foreground">{label}</Label>
      <div className="mt-0.5 rounded-lg bg-muted/60 px-2.5 py-1.5 text-xs font-medium text-muted-foreground opacity-75">
        {value}
      </div>
    </div>
  );
}

function SandboxConfigForm({
  pilot,
  onLock,
}: {
  pilot: SandboxPilot;
  onLock: (pilotId: string, config: SandboxConfig) => Promise<void> | void;
}) {
  const [environment, setEnvironment] = useState(pilot.environment);
  const [dataPrivacy, setDataPrivacy] = useState(pilot.data_privacy);
  const [stopLoss, setStopLoss] = useState(pilot.stop_loss);
  const [locked, setLocked] = useState(false);

  const handleLock = async () => {
    await onLock(pilot.id, {
      environment,
      data_privacy: dataPrivacy,
      stop_loss: stopLoss,
      ip_retainment: pilot.ip_retainment,
    });
    setLocked(true);
    setTimeout(() => setLocked(false), 2500);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center gap-2.5 space-y-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-xs font-bold text-sky-600 dark:text-sky-400">
              1
            </div>
            <div>
              <CardTitle className="text-xs font-bold">Environment & Isolation Scope</CardTitle>
              <p className="text-[11px] leading-snug text-muted-foreground">
                Define the physical or digital perimeter of the trial.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs">
              <MapPinned className="size-3.5 text-muted-foreground" />
              <span className="font-semibold text-muted-foreground">Trial Perimeter Type</span>
            </div>
            <select
              value={environment}
              onChange={(event) => setEnvironment(event.target.value)}
              className={selectClass}
            >
              {SANDBOX_ENVIRONMENT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {readonlyField("Max Pilot Duration", SANDBOX_DURATION)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2.5 space-y-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              2
            </div>
            <div>
              <CardTitle className="text-xs font-bold">Data Access & Security Protocol</CardTitle>
              <p className="text-[11px] leading-snug text-muted-foreground">
                Enforce government citizen data protections.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs">
              <CloudCog className="size-3.5 text-muted-foreground" />
              <span className="font-semibold text-muted-foreground">Data Ingestion Mode</span>
            </div>
            <select
              value={dataPrivacy}
              onChange={(event) => setDataPrivacy(event.target.value)}
              className={selectClass}
            >
              {SANDBOX_PRIVACY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {readonlyField("Cloud Infrastructure", SANDBOX_CLOUD)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2.5 space-y-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-xs font-bold text-purple-600 dark:text-purple-400">
              3
            </div>
            <div>
              <CardTitle className="text-xs font-bold">Risk Thresholds & Stop-Loss</CardTitle>
              <p className="text-[11px] leading-snug text-muted-foreground">
                Automated fallback conditions if errors occur.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs">
              <ShieldAlert className="size-3.5 text-muted-foreground" />
              <span className="font-semibold text-muted-foreground">Max Error Tolerance</span>
            </div>
            <select
              value={stopLoss}
              onChange={(event) => setStopLoss(event.target.value)}
              className={selectClass}
            >
              {SANDBOX_STOP_LOSS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {readonlyField("Failure Rollback Action", SANDBOX_ROLLBACK)}
          </CardContent>
        </Card>
      </div>

      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardContent className="text-sm text-muted-foreground">
          Locking deploys these isolation controls to{" "}
          <span className="font-medium text-foreground">{pilot.startup_name}</span> across all
          connected views. IP retainment stays at{" "}
          <span className="font-medium text-foreground">{pilot.ip_retainment}</span>.
        </CardContent>
        <CardHeader className="pt-0 sm:pt-0">
          <Button onClick={handleLock} className="gap-2">
            {locked ? <Check className="size-4 text-emerald-300" /> : <Lock className="size-4 text-emerald-300" />}
            {locked ? "Parameters Locked" : "Lock & Deploy Parameters"}
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
}

export default function SandboxStudio({
  pilots,
  onLock,
}: {
  pilots: SandboxPilot[];
  onLock: (pilotId: string, config: SandboxConfig) => Promise<void> | void;
}) {
  const configurable = pilots.filter((pilot) => pilot.status !== "scaled_up");
  const [selectedId, setSelectedId] = useState<string>(configurable[0]?.id ?? "");
  const selectedPilot =
    configurable.find((pilot) => pilot.id === selectedId && pilot.status !== "scaled_up") ??
    configurable[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FlaskConical className="size-4.5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Controlled Sandbox & Pilot Design Studio
            </h2>
            <p className="text-sm text-muted-foreground">
              Configure risk parameters, synthetic test data boundaries and rollback protocols
              before opening live testing.
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <ShieldCheck className="size-3" /> Risk Isolation
        </Badge>
      </div>

      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <Plus className="size-4" /> Sandbox Configuration Pillars
        </h3>
        <Card className="mb-4 flex flex-wrap items-end gap-3">
          <CardContent>
            <Label className="text-xs font-semibold text-muted-foreground">Select Pilot</Label>
            <select
              value={selectedPilot?.id ?? ""}
              onChange={(event) => setSelectedId(event.target.value)}
              className={`${selectClass} mt-1 sm:w-96`}
            >
              {configurable.map((pilot) => (
                <option key={pilot.id} value={pilot.id}>
                  {pilot.startup_name} · {pilot.environment}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {selectedPilot ? (
          <SandboxConfigForm key={selectedPilot.id} pilot={selectedPilot} onLock={onLock} />
        ) : (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No active pilots to configure yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}