"use client";

import { CheckCircle2, Landmark, Lock, Wallet, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export type EscrowTransaction = {
  id: string;
  amount: number;
  tx_hash: string;
  status: "pending" | "disbursed" | "failed";
  disbursed_at: string;
};

export type EscrowState = {
  vault_balance: number;
  total_disbursed: number;
  total_allocated: number;
  transactions: EscrowTransaction[];
};

const inr = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const STATUS_META: Record<EscrowTransaction["status"], { label: string; className: string }> = {
  disbursed: {
    label: "Disbursed",
    className:
      "border-emerald-600/30 text-emerald-700 dark:text-emerald-300",
  },
  pending: {
    label: "Pending",
    className: "border-amber-600/30 text-amber-700 dark:text-amber-300",
  },
  failed: {
    label: "Failed",
    className: "border-rose-600/30 text-rose-700 dark:text-rose-300",
  },
};

const shortDate = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function EscrowDrawer({
  open,
  onClose,
  escrow,
}: {
  open: boolean;
  onClose: () => void;
  escrow: EscrowState;
}) {
  if (!open) return null;

  const disbursedRatio =
    escrow.total_allocated > 0
      ? Math.min(100, Math.round((escrow.total_disbursed / escrow.total_allocated) * 100))
      : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close escrow drawer"
        className="absolute inset-0"
        onClick={onClose}
      />
      <aside className="fixed right-0 top-0 z-10 flex h-full w-[26rem] max-w-full animate-in flex-col border-l border-border bg-background shadow-2xl slide-in-from-right duration-300">
        <header className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <Landmark className="size-4 text-emerald-500" /> Smart Escrow Vault
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Milestone-linked disbursements · GFR 173(i)
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
        </header>

        <div className="border-b border-border p-5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Vault Balance (Held)
          </p>
          <p className="mt-1 font-mono text-3xl font-black tracking-tight">
            {inr(escrow.vault_balance)}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-muted/60 p-3">
              <p className="text-muted-foreground">Allocated</p>
              <p className="mt-0.5 font-mono font-bold">
                {inr(escrow.total_allocated)}
              </p>
            </div>
            <div className="rounded-xl bg-muted/60 p-3">
              <p className="text-muted-foreground">Disbursed</p>
              <p className="mt-0.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {inr(escrow.total_disbursed)}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
              <span>Disbursement coverage</span>
              <span>{disbursedRatio}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${disbursedRatio}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <h4 className="mb-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Payout Trail ({escrow.transactions.length})
          </h4>
          {escrow.transactions.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              <Wallet className="size-6 opacity-60" />
              No disbursements recorded yet.
              <span className="text-xs">
                Approving a scale-up releases the pilot&apos;s escrow tranche here.
              </span>
            </div>
          ) : (
            <ul className="space-y-3">
              {escrow.transactions.map((tx) => {
                const meta = STATUS_META[tx.status];
                return (
                  <li
                    key={tx.id}
                    className="rounded-xl border border-border p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                        <CheckCircle2 className="size-4 text-emerald-500" />
                        Milestone Payout
                      </span>
                      <span className="font-mono font-bold">{inr(tx.amount)}</span>
                    </div>
                    <div className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                      {tx.tx_hash}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        {shortDate(tx.disbursed_at)}
                      </span>
                      <Badge variant="outline" className={meta.className}>
                        {meta.label}
                      </Badge>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="border-t border-border p-4">
          <p className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Lock className="size-3.5" /> Tranche funds held by escrow trustee and
            released only on verified milestone sign-off.
          </p>
        </footer>
      </aside>
    </div>
  );
}