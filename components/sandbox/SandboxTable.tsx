"use client";

import { Boxes } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import type { SandboxPilot } from "@/lib/sandbox";

const currency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function SandboxStateBadge({ status }: { status: SandboxPilot["status"] }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-bold text-indigo-400">
        <span className="size-1.5 rounded-full bg-indigo-400" /> Sandbox Isolated
      </span>
    );
  }
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-500">
        <span className="size-1.5 rounded-full bg-amber-500" /> Awaiting Scale-Up Review
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-500">
      <span className="size-1.5 rounded-full bg-emerald-500" /> Sandbox Released · Scaled-Up
    </span>
  );
}

export default function SandboxTable({ pilots }: { pilots: SandboxPilot[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Boxes className="size-4" /> Active Controlled Sandboxes & Isolation Parameters
        </CardTitle>
        <CardDescription>
          Real-time isolation controls active across participating state startups.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {pilots.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No sandbox pilots are active yet.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Startup &amp; Pilot</th>
                <th className="pb-3 pr-4 font-medium">Testing Environment</th>
                <th className="pb-3 pr-4 font-medium">Data Privacy Protocol</th>
                <th className="pb-3 pr-4 font-medium">Risk Stop-Loss Limit</th>
                <th className="pb-3 pr-4 font-medium">IP Retainment</th>
                <th className="pb-3 pr-4 font-medium">Escrow Tranche</th>
                <th className="pb-3 text-right font-medium">Sandbox State</th>
              </tr>
            </thead>
            <tbody>
              {pilots.map((pilot) => (
                <tr
                  key={pilot.id}
                  className="border-b border-border/60 align-top last:border-0"
                >
                  <td className="py-3.5 pr-4">
                    <div className="font-medium">{pilot.startup_name}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">
                      PL-{pilot.id.slice(0, 8).toUpperCase()}
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 font-medium text-foreground">
                    {pilot.environment}
                  </td>
                  <td className="py-3.5 pr-4 text-muted-foreground">
                    {pilot.data_privacy}
                  </td>
                  <td className="py-3.5 pr-4 font-medium text-amber-600 dark:text-amber-400">
                    {pilot.stop_loss}
                  </td>
                  <td className="py-3.5 pr-4 font-semibold text-emerald-700 dark:text-emerald-400">
                    {pilot.ip_retainment}
                  </td>
                  <td className="py-3.5 pr-4 text-muted-foreground">
                    {currency(pilot.tranche_amount)}
                  </td>
                  <td className="py-3.5 text-right">
                    <SandboxStateBadge status={pilot.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}